import { useParams } from 'react-router-dom';
import { MapPin, Star } from 'lucide-react';
import { PageHeader } from '../components/layout';
import { Avatar, Card, DataState, SkeletonCard } from '../components/ui';
import { CheckoutItemsList, PaymentSummaryCard } from '../features/cart';
import { BookingStatusBadge, formatScheduledAt, useFetchBooking } from '../features/booking';
import type { BookingDetail } from '../features/booking';
import { formatDuration } from '../utils/format';

function SummaryCard({ booking }: { booking: BookingDetail }) {
  return (
    <Card padding="md" className="flex flex-col gap-2">
      <div className="flex items-start justify-between gap-2">
        <p className="font-mono text-body-sm text-neutral-600">{booking.referenceCode}</p>
        <BookingStatusBadge status={booking.status} className="shrink-0" />
      </div>
      <p className="font-heading text-h4 font-semibold text-neutral-900">
        {formatScheduledAt(booking.scheduledAt)}
      </p>
      <p className="text-body-sm text-neutral-600">
        Estimated duration {formatDuration(booking.duration)}
      </p>
      {booking.status === 'CANCELLED' && booking.cancellationReason && (
        <p className="text-body-sm text-danger-600">Reason: {booking.cancellationReason}</p>
      )}
    </Card>
  );
}

function SpecialistCard({ booking }: { booking: BookingDetail }) {
  const { specialist } = booking;
  const fullName = `${specialist.firstName} ${specialist.lastName}`;
  return (
    <Card padding="md" className="flex items-center gap-3">
      <Avatar src={specialist.avatarUrl} name={fullName} alt={fullName} size="lg" />
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <p className="text-caption text-neutral-500">Your specialist</p>
        <p className="truncate font-heading text-body font-semibold text-neutral-900">{fullName}</p>
        <p className="flex items-center gap-1 text-body-sm text-neutral-600">
          <Star size={14} aria-hidden="true" className="fill-warning-500 text-warning-500" />
          {specialist.rating.toFixed(1)}
          <span className="text-neutral-400">({specialist.reviewCount} reviews)</span>
        </p>
      </div>
    </Card>
  );
}

function AddressCard({ booking }: { booking: BookingDetail }) {
  return (
    <Card padding="md" className="flex items-start gap-3">
      <MapPin size={20} aria-hidden="true" className="mt-0.5 shrink-0 text-primary-500" />
      <div className="flex min-w-0 flex-col gap-0.5">
        <p className="font-heading text-body font-semibold text-neutral-900">
          {booking.address.label}
        </p>
        <p className="text-body-sm text-neutral-600">{booking.address.line}</p>
      </div>
    </Card>
  );
}

export function Component() {
  const { id } = useParams<{ id: string }>();
  const query = useFetchBooking(id);

  return (
    <div className="mx-auto max-w-xl py-2">
      <PageHeader title="Booking details" backTo="/bookings" />

      <DataState<BookingDetail>
        data={query.data}
        isLoading={query.isLoading}
        error={query.error}
        onRetry={() => void query.refetch()}
        skeleton={
          <div className="flex flex-col gap-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        }
      >
        {(booking) => (
          <div className="flex flex-col gap-4 pb-6">
            <SummaryCard booking={booking} />
            <SpecialistCard booking={booking} />
            <AddressCard booking={booking} />
            <CheckoutItemsList items={booking.items} />
            <PaymentSummaryCard summary={booking.paymentSummary} />
          </div>
        )}
      </DataState>
    </div>
  );
}
