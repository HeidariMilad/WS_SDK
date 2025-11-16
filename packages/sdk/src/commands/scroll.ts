import type { CommandPayload, CommandResult } from "@frontend-ui-command-sdk/shared";
import { globalLoggingBus } from "../logging/loggingBus";
import { resolveTarget } from "../targeting";

/**
 * Options for the scroll command.
 */
export interface ScrollOptions {
  behavior?: ScrollBehavior;
  block?: ScrollLogicalPosition;
  inline?: ScrollLogicalPosition;
}

/**
 * Default scroll configuration.
 */
const DEFAULT_SCROLL_OPTIONS: Required<ScrollOptions> = {
  behavior: "smooth",
  block: "center",
  inline: "nearest",
};

/**
 * Track recently scrolled elements to prevent duplicate scroll calls.
 */
const recentScrolls = new WeakMap<Element, number>();
const SCROLL_DEBOUNCE_MS = 100;

/**
 * Scroll command handler.
 *
 * Brings the target element into view using scrollIntoView with smooth scrolling.
 * Respects prefers-reduced-motion and prevents duplicate scroll calls within a short timeframe.
 *
 * Payload format:
 * - `payload.options.behavior`: "smooth" | "auto" (default: "smooth", respects prefers-reduced-motion)
 * - `payload.options.block`: ScrollLogicalPosition (default: "center")
 * - `payload.options.inline`: ScrollLogicalPosition (default: "nearest")
 *
 * @param payload - Command payload with elementId
 * @returns Promise<CommandResult> indicating success or warnings
 */
export async function handleScroll(
  payload: CommandPayload
): Promise<CommandResult> {
  const timestamp = Date.now();

  // Validate elementId is provided
  if (!payload.elementId) {
    const result: CommandResult = {
      status: "warning",
      requestId: payload.requestId,
      details: "scroll command requires elementId",
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
  const options = (data.options as Partial<ScrollOptions>) || {};

  // Check for prefers-reduced-motion
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const config: Required<ScrollOptions> = {
    behavior:
      options.behavior ??
      (prefersReducedMotion ? "auto" : DEFAULT_SCROLL_OPTIONS.behavior),
    block: options.block ?? DEFAULT_SCROLL_OPTIONS.block,
    inline: options.inline ?? DEFAULT_SCROLL_OPTIONS.inline,
  };

  // Resolve target element
  const resolution = await resolveTarget({ elementId });

  if (!resolution.element) {
    const result: CommandResult = {
      status: "warning",
      requestId: payload.requestId,
      details: `Element '${elementId}' not found for scroll`,
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

  // Check for duplicate scroll within debounce window
  const lastScrollTime = recentScrolls.get(element);
  if (lastScrollTime && timestamp - lastScrollTime < SCROLL_DEBOUNCE_MS) {
    const result: CommandResult = {
      status: "warning",
      requestId: payload.requestId,
      details: `Scroll to '${elementId}' skipped (duplicate within ${SCROLL_DEBOUNCE_MS}ms)`,
      timestamp,
      source: "ui",
    };

    globalLoggingBus.log({
      severity: "warning",
      category: "command",
      message: result.details,
      metadata: { payload, lastScrollTime, timeSinceLastScroll: timestamp - lastScrollTime },
    });

    return result;
  }

  try {
    // Perform scroll
    element.scrollIntoView({
      behavior: config.behavior,
      block: config.block,
      inline: config.inline,
    });

    // Mark element as recently scrolled
    recentScrolls.set(element, timestamp);

    const result: CommandResult = {
      status: resolution.warnings.length > 0 ? "warning" : "ok",
      requestId: payload.requestId,
      details: `Scrolled to '${elementId}' (${config.behavior})`,
      timestamp,
      source: "ui",
      warnings: resolution.warnings.length > 0 ? resolution.warnings : undefined,
    };

    globalLoggingBus.log({
      severity: "info",
      category: "command",
      message: `scroll command executed: ${elementId}`,
      metadata: {
        payload,
        config,
        prefersReducedMotion,
        warnings: resolution.warnings,
      },
    });

    return result;
  } catch (error) {
    const result: CommandResult = {
      status: "error",
      requestId: payload.requestId,
      details: `Scroll failed: ${error instanceof Error ? error.message : String(error)}`,
      timestamp,
      source: "ui",
    };

    globalLoggingBus.log({
      severity: "error",
      category: "command",
      message: "scroll command failed",
      metadata: {
        payload,
        error: error instanceof Error ? error.message : String(error),
      },
    });

    return result;
  }
}
