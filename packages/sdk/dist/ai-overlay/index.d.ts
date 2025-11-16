/**
 * AI Overlay Module
 *
 * Public API for attaching AI assistant buttons to UI elements with
 * configurable styling, placement, and lifecycle management.
 */
import type { AttachAiButtonOptions, AttachResult, // eslint-disable-line @typescript-eslint/no-unused-vars
OverlayConfig } from "./types";
export type { AttachAiButtonOptions, AttachResult, ElementMetadata, OverlayPlacement, OverlaySize, OverlayState, } from "./types";
export { setChatbotBridge, getChatbotBridge, configurePromptWorkflow, handleAIButtonClick, formatPromptError, } from "./promptWorkflow";
export type { PromptClientConfig, PromptApiError, PromptApiResponse, } from "./promptClient";
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
export declare function attachAiButton(elementId: string, options?: AttachAiButtonOptions): Promise<AttachResult>;
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
export declare function detachAiButton(overlayId: string): boolean;
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
export declare function detachAiButtonByElement(elementId: string): boolean;
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
export declare function updateAiButton(overlayId: string, options: Partial<AttachAiButtonOptions>): boolean;
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
export declare function detachAllAiButtons(): void;
/**
 * Get overlay configuration by overlay ID.
 *
 * @param overlayId - The overlay ID.
 * @returns OverlayConfig or undefined if not found.
 */
export declare function getOverlayConfig(overlayId: string): OverlayConfig | undefined;
/**
 * Get overlay configuration by element ID.
 *
 * @param elementId - The data-elementid value.
 * @returns OverlayConfig or undefined if not found.
 */
export declare function getOverlayConfigByElement(elementId: string): OverlayConfig | undefined;
//# sourceMappingURL=index.d.ts.map