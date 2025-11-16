import type { CommandPayload, CommandResult } from "@frontend-ui-command-sdk/shared";
import { globalLoggingBus } from "../logging/loggingBus";
import { resolveTarget } from "../targeting";

/**
 * Cross-environment Event constructor access.
 * Handles both browser and JSDOM environments.
 */
const getEventConstructor = (): typeof Event | undefined => {
  if (typeof Event !== "undefined") {
    return Event;
  }
  return (globalThis as unknown as { window?: { Event?: typeof Event } })
    .window?.Event;
};

/**
 * Clear command handler.
 *
 * Resets input, textarea, or select elements to empty or default values,
 * and dispatches appropriate input and change events.
 *
 * @param payload - Command payload with elementId
 * @returns Promise<CommandResult> indicating success or warnings
 */
export async function handleClear(
  payload: CommandPayload
): Promise<CommandResult> {
  const timestamp = Date.now();

  // Validate elementId is provided
  if (!payload.elementId) {
    const result: CommandResult = {
      status: "warning",
      requestId: payload.requestId,
      details: "clear command requires elementId",
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

  // Resolve target element
  const resolution = await resolveTarget({ elementId });

  if (!resolution.element) {
    const result: CommandResult = {
      status: "warning",
      requestId: payload.requestId,
      details: `Element '${elementId}' not found for clear`,
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
    // Get cross-environment constructors
    const HTMLInputElementConstructor = typeof HTMLInputElement !== "undefined"
      ? HTMLInputElement
      : (globalThis as unknown as { window?: { HTMLInputElement?: typeof HTMLInputElement } }).window?.HTMLInputElement;
    const HTMLTextAreaElementConstructor = typeof HTMLTextAreaElement !== "undefined"
      ? HTMLTextAreaElement
      : (globalThis as unknown as { window?: { HTMLTextAreaElement?: typeof HTMLTextAreaElement } }).window?.HTMLTextAreaElement;
    const HTMLSelectElementConstructor = typeof HTMLSelectElement !== "undefined"
      ? HTMLSelectElement
      : (globalThis as unknown as { window?: { HTMLSelectElement?: typeof HTMLSelectElement } }).window?.HTMLSelectElement;

    // Validate element is clearable
    const isInput = HTMLInputElementConstructor && element instanceof HTMLInputElementConstructor;
    const isTextArea = HTMLTextAreaElementConstructor && element instanceof HTMLTextAreaElementConstructor;
    const isSelect = HTMLSelectElementConstructor && element instanceof HTMLSelectElementConstructor;
    
    if (!isInput && !isTextArea && !isSelect) {
      const result: CommandResult = {
        status: "warning",
        requestId: payload.requestId,
        details: `Element '${elementId}' is not an input, textarea, or select`,
        timestamp,
        source: "ui",
      };

      globalLoggingBus.log({
        severity: "warning",
        category: "command",
        message: result.details,
        metadata: { payload, elementType: element.tagName },
      });

      return result;
    }

    // Check if element is disabled
    if ("disabled" in element && (element as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement).disabled) {
      const result: CommandResult = {
        status: "warning",
        requestId: payload.requestId,
        details: `Element '${elementId}' is disabled`,
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

    const EventConstructor = getEventConstructor();

    if (!EventConstructor) {
      const result: CommandResult = {
        status: "error",
        requestId: payload.requestId,
        details: "Event constructor not available in this environment",
        timestamp,
        source: "ui",
      };

      globalLoggingBus.log({
        severity: "error",
        category: "command",
        message: result.details,
        metadata: { payload },
      });

      return result;
    }

    // Store old value for comparison
    const oldValue = (element as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement).value;

    // Clear the value
    if (isSelect && HTMLSelectElementConstructor) {
      // For select elements, set selectedIndex to -1 or first option
      const selectElement = element as HTMLSelectElement;
      if (selectElement.options.length > 0) {
        selectElement.selectedIndex = 0; // Select first option (default)
      }
    } else {
      // For input and textarea, set to empty string
      (element as HTMLInputElement | HTMLTextAreaElement).value = "";
    }

    // Dispatch input event
    const inputEvent = new EventConstructor("input", {
      bubbles: true,
      cancelable: true,
    });
    element.dispatchEvent(inputEvent);

    // Dispatch change event if value actually changed
    const newValue = (element as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement).value;
    if (oldValue !== newValue) {
      const changeEvent = new EventConstructor("change", {
        bubbles: true,
        cancelable: true,
      });
      element.dispatchEvent(changeEvent);
    }

    const result: CommandResult = {
      status: resolution.warnings.length > 0 ? "warning" : "ok",
      requestId: payload.requestId,
      details: `Cleared '${elementId}'`,
      timestamp,
      source: "ui",
      warnings: resolution.warnings.length > 0 ? resolution.warnings : undefined,
    };

    globalLoggingBus.log({
      severity: "info",
      category: "command",
      message: `clear command executed: ${elementId}`,
      metadata: {
        payload,
        oldValue,
        warnings: resolution.warnings,
      },
    });

    return result;
  } catch (error) {
    const result: CommandResult = {
      status: "error",
      requestId: payload.requestId,
      details: `Clear failed: ${error instanceof Error ? error.message : String(error)}`,
      timestamp,
      source: "ui",
    };

    globalLoggingBus.log({
      severity: "error",
      category: "command",
      message: "clear command failed",
      metadata: {
        payload,
        error: error instanceof Error ? error.message : String(error),
      },
    });

    return result;
  }
}
