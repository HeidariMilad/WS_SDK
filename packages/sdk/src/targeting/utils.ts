import type { TargetResolutionWarning } from "@frontend-ui-command-sdk/shared";

/**
 * Build a human-readable warning message from target resolution warnings.
 *
 * @param warnings - Array of TargetResolutionWarning objects.
 * @returns A user-friendly message describing the targeting failure.
 */
export function buildWarningMessage(
  warnings: TargetResolutionWarning[]
): string {
  if (warnings.length === 0) {
    return "Target resolution encountered issues";
  }

  const messages: string[] = [];

  for (const warning of warnings) {
    const { elementId, selector, reason } = warning;

    let message = "";

    if (reason === "not-found") {
      if (elementId) {
        message = `Could not find element with data-elementid="${elementId}"`;
      } else if (selector) {
        message = `Could not find element matching selector "${selector}"`;
      } else {
        message = "Could not find target element";
      }
    } else if (reason === "invalid-selector") {
      message = `Invalid CSS selector: "${selector}"`;
    } else if (reason === "no-target-provided") {
      message = "No elementId or selector provided for targeting";
    } else if (reason === "multiple-matches") {
      message = `Multiple elements matched, expected unique target`;
    }

    if (message) {
      messages.push(message);
    }
  }

  if (messages.length === 0) {
    return "Target resolution encountered unknown issues";
  }

  return messages.join("; ");
}

/**
 * Check if element should be targeted and return actionable guidance.
 *
 * @param warnings - Array of TargetResolutionWarning objects.
 * @returns User-facing guidance for fixing targeting issues.
 */
export function getTargetingGuidance(
  warnings: TargetResolutionWarning[]
): string {
  if (warnings.length === 0) return "";

  const guidance: string[] = [];

  for (const warning of warnings) {
    const { reason } = warning;

    if (reason === "not-found") {
      guidance.push(
        "Ensure the element exists in the DOM and has the correct data-elementid attribute or verify the selector"
      );
    } else if (reason === "invalid-selector") {
      guidance.push(
        "Check that the CSS selector syntax is valid and properly escaped"
      );
    } else if (reason === "no-target-provided") {
      guidance.push(
        "Provide either elementId or selector in the command payload"
      );
    }
  }

  return guidance.length > 0
    ? guidance.join(". ")
    : "Review targeting configuration";
}
