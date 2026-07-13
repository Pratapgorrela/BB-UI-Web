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
 * Interim address shape expanded on `GET /bookings/:id` — structurally matches
 * the checkout's `CheckoutAddress`. F9 (Profile & Addresses) owns the real
 * `Address` entity; when it lands, only the data source changes, not this shape.
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

export type {
  Booking,
  BookingAddress,
  BookingDetail,
  BookingListFilters,
  BookingsPage,
  BookingStatus,
  CancelBookingRequest,
  CreateBookingRequest,
  RescheduleBookingRequest,
  Specialist,
  TimeSlot,
};
