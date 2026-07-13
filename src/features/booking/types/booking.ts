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

export type { Booking, BookingStatus, CreateBookingRequest, Specialist, TimeSlot };
