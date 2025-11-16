"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerCommandHandlers = registerCommandHandlers;
const navigate_1 = require("./navigate");
const refresh_element_1 = require("./refresh-element");
const loggingBus_1 = require("../logging/loggingBus");
/**
 * Register navigate and refresh_element command handlers with the dispatcher.
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
    // Return cleanup function
    return () => {
        unregisterFns.forEach((fn) => fn());
    };
}
//# sourceMappingURL=registry.js.map