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
| Mobile flow designs | Designer's completed mobile flow designs — visual source of truth for UI | **Received** | Figma file shared 2026-06-28. File: Focus-Cube (AoZfqfioGoGq7LpMKghUOq), Page-3 node 184:5. 40+ screens analyzed. |
| Login/Signup designs | Login & registration screen designs — not present in Figma file | **Resolved** | Designed in-app from brand guidelines (F6, 2026-07-12). Replace later if designer provides screens. |

---

## Contract Section Status

| Section | Status | Locked Date | Consuming Features |
|---|---|---|---|
| Auth | `LOCKED` | 2026-07-12 | F6 |
| Service Catalog | `LOCKED` | 2026-07-13 | F3, F4, F5 |
| Availability & Booking | `DRAFT` | — | F7, F8 |
| Profile & Addresses | `DRAFT` | — | F9 |
| Reviews | `DRAFT` | — | F10 |
| Notifications & Alerts | `DRAFT` | — | F11 |
| Cart & Checkout | `DRAFT` | — | F13 |
| Help & Support | `DRAFT` | — | F16 |

---

## Figma Screen Index

> Reference for all screens in the Figma file. Node IDs for quick lookup.

| Screen | Node ID | Feature |
|---|---|---|
| Home | 184:5606 | F3 |
| Services (category grid) | 184:4383 | F4 |
| Men Services (category detail) | 184:4508 | F4/F5 |
| Men Services (scrolled) | 184:4677 | F4/F5 |
| Hair Services | 184:5048 | F4/F5 |
| Combo Services | 184:5403, 184:5444 | F5 |
| Single Services | 184:5505 | F5 |
| Sub Services (service detail) | 184:5543 | F5 |
| Your Cart | 184:5132 | F13 |
| Cart Checkout | 184:5260 | F13 |
| Search | 184:7965 | F14 |
| Bookings — Upcoming tab | 184:6514 | F8 |
| Bookings — Past tab | 184:6576 | F8 |
| Bookings — Cancelled tab | 184:6642 | F8 |
| Booking Detail (active) | 184:6700 | F8 |
| Booking Detail (completed) | 184:6764 | F8 |
| My Bookings (from profile) | 184:6836, 184:7151 | F8 |
| Track Van | 184:6819 | F15 |
| Payment Summary | 184:6900, 184:6934 | F13 |
| Alerts (feed) | 184:6968 | F11 |
| Profile | 184:7051 | F9 |
| Saved Addresses | 184:7185, 184:7228, 184:7281 | F9 |
| Notification Settings | 184:7351 | F11 |
| Help & Support | 184:7440 | F16 |
| Call Support | 184:7526 | F16 |
| Raise a Concern | 184:7537 | F16 |
| Your Support Requests | 184:7567 | F16 |
| Success/Failure states | 184:7597, 184:7607 | F16 |
| Terms, Privacy & Policies | 184:7615 | F17 |
| Color palette swatches | 184:6310–184:6490 | F1 |
| Component variants | 184:5601, 184:6497, 184:7659, 184:7758, 184:7783 | F1 |
| Enable/Disable states | 184:6246, 184:6275 | F1 |

---

## F0 — Project Scaffold

| Step | Task | Status |
|---|---|---|
| 01 | Scaffold Vite + React + TypeScript app | `[x]` |
| 02 | Install all dependencies (React Router, React Query, Zustand, RHF, Zod, Axios, Lucide, date-fns, Tailwind, ESLint, Prettier, Vitest) | `[x]` |
| 03 | Configure Tailwind with design tokens (colors, typography, spacing, radii, shadows, z-index, breakpoints) | `[x]` |
| 04 | Create folder structure from architecture.md | `[x]` |
| 05 | Create apiClient with VITE_USE_MOCKS toggle | `[x]` |
| 06 | Create queryClient with defaults | `[x]` |
| 07 | Create router shell with placeholder routes | `[x]` |
| 08 | Create .env, .env.example, .gitignore | `[x]` |
| 09 | Verify npm run build passes | `[x]` |
| 10 | Initial commit: F0, Step 10 — Project scaffold complete | `[x]` |

