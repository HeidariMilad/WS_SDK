# Mock Server Manager - Quick Start Guide

## 🚀 What You Got

A complete UI web application for managing your mock server with **WebSocket-first** architecture:

- **Control Panel** - Execute commands manually and inspect command history
- **WebSocket Monitor** - View real-time WebSocket messages (sent + received)
- **Demo App** - Connects directly to the WebSocket server and reacts to commands

### Architecture Note

✅ **All UI commands** → WebSocket (real-time, bidirectional)
✅ **AI chat prompts** → Local mock in demo (no REST required for the demo flow)
✅ **Metadata queries** → REST API (status, playlists, schemas) — optional for basic WS-only usage

## ⚡ Quick Start (4 Terminals)

### Terminal 1: WebSocket Mock Server
```bash
cd apps/mocks
npm install  # First time only
npm run dev:ws
```
This starts the WebSocket server on port 8080. The manager UI and demo app both connect here.

### Terminal 2: Demo App
```bash
cd apps/demo
npm install  # First time only
npm run dev
```
Demo app runs on port 5173.

### Terminal 3: Manager UI
```bash
cd apps/mock-manager
npm install  # First time only
npm run dev
```
Manager UI opens at http://localhost:3001

### Terminal 4: (Optional) Development
Use this for git, testing, etc.

## 🎯 Using the Manager

### Execute a Manual Command

1. Open http://localhost:3001
2. Make sure all servers are running (green status indicators)
3. In the **Control Panel** tab:
   - Select command type (e.g., "click")
   - Enter element ID (e.g., "submit-button")
   - Edit JSON payload if needed
   - Click **Execute Command**
4. Watch the **Command History** update with the result
5. See the command execute in the demo app preview

### Control a Playlist (optional)

If you also run the REST mock (`npm run dev:all` in `apps/mocks`), the original playlist controls
described in the full README are available. For a minimal WebSocket-only setup you can ignore
playlist controls and drive commands manually from the Control Panel.

### Monitor WebSocket Traffic

1. Go to **WebSocket Monitor** tab
2. See all messages in real-time
3. Green = received, Blue = sent
4. Clear history with the Clear button

### View Demo in Manager

1. Go to **Demo Preview** tab
2. The demo app loads in an iframe
3. Change URL if your demo runs on a different port
4. Click Reload to refresh the demo

## 📋 Supported Commands

All 12 SDK commands are available:

- **click** - Click an element
- **fill** - Fill input with text
- **clear** - Clear an input
- **focus** - Focus on element
- **hover** - Hover over element
- **highlight** - Highlight element
- **scroll** - Scroll to element
- **select** - Select dropdown option
- **navigate** - Navigate to URL
- **refresh_element** - Refresh element state
- **open** - Open modal/dialog
- **close** - Close modal/dialog

## 🔧 Ports Reference

- Manager UI: **http://localhost:3001**
- WebSocket: **ws://localhost:8080** (required)
- Demo App: **http://localhost:5173**
- REST API: **http://localhost:3000** (optional: status/playlists/AI endpoint)

## 📝 Example Commands

### Click a button
```json
Command: click
Element ID: submit-button
Payload: {"clickType": "single"}
```

### Fill an input
```json
Command: fill
Element ID: username-input
Payload: {"value": "testuser@example.com"}
```

### Highlight with duration
```json
Command: highlight
Element ID: important-section
Payload: {"duration": 2000}
```

### Navigate to URL
```json
Command: navigate
Element ID: (leave empty)
Payload: {"url": "/dashboard"}
```

## 🆘 Troubleshooting

**Manager shows disconnected WebSocket?**
- Make sure the WebSocket server is running on port 8080
- Check Terminal 1 for errors

**WebSocket disconnected?**
- Make sure WebSocket server is running on port 8080
- Check Terminal 1 for errors

**Commands not executing?**
- Make sure demo app is running on port 5173
- Check that demo app is connected to WebSocket (see demo UI)
- Verify element IDs exist in the demo app

**Demo preview not loading?**
- Verify demo app URL is correct
- Check for CORS issues in browser console
- Try clicking the Reload button

## 📖 More Info

- Full documentation: `apps/mock-manager/README.md`
- Implementation details: `apps/mock-manager/IMPLEMENTATION.md`
- API reference: See REST API server logs for endpoint URLs

## 🎉 That's It!

You now have a full-featured mock server management UI. Enjoy! 🚀
