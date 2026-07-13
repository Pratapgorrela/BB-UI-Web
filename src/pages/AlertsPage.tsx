import { useNavigate, useSearchParams } from 'react-router-dom';
import { BellOff, CheckCheck, Settings } from 'lucide-react';
import { Button, DataState, Tabs } from '../components/ui';
import {
  AlertCard,
  useDismissNotification,
  useFetchNotifications,
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
} from '../features/notifications';
import type {
  Notification,
  NotificationCategory,
  NotificationsPage,
} from '../features/notifications';

const PAGE_SIZE = 20;

type AlertsTab = 'all' | 'bookings' | 'offers';

/** Tab → contract `category` filter (Figma: All / Bookings / Offers). */
const TAB_CATEGORY: Record<AlertsTab, NotificationCategory | undefined> = {
  all: undefined,
  bookings: 'BOOKING',
  offers: 'OFFER',
};

const TABS: { id: AlertsTab; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'bookings', label: 'Bookings' },
  { id: 'offers', label: 'Offers' },
];

const EMPTY_MESSAGE: Record<AlertsTab, string> = {
  all: 'No notifications yet. We’ll let you know when something happens.',
  bookings: 'No booking updates yet.',
  offers: 'No offers right now. Check back soon.',
};

function isAlertsTab(value: string | null): value is AlertsTab {
  return value === 'all' || value === 'bookings' || value === 'offers';
}

export function Component() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const tabParam = searchParams.get('tab');
  const tab: AlertsTab = isAlertsTab(tabParam) ? tabParam : 'all';
  const pageParam = Number(searchParams.get('page'));
  const page = Number.isInteger(pageParam) && pageParam > 1 ? pageParam : 1;

  const query = useFetchNotifications({ category: TAB_CATEGORY[tab], page, limit: PAGE_SIZE });
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();
  const dismiss = useDismissNotification();

  function selectTab(nextTab: string) {
    setSearchParams({ tab: nextTab }, { replace: true });
  }

  function selectPage(nextPage: number) {
    setSearchParams({ tab, page: String(nextPage) }, { replace: true });
  }

  function openNotification(notification: Notification) {
    if (!notification.isRead) markRead.mutate(notification.id);
    if (notification.referenceType === 'BOOKING' && notification.referenceId) {
      navigate(`/bookings/${notification.referenceId}`);
    }
  }

  return (
    <div className="flex flex-col gap-4 py-6">
      <div className="flex items-center justify-between gap-2">
        <h1 className="font-heading text-h1 font-bold text-neutral-800">Alerts</h1>
        <button
          type="button"
          aria-label="Notification settings"
          onClick={() => navigate('/notifications/settings')}
          className="flex size-touch-target items-center justify-center rounded-full text-neutral-600 transition-colors duration-fast ease-fast hover:bg-neutral-200 focus-visible:shadow-focus focus-visible:outline-none"
        >
          <Settings size={22} aria-hidden="true" />
        </button>
      </div>

      <div className="flex items-center justify-between gap-2">
        <Tabs
          tabs={TABS}
          activeId={tab}
          onChange={selectTab}
          aria-label="Filter notifications"
          className="flex-1"
        />
      </div>

      <div className="flex justify-end">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => markAllRead.mutate()}
          disabled={markAllRead.isPending}
        >
          <CheckCheck size={16} aria-hidden="true" />
          Mark all read
        </Button>
      </div>

      <DataState<NotificationsPage>
        data={query.data}
        isLoading={query.isLoading}
        error={query.error}
        isEmpty={(data) => data.notifications.length === 0}
        emptyIcon={<BellOff size={48} className="text-neutral-400" aria-hidden="true" />}
        emptyMessage={EMPTY_MESSAGE[tab]}
        onRetry={() => void query.refetch()}
      >
        {({ notifications, pagination }) => (
          <>
            <div className="flex flex-col gap-3">
              {notifications.map((notification) => (
                <AlertCard
                  key={notification.id}
                  notification={notification}
                  onOpen={openNotification}
                  onDismiss={(n) => dismiss.mutate(n.id)}
                />
              ))}
            </div>

            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 pt-2">
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={!pagination.hasPreviousPage || query.isFetching}
                  onClick={() => selectPage(page - 1)}
                >
                  Previous
                </Button>
                <span className="text-body-sm text-neutral-600">
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={!pagination.hasNextPage || query.isFetching}
                  onClick={() => selectPage(page + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </DataState>
    </div>
  );
}