---

## F1 — Design System

| Step | Task | Status |
|---|---|---|
| 11 | Align Tailwind tokens with Figma — verify color scales, typography, spacing match designer's flows; update design.md + index.css | `[x]` |
| 12 | Implement typography tokens (font families, type scale, weights) + spacing, radii, shadows, z-index, motion tokens in Tailwind config | `[x]` |
| 13 | Build Button component (all variants: primary, secondary, outline, ghost, danger; sizes: sm, md, lg; states: default, hover, focus, disabled, loading) | `[x]` |
| 14 | Build Input component (variants: default, error, disabled; with label, helper text, error message) + Select/Dropdown + Textarea | `[x]` |
| 15 | Build Card component (variants: default, raised, interactive) | `[x]` |
| 16 | Build Badge/Chip component (variants: default, primary, success, warning, danger, info) + discount badge ("20% OFF") | `[x]` |
| 17 | Build Modal/BottomSheet component (mobile: bottom sheet; desktop: centered modal; focus trap, backdrop) | `[x]` |
| 18 | Build Toast/notification component (variants: success, error, info, warning; auto-dismiss, swipe-to-dismiss) | `[x]` |
| 19 | Build Skeleton component (for loading states — line, circle, card, rectangle variants) | `[x]` |
| 20 | Build Avatar component (sizes: sm, md, lg; image + initials fallback on primary-100/primary-700) | `[x]` |
| 21 | Build DataState wrapper component (handles loading/error/empty/success states declaratively) | `[x]` |
| 22 | Build Toggle/Switch component (on/off states, purple active color — per Figma notification settings) | `[x]` |
| 23 | Build FAQ Accordion component (expand/collapse, chevron icon — per Figma Help & Support) | `[x]` |
| 24a | Build StickyBottomBar component (cart icon + price + "Continue" CTA — per Figma cart/service detail) | `[x]` |
| 24b | Create /dev/components demo page showing all UI primitives with all variants | `[x]` |

> **Step 11** — Figma designs received 2026-06-28. Ready to align tokens.

---

## F2 — App Shell & Navigation

| Step | Task | Status |
|---|---|---|
| 25 | Build AppShell layout component (wraps pages, handles nav switching) | `[x]` |
| 26 | Build BottomNav component (mobile, 64px, 5 items: Home, Services, Bookings, Alerts, Profile — per Figma) | `[x]` |
| 27 | Build TopNav/Header component (desktop, 64px, logo, nav links, auth actions) | `[x]` |
| 28 | Implement responsive nav switching at 768px breakpoint | `[x]` |
| 29 | Build Container component (max-width 1200px, responsive padding) | `[x]` |
| 30 | Build PageHeader component (← back arrow + title — per Figma pattern) | `[x]` |
| 31 | Integrate shell with router — all pages wrapped in AppShell | `[x]` |

> **F2 complete (2026-07-12).** Verified at 375/768/1024/1440px with 30 automated browser checks — responsive nav switch at 768px, active-tab highlighting on nested routes, a11y (aria-current, focus rings, 44px targets), zero console errors. Auth pages render without nav via route `handle: { hideNav }`; `/dev/components` opts out via `fullBleed`. Also fixed a latent Tailwind v4 token bug (`z-sticky` was a no-op; project z tokens are `--z-*`, so utilities must use `z-(--z-sticky)`).

---

## F3 — Home / Landing

