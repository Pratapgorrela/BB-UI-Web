import { useNavigate } from 'react-router-dom';
import { ChevronDown, ShoppingCart } from 'lucide-react';
import { useToast } from '../../../components/ui';
import { useAuthStore } from '../../../store/useAuthStore';

interface HomeHeaderProps {
  /** Items in the cart. The badge is hidden while this is 0. */
  cartCount?: number;
}

/**
 * Home greeting header: "Hello" + first name, an address selector, and a cart icon.
 * Address selection (F9) doesn't exist yet, so that tap fires a "coming soon" toast;
 * the cart icon navigates to the cart (F13).
 */
function HomeHeader({ cartCount = 0 }: HomeHeaderProps) {
  const { addToast } = useToast();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  const greeting = user ? `Hello, ${user.firstName}` : 'Hello';

  return (
    <header className="flex items-start justify-between gap-3 pt-4 md:hidden">
      <div className="min-w-0">
        <p className="font-heading text-h4 font-semibold text-neutral-900">{greeting}</p>
        <button
          type="button"
          onClick={() => addToast('Address selection is coming soon', 'info')}
          className="mt-0.5 flex max-w-full items-center gap-1 text-body-sm text-neutral-500 focus-visible:shadow-focus focus-visible:outline-none"
        >
          <span className="truncate">Set your delivery address</span>
          <ChevronDown size={16} className="shrink-0" aria-hidden="true" />
        </button>
      </div>

      <button
        type="button"
        aria-label={cartCount > 0 ? `Cart, ${cartCount} items` : 'Cart'}
        onClick={() => void navigate('/cart')}
        className="relative flex size-11 shrink-0 items-center justify-center rounded-lg border border-neutral-200 text-neutral-800 transition-colors duration-fast ease-fast hover:bg-neutral-100 focus-visible:shadow-focus focus-visible:outline-none"
      >
        <ShoppingCart size={20} aria-hidden="true" />
        {cartCount > 0 && (
          <span className="absolute -right-1.5 -top-1.5 flex min-w-5 items-center justify-center rounded-full bg-danger-500 px-1 text-caption font-semibold text-neutral-0">
            {cartCount}
          </span>
        )}
      </button>
    </header>
  );
}

export { HomeHeader };
export type { HomeHeaderProps };
