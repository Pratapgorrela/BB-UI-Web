# Module Map — Beauty Bus

## Feature Breakdown

| ID | Feature | Phase | Dependencies | Contract Sections | Key Deliverables | Acceptance Criteria |
|---|---|---|---|---|---|---|
| **F0** | Project Scaffold | Setup | None | None | Vite + React + TS app, Tailwind config with tokens, folder structure, apiClient, queryClient, router shell, env files, .gitignore | `npm run build` passes, folder structure matches architecture.md, mock toggle works |
| **F1** | Design System | Foundation | F0 | None | Full color scales in Tailwind, typography/spacing/radius/shadow/motion tokens, UI primitives (Button, Input, Card, Badge, Modal, Toast, Skeleton), DataState wrapper, `/dev/components` demo page | All tokens from design.md implemented, components render all variants, demo page shows every component |
| **F2** | App Shell & Navigation | Foundation | F1 | None | AppShell layout, BottomNav (mobile), TopNav (desktop), responsive switch at 768px, Container, PageHeader | Navigation switches correctly at breakpoint, all nav items render, active state works, shell wraps all pages |
| **F3** | Home / Landing | Core | F2 | Service Catalog | Hero section, popular services carousel/grid, category quick links, search bar, CTA to catalog | Page renders with mock data, all 4 data states, responsive, links navigate correctly |
| **F4** | Service Catalog | Core | F2 | Service Catalog | Category filter, search, service list with pagination, sorting, ServiceCard component, loading/error/empty states | Filter + search work, pagination works, all 4 states, responsive grid layout |
| **F5** | Service Details | Core | F4 | Service Catalog | Service detail page, image gallery, specialist list, pricing, duration, rating, "Book now" CTA | Detail page renders from mock, specialists listed, CTA navigates to booking (or login if unauthed) |
| **F6** | Auth | Core | F1 | Auth | Login page, registration page, auth Zustand store, token management, protected route wrapper, auth header injection in apiClient | Register → login → token stored → protected routes accessible, logout clears state, refresh flow works in mock |
| **F7** | Booking Flow | Core | F5, F6 | Availability & Booking, Profile & Addresses | 4-step stepper (Service → Date & Time → Address → Confirm), time slot calendar, address picker/form, booking summary, confirmation page | Full flow completes in mock mode, validation at each step, slot unavailable error handled, booking created with PENDING status |
| **F8** | My Bookings | Core | F7 | Availability & Booking | Upcoming/past bookings tabs, booking card, booking detail page, cancel flow (with 2h rule), reschedule flow | List renders with correct status badges, cancel works (and fails < 2h), reschedule works, all 4 states |
| **F9** | Profile & Addresses | Core | F6 | Profile & Addresses | Profile view/edit, address list, add/edit/delete address, default address toggle | Profile updates persist in mock, address CRUD works, delete blocked for upcoming booking address |
| **F10** | Reviews | Post-MVP | F8 | Reviews | Review form on completed booking, review list on service detail, star rating input | Review creation works, validation (completed bookings only, one per booking), reviews show on service detail |
| **F11** | Notifications | Post-MVP | F6 | Notifications | Notification list, unread count badge, mark-all-read | List renders with mock notifications, unread count shows, mark-all-read clears badge |
| **F12** | Polish & Hardening | Final | F8 | All | Accessibility audit, performance optimization, error boundaries, loading refinement, Playwright E2E tests | All a11y checklist items pass, Lighthouse score > 90, error boundaries catch crashes, E2E tests pass |

---

## Build-Order Dependency Graph

```
F0 (Scaffold)
│
▼
F1 (Design System)
│
▼
F2 (App Shell & Nav)
│
├──────────────┬──────────────┐
▼              ▼              ▼
F3 (Home)    F4 (Catalog)   F6 (Auth)
              │              │
              ▼              │
             F5 (Details)    │
              │              │
              └──────┬───────┘
                     ▼
               F7 (Booking Flow)
                     │
              ┌──────┼──────┐
              ▼      ▼      ▼
        F8 (My     F9      F11
        Bookings) (Profile) (Notifications)
              │
              ▼
        F10 (Reviews)
              │
              ▼
        F12 (Polish)
```

---

## Parallel Opportunity Groups

These features can be developed in parallel within each group (no inter-dependencies):

| Group | Features | Notes |
|---|---|---|
| **Group A** | F3 (Home), F4 (Catalog), F6 (Auth) | All depend only on F2. Can be built simultaneously. |
| **Group B** | F8 (My Bookings), F9 (Profile), F11 (Notifications) | All depend on F7 or F6. Can be built simultaneously after F7. |
| **Group C** | F10 (Reviews) | Depends on F8. Solo. |

---

## Critical Path

The longest dependency chain that determines minimum project duration:

```
F0 → F1 → F2 → F4 → F5 → F7 → F8 → F12
```

**F6 (Auth)** runs in parallel with F3/F4 but is a **gate for F7** — it must be complete before the booking flow can start.

---

## Suggested Solo Build Order

For a single developer working sequentially, this order maximizes momentum and minimizes context-switching:

| Order | Feature | Rationale |
|---|---|---|
| 1 | **F0** — Scaffold | Foundation — everything depends on this |
| 2 | **F1** — Design System | Tokens + primitives used by every subsequent feature |
| 3 | **F2** — App Shell & Nav | Layout wrapper for all pages |
| 4 | **F6** — Auth | Unblocks booking flow; auth store needed for protected routes |
| 5 | **F4** — Service Catalog | Core browsing experience |
| 6 | **F3** — Home | Landing page — uses catalog components, quick to build after F4 |
| 7 | **F5** — Service Details | Natural extension of catalog |
| 8 | **F7** — Booking Flow | Core booking — the heart of the app |
| 9 | **F9** — Profile & Addresses | Address management used by booking, profile is small |
| 10 | **F8** — My Bookings | Booking management — cancel, reschedule |
| 11 | **F10** — Reviews | Post-MVP, builds on completed bookings |
| 12 | **F11** — Notifications | Post-MVP, relatively isolated |
| 13 | **F12** — Polish & Hardening | Final pass — a11y, perf, E2E |

---

## Notes

- **F6 before F4**: Auth is recommended before catalog because the auth store and protected route wrapper are needed early, and the auth flow is self-contained. However, F4 can be built first if preferred — just ensure F6 is done before F7.
- **F3 after F4**: Home/Landing reuses `ServiceCard` and category components from F4, so building catalog first avoids duplication.
- **F9 before F8**: Address management is part of the booking flow (F7) and is useful to have fully fleshed out before building booking management.
