# AI Button WebSocket Commands

## Overview

The SDK now supports attaching and detaching AI assistant buttons to elements via WebSocket commands. This allows the Mock UI Manager to dynamically add AI buttons to any element in the demo app, including dynamically generated components.

## Commands

### 1. `attach_ai_button`

Attaches an AI assistant button to a specified element.

**Payload Structure:**

```json
{
  "command": "attach_ai_button",
  "elementId": "highlight-target",
  "payload": {
    "options": {
      "placement": "top-right",
      "label": "Ask AI",
      "icon": "✨",
      "size": "default"
    }
  },
  "requestId": "attach-ai-001"
}
```

**WebSocket Envelope:**

```json
{
  "type": "command",
  "command": {
    "command": "attach_ai_button",
    "elementId": "highlight-target",
    "payload": {
      "options": {
        "placement": "top-right",
        "label": "Ask AI",
        "size": "default"
      }
    },
    "requestId": "attach-ai-001"
  }
}
```

**Options:**

- `placement` (optional): `"top-left"` | `"top-right"` | `"bottom-left"` | `"bottom-right"` | `"center"` | `{ top?: number, left?: number, right?: number, bottom?: number }` (default: `"top-right"`)
- `label` (optional): Tooltip text for the button
- `icon` (optional): Custom icon (SVG string or emoji). Defaults to built-in AI icon
- `size` (optional): `"default"` | `"compact"` (default: `"default"`)
- `className` (optional): Custom CSS class name
- `style` (optional): Inline styles object
- `disabled` (optional): Whether the button is disabled (default: `false`)
- `zIndex` (optional): Z-index for the overlay (default: `10000`)
- `ariaLabel` (optional): ARIA label for accessibility (default: `"AI Assistant"`)

**Response:**

```json
{
  "type": "ack",
  "message": "Command executed",
  "requestId": "attach-ai-001",
  "timestamp": 1234567890123
}
```

**Behavior:**

- The AI button will automatically reattach if the element is removed and re-added to the DOM
- Clicking the AI button triggers the AI prompt workflow:
  1. Collects element metadata
  2. Sends POST request to `/mock/ai_generate_ui_prompt`
  3. Receives mock prompt response
  4. Opens chatbot and sends prompt via chatbot bridge
- If an AI button is already attached to the element, the command returns an error

---

### 2. `detach_ai_button`

Detaches an AI assistant button from a specified element.

**Payload Structure (by elementId):**

```json
{
  "command": "detach_ai_button",
  "elementId": "highlight-target",
  "payload": {
    "options": {}
  },
  "requestId": "detach-ai-001"
}
```

**Payload Structure (by overlayId):**

```json
{
  "command": "detach_ai_button",
  "payload": {
    "options": {
      "overlayId": "overlay-abc123"
    }
  },
  "requestId": "detach-ai-002"
}
```

**WebSocket Envelope:**

```json
{
  "type": "command",
  "command": {
    "command": "detach_ai_button",
    "elementId": "highlight-target",
    "payload": {
      "options": {}
    },
    "requestId": "detach-ai-001"
  }
}
```

**Options:**

- `overlayId` (optional): Specific overlay ID to detach. If not provided, uses `elementId` to find and detach

**Response:**

```json
{
  "type": "ack",
  "message": "Command executed",
  "requestId": "detach-ai-001",
  "timestamp": 1234567890123
}
```

**Behavior:**

- Removes the AI button from the specified element
- Unregisters the overlay from the lifecycle system
- If the element is re-added to the DOM, the button will NOT reattach (because it was explicitly detached)

---

## Mock UI Manager Usage

The Mock UI Manager includes an **AI Button Manager** section where you can:

1. Enter an Element ID (e.g., `highlight-target`, `submit-button`)
2. Configure button options:
   - Placement (top-left, top-right, bottom-left, bottom-right, center)
   - Size (default, compact)
   - Label (tooltip text)
   - Icon (custom SVG or emoji)
