# API Contract — Beauty Bus

> **This document is the canonical API contract.** If this document and the code disagree, this document is correct. Mocks implement this contract exactly. The real backend will implement this contract exactly. No invented fields, no skipped envelopes.

---

## Global Conventions

| Convention | Rule |
|---|---|
| ID format | UUID v4 (e.g., `"a1b2c3d4-e5f6-7890-abcd-ef1234567890"`) |
| JSON key casing | camelCase |
| Enum value casing | UPPER_SNAKE_CASE |
| Resource path casing | kebab-case, plural (e.g., `/api/v1/time-slots`) |
| Money representation | `{ amount: integer (minor units), currency: string (ISO 4217) }` — e.g., `{ amount: 5000, currency: "USD" }` = $50.00 |
| Duration | Integer minutes |
| Dates | ISO 8601 UTC — `"2026-06-11T14:30:00.000Z"` |
| Base path | `/api/v1` |
| Content type | `application/json` |

---

## Response Envelopes

### Success — Single Resource

```json
{
  "success": true,
  "data": { },
  "error": null
}
```

### Success — Paginated List

```json
{
  "success": true,
  "data": [ ],
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
    "code": "ERROR_CODE",
    "message": "Human-readable error message.",
    "timestamp": "2026-06-11T12:00:00.000Z",
    "path": "/api/v1/resource/id",
    "details": [
      { "field": "email", "message": "Email is already registered." }
    ]
  }
}
```

---

## Error Codes

| Code | HTTP Status | Description |
|---|---|---|
| `RESOURCE_NOT_FOUND` | 404 | Requested entity does not exist |
| `UNAUTHORIZED` | 401 | Missing, invalid, or expired auth token |
| `FORBIDDEN` | 403 | Valid token but insufficient permissions |
| `VALIDATION_ERROR` | 400 | Request body or params fail validation |
| `SLOT_UNAVAILABLE` | 409 | Requested time slot is no longer available |
| `BUSINESS_RULE_VIOLATION` | 422 | Action violates a business rule (e.g., cancelling < 2h before appointment) |
| `CONFLICT` | 409 | Duplicate resource (e.g., email already registered) |
| `INTERNAL_ERROR` | 500 | Unexpected server-side error |

---

## Authentication Flow

| Aspect | Detail |
|---|---|
| Strategy | JWT (access + refresh) |
| Access token | 15-minute expiry, sent as `Authorization: Bearer <token>` |
| Refresh token | 7-day expiry, httpOnly cookie or body (mock uses body), rotated on use |
| Guest browsing | Service catalog, service details, specialist profiles — no auth required |
| Auth required | Booking creation, my bookings, profile, addresses, reviews |
| Roles | Single role: `CUSTOMER` |
| Registration | Email + password + firstName + lastName + phone |
| Login | Email + password → access token + refresh token |

---

## Entity Index

> **STATUS: DRAFT** — all entities below are draft. Field additions/changes are expected as sections are locked.

### User

| Field | Type | Notes |
|---|---|---|
| id | UUID | Primary key |
| email | string | Unique, lowercase |
| firstName | string | |
| lastName | string | |
| phone | string | E.164 format |
| avatarUrl | string | null | Optional |
| role | enum | `CUSTOMER` |
| createdAt | ISO 8601 | |
| updatedAt | ISO 8601 | |

### ServiceCategory

| Field | Type | Notes |
|---|---|---|
| id | UUID | |
| name | string | The 6 categories per Figma: "Men", "Women", "Kids", "Seniors", "Bride", "Groom" |
| slug | string | URL-safe, unique |
| description | string | |
| imageUrl | string | Category thumbnail (person image on gradient grid card) |
| heroImageUrl | string | Wide hero image for the category detail page |
| serviceCount | integer | Number of services in category |
| sortOrder | integer | Display order |

### Service

| Field | Type | Notes |
|---|---|---|
| id | UUID | |
| categoryId | UUID | FK → ServiceCategory |
| type | enum | `COMBO` \| `SINGLE` — combos are bundled services (per Figma) |
| name | string | |
| description | string | |
| shortDescription | string | max 120 chars for cards |
| imageUrl | string | Primary image |
| galleryUrls | string[] | Additional images |
| price | Money | `{ amount, currency }` — effective (discounted) price, currency `INR` |
| originalPrice | Money \| null | Pre-discount price (strikethrough in UI); `null` when no discount |
| discountPercent | integer \| null | e.g., `20` renders the "20% OFF" badge; `null` when no discount |
| includedServiceIds | UUID[] | For `COMBO`: the bundled SINGLE service IDs; empty for `SINGLE` |
| duration | integer | Minutes |
| isPopular | boolean | Featured flag |
| rating | number | 0.0–5.0, one decimal |
| reviewCount | integer | |
| tags | string[] | e.g., `["trending", "new"]` |
| createdAt | ISO 8601 | |

### Specialist

| Field | Type | Notes |
|---|---|---|
| id | UUID | |
| firstName | string | |
| lastName | string | |
| avatarUrl | string | |
| bio | string | Short professional bio |
| specialties | string[] | e.g., `["Hair Coloring", "Balayage"]` |
| rating | number | 0.0–5.0 |
| reviewCount | integer | |
| yearsOfExperience | integer | |
| serviceIds | UUID[] | Services this specialist offers |

