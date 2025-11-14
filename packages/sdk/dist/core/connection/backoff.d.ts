/**
 * Compute the delay for a given reconnection attempt using a capped exponential
 * backoff policy (1s → 2s → 3s and then 3s for subsequent attempts).
 *
 * @param attempt Zero-based reconnection attempt counter.
 * @param customDelays Optional override for the sequence of delays.
 */
export declare function getBackoffDelayMs(attempt: number, customDelays?: readonly number[]): number;
export declare function getDefaultDelaysMs(): readonly number[];
//# sourceMappingURL=backoff.d.ts.map