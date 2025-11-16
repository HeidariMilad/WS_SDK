/**
 * AI Overlay Registry
 *
 * WeakMap-backed registry to prevent duplicate attachments and track
 * overlay configuration per host element.
 */

import type { OverlayConfig } from "./types";

/**
 * WeakMap registry keyed by HTMLElement.
 * When an element is garbage collected, its entry is automatically removed.
 */
const overlayRegistry = new WeakMap<HTMLElement, OverlayConfig>();

/**
 * Map of overlayId to OverlayConfig for lookup by ID.
 * Used for detachment and lifecycle management.
 */
const overlayById = new Map<string, OverlayConfig>();

/**
 * Map of elementId to OverlayConfig for quick lookup by identifier.
 */
const overlayByElementId = new Map<string, OverlayConfig>();

/**
 * Generate a unique overlay ID.
 */
let overlayCounter = 0;
export function generateOverlayId(): string {
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
export function registerOverlay(
  element: HTMLElement,
  config: OverlayConfig
): void {
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
export function getOverlayByElement(
  element: HTMLElement
): OverlayConfig | undefined {
  return overlayRegistry.get(element);
}

/**
 * Retrieve overlay configuration by overlay ID.
 *
 * @param overlayId - The unique overlay ID.
 * @returns The OverlayConfig or undefined if not found.
 */
export function getOverlayById(overlayId: string): OverlayConfig | undefined {
  return overlayById.get(overlayId);
}

/**
 * Retrieve overlay configuration by element ID.
 *
 * @param elementId - The data-elementid value.
 * @returns The OverlayConfig or undefined if not found.
 */
export function getOverlayByElementId(
  elementId: string
): OverlayConfig | undefined {
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
export function unregisterOverlay(overlayId: string): boolean {
  const config = overlayById.get(overlayId);
  if (!config) return false;

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
export function clearAllOverlays(): void {
  overlayById.clear();
  overlayByElementId.clear();
  // WeakMap doesn't have a clear method, but entries will be GC'd when elements are
}

/**
 * Get all currently registered overlays.
 *
 * @returns Array of all OverlayConfig objects.
 */
export function getAllOverlays(): OverlayConfig[] {
  return Array.from(overlayById.values());
}

/**
 * Check if an overlay is registered for a given element.
 *
 * @param element - The target HTMLElement.
 * @returns True if an overlay exists, false otherwise.
 */
export function hasOverlay(element: HTMLElement): boolean {
  return overlayRegistry.has(element);
}

/**
 * Update an existing overlay's configuration.
 *
 * @param overlayId - The overlay ID to update.
 * @param updates - Partial overlay configuration to merge.
 * @returns True if the overlay was updated, false if not found.
 */
export function updateOverlay(
  overlayId: string,
  updates: Partial<OverlayConfig>
): boolean {
  const config = overlayById.get(overlayId);
  if (!config) return false;

  // Merge updates
  Object.assign(config, updates);

  return true;
}
