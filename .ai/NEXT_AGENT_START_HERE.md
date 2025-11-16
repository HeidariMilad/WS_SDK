# 🚀 START HERE - Next Agent Guide

**Welcome!** This guide gets you productive in 5 minutes.

## ✅ Current Status (2025-11-16)

- ✅ **Story 2.2 COMPLETE** - Interaction Commands (highlight, hover, focus, scroll)
- ✅ **All tests passing** - 55/55 tests green
- ✅ **QA approved** - 100/100 quality score
- ✅ **Ready for next story**

## 🎯 Your First 5 Steps

### 1. Verify Project Health (30 seconds)

```bash
cd /Users/milad/Documents/Work/WS_SDK
npm test
```

**Expected:** ✅ "55 tests passing"

### 2. Check Available Stories (30 seconds)

```bash
ls docs/stories/*.md
```

Look for stories NOT marked as "Done" in their Status section.

### 3. Read Project Status (2 minutes)

```bash
cat .ai/project-status.md
```

This file has EVERYTHING: structure, patterns, commands, gotchas.

### 4. Review Last Session (1 minute)

```bash
cat .ai/session-2025-11-16.md
```

See what was just completed and learned.

### 5. Pick Your Path (1 minute)

**Option A: Continue Development**
- Find next approved story in `docs/stories/`
- Read story file completely
- Run: `*develop-story docs/stories/{story-file}.md`

**Option B: Create Next Story**
- Run: `@bmad-master *task create-next-story`
- Review generated story
- Get it approved by stakeholder
- Then develop it

## 🔑 Key Files to Know

| File | Purpose |
|------|---------|
| `.ai/project-status.md` | Complete project state & architecture |
| `.ai/session-2025-11-16.md` | Latest work completed |
| `docs/stories/2.2.story.md` | Example of completed story |
| `.bmad-core/core-config.yaml` | Project configuration |
| `.bmad-core/agents/dev.md` | Your dev agent definition |
| `.bmad-core/agents/qa.md` | QA agent definition |

## 📋 Essential Commands

### Development
```bash
npm install          # Install dependencies
npm run build        # Build all packages
npm run lint         # Check code quality
npm test             # Run all tests
npm run dev          # Start demo app
```

### BMad Agent Commands
```bash
*develop-story {path}   # Implement a story (Dev agent)
*review {story}         # QA review (QA agent)
*run-tests              # Quick test execution
*help                   # Show available commands
```

## ⚠️ Critical Rules

### 1. Story File Editing
- **Dev Agent:** Only edit Tasks/Subtasks, Dev Agent Record, Status
- **QA Agent:** Only append to QA Results section
- **NEVER** modify Story, Acceptance Criteria, or Dev Notes sections

### 2. Test Requirements
- Tests use Node.js test runner (NOT Jest)
- Tests are `.test.js` files in `packages/sdk/test/`
- JSDOM provides browser simulation
- Must handle cross-environment constructors

### 3. Code Quality
- TypeScript strict mode required
- ESLint must pass (no-explicit-any enforced)
- JSDoc comments for exported functions
- Follow patterns from `packages/sdk/src/commands/navigate.ts`

## 🎨 Code Patterns to Follow

### Command Handler Pattern
```typescript
export async function handleCommandName(
  payload: CommandPayload
): Promise<CommandResult> {
  const timestamp = Date.now();
  
  // 1. Validate elementId
  if (!payload.elementId) {
    return warningResult("requires elementId");
  }
  
  // 2. Resolve target
  const resolution = await resolveTarget({ elementId });
  if (!resolution.element) {
    return warningResult("element not found");
  }
  
  // 3. Perform operation with try-catch
  try {
    // do work
    return successResult;
  } catch (error) {
    return errorResult(error);
  }
}
```

### Cross-Environment Constructor Access
```typescript
const Constructor = typeof GlobalConstructor !== 'undefined' 
  ? GlobalConstructor 
  : (globalThis as unknown as { 
      window?: { GlobalConstructor?: typeof GlobalConstructor } 
    }).window?.GlobalConstructor;
```

### WeakMap for Timer Tracking
```typescript
const timers = new WeakMap<Element, number>();

// Set timer
const timeoutId = setTimeout(() => cleanup(), duration);
timers.set(element, timeoutId);

// Clear existing
const existing = timers.get(element);
if (existing) clearTimeout(existing);
```

## 🐛 Common Gotchas

1. **JSDOM Environment**
   - MouseEvent/HTMLElement not globally available
   - Must check `typeof Constructor !== 'undefined'`
   - Mock scrollIntoView in tests

2. **ESLint Errors**
   - Don't use `as any` - use proper type assertions
   - Pattern: `as unknown as { ... }`

3. **Test Timing**
   - Use `await new Promise(resolve => setTimeout(resolve, ms))`
   - Don't forget to wait for async cleanup

4. **Build Issues**
   - Use `globalThis` not `global`
   - Import types from `@frontend-ui-command-sdk/shared`

## 📁 Project Structure (Quick View)

```
WS_SDK/
├── packages/sdk/src/commands/    ← Add new commands here
├── packages/sdk/test/             ← Add tests here
├── apps/demo/src/components/      ← Demo UI components
├── docs/stories/                  ← Story definitions
└── docs/qa/gates/                 ← QA approval files
```

## 🎓 Learning Resources

**To understand the codebase:**
1. Read `packages/sdk/src/commands/highlight.ts` - Latest, cleanest example
2. Read `packages/sdk/test/highlight.test.js` - Test pattern
3. Read `docs/stories/2.2.story.md` - Story structure

**To understand patterns:**
1. WeakMap usage: `highlight.ts` line 26, 104-138
2. Cross-env: `hover.ts` line 114, `focus.ts` line 10
3. Targeting: All commands use `resolveTarget()`

## 🚦 Before You Start Coding

- [ ] Tests pass (`npm test`)
- [ ] Story file read completely
- [ ] Story status is "Approved" (not "Draft")
- [ ] Dev Notes section reviewed
- [ ] Implementation Playbook understood
- [ ] File List location known (for completion)

## 🎉 When You're Done

1. Update story Tasks/Subtasks with [x]
2. Fill in Dev Agent Record section
3. Update File List with created/modified files
4. Add Change Log entry
5. Run tests: `npm test`
6. Run lint: `npm run lint`
7. Set story Status to "Ready for Review"
8. Hand off to QA agent for review

## 💬 Need Help?

1. Check `.ai/project-status.md` - Comprehensive reference
2. Check `.ai/session-2025-11-16.md` - Latest session details
3. Read similar completed story: `docs/stories/2.2.story.md`
4. Review command pattern: `packages/sdk/src/commands/navigate.ts`

## 📊 Current Metrics

- **Total Tests:** 55 ✅
- **Test Coverage:** 4 command types + targeting + connection
- **Quality Score:** 100/100 (Story 2.2)
- **Build Time:** ~900ms
- **Test Time:** ~1.8s

---

**You're all set! Start with step 1 above. Good luck! 🚀**

*Last updated: 2025-11-16 by Dev Agent (Claude via Warp)*
