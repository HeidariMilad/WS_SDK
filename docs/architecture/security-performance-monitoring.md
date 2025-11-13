# Security, Performance  Monitoring

## Security Controls

- **Frontend:** Content Security Policy `default-src 'self'; connect-src ws://localhost:8080 https://*.vercel.app; script-src 'self'`. Rate-limit identical commands arriving within 50 ms to prevent flicker. Sanitize AI request metadata; avoid overlay injection on `contenteditable` unless explicitly enabled. Secrets managed via local `.env` and Vercel environment variables.

## Performance Targets

- Command effects within 100 ms; overlay render under 50 ms; timeline updates batched with `requestAnimationFrame` to avoid layout thrash. No asset caching required beyond Next.js defaults; leverage `next/dynamic` for heavy components such as `ChatbotDrawer`.

## Error Handling

- Unified error schema includes `requestId` for traceability. Frontend toasts and timeline entries surface every warning/error; console logging gated behind `NODE_ENV !== 'production'`. WebSocket status banner cycles through Connecting, Connected, Reconnecting, Offline.