| Step | Task | Status |
|---|---|---|
| 32 | Lock Service Catalog contract section (if not already locked for F4) | `[ ]` |
| 33 | Intel Report for F3 — wait for approval | `[ ]` |
| 34 | Build greeting header section ("Hello" + address selector + cart icon with badge — per Figma) | `[ ]` |
| 35 | Build search bar component (navigates to search page) | `[ ]` |
| 36 | Build category grid section (Men, Women, Kids, Seniors, Bride, Groom — 2-col grid with purple gradient cards + images — per Figma) | `[ ]` |
| 37 | Build "Popular Combos" section (horizontal scroll cards — per Figma) | `[ ]` |
| 38 | Build "Offers for You" section (promo cards carousel — per Figma) | `[ ]` |
| 39 | Build testimonials section ("What Our Customers Say" — review cards with avatar, stars, quote — per Figma) | `[ ]` |
| 40 | Build referral section ("Share the Beauty, Get Rewarded" — CTA card — per Figma) | `[ ]` |
| 41 | Build floating Support button (green FAB — per Figma) | `[ ]` |
| 42 | Compose HomePage with all sections, 4 data states, responsive layout | `[ ]` |

---

## F4 — Service Catalog

| Step | Task | Status |
|---|---|---|
| 43 | Lock Service Catalog contract section | `[x]` |
| 44 | Intel Report for F4 — wait for approval | `[x]` |
| 45 | Create Service, ServiceCategory types + Zod schemas | `[x]` |
| 46 | Create mock data (12+ services, 6 categories: Men/Women/Kids/Seniors/Bride/Groom, combo + single services) + mock handlers | `[x]` |
| 47 | Create API layer functions (fetchServices, fetchCategories) | `[x]` |
| 48 | Create React Query hooks (useFetchServices, useFetchCategories) with query keys | `[x]` |
| 49 | Build ServiceCard component (image + name + description + price + "+" add button — per Figma) | `[x]` |
| 50 | Build CategoryDetailPage (hero image, category name/description, Combos section, Single Services section — per Figma Men Services) | `[x]` |
| 51 | Build category filter bar | `[x]` |
| 52 | Build search + sort controls | `[x]` |
| 53 | Compose ServiceCatalogPage — category grid, filter, search, 4 data states, responsive | `[x]` |

> **F4 complete (2026-07-13).** Contract amended to the Figma combo model before locking (`type` COMBO/SINGLE, `originalPrice`/`discountPercent`/`includedServiceIds`, `heroImageUrl`, `type` query param, INR). 34 seed services across 6 categories (Seniors deliberately has no combos → exercises the empty Combos section). New route `/categories/:slug` → CategoryDetailPage; `/services/:id` stays reserved for F5. ServiceCard "+" shows a "Cart is coming soon" toast — real cart lands in F13. **Fixed a latent mockEngine bug**: the axios adapter ignored `config.params`, so any GET with query params (all catalog filters) would have silently returned unfiltered data; also added a `paginated()` envelope helper. Verified: typecheck + build clean; 17 Vitest integration tests through the real mock adapter (envelopes, pagination math, all filters, sorting, FORCE_500, validation errors, seed↔schema integrity); **37/37 automated browser checks** (scratchpad Playwright harness) covering skeletons, 4 data states, chip/search/sort/pagination with URL params, cart toast, Men/Seniors/unknown-slug detail pages, grid columns 1→2→3→4 and zero horizontal overflow at 375/768/1024/1440px, zero console errors on happy paths + `[Catalog]`-prefixed error logging on failure. **Caveat**: `npm run lint` fails repo-wide (pre-existing — ESLint 10 flat config never created; needs `typescript-eslint`, blocked on package approval per Rule 10).

> **F4 design revision (2026-07-13, post-review).** User compared `/services` against Figma 184:4383 and supplied the final card artwork as `public/{Kids,Seniors,Men,Women,Bride,Groom}.png` (182×157). Page recomposed **Figma-exact**: header "Our Services" + subtitle + 6 image cards with centered labels *below* the card; category seeds now point at the local PNGs. The on-page "All services" browser (chips, search, sort, paginated list) was removed per user decision — `CategoryFilterBar`/`CatalogControls`/`CatalogPagination` stay exported from the feature barrel for F14 Search (step 143 reuse). Services are browsed via category detail pages. Re-verified: typecheck/build clean, 17/17 Vitest, **20/20 browser checks** (Figma copy/order/assets, labels below images, browsing UI absent, detail-page click-through, 2/3/6 grid columns + zero overflow at 375/768/1440). Note: PNGs are 1× — consider re-exporting at 2× for high-DPI phones (same filenames, no code change). Also reduced the category card corner radius to 12px (`rounded-lg`) per user request.

