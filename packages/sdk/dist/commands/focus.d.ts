import type { CommandPayload, CommandResult } from "@frontend-ui-command-sdk/shared";
/**
 * Focus command handler.
 *
 * Calls .focus() on the target element while respecting accessibility best practices.
 * Only attempts to focus elements that are naturally focusable or have tabindex.
 *
 * @param payload - Command payload with elementId
 * @returns Promise<CommandResult> indicating success or warnings
 */
export declare function handleFocus(payload: CommandPayload): Promise<CommandResult>;
//# sourceMappingURL=focus.d.ts.map