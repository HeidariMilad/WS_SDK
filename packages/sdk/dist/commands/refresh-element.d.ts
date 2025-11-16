import type { CommandPayload, CommandResult } from "@frontend-ui-command-sdk/shared";
/**
 * Callback function that triggers a component refresh.
 * This is typically a React setState call or similar state update mechanism.
 */
export type RefreshCallback = () => void;
/**
 * Register a refresh callback for an element.
 * Multiple callbacks can be registered for the same element.
 *
 * @param elementId - Element identifier (data-elementid value)
 * @param callback - Function to call when refresh is triggered
 * @returns Cleanup function to unregister the callback
 */
export declare function registerRefreshCallback(elementId: string, callback: RefreshCallback): () => void;
/**
 * Refresh element command handler.
 *
 * Triggers a lightweight re-render of the targeted component by:
 * 1. Resolving the target element using the targeting utility
 * 2. Invoking registered refresh callbacks for that element
 * 3. Optionally toggling a data attribute to trigger CSS transitions
 *
 * The operation is idempotent and does not destroy component state.
 *
 * Payload format:
 * - `payload.options.method`: "callback" | "attribute" | "both" (default: "both")
 *
 * @param payload - Command payload with elementId
 * @returns Promise<CommandResult> indicating success or warnings
 */
export declare function handleRefreshElement(payload: CommandPayload): Promise<CommandResult>;
//# sourceMappingURL=refresh-element.d.ts.map