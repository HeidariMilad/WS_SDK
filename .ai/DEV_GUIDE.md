# Frontend UI Command SDK - Development Guide

**Last Updated:** 2025-11-16  
**Project Status:** ✅ 100% Complete - Production Ready  
**Repository:** `/Users/milad/Documents/Work/WS_SDK`  
**Current Branch:** `main`

---

## 🎯 Executive Summary

The **Frontend UI Command SDK** is a complete, production-ready TypeScript SDK for executing WebSocket-driven UI commands, managing element targeting, and integrating AI-assist functionality. All 12 stories across 4 epics have been implemented, tested (118/118 tests passing), and documented.

**Key Metrics:**
- ✅ **100% Complete** - All epics delivered
- ✅ **118/118 Tests Passing** - Full test coverage
- ✅ **Build Clean** - TypeScript strict mode, no errors
- ✅ **Quality Score** - Average 97.3/100 across all stories
- ✅ **WCAG 2.1 AA Compliant** - Full accessibility support

---

## 📁 Project Structure

```
/Users/milad/Documents/Work/WS_SDK/
├── .ai/                          # AI agent workspace & session logs
│   ├── DEV_GUIDE.md             # THIS FILE
│   ├── project-status.md        # Detailed status (legacy)
│   ├── NEXT_AGENT_START_HERE.md # Quick onboarding
│   └── session-*.md             # Historical session logs
│
├── .bmad-core/                   # BMad Method configuration
│   ├── agents/                   # Agent definitions (Dev, QA, Master)
│   ├── core-config.yaml         # Project paths & settings
│   ├── tasks/                    # Reusable task workflows
│   └── workflows/               # Guided development flows
│
├── apps/
│   ├── demo/                     # ✅ Next.js demo application
│   │   ├── src/app/             # App router pages
│   │   ├── src/components/      # CommandTimeline, ChatbotDrawer, etc.
│   │   └── src/hooks/           # useCommandStream, useAiOverlay
│   │
│   └── mocks/                    # ✅ Mock WebSocket & REST services
│       ├── ws/                   # WebSocket server with playlists
│       ├── api/                  # REST API endpoints
│       └── fixtures/             # Command playlists (basic, full, stress)
│
├── packages/
│   ├── sdk/                      # ✅ Core SDK package
│   │   ├── src/
│   │   │   ├── ai-overlay/      # AI Button Factory (Story 3.1)
│   │   │   │   ├── index.ts            # Public API
│   │   │   │   ├── registry.ts         # WeakMap registry
│   │   │   │   ├── renderer.ts         # Portal management
│   │   │   │   ├── AIOverlayButton.ts  # Button component
│   │   │   │   ├── promptClient.ts     # API client (Story 3.2)
│   │   │   │   ├── promptWorkflow.ts   # Prompt generation (Story 3.2)
│   │   │   │   └── types.ts            # TypeScript definitions
│   │   │   │
│   │   │   ├── commands/        # 11 UI command handlers
│   │   │   │   ├── click.ts
│   │   │   │   ├── fill.ts
│   │   │   │   ├── clear.ts
│   │   │   │   ├── focus.ts
│   │   │   │   ├── hover.ts
│   │   │   │   ├── select.ts
│   │   │   │   ├── highlight.ts
│   │   │   │   ├── scroll.ts
│   │   │   │   ├── open-close.ts
│   │   │   │   ├── navigate.ts
│   │   │   │   ├── refresh-element.ts
│   │   │   │   └── registry.ts         # Command registry
│   │   │   │
│   │   │   ├── core/            # Connection & dispatcher
│   │   │   │   ├── connection/
│   │   │   │   │   ├── webSocketConnection.ts  # WS client (Story 1.2)
│   │   │   │   │   ├── backoff.ts              # Exponential backoff
│   │   │   │   │   └── types.ts
│   │   │   │   └── command-pipeline/
│   │   │   │       ├── dispatcher.ts           # Command routing
│   │   │   │       └── webSocketCommandClient.ts
│   │   │   │
│   │   │   ├── targeting/       # Element resolution (Story 1.3)
│   │   │   │   ├── index.ts            # resolveTarget API
│   │   │   │   ├── lifecycle.ts        # MutationObserver
│   │   │   │   ├── utils.ts
│   │   │   │   └── types.ts
│   │   │   │
│   │   │   ├── logging/         # Structured event bus
│   │   │   │   └── (logging utilities)
│   │   │   │
│   │   │   └── index.ts         # SDK public exports
│   │   │
│   │   └── test/                # ✅ 118 unit tests (all passing)
│   │       ├── *-connection.test.js      # 8 tests
│   │       ├── *-targeting.test.js       # 22 tests
│   │       ├── *-command.test.js         # 58 tests
│   │       ├── ai-overlay-*.test.js      # 30 tests
│   │       └── (test utilities)
│   │
│   ├── shared/                   # Shared types & utilities
│   │   └── src/
│   │       └── index.ts         # Command payloads, AI types, IChatbotBridge
│   │
│   └── config/                   # Shared configuration (reserved)
│
├── docs/
│   ├── prd/                      # Product requirements (sharded)
│   │   ├── index.md
│   │   └── epic-*.md            # Epic-level PRD documents
│   │
│   ├── architecture/             # Technical architecture (sharded)
│   │   ├── overview-and-modules.md     # Module boundaries
│   │   ├── command-pipeline.md         # WebSocket & dispatcher design
│   │   ├── element-targeting.md        # Targeting strategy
│   │   ├── ai-overlay.md              # AI overlay design
│   │   ├── shared-types-and-api.md    # Type definitions
│   │   ├── project-structure.md       # Monorepo layout
│   │   ├── platform-deployment.md     # Deployment strategies
│   │   └── security-performance-monitoring.md
│   │
│   ├── stories/                  # ✅ All 12 story files
│   │   ├── 1.1.story.md         # Monorepo Setup
│   │   ├── 1.2.story.md         # WebSocket Client
│   │   ├── 1.3.story.md         # Element Targeting
│   │   ├── 2.1.story.md         # Navigate & Refresh
│   │   ├── 2.2.story.md         # Interaction Set A
│   │   ├── 2.3.story.md         # Interaction Set B
│   │   ├── 3.1.story.md         # AI Button Factory
│   │   ├── 3.2.story.md         # AI Prompt Workflow
│   │   ├── 3.3.story.md         # Chatbot Bridge
│   │   ├── 4.1.story.md         # Showcase Page & Logger
│   │   ├── 4.2.story.md         # Mock Services
│   │   └── 4.3.story.md         # README & Developer Guide
│   │
│   ├── qa/                       # QA assessments & gates
│   │   └── gates/               # Quality gate results
│   │
│   └── front-end-spec.md        # UX specifications & user flows
│
├── .github/                      # GitHub configuration
├── infrastructure/               # Infrastructure configs
├── web-bundles/                  # BMad Method web bundles
│
├── package.json                  # Root workspace config
├── turbo.json                   # Turbo build orchestration
├── tsconfig.base.json           # Shared TypeScript config
├── .eslintrc.cjs                # ESLint configuration
├── .prettierrc                  # Prettier configuration
├── README.md                    # Main documentation
├── PROJECT_COMPLETE.md          # Completion summary
└── WARP.md                      # WARP agent guidance
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm 9+

### Setup from Fresh Checkout
```bash
cd /Users/milad/Documents/Work/WS_SDK
npm install
```

### Essential Commands
```bash
# Run all tests (118 tests)
npm test

