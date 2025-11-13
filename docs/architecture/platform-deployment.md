# Platform, Deployment  Resilience

## Deployment Blueprint

- **Frontend Demo:** Vercel deploys the Next.js demo with build command `npm run build -- --filter=demo`; assets served via the Vercel CDN.
- **SDK Package:** `npm publish --workspace packages/sdk` executed from GitHub Actions on tagged releases.
- **Mock Services:** Default local runtime; optional deployment to Vercel Edge Functions for remote demos.
- **CI/CD:** `.github/workflows/ci.yml` installs dependencies, runs `npm run lint`, executes unit + e2e tests, then builds artifacts. PRs receive preview deployments; main-branch tags trigger publish.
- **Rollback:** Vercel dashboard restores previous deployments; SDK releases revert by pushing prior semver tag and updating `CHANGELOG.md`.

## Resilience & Monitoring

- **Retry Policies:** WebSocket reconnection uses exponential backoff (1 s, 2 s, 3 s cap). Element targeting retries as defined in targeting strategy. AI prompt API retries once on network failure with a 500 ms delay.
- **Graceful Degradation:** Unknown commands emit warnings; missing elements trigger timeline alerts and overlay tooltips. Chatbot offline state shows inline retry action.
- **Logging:** SDK logging bus supports console (development) and optional Sentry adapters; timeline persists last 50 entries for immediate inspection.
- **Monitoring:** `@vercel/analytics` instruments the demo; Sentry (optional) captures SDK events. Metrics (command count, success rate) exposed via context for dashboards.
- **Alerts:** Configure Vercel monitors or custom webhooks for error-rate thresholds (>10% in 5 minutes).
