"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleClick = handleClick;
const loggingBus_1 = require("../logging/loggingBus");
const targeting_1 = require("../targeting");
/**
 * Default click configuration.
 */
const DEFAULT_CLICK_OPTIONS = {
    button: 0, // Left click
    shiftKey: false,
    ctrlKey: false,
    altKey: false,
    metaKey: false,
};
/**
 * Cross-environment MouseEvent constructor access.
 * Handles both browser and JSDOM environments.
 */
const getMouseEventConstructor = () => {
    if (typeof MouseEvent !== "undefined") {
        return MouseEvent;
    }
    return globalThis
        .window?.MouseEvent;
};
/**
 * Click command handler.
 *
 * Dispatches realistic pointer events (mousedown → mouseup → click) on the target element
 * to simulate user interaction, ensuring event handlers and state updates are triggered.
 *
 * Payload format:
 * - `payload.options.button`: number (0=left, 1=middle, 2=right, default: 0)
 * - `payload.options.shiftKey`: boolean (default: false)
 * - `payload.options.ctrlKey`: boolean (default: false)
 * - `payload.options.altKey`: boolean (default: false)
 * - `payload.options.metaKey`: boolean (default: false)
 *
 * @param payload - Command payload with elementId
 * @returns Promise<CommandResult> indicating success or warnings
 */
async function handleClick(payload) {
    const timestamp = Date.now();
    // Validate elementId is provided
    if (!payload.elementId) {
        const result = {
            status: "warning",
            requestId: payload.requestId,
            details: "click command requires elementId",
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
    const config = {
        button: options.button ?? DEFAULT_CLICK_OPTIONS.button,
        shiftKey: options.shiftKey ?? DEFAULT_CLICK_OPTIONS.shiftKey,
        ctrlKey: options.ctrlKey ?? DEFAULT_CLICK_OPTIONS.ctrlKey,
        altKey: options.altKey ?? DEFAULT_CLICK_OPTIONS.altKey,
        metaKey: options.metaKey ?? DEFAULT_CLICK_OPTIONS.metaKey,
    };
    // Resolve target element
    const resolution = await (0, targeting_1.resolveTarget)({ elementId });
    if (!resolution.element) {
        const result = {
            status: "warning",
            requestId: payload.requestId,
            details: `Element '${elementId}' not found for click`,
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
        const MouseEventConstructor = getMouseEventConstructor();
        if (!MouseEventConstructor) {
            const result = {
                status: "error",
                requestId: payload.requestId,
                details: "MouseEvent constructor not available in this environment",
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
        // Get element position for event coordinates
        const rect = element.getBoundingClientRect();
        const clientX = rect.left + rect.width / 2;
        const clientY = rect.top + rect.height / 2;
        const eventOptions = {
            bubbles: true,
            cancelable: true,
            view: typeof window !== "undefined" ? window : undefined,
            button: config.button,
            buttons: 1 << config.button, // Bitmask for pressed buttons
            clientX,
            clientY,
            shiftKey: config.shiftKey,
            ctrlKey: config.ctrlKey,
            altKey: config.altKey,
            metaKey: config.metaKey,
        };
        // Dispatch realistic event sequence: mousedown → mouseup → click
        const mousedownEvent = new MouseEventConstructor("mousedown", eventOptions);
        element.dispatchEvent(mousedownEvent);
        const mouseupEvent = new MouseEventConstructor("mouseup", eventOptions);
        element.dispatchEvent(mouseupEvent);
        const clickEvent = new MouseEventConstructor("click", eventOptions);
        element.dispatchEvent(clickEvent);
        const result = {
            status: resolution.warnings.length > 0 ? "warning" : "ok",
            requestId: payload.requestId,
            details: `Clicked '${elementId}' (button: ${config.button})`,
            timestamp,
            source: "ui",
            warnings: resolution.warnings.length > 0 ? resolution.warnings : undefined,
        };
        loggingBus_1.globalLoggingBus.log({
            severity: "info",
            category: "command",
            message: `click command executed: ${elementId}`,
            metadata: {
                payload,
                config,
                warnings: resolution.warnings,
            },
        });
        return result;
    }
    catch (error) {
        const result = {
            status: "error",
            requestId: payload.requestId,
            details: `Click failed: ${error instanceof Error ? error.message : String(error)}`,
            timestamp,
            source: "ui",
        };
        loggingBus_1.globalLoggingBus.log({
            severity: "error",
            category: "command",
            message: "click command failed",
            metadata: {
                payload,
                error: error instanceof Error ? error.message : String(error),
            },
        });
        return result;
    }
}
//# sourceMappingURL=click.js.map