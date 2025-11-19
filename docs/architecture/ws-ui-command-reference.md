# WebSocket UI Command Reference

This document describes the concrete WebSocket message format and payload schema for all UI control commands supported by the Frontend UI Command SDK. It is derived directly from:

- `docs/prd/requirements.md`
- `docs/architecture/shared-types-and-api.md`
- `apps/mock-manager/ARCHITECTURE.md` and `WEBSOCKET_REFACTOR.md`
- SDK command handlers under `packages/sdk/src/commands/*`
- WebSocket server implementation in `apps/mocks/ws/server.ts`

---

## 1. WebSocket Envelope

All UI control messages sent to the mock WebSocket server use this envelope:

```json
{
  "type": "command",
  "command": {
    "command": "<command-name>",
    "elementId": "<optional-element-id>",
    "payload": { /* command-specific */ },
    "requestId": "<client-generated-id>"
  }
}
```

- `type`: must be `"command"` for UI commands.
- `command`: the actual SDK command payload (matches `CommandPayload` in `packages/shared`).
- `requestId`: any unique string you generate; echoed back in ACKs.

### Server Behaviour

- **Manager UI → WS Server**: sends the full envelope above.
- **WS Server → Demo / SDK clients**: broadcasts only the inner `command` object plus a `timestamp`.
- **WS Server → Manager UI**: sends ACK frames:

```json
{
  "type": "ack",
  "message": "Command executed",
  "requestId": "<same-request-id>",
  "timestamp": 1234567890123
}
```

Error frames follow the pattern from `apps/mock-manager/ARCHITECTURE.md`:

```json
{
  "type": "error",
  "message": "Invalid message format",
  "timestamp": 1234567890123
}
```

---

## 2. Command List

The SDK defines 12 UI command names (see `docs/architecture/shared-types-and-api.md`):

- `navigate`
- `refresh_element`
- `highlight`
- `click`
- `fill`
- `clear`
- `focus`
- `open`
- `close`
- `scroll`
- `select`
- `hover`

The shared `CommandPayload` contract (simplified from `packages/shared/src/index.ts` and `docs/architecture/shared-types-and-api.md`) is:

```ts
interface CommandPayload {
  command: string;          // one of the 12 names above
  elementId?: string;       // optional, required for most commands
  payload?: unknown;        // command-specific structure (documented below)
  requestId?: string;       // correlation id
}
```

> **Note:** For new producers, use the `payload` shapes documented below rather than older ad-hoc shapes in legacy fixtures.

---

## 3. Command Payload Schemas

This section documents what the SDK command handlers actually read from `payload` for each command. In all cases below, `payload` is nested under the `command` object in the WebSocket envelope.

### 3.1 `navigate`

**Purpose:** SPA-style route change without full page reload (FR3).

**Handler:** `packages/sdk/src/commands/navigate.ts`

**Accepted payload fields:**

- `payload.value`: string path (e.g. `"/dashboard"`), **or**
- `payload.options.path`: string path
- `payload.options.replace`: boolean – if `true` and router supports `replace`, call `router.replace` instead of `push`.

**Examples (command object only):**

```json
{
  "command": "navigate",
  "payload": {
    "value": "/dashboard"
  },
  "requestId": "nav-001"
}
```

```json
{
  "command": "navigate",
  "payload": {
    "options": {
      "path": "/settings",
      "replace": true
    }
  },
  "requestId": "nav-002"
}
```

**Full WebSocket frame:**

```json
{
  "type": "command",
  "command": {
    "command": "navigate",
    "payload": {
      "value": "/dashboard"
    },
    "requestId": "nav-001"
  }
}
```

---

### 3.2 `refresh_element`

**Purpose:** Lightweight re-render of a component without page reload (FR4).

**Handler:** `packages/sdk/src/commands/refresh-element.ts`

**Payload (inside `payload.options`):**

- `method`: `"callback" | "attribute" | "both"` (default `"both"`)
  - `callback`: invoke registered refresh callbacks for `elementId`.
  - `attribute`: toggle `data-refresh-key` on the DOM element.
  - `both`: perform both behaviours.

**Example:**

