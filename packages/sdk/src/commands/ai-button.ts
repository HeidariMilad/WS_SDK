import type { CommandPayload, CommandResult } from "@frontend-ui-command-sdk/shared";
import { globalLoggingBus } from "../logging/loggingBus";
import { attachAiButton, detachAiButton, detachAiButtonByElement } from "../ai-overlay";

/**
 * Options for attach_ai_button command payload.
 */
export interface AttachAiButtonPayload {
  placement?: "top-left" | "top-right" | "bottom-left" | "bottom-right" | "center" | { top?: number; left?: number; right?: number; bottom?: number };
  className?: string;
  style?: Record<string, string | number>;
  icon?: string;
  label?: string;
  size?: "default" | "compact";
  ariaLabel?: string;
  disabled?: boolean;
  zIndex?: number;
  backgroundColor?: string;
  borderColor?: string;
  width?: number;
  height?: number;
  offsetX?: number;
  offsetY?: number;
}

/**
 * Handle attach_ai_button command.
 *
 * Attaches an AI assistant button to the specified element.
 * The button will automatically reattach if the element is removed and re-added.
 *
 * Payload format:
 * - `payload.options`: AttachAiButtonPayload - button configuration options
 *
 * @param payload - Command payload with elementId (required) and options
 * @returns Promise<CommandResult> indicating success or error
 */
export async function handleAttachAiButton(
  payload: CommandPayload
): Promise<CommandResult> {
  const timestamp = Date.now();

  if (!payload.elementId) {
    const result: CommandResult = {
      status: "error",
      requestId: payload.requestId,
      details: "attach_ai_button requires elementId",
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

  try {
    // Parse options from payload
    const data = (payload.payload as Record<string, unknown>) || {};
    const options = (data.options as Partial<AttachAiButtonPayload>) || {};

    // Attach the AI button
    const attachResult = await attachAiButton(payload.elementId, options);

    if (!attachResult.success) {
      const result: CommandResult = {
        status: "error",
        requestId: payload.requestId,
        details: `Failed to attach AI button: ${attachResult.error}`,
        timestamp,
        source: "ui",
      };

      globalLoggingBus.log({
        severity: "error",
        category: "command",
        message: result.details,
        metadata: { payload, attachResult },
      });

      return result;
    }

    const result: CommandResult = {
      status: "ok",
      requestId: payload.requestId,
      details: `AI button attached to '${payload.elementId}' (overlayId: ${attachResult.overlayId})`,
      timestamp,
      source: "ui",
    };

    globalLoggingBus.log({
      severity: "info",
      category: "command",
      message: `attach_ai_button executed: ${payload.elementId}`,
      metadata: {
        payload,
        overlayId: attachResult.overlayId,
      },
    });

    return result;
  } catch (error) {
    const result: CommandResult = {
      status: "error",
      requestId: payload.requestId,
      details: `attach_ai_button failed: ${error instanceof Error ? error.message : String(error)}`,
      timestamp,
      source: "ui",
    };

    globalLoggingBus.log({
      severity: "error",
      category: "command",
      message: "attach_ai_button command failed",
      metadata: {
        payload,
        error: error instanceof Error ? error.message : String(error),
      },
    });

    return result;
  }
}

/**
 * Handle detach_ai_button command.
 *
 * Detaches an AI assistant button from the specified element.
 *
 * Payload format:
 * - `payload.options.overlayId`: string (optional) - specific overlay ID to detach
 * - If overlayId not provided, uses elementId to find and detach
 *
 * @param payload - Command payload with elementId or overlayId
 * @returns Promise<CommandResult> indicating success or error
 */
export async function handleDetachAiButton(
  payload: CommandPayload
): Promise<CommandResult> {
  const timestamp = Date.now();

  try {
    // Parse options from payload
    const data = (payload.payload as Record<string, unknown>) || {};
    const options = (data.options as { overlayId?: string }) || {};

    let success = false;
    let method = "";

    if (options.overlayId) {
      // Detach by overlay ID
      success = detachAiButton(options.overlayId);
      method = `overlayId: ${options.overlayId}`;
    } else if (payload.elementId) {
      // Detach by element ID
      success = detachAiButtonByElement(payload.elementId);
      method = `elementId: ${payload.elementId}`;
    } else {
      const result: CommandResult = {
        status: "error",
        requestId: payload.requestId,
        details: "detach_ai_button requires either elementId or payload.options.overlayId",
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

    if (!success) {
      const result: CommandResult = {
        status: "warning",
        requestId: payload.requestId,
        details: `AI button not found (${method})`,
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

    const result: CommandResult = {
      status: "ok",
      requestId: payload.requestId,
      details: `AI button detached (${method})`,
      timestamp,
      source: "ui",
    };

    globalLoggingBus.log({
      severity: "info",
      category: "command",
      message: `detach_ai_button executed: ${method}`,
      metadata: { payload },
    });

    return result;
  } catch (error) {
    const result: CommandResult = {
      status: "error",
      requestId: payload.requestId,
      details: `detach_ai_button failed: ${error instanceof Error ? error.message : String(error)}`,
      timestamp,
      source: "ui",
    };

    globalLoggingBus.log({
      severity: "error",
      category: "command",
      message: "detach_ai_button command failed",
      metadata: {
        payload,
        error: error instanceof Error ? error.message : String(error),
      },
    });

    return result;
  }
}

