# Mock Server Manager - Architecture

## Communication Architecture

### WebSocket-First Design

All UI command execution goes through **WebSocket** for real-time, bidirectional communication. The REST API is used **only** for:
1. AI chat prompt generation (demo app chat UI)
2. Metadata queries (server status, playlists, command schemas)
3. Playlist control signals

### Why WebSocket for Commands?

- **Real-time feedback**: Immediate command acknowledgment
- **Bidirectional**: Server can push updates to clients
- **Persistent connection**: No connection overhead per command
- **Consistent protocol**: Same channel for automated playlists and manual commands
- **Low latency**: Essential for UI responsiveness

## Communication Flow

```
┌─────────────────┐
│  Mock Manager   │
│      UI         │
└────────┬────────┘
         │
         ├─── REST API (Port 3000) ──────────┐
         │    • GET /api/status              │
         │    • GET /api/playlists           │ Metadata
         │    • GET /api/commands            │ Only
         │    • POST /api/playlist/control   │
         │                                   │
         └─── WebSocket (Port 8080) ─────────┤
              • Send commands                │
              • Receive ACKs                 │
              • Real-time updates            │
              • Broadcast manual commands    │
                                            │
┌─────────────────┐                         │
│   Demo App      │                         │
│   (Port 5173)   │                         │
└────────┬────────┘                         │
         │                                   │
         ├─── REST API ───────────────────────┘
         │    • POST /mock/ai_generate_ui_prompt
         │      (Chat UI only)
         │
         └─── WebSocket ─────────────────────┐
              • Receive commands             │
              • Execute on UI                │
              • Send status updates          │
                                            │
                                            │
┌─────────────────┐                         │
│  WS Server      │◄────────────────────────┘
│  (Port 8080)    │
└─────────────────┘
         │
         │ Broadcasts to all clients
         ├─→ Manager UI
         └─→ Demo App(s)
```

## REST API Endpoints

### Metadata Endpoints
- `GET /api/status` - Server metrics, uptime, connection count
- `GET /api/playlists` - List available command playlists
- `GET /api/commands` - List all 12 command types with schemas
- `POST /api/playlist/control` - Start/stop/pause/resume playlists

### Chat UI Only
- `POST /mock/ai_generate_ui_prompt` - Generate AI prompts for chat interface
- `GET /health` - Health check

## WebSocket Protocol

### Message Types

#### 1. Command Execution (Manager → WS Server → Demo)
```json
{
  "type": "command",
  "command": {
    "command": "click",
    "elementId": "submit-button",
    "payload": { "clickType": "single" },
    "requestId": "manual-1234567890"
  }
}
```

#### 2. Command Acknowledgment (WS Server → Manager)
```json
{
  "type": "ack",
  "message": "Command executed",
  "requestId": "manual-1234567890",
  "timestamp": 1234567890123
}
```

#### 3. Welcome Message (WS Server → Client)
```json
{
  "type": "welcome",
  "message": "Connected to Frontend UI Command SDK Mock Server",
  "timestamp": 1234567890123,
  "availablePlaylists": ["basic", "full", "stress"]
}
```

#### 4. Error Message (WS Server → Client)
```json
{
  "type": "error",
  "message": "Invalid message format",
  "timestamp": 1234567890123
}
```

## Component Architecture

### Manager UI Components

```
App (Main WebSocket connection)
 │
 ├─ ServerStatusCard (REST: /api/status)
 │
 ├─ PlaylistControls (REST: /api/playlists, /api/playlist/control)
 │
 ├─ CommandBuilder (WebSocket: sends commands)
 │   └─ useCommandExecutor(sendMessage)
 │
 ├─ CommandHistory (WebSocket: displays sent commands)
 │   └─ useCommandExecutor(sendMessage)
 │
 ├─ WebSocketMonitor (WebSocket: displays all messages)
 │   └─ useWebSocket('ws://localhost:8080')
 │
 └─ DemoPreview (iframe: localhost:5173) [removed from current UI]
```

### Key Hooks

#### `useWebSocket(url)`
- Manages WebSocket connection lifecycle
- Auto-reconnect on disconnect
- Message queue and history
- Returns: `{ sendMessage, isConnected, messages, clearMessages }`

#### `useCommandExecutor(sendMessage)`
- Wraps command execution logic
- Maintains command history with status
- Uses WebSocket `sendMessage` function
- Returns: `{ executeCommand, history, isExecuting, clearHistory }`

#### `useServerStatus(pollInterval)`
- Polls REST API for server status
- Auto-refresh every 2 seconds
- Returns: `{ status, isLoading, error, refetch }`

## Data Flow

### Manual Command Execution

1. User fills out command form in `CommandBuilder`
2. User clicks "Execute Command"
3. `CommandBuilder` calls `executeCommand(command)`
4. `useCommandExecutor` calls `sendMessage({ type: 'command', command })`
5. WebSocket sends message to WS Server
6. WS Server broadcasts command to all connected clients (Manager + Demo app)
7. Demo app receives command and executes UI action
8. Command appears in `CommandHistory` with status
9. All messages visible in `WebSocketMonitor`

### Playlist Execution

1. User selects playlist and clicks "Start" in `PlaylistControls`
2. REST API call: `POST /api/playlist/control` with action="start"
3. WS Server starts sending playlist commands at specified interval
4. Commands broadcast to all connected clients
5. Demo app receives and executes commands
6. Manager UI sees all commands in `WebSocketMonitor`

### AI Chat Prompt (Demo App Only)

1. User invokes chat UI in demo app
2. Demo app captures element context
3. Demo app calls REST API: `POST /mock/ai_generate_ui_prompt`
4. REST API returns generated prompt
5. Demo app displays prompt in chat interface

## State Management

### Server State (REST API)
```typescript
{
  startTime: number,           // For uptime calculation
  activeConnections: number,   // WebSocket connection count
  totalCommandsSent: number,   // Counter
  currentPlaylist: string | null,
  playlistState: 'playing' | 'paused' | 'stopped'
}
```

### Client State (Manager UI)
```typescript
{
  wsConnected: boolean,        // WebSocket connection status
  commandHistory: CommandHistoryEntry[],
  wsMessages: WebSocketMessage[],
  serverStatus: ServerStatus | null
}
```

## Security Considerations

- **No authentication**: This is a development/testing tool
- **CORS enabled**: Allows cross-origin requests
- **Local only**: Runs on localhost by design
- **No data persistence**: All state in memory

## Performance

- WebSocket maintains single persistent connection
- REST API polling limited to 2-second intervals
- Command history kept in memory (no limit currently)
- WS messages kept in memory (manual clear available)

## Error Handling

### WebSocket Disconnection
- Auto-reconnect after 3 seconds
- Manager UI shows "Disconnected" status
- Commands cannot be sent while disconnected
- User sees clear error message

### REST API Failures
- Retry logic in polling (continuous)
- Error messages displayed in UI
- Graceful degradation (features still work)

### Invalid Commands
- Client-side validation (element ID required, JSON parsing)
- Server-side validation (message format)
- Error messages returned via WebSocket

## Scalability

Current implementation supports:
- Multiple demo app connections (broadcast)
- Single manager UI connection
- Unlimited commands per session
- No rate limiting

Future enhancements could add:
- Client targeting (specific client ID)
- Rate limiting
- Command queue management
- Persistent history storage
