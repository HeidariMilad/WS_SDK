import type { CommandPayload, CommandResult } from "@frontend-ui-command-sdk/shared";
import { globalLoggingBus } from "../logging/loggingBus";
import { resolveTarget } from "../targeting";

/**
 * Callback function that triggers a component refresh.
 * This is typically a React setState call or similar state update mechanism.
 */
export type RefreshCallback = () => void;

/**
 * Registry of refresh callbacks by element ID.
 * Components register themselves with their refresh logic.
 */
const refreshCallbacks = new Map<string, RefreshCallback[]>();

/**
 * Register a refresh callback for an element.
 * Multiple callbacks can be registered for the same element.
 *
 * @param elementId - Element identifier (data-elementid value)
 * @param callback - Function to call when refresh is triggered
 * @returns Cleanup function to unregister the callback
 */
export function registerRefreshCallback(
  elementId: string,
  callback: RefreshCallback
): () => void {
  const existing = refreshCallbacks.get(elementId) ?? [];
  existing.push(callback);
  refreshCallbacks.set(elementId, existing);

  return () => {
    const current = refreshCallbacks.get(elementId);
    if (!current) return;
    const index = current.indexOf(callback);
    if (index >= 0) {
      current.splice(index, 1);
    }
    if (current.length === 0) {
      refreshCallbacks.delete(elementId);
    }
  };
}

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
export async function handleRefreshElement(
  payload: CommandPayload
): Promise<CommandResult> {
  const timestamp = Date.now();

  // Validate elementId is provided
  if (!payload.elementId) {
    const result: CommandResult = {
      status: "warning",
      requestId: payload.requestId,
      details: "refresh_element command requires elementId",
      timestamp,
      source: "ui",
    };

    globalLoggingBus.log({
      severity: "warning",
      category: "command",
      message: result.details,
      metadata: { payload },
    });

    return result;
  }

  const elementId = payload.elementId;

  // Determine refresh method
  const data = (payload.payload as Record<string, unknown>) || {};
  const options = (data.options as Record<string, unknown>) || {};
  const method = (options.method as string) || "both";

  // Resolve target element
  const resolution = await resolveTarget({ elementId });

  // Handle callback-based refresh (works even if element not found in DOM)
  let callbacksInvoked = 0;
  if (method === "callback" || method === "both") {
    const callbacks = refreshCallbacks.get(elementId);
    if (callbacks && callbacks.length > 0) {
      callbacks.forEach((cb) => {
        try {
          cb();
          callbacksInvoked++;
        } catch (error) {
          globalLoggingBus.log({
            severity: "error",
            category: "command",
            message: "Refresh callback threw error",
            metadata: {
              elementId,
              error: error instanceof Error ? error.message : String(error),
            },
          });
        }
      });
    }
  }

  // Handle attribute-based refresh (requires element in DOM)
  let attributeToggled = false;
  if ((method === "attribute" || method === "both") && resolution.element) {
    try {
      const currentValue = resolution.element.getAttribute("data-refresh-key") || "0";
      const newValue = String(Number(currentValue) + 1);
      resolution.element.setAttribute("data-refresh-key", newValue);
      attributeToggled = true;
    } catch (error) {
      globalLoggingBus.log({
        severity: "error",
        category: "command",
        message: "Failed to toggle refresh attribute",
        metadata: {
          elementId,
          error: error instanceof Error ? error.message : String(error),
        },
      });
    }
  }

  // Build result based on what actually happened
  const actions: string[] = [];
  if (callbacksInvoked > 0) {
    actions.push(`${callbacksInvoked} callback(s)`);
  }
  if (attributeToggled) {
    actions.push("attribute toggled");
  }

  if (actions.length === 0) {
    // Nothing was refreshed - could be warning or just info
    const hasWarnings = resolution.warnings.length > 0;
    const result: CommandResult = {
      status: hasWarnings ? "warning" : "ok",
      requestId: payload.requestId,
      details: hasWarnings
        ? `Element '${elementId}' not found and no callbacks registered`
        : `No refresh actions needed for '${elementId}'`,
      timestamp,
      source: "ui",
      warnings: resolution.warnings,
    };

    globalLoggingBus.log({
      severity: hasWarnings ? "warning" : "info",
      category: "command",
      message: result.details,
      metadata: { payload, resolution },
    });

    return result;
  }

  // Success with actions taken
  const result: CommandResult = {
    status: resolution.warnings.length > 0 ? "warning" : "ok",
    requestId: payload.requestId,
    details: `Refreshed '${elementId}': ${actions.join(", ")}`,
    timestamp,
    source: "ui",
    warnings: resolution.warnings.length > 0 ? resolution.warnings : undefined,
  };

  globalLoggingBus.log({
    severity: "info",
    category: "command",
    message: `refresh_element command executed: ${elementId}`,
    metadata: {
      payload,
      actions,
      callbacksInvoked,
      attributeToggled,
      warnings: resolution.warnings,
    },
  });

  return result;
}