> **F4 category-detail revision (2026-07-13).** User supplied the Figma "Men Services" target; `/categories/:slug` recomposed to an **immersive** layout (user decisions: keep picsum placeholder imagery for now; hide nav). Route now carries `handle: { hideNav: true, fullBleed: true }`. [CategoryDetailPage](../src/pages/CategoryDetailPage.tsx) = full-bleed hero (`heroImageUrl` + gradient scrim + faded category-name watermark + floating white back button → `/services`) over a rounded content sheet (`-mt-6 rounded-t-3xl`) with `<h1>` + subtitle, then **Combos** and **Single services** as horizontal list rows. New [`ServiceListItem`](../src/features/service-catalog/components/ServiceListItem.tsx) component (thumbnail · name + `DiscountBadge` · one-line desc · price · grey `+`) replaces the vertical `ServiceCard` grid on this page; **`ServiceCard` stays exported, parked for F3 Home**. Verified: typecheck/build clean, 17/17 Vitest, **16/16 browser checks** (hero to top, no nav, back→/services, 4 combos with "20% OFF" + 6 singles without, ₹ prices, empty combos on Seniors, zero overflow at 375/1440, zero console errors). Imagery stays picsum until the user drops real assets into the same `imageUrl`/`heroImageUrl` fields.

---

## F5 — Service Details

| Step | Task | Status |
|---|---|---|
| 54 | Intel Report for F5 — wait for approval | `[ ]` |
| 55 | Create mock data for service detail + recommended add-ons + mock handlers | `[ ]` |
| 56 | Create API layer (fetchService) + hooks | `[ ]` |
| 57 | Build ServiceDetailPage (large image, name, duration, price with strikethrough + discount badge, description, check icon, recommended add-ons — per Figma Sub Services) | `[ ]` |
| 58 | Build "Recommended" add-ons section (image cards with "Add" button — per Figma) | `[ ]` |
| 59 | Build sticky bottom CTA bar (cart icon + price + service count + duration + "Continue" button — per Figma) | `[ ]` |
| 60 | 4 data states + responsive layout for service detail page | `[ ]` |

---

## F6 — Auth (Login & Signup)

> **Note:** Login/Signup screens are not in the Figma file. Build using brand design language (purple primary, clean form layout, Poppins headings).

| Step | Task | Status |
|---|---|---|
| 61 | Lock Auth contract section | `[x]` |
| 62 | Intel Report for F6 — wait for approval | `[x]` |
| 63 | Create User type, auth request/response types + Zod schemas | `[x]` |
| 64 | Create mock data (test users) + mock handlers (register, login, refresh, logout, me) | `[x]` |
| 65 | Create auth API layer functions | `[x]` |
| 66 | Create useAuthStore (Zustand — token, user, isAuthenticated, login/logout actions) | `[x]` |
| 67 | Inject auth header into apiClient from store | `[x]` |
| 68 | Build LoginPage with form (RHF + Zod — email + password, per locked contract) | `[x]` |
| 69 | Build RegisterPage with form (RHF + Zod — name, email, phone, password) | `[x]` |
| 70 | Build ProtectedRoute wrapper component | `[x]` |
| 71 | Wire auth pages into router, test full flow in mock mode | `[x]` |

> **F6 complete (2026-07-12).** Email+password auth per locked contract (login is email-only — contract is canonical over the earlier "phone/email" step wording). Built the real mock engine this feature: custom axios adapter in `src/mocks/lib/mockEngine.ts` (no MSW — Rule 10), 300–600ms latency, envelope-exact responses, localStorage-persisted sessions with refresh-token rotation. apiClient now injects Bearer tokens and does single-flight refresh-on-401 with retry. Seeded logins: priya@example.com / Priya@123, rahul@example.com / Rahul@123; error@test.com forces a 500 on register. ProtectedRoute guards /bookings, /book, /profile, /notifications with returnTo. TopNav is auth-aware. ProfilePage is a minimal F6 test surface (avatar + user + logout via /auth/me) — F9 rebuilds it fully. Verified: 20 automated browser checks (bad creds 401, duplicate 409, forced 500, returnTo, token refresh rotation, logout, mobile 375px), zero console errors. Also fixed latent `z-toast` no-op in Toast.tsx and mounted ToastProvider app-wide.

