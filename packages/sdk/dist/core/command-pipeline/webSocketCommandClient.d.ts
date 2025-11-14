import type { ConnectionOptions } from "../connection/types";
import { WebSocketConnection } from "../connection/webSocketConnection";
import type { CommandDispatcher } from "./dispatcher";
export interface WebSocketCommandClientOptions extends ConnectionOptions {
    /** Dispatcher that receives parsed CommandPayload messages. */
    dispatcher: CommandDispatcher;
}
/**
 * Create a WebSocketConnection that automatically forwards incoming
 * CommandPayload messages into the provided CommandDispatcher.
 */
export declare function createWebSocketCommandClient(options: WebSocketCommandClientOptions): WebSocketConnection;
//# sourceMappingURL=webSocketCommandClient.d.ts.map