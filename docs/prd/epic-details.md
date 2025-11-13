# Epic Details

## Epic 1 – SDK Foundations & Infrastructure
**Goal:** Provide a robust platform for command execution and integrations, ensuring SDK ergonomics and resiliency.

1. **Story 1.1 – Initialize Monorepo & Tooling**  
   - AC1: Monorepo with workspaces linking `sdk`, `demo`, and `mocks` packages is set up.  
   - AC2: ESLint (React + TypeScript) and Prettier configurations run cleanly across all packages.  
   - AC3: TypeScript strict-mode builds succeed for each package.

2. **Story 1.2 – WebSocket Client & Retry Logic**  
   - AC1: WebSocket client connects to configurable endpoint and logs status transitions.  
   - AC2: Exponential backoff reconnection attempts trigger after disconnect (maximum delay 3 seconds).  
   - AC3: Connection errors surface to demo UI without crashing the SDK.

3. **Story 1.3 – Element Targeting Utility**  
   - AC1: `data-elementid` resolution works with retry (five attempts, 100 ms interval).  
   - AC2: Custom selector override via payload options finds elements when data attribute is missing.  
   - AC3: Failure to locate an element emits structured warnings but allows subsequent commands to proceed.

## Epic 2 – Command Execution Engine
**Goal:** Implement all UI command handlers with observable behaviors aligned to assignment requirements.

1. **Story 2.1 – Navigation & Refresh Commands**  
   - AC1: `navigate` triggers Next.js router navigation and logs the destination route without full reload.  
   - AC2: `refresh_element` toggles lightweight state or invokes callbacks to re-render targeted components.  
   - AC3: Demo displays confirmation (log or notification) indicating command completion.

2. **Story 2.2 – Interaction Commands Set A (highlight, hover, focus, scroll)**  
   - AC1: `highlight` applies configurable glow/border effects and clears after duration.  
   - AC2: `hover` triggers hover styles/events for the provided duration.  
   - AC3: `focus` and `scroll` bring elements into view without duplicate scrolling or console errors.

3. **Story 2.3 – Interaction Commands Set B (click, fill, clear, select, open, close)**  
   - AC1: `click`, `fill`, `clear`, and `select` dispatch native events and update UI state predictably.  
   - AC2: `open` and `close` toggle panels/dialogues using host-compatible hooks.  
   - AC3: Command failures emit logs and user-facing feedback without interrupting the pipeline.

## Epic 3 – AI Assist Button & Chatbot Integration
**Goal:** Deliver AI button injection, mocked prompt API workflow, and chatbot communication loop.

1. **Story 3.1 – AI Button Factory**  
   - AC1: Public API attaches buttons with configurable style and placement.  
   - AC2: Buttons remove themselves cleanly if elements unmount or injection is refreshed.  
   - AC3: Styling respects host CSS and avoids layout shifts.

2. **Story 3.2 – Mock Prompt Call Workflow**  
   - AC1: Button click sends POST to `/mock/ai_generate_ui_prompt` with element context.  
   - AC2: Mock server responds with prompt/extraInfo, normalized by the SDK.  
   - AC3: Network errors surface in demo UI with retry messaging.

3. **Story 3.3 – Chatbot Bridge Integration**  
   - AC1: SDK defines `IChatbotBridge` interface; demo chatbot implements it.  
   - AC2: Received prompts render in chatbot transcript with metadata.  
   - AC3: Chatbot auto-expands when prompt arrives, while allowing manual close.

## Epic 4 – Demo Application & Documentation
**Goal:** Provide evaluator-friendly demo, mock services, and documentation.

1. **Story 4.1 – Showcase Page & Visual Logger**  
   - AC1: Page includes buttons, inputs, textarea, dropdowns, modal, and chatbot components.  
   - AC2: Visual log/console panel displays incoming commands, statuses, and errors.  
   - AC3: Demo includes inline guidance or links to command triggers.

2. **Story 4.2 – Mock Services Setup**  
   - AC1: `apps/mocks` exports start scripts launching WebSocket and REST endpoints.  
   - AC2: Command fixture playlist exercises every command automatically.  
   - AC3: README documents how to run mocks alongside Next.js dev server.

3. **Story 4.3 – README & Developer Guide**  
   - AC1: README covers prerequisites, installation, run instructions, and command walkthrough.  
   - AC2: SDK package README documents APIs, configuration, and integration snippets.  
   - AC3: Stretch goals are clearly labeled with implementation status.