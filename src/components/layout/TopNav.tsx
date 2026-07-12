import { Link, NavLink } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { Container } from './Container';
import { NAV_ITEMS } from './navItems';

const primaryLinks = NAV_ITEMS.slice(0, 3);

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
      </Container>
    </header>
  );
}

export { TopNav };