---

## F7 — Booking Flow

| Step | Task | Status |
|---|---|---|
| 72 | Lock Availability & Booking contract section | `[ ]` |
| 73 | Lock Profile & Addresses contract section (for address selection) | `[ ]` |
| 74 | Intel Report for F7 — wait for approval | `[ ]` |
| 75 | Create TimeSlot, Booking, Address types + Zod schemas | `[ ]` |
| 76 | Create mock data (time slots, addresses) + mock handlers (slot query, booking create) | `[ ]` |
| 77 | Create booking API layer + React Query hooks | `[ ]` |
| 78 | Create useBookingStore (Zustand — draft booking state across stepper steps) | `[ ]` |
| 79 | Build BookingStepper component (4 steps: Service → Date & Time → Address → Confirm) | `[ ]` |
| 80 | Build Step 1 — Service selection (pre-filled from detail page) | `[ ]` |
| 81 | Build Step 2 — Date & Time (calendar + time slot pills) | `[ ]` |
| 82 | Build Step 3 — Address (select existing or add new, RHF + Zod) | `[ ]` |
| 83 | Build Step 4 — Confirm (summary, notes field, submit) | `[ ]` |
| 84 | Build BookingConfirmationPage (success with reference code) | `[ ]` |
| 85 | Handle SLOT_UNAVAILABLE error (409) — show message, redirect to time picker | `[ ]` |
| 86 | 4 data states + responsive for all booking pages | `[ ]` |

---

## F8 — My Bookings

| Step | Task | Status |
|---|---|---|
| 87 | Intel Report for F8 — wait for approval | `[ ]` |
| 88 | Create mock data (bookings in all statuses) + mock handlers (list, detail, cancel, reschedule) | `[ ]` |
| 89 | Create booking list/detail API layer + hooks | `[ ]` |
| 90 | Build BookingCard component (service image, name, ID, date, estimated time, category — per Figma) | `[ ]` |
| 91 | Build MyBookingsPage with 3 tabs: Upcoming / Past / Cancelled (per Figma) | `[ ]` |
| 92 | Build BookingDetailPage (service info, ID, date, time, address, services list, payment summary link, action buttons — per Figma) | `[ ]` |
| 93 | Build action buttons per status: Track Van + Reschedule + Rebook + Cancel (active), Payment Summary only (completed) — per Figma | `[ ]` |
| 94 | Build cancel flow (confirmation modal, 2h business rule, reason input) | `[ ]` |
| 95 | Build reschedule flow (new time slot selection) | `[ ]` |
| 96 | 4 data states + responsive for all booking management pages | `[ ]` |

---

## F9 — Profile & Addresses

| Step | Task | Status |
|---|---|---|
| 97 | Intel Report for F9 — wait for approval | `[ ]` |
| 98 | Create mock data (addresses) + mock handlers (profile CRUD, address CRUD) | `[ ]` |
| 99 | Create profile/address API layer + hooks | `[ ]` |
| 100 | Build ProfilePage — avatar with initials, name + phone, menu links (My Bookings, Saved Addresses, Notifications, Help & Support, Terms & Policies), Logout button — per Figma | `[ ]` |
| 101 | Build AddressList component (radio select, delete icon, "Add Address" link — per Figma Saved Addresses) | `[ ]` |
| 102 | Build AddressForm component (add/edit, RHF + Zod) | `[ ]` |
| 103 | Handle delete-blocked-by-upcoming-booking error | `[ ]` |
| 104 | 4 data states + responsive for profile pages | `[ ]` |

---

## F10 — Reviews (Post-MVP)