### TimeSlot

> A capacity-level **arrival window** for the at-home service van/team — availability is per city-wide capacity, not per specialist (specialists are system-assigned at booking creation). Hourly windows, 09:00–18:00 start times. The booked services' duration comes from the booking's items, not the slot.

| Field | Type | Notes |
|---|---|---|
| id | UUID | Opaque to clients; stable for a given date + startTime |
| date | string | `YYYY-MM-DD` |
| startTime | string | `HH:mm` (24h) — arrival-window start |
| endTime | string | `HH:mm` (24h) — arrival-window end (start + 60 min) |
| isAvailable | boolean | `false` when capacity is exhausted or the window has passed |

### Address

| Field | Type | Notes |
|---|---|---|
| id | UUID | |
| userId | UUID | FK → User |
| label | string | e.g., "Home", "Office" |
| street | string | |
| apartment | string | null | Unit/apt number |
| city | string | |
| state | string | |
| zipCode | string | |
| country | string | ISO 3166-1 alpha-2 |
| latitude | number | null | For map display |
| longitude | number | null | For map display |
| isDefault | boolean | |
| createdAt | ISO 8601 | |

### Booking

> The scheduled appointment created at checkout. Carries the ordered items + payment breakdown as immutable snapshots (superseding the retired `Order` entity). The specialist is **system-assigned at creation** — never client-supplied.

| Field | Type | Notes |
|---|---|---|
| id | UUID | |
| userId | UUID | FK → User |
| referenceCode | string | e.g., `"BB-20260713-A3F2"` — shown on confirmation + booking cards |
| items | CartItem[] | Snapshot of the ordered (selected) items |
| paymentSummary | PaymentSummary | Snapshot of the final breakdown |
| addressId | UUID | FK → Address (selected at checkout) |
| specialistId | UUID | FK → Specialist — system-assigned at creation |
| status | enum | See lifecycle below (`PENDING` at creation) |
| scheduledAt | ISO 8601 | The booked slot's date + startTime as a UTC instant |
| duration | integer | Minutes — Σ `service.duration × quantity` over items |
| notes | string \| null | Customer notes |
| cancellationReason | string \| null | Filled on cancel |
| createdAt | ISO 8601 | |
| updatedAt | ISO 8601 | |
| specialist | Specialist | Expanded in detail responses only |
| address | Address | Expanded in detail responses only (real Address data lands with F9) |

### Review

| Field | Type | Notes |
|---|---|---|
| id | UUID | |
| userId | UUID | FK → User |
| serviceId | UUID | FK → Service |
| bookingId | UUID | FK → Booking (one review per booking) |
| rating | integer | 1–5 |
| comment | string | |
| createdAt | ISO 8601 | |
| user | `{ firstName, avatarUrl }` | Expanded in list responses |

### Notification

| Field | Type | Notes |
|---|---|---|
| id | UUID | |
| userId | UUID | FK → User |
| type | enum | `BOOKING_CONFIRMED`, `BOOKING_REMINDER`, `BOOKING_CANCELLED`, `REVIEW_REQUEST`, `PROMO` |
| title | string | |
| message | string | |
| isRead | boolean | |
| referenceId | UUID | null | Related entity ID |
| referenceType | string | null | e.g., `"BOOKING"` |
| createdAt | ISO 8601 | |

> **Category (derived, not stored):** the Alerts feed's Bookings/Offers tabs map to
> `type` groups — `BOOKING` = `BOOKING_CONFIRMED`/`BOOKING_REMINDER`/`BOOKING_CANCELLED`/`REVIEW_REQUEST`,
> `OFFER` = `PROMO`.

### NotificationSettings

> Per-user notification preferences singleton backing the Notification Settings screen
> (F11). Not a list. The mock returns all-`true` defaults when a user has never saved.

| Field | Type | Notes |
|---|---|---|
| userId | UUID | FK → User (the owner) |
| whatsappEnabled | boolean | WhatsApp updates opt-in ("Connect on WhatsApp" row) |
| bookingUpdates | boolean | Booking status/reminder notifications |
| servicePromotions | boolean | Promotional offers |
| referralRewards | boolean | Referral reward notifications |
| feedbackRequests | boolean | Post-service review/feedback requests |
| updatedAt | ISO 8601 | |

### Offer

> Home-screen promotional banner ("Offers for You"). Editorial/curated content — not tied to a Service.

| Field | Type | Notes |
|---|---|---|
| id | UUID | |
| title | string | e.g., "Salon Luxury, Now on Wheels" |
| subtitle | string | Supporting line |
| ctaLabel | string | Short button label (max 3 words), e.g., "Book now" |
| targetPath | string | In-app route the CTA navigates to, e.g., `/services` |
| imageUrl | string | Banner image |
| theme | enum | `DARK` \| `PRIMARY` — card colour treatment |
| sortOrder | integer | Display order |

### Testimonial

> Home-screen featured testimonial ("What Our Customers Say"). Curated/featured content, distinct from the per-service **Review** entity (Reviews feature, F10) — a Testimonial is not tied to a booking and carries only display fields.