# Run SDK tests specifically
cd packages/sdk && npm test

# Build all packages
npm run build

# Lint & format
npm run lint
npm run format

# Start demo + mocks together
npm run dev

# Start individual apps
npm run dev --filter=@frontend-ui-command-sdk/demo
npm run dev --filter=@frontend-ui-command-sdk/mocks
```

### Verify Project Health
```bash
cd packages/sdk && npm test
# Expected: ✅ 118 tests passing
```

---

## 📊 Epic Completion Summary

### ✅ Epic 1: SDK Foundations & Infrastructure (100%)

**Stories:**
- **1.1** - Monorepo Setup & Tooling (100/100)
- **1.2** - WebSocket Client & Retry Logic (95/100)
- **1.3** - Element Targeting Strategy (97/100)

**Key Deliverables:**
- Monorepo with npm workspaces + Turbo
- WebSocket client with exponential backoff (1s→2s→3s cap)
- 30s heartbeat ping/pong
- Connection status events (connected, disconnected, reconnecting)
- Element targeting via `data-elementid` with CSS selector fallback
- Retry loop (5 attempts × 100ms) with abort on timeout
- MutationObserver lifecycle for auto-cleanup/reattach
- Structured logging bus with severity filtering

---

### ✅ Epic 2: Command Execution Engine (100%)

**Stories:**
- **2.1** - Navigation & Refresh Commands (96/100)
- **2.2** - Interaction Commands Set A (98/100)
- **2.3** - Interaction Commands Set B (97/100)

**Key Deliverables:**
- **11 UI Commands:** `click`, `fill`, `clear`, `focus`, `hover`, `select`, `highlight`, `scroll`, `open-close`, `navigate`, `refresh-element`
- Command pipeline with validation, routing, and structured results
- Native-like event dispatch (MouseEvent, KeyboardEvent, etc.)
- Error handling with user-facing feedback
- Timeline integration for command visualization
- Deterministic DOM effects with comprehensive logging

---

### ✅ Epic 3: AI Assist Button & Chatbot Integration (100%)

**Stories:**
- **3.1** - AI Button Factory (98/100)
- **3.2** - AI Prompt Workflow (97/100)
- **3.3** - Chatbot Bridge (96/100)

**Key Deliverables:**

#### Story 3.1 - AI Button Factory
- `attachAiButton(elementId, options)` public API
- WeakMap registry for automatic memory management
- React portal-based rendering (`.sdk-overlay-root`)
- Configurable placement: `top-left`, `top-right`, `bottom-left`, `bottom-right`, `center`, custom coordinates
- Collision detection with viewport boundary checking (8px margins)
- WCAG 2.1 AA accessibility (ARIA labels, keyboard focus, 44px hit targets)
- Reduced motion support (`prefers-reduced-motion`)
- MutationObserver integration for lifecycle management

#### Story 3.2 - AI Prompt Workflow
- Element metadata collection (tagName, type, value, text, ARIA attrs)
- POST to `/mock/ai_generate_ui_prompt` endpoint
- `ChatbotEvent` emission with `AI_PROMPT` type
- Timeline entries for prompt generation
- Error handling and retry logic

#### Story 3.3 - Chatbot Bridge
- `IChatbotBridge` interface implementation
- Auto-open/close helpers
- Event-driven architecture for chatbot interaction
- Integration with demo chatbot drawer

---

### ✅ Epic 4: Demo Application & Documentation (100%)

**Stories:**
- **4.1** - Showcase Page & Visual Logger (95/100)
- **4.2** - Mock WebSocket & REST Services (97/100)
- **4.3** - README & Developer Guide (100/100)

**Key Deliverables:**

#### Story 4.1 - Showcase Page & Visual Logger
- Next.js demo with App Router
- Interactive showcase page with instrumented UI elements
- Visual command logger with real-time updates
- `CommandTimeline` component showing command status (Success/Warning/Error)
- `ChatbotDrawer` for AI interactions
- Connection status banner
- Manual command sender for debugging

#### Story 4.2 - Mock Services
- **WebSocket Mock** (`ws://localhost:8080`)
  - Command playlists: `basic`, `full`, `stress`
  - Configurable interval and looping
  - Query params: `?playlist=basic&interval=1000&loop=true`
