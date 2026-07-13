import { NavLink } from 'react-router-dom';
import { NAV_ITEMS } from './navItems';
import { NotificationBadge } from '../../features/notifications';

function BottomNav() {
  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-(--z-sticky) border-t border-neutral-200 bg-neutral-0 pb-[env(safe-area-inset-bottom)] md:hidden"
    >
      <ul className="flex h-bottom-nav">
        {NAV_ITEMS.map((item) => (
          <li key={item.to} className="flex-1">
            <NavLink
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                [
                  'flex h-full flex-col items-center justify-center gap-0.5',
                  'transition-colors duration-fast ease-fast',
                  'focus-visible:shadow-focus focus-visible:outline-none',
                  isActive ? 'text-primary-500' : 'text-neutral-500',
                ].join(' ')
              }
            >
              {({ isActive }) => (
                <>
                  <span className="relative">
                    <item.icon
                      size={24}
                      aria-hidden="true"
                      fill={isActive ? 'currentColor' : 'none'}
                    />
                    {item.to === '/notifications' && (
                      <NotificationBadge className="absolute -right-2 -top-1.5" />
                    )}
                  </span>
                  <span className="text-caption font-medium">{item.label}</span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export { BottomNav };