| Field | Type | Notes |
|---|---|---|
| id | UUID | |
| authorName | string | e.g., "Meenal R." |
| authorLocation | string | e.g., "Madhapur" |
| avatarUrl | string | null | Optional; UI falls back to initials |
| rating | integer | 1–5 |
| quote | string | The testimonial text |
| createdAt | ISO 8601 | |

### Referral

> Referral reward info for the home "Share the Beauty, Get Rewarded" card. Single resource (no list). Guest-visible; rewards are the same for everyone in MVP.

| Field | Type | Notes |
|---|---|---|
| code | string | Shareable referral code, e.g., `"BEAUTY100"` |
| referrerReward | Money | What the referrer earns |
| refereeDiscount | Money | What the new customer gets off their first service |

### CartItem

> A single line in the cart. The cart itself is client-state (persisted in the browser, guest-friendly) — this entity documents the shape the client holds and sends to the pricing/order endpoints. `service` is the expanded Service snapshot so the cart survives without re-fetching.

| Field | Type | Notes |
|---|---|---|
| serviceId | UUID | FK → Service |
| service | Service | Expanded Service snapshot (name, price, imageUrl, duration, etc.) |
| quantity | integer | ≥ 1; defaults to 1 |
| selected | boolean | Whether this line is included in the checkout total (per-item checkbox in the Figma cart) |
| lineTotal | Money | `service.price × quantity` — snapshot for display; server recomputes authoritatively |

### Coupon

> A promotional discount applied at checkout ("Offers & Coupons"). Curated list; not tied to a Service.

| Field | Type | Notes |
|---|---|---|
| code | string | Uppercase, unique — the code the user enters, e.g., `"SAVE20"` |
| label | string | Short display name, e.g., "20% off" |
| description | string | One-line explainer, e.g., "20% off orders above ₹999" |
| discountType | enum | `PERCENT` \| `FLAT` |
| discountValue | integer | For `PERCENT`: whole percent (e.g., `20`); for `FLAT`: amount in minor units (paise) |
| minSubtotal | Money \| null | Minimum eligible service-charges subtotal; `null` = no minimum |
| maxDiscount | Money \| null | Cap on the discount for `PERCENT` coupons; `null` = uncapped |

### PaymentSummary

> The checkout price breakdown, computed server-side from the selected cart items + optional coupon. All amounts in minor units, `INR`.

| Field | Type | Notes |
|---|---|---|
| serviceCharges | Money | Σ of selected `lineTotal` (pre-discount, pre-tax) |
| discount | Money | Amount removed by `appliedCoupon`; `{ amount: 0 }` when none |
| taxes | Money | `round((serviceCharges − discount) × taxRatePercent / 100)` |
| total | Money | `serviceCharges − discount + taxes` |
| appliedCoupon | Coupon \| null | The coupon applied, or `null` |
| taxRatePercent | integer | Tax rate used, e.g., `18` (GST) |

### Order

> **Superseded (2026-07-13):** replaced by the amended `Booking` entity — checkout now creates a scheduled Booking directly (F7). See the change log.

### Van

> The service van + driver pairing assigned to a dispatched booking (F15 Track Van). Deterministically assigned by the system — never client-selected. Only surfaced inside `VanTracking`.

| Field | Type | Notes |
|---|---|---|
| vanCode | string | Display ID, e.g., `"BB-VAN-03"` |
| vehicleNumber | string | Registration plate, e.g., `"TS 09 EB 4721"` |
| driverName | string | |
| driverPhone | string | E.164 — powers the Call button (`tel:`) |

### GeoPoint

> A latitude/longitude pair for map display.

| Field | Type | Notes |
|---|---|---|
| latitude | number | |
| longitude | number | |

### VanTracking

> The live tracking snapshot for an active booking (F15 Track Van screen). A point-in-time snapshot — the client refetches to update; no streaming in MVP. `status` is derived from the booking's state and time-to-slot.

| Field | Type | Notes |
|---|---|---|
| bookingId | UUID | FK → Booking |
| status | enum | `NOT_DISPATCHED` \| `EN_ROUTE` \| `ARRIVING` \| `ARRIVED` |
| etaMinutes | integer \| null | Minutes until arrival; `null` when `NOT_DISPATCHED`, `0` when `ARRIVED` |
| van | Van | The assigned van + driver |
| specialist | Specialist | The booking's assigned stylist (expanded) |
| destination | `{ label, line, latitude: number\|null, longitude: number\|null }` | The booking address as a display line + optional coordinates |
| currentLocation | GeoPoint \| null | Van position; `null` when `NOT_DISPATCHED` |
| updatedAt | ISO 8601 | Snapshot time |

**Status mapping (deterministic):** booking `PENDING` → `NOT_DISPATCHED`; booking `CONFIRMED` → `EN_ROUTE` (`etaMinutes` = minutes until `scheduledAt`, clamped 5–45), or `ARRIVING` when ≤ 15 minutes remain; booking `IN_PROGRESS` → `ARRIVED` (`etaMinutes: 0`). `COMPLETED`/`CANCELLED` bookings have no tracking (422 — see endpoint).

### FAQ

> A frequently-asked question shown on the Help & Support screen (F16). Editorial content — guest-readable, read-only from the client.

| Field | Type | Notes |
|---|---|---|
| id | UUID | |
| question | string | |
| answer | string | Plain text |
| sortOrder | integer | Display order, ascending |

