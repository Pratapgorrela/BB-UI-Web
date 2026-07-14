import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { fetchSupportRequests } from '../api/supportApi';
import { SUPPORT_REQUESTS_STALE_TIME_MS, supportKeys } from './keys';
import { getApiErrorMessage } from '../../../utils/apiError';
import type { SupportRequestListFilters } from '../types/support';

/** The caller's support requests, paginated (`createdAt` DESC). */
export function useFetchSupportRequests(filters: SupportRequestListFilters = {}) {
  return useQuery({
    queryKey: supportKeys.requestList({ page: filters.page ?? 1 }),
    queryFn: async () => {
      try {
        return await fetchSupportRequests(filters);
      } catch (error) {
        console.error('[Support] Failed to fetch support requests:', getApiErrorMessage(error));
        throw error;
      }
    },
    placeholderData: keepPreviousData,
    staleTime: SUPPORT_REQUESTS_STALE_TIME_MS,
    retry: false,
  });
}
