"use strict";
/**
 * Lifecycle management for element targeting and overlay reattachment.
 *
 * Uses MutationObserver to detect when targeted elements are added or removed
 * from the DOM, triggering appropriate attach/detach callbacks.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerOverlay = registerOverlay;
exports.unregisterOverlay = unregisterOverlay;
exports.startTargetingObserver = startTargetingObserver;
exports.stopTargetingObserver = stopTargetingObserver;
exports.clearAllOverlays = clearAllOverlays;
const registry = new Map();
let observer = null;
/**
 * Register an overlay configuration that should persist across element lifecycle.
 *
 * @param registration - Configuration with elementId, attach/detach callbacks.
 */
function registerOverlay(registration) {
    registry.set(registration.elementId, registration);
}
/**
 * Unregister an overlay configuration.
 *
 * @param elementId - The elementId to unregister.
 */
function unregisterOverlay(elementId) {
    registry.delete(elementId);
}
/**
 * Find registration for a given DOM node based on data-elementid attribute.
 *
 * @param node - The HTMLElement to check.
 * @returns The matching OverlayRegistration or undefined.
 */
function findRegistrationForNode(node) {
    const elementId = node.getAttribute("data-elementid");
    if (!elementId)
        return undefined;
    return registry.get(elementId);
}
/**
 * Start observing DOM mutations to manage overlay lifecycle.
 *
 * When elements with registered overlays are added, their attach callback is invoked.
 * When they are removed, their detach callback is invoked.
 *
 * @param root - The root element or document to observe (default: document).
 */
function startTargetingObserver(root = document) {
    if (observer) {
        // Already observing
        return;
    }
    observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            // Handle removed nodes
            mutation.removedNodes.forEach((node) => {
                if (!(node instanceof HTMLElement))
                    return;
                const registration = findRegistrationForNode(node);
                if (registration) {
                    try {
                        registration.detach(node);
                    }
                    catch (error) {
                        // Log internally but do not throw to avoid breaking observer
                        console.error(`Error detaching overlay for elementId="${registration.elementId}":`, error);
                    }
                }
            });
            // Handle added nodes (reattachment)
            mutation.addedNodes.forEach((node) => {
                if (!(node instanceof HTMLElement))
                    return;
                const registration = findRegistrationForNode(node);
                if (registration) {
                    try {
                        registration.attach(node);
                    }
                    catch (error) {
                        // Log internally but do not throw to avoid breaking observer
                        console.error(`Error attaching overlay for elementId="${registration.elementId}":`, error);
                    }
                }
            });
        }
    });
    observer.observe(root, { childList: true, subtree: true });
}
/**
 * Stop observing DOM mutations.
 */
function stopTargetingObserver() {
    if (observer) {
        observer.disconnect();
        observer = null;
    }
}
/**
 * Clear all registered overlays and stop observing.
 */
function clearAllOverlays() {
    registry.clear();
    stopTargetingObserver();
}
//# sourceMappingURL=lifecycle.js.map