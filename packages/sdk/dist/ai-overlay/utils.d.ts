/**
 * AI Overlay Utilities
 *
 * Helper functions for metadata collection, positioning, and collision detection.
 */
import type { ElementMetadata, OverlayPlacement } from "./types";
/**
 * Collect metadata from a target element for AI prompt generation.
 *
 * @param element - The target HTMLElement.
 * @returns ElementMetadata object with all relevant information.
 */
export declare function collectElementMetadata(element: HTMLElement): ElementMetadata;
/**
 * Calculate absolute position for an overlay button relative to a target element.
 *
 * @param targetElement - The element to position relative to.
 * @param placement - The placement configuration.
 * @param buttonSize - The size of the overlay button (for collision detection).
 * @returns Object with top and left pixel values.
 */
export declare function calculateOverlayPosition(targetElement: HTMLElement, placement?: OverlayPlacement, buttonSize?: {
    width: number;
    height: number;
}): {
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