### SupportRequest

> A customer concern raised from Help & Support (F16). Optionally linked to one of the caller's bookings. Status moves server-side only — the client creates and reads, never updates.

| Field | Type | Notes |
|---|---|---|
| id | UUID | |
| userId | UUID | FK → User |
| referenceCode | string | e.g., `"SR-20260714-B7K2"` — shown on the success screen + request list |
| bookingId | UUID \| null | FK → Booking — `null` when not related to a booking |
| bookingReferenceCode | string \| null | Display snapshot of the linked booking's reference, set server-side at creation |
| issueType | enum | `BOOKING_ISSUE` \| `PAYMENT_ISSUE` \| `SERVICE_QUALITY` \| `APP_ISSUE` \| `OTHER` |
| description | string | |
| status | enum | `OPEN` \| `IN_REVIEW` \| `RESOLVED` \| `CLOSED` — `OPEN` at creation |
| createdAt | ISO 8601 | |
| updatedAt | ISO 8601 | |

---

## Booking Status Lifecycle

```
  PENDING ──────► CONFIRMED ──────► IN_PROGRESS ──────► COMPLETED
     │                │
     │                │
     ▼                ▼
  CANCELLED       CANCELLED
```

| Transition | Trigger | Rule |
|---|---|---|
| → PENDING | Customer creates booking | Initial status |
| PENDING → CONFIRMED | System/admin confirms | Auto-confirm in MVP |
| CONFIRMED → IN_PROGRESS | Specialist begins service | At scheduledAt time |
| IN_PROGRESS → COMPLETED | Specialist finishes | After duration elapsed |
| PENDING → CANCELLED | Customer cancels | Allowed anytime |
| CONFIRMED → CANCELLED | Customer cancels | Only if `scheduledAt` is > 2 hours from now |
| CONFIRMED → CANCELLED (late) | Blocked | Returns `BUSINESS_RULE_VIOLATION` |

---

## Endpoint Index

### Auth — `STATUS: LOCKED (2026-07-12)`

| Method | Path | Description | Auth |
|---|---|---|---|
| POST | `/api/v1/auth/register` | Register new customer | No |
| POST | `/api/v1/auth/login` | Login with email + password | No |
| POST | `/api/v1/auth/refresh` | Refresh access token | Refresh token |
| POST | `/api/v1/auth/logout` | Invalidate refresh token | Yes |
| GET | `/api/v1/auth/me` | Get current user profile | Yes |

**POST `/api/v1/auth/register`**
```json
// Request
{ "email": "string", "password": "string", "firstName": "string", "lastName": "string", "phone": "string" }
// Response: Success envelope with { accessToken, refreshToken, user }
```

**POST `/api/v1/auth/login`**
```json
// Request
{ "email": "string", "password": "string" }
// Response: Success envelope with { accessToken, refreshToken, user }
```

**POST `/api/v1/auth/refresh`**
```json
// Request
{ "refreshToken": "string" }
// Response: Success envelope with { accessToken, refreshToken }
```

---

### Service Catalog — `STATUS: LOCKED (2026-07-13)`

| Method | Path | Description | Auth |
|---|---|---|---|
| GET | `/api/v1/categories` | List all service categories | No |
| GET | `/api/v1/services` | List services (filter, search, paginate) | No |
| GET | `/api/v1/services/:id` | Service detail | No |
| GET | `/api/v1/specialists` | List specialists (optional serviceId filter) | No |
| GET | `/api/v1/specialists/:id` | Specialist detail | No |

**GET `/api/v1/services`** — Query params:
- `categoryId` (UUID) — filter by category
- `type` (`COMBO` | `SINGLE`) — filter by service type
- `search` (string) — full-text search on name/description
- `isPopular` (boolean) — filter popular services
- `minPrice` / `maxPrice` (integer, minor units) — price range
- `sortBy` (`price_asc`, `price_desc`, `rating`, `name`) — sort order
- `page` (integer, default 1) — page number
- `limit` (integer, default 20, max 100) — items per page

---

### Home & Promotions — `STATUS: LOCKED (2026-07-13)`

> Backs the F3 Home screen's editorial sections. All endpoints are guest-allowed (the home screen renders for logged-out visitors). Offers and testimonials are small curated lists returned in the single-resource envelope (a JSON array in `data`, no pagination) — mirroring `GET /categories`.

| Method | Path | Description | Auth |
|---|---|---|---|
| GET | `/api/v1/offers` | List active promotional offers ("Offers for You") | No |
| GET | `/api/v1/testimonials` | List featured customer testimonials | No |
| GET | `/api/v1/referral` | Get referral reward info for the "Share the Beauty" card | No |

**GET `/api/v1/offers`** — Response: Success envelope with `Offer[]` (sorted by `sortOrder`).

**GET `/api/v1/testimonials`** — Response: Success envelope with `Testimonial[]`.

**GET `/api/v1/referral`** — Response: Success envelope with a single `Referral`.

---

### Cart & Checkout — `STATUS: LOCKED (2026-07-13)`

