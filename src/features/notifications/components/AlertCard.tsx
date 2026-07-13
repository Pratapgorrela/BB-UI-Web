import { formatDistanceToNow } from 'date-fns';
import { CalendarClock, CheckCircle2, Star, Tag, X, XCircle } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { Notification, NotificationType } from '../types/notification';

interface TypeStyle {
  icon: LucideIcon;
  /** Icon circle background + foreground token classes. */
  iconClass: string;
}

const TYPE_STYLES: Record<NotificationType, TypeStyle> = {
  BOOKING_CONFIRMED: { icon: CheckCircle2, iconClass: 'bg-success-100 text-success-600' },
  BOOKING_REMINDER: { icon: CalendarClock, iconClass: 'bg-info-100 text-info-600' },
  BOOKING_CANCELLED: { icon: XCircle, iconClass: 'bg-danger-100 text-danger-600' },
  REVIEW_REQUEST: { icon: Star, iconClass: 'bg-warning-100 text-warning-600' },
  PROMO: { icon: Tag, iconClass: 'bg-primary-100 text-primary-600' },
};

interface AlertCardProps {
  notification: Notification;
  onOpen: (notification: Notification) => void;
  onDismiss: (notification: Notification) => void;
}

function relativeTime(iso: string): string {
  try {
    return formatDistanceToNow(new Date(iso), { addSuffix: true });
  } catch {
    return '';
  }
}

/** A single alert row: type icon, title, message, relative time, dismiss X. */
function AlertCard({ notification, onOpen, onDismiss }: AlertCardProps) {
  const { icon: Icon, iconClass } = TYPE_STYLES[notification.type];
  const unread = !notification.isRead;

  return (
    <div
      className={[
        'relative flex gap-3 rounded-lg border p-4 transition-colors duration-fast ease-fast',
        unread ? 'border-primary-200 bg-primary-100/40' : 'border-neutral-200 bg-neutral-0',
      ].join(' ')}
    >
      <span
        className={['flex size-10 shrink-0 items-center justify-center rounded-full', iconClass].join(
          ' ',
        )}
        aria-hidden="true"
      >
        <Icon size={20} />
      </span>

      <button
        type="button"
        onClick={() => onOpen(notification)}
        className="min-w-0 flex-1 text-left focus-visible:shadow-focus focus-visible:outline-none"
      >
        <div className="flex items-center gap-2">
          {unread && (
            <span
              className="size-2 shrink-0 rounded-full bg-primary-500"
              aria-label="Unread"
            />
          )}
          <p className="truncate text-body-sm font-semibold text-neutral-800">
            {notification.title}
          </p>
        </div>
        <p className="mt-0.5 line-clamp-2 text-body-sm text-neutral-600">{notification.message}</p>
        <p className="mt-1 text-caption text-neutral-400">{relativeTime(notification.createdAt)}</p>
      </button>

      <button
        type="button"
        aria-label={`Dismiss ${notification.title}`}
        onClick={() => onDismiss(notification)}
        className="flex size-8 shrink-0 items-center justify-center self-start rounded-full text-neutral-400 transition-colors duration-fast ease-fast hover:bg-neutral-200 hover:text-neutral-600 focus-visible:shadow-focus focus-visible:outline-none"
      >
        <X size={18} aria-hidden="true" />
      </button>
    </div>
  );
}

export { AlertCard };
export type { AlertCardProps };
