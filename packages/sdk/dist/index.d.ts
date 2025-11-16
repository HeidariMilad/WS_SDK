export declare function placeholderSdk(): string;
export * from "./logging/loggingBus";
export * from "./core/connection/types";
export { WebSocketConnection } from "./core/connection/webSocketConnection";
export { CommandDispatcher } from "./core/command-pipeline/dispatcher";
export { createWebSocketCommandClient } from "./core/command-pipeline/webSocketCommandClient";
export { resolveTarget, resolveTargetByDataElementId, resolveTargetBySelector } from "./targeting";
export type { TargetResolutionResult, TargetingInput } from "./targeting";
export { buildWarningMessage, getTargetingGuidance } from "./targeting/utils";
export { registerOverlay, unregisterOverlay, startTargetingObserver, stopTargetingObserver, clearAllOverlays, } from "./targeting/lifecycle";
export type { OverlayRegistration } from "./targeting/lifecycle";
export { handleNavigate, registerNavigationRouter, unregisterNavigationRouter, } from "./commands/navigate";
export type { NavigationRouter } from "./commands/navigate";
export { handleRefreshElement, registerRefreshCallback, } from "./commands/refresh-element";
export type { RefreshCallback } from "./commands/refresh-element";
export { registerCommandHandlers } from "./commands/registry";
export { attachAiButton, detachAiButton, detachAiButtonByElement, updateAiButton, detachAllAiButtons, getOverlayConfig, getOverlayConfigByElement, } from "./ai-overlay";
export type { AttachAiButtonOptions, AttachResult, ElementMetadata, OverlayPlacement, OverlaySize, OverlayState, } from "./ai-overlay";
//# sourceMappingURL=index.d.ts.map