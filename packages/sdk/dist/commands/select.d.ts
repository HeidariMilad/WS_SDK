import type { CommandPayload, CommandResult } from "@frontend-ui-command-sdk/shared";
/**
 * Options for the select command.
 */
export interface SelectOptions {
    value?: string;
    index?: number;
    label?: string;
}
/**
 * Select command handler.
 *
 * Updates select/dropdown elements by value, index, or label, dispatching
 * appropriate input and change events to trigger React/Next.js state updates.
 *
 * Payload format:
 * - `payload.options.value`: string - Select option by value attribute
 * - `payload.options.index`: number - Select option by index
 * - `payload.options.label`: string - Select option by text label
 *
 * At least one of value, index, or label must be provided.
 *
 * @param payload - Command payload with elementId and selection criteria
 * @returns Promise<CommandResult> indicating success or warnings
 */
export declare function handleSelect(payload: CommandPayload): Promise<CommandResult>;
//# sourceMappingURL=select.d.ts.map