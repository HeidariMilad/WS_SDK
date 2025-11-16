/**
 * AI Prompt API Client
 *
 * Handles communication with the mock AI prompt generation endpoint,
 * including retry logic, error handling, and request ID correlation.
 */
import { AIPromptRequest, AIPromptResponse } from "@frontend-ui-command-sdk/shared";
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
}
/**
 * Error thrown when the prompt API request fails.
 */
export declare class PromptApiError extends Error {
    readonly statusCode?: number | undefined;
    readonly requestId?: string | undefined;
    readonly details?: unknown | undefined;
    constructor(message: string, statusCode?: number | undefined, requestId?: string | undefined, details?: unknown | undefined);
}
/**
 * Enhanced response that includes correlation metadata.
 */
export interface PromptApiResponse extends AIPromptResponse {
    requestId: string;
}
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
export declare function requestAiPrompt(request: AIPromptRequest, config?: PromptClientConfig): Promise<PromptApiResponse>;
//# sourceMappingURL=promptClient.d.ts.map