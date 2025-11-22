# Quick Start: AI Button Management

## 🚀 Start All Services

```bash
# Terminal 1 - Start mock servers (REST + WebSocket)
cd apps/mocks
npm run dev:all

# Terminal 2 - Start demo app
cd apps/demo
npm run dev

# Terminal 3 - Start mock UI manager
cd apps/mock-manager
npm run dev
```

## 📱 Open Applications

- **Mock UI Manager**: http://localhost:5174
- **Demo App**: http://localhost:5173

## 🎯 Test AI Button Workflow (5 Minutes)

### Step 1: Attach an AI Button

1. Open **Mock UI Manager** in your browser
2. Scroll down to the **"AI Button Manager"** section
3. Fill in the form:
   - **Element ID**: `highlight-target`
   - **Placement**: `top-right`
   - **Size**: `default`
   - **Label**: `Ask AI` (optional)
   - **Icon**: Leave empty or use `✨`
4. Click **"✨ Attach AI Button"**
5. You should see a success message in the Command History

### Step 2: See the Button in Demo App

1. Switch to the **Demo App** tab
2. Look for the "Highlight Target" box
3. You should see a small AI button in the top-right corner of that element

### Step 3: Click the AI Button

1. Click the AI button you just attached
2. The button shows a loading state
3. The **chatbot drawer** slides in from the right
4. You see a contextual prompt like: *"How can I help you with this element?"*
5. The prompt includes suggestions and metadata about the element

### Step 4: Test Dynamic Elements

1. Back in **Mock UI Manager**, attach a button to the modal:
   - **Element ID**: `modal-trigger`
   - Click **"Attach AI Button"**

2. In **Demo App**, click "Open Modal" button
3. The modal opens - notice the AI button is still on the trigger button
4. Close the modal and reopen it
5. The AI button persists (automatic reattachment!)

### Step 5: Detach a Button

1. Back in **Mock UI Manager**
2. **Element ID**: `highlight-target`
3. Click **"🗑️ Detach AI Button"**
4. Switch to **Demo App**
5. The AI button should be gone from the highlight target

## 🎨 Try Different Configurations

### Example 1: Compact Button with Custom Icon
- Element ID: `hover-target`
- Placement: `bottom-left`
- Size: `compact`
- Icon: `🤖`

### Example 2: Button with Label
- Element ID: `focus-target-button`
- Placement: `top-left`
- Label: `Need help?`

### Example 3: Center Positioned
- Element ID: `combined-target`
- Placement: `center`
- Size: `default`

## 📝 Available Test Elements

Try attaching AI buttons to these elements:

| Element ID | Description |
|------------|-------------|
| `highlight-target` | Basic test element |
| `hover-target` | Hover interaction element |
| `focus-target-button` | Button element |
| `focus-target-input` | Input field |
| `scroll-target` | Far-down scrollable element |
| `combined-target` | Multi-purpose element |
| `textarea-target` | Text area |
| `dropdown-target` | Select dropdown |
| `modal-trigger` | Button that opens modal |
| `modal-content` | Content inside modal |

## 🔍 What to Watch For

### In Mock UI Manager:
- ✅ Command History shows "AI button attached to 'element-id'"
- ✅ WebSocket Monitor shows the command message
- ✅ Status indicator shows "Connected" in green

### In Demo App:
- ✅ AI button appears on the element (small circular button with sparkle icon or custom icon)
- ✅ Button has smooth hover effect
- ✅ Clicking button shows loading spinner
- ✅ Chatbot drawer slides open
- ✅ Prompt appears in chatbot with element metadata

### In Browser Console:
- ✅ Log: `[AI Button] Attached to element-id`
- ✅ Log: `AI button clicked for element: element-id`
- ✅ Log: `Prompt sent to chatbot for element: element-id`

## ❓ Troubleshooting

### AI Button Doesn't Appear
1. Check WebSocket connection status in Mock UI Manager (should be green "Connected")
2. Open browser console and look for errors
3. Verify the element ID exists in the demo app (right-click → Inspect, look for `data-elementid` attribute)
4. Try refreshing the demo app page

### Chatbot Doesn't Open
1. Check that the chatbot bridge is initialized (should see log in console)
2. The chatbot toggle button should be visible in bottom-right of demo app
3. Try manually clicking the chatbot toggle to verify it works

### Button Disappears on Route Change
- This is expected! The MutationObserver will reattach it when you return
- If you want it to persist, attach it again after navigation

### "Element not found" Error
- The element with that ID doesn't exist in the demo app yet
- Check the list of available elements above
- Make sure you're typing the exact element ID (case-sensitive)

## 🎉 Success Indicators

You'll know everything is working when:

1. ✅ Mock UI Manager shows "Connected" status
2. ✅ AI buttons appear on elements in demo app
3. ✅ Clicking AI buttons opens the chatbot
4. ✅ Chatbot shows contextual prompts
5. ✅ Buttons persist across component remounts
6. ✅ Detach command removes buttons instantly

## 📚 Learn More

- Full command reference: `docs/architecture/ai-button-commands.md`
- Complete implementation details: `AI_BUTTON_IMPLEMENTATION.md`
- WebSocket protocol: `docs/architecture/ws-ui-command-reference.md`

---

**Congratulations!** 🎊 You've successfully tested the AI Button management system. All features are working as designed:

- ✅ Attach/detach via WebSocket commands
- ✅ Mock UI Manager interface
- ✅ Dynamic element support
- ✅ Full AI prompt workflow
- ✅ Chatbot integration

