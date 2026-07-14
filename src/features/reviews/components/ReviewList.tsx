import { useState } from 'react';
import { MessageSquare } from 'lucide-react';
import { Button, DataState, Skeleton } from '../../../components/ui';
import { useFetchServiceReviews } from '../hooks/useFetchServiceReviews';
import { ReviewCard } from './ReviewCard';
import type { ReviewsPage } from '../types/review';

interface ReviewListProps {
  serviceId: string;
}

/** Skeleton mirroring the review rows (avatar + name/stars + comment lines). */
function ReviewListSkeleton() {
  return (
    <div className="flex flex-col gap-6 py-4" aria-hidden="true">
      {Array.from({ length: 2 }).map((_, index) => (
        <div key={index} className="flex gap-3">
          <Skeleton variant="circle" width="2rem" height="2rem" />
          <div className="flex-1">
            <Skeleton variant="line" width="40%" />
            <Skeleton variant="line" width="90%" className="mt-2" />
            <Skeleton variant="line" width="70%" className="mt-1" />
          </div>
        </div>
      ))}
    </div>
  );
}

/** Paginated reviews for one service — the 4-data-state section body. */
function ReviewList({ serviceId }: ReviewListProps) {
  const [page, setPage] = useState(1);
  const query = useFetchServiceReviews(serviceId, { page });

  return (
    <DataState<ReviewsPage>
      data={query.data}
      isLoading={query.isLoading}
      error={query.error}
      onRetry={() => void query.refetch()}
      skeleton={<ReviewListSkeleton />}
      isEmpty={(data) => data.reviews.length === 0}
      emptyIcon={<MessageSquare size={48} className="text-neutral-400" aria-hidden="true" />}
      emptyMessage="No reviews yet. Book this service and be the first to share your experience."
    >
      {({ reviews, pagination }) => (
        <div>
          <ul className="divide-y divide-neutral-100">
            {reviews.map((review) => (
              <li key={review.id}>
                <ReviewCard review={review} />
              </li>
            ))}
          </ul>
          {pagination.totalPages > 1 && (
            <nav
              aria-label="Reviews pagination"
              className="flex items-center justify-between gap-2 pt-2"
            >
              <Button
                variant="ghost"
                size="sm"
                disabled={!pagination.hasPreviousPage}
                onClick={() => setPage((current) => Math.max(1, current - 1))}
              >
                Previous
              </Button>
              <p className="text-caption text-neutral-500" aria-live="polite">
                Page {pagination.page} of {pagination.totalPages}
              </p>
              <Button
                variant="ghost"
                size="sm"
                disabled={!pagination.hasNextPage}
                onClick={() => setPage((current) => current + 1)}
              >
                Next
              </Button>
            </nav>
          )}
        </div>
      )}
    </DataState>
  );
}

export { ReviewList };
export type { ReviewListProps };