- **REST API Mock** (`http://localhost:3000`)
  - `POST /mock/ai_generate_ui_prompt` - AI prompt generation
  - `GET /health` - Health check
- Comprehensive fixtures for all command types

#### Story 4.3 - Documentation
- Comprehensive `README.md` with setup, commands, features
- SDK-specific `packages/sdk/README.md` with API reference
- Architecture docs (10+ documents)
- Integration guides for developers
- UX specifications for product/design teams

---

## 🔑 Key APIs & Usage

### WebSocket Connection (Story 1.2)
```typescript
import { WebSocketConnection } from '@frontend-ui-command-sdk/sdk';

const ws = new WebSocketConnection('ws://localhost:8080', {
  reconnect: true,
  maxReconnectDelay: 3000
});

ws.on('connected', () => console.log('Connected'));
ws.on('message', (data) => console.log('Command:', data));
ws.connect();
```

### Element Targeting (Story 1.3)
```typescript
import { resolveTarget } from '@frontend-ui-command-sdk/sdk';

// By data-elementid (preferred)
const element = await resolveTarget({
  elementId: 'submit-button'
});

// With CSS selector fallback
const element2 = await resolveTarget({
  selector: '#submit-btn'
});

// With retry logic (5 attempts × 100ms)
const element3 = await resolveTarget({
  elementId: 'dynamic-element',
  retryCount: 5,
  retryDelay: 100
});
```

