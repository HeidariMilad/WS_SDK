# `@frontend-ui-command-sdk/sdk`

TypeScript SDK for receiving WebSocket UI commands, resolving DOM targets, executing UI actions, and attaching AI assist overlays.

> This package is designed to be consumed by React/Next.js apps, but the core APIs are framework-agnostic.

## Installation

```bash
npm install @frontend-ui-command-sdk/sdk
```

or with pnpm/yarn (if you publish to a registry that supports them):

```bash
pnpm add @frontend-ui-command-sdk/sdk
# or
yarn add @frontend-ui-command-sdk/sdk
```

## Quick start

The SDK is built around three concepts:

- A **WebSocket connection** that maintains a resilient connection to your command source.
- A **command pipeline** that validates incoming payloads and dispatches handlers.
- **Targeting and overlays** that map commands to DOM elements and optional AI assist buttons.

```ts
import {
  WebSocketConnection,
  createWebSocketCommandClient,
  registerCommandHandlers,
  handleNavigate,
  handleRefreshElement,
  registerNavigationRouter,
  registerRefreshCallback,
  resolveTargetByDataElementId,
} from "@frontend-ui-command-sdk/sdk";

// 1. Establish a WebSocket connection
const connection = new WebSocketConnection("wss://your-command-server.example/ws", {
  // Backoff & heartbeat behavior is implemented inside the SDK.
});

// 2. Create a command client bound to the connection
const client = createWebSocketCommandClient({ connection });

// 3. Register command handlers (navigate, refresh, etc.)
registerCommandHandlers(client, {
  navigate: (payload) => handleNavigate(payload),
  refreshElement: (payload) => handleRefreshElement(payload),
  // ...other command handlers
});

// 4. Resolve DOM targets using data-elementid
const target = resolveTargetByDataElementId({
  document,
  elementId: "primary-cta",
});

if (target.status === "ok") {
  // Use the resolved element in your own logic if needed
  console.log("Resolved element", target.element);
}
```

In a React app, you would typically wire this into a provider and hooks that expose connection status and recent commands to your component tree (see `apps/demo` in this repo for the reference implementation).

## Public API surface

The `src/index.ts` entrypoint re-exports the main primitives you will use.

### Connection & pipeline

```ts
import {
  WebSocketConnection,
  CommandDispatcher,
  createWebSocketCommandClient,
} from "@frontend-ui-command-sdk/sdk";
```

- `WebSocketConnection` — Manages the underlying WebSocket, including exponential backoff reconnects and heartbeat pings.
- `CommandDispatcher` — Validates payloads and routes commands to registered handlers.
- `createWebSocketCommandClient(options)` — Convenience factory that wires a `WebSocketConnection` into a dispatcher and logging.

Connection-related types are also exported from `./core/connection/types`:

```ts
import type { ConnectionState, ConnectionEvent } from "@frontend-ui-command-sdk/sdk";
```

(See TypeScript declarations in `dist/core/connection/types.d.ts` for full details.)

### Targeting utilities

```ts
import {
  resolveTarget,
  resolveTargetByDataElementId,
  resolveTargetBySelector,
  buildWarningMessage,
  getTargetingGuidance,
} from "@frontend-ui-command-sdk/sdk";

import type {
  TargetingInput,
  TargetResolutionResult,
} from "@frontend-ui-command-sdk/sdk";
```

- `resolveTarget` — Core resolver that powers other helpers.
- `resolveTargetByDataElementId` — Preferred way to locate elements via `data-elementid` attributes.
- `resolveTargetBySelector` — Fallback using CSS selectors.
- `buildWarningMessage` / `getTargetingGuidance` — Utilities for user-facing diagnostics when elements cannot be resolved.
- `TargetingInput` / `TargetResolutionResult` — Strongly-typed inputs/outputs for targeting.

### UI command handlers

```ts
import {
  handleNavigate,
  registerNavigationRouter,
  unregisterNavigationRouter,
  handleRefreshElement,
  registerRefreshCallback,
  registerCommandHandlers,
} from "@frontend-ui-command-sdk/sdk";

import type {
  NavigationRouter,
  RefreshCallback,
} from "@frontend-ui-command-sdk/sdk";
```

- `handleNavigate` — Executes navigation commands, delegating to a `NavigationRouter` you provide.
- `registerNavigationRouter` / `unregisterNavigationRouter` — Manage the routing adapter (e.g., Next.js router).
- `handleRefreshElement` — Triggers UI refresh for dynamic elements using a registered callback.
- `registerRefreshCallback` — Provide the concrete refresh implementation.
- `registerCommandHandlers` — Registers the full command handler table for the dispatcher.

### AI overlay module

```ts
import {
  attachAiButton,
  detachAiButton,
  detachAiButtonByElement,
  updateAiButton,
  detachAllAiButtons,
  getOverlayConfig,
  getOverlayConfigByElement,
} from "@frontend-ui-command-sdk/sdk";

import type {
  AttachAiButtonOptions,
  AttachResult,
  ElementMetadata,
  OverlayPlacement,
  OverlaySize,
  OverlayState,
} from "@frontend-ui-command-sdk/sdk";
```

- `attachAiButton` — Attaches an AI assist button to a target element.
- `updateAiButton` — Updates configuration or metadata for an existing overlay.
- `detachAiButton` / `detachAiButtonByElement` / `detachAllAiButtons` — Clean up overlays explicitly.
- `getOverlayConfig` / `getOverlayConfigByElement` — Introspect overlay state for debugging.

These APIs are implemented on top of a React-based portal renderer, but the surface area is deliberately minimal so host apps do not need to be aware of the rendering details.

### Logging

```ts
import { createLoggingBus } from "@frontend-ui-command-sdk/sdk";
```

The logging bus provides structured events with severities (info/warn/error) and supports pluggable sinks (console, custom callbacks, error trackers). See `dist/logging/loggingBus.d.ts` for the full interface until a dedicated docs section is added.

## Integration example (React/Next.js)

```ts
import {
  WebSocketConnection,
  createWebSocketCommandClient,
  registerCommandHandlers,
  handleNavigate,
  handleRefreshElement,
} from "@frontend-ui-command-sdk/sdk";

import { useRouter } from "next/navigation";

export function useCommandSdk() {
  const router = useRouter();

  const connection = new WebSocketConnection("wss://mock-commands.example/ws");
  const client = createWebSocketCommandClient({ connection });

  registerCommandHandlers(client, {
    navigate: (payload) => handleNavigate({ ...payload, router }),
    refreshElement: (payload) => handleRefreshElement(payload),
    // add other commands as the demo expands
  });

  return { connection, client };
}
```

This hook can then be exposed via context so that the demo UI and your own components can listen to connection state and command events.

## Experimental & stretch features

The following concepts are part of the architecture but are **not fully implemented** in the current SDK demo:

- **Chatbot bridge (`IChatbotBridge`)** — Contract and helpers for driving an external chatbot UI. This is currently a design in `docs/architecture/overview-and-modules.md` and shared types; production-ready adapters are considered experimental.
- **Advanced logging sinks** — Integrations with remote logging/observability backends (e.g., Sentry, Datadog) are planned but not implemented in this assignment build.

Treat these as stretch goals if you extend the SDK: keep the public surface small, and prefer composition over hard dependencies.

## Versioning & compatibility

- Current version: `0.1.0` (assignment build).
- Target runtime: Node.js 18+, modern evergreen browsers.
- TypeScript: tested with TS 5.x strict mode.

Breaking changes should be released under a new minor/major version with README updates describing impacts on connection setup, command payloads, or overlay behavior.
