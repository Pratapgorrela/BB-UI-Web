# Progress Checklist — Beauty Bus

> This file is the session-surviving progress tracker. Update it after every completed step. Commit it with every feature commit.

---

## Status Legend

| Symbol | Meaning |
|---|---|
| `[ ]` | Not started |
| `[~]` | In progress |
| `[B]` | Blocked (see notes) |
| `[R]` | Needs review |
| `[x]` | Complete |

---

## Pending Inputs From Developer

| Input | Description | Status | Notes |
|---|---|---|---|
| Mobile flow designs | Designer's completed mobile flow designs — visual source of truth for UI | **Waiting** | To be shared after project setup (F0). Will trigger F1 design alignment task. |

---

## Contract Section Status

| Section | Status | Locked Date | Consuming Features |
|---|---|---|---|
| Auth | `DRAFT` | — | F6 |
| Service Catalog | `DRAFT` | — | F3, F4, F5 |
| Availability & Booking | `DRAFT` | — | F7, F8 |
| Profile & Addresses | `DRAFT` | — | F9 |
| Reviews | `DRAFT` | — | F10 |
| Notifications | `DRAFT` | — | F11 |

---

## F0 — Project Scaffold

| Step | Task | Status |
|---|---|---|
| 01 | Scaffold Vite + React + TypeScript app | `[ ]` |
| 02 | Install all dependencies (React Router, React Query, Zustand, RHF, Zod, Axios, Lucide, date-fns, Tailwind, ESLint, Prettier, Vitest) | `[ ]` |
| 03 | Configure Tailwind with design tokens (colors, typography, spacing, radii, shadows, z-index, breakpoints) | `[ ]` |
| 04 | Create folder structure from architecture.md | `[ ]` |
| 05 | Create apiClient with VITE_USE_MOCKS toggle | `[ ]` |
| 06 | Create queryClient with defaults | `[ ]` |
| 07 | Create router shell with placeholder routes | `[ ]` |
| 08 | Create .env, .env.example, .gitignore | `[ ]` |
| 09 | Verify npm run build passes | `[ ]` |
| 10 | Initial commit: F0, Step 10 — Project scaffold complete | `[ ]` |

---

## F1 — Design System

| Step | Task | Status |
|---|---|---|
| 11 | Tokenize full 100–900 color scales (primary, success, danger, info, warning, neutrals) + semantic surface tokens in Tailwind config | `[ ]` |
| 12 | Implement typography tokens (font families, type scale, weights) + spacing, radii, shadows, z-index, motion tokens in Tailwind config | `[ ]` |
| 13 | Build Button component (all variants: primary, secondary, outline, ghost, danger; sizes: sm, md, lg; states: default, hover, focus, disabled, loading) | `[ ]` |
| 14 | Build Input component (variants: default, error, disabled; with label, helper text, error message) | `[ ]` |
| 15 | Build Card component (variants: default, raised, interactive) | `[ ]` |
| 16 | Build Badge/Chip component (variants: default, primary, success, warning, danger, info) | `[ ]` |
| 17 | Build Modal/BottomSheet component (mobile: bottom sheet; desktop: centered modal; focus trap, backdrop) | `[ ]` |
| 18 | Build Toast/notification component (variants: success, error, info, warning; auto-dismiss, swipe-to-dismiss) | `[ ]` |
| 19 | Build Skeleton component (for loading states — line, circle, card, rectangle variants) | `[ ]` |
| 20 | Build Avatar component (sizes: sm, md, lg; image + initials fallback) | `[ ]` |
| 21 | Build DataState wrapper component (handles loading/error/empty/success states declaratively) | `[ ]` |
| 22 | Create /dev/components demo page showing all UI primitives with all variants | `[ ]` |
| 23 | Complete design system: align with designer's mobile flows — verify colors/fonts/layouts against the shared flows, update design.md + Tailwind tokens, fix component drift | `[B]` |

> **Step 23 is BLOCKED** — waiting for designer's mobile flow designs to be shared.

---

## F2 — App Shell & Navigation

| Step | Task | Status |
|---|---|---|
| 24 | Build AppShell layout component (wraps pages, handles nav switching) | `[ ]` |
| 25 | Build BottomNav component (mobile, 64px, active/inactive states, 4–5 items) | `[ ]` |
| 26 | Build TopNav/Header component (desktop, 64px, logo, nav links, auth actions) | `[ ]` |
| 27 | Implement responsive nav switching at 768px breakpoint | `[ ]` |
| 28 | Build Container component (max-width 1200px, responsive padding) | `[ ]` |
| 29 | Build PageHeader component (title, optional back button, optional actions) | `[ ]` |
| 30 | Integrate shell with router — all pages wrapped in AppShell | `[ ]` |

---

## F3 — Home / Landing

