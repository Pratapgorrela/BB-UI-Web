import type { BadgeVariant } from '../../../components/ui';
import type { Booking, BookingStatus } from '../types/booking';

/** Mirrors the mock/contract rule — cancel/reschedule allowed until 2h before the slot. */
const CANCELLATION_WINDOW_MS = 2 * 60 * 60 * 1000;

/** True when the booking is PENDING/CONFIRMED and ≥2h before its slot. */
function canModifyBooking(
  booking: Pick<Booking, 'status' | 'scheduledAt'>,
  now: number = Date.now(),
): boolean {
  if (booking.status !== 'PENDING' && booking.status !== 'CONFIRMED') return false;
  return new Date(booking.scheduledAt).getTime() - now >= CANCELLATION_WINDOW_MS;
}

const BOOKING_STATUS_LABEL: Record<BookingStatus, string> = {
  PENDING: 'Pending',
  CONFIRMED: 'Confirmed',
  IN_PROGRESS: 'In progress',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
};

/** design.md "Booking Status Color Mapping". */
const BOOKING_STATUS_VARIANT: Record<BookingStatus, BadgeVariant> = {
  PENDING: 'warning',
  CONFIRMED: 'info',
  IN_PROGRESS: 'primary',
  COMPLETED: 'success',
  CANCELLED: 'danger',
};

export { BOOKING_STATUS_LABEL, BOOKING_STATUS_VARIANT, CANCELLATION_WINDOW_MS, canModifyBooking };
