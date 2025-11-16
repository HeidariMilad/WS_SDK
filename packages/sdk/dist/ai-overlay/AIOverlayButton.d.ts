/**
 * AI Overlay Button Component
 *
 * Creates and manages AI assistant overlay buttons with accessibility,
 * styling, and proper event handling.
 */
import type { AttachAiButtonOptions, ElementMetadata } from "./types";
/**
 * Create an AI overlay button element.
 *
 * @param options - Configuration options for the button.
 * @param metadata - Metadata about the target element.
 * @param onClick - Click handler that receives metadata.
 * @returns The button HTMLElement.
 */
export declare function createAIOverlayButton(options: AttachAiButtonOptions, metadata: ElementMetadata, onClick?: (metadata: ElementMetadata) => void | Promise<void>): HTMLButtonElement;
//# sourceMappingURL=AIOverlayButton.d.ts.map