import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CalendarPlus } from 'lucide-react';
import { Avatar, Button, DataState, StickyBottomBar, useToast } from '../components/ui';
import {
  AddressSelect,
  CouponSection,
  PaymentSummaryCard,
  checkoutAddresses,
  useCheckoutSummary,
  useFetchCoupons,
  usePlaceOrder,
} from '../features/cart';
import type { Coupon } from '../features/cart';
import { selectedCartItems, useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../store/useAuthStore';
import { formatPrice } from '../utils/format';
import { getApiErrorMessage } from '../utils/apiError';

export function Component() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const user = useAuthStore((state) => state.user);
  const items = useCartStore((state) => state.items);
  const selected = selectedCartItems(items);

  const [appliedCode, setAppliedCode] = useState<string | null>(null);
  const [addressId, setAddressId] = useState<string>(checkoutAddresses[0]?.id ?? '');

  const lineInputs = selected.map((item) => ({
    serviceId: item.serviceId,
    quantity: item.quantity,
  }));

  const summaryQuery = useCheckoutSummary({ items: lineInputs, couponCode: appliedCode });
  const couponsQuery = useFetchCoupons();
  const placeOrder = usePlaceOrder();

  const summary = summaryQuery.data;
  const couponRejected = !!appliedCode && summaryQuery.isError;
  const appliedCoupon: Coupon | null = couponRejected ? null : (summary?.appliedCoupon ?? null);
  const couponError = couponRejected ? getApiErrorMessage(summaryQuery.error) : undefined;

  const handlePlaceOrder = async () => {
    if (!addressId) {
      addToast('Please select a service address.', 'error');
      return;
    }
    try {
      const order = await placeOrder.mutateAsync({
        items: lineInputs,
        couponCode: appliedCode,
        addressId,
      });
      navigate('/order-confirmation', { state: { order }, replace: true });
    } catch {
      /* error toast handled in usePlaceOrder */
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

            {/* Cart summary */}
            <section aria-labelledby="summary-heading" className="flex flex-col gap-2">
              <h2
                id="summary-heading"
                className="font-heading text-body font-semibold text-neutral-900"
              >
                Your services
              </h2>
              <ul className="flex flex-col divide-y divide-neutral-100 rounded-lg bg-neutral-0 px-4">
                {selected.map((item) => (
                  <li
                    key={item.serviceId}
                    className="flex items-center justify-between gap-3 py-3 text-body-sm"
                  >
                    <span className="min-w-0 truncate text-neutral-700">
                      {item.service.name}
                      {item.quantity > 1 && (
                        <span className="text-neutral-400"> × {item.quantity}</span>
                      )}
                    </span>
                    <span className="shrink-0 font-mono font-semibold text-neutral-900">
                      {formatPrice(item.lineTotal)}
                    </span>
                  </li>
                ))}
              </ul>
            </section>

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
            <AddressSelect
              addresses={checkoutAddresses}
              selectedId={addressId}
              onSelect={setAddressId}
            />

            {/* Scheduling — deferred to F7 */}
            <button
              type="button"
              onClick={() => addToast('Scheduling comes in F7 — your slot is set at booking.', 'info')}
              className="flex items-center justify-center gap-2 rounded-lg border border-dashed border-neutral-300 py-3 text-body-sm font-semibold text-neutral-600 transition-colors duration-fast ease-fast hover:bg-neutral-100 focus-visible:shadow-focus focus-visible:outline-none"
            >
              <CalendarPlus size={18} aria-hidden="true" />
              Add slot
            </button>
          </div>

          <StickyBottomBar
            totalPrice={summary ? summary.total.amount / 100 : 0}
            priceLabel={summary ? formatPrice(summary.total) : '—'}
            serviceCount={selected.length}
            ctaLabel={placeOrder.isPending ? 'Placing…' : 'Place order'}
            disabled={!summary || couponRejected || placeOrder.isPending}
            onCtaClick={() => void handlePlaceOrder()}
          />
        </>
      )}
    </div>
  );
}