> Backs the F13 Cart & Checkout flow. The **cart itself is client-state** (persisted in the browser via `useCartStore` — guest-friendly, no cart endpoints). These endpoints cover what must be server-authoritative: available coupons and price computation. `/coupons` and `/checkout/summary` are guest-allowed (a visitor can price a cart before logging in).
>
> **POST /orders — superseded (2026-07-13):** replaced by `POST /bookings` (Availability & Booking), which adds `timeSlotId` to the same payload and returns a scheduled Booking. `GET /coupons` and `POST /checkout/summary` are unchanged.

| Method | Path | Description | Auth |
|---|---|---|---|
| GET | `/api/v1/coupons` | List available promotional coupons | No |
| POST | `/api/v1/checkout/summary` | Compute the payment breakdown for a set of items (+ optional coupon) | No |

**GET `/api/v1/coupons`** — Response: Success envelope with `Coupon[]` (curated list in `data`, no pagination — mirrors `/offers`). Supports `?scenario=empty|error` for state testing.

**POST `/api/v1/checkout/summary`**
```json
// Request
{
  "items": [{ "serviceId": "UUID", "quantity": 1 }],
  "couponCode": "string | null"
}
// Response: Success envelope with a PaymentSummary
// Error: VALIDATION_ERROR (400) — empty items, unknown serviceId, or unknown couponCode
// Error: BUSINESS_RULE_VIOLATION (422) — coupon minSubtotal not met
```

---

### Availability & Booking — `STATUS: LOCKED (2026-07-13)`

> Backs F7 (slot selection + booking creation inside checkout) and F8 (My Bookings). Slots are capacity-level arrival windows queried **by date only** — no specialist or service inputs; the system assigns a specialist at booking creation. `POST /bookings` supersedes the retired `POST /orders`: it takes the checkout payload plus a `timeSlotId` and returns the scheduled Booking.

| Method | Path | Description | Auth |
|---|---|---|---|
| GET | `/api/v1/time-slots` | Arrival windows for a date | No |
| POST | `/api/v1/bookings` | Create a booking from the checkout payload | Yes |
| GET | `/api/v1/bookings` | List my bookings (paginated, filter by status) | Yes |
| GET | `/api/v1/bookings/:id` | Booking detail (expanded specialist + address) | Yes |
| PATCH | `/api/v1/bookings/:id/reschedule` | Move a booking to a new slot | Yes |
| PATCH | `/api/v1/bookings/:id/cancel` | Cancel a booking | Yes |

**GET `/api/v1/time-slots`** — Query params:
- `date` (`YYYY-MM-DD`, required)

Response: Success envelope with `TimeSlot[]` sorted by `startTime` (single-resource envelope, no pagination — mirrors `/coupons`). Past dates and dates beyond the 14-day booking horizon return an **empty array** (not an error); for today, windows whose startTime has passed are `isAvailable: false`. `VALIDATION_ERROR` (400) on a missing or malformed `date`. Mock supports `?scenario=empty|error` for state testing.

**POST `/api/v1/bookings`**
```json
// Request
{
  "items": [{ "serviceId": "UUID", "quantity": 1 }],
  "couponCode": "string | null",
  "addressId": "UUID",
  "timeSlotId": "UUID",
  "notes": "string | null"
}
// Response 201: Success envelope with a Booking (status: PENDING, system-assigned
//               specialistId, scheduledAt from the slot, priced server-side exactly
//               like POST /checkout/summary)
// Error: UNAUTHORIZED (401) — no/invalid access token
// Error: VALIDATION_ERROR (400) — empty items, unknown serviceId/couponCode,
//        missing addressId, malformed timeSlotId
// Error: BUSINESS_RULE_VIOLATION (422) — coupon minSubtotal not met
// Error: SLOT_UNAVAILABLE (409) — slot no longer available (taken, past, or outside
//        the horizon). Client recovery: clear the selection, refetch slots, reopen
//        the picker.
```

**GET `/api/v1/bookings`** — Query params: `status` (optional, comma-separated BookingStatus values, e.g. `?status=PENDING,CONFIRMED`), `page`, `limit` (paginated envelope). Sorted by `scheduledAt` descending. Returns only the caller's bookings. *(Mock handlers land in F8 — contract locked here.)*

**GET `/api/v1/bookings/:id`** — Booking with expanded `specialist` + `address`. `RESOURCE_NOT_FOUND` (404) when the id does not exist **or belongs to another user**.

**PATCH `/api/v1/bookings/:id/reschedule`**
```json
// Request
{ "timeSlotId": "UUID" }
// Response: Success envelope with updated Booking (new scheduledAt, updatedAt)
// Error: SLOT_UNAVAILABLE (409); BUSINESS_RULE_VIOLATION (422) if status is not
//        PENDING or CONFIRMED, or < 2h before the current scheduledAt
```

**PATCH `/api/v1/bookings/:id/cancel`**
```json
// Request
{ "cancellationReason": "string" }
// Response: Success envelope with updated Booking (status: CANCELLED)
// Error: BUSINESS_RULE_VIOLATION (422) if < 2h before scheduledAt or status is not
//        PENDING/CONFIRMED
```

---

### Profile & Addresses — `STATUS: LOCKED (2026-07-13)`

