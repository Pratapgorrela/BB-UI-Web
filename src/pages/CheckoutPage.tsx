import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import { Avatar, Button, DataState, StickyBottomBar, useToast } from '../components/ui';
import {
  AddressSelect,
  CheckoutItemsList,
  CouponSection,
  PaymentSummaryCard,
  useCheckoutSummary,
  useFetchCoupons,
} from '../features/cart';
import type { Coupon } from '../features/cart';
import { addressToLine, useFetchAddresses } from '../features/profile';
import {
  SelectedSlotCard,
  SlotPickerSheet,
  bookingKeys,
  useCreateBooking,
} from '../features/booking';
import type { TimeSlot } from '../features/booking';
import { cartSelectedDuration, selectedCartItems, useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../store/useAuthStore';
import { formatDuration, formatPrice } from '../utils/format';
import { getApiError, getApiErrorMessage } from '../utils/apiError';

export function Component() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const items = useCartStore((state) => state.items);
  const selected = selectedCartItems(items);

  const [appliedCode, setAppliedCode] = useState<string | null>(null);
  const [addressId, setAddressId] = useState<string>('');
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);

  const addressesQuery = useFetchAddresses();
  // Addresses come back default-first; fall back to that until the user picks one.
  const selectedAddressId = addressId || addressesQuery.data?.[0]?.id || '';

  const lineInputs = selected.map((item) => ({
    serviceId: item.serviceId,
    quantity: item.quantity,
  }));

  const summaryQuery = useCheckoutSummary({ items: lineInputs, couponCode: appliedCode });
  const couponsQuery = useFetchCoupons();
  const createBooking = useCreateBooking();

  const summary = summaryQuery.data;
  const couponRejected = !!appliedCode && summaryQuery.isError;
  const appliedCoupon: Coupon | null = couponRejected ? null : (summary?.appliedCoupon ?? null);
  const couponError = couponRejected ? getApiErrorMessage(summaryQuery.error) : undefined;

  const handlePlaceBooking = async () => {
    if (!selectedAddressId) {
      addToast('Please add a service address to continue.', 'error');
      return;
    }
    if (!selectedSlot) {
      addToast('Choose a time slot to continue.', 'error');
      setPickerOpen(true);
      return;
    }
    try {
      const booking = await createBooking.mutateAsync({
        items: lineInputs,
        couponCode: appliedCode,
        addressId: selectedAddressId,
        timeSlotId: selectedSlot.id,
      });
      navigate('/booking-confirmation', { state: { booking }, replace: true });
    } catch (error) {
      // Toast is handled in useCreateBooking; recover the slot-taken race here.
      if (getApiError(error)?.code === 'SLOT_UNAVAILABLE') {
        setSelectedSlot(null);
        void queryClient.invalidateQueries({ queryKey: bookingKeys.all });
        setPickerOpen(true);
      }
    }
  };

  return (
    <div className="min-h-dvh bg-neutral-100">
      <header className="sticky top-0 z-(--z-sticky) flex items-center gap-3 border-b border-neutral-200 bg-neutral-0 px-4 py-3">
        <button
          type="button"
          aria-label="Go back"
          onClick={() => void navigate(-1)}
          className="flex size-9 items-center justify-center rounded-full text-neutral-800 transition-colors duration-fast ease-fast hover:bg-neutral-100 focus-visible:shadow-focus focus-visible:outline-none"
        >
          <ArrowLeft size={22} aria-hidden="true" />
        </button>
        <h1 className="font-heading text-h4 font-semibold text-neutral-900">Checkout</h1>
      </header>

      {selected.length === 0 ? (
        <div className="mx-auto flex max-w-xl flex-col items-center gap-4 px-4 py-20 text-center">
          <p className="font-heading text-body font-semibold text-neutral-800">
            No items selected
          </p>
          <p className="text-body-sm text-neutral-500">
            Add or select services in your cart to check out.
          </p>
          <Button variant="primary" size="md" onClick={() => void navigate('/cart')}>
            Back to cart
          </Button>
        </div>
      ) : (
        <>
          <div className="mx-auto flex max-w-xl flex-col gap-6 px-4 pb-[calc(env(safe-area-inset-bottom)+6.5rem)] pt-4">
            {/* User info */}
            {user && (
              <section className="flex items-center gap-3 rounded-lg bg-neutral-0 p-4">
                <Avatar size="md" name={`${user.firstName} ${user.lastName}`} />
                <div className="min-w-0">
                  <p className="truncate font-heading text-body font-semibold text-neutral-900">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="truncate text-body-sm text-neutral-500">{user.phone}</p>
                </div>
              </section>
            )}

            <CheckoutItemsList items={selected} />

            {/* Coupons */}
            <DataState
              data={couponsQuery.data}
              isLoading={couponsQuery.isLoading}
              error={couponsQuery.error}
              onRetry={() => void couponsQuery.refetch()}
              isEmpty={() => false}
              skeleton={<div className="h-24 animate-pulse rounded-lg bg-neutral-200" />}
            >
              {(coupons) => (
                <CouponSection
                  coupons={coupons}
                  appliedCoupon={appliedCoupon}
                  onApply={(code) => setAppliedCode(code)}
                  onRemove={() => setAppliedCode(null)}
                  errorMessage={couponError}
                  isValidating={summaryQuery.isFetching}
                />
              )}
            </DataState>

            {/* Payment breakdown */}
            <PaymentSummaryCard summary={summary} isLoading={summaryQuery.isLoading} />

            {/* Address */}
            <DataState
              data={addressesQuery.data}
              isLoading={addressesQuery.isLoading}
              error={addressesQuery.error}
              onRetry={() => void addressesQuery.refetch()}
              isEmpty={(list) => list.length === 0}
              emptyMessage="No saved addresses yet"
              emptyCta={{
                label: 'Add an address',
                onClick: () => void navigate('/profile/addresses'),
              }}
              skeleton={<div className="h-24 animate-pulse rounded-lg bg-neutral-200" />}
            >
              {(list) => (
                <AddressSelect
                  addresses={list.map((address) => ({
                    id: address.id,
                    label: address.label,
                    line: addressToLine(address),
                  }))}
                  selectedId={selectedAddressId}
                  onSelect={setAddressId}
                />
              )}
            </DataState>

            {/* Scheduling */}
            <SelectedSlotCard
              slot={selectedSlot}
              durationLabel={formatDuration(cartSelectedDuration(items))}
              onOpen={() => setPickerOpen(true)}
            />
          </div>

          <SlotPickerSheet
            open={pickerOpen}
            onClose={() => setPickerOpen(false)}
            initialSlot={selectedSlot}
            onSelect={setSelectedSlot}
          />

          <StickyBottomBar
            totalPrice={summary ? summary.total.amount / 100 : 0}
            priceLabel={summary ? formatPrice(summary.total) : '—'}
            serviceCount={selected.length}
            ctaLabel={createBooking.isPending ? 'Placing…' : 'Place order'}
            disabled={!summary || couponRejected || createBooking.isPending}
            onCtaClick={() => void handlePlaceBooking()}
          />
        </>
      )}
    </div>
  );
}
