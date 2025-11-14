import type { CommandPayload, CommandResult } from "@frontend-ui-command-sdk/shared";
import type { LoggingBus } from "../../logging/loggingBus";

export type ConnectionStatus = "connecting" | "connected" | "reconnecting" | "offline";

export interface ConnectionState {
  status: ConnectionStatus;
  /** Number of reconnection attempts since the last successful connection. */
  retryCount: number;
  /** Last error seen by the connection layer, if any. */
  lastError?: Error;
}

export interface WebSocketLike {
  readonly readyState: number;
  readonly CONNECTING: number;
  readonly OPEN: number;
  readonly CLOSING: number;
  readonly CLOSED: number;

  onopen: ((event: unknown) => void) | null;
  onclose: ((event: { code?: number; reason?: string }) => void) | null;
  onerror: ((event: unknown) => void) | null;
  onmessage: ((event: { data: unknown }) => void) | null;

  close(code?: number, reason?: string): void;
  send(data: string): void;
}

export interface ConnectionConfig {
  /** WebSocket endpoint URL. */
  url: string;
  /**
   * Delays (in ms) used for reconnection attempts.
   * Defaults to [1000, 2000, 3000] matching the story's 1s → 2s → 3s cap.
   */
  reconnectDelaysMs?: number[];
  /** Optional logger; defaults to the global logging bus. */
  loggingBus?: LoggingBus;
  /**
   * Factory used to create WebSocket instances; if omitted, the global
   * `WebSocket` implementation is used when present.
   */
  webSocketFactory?: (url: string) => WebSocketLike;
  /**
   * Function to determine online/offline status.
   *
   * Defaults to `navigator.onLine` when available, otherwise always true.
   */
  isOnline?: () => boolean;
}

export interface ConnectionEvents {
  /** Called whenever connection status changes. */
  onStatusChange?: (state: ConnectionState) => void;
  /** Called when a valid CommandPayload is received. */
  onCommand?: (payload: CommandPayload) => void;
  /** Called when a connection-level error occurs. */
  onError?: (result: CommandResult) => void;
}

export type ConnectionOptions = ConnectionConfig & ConnectionEvents;
