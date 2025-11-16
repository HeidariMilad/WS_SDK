/**
 * AI Overlay Renderer
 *
 * Manages the .sdk-overlay-root portal and renders overlay buttons
 * with proper positioning and lifecycle management.
 */

import type { AttachAiButtonOptions, OverlayConfig } from "./types";
import { createAIOverlayButton } from "./AIOverlayButton";
import { calculateOverlayPosition, collectElementMetadata } from "./utils";

/**
 * Portal root element for all overlay buttons.
 * Created once and reused for all overlays.
 */
let portalRoot: HTMLDivElement | null = null;

/**
 * Map of overlayId to rendered button element.
 */
const renderedButtons = new Map<string, HTMLButtonElement>();

/**
 * Get or create the portal root element.
 *
 * @returns The portal root HTMLDivElement.
 */
export function getOrCreatePortalRoot(): HTMLDivElement {
  if (portalRoot && document.body.contains(portalRoot)) {
    return portalRoot;
  }

  portalRoot = document.createElement("div");
  portalRoot.className = "sdk-overlay-root";
  portalRoot.setAttribute("data-sdk-overlay-root", "true");

  // Apply base styles to the portal root
  Object.assign(portalRoot.style, {
    position: "absolute",
    top: "0",
    left: "0",
    width: "100%",
    pointerEvents: "none", // Allow clicks to pass through
    zIndex: "9999",
  });

  // Ensure portal is appended to body
  if (document.body) {
    document.body.appendChild(portalRoot);
  } else {
    // Wait for DOM to be ready
    document.addEventListener("DOMContentLoaded", () => {
      document.body.appendChild(portalRoot!);
    });
  }

  return portalRoot;
}

/**
 * Render an overlay button for a given configuration.
 *
 * @param config - The overlay configuration.
 * @param onButtonClick - Optional callback when button is clicked.
 * @returns The rendered button element, or null if target element is not available.
 */
export function renderOverlay(
  config: OverlayConfig,
  onButtonClick?: (metadata: any) => void | Promise<void>
): HTMLButtonElement | null {
  const { targetElement, options, overlayId } = config;

  if (!targetElement) {
    console.warn(
      `Cannot render overlay ${overlayId}: target element is not available`
    );
    return null;
  }

  // Remove existing button if present
  removeOverlay(overlayId);

  // Collect metadata from the target element
  const metadata = collectElementMetadata(targetElement);

  // Create the button
  const button = createAIOverlayButton(options, metadata, onButtonClick);

  // Enable pointer events on the button
  button.style.pointerEvents = "auto";

  // Position the button
  positionButton(button, targetElement, options);

  // Add to portal root
  const root = getOrCreatePortalRoot();
  root.appendChild(button);

  // Track rendered button
  renderedButtons.set(overlayId, button);

  // Update position on scroll and resize
  const updatePosition = () => {
    if (document.body.contains(targetElement)) {
      positionButton(button, targetElement, options);
    }
  };

  window.addEventListener("scroll", updatePosition, { passive: true });
  window.addEventListener("resize", updatePosition, { passive: true });

  // Store cleanup handlers on the button
  (button as any).__cleanupHandlers = () => {
    window.removeEventListener("scroll", updatePosition);
    window.removeEventListener("resize", updatePosition);
  };

  return button;
}

/**
 * Position a button relative to its target element.
 *
 * @param button - The button element to position.
 * @param targetElement - The target element.
 * @param options - Overlay options with placement configuration.
 */
function positionButton(
  button: HTMLButtonElement,
  targetElement: HTMLElement,
  options: AttachAiButtonOptions
): void {
  const placement = options.placement || "top-right";
  const size = options.size || "default";
  const buttonSize =
    size === "compact"
      ? { width: 32, height: 32 }
      : options.label
      ? { width: 120, height: 44 } // Estimate for labeled button
      : { width: 44, height: 44 };

  const position = calculateOverlayPosition(
    targetElement,
    placement,
    buttonSize
  );

  button.style.top = `${position.top}px`;
  button.style.left = `${position.left}px`;
}

/**
 * Remove a rendered overlay button.
 *
 * @param overlayId - The overlay ID to remove.
 * @returns True if the button was removed, false otherwise.
 */
export function removeOverlay(overlayId: string): boolean {
  const button = renderedButtons.get(overlayId);
  if (!button) return false;

  // Call cleanup handlers
  if ((button as any).__cleanupHandlers) {
    (button as any).__cleanupHandlers();
  }

  // Remove from DOM
  if (button.parentElement) {
    button.parentElement.removeChild(button);
  }

  // Remove from tracking
  renderedButtons.delete(overlayId);

  return true;
}

/**
 * Remove all rendered overlays.
 */
export function removeAllOverlays(): void {
  const overlayIds = Array.from(renderedButtons.keys());
  overlayIds.forEach((id) => removeOverlay(id));
}

/**
 * Update the position of a rendered overlay.
 *
 * Useful when the target element moves or the viewport changes.
 *
 * @param overlayId - The overlay ID to update.
 * @param config - The overlay configuration with updated target element.
 * @returns True if the overlay was updated, false otherwise.
 */
export function updateOverlayPosition(
  overlayId: string,
  config: OverlayConfig
): boolean {
  const button = renderedButtons.get(overlayId);
  if (!button || !config.targetElement) return false;

  positionButton(button, config.targetElement, config.options);
  return true;
}

/**
 * Check if an overlay is currently rendered.
 *
 * @param overlayId - The overlay ID to check.
 * @returns True if the overlay is rendered, false otherwise.
 */
export function isOverlayRendered(overlayId: string): boolean {
  return renderedButtons.has(overlayId);
}

/**
 * Get the rendered button element for an overlay.
 *
 * @param overlayId - The overlay ID.
 * @returns The button element or undefined if not rendered.
 */
export function getRenderedButton(
  overlayId: string
): HTMLButtonElement | undefined {
  return renderedButtons.get(overlayId);
}

/**
 * Cleanup the portal root and all rendered overlays.
 *
 * Should be called when the SDK is unmounted.
 */
export function cleanupPortal(): void {
  removeAllOverlays();

  if (portalRoot && portalRoot.parentElement) {
    portalRoot.parentElement.removeChild(portalRoot);
    portalRoot = null;
  }
}
