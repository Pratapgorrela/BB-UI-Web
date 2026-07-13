import type { Pagination } from '../../../types/api';
import type { CartItem, CheckoutSummaryRequest, PaymentSummary } from '../../cart/types/cart';

/**
 * A capacity-level arrival window for the at-home service van/team — availability
 * is per city-wide capacity, not per specialist (specialists are system-assigned
 * at booking creation). Hourly windows, 09:00–18:00 start times.
 */
interface TimeSlot {
  id: string;
  /** `YYYY-MM-DD` */
  date: string;
  /** `HH:mm` (24h) — arrival-window start */
  startTime: string;
  /** `HH:mm` (24h) — arrival-window end (start + 60 min) */
  endTime: string;
  isAvailable: boolean;
}

type BookingStatus = 'PENDING' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

interface Specialist {
  id: string;
  firstName: string;
  lastName: string;
  avatarUrl: string;
  bio: string;
  specialties: string[];
  rating: number;
  reviewCount: number;
  yearsOfExperience: number;
  serviceIds: string[];
}

/**
 * The scheduled appointment created at checkout. Carries the ordered items +
 * payment breakdown as immutable snapshots (supersedes the retired `Order`).
 * The specialist is system-assigned at creation — never client-supplied.
 */
interface Booking {
  id: string;
  userId: string;
  referenceCode: string;
  items: CartItem[];
  paymentSummary: PaymentSummary;
  addressId: string;
  specialistId: string;
  status: BookingStatus;
  /** The booked slot's date + startTime as a UTC instant. */
  scheduledAt: string;
  /** Minutes — Σ `service.duration × quantity` over items. */
  duration: number;
  notes: string | null;
  cancellationReason: string | null;
  createdAt: string;
  updatedAt: string;
}

/** The checkout payload plus the chosen slot — `POST /bookings`. */
interface CreateBookingRequest extends CheckoutSummaryRequest {
  addressId: string;
  timeSlotId: string;
  notes?: string | null;
}

/**
 * Compact address shape expanded on `GET /bookings/:id`. Since F9, the mock
 * derives it from the real `Address` entity (via `addressToLine`); this display
 * shape is intentionally decoupled from the full entity.
 */
interface BookingAddress {
  id: string;
  label: string;
  line: string;
}

/** `GET /bookings/:id` — the booking with its specialist + address expanded. */
interface BookingDetail extends Booking {
  specialist: Specialist;
  address: BookingAddress;
}

/** `GET /bookings` query — status is ANDed with the caller's own bookings. */
interface BookingListFilters {
  status?: BookingStatus[];
  page?: number;
  limit?: number;
}

/** Unwrapped `GET /bookings` page (mirrors the catalog's `ServicesPage`). */
interface BookingsPage {
  bookings: Booking[];
  pagination: Pagination;
}

/** `PATCH /bookings/:id/reschedule` */
interface RescheduleBookingRequest {
  timeSlotId: string;
}

/** `PATCH /bookings/:id/cancel` */
interface CancelBookingRequest {
  cancellationReason: string;
}

/* ── Tracking (F15) ── */

type TrackingStatus = 'NOT_DISPATCHED' | 'EN_ROUTE' | 'ARRIVING' | 'ARRIVED';

/**
 * The service van + driver pairing assigned to a dispatched booking —
 * system-assigned like specialists, never client-selected.
 */
interface Van {
  /** Display ID, e.g., `"BB-VAN-03"`. */
  vanCode: string;
  /** Registration plate, e.g., `"TS 09 EB 4721"`. */
  vehicleNumber: string;
  driverName: string;
  /** E.164 — powers the Call button (`tel:`). */
  driverPhone: string;
}

/** A latitude/longitude pair for map display. */
interface GeoPoint {
  latitude: number;
  longitude: number;
}

/** The booking address as a display line + optional coordinates. */
interface TrackingDestination {
  label: string;
  line: string;
  latitude: number | null;
  longitude: number | null;
}

/**
 * `GET /bookings/:id/tracking` — a point-in-time tracking snapshot for an
 * active booking. Status derives from the booking's state and time-to-slot:
 * PENDING → NOT_DISPATCHED, CONFIRMED → EN_ROUTE/ARRIVING, IN_PROGRESS → ARRIVED.
 */
interface VanTracking {
  bookingId: string;
  status: TrackingStatus;
  /** Minutes until arrival; `null` when NOT_DISPATCHED, `0` when ARRIVED. */
  etaMinutes: number | null;
  van: Van;
  specialist: Specialist;
  destination: TrackingDestination;
  /** Van position; `null` when NOT_DISPATCHED. */
  currentLocation: GeoPoint | null;
  updatedAt: string;
}

export type {
  Booking,
  BookingAddress,
  BookingDetail,
  BookingListFilters,
  BookingsPage,
  BookingStatus,
  CancelBookingRequest,
  CreateBookingRequest,
  GeoPoint,
  RescheduleBookingRequest,
  Specialist,
  TimeSlot,
  TrackingDestination,
  TrackingStatus,
  Van,
  VanTracking,
};
