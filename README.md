# Frontend UI Command SDK

A TypeScript SDK for executing WebSocket UI commands, integrating AI-assist overlays, and connecting with chatbot services.

## Prerequisites

- Node.js 18+
- npm 9+

## Project Structure

This is a monorepo managed via npm workspaces and Turbo:

- `apps/demo` — Next.js demo app showcasing SDK behavior
- `apps/mocks` — Mock WebSocket and REST services for local development
- `packages/sdk` — Core SDK package
- `packages/shared` — Shared TypeScript types and utilities
- `packages/config` — Shared configuration (reserved)

## Setup

From a fresh checkout:

```bash
npm install
```

This installs all workspace dependencies for the demo app, mocks, and SDK packages.

## Development

### Start all services (demo + mocks)

```bash
npm run dev
```

This runs the demo app and mock services together so you can see commands flowing end‑to‑end.

### Start individual apps

```bash
npm run dev --filter=@frontend-ui-command-sdk/demo
npm run dev --filter=@frontend-ui-command-sdk/mocks
```

Use this when you want to iterate on the demo UI or mock services in isolation.

### Running Mock Services

The mock services provide WebSocket and REST endpoints for testing the SDK:

#### Start REST API Mock (AI Prompt Endpoint)

```bash
cd apps/mocks
npm run dev          # Development mode with hot reload
npm start            # Production mode
```

- **REST API**: `http://localhost:3000`
- **Endpoint**: `POST /mock/ai_generate_ui_prompt`
- **Health Check**: `GET /health`

#### Start WebSocket Mock Server (Command Playlists)

```bash
cd apps/mocks
npm run dev:ws       # Development mode with hot reload
npm run start:ws     # Production mode
```

- **WebSocket**: `ws://localhost:8080`
- **Available Playlists**: `basic`, `full`, `stress`
- **Usage**: `ws://localhost:8080?playlist=basic&interval=1000&loop=true`

#### Start Both Services Together

```bash
cd apps/mocks
npm run dev:all      # Start both REST and WebSocket in development mode
npm run start:all    # Start both in production mode
```

#### Command Playlists

- **basic-playlist.json**: Covers all 12 command types with success scenarios
- **full-playlist.json**: Comprehensive coverage with success, warning, and error scenarios
- **stress-playlist.json**: High-volume command sequence for performance testing (100ms intervals)

#### Configuration

- **REST Port**: Set `PORT` environment variable (default: 3000)
- **WebSocket Port**: Set `WS_PORT` environment variable (default: 8080)
- **Playlist**: Query parameter `?playlist=basic|full|stress`
- **Interval**: Query parameter `?interval=1000` (milliseconds between commands)
- **Loop**: Query parameter `?loop=true` (repeat playlist)

### Build all packages

```bash
npm run build
```

### Lint

```bash
npm run lint
```

### Format code

```bash
npm run format
```

### Run tests

```bash
npm run test
npm run test:e2e
```

Follow the commands above from a clean checkout to validate that documentation and scripts are up to date.

## Demo usage & command walkthrough

The demo application (once implemented) is a single-page UI that demonstrates how incoming WebSocket commands affect the page and how AI overlays behave.

- **Status & Controls Bar** — Shows connection state, provides a manual "send command" control, and exposes shortcuts for attaching AI overlays.
- **Interactive Canvas** — Contains buttons, form fields, dropdowns, and panels instrumented with `data-elementid` attributes. Remote commands such as `click`, `fill`, `hover`, `select`, and `navigate` produce visible state changes here.
- **Command Timeline / Logger** — Displays a streaming list of commands with status (Success/Warning/Error), payload preview, and target identifiers. Every command produces a log entry.
- **Chatbot Drawer (AI Assist)** — When AI overlays are attached, clicking an AI button opens a side drawer showing prompts and responses from the mock chatbot service.

When you run the demo against mocks, you should see:

1. WebSocket connection establishing and reconnecting automatically on transient failures.
2. UI elements briefly highlighted as commands are applied (e.g., a `click` glowing the target element).
3. Matching entries in the command timeline with timestamps and statuses.
4. AI buttons attached to selected elements; clicking them sends context to the mock AI endpoint and surfaces the response in the chatbot drawer.

Refer to `docs/front-end-spec.md` for full UX flows, wireframes, and accessibility requirements that the demo is intended to satisfy.

