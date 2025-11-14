"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createWebSocketCommandClient = createWebSocketCommandClient;
const webSocketConnection_1 = require("../connection/webSocketConnection");
/**
 * Create a WebSocketConnection that automatically forwards incoming
 * CommandPayload messages into the provided CommandDispatcher.
 */
function createWebSocketCommandClient(options) {
    const { dispatcher, onCommand, ...connectionOptions } = options;
    return new webSocketConnection_1.WebSocketConnection({
        ...connectionOptions,
        onCommand: (payload) => {
            dispatcher.dispatch(payload);
            onCommand?.(payload);
        },
    });
}
//# sourceMappingURL=webSocketCommandClient.js.map