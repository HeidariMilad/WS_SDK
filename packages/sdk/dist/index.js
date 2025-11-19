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
exports.formatPromptError = exports.configurePromptWorkflow = exports.getChatbotBridge = exports.setChatbotBridge = exports.getOverlayConfigByElement = exports.getOverlayConfig = exports.detachAllAiButtons = exports.updateAiButton = exports.detachAiButtonByElement = exports.detachAiButton = exports.attachAiButton = exports.registerCommandHandlers = exports.registerRefreshCallback = exports.handleRefreshElement = exports.unregisterNavigationRouter = exports.registerNavigationRouter = exports.handleNavigate = exports.clearAllOverlays = exports.stopTargetingObserver = exports.startTargetingObserver = exports.unregisterOverlay = exports.registerOverlay = exports.getTargetingGuidance = exports.buildWarningMessage = exports.resolveTargetBySelector = exports.resolveTargetByDataElementId = exports.resolveTarget = exports.createWebSocketCommandClient = exports.CommandDispatcher = exports.WebSocketConnection = void 0;
exports.placeholderSdk = placeholderSdk;
function placeholderSdk() {
    return "frontend-ui-command-sdk placeholder";
}
__exportStar(require("./logging/loggingBus"), exports);
__exportStar(require("./core/connection/types"), exports);
var webSocketConnection_1 = require("./core/connection/webSocketConnection");
Object.defineProperty(exports, "WebSocketConnection", { enumerable: true, get: function () { return webSocketConnection_1.WebSocketConnection; } });
var dispatcher_1 = require("./core/command-pipeline/dispatcher");
Object.defineProperty(exports, "CommandDispatcher", { enumerable: true, get: function () { return dispatcher_1.CommandDispatcher; } });
var webSocketCommandClient_1 = require("./core/command-pipeline/webSocketCommandClient");
Object.defineProperty(exports, "createWebSocketCommandClient", { enumerable: true, get: function () { return webSocketCommandClient_1.createWebSocketCommandClient; } });
// Targeting utilities
var targeting_1 = require("./targeting");
Object.defineProperty(exports, "resolveTarget", { enumerable: true, get: function () { return targeting_1.resolveTarget; } });
Object.defineProperty(exports, "resolveTargetByDataElementId", { enumerable: true, get: function () { return targeting_1.resolveTargetByDataElementId; } });
Object.defineProperty(exports, "resolveTargetBySelector", { enumerable: true, get: function () { return targeting_1.resolveTargetBySelector; } });
var utils_1 = require("./targeting/utils");
Object.defineProperty(exports, "buildWarningMessage", { enumerable: true, get: function () { return utils_1.buildWarningMessage; } });
Object.defineProperty(exports, "getTargetingGuidance", { enumerable: true, get: function () { return utils_1.getTargetingGuidance; } });
var lifecycle_1 = require("./targeting/lifecycle");
Object.defineProperty(exports, "registerOverlay", { enumerable: true, get: function () { return lifecycle_1.registerOverlay; } });
Object.defineProperty(exports, "unregisterOverlay", { enumerable: true, get: function () { return lifecycle_1.unregisterOverlay; } });
Object.defineProperty(exports, "startTargetingObserver", { enumerable: true, get: function () { return lifecycle_1.startTargetingObserver; } });
Object.defineProperty(exports, "stopTargetingObserver", { enumerable: true, get: function () { return lifecycle_1.stopTargetingObserver; } });
Object.defineProperty(exports, "clearAllOverlays", { enumerable: true, get: function () { return lifecycle_1.clearAllOverlays; } });
// Command handlers
var navigate_1 = require("./commands/navigate");
Object.defineProperty(exports, "handleNavigate", { enumerable: true, get: function () { return navigate_1.handleNavigate; } });
Object.defineProperty(exports, "registerNavigationRouter", { enumerable: true, get: function () { return navigate_1.registerNavigationRouter; } });
Object.defineProperty(exports, "unregisterNavigationRouter", { enumerable: true, get: function () { return navigate_1.unregisterNavigationRouter; } });
var refresh_element_1 = require("./commands/refresh-element");
Object.defineProperty(exports, "handleRefreshElement", { enumerable: true, get: function () { return refresh_element_1.handleRefreshElement; } });
Object.defineProperty(exports, "registerRefreshCallback", { enumerable: true, get: function () { return refresh_element_1.registerRefreshCallback; } });
var registry_1 = require("./commands/registry");
Object.defineProperty(exports, "registerCommandHandlers", { enumerable: true, get: function () { return registry_1.registerCommandHandlers; } });
// AI Overlay module
var ai_overlay_1 = require("./ai-overlay");
Object.defineProperty(exports, "attachAiButton", { enumerable: true, get: function () { return ai_overlay_1.attachAiButton; } });
Object.defineProperty(exports, "detachAiButton", { enumerable: true, get: function () { return ai_overlay_1.detachAiButton; } });
Object.defineProperty(exports, "detachAiButtonByElement", { enumerable: true, get: function () { return ai_overlay_1.detachAiButtonByElement; } });
Object.defineProperty(exports, "updateAiButton", { enumerable: true, get: function () { return ai_overlay_1.updateAiButton; } });
Object.defineProperty(exports, "detachAllAiButtons", { enumerable: true, get: function () { return ai_overlay_1.detachAllAiButtons; } });
Object.defineProperty(exports, "getOverlayConfig", { enumerable: true, get: function () { return ai_overlay_1.getOverlayConfig; } });
Object.defineProperty(exports, "getOverlayConfigByElement", { enumerable: true, get: function () { return ai_overlay_1.getOverlayConfigByElement; } });
Object.defineProperty(exports, "setChatbotBridge", { enumerable: true, get: function () { return ai_overlay_1.setChatbotBridge; } });
Object.defineProperty(exports, "getChatbotBridge", { enumerable: true, get: function () { return ai_overlay_1.getChatbotBridge; } });
Object.defineProperty(exports, "configurePromptWorkflow", { enumerable: true, get: function () { return ai_overlay_1.configurePromptWorkflow; } });
Object.defineProperty(exports, "formatPromptError", { enumerable: true, get: function () { return ai_overlay_1.formatPromptError; } });
//# sourceMappingURL=index.js.map