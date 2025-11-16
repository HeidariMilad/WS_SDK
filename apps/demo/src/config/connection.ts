/**
 * Resolve the WebSocket endpoint URL for the demo.
 *
 * For now this is a thin wrapper around environment configuration so that
 * the same demo can point at local mocks or remote environments.
 */
export function getDemoWebSocketUrl(): string {
  const global = globalThis as unknown as {
    process?: { env?: Record<string, string | undefined> };
  };
  const env = global.process?.env ?? {};

  return env.DEMO_WEBSOCKET_URL || env.NEXT_PUBLIC_DEMO_WEBSOCKET_URL || 'ws://localhost:8080/ws';
}
