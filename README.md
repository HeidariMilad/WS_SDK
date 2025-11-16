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

## Current Status

**Branch**: `4.2.story` | **Tests**: 99/99 ✅ | **Build**: Passing ✅

- ✅ **Epic 1**: Connection & Targeting (100%)
- ✅ **Epic 2**: UI Command Set (100%)
- 🔄 **Epic 3**: AI Assist & Chatbot (33% - Story 3.1 complete)
- 🔄 **Epic 4**: Demo & Documentation (33% - Story 4.2 complete)

**Latest**: Story 4.2 - Mock WebSocket and REST services with command playlists ✅

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
- **Demo Application** - Interactive Next.js demo (Story 4.1)

### Recently Completed ✅
- **Mock Services** - WebSocket and REST mocks with command playlists (Story 4.2)

### Planned ⏳
- **SDK Documentation** - API reference and integration guide (Story 4.3)
