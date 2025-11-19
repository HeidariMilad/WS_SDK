/**
 * Mock Server
 *
 * Provides mock endpoints for the Frontend UI Command SDK,
 * including AI prompt generation.
 */

import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import { readFileSync, readdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import type {
  AIPromptRequest,
  AIPromptResponse,
  CommandPayload,
} from "@frontend-ui-command-sdk/shared";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Server state tracking
const serverState = {
  startTime: Date.now(),
  activeConnections: 0,
  totalCommandsSent: 0,
  currentPlaylist: null as string | null,
  playlistState: 'stopped' as 'playing' | 'paused' | 'stopped',
};

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

/**
 * Management API Endpoints
 */

// GET /api/status - Extended server status
app.get("/api/status", (_req: Request, res: Response) => {
  res.json({
    status: 'online',
    uptime: Date.now() - serverState.startTime,
    activeConnections: serverState.activeConnections,
    totalCommandsSent: serverState.totalCommandsSent,
    timestamp: new Date().toISOString(),
    currentPlaylist: serverState.currentPlaylist,
    playlistState: serverState.playlistState,
  });
});

// GET /api/playlists - List available playlists
app.get("/api/playlists", (_req: Request, res: Response) => {
  try {
    const fixturesDir = resolve(__dirname, "../fixtures");
    const files = readdirSync(fixturesDir).filter(f => f.endsWith('.json'));
    
    const playlists = files.map(filename => {
      try {
        const content = readFileSync(resolve(fixturesDir, filename), 'utf-8');
        const playlist = JSON.parse(content);
        return {
          name: playlist.name || filename.replace('.json', ''),
          filename: filename.replace('.json', ''),
          description: playlist.description || 'No description',
          commandCount: playlist.commands?.length || 0,
          intervalMs: playlist.intervalMs,
        };
      } catch (err) {
        console.error(`Failed to parse ${filename}:`, err);
        return null;
      }
    }).filter(Boolean);

    res.json(playlists);
  } catch (error) {
    res.status(500).json({
      error: {
        code: "INTERNAL_ERROR",
        message: "Failed to load playlists",
        details: error instanceof Error ? error.message : String(error),
      },
    });
  }
});

// GET /api/commands - List all supported command types
app.get("/api/commands", (_req: Request, res: Response) => {
  const commands = [
    { command: 'click', description: 'Click an element', requiresElementId: true },
    { command: 'fill', description: 'Fill an input field with text', requiresElementId: true },
    { command: 'clear', description: 'Clear an input field', requiresElementId: true },
    { command: 'focus', description: 'Focus on an element', requiresElementId: true },
    { command: 'hover', description: 'Hover over an element', requiresElementId: true },
    { command: 'highlight', description: 'Highlight an element', requiresElementId: true },
    { command: 'scroll', description: 'Scroll to an element', requiresElementId: true },
    { command: 'select', description: 'Select an option from dropdown', requiresElementId: true },
    { command: 'navigate', description: 'Navigate to a URL', requiresElementId: false },
    { command: 'refresh_element', description: 'Refresh element state', requiresElementId: true },
    { command: 'open', description: 'Open a modal or dialog', requiresElementId: true },
    { command: 'close', description: 'Close a modal or dialog', requiresElementId: true },
  ];
  res.json(commands);
});

// Note: Command execution is now handled exclusively via WebSocket
// This ensures real-time communication for all UI commands

// POST /api/playlist/control - Control playlist playback
app.post("/api/playlist/control", (req: Request, res: Response) => {
  try {
    const { action, playlist, interval, loop } = req.body as {
      action: 'start' | 'stop' | 'pause' | 'resume';
      playlist?: string;
      interval?: number;
      loop?: boolean;
    };

    if (!action) {
      return res.status(400).json({
        error: {
          code: "INVALID_REQUEST",
          message: "Missing action in request body",
        },
      });
    }

    let message = '';
    switch (action) {
      case 'start':
        if (!playlist) {
          return res.status(400).json({
            error: {
              code: "INVALID_REQUEST",
              message: "Playlist name required for start action",
            },
          });
        }
        serverState.currentPlaylist = playlist;
        serverState.playlistState = 'playing';
        message = `Started playlist '${playlist}' (interval: ${interval}ms, loop: ${loop})`;
        console.log(`[Playlist Control] ${message}`);
        break;
      case 'stop':
        serverState.currentPlaylist = null;
        serverState.playlistState = 'stopped';
        message = 'Stopped playlist playback';
        console.log(`[Playlist Control] ${message}`);
        break;
      case 'pause':
        serverState.playlistState = 'paused';
        message = 'Paused playlist playback';
        console.log(`[Playlist Control] ${message}`);
        break;
      case 'resume':
        serverState.playlistState = 'playing';
        message = 'Resumed playlist playback';
        console.log(`[Playlist Control] ${message}`);
        break;
      default:
        return res.status(400).json({
          error: {
            code: "INVALID_REQUEST",
            message: `Unknown action: ${action}`,
          },
        });
    }

    res.json({ success: true, message });
  } catch (error) {
    res.status(500).json({
      error: {
        code: "INTERNAL_ERROR",
        message: "Failed to control playlist",
        details: error instanceof Error ? error.message : String(error),
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
  console.log(`\n   Mock Endpoints:`);
  console.log(`   - AI Prompt (Chat UI): POST http://localhost:${PORT}/mock/ai_generate_ui_prompt`);
  console.log(`   - Health: GET http://localhost:${PORT}/health`);
  console.log(`\n   Management API (Metadata Only):`);
  console.log(`   - Status: GET http://localhost:${PORT}/api/status`);
  console.log(`   - Playlists: GET http://localhost:${PORT}/api/playlists`);
  console.log(`   - Commands: GET http://localhost:${PORT}/api/commands`);
  console.log(`   - Control: POST http://localhost:${PORT}/api/playlist/control`);
  console.log(`\n   ⚡ All UI commands are sent via WebSocket (ws://localhost:8080)\n`);
});

export default app;
