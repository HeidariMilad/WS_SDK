/**
 * Lifecycle management for element targeting and overlay reattachment.
 *
 * Uses MutationObserver to detect when targeted elements are added or removed
 * from the DOM, triggering appropriate attach/detach callbacks.
 */
export interface OverlayRegistration {
    elementId: string;
    selector?: string;
    attach: (element: HTMLElement) => void;
    detach: (element: HTMLElement) => void;
}
/**
 * Register an overlay configuration that should persist across element lifecycle.
 *
 * @param registration - Configuration with elementId, attach/detach callbacks.
 */
export declare function registerOverlay(registration: OverlayRegistration): void;
/**
 * Unregister an overlay configuration.
 *
 * @param elementId - The elementId to unregister.
 */
export declare function unregisterOverlay(elementId: string): void;
/**
 * Start observing DOM mutations to manage overlay lifecycle.
 *
 * When elements with registered overlays are added, their attach callback is invoked.
 * When they are removed, their detach callback is invoked.
 *
 * @param root - The root element or document to observe (default: document).
 */
export declare function startTargetingObserver(root?: HTMLElement | Document): void;
/**
 * Stop observing DOM mutations.
 */
export declare function stopTargetingObserver(): void;
/**
 * Clear all registered overlays and stop observing.
 */
export declare function clearAllOverlays(): void;
//# sourceMappingURL=lifecycle.d.ts.map