import { useQuery } from '@tanstack/react-query';
import { fetchBooking } from '../api/bookingApi';
import { BOOKINGS_STALE_TIME_MS, bookingKeys } from './keys';
import { getApiErrorMessage } from '../../../utils/apiError';

/** One booking with its specialist + address expanded. Disabled until an id exists. */
export function useFetchBooking(id: string | undefined) {
  return useQuery({
    enabled: !!id,
    queryKey: bookingKeys.detail(id ?? ''),
    queryFn: async () => {
      try {
        return await fetchBooking(id!);
      } catch (error) {
        console.error('[Booking] Failed to fetch booking:', getApiErrorMessage(error));
        throw error;
      }
    },
    staleTime: BOOKINGS_STALE_TIME_MS,
    retry: false,
  });
}
