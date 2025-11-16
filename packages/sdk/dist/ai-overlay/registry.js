"use strict";
/**
 * AI Overlay Registry
 *
 * WeakMap-backed registry to prevent duplicate attachments and track
 * overlay configuration per host element.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateOverlayId = generateOverlayId;
exports.registerOverlay = registerOverlay;
exports.getOverlayByElement = getOverlayByElement;
exports.getOverlayById = getOverlayById;
exports.getOverlayByElementId = getOverlayByElementId;
exports.unregisterOverlay = unregisterOverlay;
exports.clearAllOverlays = clearAllOverlays;
exports.getAllOverlays = getAllOverlays;
exports.hasOverlay = hasOverlay;
exports.updateOverlay = updateOverlay;
/**
 * WeakMap registry keyed by HTMLElement.
 * When an element is garbage collected, its entry is automatically removed.
 */
const overlayRegistry = new WeakMap();
/**
 * Map of overlayId to OverlayConfig for lookup by ID.
 * Used for detachment and lifecycle management.
 */
const overlayById = new Map();
/**
 * Map of elementId to OverlayConfig for quick lookup by identifier.
 */
const overlayByElementId = new Map();
/**
 * Generate a unique overlay ID.
 */
let overlayCounter = 0;
function generateOverlayId() {
    return `sdk-overlay-${Date.now()}-${++overlayCounter}`;
}
/**
 * Register an overlay configuration for a given element.
 *
 * If an overlay is already registered for this element, it will be replaced.
 *
 * @param element - The target HTMLElement.
 * @param config - The overlay configuration.
 */
function registerOverlay(element, config) {
    // Remove any existing overlay for this element first
    const existing = overlayRegistry.get(element);
    if (existing) {
        unregisterOverlay(existing.overlayId);
    }
    overlayRegistry.set(element, config);
    overlayById.set(config.overlayId, config);
    overlayByElementId.set(config.elementId, config);
}
/**
 * Retrieve overlay configuration for a given element.
 *
 * @param element - The target HTMLElement.
 * @returns The OverlayConfig or undefined if not registered.
 */
function getOverlayByElement(element) {
    return overlayRegistry.get(element);
}
/**
 * Retrieve overlay configuration by overlay ID.
 *
 * @param overlayId - The unique overlay ID.
 * @returns The OverlayConfig or undefined if not found.
 */
function getOverlayById(overlayId) {
    return overlayById.get(overlayId);
}
/**
 * Retrieve overlay configuration by element ID.
 *
 * @param elementId - The data-elementid value.
 * @returns The OverlayConfig or undefined if not found.
 */
function getOverlayByElementId(elementId) {
    return overlayByElementId.get(elementId);
}
/**
 * Unregister an overlay by its overlay ID.
 *
 * Removes the overlay from all registries.
 *
 * @param overlayId - The unique overlay ID to remove.
 * @returns True if an overlay was removed, false otherwise.
 */
function unregisterOverlay(overlayId) {
    const config = overlayById.get(overlayId);
    if (!config)
        return false;
    // Remove from all maps
    overlayById.delete(overlayId);
    overlayByElementId.delete(config.elementId);
    // WeakMap cleanup happens automatically when element is GC'd,
    // but we should null out the reference if we still have it
    if (config.targetElement) {
        overlayRegistry.delete(config.targetElement);
    }
    return true;
}
/**
 * Clear all registered overlays.
 *
 * Useful for cleanup when the SDK is unmounted or reset.
 */
function clearAllOverlays() {
    overlayById.clear();
    overlayByElementId.clear();
    // WeakMap doesn't have a clear method, but entries will be GC'd when elements are
}
/**
 * Get all currently registered overlays.
 *
 * @returns Array of all OverlayConfig objects.
 */
function getAllOverlays() {
    return Array.from(overlayById.values());
}
/**
 * Check if an overlay is registered for a given element.
 *
 * @param element - The target HTMLElement.
 * @returns True if an overlay exists, false otherwise.
 */
function hasOverlay(element) {
    return overlayRegistry.has(element);
}
/**
 * Update an existing overlay's configuration.
 *
 * @param overlayId - The overlay ID to update.
 * @param updates - Partial overlay configuration to merge.
 * @returns True if the overlay was updated, false if not found.
 */
function updateOverlay(overlayId, updates) {
    const config = overlayById.get(overlayId);
    if (!config)
        return false;
    // Merge updates
    Object.assign(config, updates);
    return true;
}
//# sourceMappingURL=registry.js.map