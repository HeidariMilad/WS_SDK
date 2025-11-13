# Integration Points

- `SDKProvider` initializes the connection and exposes context to UI components such as the status banner, timeline, and overlay inspector.
- Command timeline subscribes to the SDK logging bus for per-command visibility and surfaces missing element or payload warnings.
- Chatbot drawer implements `IChatbotBridge`; it auto-expands on new prompts, supports manual collapse, and stores transcripts for review.
- Mock services supply scripted WebSocket command playlists and deterministic AI prompt responses; optional remote deployment via Vercel Edge Functions enables asynchronous demos.
