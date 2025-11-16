/**
 * AI Overlay Types
 *
 * Type definitions for the AI button factory and overlay system.
 */
/**
 * Placement options for AI overlay buttons.
 */
export type OverlayPlacement = "top-left" | "top-right" | "bottom-left" | "bottom-right" | "center" | {
    top?: number;
    left?: number;
    right?: number;
    bottom?: number;
};
/**
 * Size variant for AI overlay button.
 */
export type OverlaySize = "default" | "compact";
/**
 * Visual state of the overlay button.
 */
export type OverlayState = "idle" | "hover" | "loading" | "disabled";
/**
 * Configuration options for attaching an AI button overlay.
 */
export interface AttachAiButtonOptions {
    /**
     * Placement of the AI button relative to the target element.
     * @default "top-right"
     */
    placement?: OverlayPlacement;
    /**
     * Custom CSS class name for styling overrides.
     */
    className?: string;
    /**
     * Inline styles to apply to the overlay button.
     */
    style?: Partial<CSSStyleDeclaration> | Record<string, string | number>;
    /**
     * Icon to display (URL or inline SVG).
     * @default Built-in AI assistant icon
     */
    icon?: string;
    /**
     * Label text for the button (shown as tooltip).
     */
    label?: string;
    /**
     * Size variant of the button.
     * @default "default"
     */
    size?: OverlaySize;
    /**
     * Accessible ARIA label for screen readers.
     * @default "AI Assistant"
     */
    ariaLabel?: string;
    /**
     * Callback invoked when the AI button is clicked.
     * Receives metadata about the target element.
     */
    onClick?: (metadata: ElementMetadata) => void | Promise<void>;
    /**
     * Whether to disable the button.
     * @default false
     */
    disabled?: boolean;
    /**
     * Z-index for the overlay.
     * @default 10000
     */
    zIndex?: number;
}
/**
 * Metadata collected from a target element for AI prompt generation.
 */
export interface ElementMetadata {
    /**
     * The data-elementid attribute value.
     */
    elementId?: string;
    /**
     * Tag name of the element (e.g., "button", "input").
     */
    tagName: string;
    /**
     * Text content of the element.
     */
    textContent?: string;
    /**
     * Value attribute (for form inputs).
     */
    value?: string;
    /**
     * All data-* attributes as key-value pairs.
     */
    dataAttributes: Record<string, string>;
    /**
     * Computed label (from aria-label, label element, placeholder, etc.).
     */
    computedLabel?: string;
    /**
     * Bounding box of the element.
     */
    boundingBox: {
        top: number;
        left: number;
        width: number;
        height: number;
    };
}
/**
 * Internal overlay configuration stored in the registry.
 */
export interface OverlayConfig {
    /**
     * Target element identifier.
     */
    elementId: string;
    /**
     * Optional CSS selector as fallback.
     */
    selector?: string;
    /**
     * User-provided options for the overlay button.
     */
    options: AttachAiButtonOptions;
    /**
     * Currently attached HTMLElement (null if unmounted).
     */
    targetElement: HTMLElement | null;
    /**
     * Unique ID for this overlay instance.
     */
    overlayId: string;
}
/**
 * Result of attaching an AI button.
 */
export interface AttachResult {
    /**
     * Whether the attachment succeeded.
     */
    success: boolean;
    /**
     * Unique ID for the overlay (can be used to detach later).
     */
    overlayId?: string;
    /**
     * Error message if attachment failed.
     */
    error?: string;
}
//# sourceMappingURL=types.d.ts.map