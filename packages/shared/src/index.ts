export const SHARED_PLACEHOLDER = "shared-types-placeholder";

export type CommandStatus = "ok" | "error" | "warning";

/**
 * Core payload shape used for streaming UI commands over WebSocket.
 *
 * This intentionally stays flexible: only `command` is required, the rest
 * (elementId, payload, requestId) are optional and story-specific.
 */
export interface CommandPayload {
  /**
   * Command identifier understood by the dispatcher.
   */
  command: string;

  /**
   * Optional UI element identifier the command targets.
   */
  elementId?: string;

  /**
   * Opaque payload forwarded without mutation by the connection layer.
   */
  payload?: unknown;

  /**
   * Correlation identifier for tracking command/response lifecycle.
   */
  requestId?: string;
}

/**
 * Warning emitted when target resolution fails or encounters issues.
 */
export interface TargetResolutionWarning {
  elementId?: string;
  selector?: string;
  reason:
    | "not-found"
    | "invalid-selector"
    | "no-target-provided"
    | "multiple-matches";
}

/**
 * Structured result used for logging command and connection outcomes.
 */
export interface CommandResult {
  status: CommandStatus;
  /**
   * May be absent for low-level connection issues before a requestId is known.
   */
  requestId?: string;
  /**
   * Human-readable description suitable for demo UI display.
   */
  details: string;
  /**
   * Epoch millis timestamp when the result was produced.
   */
  timestamp: number;
  /**
   * Origin of the result (e.g., connection, dispatcher, ui).
   */
  source?: "connection" | "dispatcher" | "ui" | string;
  /**
   * Optional array of targeting warnings when status is "warning".
   */
  warnings?: TargetResolutionWarning[];
}

/**
 * Metadata about an element for AI prompt generation.
 */
export interface AIElementMetadata {
  elementId?: string;
  tagName: string;
  textContent?: string;
  value?: string;
  dataAttributes: Record<string, string>;
  computedLabel?: string;
  boundingBox: {
    top: number;
    left: number;
    width: number;
    height: number;
  };
}

/**
 * Payload sent to AI prompt generation endpoint.
 */
export interface AIPromptRequest {
  metadata: AIElementMetadata;
  timestamp: number;
  context?: Record<string, unknown>;
}

/**
 * Response from AI prompt generation endpoint.
 */
export interface AIPromptResponse {
  prompt: string;
  timestamp: number;
  metadata?: Record<string, unknown>;
}

/**
 * Event emitted when an AI prompt is generated.
 */
export interface ChatbotEvent {
  type: "AI_PROMPT" | "CHATBOT_OPEN" | "CHATBOT_CLOSE";
  payload?: {
    prompt?: string;
    metadata?: AIElementMetadata;
    timestamp: number;
  };
}

/**
 * Interface for chatbot bridge implementations.
 * 
 * The SDK uses this contract to communicate with host chatbot implementations.
 */
export interface IChatbotBridge {
  /**
   * Open the chatbot UI.
   */
  open(): void;

  /**
   * Close the chatbot UI.
   */
  close(): void;

  /**
   * Check if the chatbot is currently open.
   */
  isOpen(): boolean;

  /**
   * Send a prompt to the chatbot.
   * 
   * @param prompt - The AI-generated prompt text.
   * @param metadata - Optional metadata about the source element.
   */
  receivePrompt(prompt: string, metadata?: AIElementMetadata): void;

  /**
   * Subscribe to chatbot events.
   * 
   * @param callback - Function called when events occur.
   * @returns Unsubscribe function.
   */
  onEvent(callback: (event: ChatbotEvent) => void): () => void;
}
