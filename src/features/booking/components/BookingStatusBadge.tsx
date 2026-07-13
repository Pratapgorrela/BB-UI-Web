import { Badge } from '../../../components/ui';
import { BOOKING_STATUS_LABEL, BOOKING_STATUS_VARIANT } from '../utils/bookingPolicy';
import type { BookingStatus } from '../types/booking';

interface BookingStatusBadgeProps {
  status: BookingStatus;
  className?: string;
}

function BookingStatusBadge({ status, className }: BookingStatusBadgeProps) {
  return (
    <Badge variant={BOOKING_STATUS_VARIANT[status]} className={className}>
      {BOOKING_STATUS_LABEL[status]}
    </Badge>
  );
}

export { BookingStatusBadge };
export type { BookingStatusBadgeProps };