| Step | Task | Status |
|---|---|---|
| 105 | Lock Reviews contract section | `[ ]` |
| 106 | Intel Report for F10 — wait for approval | `[ ]` |
| 107 | Create Review type + Zod schema | `[ ]` |
| 108 | Create mock data + mock handlers (create review, list reviews) | `[ ]` |
| 109 | Create review API layer + hooks | `[ ]` |
| 110 | Build ReviewForm component (star rating, comment, RHF + Zod) | `[ ]` |
| 111 | Build ReviewList component (for service detail page + home testimonials) | `[ ]` |
| 112 | Integrate review CTA on completed booking detail | `[ ]` |
| 113 | 4 data states + responsive | `[ ]` |

---

## F11 — Alerts & Notification Settings

| Step | Task | Status |
|---|---|---|
| 114 | Lock Notifications contract section | `[ ]` |
| 115 | Intel Report for F11 — wait for approval | `[ ]` |
| 116 | Create Notification/Alert type + Zod schema | `[ ]` |
| 117 | Create mock data + mock handlers (alert list with tabs, notification settings, mark-read, dismiss) | `[ ]` |
| 118 | Create notification API layer + hooks | `[ ]` |
| 119 | Build AlertsPage — 3 tabs: All / Bookings / Offers (per Figma), alert cards with image, text, dismiss X | `[ ]` |
| 120 | Build unread count badge (integrate into bottom nav Alerts icon — per Figma) | `[ ]` |
| 121 | Build NotificationSettingsPage — WhatsApp link, toggle switches for Booking Updates / Service Promotions / Referral Rewards / Feedback Requests (per Figma) | `[ ]` |
| 122 | 4 data states + responsive | `[ ]` |

---

## F12 — Polish & Hardening

| Step | Task | Status |
|---|---|---|
| 123 | Accessibility audit — verify all a11y checklist items from design.md | `[ ]` |
| 124 | Performance audit — Lighthouse > 90, lazy load routes, optimize images | `[ ]` |
| 125 | Add Error Boundary components with fallback UI | `[ ]` |
| 126 | Refine all loading skeletons to match final layouts | `[ ]` |
| 127 | Write Playwright E2E tests for critical paths (browse → cart → book → manage) | `[ ]` |
| 128 | Final pre-launch review — all checklist items verified, all 4 states, responsive, mock mode | `[ ]` |

---

## F13 — Cart & Checkout (New — from Figma)

> **Figma screens:** Your Cart (184:5132), Cart Checkout (184:5260), Payment Summary (184:6900, 184:6934)

| Step | Task | Status |
|---|---|---|
| 129 | Add Cart & Checkout contract section to contract.md | `[ ]` |
| 130 | Intel Report for F13 — wait for approval | `[ ]` |
| 131 | Create Cart, CartItem, PaymentSummary types + Zod schemas | `[ ]` |
| 132 | Create mock data (cart items, coupons, payment breakdown) + mock handlers | `[ ]` |
| 133 | Create cart API layer + React Query hooks | `[ ]` |
| 134 | Create useCartStore (Zustand — items, add/remove/update, total calculation) | `[ ]` |
| 135 | Build CartPage — item cards with checkbox, image, name, category, duration, price, delete, "+ Add Service" button, sticky bottom CTA (per Figma) | `[ ]` |
| 136 | Build CheckoutPage — user info, cart summary, "Offers & Coupons" section, payment breakdown (Services Charges, Taxes, Total), saved addresses with radio select, "Add Slot" CTA (per Figma) | `[ ]` |
| 137 | Build PaymentSummaryCard component (expandable breakdown) | `[ ]` |
| 138 | Build cart icon with badge count (integrate into Home header — per Figma) | `[ ]` |
| 139 | 4 data states + responsive | `[ ]` |

---

## F14 — Search (New — from Figma)

> **Figma screen:** Search (184:7965)

| Step | Task | Status |
|---|---|---|
| 140 | Intel Report for F14 — wait for approval | `[ ]` |
| 141 | Create search types + mock handlers (search results, recent searches) | `[ ]` |
| 142 | Build SearchPage — back arrow, focused search input with purple border, "Recent Searches" list with "Clear all" link (per Figma) | `[ ]` |
| 143 | Build search results view (reuse ServiceCard from F4) | `[ ]` |
| 144 | 4 data states + responsive | `[ ]` |

