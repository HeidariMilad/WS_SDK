# Mock Server Manager

A comprehensive UI web application for managing and controlling the Frontend UI Command SDK mock server.

## Features

### 🎛️ Control Panel
- **Server Status Dashboard**: Real-time monitoring of REST and WebSocket server status, uptime, and connection metrics
- **Playlist Manager**: Control automated command playlists with start/stop/pause/resume functionality
- **Manual Command Builder**: Build and execute commands on-demand with:
  - Element ID input
  - Command type selector (all 12 commands supported)
  - JSON payload editor with preview
  - Command validation and execution
- **Command History**: Complete log of executed commands with status tracking and response details

### 📡 WebSocket Monitor
- Real-time WebSocket message inspection
- View sent and received messages with timestamps
- Terminal-style display for easy debugging
- Message filtering and clearing

### 👁️ Demo Preview
- Embedded iframe showing the live demo application
- Configurable demo URL
- Real-time command execution visualization

## Getting Started

### Prerequisites
- Node.js ≥ 18
- npm ≥ 9
- WebSocket mock server running on port 8080 (`apps/mocks: npm run dev:ws` or `npm run dev:all`)
- Demo app running (default: port 5173)

### Installation

```bash
cd apps/mock-manager
npm install
```

### Development

Start the manager UI in development mode:

```bash
npm run dev
```

The manager will be available at http://localhost:3001

### Production Build

```bash
npm run build
npm run preview
```

## Usage

### Starting the Stack (WebSocket-only)

1. **Start the WebSocket server** (Terminal 1):
   ```bash
   cd apps/mocks
   npm run dev:ws
   ```

2. **Start the demo app** (Terminal 2):
2. **Start the demo app** (Terminal 2):
   ```bash
   cd apps/demo
   npm run dev
   ```

3. **Start the manager UI** (Terminal 3):
   ```bash
   cd apps/mock-manager
   npm run dev
   ```

Or use the all-in-one command from the mocks directory (includes REST for status/playlists/AI):
```bash
cd apps/mocks
npm run dev:all  # Starts both REST and WebSocket servers
```

### Using the Manager

#### Control Panel Tab
1. **Manual Commands**: 
   - Select command type from dropdown
   - Enter element ID (e.g., `submit-button`, `username-input`)
   - Edit payload JSON if needed
   - Click "Execute Command" (sent over WebSocket only)
2. **View History**: Track all executed commands with status and responses

#### WebSocket Monitor Tab
- See all WebSocket messages in real-time
- Messages color-coded (blue for sent, green for received)
- Timestamps for each message
- Clear button to reset message history

#### Demo Preview Tab
- View the demo app in an embedded iframe
- Change the demo URL if running on a different port
- Reload button to refresh the demo

## API Integration

The manager communicates with the mock server via these endpoints:

### REST API (localhost:3000)
- `GET /api/status` - Server status and metrics
- `GET /api/playlists` - List available playlists
- `GET /api/commands` - List supported command types
- `POST /api/command/execute` - Execute a single command
- `POST /api/playlist/control` - Control playlist playback

### WebSocket (localhost:8080)
- Real-time command streaming
- Manual command injection
- Bidirectional messaging

## Supported Commands

The manager supports all 12 SDK commands:

1. **click** - Click an element
2. **fill** - Fill an input field with text
3. **clear** - Clear an input field
4. **focus** - Focus on an element
5. **hover** - Hover over an element
6. **highlight** - Highlight an element
7. **scroll** - Scroll to an element
8. **select** - Select an option from dropdown
9. **navigate** - Navigate to a URL
10. **refresh_element** - Refresh element state
11. **open** - Open a modal or dialog
12. **close** - Close a modal or dialog

## Architecture

### Components
- `ServerStatusCard` - Real-time server metrics display
- `PlaylistControls` - Playlist selection and playback controls
- `CommandBuilder` - Manual command creation and execution
- `CommandHistory` - Command execution log
- `DemoPreview` - Embedded demo application viewer
- `WebSocketMonitor` - Real-time message inspection

### Hooks
- `useServerStatus` - Poll server status with auto-refresh
- `useWebSocket` - WebSocket connection management
- `useCommandExecutor` - Command execution with history tracking

### API Client
- `mockServerClient` - Typed API client for REST endpoints

## Development

### Project Structure
```
apps/mock-manager/
├── src/
│   ├── components/       # React components
│   ├── hooks/           # Custom React hooks
│   ├── api/             # API client
│   ├── types/           # TypeScript type definitions
│   ├── App.tsx          # Main app component
│   └── main.tsx         # Entry point
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## Troubleshooting

### Manager can't connect to servers
- Ensure REST API is running on port 3000
- Ensure WebSocket server is running on port 8080
- Check CORS settings if needed

### Commands not executing
- Verify the demo app is connected to the WebSocket server
- Check the demo app console for connection status
- Ensure element IDs exist in the demo app

### Demo preview not loading
- Verify the demo app is running on the specified port (default: 5173)
- Check for CORS or iframe restrictions
- Try reloading with the Reload button

## License

This project is part of the Frontend UI Command SDK.
