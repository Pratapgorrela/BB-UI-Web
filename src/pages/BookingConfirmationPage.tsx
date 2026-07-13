import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle2, PackageOpen } from 'lucide-react';
import { Button } from '../components/ui';
import { formatDuration, formatPrice } from '../utils/format';
import { formatScheduledAt } from '../features/booking';
import type { Booking } from '../features/booking';

export function Component() {
  const location = useLocation();
  const navigate = useNavigate();
  const booking = (location.state as { booking?: Booking } | null)?.booking;

  if (!booking) {
    return (
      <div className="mx-auto flex min-h-dvh max-w-xl flex-col items-center justify-center gap-4 px-4 text-center">
        <PackageOpen size={48} className="text-neutral-400" aria-hidden="true" />
        <div>
          <p className="font-heading text-body font-semibold text-neutral-800">
            No recent booking to show
          </p>
          <p className="mt-1 text-body-sm text-neutral-500">
            Your booking confirmation isn't available here anymore.
          </p>
        </div>
        <Button variant="primary" size="md" onClick={() => void navigate('/')}>
          Back to home
        </Button>
      </div>
    );
  }

  const itemCount = booking.items.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="mx-auto flex min-h-dvh max-w-xl flex-col items-center justify-center gap-6 px-4 py-12 text-center">
      <span className="flex size-20 items-center justify-center rounded-full bg-success-100">
        <CheckCircle2 size={44} className="text-success-500" aria-hidden="true" />
      </span>

      <div>
        <h1 className="font-heading text-h3 font-bold text-neutral-900">Booking placed</h1>
        <p className="mt-2 text-body-sm text-neutral-500">
          Thank you! Our team will arrive at your doorstep in the booked window.
        </p>
      </div>

      <dl className="w-full rounded-lg border border-neutral-200 bg-neutral-0 p-4 text-left">
        <div className="flex items-center justify-between py-1.5">
          <dt className="text-body-sm text-neutral-500">Reference</dt>
          <dd className="font-mono text-body-sm font-semibold text-neutral-900">
            {booking.referenceCode}
          </dd>
        </div>
        <div className="flex items-center justify-between py-1.5">
          <dt className="text-body-sm text-neutral-500">Scheduled for</dt>
          <dd className="text-body-sm font-medium text-neutral-800">
            {formatScheduledAt(booking.scheduledAt)}
          </dd>
        </div>
        <div className="flex items-center justify-between py-1.5">
          <dt className="text-body-sm text-neutral-500">Est. duration</dt>
          <dd className="text-body-sm font-medium text-neutral-800">
            {formatDuration(booking.duration)}
          </dd>
        </div>
        <div className="flex items-center justify-between py-1.5">
          <dt className="text-body-sm text-neutral-500">
            {itemCount === 1 ? 'Service' : 'Services'}
          </dt>
          <dd className="text-body-sm font-medium text-neutral-800">{itemCount}</dd>
        </div>
        <div className="flex items-center justify-between border-t border-neutral-100 py-1.5 pt-2.5">
          <dt className="text-body font-semibold text-neutral-900">Total paid</dt>
          <dd className="font-mono text-body font-bold text-neutral-900">
            {formatPrice(booking.paymentSummary.total)}
          </dd>
        </div>
      </dl>

      <div className="flex w-full flex-col gap-2">
        <Button variant="primary" size="lg" onClick={() => void navigate('/bookings')}>
          View my bookings
        </Button>
        <Button variant="ghost" size="md" onClick={() => void navigate('/')}>
          Back to home
        </Button>
      </div>
    </div>
  );
}