```json
{
  "command": "refresh_element",
  "elementId": "dynamic-content",
  "payload": {
    "options": {
      "method": "both"
    }
  },
  "requestId": "refresh-001"
}
```

Omitting `payload` uses the default `method: "both"`.

---

### 3.3 `highlight`

**Purpose:** Temporary glow/border effect around an element (FR5).

**Handler:** `packages/sdk/src/commands/highlight.ts`

**Payload (inside `payload.options`):**

- `color?`: string CSS color (default `"#3b82f6"`).
- `thickness?`: number of pixels for border (default `3`).
- `duration?`: number of milliseconds (default `400`).

**Example:**

```json
{
  "command": "highlight",
  "elementId": "important-section",
  "payload": {
    "options": {
      "color": "#ffeb3b",
      "thickness": 4,
      "duration": 2000
    }
  },
  "requestId": "hl-001"
}
```

---

### 3.4 `click`

**Purpose:** Synthetic mouse click event (FR6).

**Handler:** `packages/sdk/src/commands/click.ts`

**Payload (inside `payload.options`):**

- `button?`: `0 | 1 | 2` (left/middle/right; default `0`).
- `shiftKey?`: boolean (default `false`).
- `ctrlKey?`: boolean (default `false`).
- `altKey?`: boolean (default `false`).
- `metaKey?`: boolean (default `false`).

**Examples:**

Simple left click:

```json
{
  "command": "click",
  "elementId": "submit-button",
  "requestId": "click-plain"
}
```

Right-click with modifiers:

```json
{
  "command": "click",
  "elementId": "context-menu-target",
  "payload": {
    "options": {
      "button": 2,
      "shiftKey": true,
      "ctrlKey": true
    }
  },
  "requestId": "click-002"
}
```

---

### 3.5 `fill`

**Purpose:** Set input/textarea value and dispatch `input`/`change` events (FR7).

**Handler:** `packages/sdk/src/commands/fill.ts`

**Payload (inside `payload.options`):**

- `value`: **required** string – new field value.

**Example:**

```json
{
  "command": "fill",
  "elementId": "username-input",
  "payload": {
    "options": {
      "value": "testuser@example.com"
    }
  },
  "requestId": "fill-001"
}
```

---

### 3.6 `clear`

**Purpose:** Clear input/textarea/select and dispatch input/change events (FR8).

**Handler:** `packages/sdk/src/commands/clear.ts`

**Payload:** none required or used.

**Example:**

```json
{
  "command": "clear",
  "elementId": "search-input",
  "requestId": "clear-001"
}
```

---

### 3.7 `focus`

**Purpose:** Scroll element into view and focus it (FR9).

**Handler:** `packages/sdk/src/commands/focus.ts`

**Payload:** none required or used.

**Example:**

```json
{
  "command": "focus",
  "elementId": "password-input",
  "requestId": "focus-001"
}
```

---

### 3.8 `hover`

**Purpose:** Synthetic hover state with CSS class and mouse events (FR13).

**Handler:** `packages/sdk/src/commands/hover.ts`

**Payload (inside `payload.options`):**

- `duration?`: number of milliseconds (default `1000`).

**Example:**

```json
{
  "command": "hover",
  "elementId": "tooltip-trigger",
  "payload": {
    "options": {
      "duration": 1500
    }
  },
  "requestId": "hover-001"
}
```

---

### 3.9 `scroll`

**Purpose:** Scroll the element into view (FR11).

**Handler:** `packages/sdk/src/commands/scroll.ts`

**Payload (inside `payload.options`):**

- `behavior?`: `"smooth" | "auto"` (default `"smooth"`, but coerced to `"auto"` if `prefers-reduced-motion` is enabled).
- `block?`: `"start" | "center" | "end" | "nearest"` (default `"center"`).
- `inline?`: `"start" | "center" | "end" | "nearest"` (default `"nearest"`).

> Older fixtures sometimes use `payload.behavior` or `payload.top`. New producers should prefer `payload.options.behavior/block/inline` as above.

**Example:**

