import { CommandResult } from "@frontend-ui-command-sdk/shared";
export type LogSeverity = "debug" | "info" | "warning" | "error";
export interface LogEntry {
    id: string;
    timestamp: number;
    severity: LogSeverity;
    /** High-level category for filtering in the demo UI. */
    category: "connection" | "command" | "ui" | string;
    message: string;
    /** Optional structured result details for errors/warnings. */
    result?: CommandResult;
    /** Arbitrary metadata used by the demo app or adapters (e.g., Sentry). */
    metadata?: Record<string, unknown>;
}
export type LogListener = (entry: LogEntry) => void;
/**
 * Simple in-memory logging bus used by the SDK and demo app.
 *
 * - Maintains a capped history for timeline views.
 * - Exposes a subscribe API for the demo UI and monitoring adapters.
 */
export declare class LoggingBus {
    private readonly maxHistory;
    private readonly listeners;
    private readonly history;
    constructor(maxHistory?: number);
    /**
     * Emit a log entry and notify all subscribers.
     */
    log(partial: Omit<LogEntry, "id" | "timestamp">): LogEntry;
    /**
     * Subscribe to log entries; returns an unsubscribe function.
     */
    subscribe(listener: LogListener): () => void;
    /**
     * Read the current in-memory history (most recent last).
     */
    getHistory(): ReadonlyArray<LogEntry>;
    clearHistory(): void;
    private createId;
}
/**
 * Default global logging bus used by the connection module and demo UI.
 */
export declare const globalLoggingBus: LoggingBus;
//# sourceMappingURL=loggingBus.d.ts.map