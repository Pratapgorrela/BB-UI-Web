import { useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MapPin, Star } from 'lucide-react';
import { PageHeader } from '../components/layout';
import { Avatar, Card, DataState, SkeletonCard, useToast } from '../components/ui';
import { CheckoutItemsList, PaymentSummaryCard } from '../features/cart';
import { useQueryClient } from '@tanstack/react-query';
import {
  BookingActions,
  BookingStatusBadge,
  bookingKeys,
  CancelBookingModal,
  formatScheduledAt,
  SlotPickerSheet,
  useCancelBooking,
  useFetchBooking,
  useRescheduleBooking,
} from '../features/booking';
import type { BookingDetail, TimeSlot } from '../features/booking';
import { useCartStore } from '../store/useCartStore';
import { getApiError } from '../utils/apiError';
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
  const navigate = useNavigate();
  const { addToast } = useToast();
  const query = useFetchBooking(id);

  const summaryRef = useRef<HTMLDivElement>(null);
  // Remounts PaymentSummaryCard with defaultOpen so "Payment summary" flips it open.
  const [summaryNonce, setSummaryNonce] = useState(0);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const cancelBooking = useCancelBooking();
  const rescheduleBooking = useRescheduleBooking();
  const queryClient = useQueryClient();

  async function handleCancelConfirm(cancellationReason: string) {
    if (!id) return;
    try {
      await cancelBooking.mutateAsync({ id, cancellationReason });
      setCancelOpen(false);
    } catch {
      // Toast comes from the hook; refetch so a raced 2h/status change updates the buttons.
      setCancelOpen(false);
      void query.refetch();
    }
  }

  async function handleReschedule(slot: TimeSlot) {
    if (!id) return;
    try {
      await rescheduleBooking.mutateAsync({ id, timeSlotId: slot.id });
    } catch (error) {
      // Toast is handled in useRescheduleBooking; recover the slot-taken race here.
      if (getApiError(error)?.code === 'SLOT_UNAVAILABLE') {
        void queryClient.invalidateQueries({ queryKey: bookingKeys.all });
        setPickerOpen(true);
      }
    }
  }

  function handleTrackVan() {
    addToast('Live van tracking is coming soon.', 'info');
  }

  /** Re-adds the booking's items to the cart (bumping quantities) and opens it. */
  function handleRebook(booking: BookingDetail) {
    for (const item of booking.items) {
      const cart = useCartStore.getState();
      const existing = cart.items.find((line) => line.serviceId === item.serviceId);
      if (existing) {
        cart.updateQuantity(item.serviceId, existing.quantity + item.quantity);
      } else {
        cart.addItem(item.service);
        if (item.quantity > 1) cart.updateQuantity(item.serviceId, item.quantity);
      }
    }
    addToast('Services added to your cart.', 'success');
    navigate('/cart');
  }

  function handleShowPaymentSummary() {
    setSummaryNonce((nonce) => nonce + 1);
    summaryRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <div className="mx-auto max-w-xl py-2">
      {/* Prefer history back so the list's ?tab= survives; fall back for deep links. */}
      <PageHeader
        title="Booking details"
        onBack={() =>
          ((window.history.state as { idx?: number } | null)?.idx ?? 0) > 0
            ? navigate(-1)
            : navigate('/bookings')
        }
      />

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
            <BookingActions
              booking={booking}
              onTrackVan={handleTrackVan}
              onReschedule={() => setPickerOpen(true)}
              onRebook={() => handleRebook(booking)}
              onCancel={() => setCancelOpen(true)}
              onShowPaymentSummary={handleShowPaymentSummary}
            />
            <SpecialistCard booking={booking} />
            <AddressCard booking={booking} />
            <CheckoutItemsList items={booking.items} />
            <div ref={summaryRef}>
              <PaymentSummaryCard
                key={summaryNonce}
                summary={booking.paymentSummary}
                defaultOpen={summaryNonce > 0}
              />
            </div>

            <CancelBookingModal
              open={cancelOpen}
              onClose={() => setCancelOpen(false)}
              booking={booking}
              onConfirm={(reason) => void handleCancelConfirm(reason)}
              isPending={cancelBooking.isPending}
            />

            <SlotPickerSheet
              open={pickerOpen}
              onClose={() => setPickerOpen(false)}
              onSelect={(slot) => void handleReschedule(slot)}
            />
          </div>
        )}
      </DataState>
    </div>
  );
}
