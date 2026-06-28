# Beauty Bus — Build Governance System

## Why This Exists

Claude Code has **no memory between sessions**. Every conversation starts from zero. This governance system solves that problem by encoding all project knowledge — architecture, contracts, design tokens, progress, and workflow rules — into durable markdown files that are reloaded at the start of every session via the **MASTER_PROMPT**.

The result: every session picks up exactly where the last one left off, with full context, consistent quality, and zero drift.

## Philosophy

| Principle | Meaning |
|---|---|
| **Contract-first** | The API contract is locked before any code is written. Mocks implement the contract exactly. |
| **Vertical slices** | Each feature is built top-to-bottom in a strict order: Types → Zod → Mocks → API → Hooks → Components → Pages → Forms → States → Responsive. |
| **Mock-driven** | The frontend runs fully against an in-repo mock layer behind `VITE_USE_MOCKS`. The real backend can be wired later by flipping one flag. |
| **Session-aware** | Every session starts with orientation (MASTER_PROMPT), produces a progress report, and ends with a structured commit + status update. |
| **Checklist-driven** | Progress is tracked in `checklist.md` with globally numbered steps. Nothing is "done" until the checklist says so. |
| **Design-compliant** | All colors, typography, spacing, and component specs come from `design.md`. No ad-hoc values. |

## Quick Start

### BOOTSTRAP Session (first time)

1. Open Claude Code in the project root.
2. Paste the contents of `instructions/MASTER_PROMPT.md` as your first message.
3. Claude detects `package.json` + `src/App.tsx` are missing → enters **BOOTSTRAP mode**.
4. Scaffolds the full Vite + React + TS app, Tailwind config with design tokens, folder structure, mock infrastructure, and initial commit.
5. Stops for your review.

### RESUME Session (every subsequent time)

1. Open Claude Code in the project root.
2. Paste the contents of `instructions/MASTER_PROMPT.md` as your first message.
3. Claude detects existing project → enters **RESUME mode**.
4. Reads all instruction files, orients on the codebase, and prints a Project State Report.
5. Asks what you want to work on.

## File Manifest

| File | Purpose |
|---|---|
| `README.md` | This file — governance overview, philosophy, quick start. |
| `MASTER_PROMPT.md` | The prompt pasted at the start of every Claude Code session. Drives session init, orientation, building, and commit protocol. |
| `claude.md` | Agent persona, 10 hard rules, Intel Report template, naming conventions, and quality gates. |
| `architecture.md` | Tech stack, repo layout, mock API strategy, response envelopes, error codes, state management boundaries, env config, Definition of Done. |
| `contract.md` | The canonical API contract — entities, endpoints, auth flow, status lifecycles, response shapes. Source of truth for all data interactions. |
| `design.md` | Design system reference — brand palette, color scales, typography, spacing, radii, shadows, motion, layout, component specs, data-view states, accessibility. |
| `module-map.md` | Feature breakdown (F0–F12) with phases, dependencies, deliverables, acceptance criteria, build-order graph, and critical path. |
| `instructions.md` | Step-by-step developer workflow — from picking a feature to merging a PR. The "how" to the module-map's "what". |
| `checklist.md` | Session-surviving progress tracker with per-feature task tables, contract status, pending inputs, merge log, and conflict rules. |
| `../CLAUDE.md` | Project-root config file Claude Code reads automatically — stack summary, source-of-truth pointers, non-negotiables, npm commands. |
