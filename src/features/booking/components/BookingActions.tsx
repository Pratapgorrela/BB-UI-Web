import { Button } from '../../../components/ui';
import { canModifyBooking } from '../utils/bookingPolicy';
import type { Booking } from '../types/booking';

interface BookingActionsProps {
  booking: Pick<Booking, 'status' | 'scheduledAt'>;
  onTrackVan: () => void;
  onReschedule: () => void;
  onRebook: () => void;
  onCancel: () => void;
  onShowPaymentSummary: () => void;
  onWriteReview: () => void;
}

/**
 * Per-status actions (Figma): active bookings get Track Van / Reschedule /
 * Rebook / Cancel; completed bookings get Write a review (F10) + Payment
 * Summary. The contract restricts cancel/reschedule to PENDING/CONFIRMED
 * outside the 2h window, so IN_PROGRESS offers Track Van + Rebook and
 * CANCELLED offers Rebook.
 */
function BookingActions({
  booking,
  onTrackVan,
  onReschedule,
  onRebook,
  onCancel,
  onShowPaymentSummary,
  onWriteReview,
}: BookingActionsProps) {
  if (booking.status === 'COMPLETED') {
    return (
      <div className="grid grid-cols-2 gap-2">
        <Button variant="primary" onClick={onWriteReview}>
          Write a review
        </Button>
        <Button variant="secondary" onClick={onShowPaymentSummary}>
          Payment summary
        </Button>
      </div>
    );
  }

  if (booking.status === 'CANCELLED') {
    return (
      <Button variant="secondary" fullWidth onClick={onRebook}>
        Rebook
      </Button>
    );
  }

  if (booking.status === 'IN_PROGRESS') {
    return (
      <div className="grid grid-cols-2 gap-2">
        <Button variant="primary" onClick={onTrackVan}>
          Track van
        </Button>
        <Button variant="secondary" onClick={onRebook}>
          Rebook
        </Button>
      </div>
    );
  }

  // PENDING / CONFIRMED
  const modifiable = canModifyBooking(booking);
  return (
    <div className="flex flex-col gap-2">
      <div className="grid grid-cols-2 gap-2">
        <Button variant="primary" onClick={onTrackVan}>
          Track van
        </Button>
        <Button variant="secondary" disabled={!modifiable} onClick={onReschedule}>
          Reschedule
        </Button>
        <Button variant="secondary" onClick={onRebook}>
          Rebook
        </Button>
        <Button variant="danger" disabled={!modifiable} onClick={onCancel}>
          Cancel
        </Button>
      </div>
      {!modifiable && (
        <p className="text-caption text-neutral-500">
          Changes are locked within 2 hours of your slot.
        </p>
      )}
    </div>
  );
}

export { BookingActions };
export type { BookingActionsProps };
