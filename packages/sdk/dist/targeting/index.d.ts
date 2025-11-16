import type { TargetResolutionResult, TargetingInput } from "./types";
export * from "./types";
/**
 * Resolve an element by data-elementid attribute with retry logic.
 * Attempts up to `retries` times with `intervalMs` delay between attempts.
 *
 * @param elementId - The value of the data-elementid attribute to search for.
 * @param options - Retry configuration (defaults: 5 retries, 100ms interval).
 * @returns TargetResolutionResult with element or warnings.
 */
export declare function resolveTargetByDataElementId(elementId: string, options?: {
    retries?: number;
    intervalMs?: number;
}): Promise<TargetResolutionResult>;
/**
 * Resolve an element by CSS selector with retry logic.
 * Attempts up to `retries` times with `intervalMs` delay between attempts.
 *
 * @param selector - CSS selector string.
 * @param options - Retry configuration (defaults: 5 retries, 100ms interval).
 * @returns TargetResolutionResult with element or warnings.
 */
export declare function resolveTargetBySelector(selector: string, options?: {
    retries?: number;
    intervalMs?: number;
}): Promise<TargetResolutionResult>;
/**
 * Unified target resolver supporting both data-elementid and selector fallback.
 *
 * Precedence rules:
 * 1. If `elementId` is provided, attempt resolution by data-elementid first.
 * 2. If that fails and `selector` is provided, attempt resolution by selector.
 * 3. If neither resolves, return null with appropriate warnings.
 *
 * Both resolution methods use the same retry strategy (5 attempts × 100ms by default).
 *
 * @param input - Targeting input with elementId, selector, and optional retry config.
 * @returns TargetResolutionResult with element or warnings.
 */
export declare function resolveTarget(input: TargetingInput): Promise<TargetResolutionResult>;
//# sourceMappingURL=index.d.ts.map