```json
{
  "command": "scroll",
  "elementId": "content-area",
  "payload": {
    "options": {
      "behavior": "smooth",
      "block": "center",
      "inline": "nearest"
    }
  },
  "requestId": "scroll-001"
}
```

---

### 3.10 `select`

**Purpose:** Change selected option in a `<select>` and dispatch events (FR12).

**Handler:** `packages/sdk/src/commands/select.ts`

**Payload (inside `payload.options`):** At least one of:

- `value?`: string – match by `option.value`.
- `index?`: number – match by option index.
- `label?`: string – match by `option.text`.

**Examples:**

Select by value:

```json
{
  "command": "select",
  "elementId": "country-dropdown",
  "payload": {
    "options": {
      "value": "US"
    }
  },
  "requestId": "select-001"
}
```

Select by index:

```json
{
  "command": "select",
  "elementId": "country-dropdown",
  "payload": {
    "options": {
      "index": 2
    }
  },
  "requestId": "select-idx-001"
}
```

Select by label:

```json
{
  "command": "select",
  "elementId": "country-dropdown",
  "payload": {
    "options": {
      "label": "United States"
    }
  },
  "requestId": "select-label-001"
}
```

---

### 3.11 `open`

**Purpose:** Open a modal, drawer, or panel (FR10 – paired with `close`).

**Handler:** `packages/sdk/src/commands/open-close.ts` (`handleOpen`).

**Payload (inside `payload.options`):**

- `type?`: string – logical component type (e.g. `"modal"`, `"drawer"`, `"panel"`).
- `data?`: object – arbitrary data passed to the host UI.

Behaviour:

- If `elementId` is provided, the SDK resolves the element and dispatches `CustomEvent("sdk-open", { detail: { type, data, elementId } })` on that element.
- If `elementId` is omitted, it dispatches the event on `document`.

**Examples:**

Element-scoped open:

```json
{
  "command": "open",
  "elementId": "modal-dialog",
  "payload": {
    "options": {
      "type": "modal",
      "data": {
        "source": "ai-suggestion",
        "variant": "large"
      }
    }
  },
  "requestId": "open-001"
}
```

Global open:

```json
{
  "command": "open",
  "payload": {
    "options": {
      "type": "drawer",
      "data": {
        "section": "filters"
      }
    }
  },
  "requestId": "open-global-001"
}
```

---

### 3.12 `close`

**Purpose:** Close a modal, drawer, or panel (FR10 pairing).

**Handler:** `packages/sdk/src/commands/open-close.ts` (`handleClose`).

**Payload:** none required.

Behaviour:

- With `elementId`: dispatch `CustomEvent("sdk-close", { detail: { elementId } })` on the resolved element.
- Without `elementId`: dispatch `CustomEvent("sdk-close", { detail: {} })` on `document`.

**Examples:**

Element-scoped close:

```json
{
  "command": "close",
  "elementId": "modal-dialog",
  "requestId": "close-001"
}
```

Global close:

```json
{
  "command": "close",
  "requestId": "close-global-001"
}
```

---

## 4. End-to-End Examples

### 4.1 Fill + Click Flow

WebSocket frame to fill an input:

```json
{
  "type": "command",
  "command": {
    "command": "fill",
    "elementId": "email-input",
    "payload": {
      "options": {
        "value": "demo@example.com"
      }
    },
    "requestId": "fill-12345"
  }
}
```

Then click submit:

```json
{
  "type": "command",
  "command": {
    "command": "click",
    "elementId": "submit-button",
    "requestId": "click-12346"
  }
}
```

The manager UI will receive `ack` frames for the `requestId`s above; the demo app will receive the raw `command` objects and execute the UI effects.

---

## 5. Usage Notes & Best Practices

- Always include a `requestId` so ACKs can be correlated in logs and UI.
- Prefer the `payload.options.*` patterns documented here; they are what the current handlers expect.
- Ensure `elementId` matches the `data-elementid` attributes in the demo or host app.
- When extending commands or adding new ones, update:
  - `docs/architecture/shared-types-and-api.md`
  - `packages/shared/src/index.ts` (types)
  - `packages/sdk/src/commands/*` (handler implementation)
  - This file (`docs/architecture/ws-ui-command-reference.md`).
