import type { TargetResolutionWarning } from "@frontend-ui-command-sdk/shared";
/**
 * Build a human-readable warning message from target resolution warnings.
 *
 * @param warnings - Array of TargetResolutionWarning objects.
 * @returns A user-friendly message describing the targeting failure.
 */
export declare function buildWarningMessage(warnings: TargetResolutionWarning[]): string;
/**
 * Check if element should be targeted and return actionable guidance.
 *
 * @param warnings - Array of TargetResolutionWarning objects.
 * @returns User-facing guidance for fixing targeting issues.
 */
export declare function getTargetingGuidance(warnings: TargetResolutionWarning[]): string;
//# sourceMappingURL=utils.d.ts.map