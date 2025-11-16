/**
 * AI Prompt Workflow Integration
 *
 * Coordinates the full AI button click → prompt request → chatbot flow.
 * Integrates promptClient, chatbot bridge, and logging.
 */

import {
  AIPromptRequest,
  AIElementMetadata,
  IChatbotBridge,
  ChatbotEvent,
} from "@frontend-ui-command-sdk/shared";
import { requestAiPrompt, PromptApiError, PromptClientConfig } from "./promptClient";
import { globalLoggingBus } from "../logging/loggingBus";
import type { ElementMetadata } from "./types";

/**
 * Global reference to the chatbot bridge implementation.
 * Should be set by the host application during SDK initialization.
 */
let chatbotBridge: IChatbotBridge | null = null;

/**
 * Configuration for the prompt workflow.
 */
let workflowConfig: PromptClientConfig = {};

/**
 * Set the chatbot bridge implementation.
 *
 * @param bridge - The IChatbotBridge implementation.
 */
export function setChatbotBridge(bridge: IChatbotBridge): void {
  chatbotBridge = bridge;
}

/**
 * Get the current chatbot bridge.
 *
 * @returns The chatbot bridge or null if not set.
 */
export function getChatbotBridge(): IChatbotBridge | null {
  return chatbotBridge;
}

/**
 * Configure the prompt workflow.
 *
 * @param config - Configuration for the prompt API client.
 */
export function configurePromptWorkflow(config: PromptClientConfig): void {
  workflowConfig = { ...workflowConfig, ...config };
}

/**
 * Convert ElementMetadata to AIElementMetadata.
 *
 * @param metadata - Element metadata from the overlay system.
 * @returns AI element metadata for the prompt request.
 */
function toAIElementMetadata(metadata: ElementMetadata): AIElementMetadata {
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
export async function handleAIButtonClick(
  metadata: ElementMetadata
): Promise<void> {
  const elementId = metadata.elementId || "unknown";

  // Log the button click
  globalLoggingBus.log({
    severity: "info",
    category: "ai-prompt",
    message: `AI button clicked for element: ${elementId}`,
    metadata: { elementId },
  });

  try {
    // 1. Construct the prompt request with element context
    const aiMetadata = toAIElementMetadata(metadata);
    const promptRequest: AIPromptRequest = {
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
    const promptResponse = await requestAiPrompt(promptRequest, workflowConfig);

    // 3. Emit ChatbotEvent
    const chatbotEvent: ChatbotEvent = {
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

      globalLoggingBus.log({
        severity: "info",
        category: "ai-prompt",
        message: `Prompt sent to chatbot for element: ${elementId}`,
        metadata: {
          elementId,
          requestId: promptResponse.requestId,
          promptLength: promptResponse.prompt.length,
        },
      });
    } else {
      globalLoggingBus.log({
        severity: "warning",
        category: "ai-prompt",
        message: "No chatbot bridge configured - prompt workflow incomplete",
        metadata: {
          elementId,
          requestId: promptResponse.requestId,
        },
      });
    }
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : String(error);

    // Log the error
    globalLoggingBus.log({
      severity: "error",
      category: "ai-prompt",
      message: `AI prompt workflow failed for element ${elementId}: ${errorMessage}`,
      metadata: {
        elementId,
        error: errorMessage,
        statusCode:
          error instanceof PromptApiError ? error.statusCode : undefined,
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
function emitChatbotEvent(event: ChatbotEvent): void {
  if (chatbotBridge) {
    // If the bridge has event listeners, they'll be notified
    // This is handled internally by the bridge implementation
  }

  // Also log the event for debugging
  globalLoggingBus.log({
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
export function formatPromptError(error: unknown): string {
  if (error instanceof PromptApiError) {
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
