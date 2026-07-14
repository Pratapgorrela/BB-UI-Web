import { formatDistanceToNow } from 'date-fns';
import { Avatar, StarRating } from '../../../components/ui';
import type { Review } from '../types/review';

interface ReviewCardProps {
  review: Review;
}

/** One review row: author avatar + name, stars, relative date, comment. */
function ReviewCard({ review }: ReviewCardProps) {
  return (
    <article className="flex gap-3 py-4">
      <Avatar
        src={review.user.avatarUrl ?? undefined}
        name={review.user.firstName}
        size="sm"
        className="mt-0.5 shrink-0"
      />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <p className="text-body-sm font-semibold text-neutral-900">{review.user.firstName}</p>
          <StarRating value={review.rating} size={14} />
          <p className="text-caption text-neutral-400">
            {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
          </p>
        </div>
        <p className="mt-1 text-body-sm text-neutral-600">{review.comment}</p>
      </div>
    </article>
  );
}

export { ReviewCard };
export type { ReviewCardProps };
