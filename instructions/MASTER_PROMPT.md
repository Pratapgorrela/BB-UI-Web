# MASTER PROMPT — Beauty Bus

> **Paste this entire file as the FIRST message of every Claude Code session.**

---

## STEP 0 — Workspace Detection

Check for the presence of `package.json` AND `src/App.tsx` in the project root.

### If MISSING → BOOTSTRAP Mode

You are starting a fresh project. Execute the following in order:

1. Scaffold a Vite + React + TypeScript application (`npm create vite@latest . -- --template react-ts`).
2. Install all required dependencies:
   - `react-router-dom` (v6), `@tanstack/react-query` (v5), `zustand`, `react-hook-form`, `zod`, `@hookform/resolvers`, `axios`, `lucide-react`, `date-fns`
   - Dev: `tailwindcss @tailwindcss/vite`, `eslint`, `prettier`, `vitest`, `@testing-library/react`, `@testing-library/jest-dom`
3. Configure Tailwind CSS with **ALL design tokens** from `instructions/design.md` (full color scales, typography, spacing, radii, shadows, z-index, breakpoints).
4. Create the folder structure from `instructions/architecture.md`.
5. Create the shared `apiClient` (`src/lib/apiClient.ts`) with `VITE_USE_MOCKS` toggle — when true, route requests through the mock layer; when false, use `VITE_API_BASE_URL`.
6. Create the React Query `queryClient` (`src/lib/queryClient.ts`) with sensible defaults.
7. Create the router shell (`src/routes/index.tsx`) with placeholder routes.
8. Create `.env`, `.env.example` (with `VITE_USE_MOCKS=true`, `VITE_API_BASE_URL=http://localhost:8080/api/v1`), and `.gitignore`.
9. Verify: `npm run build` passes with zero errors.
10. Create initial git commit: `F0, Step 01 — Project scaffold`.
11. **STOP for review.**

After F0 review, remind the developer: *"When you're ready, please share your completed mobile flow designs so I can align the design system tokens and components."*

### If PRESENT → RESUME Mode

You are continuing an existing project. Execute:

1. Run `git status` — report branch, staged/unstaged changes.
2. Run `git log --oneline -10` — report recent commits.
3. Proceed to STEP 1.

---

## STEP 1 — Read & Confirm

Read ALL of the following files:

- `instructions/claude.md`
- `instructions/architecture.md`
- `instructions/contract.md`
- `instructions/design.md`
- `instructions/module-map.md`
- `instructions/instructions.md`
- `instructions/checklist.md`
- `CLAUDE.md`

Print a confirmation summary:

```
SESSION INIT COMPLETE
---------------------
Stack       : React 18 + TypeScript + Vite + Tailwind + React Query 5 + Zustand
Mock Mode   : VITE_USE_MOCKS=true (in-repo mock layer)
Brand       : Primary #7430D9 (purple) | Success #28D439 | Danger #D42828
Design      : [status from design.md banner — e.g., "Palette approved; mobile flows pending"]
Progress    : [from checklist.md — e.g., "F0 complete, F1 in progress, 8% overall"]
```

---

## STEP 2 — Orient

Scan the current state of the codebase:

- `src/features/` — which feature folders exist and what's inside them
- `src/mocks/` — which mock handlers/data files exist
- `src/pages/` — which page components exist
- Current git branch name

Report any discrepancies between `checklist.md` and actual file state.

---

## STEP 3 — Project State Report

Generate a boxed ASCII report from `checklist.md`:

```
+=========================================+
|       BEAUTY BUS — PROJECT STATE        |
+=========================================+
| Current Feature : F4 — Service Catalog  |
| Current Step    : Step 14 / 65          |
| Overall Progress: 21%                   |
+-----------------------------------------+
| Completed       : F0, F1, F2, F3       |
| In Progress     : F4                    |
| Unblocked       : F5, F6               |
| Blocked         : F7 (needs F5 + F6)   |
+-----------------------------------------+
| Contract Locked : Auth, Catalog         |
| Contract Draft  : Booking, Profile,    |
|                   Reviews, Notifs       |
+-----------------------------------------+
| Pending Inputs  :                       |
|  - Mobile flows : Waiting              |
+=========================================+
```

*(Values above are illustrative — pull real data from checklist.md.)*

---

## STEP 4 — Session Goal

Ask the developer:

