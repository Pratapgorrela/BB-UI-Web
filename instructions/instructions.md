# Developer Workflow — Beauty Bus

This document defines the step-by-step process for building features. Follow it exactly.

---

## Phase 1 — Setup

1. Open Claude Code in the project root (`BB-UI-Web/`).
2. Paste `instructions/MASTER_PROMPT.md` as your first message.
3. Complete the session initialization (Steps 0–4 of the Master Prompt).
4. You are now oriented and ready to build.

---

## Phase 2 — Pick a Feature

1. Open `instructions/checklist.md` — find the next feature with all dependencies satisfied (marked `[x]`).
2. Cross-reference with `instructions/module-map.md` to confirm the feature is unblocked.
3. If multiple features are unblocked, pick the one highest on the suggested solo build order.

---

## Phase 3 — Branch

Create a feature branch:

```bash
git checkout -b feature/F##-short-name
# Example: git checkout -b feature/F04-service-catalog
```

Never work directly on `main`.

---

## Phase 4 — Lock the Contract

1. Open `instructions/contract.md`.
2. Find the section(s) this feature consumes.
3. If the section is `DRAFT`, review the entities and endpoints for completeness.
4. Change the status to `LOCKED (YYYY-MM-DD)`.
5. Add a change-log entry: `| date | Section | Locked for F## implementation | Developer |`
6. Commit the contract lock: `F##, Step XX — Lock [Section] contract`

---

## Phase 5 — Intel Report

Produce the Intel Report using the template from `instructions/claude.md`:

- Entities & types involved
- Endpoints consumed (with method, path, auth requirement)
- Mock data plan (happy path + edge cases + forced errors)
- Validation rules (Zod schemas)
- Routes to add/modify
- Zustand state changes (if any)
- Acceptance criteria
- Contract section status (must be LOCKED)

**Print the report and WAIT for approval.** Do not write any feature code until the developer replies "approved" or "go".

---

## Phase 6 — Build the Vertical Slice

Build in this exact order. Each step is a logical unit that can be committed independently.

### Step 6.1 — Types & Zod Schemas

- Create TypeScript interfaces/types matching contract entities in `src/features/{feature}/types/`.
- Create Zod schemas mirroring the types for runtime validation.
- Export from the feature's `index.ts`.

### Step 6.2 — Mock Data & Handlers

- Create seed data in `src/mocks/data/{resource}.data.ts`:
  - Happy path: 10–20 realistic records
  - Edge cases: empty strings, max-length values, boundary numbers
  - Pagination: enough records to test multiple pages
- Create mock handlers in `src/mocks/handlers/{resource}.mock.ts`:
  - 300–600ms simulated latency on every response
  - Correct envelope shapes (success single, success paginated, error)
  - Pagination logic (respect `page` and `limit` params)
  - Forced error cases:
    - Specific IDs return 404
    - Specific inputs return 409 CONFLICT
    - A flag or specific value triggers 500
  - All error responses use the standard error envelope

### Step 6.3 — API Layer

- Create API call functions in `src/features/{feature}/api/`:
  - Use the shared `apiClient` — never import axios directly
  - Type inputs and outputs with the types from Step 6.1
  - Return the `data` field from the envelope (unwrap in the API layer)

### Step 6.4 — Hooks

- Create React Query hooks in `src/features/{feature}/hooks/`:
  - Use centralized query key factories
  - Handle cache invalidation (e.g., after creating a booking, invalidate booking list)
  - Configure `staleTime`, `retry`, `enabled` as appropriate
  - Mutation hooks should trigger toast notifications on success/error
  - **No `useEffect` for data fetching** — React Query only

### Step 6.5 — Components

- Create components in `src/features/{feature}/components/`:
  - Use design tokens from `instructions/design.md` — no raw hex, no magic px
  - Use Lucide React icons only
  - Keep components under ~200 lines — extract sub-components if larger
  - Check `src/components/ui/` and `src/components/common/` for reusable primitives first

### Step 6.6 — Pages

- Create page components in `src/pages/`:
  - Wire hooks to components
  - Add route to `src/routes/index.tsx`
  - Handle route params, search params, and navigation

### Step 6.7 — Forms

- Build forms with React Hook Form + Zod:
  - `useForm` with `zodResolver` for the schema
  - Field-level error display (`<p>` or error component under each input)
  - Disabled submit button while submitting
  - Show loading state during submission
  - Display server errors from the API response

### Step 6.8 — 4 Data States

Verify all data-consuming components implement all four states:

