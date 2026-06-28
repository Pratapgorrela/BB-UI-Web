# Architecture — Beauty Bus

## Tech Stack

| Layer | Technology | Version | Purpose |
|---|---|---|---|
| Framework | React | 18.x | UI library |
| Language | TypeScript | 5.x (strict) | Type safety |
| Build Tool | Vite | latest | Dev server & bundling |
| Styling | Tailwind CSS | latest | Utility-first CSS |
| Routing | React Router | 6.x | Client-side routing |
| Server State | @tanstack/react-query | 5.x | Async data fetching, caching, sync |
| Client State | Zustand | latest | Lightweight global state |
| Forms | React Hook Form + Zod | latest | Form management + validation |
| HTTP Client | Axios | latest | API requests via shared apiClient |
| Icons | Lucide React | latest | Consistent icon set |
| Dates | date-fns | latest | Date manipulation |
| Linting | ESLint + Prettier | latest | Code quality |
| Testing | Vitest + Testing Library | latest | Unit & component tests |

---

## Repository Layout

```
beauty-bus/
├── public/
├── src/
│   ├── assets/                     # Images, fonts, static files
│   ├── components/
│   │   ├── ui/                     # Primitives: Button, Input, Badge, Card, Modal, Toast, Skeleton
│   │   ├── common/                 # Shared: DataState, EmptyState, ErrorState, SearchBar, Pagination
│   │   └── layout/                # AppShell, BottomNav, TopNav, PageHeader, Container
│   ├── features/
│   │   └── {feature-name}/
│   │       ├── api/               # API call functions (e.g., fetchServices.ts)
│   │       ├── hooks/             # React Query hooks (e.g., useFetchServices.ts)
│   │       ├── components/        # Feature-specific components
│   │       ├── types/             # Feature-specific types & Zod schemas
│   │       └── index.ts           # Public exports
│   ├── pages/                     # Page-level components (one per route)
│   ├── routes/                    # Route config & guards
│   │   └── index.tsx
│   ├── mocks/
│   │   ├── data/                  # Seed data files ({resource}.data.ts)
│   │   └── handlers/             # Mock request handlers ({resource}.mock.ts)
│   ├── lib/
│   │   ├── apiClient.ts          # Axios instance + mock routing
│   │   └── queryClient.ts        # React Query client config
│   ├── hooks/                     # Shared custom hooks
│   ├── store/                     # Zustand stores
│   ├── types/                     # Global types (api envelopes, common types)
│   ├── utils/                     # Pure utility functions
│   ├── constants/                 # App-wide constants & enums
│   ├── styles/                    # Global CSS, Tailwind base
│   ├── App.tsx                    # Root component (providers, router)
│   └── main.tsx                   # Entry point
├── instructions/                  # Governance files (this folder)
├── .env                           # Local env (gitignored)
├── .env.example                   # Env template (committed)
├── CLAUDE.md                      # Claude Code project config
├── tailwind.config.ts
├── tsconfig.json
├── vite.config.ts
└── package.json
```

---

## Mock API Strategy

### How It Works

1. **Contract defines the truth** — every endpoint, entity, and envelope is specified in `contract.md`.
2. **Mock handlers implement the contract** — located in `src/mocks/handlers/`, they return realistic data matching the exact envelope shapes.
3. **Mock data lives in `src/mocks/data/`** — seed data for each entity with happy-path, edge-case, and boundary values.
4. **The `apiClient` routes by environment** — when `VITE_USE_MOCKS=true`, requests are intercepted and handled by the mock layer; when `false`, they hit `VITE_API_BASE_URL`.
5. **Feature code never knows the mode** — components, hooks, and pages are completely unaware of whether data is mocked or real.

### Mock Handler Requirements

- **Simulated latency**: 300–600ms random delay on every response
- **Realistic pagination**: respect `page` and `limit` query params, return correct `pagination` envelope
- **Forced error cases**: specific inputs trigger error responses (e.g., a known email returns 409 CONFLICT)
- **Envelope compliance**: every response matches the standard envelope shapes exactly
- **Status codes**: return appropriate HTTP status codes matching the contract

---

## Standard Response Envelopes

All API responses conform to one of three shapes. The mock layer and the real backend must both use these exact structures.

### Success — Single Resource

```json
{
  "success": true,
  "data": { /* entity */ },
  "error": null
}
```

### Success — Paginated List

```json
{
  "success": true,
  "data": [ /* entities */ ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "totalItems": 142,
    "totalPages": 8,
    "hasNextPage": true,
    "hasPreviousPage": false
  },
  "error": null
}
```

### Error

```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "The requested service was not found.",
    "timestamp": "2026-06-11T12:00:00.000Z",
    "path": "/api/v1/services/abc-123",
    "details": []
  }
}
```

---

## Error Codes