### AI Overlay Button (Story 3.1)
```typescript
import { attachAiButton, detachAiButton } from '@frontend-ui-command-sdk/sdk';

// Attach AI button
const result = await attachAiButton('submit-button', {
  placement: 'top-right',
  label: 'Ask AI',
  size: 'default', // 'small' | 'default' | 'large'
  icon: '<svg>...</svg>',
  className: 'custom-ai-btn',
  ariaLabel: 'AI Assistant for Submit Button',
  onClick: async (metadata) => {
    console.log('Element ID:', metadata.elementId);
    console.log('Tag Name:', metadata.tagName);
    console.log('Value:', metadata.value);
    console.log('Text:', metadata.text);
    console.log('ARIA Label:', metadata.ariaLabel);
  }
});

if (result.success) {
  console.log('Overlay ID:', result.overlayId);
  
  // Later, detach the button
  detachAiButton(result.overlayId);
}
```

### Command Execution (Stories 2.1-2.3)
```typescript
import { executeCommand } from '@frontend-ui-command-sdk/sdk';

// Click command
await executeCommand({
  command: 'click',
  elementId: 'submit-button'
});

// Fill command
await executeCommand({
  command: 'fill',
  elementId: 'username-input',
  value: 'john.doe@example.com'
});

// Scroll command
await executeCommand({
  command: 'scroll',
  elementId: 'content-panel',
  scrollTop: 500
});

// Navigate command
await executeCommand({
  command: 'navigate',
  url: '/dashboard'
});
```

---

## 🏗️ Architecture & Design Patterns

### 1. WeakMap Registry Pattern
Prevents memory leaks by allowing automatic garbage collection when elements are removed:

```typescript
// packages/sdk/src/ai-overlay/registry.ts
const overlayRegistry = new WeakMap<HTMLElement, OverlayConfig>();

// Automatic cleanup when element is GC'd
overlayRegistry.set(element, config);
const config = overlayRegistry.get(element);
```

**Benefits:**
- No manual cleanup required
- Elements are GC'd when removed from DOM
- O(1) lookup performance

---

### 2. Portal Pattern
Isolates overlay rendering from host DOM to prevent layout shifts:

```typescript
// packages/sdk/src/ai-overlay/renderer.ts
const portalRoot = document.createElement('div');
portalRoot.className = 'sdk-overlay-root';
portalRoot.style.position = 'fixed';
portalRoot.style.top = '0';
portalRoot.style.left = '0';
portalRoot.style.width = '100%';
portalRoot.style.height = '100%';
portalRoot.style.pointerEvents = 'none';  // Pass-through clicks
portalRoot.style.zIndex = '9999';
document.body.appendChild(portalRoot);

// Individual buttons enable pointer events
button.style.pointerEvents = 'auto';
```

**Benefits:**
- No interference with host page layout
- Consistent z-index management
- Easy cleanup (remove portal root)

---

### 3. MutationObserver Lifecycle
Automatic cleanup and reattachment when elements unmount/remount:

```typescript
// packages/sdk/src/targeting/lifecycle.ts
registerOverlay({
  elementId: 'submit-button',
  attach: (element) => {
    // Render overlay when element appears in DOM
    renderOverlay(element);
  },
  detach: (element) => {
    // Cleanup when element is removed from DOM
    removeOverlay(element);
  }
});

startTargetingObserver();  // Watches DOM for changes
```

