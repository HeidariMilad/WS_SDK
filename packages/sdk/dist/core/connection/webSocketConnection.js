"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebSocketConnection = void 0;
const loggingBus_1 = require("../../logging/loggingBus");
const backoff_1 = require("./backoff");
/**
 * WebSocket-backed connection client used by the SDK and demo app.
 *
 * Responsibilities:
 * - Manage WebSocket lifecycle (connect, disconnect, status events).
 * - Perform exponential backoff reconnection with a 3s cap.
 * - Surface status changes and errors via callbacks and the logging bus.
 * - Parse incoming messages into CommandPayload objects.
 */
class WebSocketConnection {
    constructor(options) {
        this.options = options;
        this.socket = null;
        this.state = { status: "offline", retryCount: 0 };
        this.reconnectAttempt = 0;
        this.reconnectTimeoutId = null;
        this.manualDisconnect = false;
        this.statusListeners = new Set();
        this.commandListeners = new Set();
        this.errorListeners = new Set();
        this.delays = options.reconnectDelaysMs ?? (0, backoff_1.getDefaultDelaysMs)();
        this.loggingBus = options.loggingBus ?? loggingBus_1.globalLoggingBus;
        this.isOnline = options.isOnline ?? defaultIsOnline;
    }
    /**
     * Initiate or re-initiate the WebSocket connection.
     */
    connect() {
        this.manualDisconnect = false;
        this.clearReconnectTimeout();
        this.openWebSocket();
    }
    /**
     * Cleanly close the connection and disable automatic reconnection.
     */
    disconnect(opts = {}) {
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
    sendCommand(payload) {
        if (!this.socket || this.socket.readyState !== this.socket.OPEN) {
            this.logError("Connection is not open; cannot send command", payload.requestId);
            return;
        }
        this.socket.send(JSON.stringify(payload));
    }
    subscribeStatus(listener) {
        this.statusListeners.add(listener);
        // Immediately provide current state so UI can render without waiting.
        listener(this.state);
        return () => {
            this.statusListeners.delete(listener);
        };
    }
    subscribeCommands(listener) {
        this.commandListeners.add(listener);
        return () => {
            this.commandListeners.delete(listener);
        };
    }
    subscribeErrors(listener) {
        this.errorListeners.add(listener);
        return () => {
            this.errorListeners.delete(listener);
        };
    }
    getState() {
        return this.state;
    }
    openWebSocket() {
        if (!this.isOnline()) {
            // Respect offline conditions by not attempting to connect immediately.
            this.scheduleReconnect(new Error("Offline; delaying initial connect"));
            return;
        }
        const factory = this.options.webSocketFactory ?? getDefaultWebSocketFactory();
        let socket;
        try {
            socket = factory(this.options.url);
        }
        catch (error) {
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
            const closeError = new Error(`WebSocket closed: code=${"code" in event && event.code !== undefined ? event.code : "n/a"} reason=${"reason" in event && event.reason ? event.reason : ""}`);
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
    handleClose(error) {
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
    handleError(error) {
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
    handleMessage(rawData) {
        let parsed = rawData;
        if (typeof rawData === "string") {
            try {
                parsed = JSON.parse(rawData);
            }
            catch {
                this.logUnhandledMessage(rawData, "Invalid JSON payload");
                return;
            }
        }
        if (!isCommandPayload(parsed)) {
            this.logUnhandledMessage(parsed, "Payload does not match CommandPayload shape");
            return;
        }
        const payload = parsed;
        // Forward to dispatcher-style callback first.
        this.options.onCommand?.(payload);
        // Then notify any additional subscribers.
        for (const listener of this.commandListeners) {
            listener(payload);
        }
    }
    scheduleReconnect(error) {
        this.clearReconnectTimeout();
        const attempt = this.reconnectAttempt++;
        const delay = (0, backoff_1.getBackoffDelayMs)(attempt, this.delays);
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
    clearReconnectTimeout() {
        if (this.reconnectTimeoutId !== null) {
            clearTimeout(this.reconnectTimeoutId);
            this.reconnectTimeoutId = null;
        }
    }
    updateState(status, error) {
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
    logUnhandledMessage(raw, reason) {
        this.loggingBus.log({
            severity: "warning",
            category: "command",
            message: `UNHANDLED_COMMAND: ${reason}`,
            metadata: { raw },
        });
    }
    logError(message, requestId) {
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
    createErrorResult(error, requestId) {
        return {
            status: "error",
            requestId,
            details: error.message,
            timestamp: Date.now(),
            source: "connection",
        };
    }
}
exports.WebSocketConnection = WebSocketConnection;
function isCommandPayload(value) {
    if (typeof value !== "object" || value === null) {
        return false;
    }
    const candidate = value;
    return typeof candidate.command === "string";
}
function defaultIsOnline() {
    const global = globalThis;
    if (global.navigator && typeof global.navigator.onLine === "boolean") {
        return global.navigator.onLine;
    }
    return true;
}
function getDefaultWebSocketFactory() {
    const global = globalThis;
    if (typeof global.WebSocket === "function") {
        return (url) => new global.WebSocket(url);
    }
    throw new Error("No WebSocket implementation available. Provide `webSocketFactory` in ConnectionOptions when using the SDK outside the browser.");
}
//# sourceMappingURL=webSocketConnection.js.map