export function placeholderSdk(): string {
  return "frontend-ui-command-sdk placeholder";
}

export * from "./logging/loggingBus";
export * from "./core/connection/types";
export { WebSocketConnection } from "./core/connection/webSocketConnection";
export { CommandDispatcher } from "./core/command-pipeline/dispatcher";
export { createWebSocketCommandClient } from "./core/command-pipeline/webSocketCommandClient";
