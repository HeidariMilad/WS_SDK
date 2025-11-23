/**
 * AI Overlay Utilities
 *
 * Helper functions for metadata collection, positioning, and collision detection.
 */
import type { ElementMetadata, OverlayPlacement } from "./types";
export declare function collectElementMetadata(element: HTMLElement): ElementMetadata;
/**
 * Calculate absolute position for an overlay button relative to a target element.
 *
 * Positions button INSIDE the element boundaries with fixed margins.
 *
 * @param targetElement - The element to position relative to.
 * @param placement - The placement configuration.
 * @param buttonSize - The size of the overlay button.
 * @param offsetX - X-axis offset in pixels (default: 0).
 * @param offsetY - Y-axis offset in pixels (default: 0).
 * @returns Object with top and left pixel values.
 */
export declare function calculateOverlayPosition(targetElement: HTMLElement, placement?: OverlayPlacement, buttonSize?: {
    width: number;
    height: number;
}, offsetX?: number, offsetY?: number): {
    top: number;
    left: number;
};
/**
 * Check if user prefers reduced motion.
 *
 * @returns True if prefers-reduced-motion is set.
 */
export declare function prefersReducedMotion(): boolean;
/**
 * Generate default icon SVG for AI assistant.
 *
 * @returns SVG string for the AI icon.
 */
export declare function getDefaultAiIcon(): string;
//# sourceMappingURL=utils.d.ts.map