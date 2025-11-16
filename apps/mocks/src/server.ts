/**
 * Mock Server
 *
 * Provides mock endpoints for the Frontend UI Command SDK,
 * including AI prompt generation.
 */

import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import type {
  AIPromptRequest,
  AIPromptResponse,
} from "@frontend-ui-command-sdk/shared";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req: Request, _res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

/**
 * POST /mock/ai_generate_ui_prompt
 *
 * Mocked AI prompt generation endpoint.
 * Returns a realistic prompt based on the element context provided.
 */
app.post("/mock/ai_generate_ui_prompt", (req: Request, res: Response) => {
  const requestId = req.headers["x-request-id"] as string || `req_${Date.now()}`;
  
  try {
    const body = req.body as AIPromptRequest;

    // Validate required fields
    if (!body.metadata) {
      return res.status(400).json({
        error: {
          code: "INVALID_REQUEST",
          message: "Missing required field: metadata",
          timestamp: new Date().toISOString(),
          requestId,
        },
      });
    }

    // Generate a mock prompt based on element metadata
    const { metadata } = body;
    const elementId = metadata.elementId || "unknown-element";
    const tagName = metadata.tagName.toLowerCase();
    const value = metadata.value || "";
    const textContent = metadata.textContent || "";
    const computedLabel = metadata.computedLabel || "";

    let prompt = "";
    let extraInfo: Record<string, unknown> = {};

    // Generate contextual prompt based on element type
    if (tagName === "input") {
      const inputValue = value || textContent || computedLabel;
      prompt = inputValue
        ? `I notice this input field contains "${inputValue}". How can I help you with this field?`
        : "I can help you fill out this input field. What would you like to enter?";
      extraInfo = {
        suggestions: [
          "Validate the input",
          "Clear the field",
          "Provide example values",
          "Explain field requirements",
        ],
      };
    } else if (tagName === "button") {
      const buttonLabel = textContent || computedLabel || "this button";
      prompt = `You clicked the "${buttonLabel}" button. What would you like to know about it?`;
      extraInfo = {
        suggestions: [
          "Explain what this button does",
          "Show keyboard shortcuts",
          "Suggest alternative actions",
        ],
      };
    } else if (tagName === "textarea") {
      prompt = textContent
        ? `I see you have some text here. Would you like me to help improve it or provide suggestions?`
        : "I can help you compose content for this text area. What are you trying to write?";
      extraInfo = {
        suggestions: [
          "Improve grammar",
          "Make it more concise",
          "Add more details",
          "Change the tone",
        ],
      };
    } else if (tagName === "select" || tagName === "option") {
      prompt = `I can help you choose the right option from this dropdown. What are you looking for?`;
      extraInfo = {
        suggestions: [
          "Explain available options",
          "Recommend best choice",
          "Filter options",
        ],
      };
    } else {
      // Generic prompt for other elements
      const label = computedLabel || textContent || `${tagName} element`;
      prompt = `I'm here to help with this ${label}. What would you like to know?`;
      extraInfo = {
        suggestions: [
          "Explain this element",
          "Show related actions",
          "Provide context",
        ],
      };
    }

    // Include element context in extraInfo
    extraInfo.elementContext = {
      elementId,
      tagName,
      label: computedLabel,
      position: metadata.boundingBox,
    };

    const response: AIPromptResponse = {
      prompt,
      timestamp: Date.now(),
      metadata: extraInfo,
    };

    console.log(`[AI Prompt] Generated for element ${elementId}: "${prompt.slice(0, 60)}..."`);

    res.json(response);
  } catch (error) {
    console.error("[AI Prompt] Error:", error);
    res.status(500).json({
      error: {
        code: "INTERNAL_ERROR",
        message: "Failed to generate AI prompt",
        details: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString(),
        requestId,
      },
    });
  }
});

// Health check endpoint
app.get("/health", (_req: Request, res: Response) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    service: "frontend-ui-command-sdk-mocks",
  });
});

// 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    error: {
      code: "NOT_FOUND",
      message: "Endpoint not found",
      timestamp: new Date().toISOString(),
    },
  });
});

// Error handler
app.use((err: Error, _req: Request, res: Response) => {
  console.error("[Server Error]", err);
  res.status(500).json({
    error: {
      code: "INTERNAL_ERROR",
      message: err.message || "Internal server error",
      timestamp: new Date().toISOString(),
    },
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 Mock server running at http://localhost:${PORT}`);
  console.log(`   - AI Prompt: POST http://localhost:${PORT}/mock/ai_generate_ui_prompt`);
  console.log(`   - Health: GET http://localhost:${PORT}/health\n`);
});

export default app;