> **What would you like to work on this session?**
>
> 1. **Continue** — pick up the next unblocked step from the checklist
> 2. **Specific feature** — jump to a particular feature (e.g., "F6 Auth")
> 3. **Fix** — address a bug or issue
> 4. **Design pass** — align components with designer's flows
> 5. **Integration** — replace mock layer with real API for a feature

**WAIT for confirmation before proceeding.**

---

## STEP 5 — Pre-Build Protocol

Before writing any feature code:

1. **Lock the contract section** — confirm the relevant section in `contract.md` is marked `LOCKED (date)`. If still `DRAFT`, lock it now (update status + add change-log entry).
2. **Produce an Intel Report** — using the template from `instructions/claude.md`:
   - Entities & types involved
   - Endpoints consumed
   - Mock data plan (happy path + edge cases + forced errors)
   - Validation rules (Zod schemas)
   - Routes to add/modify
   - Zustand state changes (if any)
   - Acceptance criteria
   - Contract section status
3. **Wait for approval** — print the Intel Report and ask: *"Intel Report ready. Reply 'approved' or 'go' to begin building, or provide feedback."*
4. **Build in vertical-slice order** — Types → Zod → Mock data → Mock handlers → API layer → Hooks → Components → Pages → Forms → 4 data states → Responsive.

---

## STEP 6 — Quality & Commit

After completing work:

1. **Pre-push checklist** — run and verify:
   ```bash
   npm run typecheck && npm run lint && npm run build
   ```
   - No `any` types
   - Design tokens only (no raw hex/px)
   - All 4 data states (loading/error/empty/success)
   - Responsive from 375px+
   - Zod-validated forms
   - Full functionality in mock mode
   - No console errors

2. **Update `checklist.md`** — mark completed steps `[x]`, advance current step.

3. **Commit** — format: `F##, Step ## — Description`
   - Example: `F4, Step 14 — Service catalog list page with filtering`

4. **Print SESSION COMPLETE report:**

```
SESSION COMPLETE
----------------
Files Created  : src/features/catalog/types/service.ts, ...
Files Modified : instructions/checklist.md, ...
Next Step      : Step 15 — Service detail page
Testable Now   : Browse /services in mock mode, filter by category
Mock Coverage  : 12 services, 4 categories, pagination, empty state, error state
```

---

## Quick Reference

### 10 Mandatory Rules

| # | Rule |
|---|---|
| 1 | Contract before code — section must be LOCKED |
| 2 | Vertical slices: Types → Zod → Mock → API → Hooks → Components → Pages → Forms → States → Responsive |
| 3 | Read before write — check module-map, checklist, existing code, contract, design |
| 4 | TS strict, no `any`, RHF+Zod forms, React Query for server state, Zustand for client state only |
| 5 | Naming: PascalCase components, `use{Action}{Resource}` hooks, `use{Domain}Store` stores, `{resource}.mock.ts` |
| 6 | Reuse before create — check existing components and utilities first |
| 7 | Branch: `feature/F##-short-name`, commit: `F##, Step ## — Description`, never commit to main |
| 8 | Pre-push: typecheck + lint + build pass, tokens only, 4 states, responsive, mock mode works |
| 9 | Contract + design compliance — envelopes, tokens, layout, voice |
| 10 | No new npm packages without explicit approval |

### Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | React | 18 |
| Language | TypeScript | strict mode |
| Build | Vite | latest |
| Styling | Tailwind CSS | latest |
| Routing | React Router | 6 |
| Server State | React Query | 5 (@tanstack/react-query) |
| Client State | Zustand | latest |
| Forms | React Hook Form + Zod | latest |
| HTTP | Axios (shared apiClient) | latest |
| Icons | Lucide React | latest |
| Dates | date-fns | latest |
| Linting | ESLint + Prettier | latest |
| Testing | Vitest | latest |

### Design Tokens (from design.md)

| Token | Value |
|---|---|
| Primary (purple) | `#7430D9` |
| Success (green) | `#28D439` |
| Danger (red) | `#D42828` |
| Info (blue) | `#2963D6` |
| Warning (yellow) | `#DE902A` |
| Neutral-100 | `#F4F2F6` |
| Neutral-900 | `#120D1A` |
| White | `#FFFFFF` |
| Heading font | Poppins (PROVISIONAL) |
| Body font | Inter (PROVISIONAL) |
| Mono font | JetBrains Mono |
| Spacing grid | 4px |
| Border radius | 6/8/12/16/full |
| Touch target | 44px minimum |
| Mobile nav | Bottom, 64px |
| Desktop nav | Top header, 64px |
| Max width | 1200px |
