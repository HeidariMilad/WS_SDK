"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveTargetByDataElementId = resolveTargetByDataElementId;
exports.resolveTargetBySelector = resolveTargetBySelector;
exports.resolveTarget = resolveTarget;
__exportStar(require("./types"), exports);
const DEFAULT_RETRY_COUNT = 5;
const DEFAULT_RETRY_INTERVAL_MS = 100;
/**
 * Wait for a given number of milliseconds.
 */
function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
/**
 * Escape a string for use in a CSS selector.
 * Fallback implementation for environments without CSS.escape.
 */
function escapeCSS(str) {
    if (typeof CSS !== "undefined" && CSS.escape) {
        return CSS.escape(str);
    }
    // Fallback: escape special CSS characters
    // eslint-disable-next-line no-useless-escape
    return str.replace(/(["'\\:.,\[\]#>+~*^$|])/g, "\\$1");
}
/**
 * Resolve an element by data-elementid attribute with retry logic.
 * Attempts up to `retries` times with `intervalMs` delay between attempts.
 *
 * @param elementId - The value of the data-elementid attribute to search for.
 * @param options - Retry configuration (defaults: 5 retries, 100ms interval).
 * @returns TargetResolutionResult with element or warnings.
 */
async function resolveTargetByDataElementId(elementId, options = {}) {
    const retries = options.retries ?? DEFAULT_RETRY_COUNT;
    const intervalMs = options.intervalMs ?? DEFAULT_RETRY_INTERVAL_MS;
    const warnings = [];
    let element = null;
    for (let attempt = 0; attempt < retries; attempt++) {
        // Escape elementId for safe CSS selector usage
        const escapedId = escapeCSS(elementId);
        element = document.querySelector(`[data-elementid="${escapedId}"]`);
        if (element)
            break;
        if (attempt < retries - 1) {
            await wait(intervalMs);
        }
    }
    if (!element) {
        warnings.push({
            elementId,
            reason: "not-found",
        });
    }
    return { element, warnings };
}
/**
 * Resolve an element by CSS selector with retry logic.
 * Attempts up to `retries` times with `intervalMs` delay between attempts.
 *
 * @param selector - CSS selector string.
 * @param options - Retry configuration (defaults: 5 retries, 100ms interval).
 * @returns TargetResolutionResult with element or warnings.
 */
async function resolveTargetBySelector(selector, options = {}) {
    const retries = options.retries ?? DEFAULT_RETRY_COUNT;
    const intervalMs = options.intervalMs ?? DEFAULT_RETRY_INTERVAL_MS;
    const warnings = [];
    let element = null;
    try {
        for (let attempt = 0; attempt < retries; attempt++) {
            element = document.querySelector(selector);
            if (element)
                break;
            if (attempt < retries - 1) {
                await wait(intervalMs);
            }
        }
    }
    catch (error) {
        warnings.push({
            selector,
            reason: "invalid-selector",
        });
        return { element: null, warnings };
    }
    if (!element) {
        warnings.push({
            selector,
            reason: "not-found",
        });
    }
    return { element, warnings };
}
/**
 * Unified target resolver supporting both data-elementid and selector fallback.
 *
 * Precedence rules:
 * 1. If `elementId` is provided, attempt resolution by data-elementid first.
 * 2. If that fails and `selector` is provided, attempt resolution by selector.
 * 3. If neither resolves, return null with appropriate warnings.
 *
 * Both resolution methods use the same retry strategy (5 attempts × 100ms by default).
 *
 * @param input - Targeting input with elementId, selector, and optional retry config.
 * @returns TargetResolutionResult with element or warnings.
 */
async function resolveTarget(input) {
    const warnings = [];
    const { elementId, selector, retries, intervalMs } = input;
    const retryOptions = { retries, intervalMs };
    // 1) Try data-elementid if present
    if (elementId) {
        const byId = await resolveTargetByDataElementId(elementId, retryOptions);
        warnings.push(...byId.warnings);
        if (byId.element) {
            return { element: byId.element, warnings };
        }
    }
    // 2) Fallback to selector if present
    if (selector) {
        const bySelector = await resolveTargetBySelector(selector, retryOptions);
        warnings.push(...bySelector.warnings);
        if (bySelector.element) {
            return { element: bySelector.element, warnings };
        }
    }
    // Neither elementId nor selector provided
    if (!elementId && !selector) {
        warnings.push({
            reason: "no-target-provided",
        });
    }
    return { element: null, warnings };
}
//# sourceMappingURL=index.js.map