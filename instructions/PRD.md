# Product Requirements Document (PRD) — Beauty Bus

> **Version:** 1.0
> **Date:** 2026-06-11
> **Status:** Draft
> **Product:** Beauty Bus Web Application
> **Platform:** Web (Mobile-first, Responsive)

---

## 1. Executive Summary

Beauty Bus is a mobile-first web application that connects customers with a fully equipped mobile salon service. Users browse beauty services, view details and pricing, book appointments at their preferred time and location, and manage their bookings — all from a modern, intuitive interface. The mobile salon arrives at the customer's doorstep, delivering salon-quality treatments on their schedule.

The initial release is a **frontend-only MVP** powered by a contract-driven mock API layer, designed to be seamlessly connected to a real backend by flipping an environment flag.

---

## 2. Problem Statement

Traditional salon booking is inconvenient — customers must travel to a salon, wait for availability, and work around the salon's schedule. Existing booking platforms are often cluttered, unintuitive, and don't support the mobile-salon model where services come to the customer.

**Beauty Bus solves this by:**
- Bringing the salon to the customer's doorstep
- Providing an intuitive, mobile-first booking experience
- Allowing customers to browse, compare, and book services in under 2 minutes
- Giving customers full control over scheduling, location, and specialist selection

---

## 3. Target Users

### Primary Persona: The Busy Professional
- **Age:** 25–45
- **Behavior:** Values convenience, books services on mobile during commute or breaks
- **Pain point:** No time to visit a salon; wants quality service at home
- **Goal:** Book a beauty service in under 2 minutes, at a time and place that works for them

### Secondary Persona: The Home-Comfort Seeker
- **Age:** 30–55
- **Behavior:** Prefers home-based services for comfort and privacy
- **Pain point:** Dislikes salon waiting rooms and travel
- **Goal:** Browse options at leisure, pick a specialist, and have them come to the door

---

## 4. Product Scope

### 4.1 In Scope (MVP)

| Area | Description |
|---|---|
| Service Browsing | Browse service catalog by category, search, filter, sort, paginate |
| Service Details | View service info, pricing, duration, rating, specialist list, image gallery |
| User Authentication | Register, login, logout, JWT-based session management |
| Booking Flow | 4-step stepper: Service > Date & Time > Address > Confirm |
| Booking Management | View upcoming/past bookings, cancel (with 2h rule), reschedule |
| Profile Management | View/edit profile, manage saved addresses (CRUD) |
| Home / Landing Page | Hero section, popular services, category quick links, search |
| Design System | Full component library with design tokens, responsive primitives |
| App Shell | Responsive navigation — bottom nav (mobile), top nav (desktop) |

### 4.2 Post-MVP

| Area | Description |
|---|---|
| Reviews & Ratings | Submit reviews for completed bookings, view reviews on service detail |
| Notifications | In-app notification list, unread badge, mark-all-read |
| Online Payments | Payment integration (Stripe or equivalent) |
| Real-time Tracking | Live tracking of specialist en route |
| Push Notifications | Browser/native push for booking reminders |
| Loyalty Program | Points, rewards, repeat-customer incentives |
| AI Recommendations | Personalized service suggestions based on history |
| Multi-language | i18n support |

### 4.3 Out of Scope

- Backend/server development (mock layer simulates the API)
- Admin dashboard / specialist portal
- Native mobile apps (iOS/Android)
- Payment processing
- Real-time chat or messaging
- Dark mode (semantic tokens support future addition)

---

## 5. Feature Requirements

### F0 — Project Scaffold

**Priority:** P0 (Blocker)
**Dependencies:** None

| Requirement | Details |
|---|---|
| Scaffold | Vite + React 18 + TypeScript (strict) |
| Dependencies | React Router 6, React Query 5, Zustand, RHF + Zod, Axios, Lucide React, date-fns, Tailwind CSS, ESLint, Prettier, Vitest |
| Tailwind Config | Full design token system — colors (100-900 scales), typography, spacing, radii, shadows, z-index, breakpoints |
| Folder Structure | Feature-based: `src/features/`, `src/components/ui|common|layout/`, `src/mocks/`, `src/lib/`, `src/pages/`, `src/routes/` |
| Mock System | `apiClient` with `VITE_USE_MOCKS` toggle — seamless switch between mock and real API |
| Query Client | React Query client with sensible defaults (staleTime, retry, refetch) |
| Router | Shell routes with placeholder pages |
| Environment | `.env`, `.env.example`, `.gitignore` |

