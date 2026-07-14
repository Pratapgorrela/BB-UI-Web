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
| Home & Promotions | `LOCKED` | 2026-07-13 | F3 |
| Availability & Booking | `LOCKED` | 2026-07-13 | F7, F8 |
| Profile & Addresses | `LOCKED` | 2026-07-13 | F9 |
| Reviews | `LOCKED` | 2026-07-14 | F10 |
| Notifications & Alerts | `LOCKED` | 2026-07-13 | F11 |
| Cart & Checkout | `LOCKED` | 2026-07-13 | F13 |
| Tracking | `LOCKED` | 2026-07-13 | F15 |
| Help & Support | `LOCKED` | 2026-07-14 | F16 |

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
| 32 | Lock Service Catalog contract section (if not already locked for F4) | `[x]` |
| 33 | Intel Report for F3 — wait for approval | `[x]` |
| 34 | Build greeting header section ("Hello" + address selector + cart icon with badge — per Figma) | `[x]` |
| 35 | Build search bar component (navigates to search page) | `[x]` |
| 36 | Build category grid section (Men, Women, Kids, Seniors, Bride, Groom — 2-col grid with purple gradient cards + images — per Figma) | `[x]` |
| 37 | Build "Popular Combos" section (horizontal scroll cards — per Figma) | `[x]` |
| 38 | Build "Offers for You" section (promo cards carousel — per Figma) | `[x]` |
| 39 | Build testimonials section ("What Our Customers Say" — review cards with avatar, stars, quote — per Figma) | `[x]` |
| 40 | Build referral section ("Share the Beauty, Get Rewarded" — CTA card — per Figma) | `[x]` |
| 41 | Build floating Support button (green FAB — per Figma) | `[x]` |
| 42 | Compose HomePage with all sections, 4 data states, responsive layout | `[x]` |

> **F3 complete (2026-07-13).** Built the Home screen Figma-exact from the user's reference. **New LOCKED "Home & Promotions" contract section** added (Rule 1): `Offer`, `Testimonial`, `Referral` entities + guest endpoints `GET /offers`, `/testimonials`, `/referral` — the three editorial sections had no prior contract/mock. `Testimonial` is deliberately distinct from the per-service `Review` (F10). New `src/features/home/` feature (types → Zod → api → hooks → components) with `src/mocks/{data,handlers}` for the three endpoints (`?scenario=error|empty` triggers mirror the catalog `FORCE_500` convention). **Reused** `CategoryCard`, `ServiceCard`, `useFetchCategories`/`useFetchServices`, `DataState`, `Avatar`, `Card`, `Button`, `formatPrice`, toasts. Sections: greeting header (mobile-only, `md:hidden` — TopNav covers desktop), search bar → `/services` (interim "CTA to catalog"; **F14 repoints to `/search`**), 6-category grid (reused CategoryCard), Popular Combos (`type=COMBO&isPopular=true`, horizontal ServiceCard row), Offers carousel (DARK/PRIMARY themes), testimonials (scroll-snap carousel + dot nav, no new pkg — Rule 10), referral CTA (₹100/₹100 from data). Small backward-compatible reuse tweak: added optional `onOpen` to `ServiceCard` (mirrors `ServiceListItem`) so combo cards tap through to detail while `+` stays separate. **Decisions:** Support FAB is **purple** per the Figma reference — *deviates from design.md line 14 (green FAB)*; cart badge is **hidden at count 0** (no cart until F13); the van "Arriving in 10 min" card is **deferred to F15 Track Van** (no tracking data/contract yet). Cart/search/support taps use the established "coming soon" toast/navigate stubs. Verified: typecheck + `vite build` clean; **30/30 Vitest** (20 existing + 10 new promotions: offers/testimonials/referral happy + `scenario=error`→500 + `scenario=empty`→empty + seed↔schema integrity); **32/32 browser checks** (scratchpad Playwright) covering all 8 sections in Figma order, category→`/categories/:slug` + combo→`/services/:id` navigation, search/cart/support stubs, purple FAB, hidden-at-0 cart badge, loading skeletons, mobile header shown@375 / hidden@768+, zero horizontal overflow @375/768/1024/1440, zero console errors. **Caveat:** `npm run lint` still fails repo-wide (pre-existing — ESLint flat config never created; blocked on `typescript-eslint` package approval per Rule 10). Imagery (offers, testimonials) stays picsum until real assets drop into the same `imageUrl` fields.

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
| 54 | Intel Report for F5 — wait for approval | `[x]` |
| 55 | Create mock data for service detail + recommended add-ons + mock handlers | `[x]` |
| 56 | Create API layer (fetchService) + hooks | `[x]` |
| 57 | Build ServiceDetailPage (large image, name, duration, price with strikethrough + discount badge, description, check icon, recommended add-ons — per Figma Sub Services) | `[x]` |
| 58 | Build "Recommended" add-ons section (image cards with "Add" button — per Figma) | `[x]` |
| 59 | Build sticky bottom CTA bar (cart icon + price + service count + duration + "Continue" button — per Figma) | `[x]` |
| 60 | 4 data states + responsive layout for service detail page | `[x]` |

> **F5 complete (2026-07-13).** `GET /services/:id` added to the LOCKED Service Catalog contract's mock layer (found → single-resource envelope; unknown id → 404 `RESOURCE_NOT_FOUND`; reserved id `FORCE_500` → 500, mirroring the `/services` search convention). New `fetchService(id)` + `useFetchService(id)` hook (reuses the pre-existing `catalogKeys.service(id)`). No new seed data or entities — the 34 F4 services already carry every detail field; **no Specialist work** (the Figma-driven steps 54–60 cover detail + add-ons + sticky CTA, not specialist lists). [ServiceDetailPage](../src/pages/ServiceDetailPage.tsx) rebuilt from the placeholder as an **immersive** page (route `handle: { hideNav: true, fullBleed: true }`): full-bleed `imageUrl` hero + scrim + floating back button (`navigate(-1)`), rounded content sheet with name + price (effective price, strikethrough `originalPrice`, `DiscountBadge`, duration via `formatDuration`, rating/reviewCount), description, a combo-only **"What's included"** check-list, a **"Recommended"** add-ons section (reused `ServiceListItem` rows), and the reused `StickyBottomBar` ("Add to cart" CTA → "Cart is coming soon" toast; real cart is F13). Included/recommended are derived client-side from one same-category `GET /services` query — **no invented contract field** (combo→`includedServiceIds`; single→other same-category singles, capped at 6). **Navigation wired**: `ServiceListItem` gained an optional `onOpen` so tapping a row (not the `+`) opens the detail page — used from `CategoryDetailPage`; nothing linked to `/services/:id` before. **4 data states**: 404 is routed to the empty state (not-found + "Browse services" CTA) via `getApiError().code`, so only real failures show the error/retry UI. Verified: typecheck + `vite build` clean; **20/20 Vitest** (17 existing + 3 new detail-endpoint tests: found/404/FORCE_500); **21/21 browser checks** (category→row→detail click-through, combo strikethrough+"20% OFF"+included list, single plain price, unknown-id not-found, FORCE_500 error+retry, sticky CTA toast, immersive no-nav, zero horizontal overflow @ 375/768/1024/1440, zero console errors). **Caveat**: `npm run lint` still fails repo-wide (pre-existing — ESLint 10 flat config never created; Rule 10 package approval pending). Imagery stays picsum until real assets drop into the same `imageUrl` fields.

