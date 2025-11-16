# .ai Directory - AI Agent Workspace

This directory contains documentation and artifacts created by and for AI development agents working on this project.

## 📂 Directory Contents

### Essential Files (Start Here)

| File | Purpose | When to Use |
|------|---------|-------------|
| **NEXT_AGENT_START_HERE.md** | Quick start guide for new agents | First thing to read when starting a session |
| **project-status.md** | Complete project state & architecture | Reference throughout development |
| **session-YYYY-MM-DD.md** | Session-specific work logs | Review to understand recent changes |
| **debug-log.md** | Development debug notes | During active development troubleshooting |

## 📖 Reading Order for New Agents

1. **Start**: `NEXT_AGENT_START_HERE.md` (5 min)
   - Quick orientation
   - Current status
   - First steps

2. **Context**: `project-status.md` (10 min)
   - Full project overview
   - Architecture patterns
   - Key decisions

3. **History**: `session-2025-11-16.md` (5 min)
   - What was just completed
   - Patterns learned
   - Challenges solved

4. **Story**: `../docs/stories/2.2.story.md` (5 min)
   - Example of completed story
   - Story structure
   - QA process

## 📝 File Descriptions

### NEXT_AGENT_START_HERE.md
**Purpose:** Fastest path to productivity  
**Contains:**
- Current project status checklist
- 5-minute startup routine
- Critical rules & gotchas
- Common code patterns
- Quick reference commands

**Update frequency:** After each major milestone

### project-status.md
**Purpose:** Comprehensive project reference  
**Contains:**
- Complete project structure
- Technology stack
- Architecture patterns
- Dependencies graph
- Known issues & technical debt
- Next steps roadmap

**Update frequency:** After completing stories or major changes

### session-YYYY-MM-DD.md
**Purpose:** Session-specific work log  
**Contains:**
- Objectives & outcomes
- Files created/modified
- Key learnings
- Challenges overcome
- Patterns discovered
- Metrics & timing

**Update frequency:** End of each development session

### debug-log.md
**Purpose:** Active development notes  
**Contains:**
- Real-time problem solving
- Experiment results
- Dead ends explored
- Solutions that worked

**Update frequency:** During active development

## 🔄 Maintenance Guidelines

### When to Update

**After completing a story:**
- Update `project-status.md` (current phase, recently completed)
- Create new `session-YYYY-MM-DD.md`
- Update `NEXT_AGENT_START_HERE.md` (status checklist)

**During active development:**
- Use `debug-log.md` for notes
- Don't edit other files mid-session

**After major milestones:**
- Review all files for accuracy
- Archive old session files if needed
- Update metrics and status

### Naming Conventions

- Session files: `session-YYYY-MM-DD.md`
- Special docs: `ALL_CAPS_WITH_UNDERSCORES.md`
- Reference docs: `kebab-case.md`

## 🎯 Usage Patterns

### Starting New Session
```bash
cd /Users/milad/Documents/Work/WS_SDK/.ai
cat NEXT_AGENT_START_HERE.md    # Quick start
cat project-status.md            # Full context
cat session-2025-11-16.md        # Latest work
```

### During Development
```bash
# Check current status
npm test
npm run lint

# Reference patterns
grep -r "WeakMap" ../packages/sdk/src/commands/

# Review similar code
cat ../packages/sdk/src/commands/highlight.ts
```

### Ending Session
```bash
# Create session log
echo "# Session YYYY-MM-DD" > session-YYYY-MM-DD.md
# ... document work ...

# Update status
vim project-status.md
vim NEXT_AGENT_START_HERE.md
```

## 📋 Documentation Standards

### Session Logs Should Include
- ✅ Objectives & outcomes
- ✅ Files created/modified (with line counts)
- ✅ Key learnings & patterns
- ✅ Challenges & solutions
- ✅ Metrics (tests, quality score, timing)
- ✅ Next session recommendations

### Project Status Should Include
- ✅ Current phase & completed work
- ✅ Project structure
- ✅ Architecture patterns
- ✅ Technology stack
- ✅ Dependencies
- ✅ Known issues
- ✅ Next steps

### Quick Start Should Include
- ✅ Current status checklist
- ✅ 5-step startup routine
- ✅ Critical rules
- ✅ Common patterns
- ✅ Essential commands
- ✅ Gotchas & solutions

## 🔗 Related Documentation

### Project Documentation
- `../docs/stories/*.md` - Story definitions
- `../docs/architecture/*.md` - Architecture docs
- `../docs/qa/gates/*.yml` - Quality gates
- `../.bmad-core/agents/*.md` - Agent definitions

### Code Documentation
- `../packages/sdk/src/commands/*.ts` - Command implementations
- `../packages/sdk/test/*.test.js` - Test suites
- `../apps/demo/src/components/*.tsx` - Demo UI

### Configuration
- `../.bmad-core/core-config.yaml` - Project config
- `../package.json` - Dependencies
- `../turbo.json` - Build config

## 💡 Tips for AI Agents

1. **Always read NEXT_AGENT_START_HERE.md first**
   - It's designed for 5-minute onboarding
   - Contains critical gotchas
   - Has current status

2. **Use project-status.md as reference**
   - Don't try to memorize everything
   - Refer to it when needed
   - It has all architecture patterns

3. **Create detailed session logs**
   - Future agents need context
   - Document patterns discovered
   - Include code examples

4. **Update status after major work**
   - Keep metrics current
   - Document new patterns
   - Update known issues

5. **Follow established patterns**
   - Check existing commands for examples
   - Maintain consistency
   - Document deviations

## 🏗️ Directory Structure

```
.ai/
├── README.md                      # This file
├── NEXT_AGENT_START_HERE.md      # Quick start guide
├── project-status.md              # Complete project state
├── session-2025-11-16.md          # Latest session log
├── debug-log.md                   # Development notes
└── [future session logs]
```

## 📞 Questions?

If you're a new agent and something is unclear:

1. Check `NEXT_AGENT_START_HERE.md`
2. Search `project-status.md`
3. Review latest `session-*.md`
4. Look at completed story: `../docs/stories/2.2.story.md`
5. Examine similar code: `../packages/sdk/src/commands/`

---

**Last updated:** 2025-11-16  
**Maintained by:** AI Development Agents  
**Purpose:** Enable seamless agent hand-offs and maintain project knowledge