| State | What to show |
|---|---|
| **Loading** | Skeleton placeholders matching layout shape |
| **Error** | Error message + retry button |
| **Empty** | Friendly message + CTA |
| **Success** | Actual data |

### Step 6.9 — Responsive

Test and fix layout at all four breakpoints:

| Width | Device | Navigation |
|---|---|---|
| 375px | Mobile | Bottom nav |
| 768px | Tablet | Top nav |
| 1024px | Desktop | Top nav |
| 1440px | Wide | Top nav |

Verify:
- No horizontal scroll
- Touch targets minimum 44px
- Text is readable
- Cards reflow from 1-column (mobile) to multi-column (desktop)
- Modals become bottom sheets on mobile

---

## Phase 7 — Demo

Before committing, do a live walkthrough in mock mode:

1. Start the dev server: `npm run dev`
2. Navigate to the feature's pages
3. Test the happy path end-to-end
4. Trigger error states (use forced-error mock inputs)
5. Trigger empty states (if applicable)
6. Verify loading skeletons appear during mock delay
7. Check browser DevTools for console errors — **fix all errors before proceeding**
8. Resize to mobile and verify bottom nav + responsive layout

---

## Phase 8 — Polish

- Remove any `console.log` debugging statements (keep prefixed logs)
- Verify design token compliance (no raw hex, no magic px)
- Check component file lengths (< ~200 lines)
- Verify naming conventions match `instructions/claude.md` Rule 5

---

## Phase 9 — Manual Test Scenarios

Run through these for every feature:

- [ ] Happy path works end-to-end
- [ ] Form validation shows field-level errors on invalid input
- [ ] Empty state renders when no data
- [ ] Error state renders and retry button works
- [ ] Loading skeleton shows during fetch
- [ ] Responsive layout correct at 375px, 768px, 1024px, 1440px
- [ ] Keyboard navigation works for interactive elements
- [ ] No console errors in DevTools

---

## Phase 10 — Pre-Push Checklist

Run all three commands — all must pass with zero errors:

```bash
npm run typecheck
npm run lint
npm run build
```

Additionally verify:

- [ ] No `any` types in changed files
- [ ] Design tokens only — no raw hex colors or magic pixel values
- [ ] All 4 data states present
- [ ] Responsive from 375px upward
- [ ] Forms use Zod validation with field-level errors
- [ ] Fully functional in mock mode (`VITE_USE_MOCKS=true`)
- [ ] No console errors
- [ ] Components under ~200 lines

---

## Phase 11 — Mandatory Pre-Push Sync

Before pushing, sync with `main` to catch conflicts early:

```bash
git fetch origin
git merge origin/main
```

### Conflict Resolution Rules

- **Checklist conflicts**: keep ALL entries from both branches — never delete another feature's progress
- **Mock data conflicts**: merge data, deduplicate by ID
- **Component conflicts**: review both changes, combine functionality
- **NEVER force-push** — no `git push --force` under any circumstances
- After resolving conflicts, re-run `npm run typecheck && npm run lint && npm run build`

---

## Phase 12 — Commit & PR

### Commit

```bash
git add [specific files]
git commit -m "F##, Step ## — Description"
```

### PR (if using GitHub flow)

Create a PR with:

- Title: `F## — Feature Name`
- Body:
  - Summary of what was built
  - **Mock-mode test steps** — how to verify in `VITE_USE_MOCKS=true`
  - Screenshots at mobile + desktop
  - Checklist of acceptance criteria

---

## Phase 13 — After Merge

1. Update `instructions/checklist.md` — mark all completed steps `[x]`
2. Add an entry to the merge log at the bottom of `checklist.md`
3. Identify newly unblocked features and note them

---

## Mid-Work Session Sync

If a session is getting long or you need to pause:

1. Commit work-in-progress: `F##, Step ## — WIP: Description`
2. Update `checklist.md` with current progress (mark completed steps, note in-progress step)
3. Note any decisions, blockers, or context in the commit message

When resuming, the MASTER_PROMPT will read `checklist.md` and pick up from the right spot.

---

## 10-Rule Recap

| # | Rule |
|---|---|
| 1 | Contract before code |
| 2 | Vertical slices in order |
| 3 | Read before write |
| 4 | TS strict, no `any`, RHF+Zod, RQ for server state, Zustand for client state |
| 5 | Naming conventions |
| 6 | Reuse before create |
| 7 | Branch + commit discipline |
| 8 | Pre-push checklist passes |
| 9 | Contract + design compliance |
| 10 | No unauthorized packages |
