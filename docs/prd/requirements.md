# Requirements

## Functional Requirements
1. **FR1:** The SDK shall establish a WebSocket connection to a configurable server (default `ws://localhost:8080`) and maintain it with automatic reconnection attempts using exponential backoff when disconnected.
2. **FR2:** The SDK shall accept JSON WebSocket messages with the shape `{ command, elementId, payload }` and route each to the corresponding command handler.
3. **FR3:** The `navigate` command shall simulate client-side navigation to `payload.value` without triggering a full browser reload.
4. **FR4:** The `refresh_element` command shall re-render the targeted component without a page reload, e.g., toggling lightweight state or invoking registered refresh callbacks.
5. **FR5:** The `highlight` command shall apply a temporary glow/border effect (configurable color/duration) that clears after the optional `payload.options.duration` (default 2000 ms).
6. **FR6:** The `click` command shall trigger a synthetic click event on the target element.
7. **FR7:** The `fill` command shall set input/textarea values to `payload.value` and dispatch input/change events to preserve existing logic.
8. **FR8:** The `clear` command shall empty input/textarea values and dispatch appropriate events.
9. **FR9:** The `focus` command shall scroll the element into view and call `.focus()`, avoiding duplicate scrolling when already visible.
10. **FR10:** The paired `open` / `close` commands shall toggle panel or dialog visibility via ARIA attributes, CSS classes, or provided callbacks without breaking host logic.
11. **FR11:** The `scroll` command shall scroll the element into view using behavior options (`smooth` or `auto`) supplied in `payload.options`.
12. **FR12:** The `select` command shall set the selected value of dropdown elements using `payload.value`, firing change events.
13. **FR13:** The `hover` command shall simulate mouseenter/mouseover events and apply hover styles for the optional `payload.options.duration` (default 2000 ms).
14. **FR14:** The SDK shall provide an element targeting system supporting `data-elementid` attributes, optional custom selectors (`payload.options.selector`), and retry logic (5 attempts, 100 ms intervals) for dynamic DOM nodes.
15. **FR15:** The SDK shall expose an API to append AI-assist buttons onto elements with configurable icon, tooltip, style class names, and position (top-left, top-right, center, or custom offsets).
16. **FR16:** Clicking an AI-assist button shall POST to `/mock/ai_generate_ui_prompt` with `{ elementId, value, metadata }`, where `value` and `metadata` describe the current element state.
17. **FR17:** The SDK shall receive mock responses `{ prompt, extraInfo }`, forward them to a chatbot component via a documented interface, and automatically open the chatbot if minimized.
18. **FR18:** The SDK shall define a minimal chatbot bridge interface (e.g., `IChatbotBridge`) describing required methods (`receivePrompt`, `open`, `close`) for host integration.
19. **FR19:** The demo Next.js app shall display buttons, inputs, textareas, dropdowns, and modal/dialog components tagged with unique `data-elementid` values.
20. **FR20:** The demo shall run a mock WebSocket server that emits sample messages covering all commands, with visible effects for each.
21. **FR21:** The demo shall provide a mock API endpoint (`/mock/ai_generate_ui_prompt`) returning static responses to exercise the AI workflow end-to-end.
22. **FR22:** The demo UI shall include visible logging (toast, sidebar, or inline list) displaying command execution status and errors for evaluator review.
23. **FR23:** The SDK shall gracefully handle invalid commands, unknown `elementId`, and network failures by logging descriptive diagnostics without crashing or blocking subsequent commands.

## Non-Functional Requirements
1. **NFR1:** Implementation shall use TypeScript 5+ with `"strict": true` and zero `any` types in production code.
2. **NFR2:** Public SDK APIs shall include complete JSDoc documentation covering parameters, return values, and usage notes.
3. **NFR3:** SDK interactions shall preserve existing component logic by dispatching native browser events and exposing optional callbacks instead of mutating internal component state.
4. **NFR4:** AI button rendering shall use safe DOM techniques (React portals or dedicated containers) with sanitized strings to avoid XSS or CSP violations.
5. **NFR5:** Command handlers shall be idempotent or produce predictable results when commands are replayed (e.g., repeated `fill` commands with same value).
6. **NFR6:** Local setup shall complete in under five minutes via documented `npm install && npm run dev` flow, with pnpm/nvm alternatives noted.
7. **NFR7:** The repository shall follow a monorepo layout (`packages/sdk`, `apps/demo`, `apps/mocks`) managed via npm workspaces.
8. **NFR8:** Element targeting retries shall terminate after timeout, emitting developer-friendly logs to aid debugging of dynamic content.
9. **NFR9:** All command effects shall be visually verifiable in the demo using consistent styling to support interview evaluation.
10. **NFR10:** The demo shall run without console errors or unhandled promise rejections during normal operation.
11. **NFR11:** Highlight and hover animations shall use non-blocking CSS transitions/keyframes with configurable durations.
12. **NFR12:** Error handling shall include user-facing notifications plus structured logs (`{ command, elementId, error }`) for debugging.
13. **NFR13:** Documentation shall cover SDK usage, mock server setup, command examples, AI button integration, and chatbot bridge implementation.
14. **NFR14:** Optional stretch goals (smooth spotlight animation, debounce/throttle, drag-and-drop button positioning, multi-target commands) shall be documented but treated as post-MVP enhancements unless explicitly implemented.