> Backs F9. `GET /profile` returns the same `User` shape as `GET /auth/me` (the profile screen's source of truth). Addresses are per-user and scoped by the access token — a caller only ever sees, edits, or deletes their own. Setting `isDefault: true` on an address (via POST or PATCH) is **exclusive**: the mock unsets `isDefault` on the user's other addresses in the same operation, so exactly one default exists. The first address a user creates is forced to `isDefault: true`.

| Method | Path | Description | Auth |
|---|---|---|---|
| GET | `/api/v1/profile` | Get current user profile (same `User` as `/auth/me`) | Yes |
| PATCH | `/api/v1/profile` | Update profile fields | Yes |
| GET | `/api/v1/addresses` | List user's addresses (single-resource envelope, `Address[]`, default first) | Yes |
| POST | `/api/v1/addresses` | Add a new address | Yes |
| PATCH | `/api/v1/addresses/:id` | Update an address | Yes |
| DELETE | `/api/v1/addresses/:id` | Delete an address | Yes |

**GET `/api/v1/addresses`** — Response: Success envelope with `Address[]` (the caller's addresses, default first then newest). Supports `?scenario=empty|error` for state testing.

**PATCH `/api/v1/profile`**
```json
// Request (partial update — any subset)
{ "firstName": "string", "lastName": "string", "phone": "string" }
// Response: Success envelope with the updated User (updatedAt refreshed)
// Error: UNAUTHORIZED (401); VALIDATION_ERROR (400) on malformed fields
```

**POST `/api/v1/addresses`**
```json
// Request
{ "label": "string", "street": "string", "apartment": "string | null",
  "city": "string", "state": "string", "zipCode": "string",
  "country": "string", "isDefault": boolean }
// Response 201: Success envelope with the created Address
// Error: UNAUTHORIZED (401); VALIDATION_ERROR (400)
```

**PATCH `/api/v1/addresses/:id`** — Partial update of any address field. `RESOURCE_NOT_FOUND` (404) when the id does not exist or belongs to another user; `VALIDATION_ERROR` (400) on malformed fields.

**DELETE `/api/v1/addresses/:id`** — Business rule: cannot delete an address used by an upcoming (`PENDING` or `CONFIRMED`) booking. Returns `BUSINESS_RULE_VIOLATION` (422) with details. `RESOURCE_NOT_FOUND` (404) when the id does not exist or belongs to another user. Deleting the default address promotes the next address (if any) to default.

---

### Reviews (Post-MVP) — `STATUS: LOCKED (2026-07-14)`

> Backs F10. A review is written **for one service of a completed booking** — the request
> carries a `serviceId` that must be one of the booking's `items[].serviceId` (multi-service
> bookings pick which service the review is about; user decision 2026-07-14). Uniqueness is
> **one review per booking** (`bookingId` FK note) — a second attempt returns 409 `CONFLICT`
> regardless of service. `Service.rating` / `Service.reviewCount` are backend-maintained
> aggregates; **the mock does not recompute them** when a review is created (documented mock
> limitation — the live review list is the source of truth on the service page).

| Method | Path | Description | Auth |
|---|---|---|---|
| POST | `/api/v1/reviews` | Create a review for a completed booking | Yes |
| GET | `/api/v1/services/:id/reviews` | List reviews for a service (paginated) | No |

**POST `/api/v1/reviews`**
```json
// Request
{ "bookingId": "UUID", "serviceId": "UUID", "rating": 1-5, "comment": "string (10–500 chars)" }
// Response 201: single-resource envelope with the created Review (user expanded)
```
- `VALIDATION_ERROR` (400) — malformed body; unknown `bookingId`; `bookingId` belonging to another user (indistinguishable from unknown, mirrors owned-or-404); `serviceId` not among the booking's `items[].serviceId`.
- `BUSINESS_RULE_VIOLATION` (422) — booking status is not `COMPLETED`.
- `CONFLICT` (409) — a review already exists for this booking.
- `UNAUTHORIZED` (401) — no/expired token.

**GET `/api/v1/services/:id/reviews`** — guest-accessible. Paginated envelope, `createdAt` DESC. Query: `page` (default 1), `limit` (default 10, max 100). Each item expands `user { firstName, avatarUrl }`. `RESOURCE_NOT_FOUND` (404) when the service id does not exist. `?scenario=empty|error` supported (mock-only test triggers, consistent with other sections).

---

### Notifications — `STATUS: LOCKED (2026-07-13)`

> Backs F11 (Alerts feed + Notification Settings). All endpoints require auth (a caller
> only ever sees/mutates their own notifications). The alerts feed has 3 tabs (All /
> Bookings / Offers per Figma) — the `category` query param maps a tab to notification
> types: `BOOKING` = `BOOKING_CONFIRMED`/`BOOKING_REMINDER`/`BOOKING_CANCELLED`/`REVIEW_REQUEST`,
> `OFFER` = `PROMO`. Category is **derived from `type`** — it is not a stored entity field.
> `NotificationSettings` is a per-user singleton (WhatsApp opt-in + 4 channel toggles); the
> mock returns sensible defaults (all on) when a user has never saved settings.

| Method | Path | Description | Auth |
|---|---|---|---|
| GET | `/api/v1/notifications` | List user's notifications (paginated, `?category`) | Yes |
| GET | `/api/v1/notifications/unread-count` | Unread count for the nav badge | Yes |
| PATCH | `/api/v1/notifications/:id/read` | Mark one notification as read | Yes |
| PATCH | `/api/v1/notifications/mark-all-read` | Mark all notifications as read | Yes |
| DELETE | `/api/v1/notifications/:id` | Dismiss (remove) a notification | Yes |
| GET | `/api/v1/notification-settings` | Get the user's notification preferences | Yes |
| PATCH | `/api/v1/notification-settings` | Update notification preferences (partial) | Yes |

**GET `/api/v1/notifications`** — Query params:
- `category` (`BOOKING` | `OFFER`) — optional tab filter (omitted = all)
- `page` (integer, default 1), `limit` (integer, default 20)

Response: paginated envelope with `Notification[]` sorted by `createdAt` descending.
Supports `?scenario=empty|error` for state testing.

**GET `/api/v1/notifications/unread-count`** — Response: single-resource envelope with
`{ count: integer }` (the caller's unread notifications).

**PATCH `/api/v1/notifications/:id/read`** — Response: single-resource envelope with the
updated `Notification` (`isRead: true`). `RESOURCE_NOT_FOUND` (404) when the id does not
exist or belongs to another user. Idempotent (already-read stays read).

**PATCH `/api/v1/notifications/mark-all-read`** — Response: single-resource envelope with
`{ updated: integer }` (how many were flipped).

**DELETE `/api/v1/notifications/:id`** — Response: single-resource envelope with `null`.
`RESOURCE_NOT_FOUND` (404) when the id does not exist or belongs to another user.

**GET `/api/v1/notification-settings`** — Response: single-resource envelope with a
`NotificationSettings`.

**PATCH `/api/v1/notification-settings`**
```json
// Request (partial — any subset)
{ "whatsappEnabled": boolean, "bookingUpdates": boolean, "servicePromotions": boolean,
  "referralRewards": boolean, "feedbackRequests": boolean }
// Response: single-resource envelope with the updated NotificationSettings
// Error: UNAUTHORIZED (401); VALIDATION_ERROR (400) on malformed fields
```

---

### Tracking — `STATUS: LOCKED (2026-07-13)`

> Backs F15 Track Van. A single read endpoint returning a point-in-time `VanTracking` snapshot for one of the caller's active bookings. Auth required; ownership follows the booking rules (owned-or-404). Tracking exists only while a booking is active — `PENDING`/`CONFIRMED`/`IN_PROGRESS`; `COMPLETED` and `CANCELLED` bookings return 422.

| Method | Path | Description | Auth |
|---|---|---|---|
| GET | `/api/v1/bookings/:id/tracking` | Van tracking snapshot for an active booking | Yes |

**GET `/api/v1/bookings/:id/tracking`**
```json
// Response: Success envelope with a VanTracking
// Error: UNAUTHORIZED (401) — no/invalid access token
// Error: RESOURCE_NOT_FOUND (404) — unknown id or another user's booking
// Error: BUSINESS_RULE_VIOLATION (422) — booking is COMPLETED or CANCELLED
//        ("Tracking is only available for active bookings.")
// Mock supports ?scenario=error → 500 for state testing.
```

---

### Help & Support — `STATUS: LOCKED (2026-07-14)`

> Backs F16 Help & Support. FAQs are guest-readable editorial content; support requests are auth-scoped (caller's own only). The Call Support card (phone number + hours) is **static client content** — deliberately not an endpoint; if support contact details ever become dynamic, add an endpoint here first.

| Method | Path | Description | Auth |
|---|---|---|---|
| GET | `/api/v1/faqs` | FAQ list for the Help & Support screen | No |
| GET | `/api/v1/support-requests` | The caller's support requests | Yes |
| POST | `/api/v1/support-requests` | Raise a concern | Yes |

**GET `/api/v1/faqs`**
```json
// Response: Success envelope with FAQ[] sorted by sortOrder ASC
// (single-resource envelope, no pagination — mirrors /coupons).
// Mock supports ?scenario=empty|error for state testing.
```

**GET `/api/v1/support-requests`** — Query: `page` (default 1), `limit` (default 20, max 100)
```json
// Response: Paginated envelope with SupportRequest[] sorted by createdAt DESC
// Error: UNAUTHORIZED (401) — no/invalid access token
// Mock supports ?scenario=empty|error for state testing.
```

**POST `/api/v1/support-requests`**
```json
// Request
{
  "bookingId": "uuid | null",        // optional — omit or null when not booking-related
  "issueType": "SERVICE_QUALITY",
  "description": "The stylist arrived 40 minutes late..."
}
// Response: 201 with Success envelope containing the created SupportRequest
// (status OPEN, server-assigned referenceCode; bookingReferenceCode snapshotted
// from the booking when bookingId is provided)
// Error: UNAUTHORIZED (401) — no/invalid access token
// Error: VALIDATION_ERROR (400) — invalid issueType, empty description,
//        or a bookingId that is unknown / belongs to another user
// Mock: a description containing "FORCE_500" → 500 (mirrors the catalog convention;
//       powers the Figma submission-failure state).
```

---

## Contract Change Log

| Date | Section | Change | Author |
|---|---|---|---|
| 2026-06-11 | All | Initial draft — all sections DRAFT | Setup |
| 2026-07-12 | Auth | Section locked for F6 implementation — endpoints and shapes unchanged from draft | Claude |
| 2026-07-13 | Service Catalog | Draft amended to match Figma (source of truth): 6 categories (Men/Women/Kids/Seniors/Bride/Groom), `heroImageUrl` on ServiceCategory; `type` (COMBO/SINGLE), `originalPrice`, `discountPercent`, `includedServiceIds` on Service; `type` query param on GET /services; currency INR. Section locked for F4 implementation | Claude |
| 2026-07-13 | Home & Promotions | Added new section + `Offer`, `Testimonial`, `Referral` entities and `GET /offers`, `/testimonials`, `/referral` (all guest) for the F3 Home editorial sections (Offers, Testimonials, Referral). Testimonial is deliberately distinct from the per-service Review (F10). Section locked for F3 implementation | Claude |
| 2026-07-13 | Cart & Checkout | Added new section + `CartItem`, `Coupon`, `PaymentSummary`, `Order` entities and `GET /coupons`, `POST /checkout/summary`, `POST /orders`. Cart is client-state (persisted `useCartStore`); server owns coupons, pricing, and order placement. Scheduling deferred to F7. Section locked for F13 implementation | Claude |
| 2026-07-13 | Availability & Booking | Rewritten for the integrated cart→checkout flow, then locked for F7/F8: TimeSlot is a capacity-level hourly arrival window queried by date only (specialistId removed — specialists are system-assigned at booking creation); Booking now carries `items: CartItem[]` + `paymentSummary` snapshots (multi-service), system-assigned `specialistId`, `referenceCode`, and `scheduledAt` derived from the slot; `POST /bookings` takes `{items, couponCode, addressId, timeSlotId, notes}` and supersedes `POST /orders`; `SLOT_UNAVAILABLE` (409) defined on create/reschedule; `GET /bookings` gains status filter + pagination detail | Claude |
| 2026-07-13 | Cart & Checkout | `POST /orders` and the `Order` entity superseded by `POST /bookings` + the amended `Booking` — checkout now creates a scheduled booking directly, giving F8 real data. `GET /coupons` and `POST /checkout/summary` unchanged | Claude |
| 2026-07-13 | Notifications | Section locked for F11. Added `NotificationSettings` entity (per-user singleton: `whatsappEnabled` + 4 channel toggles). Endpoints expanded from the 2-endpoint draft: `GET /notifications` gains a `category` (BOOKING/OFFER, derived from `type`) filter + pagination detail; added `GET /notifications/unread-count` (nav badge), `PATCH /notifications/:id/read`, `DELETE /notifications/:id` (dismiss), and `GET`/`PATCH /notification-settings`. No new stored fields on `Notification` — the tab category is derived from `type` | Claude |
| 2026-07-13 | Tracking | New section added + locked for F15. `Van`, `GeoPoint`, `VanTracking` entities and `GET /bookings/:id/tracking` (auth, owned-or-404; 422 for COMPLETED/CANCELLED). Tracking is a point-in-time snapshot with a deterministic status mapping from the booking's state (PENDING → NOT_DISPATCHED, CONFIRMED → EN_ROUTE/ARRIVING by time-to-slot, IN_PROGRESS → ARRIVED); vans are system-assigned like specialists | Claude |
| 2026-07-13 | Profile & Addresses | Section locked for F9. No new fields — the drafted `Address` entity + 6 endpoints stand as-is. Clarifications added: `GET /profile` mirrors `/auth/me` (`User`); `GET /addresses` uses the single-resource envelope (`Address[]`, default first) with `?scenario=empty|error`; `isDefault` is exclusive (setting one unsets siblings); first address forced default; deleting the default promotes the next; delete blocked (422) when a PENDING/CONFIRMED booking references the address | Claude |
| 2026-07-14 | Help & Support | New section added + locked for F16. `FAQ` + `SupportRequest` entities and `GET /faqs` (guest), `GET /support-requests` (auth, paginated, createdAt DESC), `POST /support-requests` (auth, 201; server-assigned `referenceCode` + `bookingReferenceCode` snapshot; optional `bookingId` must belong to the caller — else 400). Call Support contact details are static client content, deliberately not an endpoint | Claude |
| 2026-07-14 | Reviews | Section locked for F10. `Review` entity unchanged. `POST /reviews` request gains required `serviceId` (must be one of the booking's `items[].serviceId` — a multi-service booking picks which service the review is about; user decision). Uniqueness stays one review per booking (409 `CONFLICT`). `GET /services/:id/reviews` fleshed out to locked-section rigor: guest, paginated (page/limit, default 10, max 100), `createdAt` DESC, `user { firstName, avatarUrl }` expanded, 404 unknown service, `?scenario=empty\|error`. Noted: `Service.rating`/`reviewCount` aggregates are backend-maintained; the mock does not recompute them | Claude |

---

## Governance Rules

1. **Lock before code** — a contract section must be `LOCKED (date)` before any feature code consuming that section is written.
2. **Change-log entries** — after a section is locked, any change must include a change-log entry with date, section, and description of the change.
3. **Mock parity** — mock handlers must implement the envelopes exactly as defined here, including all error responses with correct codes and shapes.
4. **Zod parity** — Zod schemas must mirror contract entity types field-for-field. No extra fields, no missing fields.
5. **No invented fields** — if a field is not in this contract, it does not exist. If you need a field, add it to the contract first, then update the change log.
