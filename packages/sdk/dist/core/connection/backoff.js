"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBackoffDelayMs = getBackoffDelayMs;
exports.getDefaultDelaysMs = getDefaultDelaysMs;
const DEFAULT_DELAYS_MS = [1000, 2000, 3000];
/**
 * Compute the delay for a given reconnection attempt using a capped exponential
 * backoff policy (1s → 2s → 3s and then 3s for subsequent attempts).
 *
 * @param attempt Zero-based reconnection attempt counter.
 * @param customDelays Optional override for the sequence of delays.
 */
function getBackoffDelayMs(attempt, customDelays) {
    const delays = customDelays && customDelays.length > 0 ? customDelays : DEFAULT_DELAYS_MS;
    const index = Math.min(Math.max(attempt, 0), delays.length - 1);
    return delays[index];
}
function getDefaultDelaysMs() {
    return DEFAULT_DELAYS_MS;
}
//# sourceMappingURL=backoff.js.map