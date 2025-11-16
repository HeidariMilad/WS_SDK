import type { CommandPayload, CommandResult } from "@frontend-ui-command-sdk/shared";
import { globalLoggingBus } from "../logging/loggingBus";
import { resolveTarget } from "../targeting";

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
export async function handleOpen(
  payload: CommandPayload
): Promise<CommandResult> {
  const timestamp = Date.now();

  // Parse options from payload
  const data = (payload.payload as Record<string, unknown>) || {};
  const options = (data.options as Partial<OpenOptions>) || {};

  // If elementId is provided, try to resolve and dispatch event on it
  if (payload.elementId) {
    const resolution = await resolveTarget({ elementId: payload.elementId });

    if (!resolution.element) {
      const result: CommandResult = {
        status: "warning",
        requestId: payload.requestId,
        details: `Element '${payload.elementId}' not found for open`,
        timestamp,
        source: "ui",
        warnings: resolution.warnings,
      };

      globalLoggingBus.log({
        severity: "warning",
        category: "command",
        message: result.details,
        metadata: { payload, resolution },
      });

      return result;
    }

    const element = resolution.element;

    try {
      // Dispatch custom event that host app can listen for
      const openEvent = new CustomEvent("sdk-open", {
        bubbles: true,
        detail: {
          type: options.type,
          data: options.data,
          elementId: payload.elementId,
        },
      });
      element.dispatchEvent(openEvent);

      const result: CommandResult = {
        status: resolution.warnings.length > 0 ? "warning" : "ok",
        requestId: payload.requestId,
        details: `Dispatched open event on '${payload.elementId}'${options.type ? ` (type: ${options.type})` : ""}`,
        timestamp,
        source: "ui",
        warnings: resolution.warnings.length > 0 ? resolution.warnings : undefined,
      };

      globalLoggingBus.log({
        severity: "info",
        category: "command",
        message: `open command executed: ${payload.elementId}`,
        metadata: {
          payload,
          options,
          warnings: resolution.warnings,
        },
      });

      return result;
    } catch (error) {
      const result: CommandResult = {
        status: "error",
        requestId: payload.requestId,
        details: `Open failed: ${error instanceof Error ? error.message : String(error)}`,
        timestamp,
        source: "ui",
      };

      globalLoggingBus.log({
        severity: "error",
        category: "command",
        message: "open command failed",
        metadata: {
          payload,
          error: error instanceof Error ? error.message : String(error),
        },
      });

      return result;
    }
  }

  // If no elementId, dispatch global event on document
  try {
    const openEvent = new CustomEvent("sdk-open", {
      bubbles: true,
      detail: {
        type: options.type,
        data: options.data,
      },
    });
    document.dispatchEvent(openEvent);

    const result: CommandResult = {
      status: "ok",
      requestId: payload.requestId,
      details: `Dispatched global open event${options.type ? ` (type: ${options.type})` : ""}`,
      timestamp,
      source: "ui",
    };

    globalLoggingBus.log({
      severity: "info",
      category: "command",
      message: "open command executed (global)",
      metadata: {
        payload,
        options,
      },
    });

    return result;
  } catch (error) {
    const result: CommandResult = {
      status: "error",
      requestId: payload.requestId,
      details: `Open failed: ${error instanceof Error ? error.message : String(error)}`,
      timestamp,
      source: "ui",
    };

    globalLoggingBus.log({
      severity: "error",
      category: "command",
      message: "open command failed",
      metadata: {
        payload,
        error: error instanceof Error ? error.message : String(error),
      },
    });

    return result;
  }
}

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
export async function handleClose(
  payload: CommandPayload
): Promise<CommandResult> {
  const timestamp = Date.now();

  // If elementId is provided, try to resolve and dispatch event on it
  if (payload.elementId) {
    const resolution = await resolveTarget({ elementId: payload.elementId });

    if (!resolution.element) {
      const result: CommandResult = {
        status: "warning",
        requestId: payload.requestId,
        details: `Element '${payload.elementId}' not found for close`,
        timestamp,
        source: "ui",
        warnings: resolution.warnings,
      };

      globalLoggingBus.log({
        severity: "warning",
        category: "command",
        message: result.details,
        metadata: { payload, resolution },
      });

      return result;
    }

    const element = resolution.element;

    try {
      // Dispatch custom event that host app can listen for
      const closeEvent = new CustomEvent("sdk-close", {
        bubbles: true,
        detail: {
          elementId: payload.elementId,
        },
      });
      element.dispatchEvent(closeEvent);

      const result: CommandResult = {
        status: resolution.warnings.length > 0 ? "warning" : "ok",
        requestId: payload.requestId,
        details: `Dispatched close event on '${payload.elementId}'`,
        timestamp,
        source: "ui",
        warnings: resolution.warnings.length > 0 ? resolution.warnings : undefined,
      };

      globalLoggingBus.log({
        severity: "info",
        category: "command",
        message: `close command executed: ${payload.elementId}`,
        metadata: {
          payload,
          warnings: resolution.warnings,
        },
      });

      return result;
    } catch (error) {
      const result: CommandResult = {
        status: "error",
        requestId: payload.requestId,
        details: `Close failed: ${error instanceof Error ? error.message : String(error)}`,
        timestamp,
        source: "ui",
      };

      globalLoggingBus.log({
        severity: "error",
        category: "command",
        message: "close command failed",
        metadata: {
          payload,
          error: error instanceof Error ? error.message : String(error),
        },
      });

      return result;
    }
  }

  // If no elementId, dispatch global event on document
  try {
    const closeEvent = new CustomEvent("sdk-close", {
      bubbles: true,
      detail: {},
    });
    document.dispatchEvent(closeEvent);

    const result: CommandResult = {
      status: "ok",
      requestId: payload.requestId,
      details: "Dispatched global close event",
      timestamp,
      source: "ui",
    };

    globalLoggingBus.log({
      severity: "info",
      category: "command",
      message: "close command executed (global)",
      metadata: {
        payload,
      },
    });

    return result;
  } catch (error) {
    const result: CommandResult = {
      status: "error",
      requestId: payload.requestId,
      details: `Close failed: ${error instanceof Error ? error.message : String(error)}`,
      timestamp,
      source: "ui",
    };

    globalLoggingBus.log({
      severity: "error",
      category: "command",
      message: "close command failed",
      metadata: {
        payload,
        error: error instanceof Error ? error.message : String(error),
      },
    });

    return result;
  }
}
