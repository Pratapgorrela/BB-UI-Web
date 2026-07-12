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
| name | string | e.g., "Hair", "Nails", "Spa", "Makeup" |
| slug | string | URL-safe, unique |
| description | string | |
| imageUrl | string | Category thumbnail |
| serviceCount | integer | Number of services in category |
| sortOrder | integer | Display order |

### Service

| Field | Type | Notes |
|---|---|---|
| id | UUID | |
| categoryId | UUID | FK → ServiceCategory |
| name | string | |
| description | string | |
| shortDescription | string | max 120 chars for cards |
| imageUrl | string | Primary image |
| galleryUrls | string[] | Additional images |
| price | Money | `{ amount, currency }` |
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

| Field | Type | Notes |
|---|---|---|
| id | UUID | |
| specialistId | UUID | FK → Specialist |
| date | string | `YYYY-MM-DD` |
| startTime | string | `HH:mm` (24h) |
| endTime | string | `HH:mm` (24h) |
| isAvailable | boolean | |

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

| Field | Type | Notes |
|---|---|---|
| id | UUID | |
| userId | UUID | FK → User |
| serviceId | UUID | FK → Service |
| specialistId | UUID | FK → Specialist |
| addressId | UUID | FK → Address |
| status | enum | See lifecycle below |
| scheduledAt | ISO 8601 | Appointment date+time |
| duration | integer | Minutes |
| price | Money | Snapshot at booking time |
| notes | string | null | Customer notes |
| cancellationReason | string | null | Filled on cancel |
| referenceCode | string | e.g., `"BB-20260611-A3F2"` |
| createdAt | ISO 8601 | |
| updatedAt | ISO 8601 | |
| service | Service | Expanded in detail responses |
| specialist | Specialist | Expanded in detail responses |
| address | Address | Expanded in detail responses |

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

### Service Catalog — `STATUS: DRAFT`

| Method | Path | Description | Auth |
|---|---|---|---|
| GET | `/api/v1/categories` | List all service categories | No |
| GET | `/api/v1/services` | List services (filter, search, paginate) | No |
| GET | `/api/v1/services/:id` | Service detail | No |
| GET | `/api/v1/specialists` | List specialists (optional serviceId filter) | No |
| GET | `/api/v1/specialists/:id` | Specialist detail | No |

**GET `/api/v1/services`** — Query params:
- `categoryId` (UUID) — filter by category
- `search` (string) — full-text search on name/description
- `isPopular` (boolean) — filter popular services
- `minPrice` / `maxPrice` (integer, minor units) — price range
- `sortBy` (`price_asc`, `price_desc`, `rating`, `name`) — sort order
- `page` (integer, default 1) — page number
- `limit` (integer, default 20, max 100) — items per page

---

### Availability & Booking — `STATUS: DRAFT`

| Method | Path | Description | Auth |
|---|---|---|---|
| GET | `/api/v1/time-slots` | Query available time slots | No |
| POST | `/api/v1/bookings` | Create a new booking | Yes |
| GET | `/api/v1/bookings` | List my bookings (filter by status) | Yes |
| GET | `/api/v1/bookings/:id` | Get booking detail | Yes |
| PATCH | `/api/v1/bookings/:id/reschedule` | Reschedule a booking | Yes |
| PATCH | `/api/v1/bookings/:id/cancel` | Cancel a booking | Yes |

**GET `/api/v1/time-slots`** — Query params:
- `specialistId` (UUID, required) — specialist to check
- `serviceId` (UUID, required) — service to check (for duration)
- `date` (YYYY-MM-DD, required) — date to check

**POST `/api/v1/bookings`**
```json
// Request
{
  "serviceId": "UUID",
  "specialistId": "UUID",
  "timeSlotId": "UUID",
  "addressId": "UUID",
  "notes": "string | null"
}
// Response: Success envelope with Booking entity (status: PENDING)
```

**PATCH `/api/v1/bookings/:id/reschedule`**
```json
// Request
{ "timeSlotId": "UUID" }
// Response: Success envelope with updated Booking
```

**PATCH `/api/v1/bookings/:id/cancel`**
```json
// Request
{ "cancellationReason": "string" }
// Response: Success envelope with updated Booking (status: CANCELLED)
// Error: BUSINESS_RULE_VIOLATION if < 2h before scheduledAt
```

---

### Profile & Addresses — `STATUS: DRAFT`

| Method | Path | Description | Auth |
|---|---|---|---|
| GET | `/api/v1/profile` | Get current user profile | Yes |
| PATCH | `/api/v1/profile` | Update profile fields | Yes |
| GET | `/api/v1/addresses` | List user's addresses | Yes |
| POST | `/api/v1/addresses` | Add a new address | Yes |
| PATCH | `/api/v1/addresses/:id` | Update an address | Yes |
| DELETE | `/api/v1/addresses/:id` | Delete an address | Yes |

**DELETE `/api/v1/addresses/:id`** — Business rule: cannot delete an address used by an upcoming (PENDING or CONFIRMED) booking. Returns `BUSINESS_RULE_VIOLATION` with details.

**PATCH `/api/v1/profile`**
```json
// Request (partial update)
{ "firstName": "string", "lastName": "string", "phone": "string", "avatarUrl": "string" }
```

---

### Reviews (Post-MVP) — `STATUS: DRAFT`

| Method | Path | Description | Auth |
|---|---|---|---|
| POST | `/api/v1/reviews` | Create a review for a completed booking | Yes |
| GET | `/api/v1/services/:id/reviews` | List reviews for a service (paginated) | No |

**POST `/api/v1/reviews`**
```json
// Request
{ "bookingId": "UUID", "rating": 1-5, "comment": "string" }
// Error: BUSINESS_RULE_VIOLATION if booking status !== COMPLETED
// Error: CONFLICT if review already exists for this booking
```

---

### Notifications (Post-MVP) — `STATUS: DRAFT`

| Method | Path | Description | Auth |
|---|---|---|---|
| GET | `/api/v1/notifications` | List user's notifications (paginated) | Yes |
| PATCH | `/api/v1/notifications/mark-all-read` | Mark all notifications as read | Yes |

---

## Contract Change Log

| Date | Section | Change | Author |
|---|---|---|---|
| 2026-06-11 | All | Initial draft — all sections DRAFT | Setup |
| 2026-07-12 | Auth | Section locked for F6 implementation — endpoints and shapes unchanged from draft | Claude |

---

## Governance Rules

1. **Lock before code** — a contract section must be `LOCKED (date)` before any feature code consuming that section is written.
2. **Change-log entries** — after a section is locked, any change must include a change-log entry with date, section, and description of the change.
3. **Mock parity** — mock handlers must implement the envelopes exactly as defined here, including all error responses with correct codes and shapes.
4. **Zod parity** — Zod schemas must mirror contract entity types field-for-field. No extra fields, no missing fields.
5. **No invented fields** — if a field is not in this contract, it does not exist. If you need a field, add it to the contract first, then update the change log.