**Acceptance:** `npm run build` passes, folder structure matches architecture spec, mock toggle works.

---

### F1 — Design System

**Priority:** P0 (Blocker)
**Dependencies:** F0

| Requirement | Details |
|---|---|
| Color Tokens | Full 100-900 scales for Primary (purple #7430D9), Success (#28D439), Danger (#D42828), Info (#2963D6), Warning (#DE902A), Neutrals (purple-tinted) |
| Semantic Tokens | Surface tokens: `bg-app`, `bg-surface`, `fg-primary`, `fg-default`, `border-default`, `border-focus`, etc. |
| Typography | Poppins (headings), Inter (body), JetBrains Mono (prices/refs). Type scale from `display` (48px) to `caption` (12px) |
| Spacing | 4px base grid, tokens from 2px to 64px |
| Shadows | sm, md, lg, xl, focus, focus-error |
| Motion | fast (150ms), normal (250ms), slow (400ms), spring (500ms). Respects `prefers-reduced-motion` |
| Components | Button (5 variants, 3 sizes), Input (3 states), Card (3 variants), Badge/Chip (6 variants), Modal/BottomSheet, Toast (4 variants), Skeleton (4 shapes), Avatar (3 sizes), DataState wrapper |
| Demo Page | `/dev/components` — showcases all UI primitives with all variants |

**Acceptance:** All tokens from design spec implemented, components render all variants correctly, demo page accessible.

**Blocked:** Step 23 (design alignment) awaits designer's mobile flow designs.

---

### F2 — App Shell & Navigation

**Priority:** P0 (Blocker)
**Dependencies:** F1

| Requirement | Details |
|---|---|
| AppShell | Layout wrapper — manages navigation switching, page padding, scroll behavior |
| BottomNav | Mobile (<768px), 64px height, 4-5 items, active/inactive icon+label states |
| TopNav/Header | Desktop (>=768px), 64px height, logo, nav links, auth actions |
| Responsive Switch | Automatic navigation model swap at 768px breakpoint |
| Container | Max-width 1200px, responsive horizontal padding (16px / 24px / 32px) |
| PageHeader | Title, optional back button, optional action buttons |

**Acceptance:** Navigation switches correctly at 768px, all nav items render, active state highlights current route, shell wraps all pages.

---

### F3 — Home / Landing Page

**Priority:** P1 (Core)
**Dependencies:** F2, Service Catalog contract LOCKED

| Requirement | Details |
|---|---|
| Hero Section | Headline, subheading, primary CTA button, hero image/illustration |
| Popular Services | Carousel or responsive grid of ServiceCard components, sourced from mock data |
| Category Quick Links | Category icons/cards linking to the catalog filtered by that category |
| Search Bar | Search input that navigates to catalog page with search query as URL param |
| Data States | Loading skeletons, error + retry, empty + CTA, success |

**Acceptance:** Page renders with mock data, all 4 data states work, responsive at all breakpoints, links navigate correctly.

---

### F4 — Service Catalog

**Priority:** P1 (Core)
**Dependencies:** F2, Service Catalog contract LOCKED

| Requirement | Details |
|---|---|
| Types & Validation | `Service`, `ServiceCategory` types + Zod schemas matching contract |
| Mock Data | 12+ services, 4+ categories, pagination data, forced error triggers |
| API Layer | `fetchServices(filters)`, `fetchCategories()` via `apiClient` |
| Query Hooks | `useFetchServices`, `useFetchCategories` with query key factories |
| ServiceCard | Image (4:3 aspect), title, short description, price (mono font), rating, duration badge |
| Category Filter | Horizontal filter bar to filter services by category |
| Search & Sort | Text search + sort controls (price asc/desc, rating, name) |
| Pagination | Page-based pagination component with page numbers |
| Catalog Page | Composes filter + search + grid + pagination, all 4 data states, responsive |

**Acceptance:** Filtering, search, sort, and pagination all work. 4 data states render. Responsive grid (1-col mobile, multi-col desktop).

---

### F5 — Service Details

**Priority:** P1 (Core)
**Dependencies:** F4

| Requirement | Details |
|---|---|
| Service Detail Page | Full service info — image gallery, description, pricing, duration, rating, review count |
| Specialist List | Cards showing specialists who offer this service — avatar, name, rating, experience |
| Book Now CTA | Navigates to booking flow (or login page if unauthenticated) |
| Data States | Loading skeleton matching detail layout, error + retry, success |

**Acceptance:** Detail page renders from mock data, specialist list populates, CTA routes correctly based on auth state.

---

### F6 — Authentication

**Priority:** P1 (Core)
**Dependencies:** F1, Auth contract LOCKED

| Requirement | Details |
|---|---|
| Types & Validation | `User` type, auth request/response types + Zod schemas (email, password rules) |
| Mock Handlers | Register, login, refresh, logout, /me endpoints with realistic responses |
| Auth Store | Zustand `useAuthStore` — token, user, isAuthenticated, login/logout actions |
| API Client Auth | Inject `Authorization: Bearer <token>` header from store into all requests |
| Login Page | Email + password form with RHF + Zod validation, field-level errors |
| Register Page | Email + password + first name + last name + phone form |
| Protected Route | `ProtectedRoute` wrapper component — redirects to login if unauthenticated |
| Token Flow | Access token (15min) + refresh token (7-day). Auto-refresh on 401 |

**Acceptance:** Full register > login > token stored > protected routes accessible > logout clears state flow works in mock mode.

---

### F7 — Booking Flow

**Priority:** P1 (Core)
**Dependencies:** F5, F6, Availability & Booking contract LOCKED, Profile & Addresses contract LOCKED

| Requirement | Details |
|---|---|
| Booking Stepper | 4-step horizontal stepper: Service > Date & Time > Address > Confirm |
| Step 1 — Service | Pre-filled from service detail page, display service summary |
| Step 2 — Date & Time | Calendar date picker + time slot pills. Slots fetched per specialist + date. Available/selected/unavailable states |
| Step 3 — Address | Select from saved addresses or add new address (RHF + Zod form) |
| Step 4 — Confirm | Summary of all selections, optional notes field, submit button |
| Confirmation Page | Success message with booking reference code (e.g., `BB-20260611-A3F2`) |
| Booking Store | Zustand `useBookingStore` — draft booking state persists across stepper steps |
| Error Handling | SLOT_UNAVAILABLE (409) — show message, redirect to time picker |

**Acceptance:** Full flow completes in mock mode, validation at each step, slot unavailable error handled gracefully, booking created with PENDING status.

---

### F8 — My Bookings

**Priority:** P1 (Core)
**Dependencies:** F7

| Requirement | Details |
|---|---|
| Booking List | Upcoming and past tabs, sorted by date |
| BookingCard | Status badge (color-coded), service name, date, specialist name, reference code |
| Booking Detail | Full booking info with status-dependent action buttons |
| Cancel Flow | Confirmation modal, cancellation reason input. Business rule: blocked if < 2 hours before appointment (422 error) |
| Reschedule Flow | New time slot selection, updates booking |
| Data States | All 4 states for list and detail views |

**Acceptance:** List renders with correct status badges, cancel succeeds (and correctly fails within 2h window), reschedule works.

---

### F9 — Profile & Addresses

**Priority:** P1 (Core)
**Dependencies:** F6, Profile & Addresses contract LOCKED

| Requirement | Details |
|---|---|
| Profile Page | View and edit form (first name, last name, phone, avatar URL) with RHF + Zod |
| Address List | Display saved addresses with edit/delete actions, default address indicator |
| Address Form | Add/edit address form — label, street, apartment, city, state, zip, country |
| Delete Guard | Cannot delete address used by upcoming (PENDING/CONFIRMED) booking — show error message |
| Data States | All 4 states for profile and address views |

**Acceptance:** Profile updates persist in mock, address CRUD works, delete correctly blocked for addresses tied to upcoming bookings.

---

### F10 — Reviews (Post-MVP)

**Priority:** P2
**Dependencies:** F8, Reviews contract LOCKED

| Requirement | Details |
|---|---|
| Review Form | Star rating (1-5) + comment textarea, RHF + Zod validated |
| Review List | Paginated reviews on service detail page — user name, avatar, rating, comment, date |
| Review CTA | Appears on completed booking detail page |
| Business Rules | Only completed bookings can be reviewed. One review per booking (CONFLICT on duplicate) |

---

### F11 — Notifications (Post-MVP)

**Priority:** P2
**Dependencies:** F6, Notifications contract LOCKED

| Requirement | Details |
|---|---|
| Notification List | Paginated list — title, message, timestamp, read/unread state |
| Unread Badge | Count badge on nav icon, updates on mark-all-read |
| Mark All Read | Single action to mark all notifications as read |
| Notification Types | BOOKING_CONFIRMED, BOOKING_REMINDER, BOOKING_CANCELLED, REVIEW_REQUEST, PROMO |

---

### F12 — Polish & Hardening

**Priority:** P1
**Dependencies:** F8 (all core features complete)

| Requirement | Details |
|---|---|
| Accessibility Audit | All items from design.md a11y checklist — focus indicators, aria labels, keyboard nav, heading hierarchy, touch targets, reduced motion |
| Performance | Lighthouse score > 90. Lazy-load routes, optimize images, minimize bundle |
| Error Boundaries | React Error Boundary components with user-friendly fallback UI |
| Loading Refinement | All skeletons match final page layouts exactly |
| E2E Tests | Playwright tests for critical path: browse > service detail > book > manage booking |
| Final Review | All 123 checklist items verified, all 4 data states, responsive, mock mode fully functional |

---

## 6. Technical Architecture

### 6.1 Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| Framework | React 18 | Component-based UI |
| Language | TypeScript (strict) | Type safety, no `any` |
| Build | Vite | Fast dev server + production bundling |
| Styling | Tailwind CSS | Utility-first CSS with design tokens |
| Routing | React Router 6 | Client-side SPA routing |
| Server State | React Query 5 | Data fetching, caching, sync, pagination |
| Client State | Zustand | Auth session, booking draft, UI preferences |
| Forms | React Hook Form + Zod | Form management + runtime validation |
| HTTP | Axios | API requests via shared `apiClient` |
| Icons | Lucide React | Consistent icon library |
| Dates | date-fns | Date manipulation and formatting |
| Testing | Vitest + Testing Library + Playwright | Unit, component, integration, E2E |

### 6.2 Mock-First Architecture

The entire frontend is built against an in-repo mock API layer controlled by `VITE_USE_MOCKS`:

```
VITE_USE_MOCKS=true  --> Requests intercepted by mock handlers (in-repo)
VITE_USE_MOCKS=false --> Requests sent to VITE_API_BASE_URL (real backend)
```

Feature code is completely mock-unaware. The `apiClient` routes transparently based on environment. Mock handlers simulate realistic latency (300-600ms), pagination, and error scenarios.

### 6.3 API Contract

All API communication follows standardized response envelopes:

- **Success (single):** `{ success: true, data: {entity}, error: null }`
- **Success (paginated):** `{ success: true, data: [entities], pagination: {...}, error: null }`
- **Error:** `{ success: false, data: null, error: { code, message, timestamp, path, details } }`

Error codes: RESOURCE_NOT_FOUND (404), UNAUTHORIZED (401), FORBIDDEN (403), VALIDATION_ERROR (400), SLOT_UNAVAILABLE (409), BUSINESS_RULE_VIOLATION (422), CONFLICT (409), INTERNAL_ERROR (500).

### 6.4 State Management Boundaries

| Data Type | Technology | Rationale |
|---|---|---|
| Server data (services, bookings, profiles) | React Query | Cached, refetched, paginated |
| Auth session (token, user) | Zustand | Persists across navigation, drives auth headers |
| Booking draft (multi-step form) | Zustand | Survives step navigation |
| Form fields | React Hook Form | Scoped to form lifecycle |
| URL state (filters, search, page) | React Router searchParams | Shareable, bookmarkable |

---

## 7. Design Specifications

### 7.1 Brand Identity

| Element | Value |
|---|---|
| Primary Color | Purple `#7430D9` |
| Success | Green `#28D439` |
| Danger | Red `#D42828` |
| Info | Blue `#2963D6` |
| Warning | Amber `#DE902A` |
| Neutrals | Purple-tinted gray scale |
| Heading Font | Poppins (700/600 weight) |
| Body Font | Inter (400/500 weight) |
| Mono Font | JetBrains Mono (prices, reference codes) |

### 7.2 Responsive Strategy

| Breakpoint | Width | Navigation | Content Padding |
|---|---|---|---|
| Mobile | 0-767px | Bottom nav (64px) | 16px |
| Tablet | 768-1023px | Top nav (64px) | 24px |
| Desktop | 1024-1439px | Top nav (64px) | 32px |
| Wide | 1440px+ | Top nav (64px) | 32px |

Content max-width: 1200px. Mobile-first approach — default styles target mobile, use `md:`, `lg:`, `xl:` prefixes for larger screens.

### 7.3 Mandatory Data States

Every data-consuming component implements all four states:

| State | Implementation |
|---|---|
| Loading | Skeleton placeholders matching layout shape (`animate-pulse`) |
| Error | Error message (danger-600) + retry button |
| Empty | Friendly message + CTA guiding next action |
| Success | Actual data rendered in final layout |

### 7.4 Accessibility Requirements

- WCAG AA contrast ratios (4.5:1 text, 3:1 large text)
- Visible focus indicators on all interactive elements
- Minimum 44px touch targets
- Keyboard navigation for all flows
- `aria-describedby` for form errors
- Focus trapping in modals
- `aria-live` regions for status changes
- `prefers-reduced-motion` respected
- Logical heading hierarchy (h1 > h2 > h3, no skips)

---

## 8. User Flows

### 8.1 Service Discovery Flow

```
Landing Page
  |-> Browse popular services (carousel/grid)
  |-> Tap category quick link
  |-> Use search bar
       |
       v
Service Catalog Page
  |-> Filter by category
  |-> Search by name/description
  |-> Sort by price/rating/name
  |-> Paginate results
  |-> Tap a ServiceCard
       |
       v
Service Detail Page
  |-> View full details, gallery, pricing
  |-> View specialist options
  |-> Tap "Book now"
       |
       v
  [If authenticated] -> Booking Flow
  [If not authenticated] -> Login Page -> Booking Flow
```

### 8.2 Booking Flow

```
Step 1: Service (pre-filled)
  |-> Confirm selected service
       |
       v
Step 2: Date & Time
  |-> Select date from calendar
  |-> Select available time slot
       |
       v
Step 3: Address
  |-> Select saved address OR add new address
       |
       v
Step 4: Confirm
  |-> Review summary
  |-> Add optional notes
  |-> Submit booking
       |
       v
Booking Confirmation
  |-> Display reference code
  |-> Link to "My Bookings"
```

### 8.3 Booking Management Flow

```
My Bookings Page
  |-> Upcoming tab / Past tab
  |-> Tap booking card
       |
       v
Booking Detail Page
  |-> View full booking info
  |-> [If PENDING/CONFIRMED] Cancel button
  |     |-> Confirmation modal + reason
  |     |-> [If < 2h before appointment] Error: too late to cancel
  |-> [If CONFIRMED] Reschedule button
        |-> New time slot selection
        |-> Confirm reschedule
```

### 8.4 Authentication Flow

```
Register Page
  |-> Email + password + name + phone
  |-> Zod validation
  |-> Submit -> tokens stored in Zustand
       |
       v
Authenticated State
  |-> Protected routes accessible
  |-> Auth header injected in all API calls
  |-> Logout clears tokens + redirects to home
```

---

## 9. Booking Status Lifecycle

```
PENDING --> CONFIRMED --> IN_PROGRESS --> COMPLETED
  |              |
  v              v
CANCELLED    CANCELLED (only if > 2h before appointment)
```

| Transition | Trigger | Rule |
|---|---|---|
| -> PENDING | Customer creates booking | Initial status |
| PENDING -> CONFIRMED | System auto-confirms | Automatic in MVP |
| CONFIRMED -> IN_PROGRESS | Service begins | At scheduledAt time |
| IN_PROGRESS -> COMPLETED | Service ends | After duration elapsed |
| PENDING -> CANCELLED | Customer cancels | Allowed anytime |
| CONFIRMED -> CANCELLED | Customer cancels | Only if > 2h before scheduledAt |
| CONFIRMED -> CANCELLED (blocked) | Customer attempts cancel < 2h | Returns BUSINESS_RULE_VIOLATION (422) |

---

## 10. Non-Functional Requirements

### Performance
- Lighthouse score > 90 (performance, accessibility, best practices)
- First Contentful Paint < 1.5s
- Lazy-loaded routes for code splitting
- Optimized images and assets

### Security
- JWT-based authentication with token rotation
- No hardcoded secrets or credentials
- Input validation at all system boundaries (Zod)
- XSS prevention via React's default escaping
- CSRF protection via token-based auth (no cookies in MVP mock mode)

### Reliability
- Error boundaries catch and display user-friendly fallbacks
- Retry mechanisms on failed API calls
- Graceful degradation on network errors
- All 4 data states prevent blank screens

### Maintainability
- TypeScript strict mode, zero `any` types
- Feature-based folder structure with clear boundaries
- Centralized query key factories
- Design tokens only — no hardcoded values
- Components under 200 lines
- Contract-driven development ensures frontend/backend alignment

---

## 11. Build Order & Dependencies

### Critical Path

```
F0 -> F1 -> F2 -> F4 -> F5 -> F7 -> F8 -> F12
```

### Parallel Opportunity Groups

| Group | Features | Prerequisite |
|---|---|---|
| A (parallel) | F3 (Home), F4 (Catalog), F6 (Auth) | F2 complete |
| B (parallel) | F8 (My Bookings), F9 (Profile), F11 (Notifications) | F7 complete |
| C (solo) | F10 (Reviews) | F8 complete |

### Recommended Solo Build Order

1. F0 — Scaffold
2. F1 — Design System
3. F2 — App Shell & Navigation
4. F6 — Authentication
5. F4 — Service Catalog
6. F3 — Home / Landing
7. F5 — Service Details
8. F7 — Booking Flow
9. F9 — Profile & Addresses
10. F8 — My Bookings
11. F10 — Reviews (Post-MVP)
12. F11 — Notifications (Post-MVP)
13. F12 — Polish & Hardening

---

## 12. Success Metrics

| Metric | Target | How to Measure |
|---|---|---|
| Booking completion rate | > 70% of users who start booking complete it | Analytics on stepper step completion |
| Time to book | < 2 minutes from landing to confirmation | Session timing analytics |
| Lighthouse performance | > 90 | Lighthouse audit |
| Lighthouse accessibility | > 90 | Lighthouse audit |
| Zero console errors | 0 errors in production | Browser DevTools monitoring |
| Mock mode parity | 100% feature coverage | All features functional with VITE_USE_MOCKS=true |
| Responsive coverage | 4 breakpoints verified | Manual + E2E testing at 375px, 768px, 1024px, 1440px |

---

## 13. Risks & Mitigations

| Risk | Impact | Likelihood | Mitigation |
|---|---|---|---|
| Designer's mobile flows change approved tokens | Design rework in F1 | Medium | Semantic token layer absorbs changes; only Tailwind config needs updating |
| Real backend API deviates from contract | Mock/real mismatch | Medium | Contract-driven development with locked sections; Zod validation catches drift |
| Scope creep into post-MVP features | Timeline slip | High | Clear MVP/Post-MVP boundary in this PRD; post-MVP features are gated |
| Complex booking flow UX issues | User drop-off | Medium | Stepper pattern with validation per step; progress indicator; back navigation |
| Performance degradation with mock data | False confidence | Low | Realistic mock latency (300-600ms); Lighthouse audits in F12 |

---

## 14. Open Questions & Pending Inputs

| Item | Status | Impact |
|---|---|---|
| Designer's mobile flow designs | Waiting | Blocks F1 Step 23 (design alignment). All other work proceeds with approved starting-point tokens |
| Payment integration provider | Not decided | Post-MVP. No impact on current scope |
| Push notification strategy | Not decided | Post-MVP |
| Real backend API timeline | Unknown | Frontend proceeds independently with mock layer |
| Multi-language requirements | Not scoped | Post-MVP |

---

## 15. Glossary

| Term | Definition |
|---|---|
| Beauty Bus | The mobile salon vehicle and the brand name |
| Service | A beauty treatment offered (e.g., "Balayage", "Manicure") |
| Specialist | A beauty professional who performs services |
| Time Slot | An available appointment window for a specialist on a given date |
| Booking | A confirmed appointment linking a customer, service, specialist, time slot, and address |
| Reference Code | A human-readable booking identifier (e.g., `BB-20260611-A3F2`) |
| Mock Mode | Development mode where API calls are intercepted by in-repo mock handlers |
| Contract | The canonical API specification that both mock layer and real backend implement |
| Vertical Slice | Building a feature end-to-end: types > validation > mocks > API > hooks > UI > forms > states > responsive |
| Design Tokens | Named values (colors, spacing, shadows) used instead of hardcoded CSS values |
| DataState | The 4 mandatory states every data-consuming component implements: loading, error, empty, success |

---

## Appendix A — API Endpoint Summary

### Public (No Auth)

| Method | Endpoint | Feature |
|---|---|---|
| POST | `/api/v1/auth/register` | F6 |
| POST | `/api/v1/auth/login` | F6 |
| POST | `/api/v1/auth/refresh` | F6 |
| GET | `/api/v1/categories` | F3, F4 |
| GET | `/api/v1/services` | F3, F4 |
| GET | `/api/v1/services/:id` | F5 |
| GET | `/api/v1/specialists` | F5 |
| GET | `/api/v1/specialists/:id` | F5 |
| GET | `/api/v1/time-slots` | F7 |
| GET | `/api/v1/services/:id/reviews` | F10 |

### Authenticated

| Method | Endpoint | Feature |
|---|---|---|
| POST | `/api/v1/auth/logout` | F6 |
| GET | `/api/v1/auth/me` | F6 |
| POST | `/api/v1/bookings` | F7 |
| GET | `/api/v1/bookings` | F8 |
| GET | `/api/v1/bookings/:id` | F8 |
| PATCH | `/api/v1/bookings/:id/reschedule` | F8 |
| PATCH | `/api/v1/bookings/:id/cancel` | F8 |
| GET | `/api/v1/profile` | F9 |
| PATCH | `/api/v1/profile` | F9 |
| GET | `/api/v1/addresses` | F7, F9 |
| POST | `/api/v1/addresses` | F7, F9 |
| PATCH | `/api/v1/addresses/:id` | F9 |
| DELETE | `/api/v1/addresses/:id` | F9 |
| POST | `/api/v1/reviews` | F10 |
| GET | `/api/v1/notifications` | F11 |
| PATCH | `/api/v1/notifications/mark-all-read` | F11 |

---

## Appendix B — Entity Relationship Map

```
User
 |-- has many --> Address
 |-- has many --> Booking
 |-- has many --> Review
 |-- has many --> Notification

ServiceCategory
 |-- has many --> Service

Service
 |-- belongs to --> ServiceCategory
 |-- has many --> Specialist (via serviceIds)
 |-- has many --> Review
 |-- has many --> Booking

Specialist
 |-- offers many --> Service (via serviceIds)
 |-- has many --> TimeSlot
 |-- has many --> Booking

Booking
 |-- belongs to --> User
 |-- belongs to --> Service
 |-- belongs to --> Specialist
 |-- belongs to --> Address
 |-- has one --> Review (optional)

TimeSlot
 |-- belongs to --> Specialist
```
