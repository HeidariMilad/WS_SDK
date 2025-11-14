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

## Documentation

- [PRD](docs/prd.md)
- [Architecture](docs/architecture.md)
- [Front-End Spec](docs/front-end-spec.md)
