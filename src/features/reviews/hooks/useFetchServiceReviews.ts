import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { fetchServiceReviews } from '../api/reviewsApi';
import { REVIEWS_STALE_TIME_MS, reviewKeys } from './keys';
import { getApiErrorMessage } from '../../../utils/apiError';
import type { ReviewListFilters } from '../types/review';

/** A service's reviews, paginated (`createdAt` DESC). Guest-accessible. */
export function useFetchServiceReviews(serviceId: string, filters: ReviewListFilters = {}) {
  return useQuery({
    queryKey: reviewKeys.serviceList(serviceId, { page: filters.page ?? 1 }),
    queryFn: async () => {
      try {
        return await fetchServiceReviews(serviceId, filters);
      } catch (error) {
        console.error('[Reviews] Failed to fetch reviews:', getApiErrorMessage(error));
        throw error;
      }
    },
    enabled: serviceId.length > 0,
    placeholderData: keepPreviousData,
    staleTime: REVIEWS_STALE_TIME_MS,
    retry: false,
  });
}
