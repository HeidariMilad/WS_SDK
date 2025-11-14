import type { CommandPayload, CommandResult } from "@frontend-ui-command-sdk/shared";
import { ConnectionOptions, ConnectionState } from "./types";
/**
 * WebSocket-backed connection client used by the SDK and demo app.
 *
 * Responsibilities:
 * - Manage WebSocket lifecycle (connect, disconnect, status events).
 * - Perform exponential backoff reconnection with a 3s cap.
 * - Surface status changes and errors via callbacks and the logging bus.
 * - Parse incoming messages into CommandPayload objects.
 */
export declare class WebSocketConnection {
    private readonly options;
    private socket;
    private state;
    private reconnectAttempt;
    private reconnectTimeoutId;
    private readonly delays;
    private readonly loggingBus;
    private readonly isOnline;
    private manualDisconnect;
    private readonly statusListeners;
    private readonly commandListeners;
    private readonly errorListeners;
    constructor(options: ConnectionOptions);
    /**
     * Initiate or re-initiate the WebSocket connection.
     */
    connect(): void;
    /**
     * Cleanly close the connection and disable automatic reconnection.
     */
    disconnect(opts?: {
        reason?: string;
    }): void;
    /**
     * Send a command over the active WebSocket connection.
     */
    sendCommand(payload: CommandPayload): void;
    subscribeStatus(listener: (state: ConnectionState) => void): () => void;
    subscribeCommands(listener: (payload: CommandPayload) => void): () => void;
    subscribeErrors(listener: (result: CommandResult) => void): () => void;
    getState(): ConnectionState;
    private openWebSocket;
    private handleClose;
    private handleError;
    private handleMessage;
    private scheduleReconnect;
    private clearReconnectTimeout;
    private updateState;
    private logUnhandledMessage;
    private logError;
    private createErrorResult;
}
//# sourceMappingURL=webSocketConnection.d.ts.map