## Current Status

**Branch**: `main` | **Tests**: 118/118 ✅ | **Build**: Passing ✅

- ✅ **Epic 1**: Connection & Targeting (100%)
- ✅ **Epic 2**: UI Command Set (100%)
- ✅ **Epic 3**: AI Assist & Chatbot (100%)
- ✅ **Epic 4**: Demo & Documentation (100%)

**Latest**: All stories complete - Project ready for production ✅

## Documentation

### Development Guides
- 📋 **[DEV_STATUS.md](DEV_STATUS.md)** - Comprehensive project state and development guide
- ⚡ **[QUICK_REF.md](QUICK_REF.md)** - Quick reference card for fast orientation

### Project Docs
- [PRD](docs/prd.md) - Product requirements
- [Architecture](docs/architecture.md) - Technical architecture (sharded under `docs/architecture/`)
- [Front-End Spec](docs/front-end-spec.md) - UI/UX specifications and user flows
- [Stories](docs/stories/) - Story files with implementation details

### Architecture & design references for integrators

If you are integrating the SDK into your own app, the most relevant documents are:

- [`docs/architecture/overview-and-modules.md`](docs/architecture/overview-and-modules.md) — High-level module boundaries and monorepo layout.
- [`docs/architecture/command-pipeline.md`](docs/architecture/command-pipeline.md) — How `WebSocketConnection`, the dispatcher, and command handlers fit together.
- [`docs/architecture/element-targeting.md`](docs/architecture/element-targeting.md) — Targeting strategy using `data-elementid` and CSS selectors.
- [`docs/architecture/ai-overlay.md`](docs/architecture/ai-overlay.md) — Design of the AI overlay button factory and lifecycle.
- [`docs/front-end-spec.md`](docs/front-end-spec.md) — UX, accessibility, and demo behavior expectations.

These references explain the design decisions behind the exported SDK APIs and help you adopt the same patterns in your own UI.

## Key Features

### Implemented ✅
- **WebSocket Client** - Connection management with exponential backoff retry logic and heartbeat
- **Element Targeting** - `data-elementid` targeting with CSS selector fallback and retry logic
- **11 UI Commands** - click, fill, clear, focus, hover, select, highlight, scroll, open-close, navigate, refresh
- **AI Button Factory** - Configurable overlay buttons with lifecycle management and WeakMap registry
- **AI Prompt Workflow** - Metadata collection and prompt generation (Story 3.2)
- **Chatbot Bridge** - IChatbotBridge interface implementation (Story 3.3)
- **Demo Application** - Interactive Next.js demo with showcase page and visual logger (Story 4.1)
- **Mock Services** - WebSocket and REST mocks with command playlists (Story 4.2)
- **SDK Documentation** - Comprehensive API reference and integration guide (Story 4.3)
- **Accessibility** - WCAG 2.1 AA compliant with ARIA labels and keyboard support

### Planned / Stretch Goals ⏳
- **Extended SDK Documentation** - Deeper guides ("recipes"), troubleshooting, and production-ready integration patterns beyond this assignment scope

## Maintenance & contribution

### Running checks locally

From the monorepo root:

- `npm run lint` — Lint all workspaces via Turbo.
- `npm run test` — Run unit tests (currently focused on the SDK package).
- `npm run test:e2e` — Placeholder end-to-end test runner; wire this up as the demo matures.

### Adding new UI commands

1. Implement the command handler in `packages/sdk/src/commands/` with a clear, deterministic DOM effect and logging.
2. Export it from the command registry and, if needed, from `src/index.ts`.
3. Update the demo app to showcase the new command on the canvas and surface logs in the timeline.
4. Extend documentation (root `README.md` and/or `packages/sdk/README.md`) to describe the new command and its payload.

### Updating documentation

- Keep `README.md` as the single entry point for setup, scripts, and high-level feature status.
- Use `packages/sdk/README.md` for SDK-specific API and integration details.
- When changing behavior that affects reviewers (commands, overlays, logging), update both the docs and demo so they stay in sync.

### PR and review guidelines

- Prefer small, story-scoped PRs linked to specific story files under `docs/stories/`.
- Ensure lint and tests pass locally before opening a PR.
- Summarize user-facing changes in the PR description and reference any updated documentation sections.
