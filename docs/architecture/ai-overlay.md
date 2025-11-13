# AI Assist Button Rendering

- Overlay registry (`WeakMap`) prevents duplicate attachments; configuration persisted for hydration.
- Portals render into a single `.sdk-overlay-root` appended to `document.body` with isolated z-index.
- Positioning options: `top-left`, `top-right`, `center`, or `custom({ top, left })` with collision detection to avoid clipping and viewport overflow.
- Click pipeline: gather metadata (`data-*`, computed label/value) → POST `/mock/ai_generate_ui_prompt` → emit `ChatbotEvent` → call `chatbotBridge.open()` and `receivePrompt()` → push `AI_PROMPT` timeline entry.
- Accessibility: `aria-label`, focus trapping on open, and respect for `prefers-reduced-motion` for any pulsating animations.
