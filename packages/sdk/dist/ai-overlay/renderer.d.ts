/**
 * AI Overlay Renderer
 *
 * Manages the .sdk-overlay-root portal and renders overlay buttons
 * with proper positioning and lifecycle management.
 */
import type { OverlayConfig, ElementMetadata } from "./types";
/**
 * Get or create the portal root element.
 *
 * @returns The portal root HTMLDivElement.
 */
export declare function getOrCreatePortalRoot(): HTMLDivElement;
/**
 * Render an overlay button for a given configuration.
 *
 * @param config - The overlay configuration.
 * @param onButtonClick - Optional callback when button is clicked (called after prompt workflow).
 * @returns The rendered button element, or null if target element is not available.
 */
export declare function renderOverlay(config: OverlayConfig, onButtonClick?: (metadata: ElementMetadata) => void | Promise<void>): HTMLButtonElement | null;
/**
 * Remove a rendered overlay button.
 *
 * @param overlayId - The overlay ID to remove.
 * @returns True if the button was removed, false otherwise.
 */
export declare function removeOverlay(overlayId: string): boolean;
/**
 * Remove all rendered overlays.
 */
export declare function removeAllOverlays(): void;
/**
 * Update the position of a rendered overlay.
 *
 * Useful when the target element moves or the viewport changes.
 *
 * @param overlayId - The overlay ID to update.
 * @param config - The overlay configuration with updated target element.
 * @returns True if the overlay was updated, false otherwise.
 */
export declare function updateOverlayPosition(overlayId: string, config: OverlayConfig): boolean;
/**
 * Check if an overlay is currently rendered.
 *
 * @param overlayId - The overlay ID to check.
 * @returns True if the overlay is rendered, false otherwise.
 */
export declare function isOverlayRendered(overlayId: string): boolean;
/**
 * Get the rendered button element for an overlay.
 *
 * @param overlayId - The overlay ID.
 * @returns The button element or undefined if not rendered.
 */
export declare function getRenderedButton(overlayId: string): HTMLButtonElement | undefined;
/**
 * Cleanup the portal root and all rendered overlays.
 *
 * Should be called when the SDK is unmounted.
 */
export declare function cleanupPortal(): void;
//# sourceMappingURL=renderer.d.ts.map