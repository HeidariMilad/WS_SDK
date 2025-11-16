/**
 * WebSocket Mock Server
 *
 * Serves WebSocket connections and dispatches scripted command playlists
 * to connected clients for testing the Frontend UI Command SDK.
 */

import { WebSocketServer, WebSocket } from "ws";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import type { CommandPayload } from "@frontend-ui-command-sdk/shared";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const WS_PORT = process.env.WS_PORT ? parseInt(process.env.WS_PORT) : 8080;
const DEFAULT_INTERVAL = 1000; // 1 second between commands by default

interface Playlist {
  name: string;
  description: string;
  intervalMs?: number;
  commands: CommandPayload[];
}

interface PlaylistConfig {
  playlist: string;
  interval?: number;
  loop?: boolean;
}

/**
 * Load a playlist from the fixtures directory
 */
function loadPlaylist(playlistName: string): Playlist {
  const playlistPath = resolve(__dirname, "../fixtures", `${playlistName}.json`);
  try {
    const content = readFileSync(playlistPath, "utf-8");
    return JSON.parse(content) as Playlist;
  } catch (error) {
    console.error(`[Playlist] Failed to load ${playlistName}:`, error);
    throw new Error(`Playlist '${playlistName}' not found`);
  }
}

/**
 * Send commands from a playlist to a WebSocket client
 */
async function sendPlaylist(
  ws: WebSocket,
  config: PlaylistConfig
): Promise<void> {
  const playlist = loadPlaylist(config.playlist);
  const interval = config.interval || playlist.intervalMs || DEFAULT_INTERVAL;
  const loop = config.loop !== undefined ? config.loop : false;

  console.log(`[Playlist] Starting "${playlist.name}" (${playlist.commands.length} commands, ${interval}ms interval, loop: ${loop})`);

  let commandIndex = 0;
  let loopCount = 0;

  const sendNextCommand = () => {
    if (ws.readyState !== WebSocket.OPEN) {
      console.log("[Playlist] Client disconnected, stopping playlist");
      return;
    }

    const command = playlist.commands[commandIndex];
    const enrichedCommand = {
      ...command,
      timestamp: Date.now(),
    };

    ws.send(JSON.stringify(enrichedCommand));
    console.log(
      `[Command ${commandIndex + 1}/${playlist.commands.length}] Sent: ${command.command} ${command.elementId ? `(${command.elementId})` : ""} [${command.requestId}]`
    );

    commandIndex++;

    if (commandIndex >= playlist.commands.length) {
      if (loop) {
        loopCount++;
        console.log(`[Playlist] Completed loop ${loopCount}, restarting...`);
        commandIndex = 0;
        setTimeout(sendNextCommand, interval);
      } else {
        console.log(`[Playlist] "${playlist.name}" completed`);
      }
    } else {
      setTimeout(sendNextCommand, interval);
    }
  };

  // Start sending commands
  sendNextCommand();
}

/**
 * Parse query parameters from WebSocket URL
 */
function parseQueryParams(url: string): Record<string, string> {
  const params: Record<string, string> = {};
  const queryString = url.split("?")[1];

  if (queryString) {
    queryString.split("&").forEach((param) => {
      const [key, value] = param.split("=");
      if (key && value) {
        params[decodeURIComponent(key)] = decodeURIComponent(value);
      }
    });
  }

  return params;
}

/**
 * Start the WebSocket mock server
 */
function startServer(): void {
  const wss = new WebSocketServer({ port: WS_PORT });

  console.log(`\n🔌 WebSocket mock server running at ws://localhost:${WS_PORT}`);
  console.log(`   Available playlists: basic, full, stress`);
  console.log(`   Usage: ws://localhost:${WS_PORT}?playlist=basic&interval=1000&loop=true\n`);

  wss.on("connection", (ws, request) => {
    const url = request.url || "/?playlist=basic";
    const params = parseQueryParams(url);
    const clientId = `client-${Date.now()}`;

    console.log(`[${clientId}] New connection from ${request.socket.remoteAddress}`);
    console.log(`[${clientId}] Query params:`, params);

    // Send welcome message
    ws.send(
      JSON.stringify({
        type: "welcome",
        message: "Connected to Frontend UI Command SDK Mock Server",
        timestamp: Date.now(),
        availablePlaylists: ["basic", "full", "stress"],
      })
    );

    // Determine playlist configuration
    const playlist = params.playlist || "basic";
    const interval = params.interval ? parseInt(params.interval) : undefined;
    const loop = params.loop === "true";

    // Start sending playlist
    try {
      sendPlaylist(ws, { playlist, interval, loop }).catch((error) => {
        console.error(`[${clientId}] Playlist error:`, error);
        ws.send(
          JSON.stringify({
            type: "error",
            message: error instanceof Error ? error.message : String(error),
            timestamp: Date.now(),
          })
        );
      });
    } catch (error) {
      console.error(`[${clientId}] Failed to start playlist:`, error);
      ws.send(
        JSON.stringify({
          type: "error",
          message: error instanceof Error ? error.message : String(error),
          timestamp: Date.now(),
        })
      );
    }

    // Handle incoming messages (for future interactive features)
    ws.on("message", (data) => {
      try {
        const message = JSON.parse(data.toString());
        console.log(`[${clientId}] Received message:`, message);

        // Echo back for now (can be extended for interactive control)
        ws.send(
          JSON.stringify({
            type: "ack",
            message: "Message received",
            originalMessage: message,
            timestamp: Date.now(),
          })
        );
      } catch (error) {
        console.error(`[${clientId}] Invalid message format:`, error);
      }
    });

    // Handle client disconnect
    ws.on("close", () => {
      console.log(`[${clientId}] Client disconnected`);
    });

    // Handle errors
    ws.on("error", (error) => {
      console.error(`[${clientId}] WebSocket error:`, error);
    });
  });

  // Handle server errors
  wss.on("error", (error) => {
    console.error("[Server] WebSocket server error:", error);
  });

  // Graceful shutdown
  process.on("SIGINT", () => {
    console.log("\n[Server] Shutting down WebSocket server...");
    wss.close(() => {
      console.log("[Server] WebSocket server closed");
      process.exit(0);
    });
  });

  process.on("SIGTERM", () => {
    console.log("\n[Server] Shutting down WebSocket server...");
    wss.close(() => {
      console.log("[Server] WebSocket server closed");
      process.exit(0);
    });
  });
}

// Start the server
startServer();
