import type { CommandPayload } from "@frontend-ui-command-sdk/shared";
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
export function createWebSocketCommandClient(
  options: WebSocketCommandClientOptions,
): WebSocketConnection {
  const { dispatcher, onCommand, ...connectionOptions } = options;

  return new WebSocketConnection({
    ...connectionOptions,
    onCommand: (payload: CommandPayload) => {
      dispatcher.dispatch(payload);
      onCommand?.(payload);
    },
  });
}
