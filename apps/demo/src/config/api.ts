/**
 * Resolve the AI Prompt API endpoint URL for the demo.
 *
 * Supports environment variables for configuration:
 * - DEMO_AI_API_URL or NEXT_PUBLIC_DEMO_AI_API_URL: Full API base URL
 * - Defaults to http://localhost:3000 for local mock server
 *
 * For production, set to your real AI provider endpoint:
 * - OpenAI: https://api.openai.com/v1
 * - Anthropic: https://api.anthropic.com/v1
 * - Custom: https://your-api.example.com
 */
export function getDemoApiBaseUrl(): string {
  const global = globalThis as unknown as {
    process?: { env?: Record<string, string | undefined> };
  };
  const env = global.process?.env ?? {};

  return (
    env.DEMO_AI_API_URL ||
    env.NEXT_PUBLIC_DEMO_AI_API_URL ||
    'http://localhost:3000'
  );
}

/**
 * Determine if we should use local mock instead of HTTP requests.
 *
 * Set DEMO_USE_LOCAL_MOCK=true to bypass HTTP and use local mock responses.
 * Useful for development when the REST API server is not running.
 */
export function shouldUseLocalMock(): boolean {
  const global = globalThis as unknown as {
    process?: { env?: Record<string, string | undefined> };
  };
  const env = global.process?.env ?? {};

  return (
    env.DEMO_USE_LOCAL_MOCK === 'true' ||
    env.NEXT_PUBLIC_DEMO_USE_LOCAL_MOCK === 'true'
  );
}