3. Click **"Attach AI Button"** to add the button to the element
4. Click **"Detach AI Button"** to remove the button

## Dynamic Element Support

The SDK uses a MutationObserver to watch for DOM changes. When elements with registered AI buttons are:

- **Removed**: The button is automatically detached
- **Re-added**: The button is automatically reattached (if not explicitly detached)

This enables AI buttons to persist across component remounts, route changes, and other dynamic DOM updates.

## AI Prompt Workflow

When an AI button is clicked:

1. **Metadata Collection**: The SDK collects element metadata (tagName, textContent, value, boundingBox, data attributes, etc.)

2. **API Request**: Sends POST to `/mock/ai_generate_ui_prompt`:
   ```json
   {
     "metadata": {
       "elementId": "highlight-target",
       "tagName": "div",
       "textContent": "Highlight Target",
       "dataAttributes": {},
       "boundingBox": { "top": 100, "left": 200, "width": 300, "height": 50 }
     },
     "timestamp": 1234567890123
   }
   ```

3. **Mock Response**: Server returns contextual prompt:
   ```json
   {
     "prompt": "How can I help you with this element?",
     "timestamp": 1234567890123,
     "metadata": {
       "suggestions": ["Explain element", "Show keyboard shortcuts"]
     }
   }
   ```

4. **Chatbot Integration**: 
   - Opens the chatbot drawer (if minimized)
   - Sends prompt to chatbot via `window.__chatbotBridge.receivePrompt()`
   - Displays prompt in chatbot transcript

## Examples

### Attach AI button to a form input

```json
{
  "type": "command",
  "command": {
    "command": "attach_ai_button",
    "elementId": "username-input",
    "payload": {
      "options": {
        "placement": "top-right",
        "label": "Get help with this field",
        "size": "compact"
      }
    },
    "requestId": "attach-input-ai"
  }
}
```

### Attach AI button to a button with custom icon

```json
{
  "type": "command",
  "command": {
    "command": "attach_ai_button",
    "elementId": "submit-button",
    "payload": {
      "options": {
        "placement": "top-left",
        "label": "Ask AI about this button",
        "icon": "🤖"
      }
    },
    "requestId": "attach-button-ai"
  }
}
```

### Detach AI button

```json
{
  "type": "command",
  "command": {
    "command": "detach_ai_button",
    "elementId": "username-input",
    "payload": {
      "options": {}
    },
    "requestId": "detach-input-ai"
  }
}
```

## Testing

To test the AI button workflow:

1. Start the mock servers:
   ```bash
   cd apps/mocks
   npm run dev:all
   ```

2. Start the demo app:
   ```bash
   cd apps/demo
   npm run dev
   ```

3. Start the mock manager:
   ```bash
   cd apps/mock-manager
   npm run dev
   ```

4. In the Mock UI Manager:
   - Navigate to the AI Button Manager section
   - Enter an element ID (e.g., `highlight-target`)
   - Configure options
   - Click "Attach AI Button"

5. In the demo app:
   - You should see an AI button appear on the element
   - Click the AI button
   - The chatbot drawer should open with a contextual prompt

## Technical Details

### Command Handlers

- **Location**: `packages/sdk/src/commands/ai-button.ts`
- **Exports**: `handleAttachAiButton`, `handleDetachAiButton`
- **Registry**: Registered in `packages/sdk/src/commands/registry.ts`

### Targeting Observer

- **Location**: `packages/sdk/src/targeting/lifecycle.ts`
- **Function**: `startTargetingObserver()` / `stopTargetingObserver()`
- **Initialization**: Called in `apps/demo/src/connection/ConnectionContext.tsx`

### AI Overlay System

- **Location**: `packages/sdk/src/ai-overlay/`
- **Public API**: `attachAiButton()`, `detachAiButton()`, `detachAiButtonByElement()`
- **Features**: Portal rendering, collision detection, accessibility, lifecycle management

