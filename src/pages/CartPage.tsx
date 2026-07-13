import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, ShoppingBag } from 'lucide-react';
import { Button, StickyBottomBar } from '../components/ui';
import { CartItemCard } from '../features/cart';
import {
  cartSelectedDuration,
  cartSubtotal,
  selectedCartItems,
  useCartStore,
} from '../store/useCartStore';
import { formatDuration, formatPrice } from '../utils/format';

export function Component() {
  const navigate = useNavigate();
  const items = useCartStore((state) => state.items);
  const toggleSelected = useCartStore((state) => state.toggleSelected);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);

  const selected = selectedCartItems(items);
  const subtotal = cartSubtotal(items);
  const duration = cartSelectedDuration(items);

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
        <h1 className="font-heading text-h4 font-semibold text-neutral-900">Your cart</h1>
      </header>

      <div className="mx-auto max-w-xl px-4 pb-[calc(env(safe-area-inset-bottom)+6.5rem)] pt-4">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
            <ShoppingBag size={48} className="text-neutral-400" aria-hidden="true" />
            <div>
              <p className="font-heading text-body font-semibold text-neutral-800">
                Your cart is empty
              </p>
              <p className="mt-1 text-body-sm text-neutral-500">
                Browse our services and add your favourites.
              </p>
            </div>
            <Button variant="primary" size="md" onClick={() => void navigate('/services')}>
              Browse services
            </Button>
          </div>
        ) : (
          <>
            <ul className="flex flex-col gap-3">
              {items.map((item) => (
                <li key={item.serviceId}>
                  <CartItemCard
                    item={item}
                    onToggleSelected={toggleSelected}
                    onQuantityChange={updateQuantity}
                    onRemove={removeItem}
                  />
                </li>
              ))}
            </ul>

            <button
              type="button"
              onClick={() => void navigate('/services')}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-primary-400 py-3 text-body-sm font-semibold text-primary-600 transition-colors duration-fast ease-fast hover:bg-primary-100/40 focus-visible:shadow-focus focus-visible:outline-none"
            >
              <Plus size={18} aria-hidden="true" />
              Add service
            </button>
          </>
        )}
      </div>

      {items.length > 0 && (
        <StickyBottomBar
          totalPrice={subtotal.amount / 100}
          priceLabel={formatPrice(subtotal)}
          serviceCount={selected.length}
          duration={duration > 0 ? formatDuration(duration) : undefined}
          ctaLabel="Continue"
          disabled={selected.length === 0}
          onCtaClick={() => void navigate('/checkout')}
        />
      )}
    </div>
  );
}