> **F5 design revision (2026-07-13, post-review).** User asked to reduce font sizes and corner radius on the detail view. One-notch reduction applied to **both** immersive detail pages ([ServiceDetailPage](../src/pages/ServiceDetailPage.tsx) + [CategoryDetailPage](../src/pages/CategoryDetailPage.tsx)) for consistency: titles `text-h2`→`text-h3` (24→20px), price `text-h3`→`text-h4` (20→18px), section headings `text-h3`→`text-h4` (20→18px), description/list items `text-body`→`text-body-sm` (16→14px), content-sheet top corner `rounded-t-3xl`→`rounded-t-xl` (24→16px, project token scale). Re-verified: typecheck + build clean, 21/21 browser checks still pass.

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

## F7 — Booking Flow (integrated with checkout)

> **Scope revised 2026-07-13 (user decision):** no standalone `/book` stepper — the original steps 72–86 predated Figma/F13. Scheduling integrates into checkout: "Add Slot" opens an in-app-designed date + time-slot picker (no Figma screen exists — brand language), a slot is required before placing the order, and `POST /bookings` supersedes `POST /orders` so checkout creates a real scheduled Booking (F8 gets real data). Specialists are system-assigned (no picker — matches Figma). The old step 73 (lock Profile & Addresses) is consciously dropped — checkout keeps the interim `checkoutAddresses` until F9.

| Step | Task | Status |
|---|---|---|
| 72 | Amend & lock Availability & Booking contract (capacity slots by date, Booking carries items, POST /bookings supersedes POST /orders) + change-log entries + this checklist rewrite | `[x]` |
| 73 | Intel Report for F7 — wait for approval | `[x]` |
| 74 | Create TimeSlot, Booking, Specialist types + Zod schemas (`src/features/booking/types/`) | `[x]` |
| 75 | Create specialist seed data for auto-assignment (`src/mocks/data/specialists.data.ts`) | `[x]` |
| 76 | Mock handlers: GET /time-slots (deterministic grid + scenario triggers) + POST /bookings (auth, pricing reuse, auto-assign, `bb-mock-bookings` persistence, 409) + shared `requireAuth` guard extraction | `[x]` |
| 77 | Vitest integration tests for booking handlers (happy, 400, 401, 422, 409, persistence, seed↔schema integrity) | `[x]` |
| 78 | Booking API layer + React Query hooks (`fetchTimeSlots`/`createBooking`, `bookingKeys`, `useFetchTimeSlots`, `useCreateBooking`) — no new store; slot selection is checkout-local state | `[x]` |
| 79 | Build DateStrip component (next-14-days chips — first date-fns use) | `[x]` |
| 80 | Build TimeSlotGrid component (morning/afternoon/evening pill groups, unavailable/selected states) | `[x]` |
| 81 | Build SlotPickerSheet (reused Modal bottom sheet + DataState 4 states + confirm footer) | `[x]` |
| 82 | Build SelectedSlotCard + integrate into CheckoutPage (replaces the dashed "Add slot" button; slot required before placing order) | `[x]` |
| 83 | Swap order placement → `useCreateBooking`; SLOT_UNAVAILABLE 409 recovery (clear slot, refetch, reopen picker) | `[x]` |
| 84 | BookingConfirmationPage (rename `/order-confirmation` → `/booking-confirmation`; reference, schedule, items, total, "View my bookings") | `[x]` |
| 85 | Retire the superseded order path (Order type/schema, placeOrder API, usePlaceOrder, POST /orders handler + tests) and the `/book` placeholder (BookingFlowPage, route) | `[x]` |
| 86 | 4 data states + responsive 375–1440 verification (Vitest suite + browser checks) | `[x]` |

> **F7 complete (2026-07-13).** Scheduling integrated into checkout per the locked contract rewrite: **`POST /bookings` supersedes `POST /orders`** ({items, couponCode, addressId, timeSlotId, notes} → scheduled `Booking`, status PENDING), and the `Order` entity/type/schema/api/hook/handler/tests were fully retired along with the `/book` placeholder route + `BookingFlowPage`. **Slots are capacity-level hourly arrival windows** (09:00–18:00, 14-day horizon) queried by date only; slot ids deterministically encode date+time in a v4-shaped UUID so the mock resolves them without a registry; unavailability = capacity hash (~25%) + already-booked windows + today's past hours; bookings persist to localStorage **`bb-mock-bookings`** (lazy, guarded reads — Vitest runs in node) so F8 has real data across reloads and double-booking is visibly impossible. Specialists **auto-assigned** round-robin from new `specialists.data.ts` seed (4 records, schema-validated). Shared **`requireAuth` guard extracted** to `src/mocks/lib/guards.ts` (returns userId; cart.mock swapped to it); `priceCart`/`makeReferenceCode`/`toValidationDetails` exported from cart.mock and reused — booking pricing is byte-identical to `/checkout/summary`. New `src/features/booking/` slice (types → Zod → api → hooks → components → utils → barrel; no Zustand store — **slot selection is checkout-local `useState`** like coupon/address, deliberately not persisted). **Slot picker designed in-app** (no Figma screen — brand language): `SlotPickerSheet` in the reused `Modal` bottom sheet with `DateStrip` (14 day-chips, first **date-fns** use in the repo) + `TimeSlotGrid` (Morning/Afternoon/Evening pill groups, line-through unavailable, purple selected) + sticky Confirm footer; `SelectedSlotCard` on checkout replaces the F13 dashed "Add slot" toast button (dashed *(required)* affordance → filled card with formatted slot + est. duration + Change). **Slot required before placing** (toast + auto-open picker, CTA stays enabled — mirrors the address gate); **409 SLOT_UNAVAILABLE recovery** clears the stale selection, invalidates slot queries, and reopens the picker. `CheckoutItemsList` extracted to keep CheckoutPage under ~200 lines. `/order-confirmation` renamed **`/booking-confirmation`** (`BookingConfirmationPage`: reference, Scheduled for, est. duration, services, total, "View my bookings" → `/bookings`; history.state survives reload, stateless deep links get a graceful fallback). Verified: typecheck + `vite build` clean; **59/59 Vitest** (46 prior − 3 retired order tests + 13 new booking: slot grid shape/stability/determinism, 400s, scenario empty/error, past/horizon, 401, happy 201 priced-like-summary, coupon flow + 422, validation 400s ×4, 409 ×3 incl. double-book, persistence + window-turns-unavailable, seed↔schema); **46/46 browser checks** (scratchpad Playwright): full login→add→cart→checkout→slot→confirmation flow, required-gate toast + auto-open, Today default, skeleton/empty/error/success states, disabled+line-through unavailable pills, Escape/backdrop close, Change pre-selection, **real 409 race verified via a second tab sniping the slot** (toast + picker reopen + refetch shows window gone), cart cleared, `bb-mock-bookings` persistence, reload keeps confirmation + deep-link fallback, zero horizontal overflow @ 375/768/1024/1440 with sheet ≤480px centered on desktop, zero unexpected console errors; 3 screenshots captured. **Caveat:** `npm run lint` still fails repo-wide (pre-existing — ESLint flat config never created; Rule 10 package approval pending). **F8 hand-off:** list/detail/reschedule/cancel handlers + UI (contract LOCKED, reuse `SlotPickerSheet` for reschedule); real `Address` entity stays with F9 (checkout keeps interim `checkoutAddresses`).

---

## F8 — My Bookings

> **F7 hand-off (2026-07-13):** `Booking` now carries `items[]` + `paymentSummary` (multi-service — booking cards should render the items snapshot); the reschedule UI (step 95) should reuse F7's `SlotPickerSheet`; F8 owns the mock handlers for `GET /bookings`, `GET /bookings/:id`, reschedule, and cancel (contract already LOCKED). Created bookings persist in localStorage `bb-mock-bookings`.

