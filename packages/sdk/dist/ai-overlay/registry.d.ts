/**
 * AI Overlay Registry
 *
 * WeakMap-backed registry to prevent duplicate attachments and track
 * overlay configuration per host element.
 */
import type { OverlayConfig } from "./types";
export declare function generateOverlayId(): string;
/**
 * Register an overlay configuration for a given element.
 *
 * If an overlay is already registered for this element, it will be replaced.
 *
 * @param element - The target HTMLElement.
 * @param config - The overlay configuration.
 */
export declare function registerOverlay(element: HTMLElement, config: OverlayConfig): void;
/**
 * Retrieve overlay configuration for a given element.
 *
 * @param element - The target HTMLElement.
 * @returns The OverlayConfig or undefined if not registered.
 */
export declare function getOverlayByElement(element: HTMLElement): OverlayConfig | undefined;
/**
 * Retrieve overlay configuration by overlay ID.
 *
 * @param overlayId - The unique overlay ID.
 * @returns The OverlayConfig or undefined if not found.
 */
export declare function getOverlayById(overlayId: string): OverlayConfig | undefined;
/**
 * Retrieve overlay configuration by element ID.
 *
 * @param elementId - The data-elementid value.
 * @returns The OverlayConfig or undefined if not found.
 */
export declare function getOverlayByElementId(elementId: string): OverlayConfig | undefined;
/**
 * Unregister an overlay by its overlay ID.
 *
 * Removes the overlay from all registries.
 *
 * @param overlayId - The unique overlay ID to remove.
 * @returns True if an overlay was removed, false otherwise.
 */
export declare function unregisterOverlay(overlayId: string): boolean;
/**
 * Clear all registered overlays.
 *
 * Useful for cleanup when the SDK is unmounted or reset.
 */
export declare function clearAllOverlays(): void;
/**
 * Get all currently registered overlays.
 *
 * @returns Array of all OverlayConfig objects.
 */
export declare function getAllOverlays(): OverlayConfig[];
/**
 * Check if an overlay is registered for a given element.
 *
 * @param element - The target HTMLElement.
 * @returns True if an overlay exists, false otherwise.
 */
export declare function hasOverlay(element: HTMLElement): boolean;
/**
 * Update an existing overlay's configuration.
 *
 * @param overlayId - The overlay ID to update.
 * @param updates - Partial overlay configuration to merge.
 * @returns True if the overlay was updated, false if not found.
 */
export declare function updateOverlay(overlayId: string, updates: Partial<OverlayConfig>): boolean;
//# sourceMappingURL=registry.d.ts.map