| Step | Task | Status |
|---|---|---|
| 31 | Lock Service Catalog contract section (if not already locked for F4) | `[ ]` |
| 32 | Intel Report for F3 — wait for approval | `[ ]` |
| 33 | Build Hero section (headline, subheading, CTA button, hero image/illustration) | `[ ]` |
| 34 | Build popular services section (carousel or grid of ServiceCards, mock data) | `[ ]` |
| 35 | Build category quick links section (category icons/cards linking to catalog) | `[ ]` |
| 36 | Build search bar component (navigates to catalog with search query) | `[ ]` |
| 37 | Compose HomePage with all sections, 4 data states, responsive layout | `[ ]` |

---

## F4 — Service Catalog

| Step | Task | Status |
|---|---|---|
| 38 | Lock Service Catalog contract section | `[ ]` |
| 39 | Intel Report for F4 — wait for approval | `[ ]` |
| 40 | Create Service, ServiceCategory types + Zod schemas | `[ ]` |
| 41 | Create mock data (12+ services, 4+ categories, pagination data) + mock handlers | `[ ]` |
| 42 | Create API layer functions (fetchServices, fetchCategories) | `[ ]` |
| 43 | Create React Query hooks (useFetchServices, useFetchCategories) with query keys | `[ ]` |
| 44 | Build ServiceCard component | `[ ]` |
| 45 | Build category filter bar | `[ ]` |
| 46 | Build search + sort controls | `[ ]` |
| 47 | Build pagination component | `[ ]` |
| 48 | Compose ServiceCatalogPage — filter, search, grid, pagination, 4 data states, responsive | `[ ]` |

---

## F5 — Service Details

| Step | Task | Status |
|---|---|---|
| 49 | Intel Report for F5 — wait for approval | `[ ]` |
| 50 | Create Specialist type + Zod schema | `[ ]` |
| 51 | Create mock data for specialists + mock handlers for service detail & specialist list | `[ ]` |
| 52 | Create API layer (fetchService, fetchSpecialists) + hooks | `[ ]` |
| 53 | Build service detail page (image gallery, description, pricing, duration, rating) | `[ ]` |
| 54 | Build specialist list/card for service detail | `[ ]` |
| 55 | Add "Book now" CTA (links to booking flow or login if unauthed) | `[ ]` |
| 56 | 4 data states + responsive layout for service detail page | `[ ]` |

---

## F6 — Auth

| Step | Task | Status |
|---|---|---|
| 57 | Lock Auth contract section | `[ ]` |
| 58 | Intel Report for F6 — wait for approval | `[ ]` |
| 59 | Create User type, auth request/response types + Zod schemas | `[ ]` |
| 60 | Create mock data (test users) + mock handlers (register, login, refresh, logout, me) | `[ ]` |
| 61 | Create auth API layer functions | `[ ]` |
| 62 | Create useAuthStore (Zustand — token, user, isAuthenticated, login/logout actions) | `[ ]` |
| 63 | Inject auth header into apiClient from store | `[ ]` |
| 64 | Build LoginPage with form (RHF + Zod) | `[ ]` |
| 65 | Build RegisterPage with form (RHF + Zod) | `[ ]` |
| 66 | Build ProtectedRoute wrapper component | `[ ]` |
| 67 | Wire auth pages into router, test full flow in mock mode | `[ ]` |

---

## F7 — Booking Flow

| Step | Task | Status |
|---|---|---|
| 68 | Lock Availability & Booking contract section | `[ ]` |
| 69 | Lock Profile & Addresses contract section (for address selection) | `[ ]` |
| 70 | Intel Report for F7 — wait for approval | `[ ]` |
| 71 | Create TimeSlot, Booking, Address types + Zod schemas | `[ ]` |
| 72 | Create mock data (time slots, addresses) + mock handlers (slot query, booking create) | `[ ]` |
| 73 | Create booking API layer + React Query hooks | `[ ]` |
| 74 | Create useBookingStore (Zustand — draft booking state across stepper steps) | `[ ]` |
| 75 | Build BookingStepper component (4 steps: Service → Date & Time → Address → Confirm) | `[ ]` |
| 76 | Build Step 1 — Service selection (pre-filled from detail page) | `[ ]` |
| 77 | Build Step 2 — Date & Time (calendar + time slot pills) | `[ ]` |
| 78 | Build Step 3 — Address (select existing or add new, RHF + Zod) | `[ ]` |
| 79 | Build Step 4 — Confirm (summary, notes field, submit) | `[ ]` |
| 80 | Build BookingConfirmationPage (success with reference code) | `[ ]` |
| 81 | Handle SLOT_UNAVAILABLE error (409) — show message, redirect to time picker | `[ ]` |
| 82 | 4 data states + responsive for all booking pages | `[ ]` |

---

## F8 — My Bookings

