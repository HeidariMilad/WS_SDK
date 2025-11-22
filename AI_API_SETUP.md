# AI API Setup Guide

This guide explains how to configure and run the AI prompt API for the demo application.

## Quick Start

### Option 1: Use Mock Server (Recommended for Development)

1. **Start the mock REST server** in a separate terminal:
   ```bash
   cd apps/mocks
   npm run dev
   ```
   The server will start on `http://localhost:3000`

2. **Start the demo app** (in another terminal):
   ```bash
   npm run dev --filter=@frontend-ui-command-sdk/demo
   ```

3. **Click an AI button** - you should see the POST request in the browser's Network tab:
   - URL: `http://localhost:3000/mock/ai_generate_ui_prompt`
   - Method: `POST`
   - Payload: Contains element metadata, timestamp, and context

### Option 2: Use Local Mock (No Server Required)

If you don't want to run the mock server, you can use local mock responses:

```bash
DEMO_USE_LOCAL_MOCK=true npm run dev --filter=@frontend-ui-command-sdk/demo
```

**Note**: This bypasses HTTP requests, so you won't see anything in the Network tab.

## Configuration

### Environment Variables

The demo app supports the following environment variables:

| Variable | Description | Default |
|----------|-------------|---------|
| `DEMO_AI_API_URL` or `NEXT_PUBLIC_DEMO_AI_API_URL` | Base URL for the AI API endpoint | `http://localhost:3000` |
| `DEMO_USE_LOCAL_MOCK` or `NEXT_PUBLIC_DEMO_USE_LOCAL_MOCK` | Use local mock instead of HTTP requests | `false` |

### Examples

```bash
# Use default mock server (localhost:3000)
npm run dev --filter=@frontend-ui-command-sdk/demo

# Use local mock (no HTTP requests)
DEMO_USE_LOCAL_MOCK=true npm run dev --filter=@frontend-ui-command-sdk/demo

# Point to a different API endpoint
DEMO_AI_API_URL=https://api.example.com npm run dev --filter=@frontend-ui-command-sdk/demo
```

## Request/Response Format

### Request Payload

When you click an AI button, a POST request is sent with this structure:

```typescript
{
  elementId?: string;
  value?: string;
  metadata: {
    elementId?: string;           // e.g., "submit-btn"
    tagName: string;              // e.g., "button", "input"
    textContent?: string;          // Visible text content
    value?: string;                // For inputs, the current value
    dataAttributes: Record<string, string>;  // All data-* attributes
    computedLabel?: string;        // Computed accessible label
    boundingBox: {
      top: number;
      left: number;
      width: number;
      height: number;
    }
  },
  timestamp: number,              // Unix timestamp in milliseconds
  context?: {
    userAgent: string,            // Browser user agent
    viewport: {
      width: number;              // Window width
      height: number;             // Window height
    }
  }
}
```

### Response Payload

The server responds with:

```typescript
{
  prompt: string;                 // Generated prompt text
  timestamp: number;              // Response timestamp
  extraInfo?: Record<string, unknown>;  // Additional metadata / suggestions
}
```

Example:

```jsonc
{
  "prompt": "Sample prompt for element X",
  "extraInfo": {
    "infoKey": "infoValue",
    "elementContext": {
      "elementId": "element-x",
      "tagName": "textarea",
      "value": "Current user-entered text"
    }
  },
  "timestamp": 1704067200050
}
```

## Future: Real AI Provider Integration

When you're ready to integrate with real AI providers (OpenAI, Anthropic, etc.):

1. **Option A**: Update the mock server to proxy requests to your provider
   - Modify `apps/mocks/src/server.ts` to forward requests to your AI provider
   - Add authentication headers as needed

2. **Option B**: Create your own backend
   - Implement the same endpoint: `POST /mock/ai_generate_ui_prompt`
   - Use the same request/response types from `@frontend-ui-command-sdk/shared`
   - Set `DEMO_AI_API_URL` to point to your backend

3. **Option C**: Use environment variables
   - Set `DEMO_AI_API_URL` to your provider's endpoint
   - Ensure your backend implements the same contract

The SDK is designed to work with any backend that implements the `AIPromptRequest`/`AIPromptResponse` contract.

## Troubleshooting

### No POST request in Network tab?

1. Check that `useLocalMock` is not set to `true`
2. Verify the mock server is running: `curl http://localhost:3000/health`
3. Check browser console for errors
4. Verify the demo app is using the correct API URL

### Mock server not starting?

1. Check if port 3000 is already in use: `lsof -i :3000`
2. Try a different port: `PORT=3001 npm run dev` (and update `DEMO_AI_API_URL` accordingly)
3. Check the mock server logs for errors

### CORS errors?

The mock server includes CORS middleware. If you're using a different backend, ensure CORS is enabled for your demo app's origin.