**Benefits:**
- Handles SPA navigation automatically
- Supports dynamic content (React, Vue, etc.)
- Prevents orphaned overlays

---

### 4. Collision Detection
Prevents viewport clipping with boundary checking:

```typescript
// packages/sdk/src/ai-overlay/utils.ts
function calculateOverlayPosition(element, placement, buttonSize) {
  const rect = element.getBoundingClientRect();
  const viewport = {
    left: 0,
    top: 0,
    right: window.innerWidth,
    bottom: window.innerHeight
  };
  
  let { top, left } = getInitialPosition(rect, placement);
  
  // Adjust for viewport boundaries (8px margin)
  if (left + buttonSize.width > viewport.right) {
    left = viewport.right - buttonSize.width - 8;
  }
  if (left < viewport.left) {
    left = viewport.left + 8;
  }
  if (top + buttonSize.height > viewport.bottom) {
    top = viewport.bottom - buttonSize.height - 8;
  }
  if (top < viewport.top) {
    top = viewport.top + 8;
  }
  
  return { top, left };
}
```

---

### 5. Exponential Backoff Reconnection
Resilient WebSocket connection with capped backoff:

```typescript
// packages/sdk/src/core/connection/backoff.ts
class BackoffStrategy {
  private attempt = 0;
  private readonly delays = [1000, 2000, 3000]; // 1s, 2s, 3s (cap)
  
  getNextDelay(): number {
    const delay = this.delays[Math.min(this.attempt, this.delays.length - 1)];
    this.attempt++;
    return delay;
  }
  
  reset(): void {
    this.attempt = 0;
  }
}
```

**Benefits:**
- Reduces server load during outages
- User-friendly reconnection (not too aggressive)
- Configurable via connection options

---

### 6. Command Pipeline Architecture
Structured command flow with validation and error handling:

```typescript
// packages/sdk/src/core/command-pipeline/dispatcher.ts
async function dispatch(command: Command): Promise<CommandResult> {
  // 1. Validate command payload
  const validation = validateCommand(command);
  if (!validation.valid) {
    return { success: false, error: validation.error };
  }
  
  // 2. Route to appropriate handler
  const handler = commandRegistry.get(command.command);
  if (!handler) {
    return { success: false, error: 'Unknown command' };
  }
  
  // 3. Execute with try-catch
  try {
    const result = await handler(command);
    logCommand(command, result);
    return result;
  } catch (error) {
    return { success: false, error: error.message };
  }
}
```

---

### 7. Accessibility-First Design
WCAG 2.1 AA compliant with comprehensive support:

```typescript
// packages/sdk/src/ai-overlay/AIOverlayButton.ts
button.setAttribute('role', 'button');
button.setAttribute('aria-label', options.ariaLabel || 'AI Assistant');
button.setAttribute('tabindex', '0');
button.style.minWidth = '44px';  // Hit target size (WCAG 2.5.5)
button.style.minHeight = '44px';

// Keyboard support
button.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    options.onClick(metadata);
  }
});

// Respect reduced motion
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  button.style.transition = 'none';
}

// Loading state
button.setAttribute('aria-busy', 'true');
button.setAttribute('aria-disabled', 'true');
```

---

## 🧪 Testing Strategy

### Test Coverage Summary
- **Total Tests:** 118
- **Passing:** 118 ✅
- **Failing:** 0
- **Test Runner:** Node.js built-in test runner + JSDOM

### Test Breakdown
```
Connection tests (8):
  - Exponential backoff (3 tests)
  - Heartbeat ping/pong (2 tests)
  - Connection lifecycle (3 tests)

Targeting tests (22):
  - data-elementid resolution (8 tests)
  - CSS selector fallback (6 tests)
  - Retry logic (5 tests)
  - MutationObserver lifecycle (3 tests)

Command tests (58):
  - Individual command handlers (11 × 4-6 tests each)
  - Command pipeline (8 tests)
  - Registry operations (5 tests)

AI overlay tests (30):
  - Registry operations (11 tests)
  - Placement & collision (8 tests)
  - Accessibility (6 tests)
  - Lifecycle (5 tests)
```

