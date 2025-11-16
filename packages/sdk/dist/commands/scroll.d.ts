import type { CommandPayload, CommandResult } from "@frontend-ui-command-sdk/shared";
/**
 * Options for the scroll command.
 */
export interface ScrollOptions {
    behavior?: ScrollBehavior;
    block?: ScrollLogicalPosition;
    inline?: ScrollLogicalPosition;
}
/**
 * Scroll command handler.
 *
 * Brings the target element into view using scrollIntoView with smooth scrolling.
 * Respects prefers-reduced-motion and prevents duplicate scroll calls within a short timeframe.
 *
 * Payload format:
 * - `payload.options.behavior`: "smooth" | "auto" (default: "smooth", respects prefers-reduced-motion)
 * - `payload.options.block`: ScrollLogicalPosition (default: "center")
 * - `payload.options.inline`: ScrollLogicalPosition (default: "nearest")
 *
 * @param payload - Command payload with elementId
 * @returns Promise<CommandResult> indicating success or warnings
 */
export declare function handleScroll(payload: CommandPayload): Promise<CommandResult>;
//# sourceMappingURL=scroll.d.ts.map