/**
 * AI Prompt API Client
 *
 * Handles communication with the mock AI prompt generation endpoint,
 * including retry logic, error handling, and request ID correlation.
 */

import {
  AIPromptRequest,
  AIPromptResponse,
} from "@frontend-ui-command-sdk/shared";
import { globalLoggingBus } from "../logging/loggingBus";

/**
 * Configuration for the prompt API client.
 */
export interface PromptClientConfig {
  /**
   * Base URL for the API endpoint.
   * @default "http://localhost:3000"
   */
  baseUrl?: string;

  /**
   * Enable retry on network failures.
   * @default true
   */
  enableRetry?: boolean;

  /**
   * Delay in milliseconds before retrying.
   * @default 500
   */
  retryDelayMs?: number;

  /**
   * Timeout in milliseconds for each request.
   * @default 10000
   */
  timeoutMs?: number;

  /**
   * If true, skip the HTTP request and generate a local mock prompt
   * response instead. Useful for demos when the REST API is not running.
   * @default false
   */
  useLocalMock?: boolean;
}

/**
 * Error thrown when the prompt API request fails.
 */
export class PromptApiError extends Error {
  constructor(
    message: string,
    public readonly statusCode?: number,
    public readonly requestId?: string,
    public readonly details?: unknown
  ) {
    super(message);
    this.name = "PromptApiError";
  }
}

/**
 * Enhanced response that includes correlation metadata.
 */
export interface PromptApiResponse extends AIPromptResponse {
  requestId: string;
}

const DEFAULT_CONFIG: Required<PromptClientConfig> = {
  baseUrl: "http://localhost:3000",
  enableRetry: true,
  retryDelayMs: 500,
  timeoutMs: 10000,
  useLocalMock: false,
};

/**
 * Request an AI prompt from the mock generation endpoint.
 *
 * Implements:
 * - Single retry on network failures with configurable delay
 * - Request ID correlation for tracing
 * - Structured error handling with logging
 * - Timeout protection
 *
 * @param request - The AI prompt request payload.
 * @param config - Optional configuration overrides.
 * @returns Promise resolving to the normalized prompt response with requestId.
 * @throws {PromptApiError} If the request fails after retry attempts.
 */
export async function requestAiPrompt(
  request: AIPromptRequest,
  config: PromptClientConfig = {}
): Promise<PromptApiResponse> {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  const requestId = generateRequestId();
  const url = `${finalConfig.baseUrl}/mock/ai_generate_ui_prompt`;

  // Log the prompt request
  globalLoggingBus.log({
    severity: "info",
    category: "ai-prompt",
    message: `Requesting AI prompt for element: ${request.metadata.elementId || "unknown"}`,
    metadata: { requestId, elementId: request.metadata.elementId },
  });

  // Optional shortcut: generate a local mock response without any HTTP call.
  if (finalConfig.useLocalMock) {
    const localResponse = buildLocalPromptResponse(request, requestId);

    globalLoggingBus.log({
      severity: "info",
      category: "ai-prompt",
      message: `AI prompt generated locally for element: ${request.metadata.elementId || "unknown"}`,
      metadata: {
        requestId,
        elementId: request.metadata.elementId,
        promptLength: localResponse.prompt.length,
        source: "local-mock",
      },
    });

    return localResponse;
  }

  let lastError: Error | null = null;
  const maxAttempts = finalConfig.enableRetry ? 2 : 1;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const response = await fetchWithTimeout(
        url,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Request-ID": requestId,
          },
          body: JSON.stringify(request),
        },
        finalConfig.timeoutMs
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new PromptApiError(
          errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`,
          response.status,
          requestId,
          errorData
        );
      }

      const data: AIPromptResponse = await response.json();

      // Normalize response and attach requestId
      const normalizedResponse: PromptApiResponse = {
        prompt: data.prompt,
        timestamp: data.timestamp || Date.now(),
        metadata: data.metadata || {},
        requestId,
      };

      // Log success
      globalLoggingBus.log({
        severity: "info",
        category: "ai-prompt",
        message: `AI prompt received for element: ${request.metadata.elementId || "unknown"}`,
        metadata: {
          requestId,
          elementId: request.metadata.elementId,
          promptLength: normalizedResponse.prompt.length,
        },
      });

      return normalizedResponse;
    } catch (error) {
      lastError = error as Error;

      // Log the error
      globalLoggingBus.log({
        severity: attempt < maxAttempts ? "warning" : "error",
        category: "ai-prompt",
        message: `AI prompt request failed (attempt ${attempt}/${maxAttempts}): ${(error as Error).message}`,
        metadata: {
          requestId,
          elementId: request.metadata.elementId,
          attempt,
          error: error instanceof Error ? error.message : String(error),
        },
      });

      // If we have more attempts and retry is enabled, wait before retrying
      if (attempt < maxAttempts) {
        await delay(finalConfig.retryDelayMs);
      }
    }
  }

  // All attempts failed
  throw new PromptApiError(
    `Failed to request AI prompt after ${maxAttempts} attempt(s): ${lastError?.message}`,
    lastError instanceof PromptApiError ? lastError.statusCode : undefined,
    requestId,
    lastError
  );
}

/**
 * Build a local mock prompt response without calling the REST API.
 *
 * This keeps the demo functional in environments where the backend
 * is not running while still exercising the full AI overlay workflow.
 */
function buildLocalPromptResponse(
  request: AIPromptRequest,
  requestId: string
): PromptApiResponse {
  const meta = request.metadata;
  const label =
    meta.computedLabel ||
    meta.textContent ||
    meta.elementId ||
    meta.tagName ||
    "unknown element";

  const prompt = `Sample AI prompt for \"${label}\". Describe what you want to do with this UI element or how it should behave.`;

  return {
    prompt,
    timestamp: Date.now(),
    metadata: {
      source: "local-mock",
      elementId: meta.elementId,
      tagName: meta.tagName,
    },
    requestId,
  };
}

/**
 * Fetch with timeout support.
 *
 * @param url - The URL to fetch.
 * @param options - Fetch options.
 * @param timeoutMs - Timeout in milliseconds.
 * @returns Promise resolving to the fetch Response.
 */
async function fetchWithTimeout(
  url: string,
  options: RequestInit,
  timeoutMs: number
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    return response;
  } catch (error) {
    if ((error as Error).name === "AbortError") {
      throw new Error(`Request timeout after ${timeoutMs}ms`);
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Simple delay utility.
 *
 * @param ms - Milliseconds to delay.
 * @returns Promise that resolves after the delay.
 */
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Generate a unique request ID for correlation.
 *
 * @returns A unique request identifier.
 */
function generateRequestId(): string {
  return `prompt_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
}