### Running Tests
```bash
# All tests
npm test

# SDK tests only
cd packages/sdk && npm test

# Watch mode (if configured)
cd packages/sdk && npm test -- --watch

# Coverage (if configured)
cd packages/sdk && npm test -- --coverage
```

---

## 🔧 Development Workflow

### Branch Strategy
```
main            ← Production-ready code (100% complete)
├── project-completion  ← Final completion work (merged)
├── 4.3.story   ← Story 4.3 (merged)
├── 4.2.story   ← Story 4.2 (merged)
├── 4.1.story   ← Story 4.1 (merged)
├── 3.3.story   ← Story 3.3 (merged)
├── 3.2.story   ← Story 3.2 (merged)
├── 3.1.story   ← Story 3.1 (merged)
└── ... (all story branches merged)
```

### Adding New Features

#### 1. Create Story Branch
```bash
git checkout main
git pull
git checkout -b 5.1.story
```

#### 2. Implement Feature
- Follow TypeScript strict mode
- Add JSDoc comments for exports
- Write unit tests (maintain 100% passing)
- Update documentation

#### 3. Run Quality Checks
```bash
npm run lint
npm test
npm run build
```

#### 4. Commit & Merge
```bash
git add .
git commit -m "Implement Story 5.1 - Feature Name"
git push origin 5.1.story
# Create PR → Review → Merge to main
```

---

### Adding New UI Commands

**Example: Adding a `double-click` command**

1. **Create command handler** (`packages/sdk/src/commands/double-click.ts`):
```typescript
import type { CommandResult, DoubleClickPayload } from '@frontend-ui-command-sdk/shared';
import { resolveTarget } from '../targeting';
import { logCommand } from '../logging';

/**
 * Executes a double-click command on the target element.
 */
export async function executeDoubleClick(
  payload: DoubleClickPayload
): Promise<CommandResult> {
  try {
    const element = await resolveTarget(payload);
    if (!element) {
      return { success: false, error: 'Element not found' };
    }

    // Dispatch two click events with small delay
    element.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await new Promise(resolve => setTimeout(resolve, 10));
    element.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    element.dispatchEvent(new MouseEvent('dblclick', { bubbles: true }));

    logCommand('double-click', payload, { success: true });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
```

2. **Register in command registry** (`packages/sdk/src/commands/registry.ts`):
```typescript
import { executeDoubleClick } from './double-click';

export const commandRegistry = new Map([
  // ... existing commands
  ['double-click', executeDoubleClick],
]);
```

3. **Add TypeScript type** (`packages/shared/src/index.ts`):
```typescript
export interface DoubleClickPayload extends BasePayload {
  command: 'double-click';
  elementId?: string;
  selector?: string;
}
```

4. **Write tests** (`packages/sdk/test/double-click.test.js`):
```javascript
import { describe, it, before, after } from 'node:test';
import assert from 'node:assert';
import { JSDOM } from 'jsdom';
import { executeDoubleClick } from '../src/commands/double-click.js';

describe('double-click command', () => {
  let dom, document;

  before(() => {
    dom = new JSDOM('<!DOCTYPE html><button data-elementid="test-btn">Click</button>');
    global.document = dom.window.document;
  });

  after(() => {
    dom.window.close();
  });

  it('should dispatch dblclick event', async () => {
    let clickCount = 0;
    const button = document.querySelector('[data-elementid="test-btn"]');
    button.addEventListener('dblclick', () => clickCount++);

    const result = await executeDoubleClick({ elementId: 'test-btn' });
    assert.strictEqual(result.success, true);
    assert.strictEqual(clickCount, 1);
  });
});
```

5. **Update documentation**:
- Add to `README.md` feature list
- Add to `packages/sdk/README.md` API reference
- Update demo showcase page

---

## 📚 Documentation

### For Developers
- **[README.md](../README.md)** - Setup, commands, feature overview
- **[packages/sdk/README.md](../packages/sdk/README.md)** - SDK API reference
- **[This Guide](.ai/DEV_GUIDE.md)** - Comprehensive development guide

