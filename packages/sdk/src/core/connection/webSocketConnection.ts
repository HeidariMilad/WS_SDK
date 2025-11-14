import type { CommandPayload, CommandResult } from "@frontend-ui-command-sdk/shared";
import { globalLoggingBus, LoggingBus } from "../../logging/loggingBus";
import {
  ConnectionOptions,
  ConnectionState,
  ConnectionStatus,
  WebSocketLike,
} from "./types";
import { getBackoffDelayMs, getDefaultDelaysMs } from "./backoff";

/**
 * WebSocket-backed connection client used by the SDK and demo app.
 *
 * Responsibilities:
 * - Manage WebSocket lifecycle (connect, disconnect, status events).
 * - Perform exponential backoff reconnection with a 3s cap.
 * - Surface status changes and errors via callbacks and the logging bus.
 * - Parse incoming messages into CommandPayload objects.
 */
export class WebSocketConnection {
  private socket: WebSocketLike | null = null;
  private state: ConnectionState = { status: "offline", retryCount: 0 };
  private reconnectAttempt = 0;
  private reconnectTimeoutId: ReturnType<typeof setTimeout> | null = null;
  private readonly delays: readonly number[];
  private readonly loggingBus: LoggingBus;
  private readonly isOnline: () => boolean;
  private manualDisconnect = false;

  private readonly statusListeners = new Set<(state: ConnectionState) => void>();
  private readonly commandListeners = new Set<(payload: CommandPayload) => void>();
  private readonly errorListeners = new Set<(result: CommandResult) => void>();

  constructor(private readonly options: ConnectionOptions) {
    this.delays = options.reconnectDelaysMs ?? getDefaultDelaysMs();
    this.loggingBus = options.loggingBus ?? globalLoggingBus;
    this.isOnline = options.isOnline ?? defaultIsOnline;
  }

  /**
   * Initiate or re-initiate the WebSocket connection.
   */
  connect(): void {
    this.manualDisconnect = false;
    this.clearReconnectTimeout();
    this.openWebSocket();
  }

  /**
   * Cleanly close the connection and disable automatic reconnection.
   */
  disconnect(opts: { reason?: string } = {}): void {
    this.manualDisconnect = true;
    this.clearReconnectTimeout();

    if (this.socket && this.socket.readyState === this.socket.OPEN) {
      this.socket.close(1000, opts.reason ?? "Client disconnect");
    }

    this.updateState("offline");
  }

  /**
   * Send a command over the active WebSocket connection.
   */
  sendCommand(payload: CommandPayload): void {
    if (!this.socket || this.socket.readyState !== this.socket.OPEN) {
      this.logError("Connection is not open; cannot send command", payload.requestId);
      return;
    }

    this.socket.send(JSON.stringify(payload));
  }

  subscribeStatus(listener: (state: ConnectionState) => void): () => void {
    this.statusListeners.add(listener);
    // Immediately provide current state so UI can render without waiting.
    listener(this.state);
    return () => {
      this.statusListeners.delete(listener);
    };
  }

  subscribeCommands(listener: (payload: CommandPayload) => void): () => void {
    this.commandListeners.add(listener);
    return () => {
      this.commandListeners.delete(listener);
    };
  }

  subscribeErrors(listener: (result: CommandResult) => void): () => void {
    this.errorListeners.add(listener);
    return () => {
      this.errorListeners.delete(listener);
    };
  }

  getState(): ConnectionState {
    return this.state;
  }

  private openWebSocket(): void {
    if (!this.isOnline()) {
      // Respect offline conditions by not attempting to connect immediately.
      this.scheduleReconnect(new Error("Offline; delaying initial connect"));
      return;
    }

    const factory = this.options.webSocketFactory ?? getDefaultWebSocketFactory();
    let socket: WebSocketLike;

    try {
      socket = factory(this.options.url);
    } catch (error) {
      this.handleError(error instanceof Error ? error : new Error("Failed to create WebSocket"));
      this.scheduleReconnect(error instanceof Error ? error : new Error("Failed to create WebSocket"));
      return;
    }

    this.socket = socket;
    this.updateState("connecting");

    socket.onopen = () => {
      this.reconnectAttempt = 0;
      this.updateState("connected");
    };

    socket.onclose = (event) => {
      const closeError = new Error(
        `WebSocket closed: code=${"code" in event && event.code !== undefined ? event.code : "n/a"} reason=${
          "reason" in event && event.reason ? event.reason : ""
        }`,
      );
      this.handleClose(closeError);
    };

    socket.onerror = () => {
      const error = new Error("WebSocket error");
      this.handleError(error);
    };

    socket.onmessage = (event) => {
      this.handleMessage(event.data);
    };
  }

