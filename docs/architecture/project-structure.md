# Project Structure  Workflow

```
frontend-ui-command-sdk/
├── apps/
│   ├── demo/
│   │   ├── app/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── context/
│   │   ├── styles/
│   │   └── package.json
│   └── mocks/
│       ├── ws/
│       ├── api/
│       ├── fixtures/
│       └── package.json
├── packages/
│   ├── sdk/
│   │   ├── src/
│   │   └── package.json
│   ├── shared/
│   │   └── src/
│   └── config/
├── docs/
│   ├── prd.md
│   ├── front-end-spec.md
│   └── architecture.md
├── infrastructure/
│   └── vercel.json
├── .github/workflows/
│   └── ci.yml
├── package.json
├── turbo.json
└── README.md
```

- **Prerequisites:** Node 18+, npm (or pnpm), Vercel CLI for deployments.
- **Setup:** `npm install`; copy `.env.example` to `.env.local` (demo) and `.env.mock` (mocks).
- **Start all:** `npm run dev -- --filter=demo --parallel --include-dependencies` (launches SDK build watch, demo, mocks).
- **Start demo:** `npm run dev -- --filter=demo`.
- **Start mocks:** `npm run dev -- --filter=mocks`.
- **Tests:** `npm run test -- --filter=sdk`, `npm run test -- --filter=demo`, `npm run test -- --filter=mocks`, `npm run test:e2e`.