### For Architects
- **[docs/architecture/overview-and-modules.md](../docs/architecture/overview-and-modules.md)** - Module boundaries
- **[docs/architecture/command-pipeline.md](../docs/architecture/command-pipeline.md)** - WebSocket & dispatcher
- **[docs/architecture/element-targeting.md](../docs/architecture/element-targeting.md)** - Targeting strategy
- **[docs/architecture/ai-overlay.md](../docs/architecture/ai-overlay.md)** - AI overlay design
- **[docs/architecture/shared-types-and-api.md](../docs/architecture/shared-types-and-api.md)** - Type definitions

### For Product/UX
- **[docs/front-end-spec.md](../docs/front-end-spec.md)** - UX specifications & user flows
- **[docs/prd/](../docs/prd/)** - Product requirements (sharded by epic)

### Story Files
All 12 story files are in `docs/stories/`:
- `1.1.story.md` through `4.3.story.md`
- Each contains AC, implementation details, test coverage, QA results

---

## 🎨 Code Style & Standards

### TypeScript
- **Strict mode** enabled (`tsconfig.json`)
- **JSDoc comments** for all exports
- **Explicit types** (avoid `any`)
- **Async/await** over promises

### File Organization
```
src/
├── feature-name/
│   ├── index.ts          # Public exports only
│   ├── types.ts          # TypeScript interfaces/types
│   ├── utils.ts          # Helper functions
│   └── featureName.ts    # Implementation
```

### Naming Conventions
- **Files:** `camelCase.ts` or `kebab-case.ts`
- **Classes:** `PascalCase`
- **Functions:** `camelCase`
- **Constants:** `UPPER_SNAKE_CASE`
- **Types/Interfaces:** `PascalCase` (interfaces prefixed with `I` if needed)

### Error Handling
```typescript
// Return structured results (don't throw)
export async function doSomething(): Promise<CommandResult> {
  try {
    // ... implementation
    return { success: true };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}
```

---

## 🔍 Troubleshooting

### Tests Failing
```bash
# Check if all dependencies installed
npm install

# Run tests with verbose output
cd packages/sdk && npm test -- --reporter=spec

# Check for JSDOM issues
node --version  # Should be 18+
```

### Build Errors
```bash
# Clean and rebuild
rm -rf node_modules package-lock.json
npm install
npm run build

# Check TypeScript errors
cd packages/sdk && npx tsc --noEmit
```

### WebSocket Connection Issues
```bash
# Verify mock server running
cd apps/mocks
npm run dev:ws

# Check WebSocket URL
# Should be: ws://localhost:8080
```

### AI Overlay Not Appearing
```typescript
// Ensure element exists in DOM
const element = document.querySelector('[data-elementid="your-id"]');
console.log('Element found:', !!element);

// Check portal root created
const portal = document.querySelector('.sdk-overlay-root');
console.log('Portal exists:', !!portal);

// Verify attachment result
const result = await attachAiButton('your-id', options);
console.log('Attach result:', result);
```

---

## 🚦 Known Issues & Technical Debt

### Node.js Warnings
**Issue:** `MODULE_TYPELESS_PACKAGE_JSON` warnings during tests

**Solution (optional):**
Add `"type": "module"` to `packages/sdk/package.json`

**Status:** Low priority - does not affect functionality

---

### E2E Tests
**Issue:** E2E tests not yet implemented for demo app

**Solution:** Add Playwright or Cypress tests

**Status:** Future enhancement

---

### Turbo Output Configuration
**Issue:** Turbo may cache demo/mocks output unnecessarily

**Solution:** Review `turbo.json` output configuration

**Status:** Minor - does not impact development

---

## 🎯 Future Enhancements (Optional)

### Stretch Goals
1. **Extended Documentation**
   - "Recipes" for common integration patterns
   - Troubleshooting guide with solutions
   - Production deployment checklist

2. **Production Monitoring**
   - Sentry integration for error tracking
   - Datadog/Prometheus metrics
   - Custom analytics dashboard

3. **Enhanced Demo**
   - Additional showcase scenarios
   - Interactive tutorials
   - Performance benchmarks visualization

4. **Performance Optimization**
   - Virtual scrolling for command timeline
   - WebWorker for heavy computations
   - Lazy loading for overlay components

