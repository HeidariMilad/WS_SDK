# Technical Assumptions

- Monorepo managed via npm workspaces with `packages/sdk`, `apps/demo`, and `apps/mocks` directories.
- React 18+, Next.js 13+ (App Router preferred), TypeScript 5+, Node.js 18+ runtime.
- State management limited to lightweight tools (React Context or Zustand); Redux avoided for scope control.
- Styling via CSS Modules or Tailwind CSS; highlight/hover animations defined with CSS keyframes.
- Manual testing prioritized; Jest + React Testing Library optional for targeted unit coverage.
- ESLint (React + TypeScript rules) and Prettier enforced across packages; builds managed by Next.js (Turbopack/Webpack).
- Local-only deployment; mocked WebSocket and REST endpoints hosted within the repo.
- Mock WebSocket served at `ws://localhost:8080`; mock API endpoints exposed via Next.js API routes under `/mock/*`.
- Input sanitization enforced for `fill` command; CSP compatibility maintained; no sensitive data stored.
- AI button lifecycle handles element unmounting to prevent orphaned DOM nodes.