/**
 * AI Overlay Button Component
 *
 * Creates and manages AI assistant overlay buttons with accessibility,
 * styling, and proper event handling.
 */

import type { AttachAiButtonOptions, ElementMetadata } from "./types";
import { getDefaultAiIcon, prefersReducedMotion } from "./utils";

/**
 * Create an AI overlay button element.
 *
 * @param options - Configuration options for the button.
 * @param metadata - Metadata about the target element.
 * @param onClick - Click handler that receives metadata.
 * @returns The button HTMLElement.
 */
export function createAIOverlayButton(
  options: AttachAiButtonOptions,
  metadata: ElementMetadata,
  onClick?: (metadata: ElementMetadata) => void | Promise<void>
): HTMLButtonElement {
  const button = document.createElement("button");

  // Apply base styles
  applyBaseStyles(button, options);

  // Set ARIA attributes
  button.setAttribute(
    "aria-label",
    options.ariaLabel || options.label || "AI Assistant"
  );
  button.setAttribute("type", "button");
  button.setAttribute("role", "button");

  // Add custom class if provided
  if (options.className) {
    button.className = `sdk-ai-overlay-button ${options.className}`;
  } else {
    button.className = "sdk-ai-overlay-button";
  }

  // Set disabled state
  if (options.disabled) {
    button.disabled = true;
    button.setAttribute("aria-disabled", "true");
  }

  // Add icon
  const icon = options.icon || getDefaultAiIcon();
  const iconElement = document.createElement("span");
  iconElement.className = "sdk-ai-overlay-button__icon";
  iconElement.innerHTML = icon;
  button.appendChild(iconElement);

  // Add label if provided
  if (options.label) {
    const labelElement = document.createElement("span");
    labelElement.className = "sdk-ai-overlay-button__label";
    labelElement.textContent = options.label;
    button.appendChild(labelElement);
  }

  // Add tooltip
  if (options.label) {
    button.title = options.label;
  }

  // Handle click events
  button.addEventListener("click", async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (options.disabled) return;

    // Set loading state
    button.classList.add("sdk-ai-overlay-button--loading");
    button.setAttribute("aria-busy", "true");

    try {
      // Call the onClick handler if provided
      if (onClick) {
        await onClick(metadata);
      }

      // Call the options onClick handler if provided
      if (options.onClick) {
        await options.onClick(metadata);
      }
    } catch (error) {
      console.error("Error handling AI overlay button click:", error);
    } finally {
      // Remove loading state
      button.classList.remove("sdk-ai-overlay-button--loading");
      button.removeAttribute("aria-busy");
    }
  });

  // Add hover animation if motion is not reduced
  if (!prefersReducedMotion()) {
    button.addEventListener("mouseenter", () => {
      button.classList.add("sdk-ai-overlay-button--hover");
    });

    button.addEventListener("mouseleave", () => {
      button.classList.remove("sdk-ai-overlay-button--hover");
    });
  }

  // Add focus outline styles
  button.addEventListener("focus", () => {
    button.classList.add("sdk-ai-overlay-button--focused");
  });

  button.addEventListener("blur", () => {
    button.classList.remove("sdk-ai-overlay-button--focused");
  });

  return button;
}

/**
 * Apply base CSS styles to the button element.
 *
 * @param button - The button element.
 * @param options - Configuration options.
 */
function applyBaseStyles(
  button: HTMLButtonElement,
  options: AttachAiButtonOptions
): void {
  const size = options.size || "default";
  const buttonSize = size === "compact" ? 32 : 44;
  const reducedMotion = prefersReducedMotion();

  // Base styles
  Object.assign(button.style, {
    position: "absolute",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
    width: options.label && size === "default" ? "auto" : `${buttonSize}px`,
    height: `${buttonSize}px`,
    padding: options.label ? "0 12px" : "0",
    border: "none",
    borderRadius: "8px",
    backgroundColor: "#F59E0B",
    color: "#fff",
    cursor: "pointer",
    fontSize: size === "compact" ? "12px" : "14px",
    fontWeight: "500",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
    transition: reducedMotion
      ? "none"
      : "transform 200ms ease-out, box-shadow 200ms ease-out, opacity 300ms ease-in-out",
    zIndex: options.zIndex || 10000,
    outline: "none",
    ...(options.style || {}),
  });

  // Add hover styles via dynamic stylesheet
  ensureButtonStyles(reducedMotion);
}

/**
 * Ensure global button styles are injected once.
 *
 * @param reducedMotion - Whether to respect reduced motion preference.
 */
let stylesInjected = false;
function ensureButtonStyles(reducedMotion: boolean): void {
  if (stylesInjected) return;

  const styleSheet = document.createElement("style");
  styleSheet.textContent = `
    .sdk-ai-overlay-button {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    }

    .sdk-ai-overlay-button__icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
    }

    .sdk-ai-overlay-button__icon svg {
      width: 100%;
      height: 100%;
    }

    .sdk-ai-overlay-button__label {
      white-space: nowrap;
    }

    ${
      !reducedMotion
        ? `
    .sdk-ai-overlay-button--hover {
      transform: scale(1.05);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }

    .sdk-ai-overlay-button--loading {
      opacity: 0.7;
      cursor: wait;
    }

    .sdk-ai-overlay-button--loading .sdk-ai-overlay-button__icon {
      animation: sdk-spin 1s linear infinite;
    }

    @keyframes sdk-spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    `
        : ""
    }

    .sdk-ai-overlay-button--focused {
      outline: 3px solid #2563EB;
      outline-offset: 2px;
    }

    .sdk-ai-overlay-button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .sdk-ai-overlay-button:focus-visible {
      outline: 3px solid #2563EB;
      outline-offset: 2px;
    }
  `;

  document.head.appendChild(styleSheet);
  stylesInjected = true;
}