| Step | Task | Status |
|---|---|---|
| 87 | Intel Report for F8 — wait for approval | `[x]` |
| 88 | Create mock data (bookings in all statuses) + mock handlers (list, detail, cancel, reschedule) | `[x]` |
| 89 | Create booking list/detail API layer + hooks | `[x]` |
| 90 | Build BookingCard component (service image, name, ID, date, estimated time, category — per Figma) | `[x]` |
| 91 | Build MyBookingsPage with 3 tabs: Upcoming / Past / Cancelled (per Figma) | `[x]` |
| 92 | Build BookingDetailPage (service info, ID, date, time, address, services list, payment summary link, action buttons — per Figma) | `[x]` |
| 93 | Build action buttons per status: Track Van + Reschedule + Rebook + Cancel (active), Payment Summary only (completed) — per Figma | `[x]` |
| 94 | Build cancel flow (confirmation modal, 2h business rule, reason input) | `[x]` |
| 95 | Build reschedule flow (new time slot selection) | `[x]` |
| 96 | 4 data states + responsive for all booking management pages | `[x]` |

> **F8 complete (2026-07-13).** Booking management per the LOCKED Availability & Booking contract — no contract changes needed. **Mock layer:** new read-only [`seedBookings`](../src/mocks/data/bookings.data.ts) (7 bookings priced through `priceCart` so summaries are byte-identical to checkout: 6 for Priya covering all 5 statuses — incl. a CONFIRMED at now+90min that demos the 2h lock and a COMPLETED with FLAT100 coupon — plus 1 for Rahul proving per-user scoping) **merged at read time with localStorage `bb-mock-bookings`, localStorage wins by id** — cancelling/rescheduling a seed upserts the mutated copy; the seeds module is never mutated. New handlers in booking.mock: `GET /bookings` (auth, comma-separated `status` filter, `scheduledAt` DESC, `paginated()`, `scenario=empty|error`), `GET /bookings/:id` (owned-or-404 per contract — other users' bookings 404, not 403; expands `specialist` from seeds + interim `address` from `checkoutAddresses`), `PATCH cancel`/`PATCH reschedule` (shared `assertModifiable`: 422 unless PENDING/CONFIRMED and ≥2h out; reschedule revalidates the slot exactly like POST with self-exclusion → 409 `SLOT_UNAVAILABLE`). Slot availability now reads the merged universe, so seed windows block double-booking. **Feature slice:** `BookingDetail`/`BookingAddress` types (+ zod, request schemas, list-query schema), `fetchBookings/fetchBooking/cancelBooking/rescheduleBooking`, hooks `useFetchBookings` (keepPreviousData, 30s stale) / `useFetchBooking` / `useCancelBooking` / `useRescheduleBooking`, `bookingPolicy` utils (`canModifyBooking`, status label/variant maps per design.md colors). **UI:** new shared [`Tabs`](../src/components/ui/Tabs.tsx) (role=tablist, arrow-key roving focus — F11 reuse), `BookingCard`, `BookingStatusBadge`, `BookingActions` (per status: PENDING/CONFIRMED → Track Van/Reschedule/Rebook/Cancel with 2h-locked disable + hint; IN_PROGRESS → Track Van+Rebook; COMPLETED → Payment summary only; CANCELLED → Rebook only), `CancelBookingModal` (RHF+Zod, client min-5 reason vs server min-1). MyBookingsPage: URL-driven `?tab=`/`?page=`, per-tab empty states, 1→2→3-col grid, pager. BookingDetailPage: summary/specialist/address cards + reused `CheckoutItemsList` + `PaymentSummaryCard` (action button scrolls + flips it open), reused `SlotPickerSheet` for reschedule with the F7 409 recovery (invalidate + reopen); back button prefers history (preserves the list tab) with a `/bookings` fallback for deep links. **Stubs:** Track Van → "coming soon" toast (F15); Rebook merges booking items into `useCartStore` and opens `/cart`. Verified: typecheck + build clean; **80/80 Vitest** (59 prior + 21 new: seed integrity, list auth/scoping/filters/400/sort/pagination/merge/scenarios, detail 404s + expanded shape, cancel 400/422×4/happy+persistence, reschedule 400/422/409×2/happy+window-swap); **56/56 browser checks** (scratchpad Playwright, priya + rahul) incl. full reschedule→cancel lifecycle, checkout→Upcoming merge, deliberate-404 error state with `[Booking]`-prefixed logging only, skeletons, empty tabs, zero unexpected console errors, zero horizontal overflow @ 375/768/1024/1440; 4 screenshots. **Caveats:** `npm run lint` still fails repo-wide (pre-existing — ESLint flat config blocked on package approval); Upcoming renders `scheduledAt` DESC per the locked contract (soonest last — flag for a future contract amendment if wanted). **F9 hand-off:** detail's `address` comes from interim `checkoutAddresses`; swap the source to the real Address entity (shape `{id,label,line}` already matches `BookingAddress`).

---

## F9 — Profile & Addresses

| Step | Task | Status |
|---|---|---|
| 97 | Intel Report for F9 — wait for approval | `[x]` |
| 98 | Create mock data (addresses) + mock handlers (profile CRUD, address CRUD) | `[x]` |
| 99 | Create profile/address API layer + hooks | `[x]` |
| 100 | Build ProfilePage — avatar with initials, name + phone, menu links (My Bookings, Saved Addresses, Notifications, Help & Support, Terms & Policies), Logout button — per Figma | `[x]` |
| 101 | Build AddressList component (radio select, delete icon, "Add Address" link — per Figma Saved Addresses) | `[x]` |
| 102 | Build AddressForm component (add/edit, RHF + Zod) | `[x]` |
| 103 | Handle delete-blocked-by-upcoming-booking error | `[x]` |
| 104 | 4 data states + responsive for profile pages | `[x]` |

> **F9 complete (2026-07-13).** Profile & Addresses per the now-**LOCKED** contract section (no new fields; clarifications added: `GET /profile` mirrors `/auth/me`, `isDefault` exclusive, first address forced default, delete-default promotes next, delete blocked by upcoming booking). New `src/features/profile/` slice (types → Zod → api → hooks → components → utils → barrel). **Mock layer:** new read-only [`seedAddresses`](../src/mocks/data/addresses.data.ts) (Priya ×3 — Home+Office reuse the retired interim `checkoutAddresses` UUIDs so existing seed bookings still resolve; "Parents' House" is unreferenced → freely deletable — plus Rahul ×1) **merged over localStorage `bb-mock-addresses` with a tombstone set `bb-mock-addresses-deleted`** (seed edits/deletes overlay without mutating the seed module — the seed+overlay+tombstone pattern, extending the F8 merge approach to support deletes). New [`profile.mock`](../src/mocks/handlers/profile.mock.ts): `GET/PATCH /profile` (override store `bb-mock-profile` keyed by userId; PATCH also updates the auth store client-side so TopNav/greeting stay in sync), `GET /addresses` (auth, default-first, `?scenario=empty|error`), `POST` (first-address & requested default made exclusive), `PATCH` (owned-or-404, exclusive default), `DELETE` (owned-or-404; **422 when a PENDING/CONFIRMED booking references it** — reads the merged booking universe via a newly-exported `allBookings` from booking.mock; promotes the next address to default when the default is removed). Exposed `findUserById` from auth.mock + `findAddressRecord` from profile.mock (booking.mock's detail expansion now derives its `{id,label,line}` address from the **real** Address via `addressToLine`, replacing the interim import). **Feature slice:** `Address`/request types (+ entity/form/request Zod), `fetchProfile/updateProfile` + `fetch/create/update/deleteAddress`, hooks (`useFetchProfile`, `useUpdateProfile`, `useFetchAddresses`, `useCreateAddress`, `useUpdateAddress`, `useDeleteAddress` — invalidation + toasts + `[Profile]` logs), `addressToLine` util. **UI:** ProfilePage rebuilt from the F6 stub (avatar+initials, name/email/phone, **Edit** → `ProfileEditSheet` [reused `Modal` + RHF/Zod, email read-only], menu links → My bookings/Saved addresses/Notifications [live routes] + Help & support/Terms & policies [F16/F17 "coming soon" toasts], Log out); new `/profile/addresses` **SavedAddressesPage** (`PageHeader` + Add, `AddressList` [default badge, Set-as-default, Edit, Delete], `AddressFormSheet` add/edit, delete-confirm `Modal`). **Integration:** CheckoutPage now reads `useFetchAddresses` (default auto-selected, empty → "Add an address" CTA → `/profile/addresses`) via a decoupled `AddressOption` shape on `AddressSelect`; **interim `src/features/cart/data/checkoutAddresses.ts` deleted** and all consumers migrated. Added `setUser` to `useAuthStore`. Verified: typecheck + `vite build` clean; **102/102 Vitest** (80 prior + 22 new: seed integrity, profile 401/400/happy+persistence, addresses list scoping/default-order/scenarios, create 401/400/happy/exclusive-default, update 404×2/happy, delete 404/422-blocked/happy/promote-default). **Caveats:** `npm run lint` still fails repo-wide (pre-existing — ESLint flat config blocked on package approval); browser walkthrough pending user testing; Figma screens (Profile 184:7051, Saved Addresses 184:7185/7228/7281) weren't reachable this session (connector auth) — layout built to brand language, expect a design-revision pass like F4/F5; no avatar upload (no storage backend — avatar stays initials).

---

## F10 — Reviews (Post-MVP)

| Step | Task | Status |
|---|---|---|
| 105 | Lock Reviews contract section | `[x]` |
| 106 | Intel Report for F10 — wait for approval | `[x]` |
| 107 | Create Review type + Zod schema | `[x]` |
| 108 | Create mock data + mock handlers (create review, list reviews) | `[x]` |
| 109 | Create review API layer + hooks | `[x]` |
| 110 | Build ReviewForm component (star rating, comment, RHF + Zod) | `[x]` |
| 111 | Build ReviewList component (for service detail page + home testimonials) | `[x]` |
| 112 | Integrate review CTA on completed booking detail | `[x]` |
| 113 | 4 data states + responsive | `[x]` |

> **F10 complete (2026-07-14).** Reviews on `feature/F10-reviews` per the now-**LOCKED** Reviews contract section (amended before locking, user decision 2026-07-14: **`POST /reviews` gains required `serviceId`** — a multi-service booking picks which service the review is about; uniqueness stays **one review per booking** → 409 `CONFLICT`; `GET /services/:id/reviews` fleshed out to locked rigor: guest, paginated default 10/max 100, `createdAt` DESC, `user {firstName, avatarUrl}` expanded, 404 unknown service, `?scenario=empty|error`; noted that `Service.rating`/`reviewCount` aggregates are backend-maintained and the mock does **not** recompute them — the live list is the source of truth). **Mock layer:** read-only [`seedReviews`](../src/mocks/data/reviews.data.ts) (10 reviews across 5 services; Priya's is attached to her **first** COMPLETED seed booking via runtime lookup → demos the 409 path, while her second COMPLETED booking — multi-service — is deliberately left un-reviewed → demos the happy path + service selector) merged over localStorage **`bb-mock-reviews`** (creations only, the F16 pattern); new [`reviews.mock`](../src/mocks/handlers/reviews.mock.ts): `GET /services/:id/reviews` (guest, 404 unknown service, scenarios) + `POST /reviews` (requireAuth; Zod 400; owned-or-unknown booking → 400; `serviceId` ∉ items → 400; non-COMPLETED → 422; duplicate booking → 409 `CONFLICT`; `FORCE_500` in comment → 500; expands author via `findUserById`). **Feature slice** `src/features/reviews/` (types → Zod [server `createReviewRequestSchema` + client `writeReviewFormSchema`: rating 1–5 int, comment trim 10–500] → api → `reviewKeys` + `useFetchServiceReviews` (keepPreviousData, 30s) / `useCreateReview` (invalidates the service's reviews, `[Reviews]` logs, toasts at page level) → components → barrel). **New shared [`StarRating`](../src/components/ui/StarRating.tsx)** primitive: display mode (`role="img"`, "Rated X out of 5") **and** input mode (radiogroup pattern, arrow-key roving focus, 44px `size-touch-target` stars) — `TestimonialCard` refactored to the display mode (3 inline copies existed; single-star+numeric spots left alone). **UI:** `ReviewCard` (Avatar + firstName + stars + `formatDistanceToNow` + comment), `ReviewList` (4 `DataState` states, matched skeleton, pager only when totalPages > 1) mounted as a **"Reviews" section on ServiceDetailPage** (guest-visible); `WriteReviewModal` (reused `Modal`, RHF+Zod, `Controller`-wired StarRating input, `Select` service picker **only when the booking has >1 item**, 409 → "already reviewed" info toast + close, other failures → error toast **with the form intact**); `BookingActions` COMPLETED branch → **"Write a review" (primary) + "Payment summary" (secondary)** grid, wired in BookingDetailPage. **Fixed during browser verification:** the modal's reset effect depended on the parent-rebuilt `services` array, so any re-render after a failed submit wiped in-progress input — reset now fires only on the closed→open transition. Verified: `npm run typecheck` + `vite build` clean; **178/178 Vitest** (161 prior + 17 new: seed↔schema + booking-link + service-link + fresh-booking guards; list guest/scoping/DESC/pagination/404/scenarios; create 401/400×5/422/409/FORCE_500/201 shape + author + persistence + post-create 409); **24/24 browser checks** (scratchpad Playwright, port 5179, priya): guest list + newest-first + empty state, CTA on COMPLETED only, validation errors, FORCE_500 form-intact, happy submit → toast → review first on service page, duplicate + seed-reviewed 409 toasts, single-service booking hides the selector, ArrowRight star keyboard nav, zero horizontal overflow @ 375/768/1024/1440, zero unexpected console errors; screenshot captured. **Caveats:** `npm run lint` still fails repo-wide (F12 fixes it with the approved typescript-eslint packages); step-106 Intel Report printed and self-approved (autonomous session — like F16); the header aggregate (`rating`/`reviewCount`) stays seed-static by contract note, so a just-submitted review shows in the list but doesn't bump the header count; no Figma screens exist for F10 (Post-MVP) — built to brand language.

---

## F11 — Alerts & Notification Settings

| Step | Task | Status |
|---|---|---|
| 114 | Lock Notifications contract section | `[x]` |
| 115 | Intel Report for F11 — wait for approval | `[x]` |
| 116 | Create Notification/Alert type + Zod schema | `[x]` |
| 117 | Create mock data + mock handlers (alert list with tabs, notification settings, mark-read, dismiss) | `[x]` |
| 118 | Create notification API layer + hooks | `[x]` |
| 119 | Build AlertsPage — 3 tabs: All / Bookings / Offers (per Figma), alert cards with image, text, dismiss X | `[x]` |
| 120 | Build unread count badge (integrate into bottom nav Alerts icon — per Figma) | `[x]` |
| 121 | Build NotificationSettingsPage — WhatsApp link, toggle switches for Booking Updates / Service Promotions / Referral Rewards / Feedback Requests (per Figma) | `[x]` |
| 122 | 4 data states + responsive | `[x]` |

> **F11 complete (2026-07-13).** Alerts & Notification Settings per the now-**LOCKED** Notifications contract section (amended from the 2-endpoint draft, see change log). New `NotificationSettings` entity (per-user singleton: `whatsappEnabled` + 4 channel toggles); `GET /notifications` gained a `category` (BOOKING/OFFER — **derived from `type`**, not a stored field) filter + pagination; added `GET /notifications/unread-count`, `PATCH /notifications/:id/read`, `DELETE /notifications/:id` (dismiss), and `GET`/`PATCH /notification-settings`. **Mock layer:** new read-only [`seedNotifications`](../src/mocks/data/notifications.data.ts) (8 for Priya spanning all 5 types + both read states so all 3 tabs populate, 2 referencing real seed bookings via `referenceId`/`referenceType`; 1 for Rahul → per-user scoping) **merged over localStorage `bb-mock-notifications` with a tombstone set `bb-mock-notifications-deleted`** (read/dismiss/mark-all overlay without mutating the seed — the same seed+overlay+tombstone pattern as F8/F9); per-user settings override store `bb-mock-notif-settings` (GET returns all-on defaults, WhatsApp off, when unset). New [`notifications.mock`](../src/mocks/handlers/notifications.mock.ts) with all 7 handlers (auth-guarded, owned-or-404, `?scenario=empty|error`). **Feature slice** `src/features/notifications/` (types → Zod → api → 7 hooks → components → barrel): `useFetchNotifications` (keepPreviousData, 30s stale), `useUnreadNotificationCount` (enabled only when authed), `useMarkNotificationRead`/`useMarkAllNotificationsRead`/`useDismissNotification` (invalidate + `[Notifications]` logs), `useFetchNotificationSettings`/`useUpdateNotificationSettings` (optimistic toggle + rollback). **UI:** new `AlertCard` (per-type icon/colour, unread tint + dot, relative time via **date-fns `formatDistanceToNow`**, dismiss X) + `NotificationBadge` (unread pill, renders null at 0 / unauthed). **Pages:** [AlertsPage](../src/pages/AlertsPage.tsx) replaces the F6 `/notifications` placeholder — reused F8 `Tabs` (All/Bookings/Offers), URL-driven `?tab=`/`?page=`, per-tab empty states, Mark-all-read + Settings gear, tap → mark read (+ deep-link to `/bookings/:id` for booking refs), dismiss; [NotificationSettingsPage](../src/pages/NotificationSettingsPage.tsx) at `/notifications/settings` (reused F1 `Toggle`: WhatsApp opt-in card + 4 channel toggles, optimistic). **Nav:** unread badge wired into the bottom-nav Alerts (bell) icon (authed-only). **Reused** `Tabs`, `Toggle`, `Card`, `DataState`, `Button`, `PageHeader`, `useToast`, `getApiErrorMessage` — no new primitives, no new packages. Verified: `npm run typecheck` + `vite build` clean (AlertsPage lazy-chunked 3.69 kB); **129/129 Vitest** (110 prior + 19 new: seed↔schema integrity, list auth/scoping/category filters/400/pagination/scenarios, unread-count, per-item read + 404, mark-all, dismiss + persistence + 404, settings defaults/partial-patch-persist/400/401); dev server boots clean, `/notifications` + `/notifications/settings` serve 200. **Caveats:** `npm run lint` still fails repo-wide (pre-existing — ESLint flat config blocked on package approval per Rule 10); full browser walkthrough pending user testing (Playwright not a project dep this session); Figma 184:6968 (Alerts) + 184:7351 (Settings) not reachable (connector auth) — built to brand language, expect a possible design-revision pass like F4/F5/F9. WhatsApp is modeled as a `whatsappEnabled` opt-in toggle (no real integration). Desktop TopNav shows no Alerts entry (pre-existing — it lists only the first 3 nav items; Alerts is reached via the Profile menu link → `/notifications`).

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
| 129 | Add Cart & Checkout contract section to contract.md | `[x]` |
| 130 | Intel Report for F13 — wait for approval | `[x]` |
| 131 | Create Cart, CartItem, PaymentSummary types + Zod schemas | `[x]` |
| 132 | Create mock data (cart items, coupons, payment breakdown) + mock handlers | `[x]` |
| 133 | Create cart API layer + React Query hooks | `[x]` |
| 134 | Create useCartStore (Zustand — items, add/remove/update, total calculation) | `[x]` |
| 135 | Build CartPage — item cards with checkbox, image, name, category, duration, price, delete, "+ Add Service" button, sticky bottom CTA (per Figma) | `[x]` |
| 136 | Build CheckoutPage — user info, cart summary, "Offers & Coupons" section, payment breakdown (Services Charges, Taxes, Total), saved addresses with radio select, "Add Slot" CTA (per Figma) | `[x]` |
| 137 | Build PaymentSummaryCard component (expandable breakdown) | `[x]` |
| 138 | Build cart icon with badge count (integrate into Home header — per Figma) | `[x]` |
| 139 | 4 data states + responsive | `[x]` |
| 139a | Addendum: service details bottom sheet on category pages — `ServiceDetailSheet` in reused `Modal` (hero + purple discount badge, strikethrough price, duration, description, floating + → ✓ cart toggle; per user mockups) | `[x]` |
| 139b | Addendum: URL-driven sheet state — `?service=<id>` via `useServiceSheetParam`; browser/Android back closes, deep links restore, scroll preserved | `[x]` |
| 139c | Addendum: "Plan includes" / "Recommended" mini-cards with Add⟷Added toggles (shared `deriveServiceRelations`) + promo banner | `[x]` |
| 139d | Addendum: sticky cart summary bar (page-level fixed + in-sheet sticky) — badge, "{first} +N more" subtitle, duration, Continue → `/cart` | `[x]` |
| 139e | Addendum: entrance animations (`--animate-*` @theme tokens), Modal z-index fix, verification — 49/49 Vitest + 49/49 browser checks, responsive, reduced motion | `[x]` |

> **F13 complete (2026-07-13).** New **LOCKED "Cart & Checkout" contract section** (Rule 1): `CartItem`, `Coupon`, `PaymentSummary`, `Order` entities + `GET /coupons`, `POST /checkout/summary`, `POST /orders`. **Hybrid state model** (user decision): the cart is client-state in a persisted `useCartStore` (`bb-cart` — guest-friendly, survives refresh, `addItem`/`removeItem`/`updateQuantity`/`toggleSelected`/`clearCart` + `cartItemCount`/`cartSubtotal`/`selectedCartItems`/`cartSelectedDuration` selectors); coupons + payment math are **server-authoritative** via the mock (`priceCart` recomputes serviceCharges from seed, applies PERCENT/FLAT coupons with `minSubtotal`/`maxDiscount`, 18% GST). New `src/features/cart/` feature (types → Zod → api → hooks → components → barrel) + `src/mocks/{data/cart.data.ts (4 coupons), handlers/cart.mock.ts}`. **Checkout terminates at a mock order** (user decision): `POST /orders` (auth-guarded, mirrors the auth token guard) returns an `Order` with a `BB-YYYYMMDD-XXXX` reference; scheduling ("Add Slot") is **deferred to F7** with a toast. Pages: `CartPage` (`/cart`, guest-allowed), `CheckoutPage` (`/checkout`, inside `<ProtectedRoute>`), `OrderConfirmationPage` (`/order-confirmation`). **Activated every dead "add to cart" button** — Home combos, `ServiceDetailPage` (sticky + recommended), `CategoryDetailPage` rows now call `useCartStore.addItem` with a success toast; `HomeHeader` cart icon → `/cart` with live badge (wired from `HomePage`); **new cart icon + badge added to desktop `TopNav`** (had none). **Reused** `StickyBottomBar` (+ small backward-compatible `priceLabel` prop for ₹ output — mirrors the F5 approach), `Card`, `Button`, `DiscountBadge`, `TextInput`, `Avatar`, `DataState`, `Skeleton`, `useToast`, `formatPrice`/`formatDuration`. **New components:** `CartItemCard`, `PaymentSummaryCard` (expandable), `CouponSection`, `AddressSelect`. Coupon rejection is handled without `useEffect` — the summary is a `keepPreviousData` query, so a bad coupon shows an inline error while the last good breakdown stays on screen; Place order is disabled until it's fixed. **Addresses are interim** (`checkoutAddresses` static list) pending F9 (Profile & Addresses, DRAFT) — hand-off noted in the file. Verified: typecheck + `vite build` clean; **45/45 Vitest** (30 existing + 15 new cart: coupon list happy/`scenario=empty`/`error`, summary math + FLAT/capped-PERCENT coupons + `minSubtotal` 422 + unknown coupon/service 400 + empty-items 400, order 401-without-token/201-with-token/coupon-through-order, seed↔schema integrity); **29/29 browser checks** (scratchpad Playwright) covering add-from-Home→badge, cart select/qty/empty states, guest→/login redirect, authenticated checkout, FLAT100 apply + BIG50 gated-rejection, place order→confirmation with reference code, cart cleared, `[Cart]`-prefixed handled-error logging on the deliberate rejection, zero unexpected console errors, zero horizontal overflow @ 375/768/1024/1440, desktop TopNav cart link. Screenshots captured (cart/checkout/confirmation). **Caveat:** `npm run lint` still fails repo-wide (pre-existing — ESLint flat config never created; Rule 10 package approval pending). Imagery stays picsum until real assets drop into the same `imageUrl` fields.

> **F13 addendum — details bottom sheet + sticky cart bar (2026-07-13, per the user's Figma popup mockups + BB.mp4 gap analysis; client-only, contract untouched).** Category rows (`/categories/:slug`) now open the service's **full details in a bottom sheet** instead of navigating: new `ServiceDetailSheet` (hero with overlaid purple `DiscountBadge` — new backward-compatible `variant` pass-through —, strikethrough price row, `Duration - {x}` line, description with floating **+ → purple ✓ toggle** [user decision: tapping ✓ removes], combo "Plan includes" / single "Recommended" labeled-thumbnail mini-cards with Add⟷Added toggles, static "Self-Care Sundays" promo banner) rendered in the reused `Modal` (new backward-compatible `padded={false}` + `ariaLabel` props + the app's **first real entrance animations**: `--animate-fade-in`/`--animate-slide-up`/`--animate-rise` `@theme` tokens per design.md's spring spec; **fixed latent Modal bug**: root `z-modal` was a no-op class in this Tailwind v4 setup → `z-(--z-modal)`). Sheet state is **URL-driven** (`?service=<id>` via new `useServiceSheetParam` hook — first `useSearchParams` use in the app): browser/Android **back closes the sheet**, deep links restore it; opening pushes `state.sheet` so close = `navigate(-1)` in-app or replace-clear on deep links, with `preventScrollReset`. **Sticky cart summary bar** (reused `StickyBottomBar` + new backward-compatible `subtitle` / `position: 'sticky'` props) appears whenever the cart is non-empty: a page-level fixed bar (`animate-rise`) AND a `position="sticky"` instance inside the sheet (a11y: the bar must live inside the `aria-modal` dialog to stay reachable); badge = `cartItemCount`, subtitle = `"{first} +N more"`, Continue → `/cart`. Extracted `deriveServiceRelations` into `features/service-catalog/utils/` (now shared with `ServiceDetailPage` — behavior identical) + new pure `isInCart` selector in `useCartStore`. Row "+" quick-add is unchanged (inline qty stepper = remaining video gap #2); Home and `/services/:id` are unchanged (user decision: popup on category pages only). Verified: typecheck + build clean, **49/49 Vitest** (45 + 4 new in `serviceRelations.test.ts`), **49/49 browser checks** (open/close via Escape/backdrop/back/deep-link/invalid-id, ✓ add/remove toggle, mini-card Added state, badge counts, Continue→cart, scroll preservation, responsive 375–1440 with no overflow, sheet ≤480px centered on desktop, reduced-motion, zero unexpected console errors) + 3 screenshots.

---

## F14 — Search (New — from Figma)

> **Figma screen:** Search (184:7965)

| Step | Task | Status |
|---|---|---|
| 140 | Intel Report for F14 — wait for approval | `[x]` |
| 141 | Create search types + mock handlers (search results, recent searches) | `[x]` |
| 142 | Build SearchPage — back arrow, focused search input with purple border, "Recent Searches" list with "Clear all" link (per Figma) | `[x]` |
| 143 | Build search results view (reuse ServiceCard from F4) | `[x]` |
| 144 | 4 data states + responsive | `[x]` |

> **F14 complete (2026-07-13).** Dedicated search page on `feature/F14-search`. **No new contract section** — results consume the already-LOCKED "Service Catalog" `GET /services?search=&limit=`, whose `search` filter was already built + tested (`catalog.mock.test.ts`: name/short/long case-insensitive, no-match empty, `FORCE_500`); added one focused test for a 2-char query (the min length the page fires at). **Deliberate deviation from step 141's "mock handlers (recent searches)":** recent searches are device-local browsing history with no contract section, so they're modeled **client-side** in a persisted Zustand store (`bb-recent-searches`) rather than a server endpoint — search *results* stay server-driven. New `src/features/search/` slice: `useRecentSearchesStore` (newest-first, case-insensitive dedupe, cap 8, trim + 60-char clamp), generic `useDebouncedValue` hook (UI-only 300ms debounce — fetching stays in React Query, Rule 4), `SearchField` (back arrow + purple-border focused input + inline clear ✕, `role=search`, autofocus), `RecentSearches` (Clock rows + per-item remove + "Clear all"; first-time hint when empty), `SearchResults` (reused `ServiceCard` grid 1→2→3 cols + `DataState` 4 states + `aria-live`). New page [SearchPage](../src/pages/SearchPage.tsx) at route `/search` (`handle: { hideNav: true }`, URL-driven `?q=` via `useSearchParams` for deep-link/back, mirrored with `replace` so typing doesn't flood history): <2 chars → recents, ≥2 chars → debounced live results; recents recorded only on explicit commit (Enter / tap a recent), not per keystroke; result tap → `/services/:id`, `+` → `useCartStore.addItem` + toast (parity with Home/Catalog). **Repointed** `HomeSearchBar` from the interim `/services` to `/search`. **Reused** `ServiceCard`, `useFetchServices`, `DataState`, `Skeleton`, `useCartStore`, `useToast`, design tokens, lucide icons — no new primitives, no new packages. Verified: `npm run typecheck` + `vite build` clean (SearchPage lazy-chunked, 6.28 kB); **110/110 Vitest** (102 prior + 7 store + 1 short-query); dev server boots clean, `/search` serves 200. **Caveats:** `npm run lint` still fails repo-wide (pre-existing — ESLint flat config blocked on package approval); full browser walkthrough pending user testing (Playwright not a project dep this session); Figma 184:7965 not reachable (connector auth) — built to brand language, expect a possible design-revision pass like F4/F5.

---

## F15 — Track Van (New — from Figma)

> **Figma screen:** Track Van (184:6819)

| Step | Task | Status |
|---|---|---|
| 145 | Intel Report for F15 — wait for approval | `[x]` |
| 146 | Create tracking types + mock handlers (van location, ETA, driver/stylist info) | `[x]` |
| 147 | Build TrackVanPage — "Your Beauty Bus is on the way!" header with ETA, address bar, map placeholder, Van ID + driver info with Call button, stylist info, availability reminder card (per Figma) | `[x]` |
| 148 | 4 data states + responsive | `[x]` |

> **F15 complete (2026-07-13).** Track Van per the new **LOCKED "Tracking" contract section** (Rule 1): `Van`, `GeoPoint`, `VanTracking` entities + `GET /bookings/:id/tracking` (auth, owned-or-404 mirroring `GET /bookings/:id`; **422 `BUSINESS_RULE_VIOLATION` for COMPLETED/CANCELLED** — tracking only exists while active; `?scenario=error` → 500). Tracking is a **point-in-time snapshot** with a deterministic status mapping from the booking's state: PENDING → `NOT_DISPATCHED` (null eta/location), CONFIRMED → `EN_ROUTE` (eta = minutes-to-slot clamped 5–45) or `ARRIVING` when ≤15 min, IN_PROGRESS → `ARRIVED` (eta 0, van at destination). **Mock layer:** new read-only [`seedVans`](../src/mocks/data/vans.data.ts) (4 vans, TS plates, E.164 driver phones) assigned **deterministically by booking-id hash** (same booking always shows the same van/driver — mirrors the specialists pattern); new [`tracking.mock`](../src/mocks/handlers/tracking.mock.ts) reads the merged booking universe via `allBookings`, expands the specialist from seeds and the destination from the **real Address record** (`findAddressRecord` + `addressToLine`, lat/lng carried through; graceful fallback when the address is gone); van position = destination + small eta-scaled offset (Hyderabad city-centre fallback for un-geocoded addresses). **Feature slice** (extends `features/booking/` — same domain as F7/F8): tracking types + Zod (`vanTrackingSchema` etc., field-for-field parity), `fetchVanTracking`, `bookingKeys.tracking(id)`, `useFetchVanTracking` (**30s `refetchInterval` poll** that stops on terminal 404/422 outcomes, `[TrackVan]`-prefixed logs). **UI:** new route `/bookings/:id/track` (ProtectedRoute, `hideNav`); [TrackVanPage](../src/pages/TrackVanPage.tsx) = `TrackingStatusHero` (purple gradient banner, per-status copy + ETA + `formatDistanceToNow` freshness line, `aria-live`; h2 under the PageHeader h1), `TrackingMapPlaceholder` (decorative streets + pulsing van pin, doubles as the "not dispatched yet" visual, `role=img`, **no map SDK — Rule 10**), destination bar, van card (vanCode + mono plate + driver + **Call via `tel:` anchor**), stylist card (Avatar + rating), info reminder card. **404 and 422 route to the empty state** (not error/retry — mirrors ServiceDetailPage's 404 handling) with context-aware CTAs (View booking / My bookings). BookingDetailPage's Track Van stub repointed from the "coming soon" toast to the route. **Reused** `PageHeader`, `Card`, `Avatar`, `DataState`, `Skeleton(Card)`, `getApiError(Message)`, `requireAuth`, date-fns, Lucide — no new primitives, no new packages. Verified: typecheck + `vite build` clean; **142/142 Vitest** (129 prior + 13 new: seed↔schema, 401/404×2/422×2/500, per-status snapshots incl. eta clamp + ARRIVING via injected localStorage booking + ARRIVED-at-destination, real-address destination, deterministic van); **30/30 browser checks** (scratchpad Playwright, port 5177): detail→track navigation, EN_ROUTE/NOT_DISPATCHED/ARRIVED heroes, map/van/stylist/reminder cards, `tel:` link, back + deep-link fallback, COMPLETED→inactive + unknown-id→not-found empty states with CTAs and `[TrackVan]`-only console errors, skeleton, hidden nav, zero overflow @ 375/768/1024/1440; 2 screenshots. **Caveats:** `npm run lint` still fails repo-wide (pre-existing — ESLint flat config blocked on package approval); Figma 184:6819 not reachable this session (connector auth) — built to brand language from the checklist's screen description, expect a possible design-revision pass like F4/F5/F9; map is a static placeholder and "live" movement is only snapshot-per-poll (no real geo feed in mock).

---

## F16 — Help & Support (New — from Figma)

> **Figma screens:** Help & Support (184:7440), Call Support (184:7526), Raise a Concern (184:7537), Your Support Requests (184:7567), Success/Failed states (184:7597, 184:7607)

| Step | Task | Status |
|---|---|---|
| 149 | Add Help & Support contract section to contract.md | `[x]` |
| 150 | Intel Report for F16 — wait for approval | `[x]` |
| 151 | Create SupportRequest, FAQ types + Zod schemas | `[x]` |
| 152 | Create mock data (FAQ items, support requests) + mock handlers | `[x]` |
| 153 | Create help/support API layer + hooks | `[x]` |
| 154 | Build HelpSupportPage — FAQ accordion (expand/collapse), Call Support card (hours), Raise a Concern link, Your Support Requests link (per Figma) | `[x]` |
| 155 | Build RaiseConcernPage — form with Booking ID dropdown, Issue Type dropdown, Description textarea, "Submit Request" button (per Figma) | `[x]` |
| 156 | Build SupportRequestsPage — list of submitted requests | `[x]` |
| 157 | Build submission success/failure states (per Figma) | `[x]` |
| 158 | 4 data states + responsive | `[x]` |

> **F16 complete (2026-07-14).** Help & Support per the new **LOCKED "Help & Support" contract section** (Rule 1): `FAQ` + `SupportRequest` entities and `GET /faqs` (guest), `GET /support-requests` (auth, paginated, `createdAt` DESC), `POST /support-requests` (auth, 201; server-assigned `SR-YYYYMMDD-XXXX` `referenceCode`; optional `bookingId` must be the caller's — else 400; `bookingReferenceCode` snapshotted at creation; `FORCE_500` in the description → 500, powering the Figma failure state). Call Support contact details are **static client content by contract note** (`SUPPORT_CONTACT` in the feature — deliberately not an endpoint). **Mock layer:** read-only [`seedFaqs`](../src/mocks/data/faqs.data.ts) (8 editorial items) + [`seedSupportRequests`](../src/mocks/data/supportRequests.data.ts) (Priya ×2 — RESOLVED linked to her COMPLETED seed booking via a runtime lookup so ids/codes always match + OPEN general; Rahul ×1 → scoping proof); new [`support.mock`](../src/mocks/handlers/support.mock.ts) with seed ∪ localStorage `bb-mock-support-requests` merge (creations only — no tombstones needed; reuses `requireAuth`, `toValidationDetails`, `allBookings` for booking ownership). **Feature slice** `src/features/support/` (types → Zod → api → hooks → components → utils → barrel): `useFetchFaqs` (5min stale), `useFetchSupportRequests` (keepPreviousData, 30s), `useCreateSupportRequest` (invalidates list; **no toast — feedback is the Figma result screens**), `SUPPORT_ISSUE_TYPE_*`/`SUPPORT_STATUS_*` label+Badge-variant maps, `SupportRequestCard`, `SupportRequestStatusBadge`, `CallSupportSheet` (reused `Modal`: hours, `mailto:`, `tel:` CTA). **Pages:** [HelpSupportPage](../src/pages/HelpSupportPage.tsx) at **public `/help`** (guest FAQs per contract; FAQ `Accordion` — first real use of the F1 primitive —, "Still need help?" rows: Call support sheet / Raise a concern / Your support requests), [RaiseConcernPage](../src/pages/RaiseConcernPage.tsx) at protected `/help/concern` (RHF+Zod: booking dropdown from `useFetchBookings({limit:50})` with a `NONE` sentinel "Not related to a booking", issue-type Select, min-20 description; **in-page success/failure result states** — success shows the SR reference + "View your requests", failure's "Try again" returns to the *intact* form since RHF state lives at page level), [SupportRequestsPage](../src/pages/SupportRequestsPage.tsx) at protected `/help/requests` (URL-driven `?page=`, status badges, booking ref line, empty-state CTA → concern form). **Stubs repointed:** ProfilePage "Help & support" menu row and the Home `SupportFab` now navigate to `/help` (both "coming soon" toasts retired). **Reused** `Accordion`, `Modal`, `Card`, `Select`/`Textarea`, `Badge`, `Button`, `DataState`, `Skeleton`, `PageHeader`, `useFetchBookings`/`formatScheduledAt`, `getApiErrorMessage`, date-fns `formatDistanceToNow` — no new primitives, no new packages. Verified: `npm run typecheck` + `vite build` clean; **161/161 Vitest** (142 prior + 19 new: FAQ/request seed↔schema integrity incl. booking-link consistency, faqs sort + scenarios, list 401/scoping/sort/pagination/scenarios, create 401/400×4 (enum, empty desc, unknown + foreign bookingId)/FORCE_500/201 shape + SR code format/booking snapshot/persistence-into-list); **31/31 browser checks** (scratchpad Playwright, port 5178, priya): guest FAQ expand/collapse, call sheet hours + `tel:+918047471234` + Escape close, guest→concern login redirect with returnTo, booking dropdown seeds, empty-submit field errors, FORCE_500 → failure screen → "Try again" with values intact, happy submit → success screen with SR code → list shows it first among 3, profile-menu + home-FAB entry points, zero horizontal overflow @ 375/768/1024/1440, zero unexpected console errors; 4 screenshots. **Caveats:** `npm run lint` still fails repo-wide (pre-existing — ESLint flat config blocked on package approval per Rule 10); session ran autonomously so the step-150 Intel Report was printed and self-approved — review it in the session log; Figma 184:7440/7526/7537/7567/7597/7607 not reachable this session (connector auth) — built to brand language from the checklist's screen descriptions, expect a possible design-revision pass like F4/F5/F9.

---

## F17 — Terms, Privacy & Policies (New — from Figma)

> **Figma screen:** Terms, Privacy & Policies (184:7615)

| Step | Task | Status |
|---|---|---|
| 159 | Build TermsPoliciesPage — list: Terms of Service, Privacy Policy, Cancellation & Refund Policy, Safety & Hygiene Policy, support email contact card (per Figma) | `[x]` |
| 160 | Build policy content pages (static content, scrollable) | `[x]` |
| 161 | 4 data states + responsive | `[x]` |

> **F17 complete (2026-07-14).** Terms & policies on `feature/F17-terms-policies`. **No contract section** — policy copy is static client content by contract convention (mirrors F16's `SUPPORT_CONTACT` "deliberately not an endpoint" precedent; JSDoc note in the content module points at contract.md). New `src/features/policies/` mini-slice: [`POLICIES`](../src/features/policies/content/policies.ts) const (4 documents × 4 sections each, sentence-case titles per the design.md voice guide; the cancellation policy states the real F8 **2-hour** cancel/reschedule rule and the checkout tax/pricing copy matches the locked Cart contract). New public routes `/policies` ([TermsPoliciesPage](../src/pages/TermsPoliciesPage.tsx) — HelpSupportPage-pattern list rows: icon badge + title + summary + ChevronRight, plus a support **email contact card** reusing `SUPPORT_CONTACT.email` as `mailto:`) and `/policies/:slug` ([PolicyPage](../src/pages/PolicyPage.tsx) — one dynamic page for all 4 documents: "Last updated" line + scrollable prose sections in a Card). **ProfilePage "Terms & policies" menu stub retired** (`soon:` toast → `to: '/policies'` — the exact F16 repoint pattern; this was the app's last "coming soon" menu row). **4-states note (deliberate interpretation):** content is static — loading/error don't apply; the empty state is the unknown-slug case, routed through the reused `DataState` (`FileQuestion` icon + "Back to policies" CTA, mirroring ServiceDetailPage's 404 handling). **Reused** `PageHeader`, `Card`, `DataState`, `SUPPORT_CONTACT`, date-fns `format`, Lucide icons — no new primitives, no new packages. Verified: `npm run typecheck` + `vite build` clean (PolicyPage 1.60 kB + TermsPoliciesPage 3.02 kB lazy chunks); **161/161 Vitest** (no new server surface — nothing to add); **26/26 browser checks** (scratchpad Playwright, port 5179): list order/titles/summaries, mailto card, all 4 detail pages (title + last-updated + ≥3 sections), 2h-rule copy present, back navigation list↔detail↔profile, unknown-slug empty state + CTA, profile-menu entry point (stub gone), zero horizontal overflow @ 375/768/1024/1440, zero console errors; 2 screenshots. **Caveats:** `npm run lint` still fails repo-wide (pre-existing — planned fix in F12 with the now-approved typescript-eslint packages); Figma 184:7615 not reachable this session (connector auth) — built to brand language from the checklist's screen description, expect a possible design-revision pass like F4/F5/F9; policy copy is editorial first-draft — legal review pending before launch.

---

## Progress Summary

| Feature | Steps | Completed | Status |
|---|---|---|---|
| F0 — Scaffold | 10 | 10 | `[x]` Complete |
| F1 — Design System | 15 | 15 | `[x]` Complete |
| F2 — App Shell | 7 | 7 | `[x]` Complete |
| F3 — Home | 11 | 11 | `[x]` Complete |
| F4 — Catalog | 11 | 11 | `[x]` Complete |
| F5 — Details | 7 | 7 | `[x]` Complete |
| F6 — Auth | 11 | 11 | `[x]` Complete |
| F7 — Booking (integrated checkout) | 15 | 15 | `[x]` Complete |
| F8 — My Bookings | 10 | 10 | `[x]` Complete |
| F9 — Profile | 8 | 8 | `[x]` Complete |
| F10 — Reviews | 9 | 9 | `[x]` Complete |
| F11 — Alerts & Notif Settings | 9 | 9 | `[x]` Complete |
| F12 — Polish | 6 | 0 | `[ ]` Not started |
| F13 — Cart & Checkout (+ addendum) | 16 | 16 | `[x]` Complete |
| F14 — Search | 5 | 5 | `[x]` Complete |
| F15 — Track Van | 4 | 4 | `[x]` Complete |
| F16 — Help & Support | 10 | 10 | `[x]` Complete |
| F17 — Terms & Policies | 3 | 3 | `[x]` Complete |
| **TOTAL** | **166** | **161** | **97%** |

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
