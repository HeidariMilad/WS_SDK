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
function normalizeValue(value) {
    if (value === undefined || value === null) {
        return undefined;
    }
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : undefined;
}
function getElementValue(element) {
    if (element instanceof HTMLInputElement) {
        if (element.type === "checkbox" || element.type === "radio") {
            if (!element.checked) {
                return undefined;
            }
            return normalizeValue(element.value || "on");
        }
        return normalizeValue(element.value);
    }
    if (element instanceof HTMLTextAreaElement) {
        return normalizeValue(element.value);
    }
    if (element instanceof HTMLSelectElement) {
        const selectedOptions = Array.from(element.selectedOptions);
        if (selectedOptions.length === 0) {
            return undefined;
        }
        if (element.multiple) {
            return selectedOptions.map((option) => option.value || option.text).join(", ");
        }
        const option = selectedOptions[0];
        return normalizeValue(option.value || option.text);
    }
    if (element.isContentEditable) {
        return normalizeValue(element.textContent);
    }
    const valueAttr = element.getAttribute("value");
    return normalizeValue(valueAttr);
}
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
    const value = getElementValue(element);
    return {
        elementId: element.getAttribute("data-elementid") || undefined,
        tagName: element.tagName.toLowerCase(),
        textContent: element.textContent?.trim() || undefined,
        value,
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
 * Positions button INSIDE the element boundaries with fixed margins.
 *
 * @param targetElement - The element to position relative to.
 * @param placement - The placement configuration.
 * @param buttonSize - The size of the overlay button.
 * @param offsetX - X-axis offset in pixels (default: 0).
 * @param offsetY - Y-axis offset in pixels (default: 0).
 * @returns Object with top and left pixel values.
 */
function calculateOverlayPosition(targetElement, placement = "top-right", buttonSize = { width: 44, height: 44 }, offsetX = 0, offsetY = 0) {
    const rect = targetElement.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
    // Base position relative to viewport + scroll offset
    const baseTop = rect.top + scrollTop;
    const baseLeft = rect.left + scrollLeft;
    // Fixed margin from edges (stable positioning)
    const margin = 8;
    let top = baseTop;
    let left = baseLeft;
    if (typeof placement === "string") {
        switch (placement) {
            case "top-left":
                // Inside top-left corner with margin
                top = baseTop + margin;
                left = baseLeft + margin;
                break;
            case "top-right":
                // Inside top-right corner with fixed margin from right edge
                top = baseTop + margin;
                left = baseLeft + rect.width - buttonSize.width - margin;
                break;
            case "bottom-left":
                // Inside bottom-left corner with margin
                top = baseTop + rect.height - buttonSize.height - margin;
                left = baseLeft + margin;
                break;
            case "bottom-right":
                // Inside bottom-right corner with fixed margin from right and bottom edges
                top = baseTop + rect.height - buttonSize.height - margin;
                left = baseLeft + rect.width - buttonSize.width - margin;
                break;
            case "center":
                // Centered inside element
                top = baseTop + rect.height / 2 - buttonSize.height / 2;
                left = baseLeft + rect.width / 2 - buttonSize.width / 2;
                break;
        }
    }
    else {
        // Custom placement object with inside positioning
        if (placement.top !== undefined) {
            top = baseTop + placement.top;
        }
        if (placement.left !== undefined) {
            left = baseLeft + placement.left;
        }
        if (placement.right !== undefined) {
            // Position from right edge (inside element)
            left = baseLeft + rect.width - placement.right - buttonSize.width;
        }
        if (placement.bottom !== undefined) {
            // Position from bottom edge (inside element)
            top = baseTop + rect.height - placement.bottom - buttonSize.height;
        }
    }
    // Apply user-defined offsets
    top += offsetY;
    left += offsetX;
    // Ensure button stays within element bounds
    const minTop = baseTop;
    const maxTop = baseTop + rect.height - buttonSize.height;
    const minLeft = baseLeft;
    const maxLeft = baseLeft + rect.width - buttonSize.width;
    top = Math.max(minTop, Math.min(maxTop, top));
    left = Math.max(minLeft, Math.min(maxLeft, left));
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