# Shared Types & API Contract

```ts
export type CommandName =
  | "navigate" | "refresh_element" | "highlight" | "click" | "fill"
  | "clear" | "focus" | "open" | "close" | "scroll" | "select" | "hover";

export interface CommandPayload {
  command: CommandName;
  elementId: string;
  payload?: { value?: string; options?: Record<string, unknown> };
}

export interface CommandResult {
  status: "success" | "warning" | "error";
  command: CommandName;
  elementId: string;
  details?: string;
  timestamp: string;
  requestId: string;
}

export interface AiPromptRequest {
  elementId: string;
  value?: string;
  metadata?: Record<string, unknown>;
}

export interface AiPromptResponse {
  prompt: string;
  extraInfo: Record<string, unknown>;
}

export interface IChatbotBridge {
  receivePrompt(data: AiPromptResponse & { elementId: string; requestId: string }): void;
  open(): void;
  close(): void;
}
```

```yaml
openapi: 3.0.0
info:
  title: Frontend UI Command SDK Mock API
  version: 1.0.0
servers:
  - url: http://localhost:3000
paths:
  /mock/ai_generate_ui_prompt:
    post:
      summary: Generate AI prompt for element context
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/AiPromptRequest'
      responses:
        '200':
          description: Mocked prompt response
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/AiPromptResponse'
        '400':
          description: Invalid request payload
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ApiError'
components:
  schemas:
    AiPromptRequest:
      type: object
      required: [elementId]
      properties:
        elementId:
          type: string
        value:
          type: string
        metadata:
          type: object
          additionalProperties: true
    AiPromptResponse:
      type: object
      required: [prompt]
      properties:
        prompt:
          type: string
        extraInfo:
          type: object
          additionalProperties: true
    ApiError:
      type: object
      properties:
        error:
          type: object
          required: [code, message, timestamp, requestId]
          properties:
            code:
              type: string
            message:
              type: string
            details:
              type: object
              additionalProperties: true
            timestamp:
              type: string
            requestId:
              type: string
```
