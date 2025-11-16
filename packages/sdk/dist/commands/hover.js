"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleHover = handleHover;
const loggingBus_1 = require("../logging/loggingBus");
const targeting_1 = require("../targeting");
/**
 * Default hover configuration.
 */
const DEFAULT_HOVER_OPTIONS = {
    duration: 1000, // milliseconds
};
/**
 * CSS class applied during synthetic hover.
 */
const HOVER_CLASS = "sdk-hover-active";
/**
 * Active hover cleanup timers, keyed by element.
 */
const activeHovers = new WeakMap();
/**
 * Hover command handler.
 *
 * Programmatically triggers hover behavior on the target element for a given duration.
 * Uses both event dispatching and CSS class toggling to simulate user hover.
 * Cleans up events and classes after the duration expires.
 *
 * Payload format:
 * - `payload.options.duration`: number in milliseconds (default: 1000)
 *
 * @param payload - Command payload with elementId
 * @returns Promise<CommandResult> indicating success or warnings
 */
async function handleHover(payload) {
    const timestamp = Date.now();
    // Validate elementId is provided
    if (!payload.elementId) {
        const result = {
            status: "warning",
            requestId: payload.requestId,
            details: "hover command requires elementId",
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
        duration: options.duration ?? DEFAULT_HOVER_OPTIONS.duration,
    };
    // Resolve target element
    const resolution = await (0, targeting_1.resolveTarget)({ elementId });
    if (!resolution.element) {
        const result = {
            status: "warning",
            requestId: payload.requestId,
            details: `Element '${elementId}' not found for hover`,
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
        // Clear any existing hover timeout for this element
        const existingTimeout = activeHovers.get(element);
        if (existingTimeout) {
            clearTimeout(existingTimeout);
            element.classList.remove(HOVER_CLASS);
        }
        // Add hover class
        element.classList.add(HOVER_CLASS);
        // Dispatch mouseenter and mouseover events
        // Handle both browser and JSDOM environments
        const MouseEventConstructor = typeof MouseEvent !== 'undefined' ? MouseEvent : globalThis.window?.MouseEvent;
        if (MouseEventConstructor) {
            const mouseEnterEvent = new MouseEventConstructor("mouseenter", {
                bubbles: true,
                cancelable: true,
                view: window,
            });
            const mouseOverEvent = new MouseEventConstructor("mouseover", {
                bubbles: true,
                cancelable: true,
                view: window,
            });
            element.dispatchEvent(mouseEnterEvent);
            element.dispatchEvent(mouseOverEvent);
        }
        // Schedule cleanup
        const timeoutId = window.setTimeout(() => {
            // Remove hover class
            element.classList.remove(HOVER_CLASS);
            // Dispatch mouseleave and mouseout events
            const MouseEventConstructor = typeof MouseEvent !== 'undefined' ? MouseEvent : globalThis.window?.MouseEvent;
            if (MouseEventConstructor) {
                const mouseLeaveEvent = new MouseEventConstructor("mouseleave", {
                    bubbles: true,
                    cancelable: true,
                    view: window,
                });
                const mouseOutEvent = new MouseEventConstructor("mouseout", {
                    bubbles: true,
                    cancelable: true,
                    view: window,
                });
                element.dispatchEvent(mouseLeaveEvent);
                element.dispatchEvent(mouseOutEvent);
            }
            // Remove from active hovers
            activeHovers.delete(element);
            loggingBus_1.globalLoggingBus.log({
                severity: "info",
                category: "command",
                message: `hover cleanup completed for '${elementId}'`,
                metadata: { elementId, duration: config.duration },
            });
        }, config.duration);
        activeHovers.set(element, timeoutId);
        const result = {
            status: resolution.warnings.length > 0 ? "warning" : "ok",
            requestId: payload.requestId,
            details: `Hovering '${elementId}' for ${config.duration}ms`,
            timestamp,
            source: "ui",
            warnings: resolution.warnings.length > 0 ? resolution.warnings : undefined,
        };
        loggingBus_1.globalLoggingBus.log({
            severity: "info",
            category: "command",
            message: `hover command executed: ${elementId}`,
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
            details: `Hover failed: ${error instanceof Error ? error.message : String(error)}`,
            timestamp,
            source: "ui",
        };
        loggingBus_1.globalLoggingBus.log({
            severity: "error",
            category: "command",
            message: "hover command failed",
            metadata: {
                payload,
                error: error instanceof Error ? error.message : String(error),
            },
        });
        return result;
    }
}
//# sourceMappingURL=hover.js.map