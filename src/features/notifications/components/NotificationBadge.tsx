import { useUnreadNotificationCount } from '../hooks/useUnreadNotificationCount';

interface NotificationBadgeProps {
  /** Extra positioning classes from the host (e.g. absolute placement over an icon). */
  className?: string;
}

/**
 * Unread-count pill for the Alerts nav item. Renders nothing when the count is
 * zero or the user is unauthenticated (the underlying query stays disabled).
 */
function NotificationBadge({ className = '' }: NotificationBadgeProps) {
  const { data: count = 0 } = useUnreadNotificationCount();
  if (count <= 0) return null;

  return (
    <span
      className={[
        'flex h-4 min-w-4 items-center justify-center rounded-full bg-danger-500 px-1 text-caption font-bold leading-none text-neutral-0',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      aria-label={`${count} unread ${count === 1 ? 'notification' : 'notifications'}`}
    >
      {count > 9 ? '9+' : count}
    </span>
  );
}

export { NotificationBadge };
export type { NotificationBadgeProps };
