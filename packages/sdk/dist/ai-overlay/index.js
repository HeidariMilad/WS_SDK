"use strict";
/**
 * AI Overlay Module
 *
 * Public API for attaching AI assistant buttons to UI elements with
 * configurable styling, placement, and lifecycle management.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatPromptError = exports.handleAIButtonClick = exports.configurePromptWorkflow = exports.getChatbotBridge = exports.setChatbotBridge = void 0;
exports.attachAiButton = attachAiButton;
exports.detachAiButton = detachAiButton;
exports.detachAiButtonByElement = detachAiButtonByElement;
exports.updateAiButton = updateAiButton;
exports.detachAllAiButtons = detachAllAiButtons;
exports.getOverlayConfig = getOverlayConfig;
exports.getOverlayConfigByElement = getOverlayConfigByElement;
const targeting_1 = require("../targeting");
const lifecycle_1 = require("../targeting/lifecycle");
const registry_1 = require("./registry");
const renderer_1 = require("./renderer");
// Re-export prompt workflow functions
var promptWorkflow_1 = require("./promptWorkflow");
Object.defineProperty(exports, "setChatbotBridge", { enumerable: true, get: function () { return promptWorkflow_1.setChatbotBridge; } });
Object.defineProperty(exports, "getChatbotBridge", { enumerable: true, get: function () { return promptWorkflow_1.getChatbotBridge; } });
Object.defineProperty(exports, "configurePromptWorkflow", { enumerable: true, get: function () { return promptWorkflow_1.configurePromptWorkflow; } });
Object.defineProperty(exports, "handleAIButtonClick", { enumerable: true, get: function () { return promptWorkflow_1.handleAIButtonClick; } });
Object.defineProperty(exports, "formatPromptError", { enumerable: true, get: function () { return promptWorkflow_1.formatPromptError; } });
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
async function attachAiButton(elementId, options = {}) {
    try {
        // Check if overlay already exists for this element
        const existing = (0, registry_1.getOverlayByElementId)(elementId);
        if (existing) {
            return {
                success: false,
                error: `Overlay already attached to element "${elementId}". Detach it first or use updateAiButton().`,
            };
        }
        // Resolve the target element
        const { element, warnings } = await (0, targeting_1.resolveTarget)({ elementId });
        if (!element) {
            return {
                success: false,
                error: `Could not find element with data-elementid="${elementId}". ${warnings.length > 0 ? warnings[0].reason : ""}`,
            };
        }
        // Generate unique overlay ID
        const overlayId = (0, registry_1.generateOverlayId)();
        // Create overlay configuration
        const config = {
            elementId,
            options,
            targetElement: element,
            overlayId,
        };
        // Register in overlay registry
        (0, registry_1.registerOverlay)(element, config);
        // Render the overlay
        const button = (0, renderer_1.renderOverlay)(config);
        if (!button) {
            return {
                success: false,
                error: "Failed to render overlay button",
            };
        }
        // Register with targeting lifecycle for automatic reattachment
        (0, lifecycle_1.registerOverlay)({
            elementId,
            attach: (el) => {
                // Update config with new element reference
                config.targetElement = el;
                (0, registry_1.registerOverlay)(el, config);
                // Re-render overlay
                (0, renderer_1.renderOverlay)(config);
            },
            detach: () => {
                // Remove rendered overlay
                (0, renderer_1.removeOverlay)(overlayId);
                // Keep config in registry for potential reattachment
                config.targetElement = null;
            },
        });
        return {
            success: true,
            overlayId,
        };
    }
    catch (error) {
        console.error("Error attaching AI button:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error occurred",
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
function detachAiButton(overlayId) {
    const config = (0, registry_1.getOverlayById)(overlayId);
    if (!config) {
        console.warn(`No overlay found with ID "${overlayId}"`);
        return false;
    }
    // Remove from renderer
    (0, renderer_1.removeOverlay)(overlayId);
    // Unregister from lifecycle
    (0, lifecycle_1.unregisterOverlay)(config.elementId);
    // Unregister from registry
    return (0, registry_1.unregisterOverlay)(overlayId);
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
function detachAiButtonByElement(elementId) {
    const config = (0, registry_1.getOverlayByElementId)(elementId);
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
function updateAiButton(overlayId, options) {
    const config = (0, registry_1.getOverlayById)(overlayId);
    if (!config) {
        console.warn(`No overlay found with ID "${overlayId}"`);
        return false;
    }
    // Merge new options
    config.options = { ...config.options, ...options };
    // Re-render overlay if element is available
    if (config.targetElement) {
        (0, renderer_1.renderOverlay)(config);
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
function detachAllAiButtons() {
    // Clear all rendered overlays
    (0, renderer_1.removeAllOverlays)();
    // Clear registry
    (0, registry_1.clearAllOverlays)();
    // Cleanup portal
    (0, renderer_1.cleanupPortal)();
}
/**
 * Get overlay configuration by overlay ID.
 *
 * @param overlayId - The overlay ID.
 * @returns OverlayConfig or undefined if not found.
 */
function getOverlayConfig(overlayId) {
    return (0, registry_1.getOverlayById)(overlayId);
}
/**
 * Get overlay configuration by element ID.
 *
 * @param elementId - The data-elementid value.
 * @returns OverlayConfig or undefined if not found.
 */
function getOverlayConfigByElement(elementId) {
    return (0, registry_1.getOverlayByElementId)(elementId);
}
//# sourceMappingURL=index.js.map