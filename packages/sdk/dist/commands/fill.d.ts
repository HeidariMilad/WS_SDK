import type { CommandPayload, CommandResult } from "@frontend-ui-command-sdk/shared";
/**
 * Options for the fill command.
 */
export interface FillOptions {
    value: string;
}
/**
 * Fill command handler.
 *
 * Sets the value of input or textarea elements and dispatches input and change events
 * to ensure React/Next.js state updates correctly and event handlers are triggered.
 *
 * Payload format:
 * - `payload.options.value`: string (required) - The value to set
 *
 * @param payload - Command payload with elementId and value
 * @returns Promise<CommandResult> indicating success or warnings
 */
export declare function handleFill(payload: CommandPayload): Promise<CommandResult>;
//# sourceMappingURL=fill.d.ts.map