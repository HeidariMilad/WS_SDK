"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleOpen = handleOpen;
exports.handleClose = handleClose;
const loggingBus_1 = require("../logging/loggingBus");
const targeting_1 = require("../targeting");
/**
 * Open command handler.
 *
 * Opens modals, panels, or drawers by dispatching a custom "sdk-open" event
 * that host applications can listen for. The host app is responsible for
 * managing the actual UI state and accessibility.
 *
 * Payload format:
 * - `payload.options.type`: string - Type of component (modal/drawer/panel)
 * - `payload.options.data`: object - Data to pass to component
 *
 * @param payload - Command payload with elementId or component identifier
 * @returns Promise<CommandResult> indicating success or warnings
 */
async function handleOpen(payload) {
    const timestamp = Date.now();
    // Parse options from payload
    const data = payload.payload || {};
    const options = data.options || {};
    // If elementId is provided, try to resolve and dispatch event on it
    if (payload.elementId) {
        const resolution = await (0, targeting_1.resolveTarget)({ elementId: payload.elementId });
        if (!resolution.element) {
            const result = {
                status: "warning",
                requestId: payload.requestId,
                details: `Element '${payload.elementId}' not found for open`,
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
            // Dispatch custom event that host app can listen for
            const openEvent = new CustomEvent("sdk-open", {
                bubbles: true,
                detail: {
                    type: options.type,
                    data: options.data,
                    elementId: payload.elementId,
                },
            });
            element.dispatchEvent(openEvent);
            const result = {
                status: resolution.warnings.length > 0 ? "warning" : "ok",
                requestId: payload.requestId,
                details: `Dispatched open event on '${payload.elementId}'${options.type ? ` (type: ${options.type})` : ""}`,
                timestamp,
                source: "ui",
                warnings: resolution.warnings.length > 0 ? resolution.warnings : undefined,
            };
            loggingBus_1.globalLoggingBus.log({
                severity: "info",
                category: "command",
                message: `open command executed: ${payload.elementId}`,
                metadata: {
                    payload,
                    options,
                    warnings: resolution.warnings,
                },
            });
            return result;
        }
        catch (error) {
            const result = {
                status: "error",
                requestId: payload.requestId,
                details: `Open failed: ${error instanceof Error ? error.message : String(error)}`,
                timestamp,
                source: "ui",
            };
            loggingBus_1.globalLoggingBus.log({
                severity: "error",
                category: "command",
                message: "open command failed",
                metadata: {
                    payload,
                    error: error instanceof Error ? error.message : String(error),
                },
            });
            return result;
        }
    }
    // If no elementId, dispatch global event on document
    try {
        const openEvent = new CustomEvent("sdk-open", {
            bubbles: true,
            detail: {
                type: options.type,
                data: options.data,
            },
        });
        document.dispatchEvent(openEvent);
        const result = {
            status: "ok",
            requestId: payload.requestId,
            details: `Dispatched global open event${options.type ? ` (type: ${options.type})` : ""}`,
            timestamp,
            source: "ui",
        };
        loggingBus_1.globalLoggingBus.log({
            severity: "info",
            category: "command",
            message: "open command executed (global)",
            metadata: {
                payload,
                options,
            },
        });
        return result;
    }
    catch (error) {
        const result = {
            status: "error",
            requestId: payload.requestId,
            details: `Open failed: ${error instanceof Error ? error.message : String(error)}`,
            timestamp,
            source: "ui",
        };
        loggingBus_1.globalLoggingBus.log({
            severity: "error",
            category: "command",
            message: "open command failed",
            metadata: {
                payload,
                error: error instanceof Error ? error.message : String(error),
            },
        });
        return result;
    }
}
/**
 * Close command handler.
 *
 * Closes modals, panels, or drawers by dispatching a custom "sdk-close" event
 * that host applications can listen for. The host app is responsible for
 * managing the actual UI state and accessibility.
 *
 * @param payload - Command payload with elementId or component identifier
 * @returns Promise<CommandResult> indicating success or warnings
 */
async function handleClose(payload) {
    const timestamp = Date.now();
    // If elementId is provided, try to resolve and dispatch event on it
    if (payload.elementId) {
        const resolution = await (0, targeting_1.resolveTarget)({ elementId: payload.elementId });
        if (!resolution.element) {
            const result = {
                status: "warning",
                requestId: payload.requestId,
                details: `Element '${payload.elementId}' not found for close`,
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
            // Dispatch custom event that host app can listen for
            const closeEvent = new CustomEvent("sdk-close", {
                bubbles: true,
                detail: {
                    elementId: payload.elementId,
                },
            });
            element.dispatchEvent(closeEvent);
            const result = {
                status: resolution.warnings.length > 0 ? "warning" : "ok",
                requestId: payload.requestId,
                details: `Dispatched close event on '${payload.elementId}'`,
                timestamp,
                source: "ui",
                warnings: resolution.warnings.length > 0 ? resolution.warnings : undefined,
            };
            loggingBus_1.globalLoggingBus.log({
                severity: "info",
                category: "command",
                message: `close command executed: ${payload.elementId}`,
                metadata: {
                    payload,
                    warnings: resolution.warnings,
                },
            });
            return result;
        }
        catch (error) {
            const result = {
                status: "error",
                requestId: payload.requestId,
                details: `Close failed: ${error instanceof Error ? error.message : String(error)}`,
                timestamp,
                source: "ui",
            };
            loggingBus_1.globalLoggingBus.log({
                severity: "error",
                category: "command",
                message: "close command failed",
                metadata: {
                    payload,
                    error: error instanceof Error ? error.message : String(error),
                },
            });
            return result;
        }
    }
    // If no elementId, dispatch global event on document
    try {
        const closeEvent = new CustomEvent("sdk-close", {
            bubbles: true,
            detail: {},
        });
        document.dispatchEvent(closeEvent);
        const result = {
            status: "ok",
            requestId: payload.requestId,
            details: "Dispatched global close event",
            timestamp,
            source: "ui",
        };
        loggingBus_1.globalLoggingBus.log({
            severity: "info",
            category: "command",
            message: "close command executed (global)",
            metadata: {
                payload,
            },
        });
        return result;
    }
    catch (error) {
        const result = {
            status: "error",
            requestId: payload.requestId,
            details: `Close failed: ${error instanceof Error ? error.message : String(error)}`,
            timestamp,
            source: "ui",
        };
        loggingBus_1.globalLoggingBus.log({
            severity: "error",
            category: "command",
            message: "close command failed",
            metadata: {
                payload,
                error: error instanceof Error ? error.message : String(error),
            },
        });
        return result;
    }
}
//# sourceMappingURL=open-close.js.map