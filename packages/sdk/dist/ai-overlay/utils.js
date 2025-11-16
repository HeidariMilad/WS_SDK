"use strict";
/**
 * AI Overlay Utilities
 *
 * Helper functions for metadata collection, positioning, and collision detection.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.collectElementMetadata = collectElementMetadata;
exports.calculateOverlayPosition = calculateOverlayPosition;
exports.prefersReducedMotion = prefersReducedMotion;
exports.getDefaultAiIcon = getDefaultAiIcon;
/**
 * Collect metadata from a target element for AI prompt generation.
 *
 * @param element - The target HTMLElement.
 * @returns ElementMetadata object with all relevant information.
 */
function collectElementMetadata(element) {
    const rect = element.getBoundingClientRect();
    const dataAttributes = {};
    // Collect all data-* attributes
    Array.from(element.attributes).forEach((attr) => {
        if (attr.name.startsWith("data-")) {
            dataAttributes[attr.name] = attr.value;
        }
    });
    // Attempt to compute a meaningful label
    const computedLabel = element.getAttribute("aria-label") ||
        element.getAttribute("placeholder") ||
        element.getAttribute("title") ||
        (element instanceof HTMLInputElement ? element.value : undefined) ||
        element.textContent?.trim() ||
        undefined;
    return {
        elementId: element.getAttribute("data-elementid") || undefined,
        tagName: element.tagName.toLowerCase(),
        textContent: element.textContent?.trim() || undefined,
        value: element instanceof HTMLInputElement ||
            element instanceof HTMLTextAreaElement
            ? element.value
            : undefined,
        dataAttributes,
        computedLabel,
        boundingBox: {
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height,
        },
    };
}
/**
 * Calculate absolute position for an overlay button relative to a target element.
 *
 * @param targetElement - The element to position relative to.
 * @param placement - The placement configuration.
 * @param buttonSize - The size of the overlay button (for collision detection).
 * @returns Object with top and left pixel values.
 */
function calculateOverlayPosition(targetElement, placement = "top-right", buttonSize = { width: 44, height: 44 }) {
    const rect = targetElement.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
    // Base position relative to viewport + scroll offset
    const baseTop = rect.top + scrollTop;
    const baseLeft = rect.left + scrollLeft;
    let top = baseTop;
    let left = baseLeft;
    if (typeof placement === "string") {
        switch (placement) {
            case "top-left":
                top = baseTop - buttonSize.height - 4; // 4px gap
                left = baseLeft;
                break;
            case "top-right":
                top = baseTop - buttonSize.height - 4;
                left = baseLeft + rect.width - buttonSize.width;
                break;
            case "bottom-left":
                top = baseTop + rect.height + 4;
                left = baseLeft;
                break;
            case "bottom-right":
                top = baseTop + rect.height + 4;
                left = baseLeft + rect.width - buttonSize.width;
                break;
            case "center":
                top = baseTop + rect.height / 2 - buttonSize.height / 2;
                left = baseLeft + rect.width / 2 - buttonSize.width / 2;
                break;
        }
    }
    else {
        // Custom placement object
        if (placement.top !== undefined) {
            top = baseTop + placement.top;
        }
        if (placement.left !== undefined) {
            left = baseLeft + placement.left;
        }
        if (placement.right !== undefined) {
            left = baseLeft + rect.width - placement.right - buttonSize.width;
        }
        if (placement.bottom !== undefined) {
            top = baseTop + rect.height - placement.bottom - buttonSize.height;
        }
    }
    // Basic collision detection: ensure overlay stays within viewport
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    // Adjust if overlay would be clipped on the right
    if (left + buttonSize.width > scrollLeft + viewportWidth) {
        left = scrollLeft + viewportWidth - buttonSize.width - 8; // 8px margin
    }
    // Adjust if overlay would be clipped on the left
    if (left < scrollLeft) {
        left = scrollLeft + 8;
    }
    // Adjust if overlay would be clipped on the bottom
    if (top + buttonSize.height > scrollTop + viewportHeight) {
        top = scrollTop + viewportHeight - buttonSize.height - 8;
    }
    // Adjust if overlay would be clipped on the top
    if (top < scrollTop) {
        top = scrollTop + 8;
    }
    return { top, left };
}
/**
 * Check if user prefers reduced motion.
 *
 * @returns True if prefers-reduced-motion is set.
 */
function prefersReducedMotion() {
    if (typeof window === "undefined")
        return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
/**
 * Generate default icon SVG for AI assistant.
 *
 * @returns SVG string for the AI icon.
 */
function getDefaultAiIcon() {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M12 8V4H8"/>
    <rect width="16" height="12" x="4" y="8" rx="2"/>
    <path d="M2 14h2"/>
    <path d="M20 14h2"/>
    <path d="M15 13v2"/>
    <path d="M9 13v2"/>
  </svg>`;
}
//# sourceMappingURL=utils.js.map