| Step | Task | Status |
|---|---|---|
| 83 | Intel Report for F8 — wait for approval | `[ ]` |
| 84 | Create mock data (bookings in all statuses) + mock handlers (list, detail, cancel, reschedule) | `[ ]` |
| 85 | Create booking list/detail API layer + hooks | `[ ]` |
| 86 | Build BookingCard component (status badge, service name, date, specialist) | `[ ]` |
| 87 | Build MyBookingsPage with upcoming/past tabs | `[ ]` |
| 88 | Build BookingDetailPage (full info, actions based on status) | `[ ]` |
| 89 | Build cancel flow (confirmation modal, 2h business rule, reason input) | `[ ]` |
| 90 | Build reschedule flow (new time slot selection) | `[ ]` |
| 91 | 4 data states + responsive for all booking management pages | `[ ]` |

---

## F9 — Profile & Addresses

| Step | Task | Status |
|---|---|---|
| 92 | Intel Report for F9 — wait for approval | `[ ]` |
| 93 | Create mock data (addresses) + mock handlers (profile CRUD, address CRUD) | `[ ]` |
| 94 | Create profile/address API layer + hooks | `[ ]` |
| 95 | Build ProfilePage (view + edit form with RHF + Zod) | `[ ]` |
| 96 | Build AddressList component | `[ ]` |
| 97 | Build AddressForm component (add/edit, RHF + Zod) | `[ ]` |
| 98 | Handle delete-blocked-by-upcoming-booking error | `[ ]` |
| 99 | 4 data states + responsive for profile pages | `[ ]` |

---

## F10 — Reviews (Post-MVP)

| Step | Task | Status |
|---|---|---|
| 100 | Lock Reviews contract section | `[ ]` |
| 101 | Intel Report for F10 — wait for approval | `[ ]` |
| 102 | Create Review type + Zod schema | `[ ]` |
| 103 | Create mock data + mock handlers (create review, list reviews) | `[ ]` |
| 104 | Create review API layer + hooks | `[ ]` |
| 105 | Build ReviewForm component (star rating, comment, RHF + Zod) | `[ ]` |
| 106 | Build ReviewList component (for service detail page) | `[ ]` |
| 107 | Integrate review CTA on completed booking detail | `[ ]` |
| 108 | 4 data states + responsive | `[ ]` |

---

## F11 — Notifications (Post-MVP)

| Step | Task | Status |
|---|---|---|
| 109 | Lock Notifications contract section | `[ ]` |
| 110 | Intel Report for F11 — wait for approval | `[ ]` |
| 111 | Create Notification type + Zod schema | `[ ]` |
| 112 | Create mock data + mock handlers (list, mark-all-read) | `[ ]` |
| 113 | Create notification API layer + hooks | `[ ]` |
| 114 | Build NotificationList component | `[ ]` |
| 115 | Build unread count badge (integrate into nav) | `[ ]` |
| 116 | Build mark-all-read action | `[ ]` |
| 117 | 4 data states + responsive | `[ ]` |

---

## F12 — Polish & Hardening

| Step | Task | Status |
|---|---|---|
| 118 | Accessibility audit — verify all a11y checklist items from design.md | `[ ]` |
| 119 | Performance audit — Lighthouse > 90, lazy load routes, optimize images | `[ ]` |
| 120 | Add Error Boundary components with fallback UI | `[ ]` |
| 121 | Refine all loading skeletons to match final layouts | `[ ]` |
| 122 | Write Playwright E2E tests for critical paths (browse → detail → book → manage) | `[ ]` |
| 123 | Final pre-launch review — all checklist items verified, all 4 states, responsive, mock mode | `[ ]` |

---

## Progress Summary

| Feature | Steps | Completed | Status |
|---|---|---|---|
| F0 — Scaffold | 10 | 0 | `[ ]` Not started |
| F1 — Design System | 13 | 0 | `[ ]` Not started |
| F2 — App Shell | 7 | 0 | `[ ]` Not started |
| F3 — Home | 7 | 0 | `[ ]` Not started |
| F4 — Catalog | 11 | 0 | `[ ]` Not started |
| F5 — Details | 8 | 0 | `[ ]` Not started |
| F6 — Auth | 11 | 0 | `[ ]` Not started |
| F7 — Booking | 15 | 0 | `[ ]` Not started |
| F8 — My Bookings | 9 | 0 | `[ ]` Not started |
| F9 — Profile | 8 | 0 | `[ ]` Not started |
| F10 — Reviews | 9 | 0 | `[ ]` Not started |
| F11 — Notifications | 9 | 0 | `[ ]` Not started |
| F12 — Polish | 6 | 0 | `[ ]` Not started |
| **TOTAL** | **123** | **0** | **0%** |

---

## Merge Log

| Date | Branch | Feature | Steps | Merged By |
|---|---|---|---|---|
| — | — | — | — | — |

---

## Conflict Resolution Rules

1. **Checklist entries**: keep ALL entries from both branches — never delete another feature's progress markers.
2. **Mock seed data**: merge data from both branches, deduplicate by `id`.
3. **Component files**: review both changes, combine functionality logically.
4. **Never force-push**: no `git push --force` or `git push -f` under any circumstances.
5. **Re-verify after resolving**: always re-run `npm run typecheck && npm run lint && npm run build` after resolving conflicts.
