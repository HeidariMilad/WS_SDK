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

```bash
npm install
```

## Development

### Start all services (demo + mocks)

```bash
npm run dev
```

### Start individual packages

```bash
npm run dev --filter=demo
npm run dev --filter=mocks
```

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

## Current Status

**Branch**: `3.2.story` | **Tests**: 99/99 ✅ | **Build**: Passing ✅

- ✅ **Epic 1**: Connection & Targeting (100%)
- ✅ **Epic 2**: UI Command Set (100%)
- 🔄 **Epic 3**: AI Assist & Chatbot (33% - Story 3.1 complete)
- ⏳ **Epic 4**: Demo & Documentation (0%)

**Latest**: Story 3.1 - AI Button Factory with WeakMap registry, portal rendering, and WCAG 2.1 AA accessibility ✅

## Documentation

### Development Guides
- 📋 **[DEV_STATUS.md](DEV_STATUS.md)** - Comprehensive project state and development guide
- ⚡ **[QUICK_REF.md](QUICK_REF.md)** - Quick reference card for fast orientation

### Project Docs
- [PRD](docs/prd.md) - Product requirements
- [Architecture](docs/architecture.md) - Technical architecture
- [Front-End Spec](docs/front-end-spec.md) - UI/UX specifications
- [Stories](docs/stories/) - Story files with implementation details

## Key Features

### Implemented ✅
- **WebSocket Client** - Connection management with retry logic and heartbeat
- **Element Targeting** - `data-elementid` targeting with CSS selector fallback
- **11 UI Commands** - click, fill, clear, focus, hover, select, highlight, scroll, open-close, navigate, refresh
- **AI Button Factory** - Configurable overlay buttons with lifecycle management
- **Accessibility** - WCAG 2.1 AA compliant with ARIA labels and keyboard support

### In Progress 🔄
- **AI Prompt Workflow** - Metadata collection and prompt generation (Story 3.2)
- **Chatbot Bridge** - IChatbotBridge interface implementation (Story 3.3)

### Planned ⏳
- **Demo Application** - Interactive Next.js demo (Story 4.1)
- **Mock Services** - WebSocket and REST mocks (Story 4.2)
- **SDK Documentation** - API reference and integration guide (Story 4.3)