---

## F15 — Track Van (New — from Figma)

> **Figma screen:** Track Van (184:6819)

| Step | Task | Status |
|---|---|---|
| 145 | Intel Report for F15 — wait for approval | `[ ]` |
| 146 | Create tracking types + mock handlers (van location, ETA, driver/stylist info) | `[ ]` |
| 147 | Build TrackVanPage — "Your Beauty Bus is on the way!" header with ETA, address bar, map placeholder, Van ID + driver info with Call button, stylist info, availability reminder card (per Figma) | `[ ]` |
| 148 | 4 data states + responsive | `[ ]` |

---

## F16 — Help & Support (New — from Figma)

> **Figma screens:** Help & Support (184:7440), Call Support (184:7526), Raise a Concern (184:7537), Your Support Requests (184:7567), Success/Failed states (184:7597, 184:7607)

| Step | Task | Status |
|---|---|---|
| 149 | Add Help & Support contract section to contract.md | `[ ]` |
| 150 | Intel Report for F16 — wait for approval | `[ ]` |
| 151 | Create SupportRequest, FAQ types + Zod schemas | `[ ]` |
| 152 | Create mock data (FAQ items, support requests) + mock handlers | `[ ]` |
| 153 | Create help/support API layer + hooks | `[ ]` |
| 154 | Build HelpSupportPage — FAQ accordion (expand/collapse), Call Support card (hours), Raise a Concern link, Your Support Requests link (per Figma) | `[ ]` |
| 155 | Build RaiseConcernPage — form with Booking ID dropdown, Issue Type dropdown, Description textarea, "Submit Request" button (per Figma) | `[ ]` |
| 156 | Build SupportRequestsPage — list of submitted requests | `[ ]` |
| 157 | Build submission success/failure states (per Figma) | `[ ]` |
| 158 | 4 data states + responsive | `[ ]` |

---

## F17 — Terms, Privacy & Policies (New — from Figma)

> **Figma screen:** Terms, Privacy & Policies (184:7615)

| Step | Task | Status |
|---|---|---|
| 159 | Build TermsPoliciesPage — list: Terms of Service, Privacy Policy, Cancellation & Refund Policy, Safety & Hygiene Policy, support email contact card (per Figma) | `[ ]` |
| 160 | Build policy content pages (static content, scrollable) | `[ ]` |
| 161 | 4 data states + responsive | `[ ]` |

---

## Progress Summary

| Feature | Steps | Completed | Status |
|---|---|---|---|
| F0 — Scaffold | 10 | 10 | `[x]` Complete |
| F1 — Design System | 15 | 15 | `[x]` Complete |
| F2 — App Shell | 7 | 7 | `[x]` Complete |
| F3 — Home | 11 | 0 | `[ ]` Not started |
| F4 — Catalog | 11 | 11 | `[x]` Complete |
| F5 — Details | 7 | 0 | `[ ]` Not started |
| F6 — Auth | 11 | 11 | `[x]` Complete |
| F7 — Booking | 15 | 0 | `[ ]` Not started |
| F8 — My Bookings | 10 | 0 | `[ ]` Not started |
| F9 — Profile | 8 | 0 | `[ ]` Not started |
| F10 — Reviews | 9 | 0 | `[ ]` Not started |
| F11 — Alerts & Notif Settings | 9 | 0 | `[ ]` Not started |
| F12 — Polish | 6 | 0 | `[ ]` Not started |
| F13 — Cart & Checkout | 11 | 0 | `[ ]` Not started |
| F14 — Search | 5 | 0 | `[ ]` Not started |
| F15 — Track Van | 4 | 0 | `[ ]` Not started |
| F16 — Help & Support | 10 | 0 | `[ ]` Not started |
| F17 — Terms & Policies | 3 | 0 | `[ ]` Not started |
| **TOTAL** | **161** | **54** | **34%** |

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
