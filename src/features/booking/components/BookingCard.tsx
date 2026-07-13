import { Link } from 'react-router-dom';
import { CalendarClock, Timer } from 'lucide-react';
import { Card } from '../../../components/ui';
import { useFetchCategories } from '../../service-catalog';
import { BookingStatusBadge } from './BookingStatusBadge';
import { formatScheduledAt } from '../utils/slotFormat';
import { formatDuration } from '../../../utils/format';
import type { Booking } from '../types/booking';

interface BookingCardProps {
  booking: Booking;
}

/** Per Figma booking cards: image, service name, ID, date, estimated time, category. */
function BookingCard({ booking }: BookingCardProps) {
  const { data: categories } = useFetchCategories();
  const firstItem = booking.items[0];
  const extraCount = booking.items.length - 1;
  const categoryName = categories?.find(
    (category) => category.id === firstItem.service.categoryId,
  )?.name;

  return (
    <Link
      to={`/bookings/${booking.id}`}
      className="block rounded-lg focus-visible:shadow-focus focus-visible:outline-none"
      aria-label={`Booking ${booking.referenceCode}`}
    >
      <Card variant="interactive" padding="md" className="flex items-start gap-3">
        <div className="size-16 shrink-0 overflow-hidden rounded-xl bg-neutral-200">
          <img
            src={firstItem.service.imageUrl}
            alt=""
            aria-hidden="true"
            loading="lazy"
            className="size-full object-cover"
          />
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="truncate font-heading text-body font-semibold text-neutral-900">
              {firstItem.service.name}
              {extraCount > 0 && (
                <span className="font-body text-body-sm font-normal text-neutral-500">
                  {' '}
                  +{extraCount} more
                </span>
              )}
            </h3>
            <BookingStatusBadge status={booking.status} className="shrink-0" />
          </div>

          <p className="font-mono text-caption text-neutral-500">{booking.referenceCode}</p>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-body-sm text-neutral-700">
            <span className="inline-flex items-center gap-1">
              <CalendarClock size={16} aria-hidden="true" className="text-neutral-500" />
              {formatScheduledAt(booking.scheduledAt)}
            </span>
            <span className="inline-flex items-center gap-1">
              <Timer size={16} aria-hidden="true" className="text-neutral-500" />
              {formatDuration(booking.duration)}
            </span>
          </div>

          {categoryName && <p className="text-caption text-neutral-500">{categoryName}</p>}
        </div>
      </Card>
    </Link>
  );
}

export { BookingCard };
export type { BookingCardProps };
