# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Overview

This repo is a BMad Method project scaffold. It contains project-scoped agent definitions, rules, tasks, and docs wiring for agentic planning and development. There is no conventional app build, lint, or test harness here; work is driven by agents and documents.

Key locations:
- `.bmad-core/` — core config, agents, tasks, templates, checklists, data, workflows
- `.cursor/rules/bmad/` — Cursor agent rules (authoritative operating constraints)
- `web-bundles/` — prebuilt agent/team bundles for web platforms
- `docs/` — planning, stories, and QA artifact roots (created/sharded by agents)

## Commands and tooling

Prerequisites
- Node.js ≥ 18, npm ≥ 9

Project setup / integration
- Interactive installer (adds/refreshes IDE integrations as chosen):
  - npx bmad-method install
- OpenCode refresh (idempotent merge of agents/commands into opencode.json[c]):
  - npx bmad-method install -f -i opencode
- Codex modes (choose one):
  - Local-only (keep `.bmad-core/` untracked):
    - npx bmad-method install -f -i codex -d .
  - Codex Web (commit `.bmad-core/` for web usage):
    - npx bmad-method install -f -i codex-web -d .

Notes
- This repo has no `package.json`; use `npx` as shown above.
- The installer merges BMad entries without duplicating non‑BMad settings.

Common actions (via IDE agents; commands are star‑prefixed)
- Shard PRD/Architecture for focused work (writes to sharded dirs):
  - @bmad-master *shard-doc docs/prd.md docs/prd
  - @bmad-master *shard-doc docs/architecture.md docs/architecture
- Create next story (writes under `docs/stories/`):
  - @bmad-master *task create-next-story
- Implement a story (Dev agent, strict story‑file update rules):
  - @dev *develop-story docs/stories/<story-file>.md
- QA checkpoints and review (outputs shown below):
  - @qa *risk {story}     # early risk profile
  - @qa *design {story}   # test strategy
  - @qa *trace {story}    # requirements → tests
  - @qa *nfr {story}      # non‑functional attrs
  - @qa *review {story}   # full assessment + gate
  - @qa *gate {story}     # update final gate status

Output paths (authoritative from `.bmad-core/core-config.yaml` and QA tasks)
- Stories: `docs/stories/`
- QA assessments: `docs/qa/assessments/{epic}.{story}-<type>-{YYYYMMDD}.md`
- QA gates: `docs/qa/gates/{epic}.{story}-{slug}.yml`

## High‑level architecture and operating rules

Core configuration (`.bmad-core/core-config.yaml`)
- PRD: `docs/prd.md` (optional sharding → `docs/prd/`)
- Architecture: `docs/architecture.md` (optional sharding → `docs/architecture/`)
- Stories root: `docs/stories/`
- QA root: `docs/qa/`
- Developer always‑load files (Dev agent startup context):
  - `docs/architecture/coding-standards.md`
  - `docs/architecture/tech-stack.md`
  - `docs/architecture/source-tree.md`
- Dev debug log path: `.ai/debug-log.md`

Agent rules (Cursor) — important cross‑cutting constraints
- Activation: only read `.bmad-core/core-config.yaml`; do not scan or pre‑load other files.
- Commands: star‑prefixed (e.g., `*help`, `*task`, `*develop-story`); present numbered option lists when offering choices.
- Dev agent (`.cursor/rules/bmad/dev.mdc`):
  - Only edit designated sections in story files (Tasks/Subtasks checkboxes and Dev Agent Record subsections).
  - Follow the `develop-story` flow: implement task → write tests → run validations → only then mark complete and update File List.
  - Halt and ask when dependencies are unapproved/ambiguous or regressions fail.
- QA agent (`qa.mdc`):
  - Only append to the "QA Results" section in story files; gate files live under `docs/qa/gates/`.
  - Provides PASS/CONCERNS/FAIL/WAIVED with rationale; supports waivers.
- BMad‑Master (`bmad-master.mdc`):
  - Can execute any task and manage templates/checklists; can toggle knowledge‑base mode with `*kb` to load `.bmad-core/data/bmad-kb.md` when explicitly requested.
- Orchestrator is for web bundles (not intended for IDE coding sessions).

Workflows and bundles
- `.bmad-core/workflows/*` define guided greenfield/brownfield flows used by orchestrations.
- `web-bundles/` mirrors agent personas and dependencies for web platforms.

## Practical notes for Warp in this repo
- There are no build/lint/test scripts in this repository; those exist in the application codebases you pair with BMad. Validations here are document‑ and workflow‑oriented via agents.
- Keep the three always‑load developer docs lean; they are loaded into Dev agent context on startup.
- File locations in `core-config.yaml` are authoritative; agents assume these paths.
