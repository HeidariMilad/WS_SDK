# 🚀 START HERE - Next Agent Guide

**Welcome!** This guide gets you productive in 5 minutes.

## ✅ Current Status (2025-11-16)

- ✅ **Story 3.1 COMPLETE** - AI Button Factory with WeakMap registry & accessibility
- ✅ **All tests passing** - 99/99 tests green
- ✅ **QA approved** - 98/100 quality score
- ✅ **Merged to main** - Story 3.1 complete, on branch `3.2.story` for next story

## 🎯 Your First 5 Steps

### 1. Verify Project Health (30 seconds)

```bash
cd /Users/milad/Documents/Work/WS_SDK
cd packages/sdk && npm test
```

**Expected:** ✅ "99 tests passing"

### 2. Check Current Branch (10 seconds)

```bash
git branch --show-current
```

**Expected:** `3.2.story` (Story 3.2 - AI Prompt Workflow)

### 3. Read Project Status (2 minutes)

```bash
cat .ai/project-status.md
```

This file has EVERYTHING: completed stories, architecture, patterns.

### 4. Review Last Session (1 minute)

```bash
cat .ai/session-2025-11-16-story-3.1.md
```

See Story 3.1 implementation details (AI Button Factory).

### 5. Start Story 3.2 (1 minute)

```bash
cat docs/stories/3.2.story.md
```

Read the story file for AI Prompt Workflow implementation.

## 🔑 Key Files

| File | Purpose |
|------|---------|
| `.ai/project-status.md` | Complete project state & all completed stories |
| `.ai/session-2025-11-16-story-3.1.md` | Story 3.1 completion session |
| `docs/stories/3.2.story.md` | Current story to implement |
| `packages/sdk/src/ai-overlay/` | AI Button Factory (Story 3.1) |

## 📋 Essential Commands

```bash
npm install                # Install dependencies
cd packages/sdk && npm test  # Run tests
npm run build              # Build all
npm run lint               # Check code quality
git status                 # Check current state
```

## ⚠️ Critical Rules

1. **Story File Editing**
   - Dev Agent: Only edit Tasks/Subtasks, Dev Agent Record, Status
   - QA Agent: Only append to QA Results
   - NEVER modify Story/AC sections

2. **Tests Must Pass**
   - 99/99 tests must stay green
   - Use Node.js test runner + JSDOM
   - Tests in `packages/sdk/test/`

3. **Code Quality**
   - TypeScript strict mode
   - ESLint must pass
   - JSDoc for exports

## 🎨 Key Patterns from Story 3.1

### WeakMap Registry
```typescript
const registry = new WeakMap<HTMLElement, Config>();
registry.set(element, config);  // Auto GC
```

### Portal Pattern
```typescript
const portal = document.createElement('div');
portal.style.pointerEvents = 'none';
button.style.pointerEvents = 'auto';
```

### MutationObserver Lifecycle
```typescript
registerOverlay({
  elementId: "btn",
  attach: (el) => { /*  render */ },
  detach: (el) => { /* cleanup */ }
});
```

## 📁 Project Structure

```
packages/sdk/src/
├── ai-overlay/        ✅ Story 3.1 (NEW)
├── commands/          ✅ Epic 2
├── targeting/         ✅ Story 1.3
├── core/              ✅ Stories 1.2, 2.1
└── chatbot/           ⏳ Story 3.2 (NEXT)
```

## 🚦 Story 3.2 Context

**Goal:** AI prompt generation workflow

**Tasks:**
- Collect metadata on button click
- POST to `/mock/ai_generate_ui_prompt`
- Emit ChatbotEvent
- Add timeline entry

**Files to Create:**
- `packages/sdk/src/chatbot/promptClient.ts`
- `packages/sdk/src/chatbot/events.ts`

---

**Ready?** Read `.ai/project-status.md` then `docs/stories/3.2.story.md`
