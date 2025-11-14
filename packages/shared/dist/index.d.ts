export declare const SHARED_PLACEHOLDER = "shared-types-placeholder";
export type CommandStatus = "ok" | "error";
/**
 * Core payload shape used for streaming UI commands over WebSocket.
 *
 * This intentionally stays flexible: only `command` is required, the rest
 * (elementId, payload, requestId) are optional and story-specific.
 */
export interface CommandPayload {
    /**
     * Command identifier understood by the dispatcher.
     */
    command: string;
    /**
     * Optional UI element identifier the command targets.
     */
    elementId?: string;
    /**
     * Opaque payload forwarded without mutation by the connection layer.
     */
    payload?: unknown;
    /**
     * Correlation identifier for tracking command/response lifecycle.
     */
    requestId?: string;
}
/**
 * Structured result used for logging command and connection outcomes.
 */
export interface CommandResult {
    status: CommandStatus;
    /**
     * May be absent for low-level connection issues before a requestId is known.
     */
    requestId?: string;
    /**
     * Human-readable description suitable for demo UI display.
     */
    details: string;
    /**
     * Epoch millis timestamp when the result was produced.
     */
    timestamp: number;
    /**
     * Origin of the result (e.g., connection, dispatcher, ui).
     */
    source?: "connection" | "dispatcher" | "ui" | string;
}
//# sourceMappingURL=index.d.ts.map