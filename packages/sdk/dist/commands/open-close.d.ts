import type { CommandPayload, CommandResult } from "@frontend-ui-command-sdk/shared";
/**
 * Options for open command.
 */
export interface OpenOptions {
    /** Type of component to open (e.g., "modal", "drawer", "panel") */
    type?: string;
    /** Additional data to pass to the component */
    data?: Record<string, unknown>;
}
/**
 * Open command handler.
 *
 * Opens modals, panels, or drawers by dispatching a custom "sdk-open" event
 * that host applications can listen for. The host app is responsible for
 * managing the actual UI state and accessibility.
 *
 * Payload format:
 * - `payload.options.type`: string - Type of component (modal/drawer/panel)
 * - `payload.options.data`: object - Data to pass to component
 *
 * @param payload - Command payload with elementId or component identifier
 * @returns Promise<CommandResult> indicating success or warnings
 */
export declare function handleOpen(payload: CommandPayload): Promise<CommandResult>;
/**
 * Close command handler.
 *
 * Closes modals, panels, or drawers by dispatching a custom "sdk-close" event
 * that host applications can listen for. The host app is responsible for
 * managing the actual UI state and accessibility.
 *
 * @param payload - Command payload with elementId or component identifier
 * @returns Promise<CommandResult> indicating success or warnings
 */
export declare function handleClose(payload: CommandPayload): Promise<CommandResult>;
//# sourceMappingURL=open-close.d.ts.map