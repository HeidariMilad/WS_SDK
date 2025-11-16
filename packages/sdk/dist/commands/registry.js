"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerCommandHandlers = registerCommandHandlers;
const navigate_1 = require("./navigate");
const refresh_element_1 = require("./refresh-element");
const highlight_1 = require("./highlight");
const hover_1 = require("./hover");
const focus_1 = require("./focus");
const scroll_1 = require("./scroll");
const loggingBus_1 = require("../logging/loggingBus");
/**
 * Register all command handlers with the dispatcher.
 *
 * Registers: navigate, refresh_element, highlight, hover, focus, scroll
 *
 * @param dispatcher - Command dispatcher instance
 * @param router - Optional navigation router (required for navigate command)
 * @returns Cleanup function to unregister all handlers
 */
function registerCommandHandlers(dispatcher, router) {
    const unregisterFns = [];
    // Register navigate command
    if (router) {
        (0, navigate_1.registerNavigationRouter)(router);
    }
    const unregisterNavigate = dispatcher.register("navigate", (payload) => {
        const result = (0, navigate_1.handleNavigate)(payload);
        if (result.status === "error" || result.status === "warning") {
            loggingBus_1.globalLoggingBus.log({
                severity: result.status === "error" ? "error" : "warning",
                category: "command",
                message: result.details,
                result,
                metadata: { payload },
            });
        }
    });
    unregisterFns.push(unregisterNavigate);
    // Register refresh_element command
    const unregisterRefresh = dispatcher.register("refresh_element", (payload) => {
        // handleRefreshElement is async, so we handle the promise
        (0, refresh_element_1.handleRefreshElement)(payload)
            .then((result) => {
            if (result.status === "error" || result.status === "warning") {
                loggingBus_1.globalLoggingBus.log({
                    severity: result.status === "error" ? "error" : "warning",
                    category: "command",
                    message: result.details,
                    result,
                    metadata: { payload },
                });
            }
        })
            .catch((error) => {
            loggingBus_1.globalLoggingBus.log({
                severity: "error",
                category: "command",
                message: "refresh_element handler threw unexpected error",
                metadata: {
                    payload,
                    error: error instanceof Error ? error.message : String(error),
                },
            });
        });
    });
    unregisterFns.push(unregisterRefresh);
    // Register highlight command
    const unregisterHighlight = dispatcher.register("highlight", (payload) => {
        (0, highlight_1.handleHighlight)(payload)
            .then((result) => {
            if (result.status === "error" || result.status === "warning") {
                loggingBus_1.globalLoggingBus.log({
                    severity: result.status === "error" ? "error" : "warning",
                    category: "command",
                    message: result.details,
                    result,
                    metadata: { payload },
                });
            }
        })
            .catch((error) => {
            loggingBus_1.globalLoggingBus.log({
                severity: "error",
                category: "command",
                message: "highlight handler threw unexpected error",
                metadata: {
                    payload,
                    error: error instanceof Error ? error.message : String(error),
                },
            });
        });
    });
    unregisterFns.push(unregisterHighlight);
    // Register hover command
    const unregisterHover = dispatcher.register("hover", (payload) => {
        (0, hover_1.handleHover)(payload)
            .then((result) => {
            if (result.status === "error" || result.status === "warning") {
                loggingBus_1.globalLoggingBus.log({
                    severity: result.status === "error" ? "error" : "warning",
                    category: "command",
                    message: result.details,
                    result,
                    metadata: { payload },
                });
            }
        })
            .catch((error) => {
            loggingBus_1.globalLoggingBus.log({
                severity: "error",
                category: "command",
                message: "hover handler threw unexpected error",
                metadata: {
                    payload,
                    error: error instanceof Error ? error.message : String(error),
                },
            });
        });
    });
    unregisterFns.push(unregisterHover);
    // Register focus command
    const unregisterFocus = dispatcher.register("focus", (payload) => {
        (0, focus_1.handleFocus)(payload)
            .then((result) => {
            if (result.status === "error" || result.status === "warning") {
                loggingBus_1.globalLoggingBus.log({
                    severity: result.status === "error" ? "error" : "warning",
                    category: "command",
                    message: result.details,
                    result,
                    metadata: { payload },
                });
            }
        })
            .catch((error) => {
            loggingBus_1.globalLoggingBus.log({
                severity: "error",
                category: "command",
                message: "focus handler threw unexpected error",
                metadata: {
                    payload,
                    error: error instanceof Error ? error.message : String(error),
                },
            });
        });
    });
    unregisterFns.push(unregisterFocus);
    // Register scroll command
    const unregisterScroll = dispatcher.register("scroll", (payload) => {
        (0, scroll_1.handleScroll)(payload)
            .then((result) => {
            if (result.status === "error" || result.status === "warning") {
                loggingBus_1.globalLoggingBus.log({
                    severity: result.status === "error" ? "error" : "warning",
                    category: "command",
                    message: result.details,
                    result,
                    metadata: { payload },
                });
            }
        })
            .catch((error) => {
            loggingBus_1.globalLoggingBus.log({
                severity: "error",
                category: "command",
                message: "scroll handler threw unexpected error",
                metadata: {
                    payload,
                    error: error instanceof Error ? error.message : String(error),
                },
            });
        });
    });
    unregisterFns.push(unregisterScroll);
    // Return cleanup function
    return () => {
        unregisterFns.forEach((fn) => fn());
    };
}
//# sourceMappingURL=registry.js.map