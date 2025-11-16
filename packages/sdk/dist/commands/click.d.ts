import type { CommandPayload, CommandResult } from "@frontend-ui-command-sdk/shared";
/**
 * Options for the click command.
 */
export interface ClickOptions {
    button?: number;
    shiftKey?: boolean;
    ctrlKey?: boolean;
    altKey?: boolean;
    metaKey?: boolean;
}
/**
 * Click command handler.
 *
 * Dispatches realistic pointer events (mousedown → mouseup → click) on the target element
 * to simulate user interaction, ensuring event handlers and state updates are triggered.
 *
 * Payload format:
 * - `payload.options.button`: number (0=left, 1=middle, 2=right, default: 0)
 * - `payload.options.shiftKey`: boolean (default: false)
 * - `payload.options.ctrlKey`: boolean (default: false)
 * - `payload.options.altKey`: boolean (default: false)
 * - `payload.options.metaKey`: boolean (default: false)
 *
 * @param payload - Command payload with elementId
 * @returns Promise<CommandResult> indicating success or warnings
 */
export declare function handleClick(payload: CommandPayload): Promise<CommandResult>;
//# sourceMappingURL=click.d.ts.map