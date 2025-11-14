"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalLoggingBus = exports.LoggingBus = void 0;
/**
 * Simple in-memory logging bus used by the SDK and demo app.
 *
 * - Maintains a capped history for timeline views.
 * - Exposes a subscribe API for the demo UI and monitoring adapters.
 */
class LoggingBus {
    constructor(maxHistory = 200) {
        this.maxHistory = maxHistory;
        this.listeners = new Set();
        this.history = [];
    }
    /**
     * Emit a log entry and notify all subscribers.
     */
    log(partial) {
        const entry = {
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
            }
            catch {
                // Listeners are user-land; never let them break the bus.
            }
        }
        return entry;
    }
    /**
     * Subscribe to log entries; returns an unsubscribe function.
     */
    subscribe(listener) {
        this.listeners.add(listener);
        return () => {
            this.listeners.delete(listener);
        };
    }
    /**
     * Read the current in-memory history (most recent last).
     */
    getHistory() {
        return this.history;
    }
    clearHistory() {
        this.history.length = 0;
    }
    createId() {
        return Math.random().toString(36).slice(2) + Date.now().toString(36);
    }
}
exports.LoggingBus = LoggingBus;
/**
 * Default global logging bus used by the connection module and demo UI.
 */
exports.globalLoggingBus = new LoggingBus();
//# sourceMappingURL=loggingBus.js.map