  private handleClose(error: Error): void {
    if (this.manualDisconnect) {
      this.updateState("offline", error);
      return;
    }

    // When offline, do not hammer reconnect attempts; keep status offline but
    // still schedule periodic checks using the capped backoff delay.
    if (!this.isOnline()) {
      this.updateState("offline", error);
      this.scheduleReconnect(error);
      return;
    }

    this.scheduleReconnect(error);
  }

  private handleError(error: Error): void {
    const result = this.createErrorResult(error);

    this.loggingBus.log({
      severity: "error",
      category: "connection",
      message: result.details,
      result,
    });

    this.options.onError?.(result);
    for (const listener of this.errorListeners) {
      listener(result);
    }
  }

  private handleMessage(rawData: unknown): void {
    let parsed: unknown = rawData;

    if (typeof rawData === "string") {
      try {
        parsed = JSON.parse(rawData);
      } catch {
        this.logUnhandledMessage(rawData, "Invalid JSON payload");
        return;
      }
    }

    if (!isCommandPayload(parsed)) {
      this.logUnhandledMessage(parsed, "Payload does not match CommandPayload shape");
      return;
    }

    const payload: CommandPayload = parsed;

    // Forward to dispatcher-style callback first.
    this.options.onCommand?.(payload);

    // Then notify any additional subscribers.
    for (const listener of this.commandListeners) {
      listener(payload);
    }
  }

  private scheduleReconnect(error: Error): void {
    this.clearReconnectTimeout();

    const attempt = this.reconnectAttempt++;
    const delay = getBackoffDelayMs(attempt, this.delays);

    this.updateState("reconnecting", error);

    this.loggingBus.log({
      severity: "info",
      category: "connection",
      message: `Reconnecting in ${delay}ms (attempt #${attempt + 1})`,
      result: this.createErrorResult(error),
    });

    this.reconnectTimeoutId = setTimeout(() => {
      if (this.manualDisconnect) {
        return;
      }

      if (!this.isOnline()) {
        // Remain offline but keep retrying at the capped interval.
        this.scheduleReconnect(new Error("Still offline; retrying"));
        return;
      }

      this.openWebSocket();
    }, delay);
  }

  private clearReconnectTimeout(): void {
    if (this.reconnectTimeoutId !== null) {
      clearTimeout(this.reconnectTimeoutId);
      this.reconnectTimeoutId = null;
    }
  }

  private updateState(status: ConnectionStatus, error?: Error): void {
    const retryCount = status === "connected" ? 0 : this.state.retryCount;

    this.state = {
      status,
      retryCount,
      lastError: error ?? this.state.lastError,
    };

    this.options.onStatusChange?.(this.state);

    for (const listener of this.statusListeners) {
      listener(this.state);
    }

    this.loggingBus.log({
      severity: "info",
      category: "connection",
      message: `Connection status changed to ${status}`,
      metadata: { retryCount: this.state.retryCount },
    });
  }

  private logUnhandledMessage(raw: unknown, reason: string): void {
    this.loggingBus.log({
      severity: "warning",
      category: "command",
      message: `UNHANDLED_COMMAND: ${reason}`,
      metadata: { raw },
    });
  }

  private logError(message: string, requestId?: string): void {
    const error = new Error(message);
    const result = this.createErrorResult(error, requestId);

    this.loggingBus.log({
      severity: "error",
      category: "connection",
      message,
      result,
    });

    this.options.onError?.(result);
    for (const listener of this.errorListeners) {
      listener(result);
    }
  }

  private createErrorResult(error: Error, requestId?: string): CommandResult {
    return {
      status: "error",
      requestId,
      details: error.message,
      timestamp: Date.now(),
      source: "connection",
    };
  }
}

function isCommandPayload(value: unknown): value is CommandPayload {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const candidate = value as { command?: unknown };
  return typeof candidate.command === "string";
}

function defaultIsOnline(): boolean {
  const global = globalThis as unknown as { navigator?: { onLine?: boolean } };
  if (global.navigator && typeof global.navigator.onLine === "boolean") {
    return global.navigator.onLine;
  }
  return true;
}

function getDefaultWebSocketFactory(): (url: string) => WebSocketLike {
  const global = globalThis as unknown as { WebSocket?: new (url: string) => unknown };
  if (typeof global.WebSocket === "function") {
    return (url: string) => new global.WebSocket!(url) as unknown as WebSocketLike;
  }

  throw new Error(
    "No WebSocket implementation available. Provide `webSocketFactory` in ConnectionOptions when using the SDK outside the browser.",
  );
}
