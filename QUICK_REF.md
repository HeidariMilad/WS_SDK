# Quick Reference Card

## Current State (2025-11-16)
- **Branch**: `3.2.story`
- **Working On**: Story 3.2 - AI Prompt Workflow
- **Last Complete**: Story 3.1 - AI Button Factory ✅
- **Tests**: 99/99 passing ✅
- **Build**: Passing ✅

---

## Fast Commands

```bash
# Navigate to project
cd /Users/milad/Documents/Work/WS_SDK

# Check status
git status && git branch --show-current

# Build & test
cd packages/sdk && npm run build && npm test

# Run full validation
npm run build && npm run lint && npm test

# View current story
cat docs/stories/3.2.story.md
```

---

## Recent Stories

| Story | Status | Files |
|-------|--------|-------|
| 3.1 - AI Button Factory | ✅ Complete | `packages/sdk/src/ai-overlay/` (6 files) |
| 2.3 - Commands Set B | ✅ Complete | `packages/sdk/src/commands/` |
| 2.2 - Commands Set A | ✅ Complete | `packages/sdk/src/commands/` |
| 2.1 - Navigation Commands | ✅ Complete | `packages/sdk/src/commands/` |

---

## Key APIs

### AI Overlay (Story 3.1) ✅
```typescript
import { attachAiButton, detachAiButton } from '@frontend-ui-command-sdk/sdk';

const { success, overlayId } = await attachAiButton("btn-id", {
  placement: "top-right",
  label: "Ask AI",
  onClick: async (metadata) => { /* handle click */ }
});

detachAiButton(overlayId);
```

### Element Targeting (Story 1.3) ✅
```typescript
import { resolveTarget } from '@frontend-ui-command-sdk/sdk';

const { element, warnings } = await resolveTarget({
  elementId: "my-button",
  selector: ".my-button"  // fallback
});
```

### WebSocket Connection (Story 1.2) ✅
```typescript
import { WebSocketConnection } from '@frontend-ui-command-sdk/sdk';

const ws = new WebSocketConnection(url, options);
ws.onStatusChange((status) => console.log(status));
ws.connect();
```

---

## Project Structure

```
WS_SDK/
├── packages/sdk/src/
│   ├── ai-overlay/       ✅ Story 3.1 (NEW)
│   ├── commands/         ✅ Epic 2
│   ├── targeting/        ✅ Story 1.3
│   ├── core/             ✅ Stories 1.2, 2.1
│   └── logging/          ✅ Story 2.1
├── docs/
│   ├── stories/          Story files
│   └── qa/gates/         QA assessments
└── DEV_STATUS.md         📋 Full documentation
```

---

## Next Task (Story 3.2)

**Goal**: Implement AI prompt generation workflow

**Todo**:
- [ ] Add metadata collection in button click
- [ ] Create HTTP client for `/mock/ai_generate_ui_prompt`
- [ ] Implement ChatbotEvent emitter
- [ ] Add timeline integration
- [ ] Write tests

**Files to Create**:
- `packages/sdk/src/chatbot/promptClient.ts`
- `packages/sdk/src/chatbot/events.ts`

---

## Git Workflow

```bash
# Standard flow
git add .
git commit -m "Complete Story X.Y - Title"
git push origin X.Y.story

# Merge to main
git checkout main
git merge X.Y.story --no-ff -m "Merge Story X.Y"
git push origin main

# Start next story
git checkout -b X.Z.story
```

---

## Common Issues

**TypeScript errors?**
```bash
cd packages/sdk && npm run build
```

**Tests failing?**
```bash
cd packages/sdk && npm test
```

**Linting errors?**
```bash
npm run lint
```

**Need to rebuild?**
```bash
npm run build
```

---

## Important Files

- `DEV_STATUS.md` - Full project documentation
- `docs/stories/3.2.story.md` - Current story
- `packages/sdk/src/index.ts` - SDK exports
- `packages/shared/src/index.ts` - Shared types

---

## Quality Scores

| Story | Score |
|-------|-------|
| 1.1 | 100/100 |
| 1.2 | 95/100 |
| 1.3 | 97/100 |
| 2.1 | 96/100 |
| 2.2 | 98/100 |
| 2.3 | 97/100 |
| 3.1 | 98/100 |

**Average**: 97.3/100 ✅

---

📖 **Full Documentation**: See `DEV_STATUS.md`
