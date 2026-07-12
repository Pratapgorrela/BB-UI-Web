# Beauty Bus — Project Config

**Beauty Bus** is a mobile-first beauty service booking platform that brings salon services to the customer's doorstep. Browse services, view details/pricing, book appointments by date/time/address, manage bookings, view history.

## Architecture

- **Frontend-only** — no backend exists yet
- **Mock-first** — in-repo mock layer behind `VITE_USE_MOCKS` env flag; real backend wired later by flipping the flag
- **Stack**: React 18 + TypeScript (strict) + Vite + Tailwind CSS + React Router 6 + React Query 5 + Zustand + RHF + Zod + Axios + Lucide React + date-fns

## Design Status

- Brand palette: **approved** — Primary `#7430D9` (purple), Success `#28D439`, Danger `#D42828`, Info `#2963D6`, Warning `#DE902A`
- Typography: Poppins headings + Inter body + JetBrains Mono (PROVISIONAL)
- Mobile flow designs: **completed by designer, pending share** — when received, they become the visual source of truth

## Source of Truth

| Question | File |
|---|---|
| How do I start a session? | `instructions/MASTER_PROMPT.md` |
| What are the build rules? | `instructions/claude.md` |
| What's the tech stack & folder structure? | `instructions/architecture.md` |
| What does the API look like? | `instructions/contract.md` |
| What are the design tokens & component specs? | `instructions/design.md` |
| What features exist & their dependencies? | `instructions/module-map.md` |
| How do I build a feature step-by-step? | `instructions/instructions.md` |
| What's done and what's next? | `instructions/checklist.md` |

## 10 Non-Negotiables

1. Contract LOCKED before code
2. Vertical slices: Types → Zod → Mock → API → Hooks → Components → Pages → Forms → States → Responsive
3. Read before write
4. TS strict / no `any` / RQ for server state / Zustand for client state only
5. Naming: PascalCase components, `use{Action}{Resource}` hooks, `use{Domain}Store` stores
6. Reuse before create
7. Branch `feature/F##-short-name`, commit `F##, Step ## — Description`
8. Pre-push: `typecheck + lint + build` pass, tokens only, 4 states, responsive, mock mode works
9. Contract + design compliance
10. No new packages without approval

## NPM Commands

```bash
npm run dev        # Start dev server
npm run build      # Production build
npm run lint       # ESLint
npm run typecheck  # TypeScript type check
npm run test       # Vitest
```
