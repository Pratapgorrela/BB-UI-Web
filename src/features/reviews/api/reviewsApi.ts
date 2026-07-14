import { apiClient } from '../../../lib/apiClient';
import type { ApiPaginated, ApiSuccess } from '../../../types/api';
import type { CreateReviewRequest, Review, ReviewListFilters, ReviewsPage } from '../types/review';

async function fetchServiceReviews(
  serviceId: string,
  filters: ReviewListFilters = {},
): Promise<ReviewsPage> {
  const params: Record<string, string | number> = {
    page: filters.page ?? 1,
    limit: filters.limit ?? 10,
  };
  const response = await apiClient.get<ApiPaginated<Review>>(`/services/${serviceId}/reviews`, {
    params,
  });
  return { reviews: response.data.data, pagination: response.data.pagination };
}

async function createReview(payload: CreateReviewRequest): Promise<Review> {
  const response = await apiClient.post<ApiSuccess<Review>>('/reviews', payload);
  return response.data.data;
}

export { createReview, fetchServiceReviews };