| Code | HTTP Status | When Used |
|---|---|---|
| `RESOURCE_NOT_FOUND` | 404 | Entity does not exist |
| `UNAUTHORIZED` | 401 | Missing or expired token |
| `FORBIDDEN` | 403 | Valid token but insufficient permissions |
| `VALIDATION_ERROR` | 400 | Request body fails validation |
| `SLOT_UNAVAILABLE` | 409 | Time slot already booked |
| `BUSINESS_RULE_VIOLATION` | 422 | Violates a business rule (e.g., cancel too late) |
| `CONFLICT` | 409 | Duplicate resource (e.g., email already registered) |
| `INTERNAL_ERROR` | 500 | Unexpected server error |

---

## Environment Configuration

| Variable | Dev Default | Purpose |
|---|---|---|
| `VITE_USE_MOCKS` | `true` | Route API calls through mock layer |
| `VITE_API_BASE_URL` | `http://localhost:8080/api/v1` | Real backend URL (used when mocks disabled) |

Both variables go in `.env` (gitignored) and `.env.example` (committed as template).

---

## State Management Boundaries

| What | Where | Why |
|---|---|---|
| Service list, details, categories | React Query | Server state — cached, refetched, paginated |
| Specialist list, details | React Query | Server state |
| Time slots, availability | React Query | Server state — changes frequently |
| Bookings (list, detail) | React Query | Server state |
| User profile, addresses | React Query | Server state |
| Reviews, notifications | React Query | Server state |
| Auth session (token, user ID, role) | Zustand (`useAuthStore`) | Client state — persists across navigation, drives auth headers |
| Booking draft (in-progress booking flow) | Zustand (`useBookingStore`) | Client state — multi-step form state that survives step navigation |
| UI preferences (theme, sidebar) | Zustand (`useUIStore`) | Client state — user preferences |
| Form field values, validation | React Hook Form | Form state — scoped to form lifecycle |
| URL params (filters, search, page) | React Router (searchParams) | URL state — shareable, bookmarkable |

### Rule of Thumb

- If it came from the server → **React Query**
- If it's client-only and must survive page navigation → **Zustand**
- If it's form input → **React Hook Form**
- If it belongs in the URL → **React Router searchParams**

---

## Centralized Query Keys

All React Query keys are defined in a per-domain key factory pattern:

```typescript
// src/features/service-catalog/hooks/keys.ts
export const catalogKeys = {
  all: ['catalog'] as const,
  categories: () => [...catalogKeys.all, 'categories'] as const,
  services: (filters?: ServiceFilters) => [...catalogKeys.all, 'services', filters] as const,
  service: (id: string) => [...catalogKeys.all, 'service', id] as const,
  specialists: (serviceId?: string) => [...catalogKeys.all, 'specialists', serviceId] as const,
  specialist: (id: string) => [...catalogKeys.all, 'specialist', id] as const,
};
```

This enables granular cache invalidation and prevents key collisions.

---

## Testing Tiers

| Tier | Tool | Scope | When |
|---|---|---|---|
| Unit | Vitest | Utils, pure functions, Zod schemas | Every feature |
| Component | Vitest + Testing Library | Individual components with mock data | Key interactive components |
| Integration | Vitest + Testing Library | Feature flows (hook → component → page) | After feature complete |
| E2E | Playwright | Full user journeys in mock mode | F12 Polish phase |

---

## API Conventions

| Convention | Rule |
|---|---|
| Base path | `/api/v1/` |
| Resource paths | Kebab-case, plural (e.g., `/api/v1/time-slots`) |
| IDs | UUID v4 |
| JSON casing | camelCase for keys |
| Enum casing | UPPER_SNAKE_CASE |
| Dates | ISO 8601 UTC (e.g., `2026-06-11T14:30:00.000Z`) |
| Money | Integer minor units + ISO 4217 currency (e.g., `{ amount: 5000, currency: "USD" }` = $50.00) |
| Duration | Integer minutes |
| Pagination | Query params: `page` (1-based), `limit` (default 20, max 100) |
| Auth | `Authorization: Bearer <token>` header |

---

## Definition of Done — Feature

A feature is complete when ALL of the following are true:

- [ ] Contract section LOCKED for all consumed endpoints
- [ ] TypeScript types match contract entities exactly
- [ ] Zod schemas mirror types with proper validation rules
- [ ] Mock data covers happy path, edge cases, empty state, error triggers
- [ ] Mock handlers return correct envelopes with realistic latency
- [ ] API layer functions use `apiClient` — no direct axios imports
- [ ] React Query hooks handle loading, error, and success states
- [ ] Components use design tokens exclusively — no raw values
- [ ] Pages compose components with correct layout
- [ ] Forms use RHF + Zod with field-level error display
- [ ] All 4 data states rendered: loading skeleton, error + retry, empty + CTA, success
- [ ] Responsive at 375px, 768px, 1024px, 1440px
- [ ] No TypeScript errors (`npm run typecheck`)
- [ ] No lint errors (`npm run lint`)
- [ ] Production build succeeds (`npm run build`)
- [ ] Works fully in mock mode with no console errors
- [ ] Checklist steps marked `[x]`
- [ ] Committed with format `F##, Step ## — Description`