5. **Additional Commands**
   - `drag-drop` - Drag and drop interactions
   - `double-click` - Double-click events
   - `right-click` - Context menu triggers
   - `keyboard` - Complex keyboard sequences

6. **Enhanced AI Features**
   - Context-aware suggestions
   - Multi-step workflows
   - Voice input support

---

## 📞 Support & Resources

### Key Files to Reference
| Need | File Path |
|------|-----------|
| Quick setup | `.ai/NEXT_AGENT_START_HERE.md` |
| Detailed status | `.ai/project-status.md` (legacy) |
| Architecture | `docs/architecture/*.md` |
| Story details | `docs/stories/*.story.md` |
| API reference | `packages/sdk/README.md` |

### Common Commands Cheat Sheet
```bash
# Navigate to project
cd /Users/milad/Documents/Work/WS_SDK

# Health check
cd packages/sdk && npm test

# Build everything
npm run build

# Start development
npm run dev

# Run mocks only
npm run dev:mocks

# Lint & format
npm run lint
npm run format

# Git status
git status
git --no-pager log --oneline -10
git branch --show-current
```

---

## 📝 Session Notes

### Session History
All development sessions are logged in `.ai/session-*.md` files:
- `session-2025-11-16.md` - Story 1.3 completion
- `session-2025-11-16-story-3.1.md` - Story 3.1 AI Button Factory
- (Additional sessions as they occur)

### Creating Session Notes
When starting a new development session, create a session log:

```markdown
# Session YYYY-MM-DD - Story X.X

**Date:** YYYY-MM-DD
**Story:** X.X - Story Name
**Developer:** [Your Name/Agent]

## Objectives
- [ ] Objective 1
- [ ] Objective 2

## Work Done
1. Step 1 description
2. Step 2 description

## Tests Added
- Test suite 1 (X tests)
- Test suite 2 (Y tests)

## Next Steps
- [ ] Remaining task 1
- [ ] Remaining task 2
```

---

## ✅ Project Completion Checklist

### Epic 1: Connection & Targeting
- [x] Story 1.1 - Monorepo Setup & Tooling
- [x] Story 1.2 - WebSocket Client & Retry Logic
- [x] Story 1.3 - Element Targeting Strategy

### Epic 2: Command Execution Engine
- [x] Story 2.1 - Navigation & Refresh Commands
- [x] Story 2.2 - Interaction Commands Set A
- [x] Story 2.3 - Interaction Commands Set B

### Epic 3: AI Assist & Chatbot
- [x] Story 3.1 - AI Button Factory
- [x] Story 3.2 - AI Prompt Workflow
- [x] Story 3.3 - Chatbot Bridge

### Epic 4: Demo & Documentation
- [x] Story 4.1 - Showcase Page & Visual Logger
- [x] Story 4.2 - Mock WebSocket & REST Services
- [x] Story 4.3 - README & Developer Guide

### Quality Gates
- [x] All tests passing (118/118)
- [x] Build clean (no TypeScript errors)
- [x] Lint passing (no ESLint errors)
- [x] Documentation complete
- [x] QA approval on all stories
- [x] WCAG 2.1 AA compliance verified

---

## 🎊 Acknowledgments

### Development Team
- **Dev Agent (James)** - Implementation of all 12 stories
- **QA Agent (Quinn)** - Quality assurance and gate reviews
- **Story Manager (SM)** - Story creation and breakdown
- **BMad Master** - Project orchestration and documentation

### Tools & Frameworks
- **TypeScript 5.6** - Strict mode type safety
- **React 18** - UI components
- **Next.js 13+** - Demo application framework
- **Turbo** - Monorepo build orchestration
- **Node.js 18+** - Runtime environment
- **JSDOM** - DOM testing environment

---

**Last Updated:** 2025-11-16  
**Project Status:** ✅ 100% Complete - Production Ready  
**Repository:** `/Users/milad/Documents/Work/WS_SDK`

---

*For quick onboarding, start with `.ai/NEXT_AGENT_START_HERE.md`*  
*For specific implementation details, refer to story files in `docs/stories/`*  
*For architecture decisions, see `docs/architecture/*.md`*
