export function placeholderSdk(): string {
  return "frontend-ui-command-sdk placeholder";
}

export * from "./logging/loggingBus";
export * from "./core/connection/types";
export { WebSocketConnection } from "./core/connection/webSocketConnection";
export { CommandDispatcher } from "./core/command-pipeline/dispatcher";
export { createWebSocketCommandClient } from "./core/command-pipeline/webSocketCommandClient";

// Targeting utilities
export { resolveTarget, resolveTargetByDataElementId, resolveTargetBySelector } from "./targeting";
export type { TargetResolutionResult, TargetingInput } from "./targeting";
export { buildWarningMessage, getTargetingGuidance } from "./targeting/utils";
export {
  registerOverlay,
  unregisterOverlay,
  startTargetingObserver,
  stopTargetingObserver,
  clearAllOverlays,
} from "./targeting/lifecycle";
export type { OverlayRegistration } from "./targeting/lifecycle";
