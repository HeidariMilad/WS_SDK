import type { CommandPayload, CommandResult } from "@frontend-ui-command-sdk/shared";
/**
 * Options for the hover command.
 */
export interface HoverOptions {
    duration?: number;
}
/**
 * Hover command handler.
 *
 * Programmatically triggers hover behavior on the target element for a given duration.
 * Uses both event dispatching and CSS class toggling to simulate user hover.
 * Cleans up events and classes after the duration expires.
 *
 * Payload format:
 * - `payload.options.duration`: number in milliseconds (default: 1000)
 *
 * @param payload - Command payload with elementId
 * @returns Promise<CommandResult> indicating success or warnings
 */
export declare function handleHover(payload: CommandPayload): Promise<CommandResult>;
//# sourceMappingURL=hover.d.ts.map