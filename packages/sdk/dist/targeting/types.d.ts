/**
 * Warning emitted when target resolution fails or encounters issues.
 */
export interface TargetResolutionWarning {
    elementId?: string;
    selector?: string;
    reason: "not-found" | "invalid-selector" | "no-target-provided" | "multiple-matches";
}
/**
 * Result of attempting to resolve a target element.
 */
export interface TargetResolutionResult {
    element: HTMLElement | null;
    warnings: TargetResolutionWarning[];
}
/**
 * Input options for target resolution.
 */
export interface TargetingInput {
    elementId?: string;
    selector?: string | null;
    retries?: number;
    intervalMs?: number;
}
//# sourceMappingURL=types.d.ts.map