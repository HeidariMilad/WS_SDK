import type { CommandPayload, CommandResult } from "@frontend-ui-command-sdk/shared";
import { globalLoggingBus } from "../logging/loggingBus";
import { resolveTarget } from "../targeting";

/**
 * Options for the highlight command.
 */
export interface HighlightOptions {
  color?: string;
  thickness?: number;
  duration?: number;
}

/**
 * Default highlight configuration.
 */
const DEFAULT_HIGHLIGHT_OPTIONS: Required<HighlightOptions> = {
  color: "#3b82f6", // Blue-500
  thickness: 3,
  duration: 400, // milliseconds
};

/**
 * Active highlight cleanup timers, keyed by element.
 */
const activeHighlights = new WeakMap<Element, number>();

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
export async function handleHighlight(
  payload: CommandPayload
): Promise<CommandResult> {
  const timestamp = Date.now();

  // Validate elementId is provided
  if (!payload.elementId) {
    const result: CommandResult = {
      status: "warning",
      requestId: payload.requestId,
      details: "highlight command requires elementId",
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

  // Parse options from payload
  const data = (payload.payload as Record<string, unknown>) || {};
  const options = (data.options as Partial<HighlightOptions>) || {};
  const config: Required<HighlightOptions> = {
    color: options.color ?? DEFAULT_HIGHLIGHT_OPTIONS.color,
    thickness: options.thickness ?? DEFAULT_HIGHLIGHT_OPTIONS.thickness,
    duration: options.duration ?? DEFAULT_HIGHLIGHT_OPTIONS.duration,
  };

  // Resolve target element
  const resolution = await resolveTarget({ elementId });

  if (!resolution.element) {
    const result: CommandResult = {
      status: "warning",
      requestId: payload.requestId,
      details: `Element '${elementId}' not found for highlight`,
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
    // Clear any existing highlight timeout for this element
    const existingTimeout = activeHighlights.get(element);
    if (existingTimeout) {
      clearTimeout(existingTimeout);
    }

    // Store original styles that we'll modify
    const originalOutline = element.style.outline;
    const originalOutlineOffset = element.style.outlineOffset;
    const originalTransition = element.style.transition;

    // Apply highlight styles
    element.style.outline = `${config.thickness}px solid ${config.color}`;
    element.style.outlineOffset = "2px";
    element.style.transition = "outline 150ms ease-in-out";

    // Schedule cleanup
    const timeoutId = window.setTimeout(() => {
      // Restore original styles
      element.style.outline = originalOutline;
      element.style.outlineOffset = originalOutlineOffset;
      element.style.transition = originalTransition;

      // Remove from active highlights
      activeHighlights.delete(element);

      globalLoggingBus.log({
        severity: "info",
        category: "command",
        message: `highlight cleanup completed for '${elementId}'`,
        metadata: { elementId, duration: config.duration },
      });
    }, config.duration);

    activeHighlights.set(element, timeoutId);

    const result: CommandResult = {
      status: resolution.warnings.length > 0 ? "warning" : "ok",
      requestId: payload.requestId,
      details: `Highlighted '${elementId}' for ${config.duration}ms`,
      timestamp,
      source: "ui",
      warnings: resolution.warnings.length > 0 ? resolution.warnings : undefined,
    };

    globalLoggingBus.log({
      severity: "info",
      category: "command",
      message: `highlight command executed: ${elementId}`,
      metadata: {
        payload,
        config,
        warnings: resolution.warnings,
      },
    });

    return result;
  } catch (error) {
    const result: CommandResult = {
      status: "error",
      requestId: payload.requestId,
      details: `Highlight failed: ${error instanceof Error ? error.message : String(error)}`,
      timestamp,
      source: "ui",
    };

    globalLoggingBus.log({
      severity: "error",
      category: "command",
      message: "highlight command failed",
      metadata: {
        payload,
        error: error instanceof Error ? error.message : String(error),
      },
    });

    return result;
  }
}
