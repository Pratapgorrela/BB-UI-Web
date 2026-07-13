import { Link, NavLink } from 'react-router-dom';
import { ShoppingCart, Sparkles } from 'lucide-react';
import { Container } from './Container';
import { NAV_ITEMS } from './navItems';
import { Avatar } from '../ui';
import { useAuthStore } from '../../store/useAuthStore';
import { cartItemCount, useCartStore } from '../../store/useCartStore';
import { useLogoutUser } from '../../features/auth';

const primaryLinks = NAV_ITEMS.slice(0, 3);

function CartLink() {
  const cartCount = useCartStore((state) => cartItemCount(state.items));

  return (
    <Link
      to="/cart"
      aria-label={cartCount > 0 ? `Cart, ${cartCount} items` : 'Cart'}
      className="relative flex size-9 items-center justify-center rounded-md text-neutral-700 transition-colors duration-fast ease-fast hover:bg-neutral-100 hover:text-primary-600 focus-visible:shadow-focus focus-visible:outline-none"
    >
      <ShoppingCart size={20} aria-hidden="true" />
      {cartCount > 0 && (
        <span className="absolute -right-1 -top-1 flex min-w-5 items-center justify-center rounded-full bg-danger-500 px-1 text-caption font-semibold text-neutral-0">
          {cartCount}
        </span>
      )}
    </Link>
  );
}

function AuthActions() {
  const user = useAuthStore((state) => state.user);
  const logout = useLogoutUser();

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Link
          to="/login"
          className="inline-flex h-9 items-center rounded-md px-3 text-body-sm font-semibold text-primary-600 transition-colors duration-fast ease-fast hover:bg-primary-100 focus-visible:shadow-focus focus-visible:outline-none"
        >
          Log in
        </Link>
        <Link
          to="/register"
          className="inline-flex h-9 items-center rounded-md bg-primary-500 px-4 text-body-sm font-semibold text-neutral-0 transition-colors duration-fast ease-fast hover:bg-primary-600 focus-visible:shadow-focus focus-visible:outline-none"
        >
          Sign up
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <Link
        to="/profile"
        aria-label="Your profile"
        className="flex items-center gap-2 rounded-md focus-visible:shadow-focus focus-visible:outline-none"
      >
        <Avatar size="sm" name={`${user.firstName} ${user.lastName}`} />
        <span className="text-body-sm font-medium text-neutral-700">{user.firstName}</span>
      </Link>
      <button
        type="button"
        onClick={() => logout.mutate()}
        disabled={logout.isPending}
        className="inline-flex h-9 items-center rounded-md px-3 text-body-sm font-semibold text-neutral-600 transition-colors duration-fast ease-fast hover:bg-neutral-200 hover:text-neutral-800 focus-visible:shadow-focus focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
      >
        Log out
      </button>
    </div>
  );
}

function TopNav() {
  return (
    <header className="sticky top-0 z-(--z-sticky) hidden h-top-nav border-b border-neutral-200 bg-neutral-0 md:block">
      <Container className="flex h-full items-center justify-between gap-6">
        <Link
          to="/"
          aria-label="Beauty Bus home"
          className="flex items-center gap-2 rounded-md font-heading text-h4 font-bold text-primary-500 focus-visible:shadow-focus focus-visible:outline-none"
        >
          <Sparkles size={24} aria-hidden="true" />
          Beauty Bus
        </Link>
        <nav aria-label="Primary" className="flex items-center gap-1">
          {primaryLinks.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                [
                  'rounded-md px-3 py-2 text-body-sm',
                  'transition-colors duration-fast ease-fast',
                  'focus-visible:shadow-focus focus-visible:outline-none',
                  isActive
                    ? 'font-semibold text-primary-600'
                    : 'font-medium text-neutral-600 hover:text-primary-600',
                ].join(' ')
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <CartLink />
          <AuthActions />
        </div>
      </Container>
    </header>
  );
}

export { TopNav };
