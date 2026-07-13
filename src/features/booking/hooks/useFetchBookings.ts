import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { fetchBookings } from '../api/bookingApi';
import { BOOKINGS_STALE_TIME_MS, bookingKeys } from './keys';
import { getApiErrorMessage } from '../../../utils/apiError';
import type { BookingListFilters } from '../types/booking';

/** The caller's bookings, filtered by status and paginated (`scheduledAt` DESC). */
export function useFetchBookings(filters: BookingListFilters = {}) {
  return useQuery({
    queryKey: bookingKeys.list({
      status: filters.status?.join(',') ?? 'ALL',
      page: filters.page ?? 1,
      limit: filters.limit ?? 10,
    }),
    queryFn: async () => {
      try {
        return await fetchBookings(filters);
      } catch (error) {
        console.error('[Booking] Failed to fetch bookings:', getApiErrorMessage(error));
        throw error;
      }
    },
    placeholderData: keepPreviousData,
    staleTime: BOOKINGS_STALE_TIME_MS,
    retry: false,
  });
}
