"use strict";
/**
 * AI Prompt API Client
 *
 * Handles communication with the mock AI prompt generation endpoint,
 * including retry logic, error handling, and request ID correlation.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromptApiError = void 0;
exports.requestAiPrompt = requestAiPrompt;
const loggingBus_1 = require("../logging/loggingBus");
/**
 * Error thrown when the prompt API request fails.
 */
class PromptApiError extends Error {
    constructor(message, statusCode, requestId, details) {
        super(message);
        this.statusCode = statusCode;
        this.requestId = requestId;
        this.details = details;
        this.name = "PromptApiError";
    }
}
exports.PromptApiError = PromptApiError;
const DEFAULT_CONFIG = {
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
async function requestAiPrompt(request, config = {}) {
    const finalConfig = { ...DEFAULT_CONFIG, ...config };
    const requestId = generateRequestId();
    const url = `${finalConfig.baseUrl}/mock/ai_generate_ui_prompt`;
    // Log the prompt request
    loggingBus_1.globalLoggingBus.log({
        severity: "info",
        category: "ai-prompt",
        message: `Requesting AI prompt for element: ${request.metadata.elementId || "unknown"}`,
        metadata: { requestId, elementId: request.metadata.elementId },
    });
    // Optional shortcut: generate a local mock response without any HTTP call.
    if (finalConfig.useLocalMock) {
        const localResponse = buildLocalPromptResponse(request, requestId);
        loggingBus_1.globalLoggingBus.log({
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
    let lastError = null;
    const maxAttempts = finalConfig.enableRetry ? 2 : 1;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            const response = await fetchWithTimeout(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-Request-ID": requestId,
                },
                body: JSON.stringify(request),
            }, finalConfig.timeoutMs);
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new PromptApiError(errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`, response.status, requestId, errorData);
            }
            const data = await response.json();
            // Normalize response and attach requestId
            const normalizedResponse = {
                prompt: data.prompt,
                timestamp: data.timestamp || Date.now(),
                metadata: data.metadata || {},
                requestId,
            };
            // Log success
            loggingBus_1.globalLoggingBus.log({
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
        }
        catch (error) {
            lastError = error;
            // Log the error
            loggingBus_1.globalLoggingBus.log({
                severity: attempt < maxAttempts ? "warning" : "error",
                category: "ai-prompt",
                message: `AI prompt request failed (attempt ${attempt}/${maxAttempts}): ${error.message}`,
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
    throw new PromptApiError(`Failed to request AI prompt after ${maxAttempts} attempt(s): ${lastError?.message}`, lastError instanceof PromptApiError ? lastError.statusCode : undefined, requestId, lastError);
}
/**
 * Build a local mock prompt response without calling the REST API.
 *
 * This keeps the demo functional in environments where the backend
 * is not running while still exercising the full AI overlay workflow.
 */
function buildLocalPromptResponse(request, requestId) {
    const meta = request.metadata;
    const label = meta.computedLabel ||
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
async function fetchWithTimeout(url, options, timeoutMs) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal,
        });
        return response;
    }
    catch (error) {
        if (error.name === "AbortError") {
            throw new Error(`Request timeout after ${timeoutMs}ms`);
        }
        throw error;
    }
    finally {
        clearTimeout(timeoutId);
    }
}
/**
 * Simple delay utility.
 *
 * @param ms - Milliseconds to delay.
 * @returns Promise that resolves after the delay.
 */
function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
/**
 * Generate a unique request ID for correlation.
 *
 * @returns A unique request identifier.
 */
function generateRequestId() {
    return `prompt_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
}
//# sourceMappingURL=promptClient.js.map