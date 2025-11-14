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
export class LoggingBus {
  private readonly listeners = new Set<LogListener>();
  private readonly history: LogEntry[] = [];

  constructor(private readonly maxHistory: number = 200) {}

  /**
   * Emit a log entry and notify all subscribers.
   */
  log(partial: Omit<LogEntry, "id" | "timestamp">): LogEntry {
    const entry: LogEntry = {
      ...partial,
      id: this.createId(),
      timestamp: Date.now(),
    };

    this.history.push(entry);
    if (this.history.length > this.maxHistory) {
      this.history.splice(0, this.history.length - this.maxHistory);
    }

    for (const listener of this.listeners) {
      try {
        listener(entry);
      } catch {
        // Listeners are user-land; never let them break the bus.
      }
    }

    return entry;
  }

  /**
   * Subscribe to log entries; returns an unsubscribe function.
   */
  subscribe(listener: LogListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Read the current in-memory history (most recent last).
   */
  getHistory(): ReadonlyArray<LogEntry> {
    return this.history;
  }

  clearHistory(): void {
    this.history.length = 0;
  }

  private createId(): string {
    return Math.random().toString(36).slice(2) + Date.now().toString(36);
  }
}

/**
 * Default global logging bus used by the connection module and demo UI.
 */
export const globalLoggingBus = new LoggingBus();
