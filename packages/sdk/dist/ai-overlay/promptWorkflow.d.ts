/**
 * AI Prompt Workflow Integration
 *
 * Coordinates the full AI button click → prompt request → chatbot flow.
 * Integrates promptClient, chatbot bridge, and logging.
 */
import { IChatbotBridge } from "@frontend-ui-command-sdk/shared";
import { PromptClientConfig } from "./promptClient";
import type { ElementMetadata } from "./types";
/**
 * Set the chatbot bridge implementation.
 *
 * @param bridge - The IChatbotBridge implementation.
 */
export declare function setChatbotBridge(bridge: IChatbotBridge): void;
/**
 * Get the current chatbot bridge.
 *
 * @returns The chatbot bridge or null if not set.
 */
export declare function getChatbotBridge(): IChatbotBridge | null;
/**
 * Configure the prompt workflow.
 *
 * @param config - Configuration for the prompt API client.
 */
export declare function configurePromptWorkflow(config: PromptClientConfig): void;
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
export declare function handleAIButtonClick(metadata: ElementMetadata): Promise<void>;
/**
 * Create a user-friendly error message for display in the UI.
 *
 * @param error - The error that occurred.
 * @returns A user-friendly error message.
 */
export declare function formatPromptError(error: unknown): string;
//# sourceMappingURL=promptWorkflow.d.ts.map