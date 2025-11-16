"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleSelect = handleSelect;
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
 * Select command handler.
 *
 * Updates select/dropdown elements by value, index, or label, dispatching
 * appropriate input and change events to trigger React/Next.js state updates.
 *
 * Payload format:
 * - `payload.options.value`: string - Select option by value attribute
 * - `payload.options.index`: number - Select option by index
 * - `payload.options.label`: string - Select option by text label
 *
 * At least one of value, index, or label must be provided.
 *
 * @param payload - Command payload with elementId and selection criteria
 * @returns Promise<CommandResult> indicating success or warnings
 */
async function handleSelect(payload) {
    const timestamp = Date.now();
    // Validate elementId is provided
    if (!payload.elementId) {
        const result = {
            status: "warning",
            requestId: payload.requestId,
            details: "select command requires elementId",
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
    if (options.value === undefined && options.index === undefined && options.label === undefined) {
        const result = {
            status: "warning",
            requestId: payload.requestId,
            details: "select command requires at least one of: value, index, or label in options",
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
    // Resolve target element
    const resolution = await (0, targeting_1.resolveTarget)({ elementId });
    if (!resolution.element) {
        const result = {
            status: "warning",
            requestId: payload.requestId,
            details: `Element '${elementId}' not found for select`,
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
        // Get cross-environment constructor
        const HTMLSelectElementConstructor = typeof HTMLSelectElement !== "undefined"
            ? HTMLSelectElement
            : globalThis.window?.HTMLSelectElement;
        // Validate element is a select
        const isSelect = HTMLSelectElementConstructor && element instanceof HTMLSelectElementConstructor;
        if (!isSelect) {
            const result = {
                status: "warning",
                requestId: payload.requestId,
                details: `Element '${elementId}' is not a select element`,
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
        const selectElement = element;
        // Check if element is disabled
        if (selectElement.disabled) {
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
        const oldValue = selectElement.value;
        let found = false;
        let selectedBy = "";
        // Try to select by value first
        if (options.value !== undefined) {
            for (let i = 0; i < selectElement.options.length; i++) {
                if (selectElement.options[i].value === options.value) {
                    selectElement.selectedIndex = i;
                    found = true;
                    selectedBy = `value="${options.value}"`;
                    break;
                }
            }
        }
        // If not found and index is provided, try by index
        if (!found && options.index !== undefined) {
            if (options.index >= 0 && options.index < selectElement.options.length) {
                selectElement.selectedIndex = options.index;
                found = true;
                selectedBy = `index=${options.index}`;
            }
        }
        // If still not found and label is provided, try by label
        if (!found && options.label !== undefined) {
            for (let i = 0; i < selectElement.options.length; i++) {
                if (selectElement.options[i].text === options.label) {
                    selectElement.selectedIndex = i;
                    found = true;
                    selectedBy = `label="${options.label}"`;
                    break;
                }
            }
        }
        if (!found) {
            const result = {
                status: "warning",
                requestId: payload.requestId,
                details: `No option found matching criteria for '${elementId}'`,
                timestamp,
                source: "ui",
            };
            loggingBus_1.globalLoggingBus.log({
                severity: "warning",
                category: "command",
                message: result.details,
                metadata: { payload, options },
            });
            return result;
        }
        // Dispatch input event
        const inputEvent = new EventConstructor("input", {
            bubbles: true,
            cancelable: true,
        });
        selectElement.dispatchEvent(inputEvent);
        // Dispatch change event if value actually changed
        const newValue = selectElement.value;
        if (oldValue !== newValue) {
            const changeEvent = new EventConstructor("change", {
                bubbles: true,
                cancelable: true,
            });
            selectElement.dispatchEvent(changeEvent);
        }
        const result = {
            status: resolution.warnings.length > 0 ? "warning" : "ok",
            requestId: payload.requestId,
            details: `Selected option in '${elementId}' by ${selectedBy}`,
            timestamp,
            source: "ui",
            warnings: resolution.warnings.length > 0 ? resolution.warnings : undefined,
        };
        loggingBus_1.globalLoggingBus.log({
            severity: "info",
            category: "command",
            message: `select command executed: ${elementId}`,
            metadata: {
                payload,
                selectedBy,
                oldValue,
                newValue,
                warnings: resolution.warnings,
            },
        });
        return result;
    }
    catch (error) {
        const result = {
            status: "error",
            requestId: payload.requestId,
            details: `Select failed: ${error instanceof Error ? error.message : String(error)}`,
            timestamp,
            source: "ui",
        };
        loggingBus_1.globalLoggingBus.log({
            severity: "error",
            category: "command",
            message: "select command failed",
            metadata: {
                payload,
                error: error instanceof Error ? error.message : String(error),
            },
        });
        return result;
    }
}
//# sourceMappingURL=select.js.map