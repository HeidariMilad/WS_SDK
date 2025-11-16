"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleFill = handleFill;
const loggingBus_1 = require("../logging/loggingBus");
const targeting_1 = require("../targeting");
/**
 * Cross-environment Event constructor access.
 * Handles both browser and JSDOM environments.
 */
const getEventConstructor = () => {
    if (typeof Event !== "undefined") {
        return Event;
    }
    return globalThis
        .window?.Event;
};
/**
 * Fill command handler.
 *
 * Sets the value of input or textarea elements and dispatches input and change events
 * to ensure React/Next.js state updates correctly and event handlers are triggered.
 *
 * Payload format:
 * - `payload.options.value`: string (required) - The value to set
 *
 * @param payload - Command payload with elementId and value
 * @returns Promise<CommandResult> indicating success or warnings
 */
async function handleFill(payload) {
    const timestamp = Date.now();
    // Validate elementId is provided
    if (!payload.elementId) {
        const result = {
            status: "warning",
            requestId: payload.requestId,
            details: "fill command requires elementId",
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
    // Parse options from payload
    const data = payload.payload || {};
    const options = data.options || {};
    if (options.value === undefined) {
        const result = {
            status: "warning",
            requestId: payload.requestId,
            details: "fill command requires 'value' in options",
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
    const value = String(options.value);
    // Resolve target element
    const resolution = await (0, targeting_1.resolveTarget)({ elementId });
    if (!resolution.element) {
        const result = {
            status: "warning",
            requestId: payload.requestId,
            details: `Element '${elementId}' not found for fill`,
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
    try {
        // Get cross-environment constructors
        const HTMLInputElementConstructor = typeof HTMLInputElement !== "undefined"
            ? HTMLInputElement
            : globalThis.window?.HTMLInputElement;
        const HTMLTextAreaElementConstructor = typeof HTMLTextAreaElement !== "undefined"
            ? HTMLTextAreaElement
            : globalThis.window?.HTMLTextAreaElement;
        // Validate element is fillable (input or textarea)
        const isInput = HTMLInputElementConstructor && element instanceof HTMLInputElementConstructor;
        const isTextArea = HTMLTextAreaElementConstructor && element instanceof HTMLTextAreaElementConstructor;
        if (!isInput && !isTextArea) {
            const result = {
                status: "warning",
                requestId: payload.requestId,
                details: `Element '${elementId}' is not an input or textarea`,
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
        // Check if element is disabled
        if ("disabled" in element && element.disabled) {
            const result = {
                status: "warning",
                requestId: payload.requestId,
                details: `Element '${elementId}' is disabled`,
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
        const EventConstructor = getEventConstructor();
        if (!EventConstructor) {
            const result = {
                status: "error",
                requestId: payload.requestId,
                details: "Event constructor not available in this environment",
                timestamp,
                source: "ui",
            };
            loggingBus_1.globalLoggingBus.log({
                severity: "error",
                category: "command",
                message: result.details,
                metadata: { payload },
            });
            return result;
        }
        // Store old value for comparison
        const oldValue = element.value;
        // Set the value directly on the element
        element.value = value;
        // Dispatch input event (fired during typing)
        const inputEvent = new EventConstructor("input", {
            bubbles: true,
            cancelable: true,
        });
        element.dispatchEvent(inputEvent);
        // Dispatch change event (fired when input loses focus after value change)
        // Only dispatch if value actually changed
        if (oldValue !== value) {
            const changeEvent = new EventConstructor("change", {
                bubbles: true,
                cancelable: true,
            });
            element.dispatchEvent(changeEvent);
        }
        const result = {
            status: resolution.warnings.length > 0 ? "warning" : "ok",
            requestId: payload.requestId,
            details: `Filled '${elementId}' with value "${value.substring(0, 50)}${value.length > 50 ? "..." : ""}"`,
            timestamp,
            source: "ui",
            warnings: resolution.warnings.length > 0 ? resolution.warnings : undefined,
        };
        loggingBus_1.globalLoggingBus.log({
            severity: "info",
            category: "command",
            message: `fill command executed: ${elementId}`,
            metadata: {
                payload,
                valueLength: value.length,
                warnings: resolution.warnings,
            },
        });
        return result;
    }
    catch (error) {
        const result = {
            status: "error",
            requestId: payload.requestId,
            details: `Fill failed: ${error instanceof Error ? error.message : String(error)}`,
            timestamp,
            source: "ui",
        };
        loggingBus_1.globalLoggingBus.log({
            severity: "error",
            category: "command",
            message: "fill command failed",
            metadata: {
                payload,
                error: error instanceof Error ? error.message : String(error),
            },
        });
        return result;
    }
}
//# sourceMappingURL=fill.js.map