"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerNavigationRouter = registerNavigationRouter;
exports.unregisterNavigationRouter = unregisterNavigationRouter;
exports.handleNavigate = handleNavigate;
const loggingBus_1 = require("../logging/loggingBus");
let navigationRouter = null;
/**
 * Register a navigation router (e.g., Next.js useRouter) for the SDK to use.
 * Must be called before navigate commands are dispatched.
 *
 * @param router - Router instance with push/replace methods
 */
function registerNavigationRouter(router) {
    navigationRouter = router;
}
/**
 * Unregister the navigation router.
 */
function unregisterNavigationRouter() {
    navigationRouter = null;
}
/**
 * Extract the destination path from the command payload.
 * Supports both `payload.value` and `payload.options.path` formats.
 *
 * @param payload - Command payload
 * @returns Destination path or null if not found
 */
function extractDestinationPath(payload) {
    if (!payload.payload)
        return null;
    const data = payload.payload;
    // Try payload.value first (simple string format)
    if (typeof data.value === "string") {
        return data.value;
    }
    // Try payload.options.path (structured format)
    if (data.options && typeof data.options === "object") {
        const options = data.options;
        if (typeof options.path === "string") {
            return options.path;
        }
    }
    return null;
}
/**
 * Navigate command handler.
 *
 * Performs SPA-style navigation using the registered router (e.g., Next.js).
 * Does not trigger full page reloads.
 *
 * Payload format:
 * - `payload.value`: string (destination path)
 * - OR `payload.options.path`: string (destination path)
 * - Optional `payload.options.replace`: boolean (use replace instead of push)
 *
 * @param payload - Command payload
 * @returns CommandResult indicating success or failure
 */
function handleNavigate(payload) {
    const timestamp = Date.now();
    // Check if router is registered
    if (!navigationRouter) {
        const result = {
            status: "warning",
            requestId: payload.requestId,
            details: "Navigation router not registered. Call registerNavigationRouter() first.",
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
    // Extract destination path
    const path = extractDestinationPath(payload);
    if (!path) {
        const result = {
            status: "warning",
            requestId: payload.requestId,
            details: "Navigate command missing destination path in payload.value or payload.options.path",
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
    // Determine whether to use push or replace
    const data = payload.payload;
    const options = data.options || {};
    const useReplace = options.replace === true && navigationRouter.replace;
    try {
        // Perform navigation
        if (useReplace && navigationRouter.replace) {
            navigationRouter.replace(path);
        }
        else {
            navigationRouter.push(path);
        }
        const result = {
            status: "ok",
            requestId: payload.requestId,
            details: `Navigated to: ${path}`,
            timestamp,
            source: "ui",
        };
        loggingBus_1.globalLoggingBus.log({
            severity: "info",
            category: "command",
            message: `navigate command executed: ${path}`,
            metadata: { payload, destination: path, method: useReplace ? "replace" : "push" },
        });
        return result;
    }
    catch (error) {
        const result = {
            status: "error",
            requestId: payload.requestId,
            details: `Navigation failed: ${error instanceof Error ? error.message : String(error)}`,
            timestamp,
            source: "ui",
        };
        loggingBus_1.globalLoggingBus.log({
            severity: "error",
            category: "command",
            message: "navigate command failed",
            metadata: { payload, error: error instanceof Error ? error.message : String(error) },
        });
        return result;
    }
}
//# sourceMappingURL=navigate.js.map