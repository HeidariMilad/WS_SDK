import type { CommandPayload, CommandResult } from "@frontend-ui-command-sdk/shared";
/**
 * Options for the highlight command.
 */
export interface HighlightOptions {
    color?: string;
    thickness?: number;
    duration?: number;
}
/**
 * Highlight command handler.
 *
 * Applies a visual glow or border to the resolved element for a configurable duration.
 * The highlight effect is automatically cleaned up after the duration expires.
 *
 * Payload format:
 * - `payload.options.color`: string (default: "#3b82f6")
 * - `payload.options.thickness`: number in pixels (default: 3)
 * - `payload.options.duration`: number in milliseconds (default: 400)
 *
 * @param payload - Command payload with elementId
 * @returns Promise<CommandResult> indicating success or warnings
 */
export declare function handleHighlight(payload: CommandPayload): Promise<CommandResult>;
//# sourceMappingURL=highlight.d.ts.map