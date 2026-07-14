/**
 * Review entity for F10 (Reviews). Mirrors the LOCKED "Reviews" contract
 * entity field-for-field. A review is written for one service of a completed
 * booking; uniqueness is one review per booking.
 */

/** Author details expanded on reviews in list/create responses. */
interface ReviewUser {
  firstName: string;
  avatarUrl: string | null;
}

interface Review {
  id: string;
  userId: string;
  serviceId: string;
  bookingId: string;
  /** 1–5 stars. */
  rating: number;
  comment: string;
  createdAt: string;
  user: ReviewUser;
}

/** POST /reviews body — `serviceId` must be one of the booking's items. */
interface CreateReviewRequest {
  bookingId: string;
  serviceId: string;
  rating: number;
  comment: string;
}

/** GET /services/:id/reviews query filters. */
interface ReviewListFilters {
  page?: number;
  limit?: number;
}

/** A page of reviews from `GET /services/:id/reviews` (paginated envelope). */
interface ReviewsPage {
  reviews: Review[];
  pagination: import('../../../types/api').Pagination;
}

export type { CreateReviewRequest, Review, ReviewListFilters, ReviewsPage, ReviewUser };
