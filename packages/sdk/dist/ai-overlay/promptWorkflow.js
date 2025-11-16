"use strict";
/**
 * AI Prompt Workflow Integration
 *
 * Coordinates the full AI button click → prompt request → chatbot flow.
 * Integrates promptClient, chatbot bridge, and logging.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.setChatbotBridge = setChatbotBridge;
exports.getChatbotBridge = getChatbotBridge;
exports.configurePromptWorkflow = configurePromptWorkflow;
exports.handleAIButtonClick = handleAIButtonClick;
exports.formatPromptError = formatPromptError;
const promptClient_1 = require("./promptClient");
const loggingBus_1 = require("../logging/loggingBus");
/**
 * Global reference to the chatbot bridge implementation.
 * Should be set by the host application during SDK initialization.
 */
let chatbotBridge = null;
/**
 * Configuration for the prompt workflow.
 */
let workflowConfig = {};
/**
 * Set the chatbot bridge implementation.
 *
 * @param bridge - The IChatbotBridge implementation.
 */
function setChatbotBridge(bridge) {
    chatbotBridge = bridge;
}
/**
 * Get the current chatbot bridge.
 *
 * @returns The chatbot bridge or null if not set.
 */
function getChatbotBridge() {
    return chatbotBridge;
}
/**
 * Configure the prompt workflow.
 *
 * @param config - Configuration for the prompt API client.
 */
function configurePromptWorkflow(config) {
    workflowConfig = { ...workflowConfig, ...config };
}
/**
 * Convert ElementMetadata to AIElementMetadata.
 *
 * @param metadata - Element metadata from the overlay system.
 * @returns AI element metadata for the prompt request.
 */
function toAIElementMetadata(metadata) {
    return {
        elementId: metadata.elementId,
        tagName: metadata.tagName,
        textContent: metadata.textContent,
        value: metadata.value,
        dataAttributes: metadata.dataAttributes,
        computedLabel: metadata.computedLabel,
        boundingBox: metadata.boundingBox,
    };
}
/**
 * Handle AI button click and execute the full prompt workflow.
 *
 * This is the main entry point for AI button clicks:
 * 1. Gather element context and construct AIPromptRequest
 * 2. Call the prompt API client (with retry logic)
 * 3. Emit ChatbotEvent with the response
 * 4. Open chatbot and send prompt via the bridge
 *
 * @param metadata - Metadata about the element that was clicked.
 * @returns Promise that resolves when the workflow completes.
 * @throws {PromptApiError} If the prompt request fails after retries.
 */
async function handleAIButtonClick(metadata) {
    const elementId = metadata.elementId || "unknown";
    // Log the button click
    loggingBus_1.globalLoggingBus.log({
        severity: "info",
        category: "ai-prompt",
        message: `AI button clicked for element: ${elementId}`,
        metadata: { elementId },
    });
    try {
        // 1. Construct the prompt request with element context
        const aiMetadata = toAIElementMetadata(metadata);
        const promptRequest = {
            metadata: aiMetadata,
            timestamp: Date.now(),
            context: {
                // Additional context can be added here
                userAgent: navigator.userAgent,
                viewport: {
                    width: window.innerWidth,
                    height: window.innerHeight,
                },
            },
        };
        // 2. Call the prompt API client (includes retry logic)
        const promptResponse = await (0, promptClient_1.requestAiPrompt)(promptRequest, workflowConfig);
        // 3. Emit ChatbotEvent
        const chatbotEvent = {
            type: "AI_PROMPT",
            payload: {
                prompt: promptResponse.prompt,
                metadata: aiMetadata,
                timestamp: promptResponse.timestamp,
            },
        };
        emitChatbotEvent(chatbotEvent);
        // 4. Interact with chatbot bridge if available
        if (chatbotBridge) {
            // Open the chatbot UI
            if (!chatbotBridge.isOpen()) {
                chatbotBridge.open();
                // Emit open event
                emitChatbotEvent({
                    type: "CHATBOT_OPEN",
                    payload: {
                        timestamp: Date.now(),
                    },
                });
            }
            // Send the prompt to the chatbot
            chatbotBridge.receivePrompt(promptResponse.prompt, aiMetadata);
            loggingBus_1.globalLoggingBus.log({
                severity: "info",
                category: "ai-prompt",
                message: `Prompt sent to chatbot for element: ${elementId}`,
                metadata: {
                    elementId,
                    requestId: promptResponse.requestId,
                    promptLength: promptResponse.prompt.length,
                },
            });
        }
        else {
            loggingBus_1.globalLoggingBus.log({
                severity: "warning",
                category: "ai-prompt",
                message: "No chatbot bridge configured - prompt workflow incomplete",
                metadata: {
                    elementId,
                    requestId: promptResponse.requestId,
                },
            });
        }
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        // Log the error
        loggingBus_1.globalLoggingBus.log({
            severity: "error",
            category: "ai-prompt",
            message: `AI prompt workflow failed for element ${elementId}: ${errorMessage}`,
            metadata: {
                elementId,
                error: errorMessage,
                statusCode: error instanceof promptClient_1.PromptApiError ? error.statusCode : undefined,
            },
        });
        // Emit error to chatbot if bridge is available
        if (chatbotBridge) {
            // For error scenarios, we can still send a message to the chatbot
            const errorPrompt = `Failed to generate AI prompt: ${errorMessage}. Please try again or contact support if the issue persists.`;
            chatbotBridge.receivePrompt(errorPrompt, toAIElementMetadata(metadata));
        }
        // Re-throw for caller to handle (e.g., show toast)
        throw error;
    }
}
/**
 * Emit a chatbot event to any registered listeners.
 *
 * @param event - The chatbot event to emit.
 */
function emitChatbotEvent(event) {
    if (chatbotBridge) {
        // If the bridge has event listeners, they'll be notified
        // This is handled internally by the bridge implementation
    }
    // Also log the event for debugging
    loggingBus_1.globalLoggingBus.log({
        severity: "debug",
        category: "chatbot",
        message: `Chatbot event: ${event.type}`,
        metadata: { event },
    });
}
/**
 * Create a user-friendly error message for display in the UI.
 *
 * @param error - The error that occurred.
 * @returns A user-friendly error message.
 */
function formatPromptError(error) {
    if (error instanceof promptClient_1.PromptApiError) {
        switch (error.statusCode) {
            case 400:
                return "Invalid request. Please try again.";
            case 404:
                return "AI service not available. Please check your connection.";
            case 500:
                return "AI service error. Please try again later.";
            case 503:
                return "AI service temporarily unavailable. Please try again.";
            default:
                return error.message || "Failed to generate AI prompt. Please try again.";
        }
    }
    if (error instanceof Error) {
        if (error.message.includes("timeout")) {
            return "Request timed out. Please check your connection and try again.";
        }
        if (error.message.includes("network") || error.message.includes("fetch")) {
            return "Network error. Please check your connection and try again.";
        }
    }
    return "An unexpected error occurred. Please try again.";
}
//# sourceMappingURL=promptWorkflow.js.map