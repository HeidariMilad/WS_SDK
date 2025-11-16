"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleFocus = handleFocus;
const loggingBus_1 = require("../logging/loggingBus");
const targeting_1 = require("../targeting");
/**
 * Checks if an element is focusable according to HTML standards.
 */
function isFocusable(element) {
    // Handle both browser and JSDOM environments
    const HTMLElementConstructor = typeof HTMLElement !== 'undefined' ? HTMLElement : globalThis.window?.HTMLElement;
    if (HTMLElementConstructor && !(element instanceof HTMLElementConstructor)) {
        return false;
    }
    // In JSDOM, check if it's an Element with tagName
    if (!HTMLElementConstructor && (!element || !element.tagName)) {
        return false;
    }
    // Check if element is disabled
    if ("disabled" in element && element.disabled) {
        return false;
    }
    // Check tabindex
    const tabindex = element.getAttribute("tabindex");
    if (tabindex !== null) {
        const tabindexValue = parseInt(tabindex, 10);
        if (!isNaN(tabindexValue) && tabindexValue >= 0) {
            return true;
        }
        // Negative tabindex means programmatically focusable but not tab-reachable
        if (!isNaN(tabindexValue) && tabindexValue < 0) {
            return true;
        }
    }
    // Naturally focusable elements
    const tagName = element.tagName.toLowerCase();
    const focusableTags = ["input", "button", "select", "textarea", "a", "area"];
    if (focusableTags.includes(tagName)) {
        // Links and areas need href
        if (tagName === "a" || tagName === "area") {
            return element.hasAttribute("href");
        }
        return true;
    }
    // Elements with contenteditable
    if (element.getAttribute("contenteditable") === "true") {
        return true;
    }
    return false;
}
/**
 * Focus command handler.
 *
 * Calls .focus() on the target element while respecting accessibility best practices.
 * Only attempts to focus elements that are naturally focusable or have tabindex.
 *
 * @param payload - Command payload with elementId
 * @returns Promise<CommandResult> indicating success or warnings
 */
async function handleFocus(payload) {
    const timestamp = Date.now();
    // Validate elementId is provided
    if (!payload.elementId) {
        const result = {
            status: "warning",
            requestId: payload.requestId,
            details: "focus command requires elementId",
            timestamp,
            source: "ui",
        };
        loggingBus_1.globalLoggingBus.log({
            severity: "warning",
            category: "command",
            message: result.details,
            metadata: { payload },
        });
        return result;
    }
    const elementId = payload.elementId;
    // Resolve target element
    const resolution = await (0, targeting_1.resolveTarget)({ elementId });
    if (!resolution.element) {
        const result = {
            status: "warning",
            requestId: payload.requestId,
            details: `Element '${elementId}' not found for focus`,
            timestamp,
            source: "ui",
            warnings: resolution.warnings,
        };
        loggingBus_1.globalLoggingBus.log({
            severity: "warning",
            category: "command",
            message: result.details,
            metadata: { payload, resolution },
        });
        return result;
    }
    const element = resolution.element;
    // Check if element is focusable
    if (!isFocusable(element)) {
        const result = {
            status: "warning",
            requestId: payload.requestId,
            details: `Element '${elementId}' is not focusable (add tabindex or use a focusable element type)`,
            timestamp,
            source: "ui",
        };
        loggingBus_1.globalLoggingBus.log({
            severity: "warning",
            category: "command",
            message: result.details,
            metadata: { payload, elementType: element.tagName },
        });
        return result;
    }
    try {
        const HTMLElementConstructor = typeof HTMLElement !== 'undefined' ? HTMLElement : globalThis.window?.HTMLElement;
        const isHTMLElement = HTMLElementConstructor ? element instanceof HTMLElementConstructor : element && 'focus' in element;
        if (isHTMLElement && 'focus' in element) {
            element.focus();
            // Verify focus was successful
            const focusSuccessful = document.activeElement === element;
            const result = {
                status: focusSuccessful
                    ? resolution.warnings.length > 0
                        ? "warning"
                        : "ok"
                    : "warning",
                requestId: payload.requestId,
                details: focusSuccessful
                    ? `Focused '${elementId}'`
                    : `Focus attempted on '${elementId}' but element did not receive focus`,
                timestamp,
                source: "ui",
                warnings: resolution.warnings.length > 0 ? resolution.warnings : undefined,
            };
            loggingBus_1.globalLoggingBus.log({
                severity: focusSuccessful ? "info" : "warning",
                category: "command",
                message: `focus command executed: ${elementId}`,
                metadata: {
                    payload,
                    focusSuccessful,
                    warnings: resolution.warnings,
                },
            });
            return result;
        }
        else {
            const result = {
                status: "warning",
                requestId: payload.requestId,
                details: `Element '${elementId}' is not an HTMLElement`,
                timestamp,
                source: "ui",
            };
            loggingBus_1.globalLoggingBus.log({
                severity: "warning",
                category: "command",
                message: result.details,
                metadata: { payload },
            });
            return result;
        }
    }
    catch (error) {
        const result = {
            status: "error",
            requestId: payload.requestId,
            details: `Focus failed: ${error instanceof Error ? error.message : String(error)}`,
            timestamp,
            source: "ui",
        };
        loggingBus_1.globalLoggingBus.log({
            severity: "error",
            category: "command",
            message: "focus command failed",
            metadata: {
                payload,
                error: error instanceof Error ? error.message : String(error),
            },
        });
        return result;
    }
}
//# sourceMappingURL=focus.js.map