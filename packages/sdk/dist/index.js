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
exports.createWebSocketCommandClient = exports.CommandDispatcher = exports.WebSocketConnection = void 0;
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
//# sourceMappingURL=index.js.map