import { useNavigate, useSearchParams } from 'react-router-dom';
import { CalendarX2 } from 'lucide-react';
import { Button, DataState, SkeletonCard, Tabs } from '../components/ui';
import { BookingCard, useFetchBookings } from '../features/booking';
import type { BookingsPage, BookingStatus } from '../features/booking';

const PAGE_SIZE = 10;

type BookingsTab = 'upcoming' | 'past' | 'cancelled';

/** Tab → contract `status` filter (Figma: Upcoming / Past / Cancelled). */
const TAB_STATUS: Record<BookingsTab, BookingStatus[]> = {
  upcoming: ['PENDING', 'CONFIRMED', 'IN_PROGRESS'],
  past: ['COMPLETED'],
  cancelled: ['CANCELLED'],
};

const TABS: { id: BookingsTab; label: string }[] = [
  { id: 'upcoming', label: 'Upcoming' },
  { id: 'past', label: 'Past' },
  { id: 'cancelled', label: 'Cancelled' },
];

const EMPTY_MESSAGE: Record<BookingsTab, string> = {
  upcoming: 'No upcoming bookings. Browse services to book your first appointment.',
  past: 'No past bookings yet.',
  cancelled: 'No cancelled bookings.',
};

function isBookingsTab(value: string | null): value is BookingsTab {
  return value === 'upcoming' || value === 'past' || value === 'cancelled';
}

export function Component() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const tabParam = searchParams.get('tab');
  const tab: BookingsTab = isBookingsTab(tabParam) ? tabParam : 'upcoming';
  const pageParam = Number(searchParams.get('page'));
  const page = Number.isInteger(pageParam) && pageParam > 1 ? pageParam : 1;

  const query = useFetchBookings({ status: TAB_STATUS[tab], page, limit: PAGE_SIZE });

  function selectTab(nextTab: string) {
    // Switching tabs resets pagination; replace keeps back-nav on the page itself.
    setSearchParams({ tab: nextTab }, { replace: true });
  }

  function selectPage(nextPage: number) {
    setSearchParams({ tab, page: String(nextPage) }, { replace: true });
  }

  return (
    <div className="flex flex-col gap-4 py-6">
      <h1 className="font-heading text-h1 font-bold text-neutral-800">My bookings</h1>

      <Tabs tabs={TABS} activeId={tab} onChange={selectTab} aria-label="Filter bookings" />

      <DataState<BookingsPage>
        data={query.data}
        isLoading={query.isLoading}
        error={query.error}
        isEmpty={(data) => data.bookings.length === 0}
        emptyIcon={<CalendarX2 size={48} className="text-neutral-400" aria-hidden="true" />}
        emptyMessage={EMPTY_MESSAGE[tab]}
        emptyCta={
          tab === 'upcoming'
            ? { label: 'Browse services', onClick: () => navigate('/services') }
            : undefined
        }
        onRetry={() => void query.refetch()}
        skeleton={
          <div className="flex flex-col gap-3 md:grid md:grid-cols-2 md:gap-4 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        }
      >
        {({ bookings, pagination }) => (
          <>
            <div className="flex flex-col gap-3 md:grid md:grid-cols-2 md:gap-4 lg:grid-cols-3">
              {bookings.map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
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
