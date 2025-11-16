/**
 * AI Overlay Module
 *
 * Public API for attaching AI assistant buttons to UI elements with
 * configurable styling, placement, and lifecycle management.
 */

import { resolveTarget } from "../targeting";
import {
  registerOverlay as registerInTargetingLifecycle,
  unregisterOverlay as unregisterFromTargetingLifecycle,
} from "../targeting/lifecycle";
import type {
  AttachAiButtonOptions,
  AttachResult,
  ElementMetadata, // eslint-disable-line @typescript-eslint/no-unused-vars
  OverlayConfig,
} from "./types";
import {
  generateOverlayId,
  registerOverlay,
  unregisterOverlay,
  getOverlayById,
  getOverlayByElementId,
  clearAllOverlays as clearRegistryOverlays,
} from "./registry";
import {
  renderOverlay,
  removeOverlay,
  cleanupPortal,
  removeAllOverlays as removeAllRenderedOverlays,
} from "./renderer";

// Re-export types
export type {
  AttachAiButtonOptions,
  AttachResult,
  ElementMetadata,
  OverlayPlacement,
  OverlaySize,
  OverlayState,
} from "./types";

// Re-export prompt workflow functions
export {
  setChatbotBridge,
  getChatbotBridge,
  configurePromptWorkflow,
  handleAIButtonClick,
  formatPromptError,
} from "./promptWorkflow";

export type {
  PromptClientConfig,
  PromptApiError,
  PromptApiResponse,
} from "./promptClient";

/**
 * Attach an AI assistant button to a target element.
 *
 * The button will automatically reattach if the element unmounts and remounts.
 * Returns an overlay ID that can be used to detach the button later.
 *
 * @param elementId - The data-elementid attribute of the target element.
 * @param options - Configuration options for the AI button.
 * @returns AttachResult with success status and overlay ID.
 *
 * @example
 * ```ts
 * const result = await attachAiButton("submit-button", {
 *   placement: "top-right",
 *   label: "Ask AI",
 *   onClick: async (metadata) => {
 *     console.log("AI button clicked:", metadata);
 *   }
 * });
 *
 * if (result.success) {
 *   console.log("Overlay attached:", result.overlayId);
 * }
 * ```
 */
export async function attachAiButton(
  elementId: string,
  options: AttachAiButtonOptions = {}
): Promise<AttachResult> {
  try {
    // Check if overlay already exists for this element
    const existing = getOverlayByElementId(elementId);
    if (existing) {
      return {
        success: false,
        error: `Overlay already attached to element "${elementId}". Detach it first or use updateAiButton().`,
      };
    }

    // Resolve the target element
    const { element, warnings } = await resolveTarget({ elementId });

    if (!element) {
      return {
        success: false,
        error: `Could not find element with data-elementid="${elementId}". ${
          warnings.length > 0 ? warnings[0].reason : ""
        }`,
      };
    }

    // Generate unique overlay ID
    const overlayId = generateOverlayId();

    // Create overlay configuration
    const config: OverlayConfig = {
      elementId,
      options,
      targetElement: element,
      overlayId,
    };

    // Register in overlay registry
    registerOverlay(element, config);

    // Render the overlay
    const button = renderOverlay(config);

    if (!button) {
      return {
        success: false,
        error: "Failed to render overlay button",
      };
    }

    // Register with targeting lifecycle for automatic reattachment
    registerInTargetingLifecycle({
      elementId,
      attach: (el: HTMLElement) => {
        // Update config with new element reference
        config.targetElement = el;
        registerOverlay(el, config);
        // Re-render overlay
        renderOverlay(config);
      },
      detach: () => {
        // Remove rendered overlay
        removeOverlay(overlayId);
        // Keep config in registry for potential reattachment
        config.targetElement = null;
      },
    });

    return {
      success: true,
      overlayId,
    };
  } catch (error) {
    console.error("Error attaching AI button:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

/**
 * Detach an AI button overlay by its overlay ID.
 *
 * @param overlayId - The overlay ID returned from attachAiButton.
 * @returns True if the overlay was successfully detached, false otherwise.
 *
 * @example
 * ```ts
 * const result = await attachAiButton("submit-button");
 * // ... later
 * detachAiButton(result.overlayId);
 * ```
 */
export function detachAiButton(overlayId: string): boolean {
  const config = getOverlayById(overlayId);
  if (!config) {
    console.warn(`No overlay found with ID "${overlayId}"`);
    return false;
  }

  // Remove from renderer
  removeOverlay(overlayId);

  // Unregister from lifecycle
  unregisterFromTargetingLifecycle(config.elementId);

  // Unregister from registry
  return unregisterOverlay(overlayId);
}

/**
 * Detach an AI button overlay by element ID.
 *
 * @param elementId - The data-elementid of the target element.
 * @returns True if an overlay was detached, false otherwise.
 *
 * @example
 * ```ts
 * detachAiButtonByElement("submit-button");
 * ```
 */
export function detachAiButtonByElement(elementId: string): boolean {
  const config = getOverlayByElementId(elementId);
  if (!config) {
    console.warn(`No overlay found for element "${elementId}"`);
    return false;
  }

  return detachAiButton(config.overlayId);
}

/**
 * Update an existing AI button overlay's configuration.
 *
 * @param overlayId - The overlay ID to update.
 * @param options - New options to apply (merged with existing).
 * @returns True if the overlay was updated, false otherwise.
 *
 * @example
 * ```ts
 * updateAiButton(overlayId, {
 *   placement: "bottom-right",
 *   disabled: true
 * });
 * ```
 */
export function updateAiButton(
  overlayId: string,
  options: Partial<AttachAiButtonOptions>
): boolean {
  const config = getOverlayById(overlayId);
  if (!config) {
    console.warn(`No overlay found with ID "${overlayId}"`);
    return false;
  }

  // Merge new options
  config.options = { ...config.options, ...options };

  // Re-render overlay if element is available
  if (config.targetElement) {
    renderOverlay(config);
    return true;
  }

  return false;
}

/**
 * Detach all AI button overlays and cleanup resources.
 *
 * Useful for cleanup when unmounting or resetting the SDK.
 *
 * @example
 * ```ts
 * detachAllAiButtons();
 * ```
 */
export function detachAllAiButtons(): void {
  // Clear all rendered overlays
  removeAllRenderedOverlays();

  // Clear registry
  clearRegistryOverlays();

  // Cleanup portal
  cleanupPortal();
}

/**
 * Get overlay configuration by overlay ID.
 *
 * @param overlayId - The overlay ID.
 * @returns OverlayConfig or undefined if not found.
 */
export function getOverlayConfig(overlayId: string): OverlayConfig | undefined {
  return getOverlayById(overlayId);
}

/**
 * Get overlay configuration by element ID.
 *
 * @param elementId - The data-elementid value.
 * @returns OverlayConfig or undefined if not found.
 */
export function getOverlayConfigByElement(
  elementId: string
): OverlayConfig | undefined {
  return getOverlayByElementId(elementId);
}
