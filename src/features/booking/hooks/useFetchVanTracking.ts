import { useQuery } from '@tanstack/react-query';
import { fetchVanTracking } from '../api/bookingApi';
import { bookingKeys, TRACKING_REFETCH_INTERVAL_MS } from './keys';
import { getApiError, getApiErrorMessage } from '../../../utils/apiError';

/**
 * The van tracking snapshot for an active booking. Polls while the screen is
 * open (the snapshot is point-in-time), but stops on terminal outcomes —
 * 404 (unknown/foreign booking) and 422 (booking no longer active) won't
 * change on refetch.
 */
export function useFetchVanTracking(id: string | undefined) {
  return useQuery({
    enabled: !!id,
    queryKey: bookingKeys.tracking(id ?? ''),
    queryFn: async () => {
      try {
        return await fetchVanTracking(id!);
      } catch (error) {
        console.error('[TrackVan] Failed to fetch tracking:', getApiErrorMessage(error));
        throw error;
      }
    },
    refetchInterval: (query) => {
      const code = getApiError(query.state.error)?.code;
      return code === 'RESOURCE_NOT_FOUND' || code === 'BUSINESS_RULE_VIOLATION'
        ? false
        : TRACKING_REFETCH_INTERVAL_MS;
    },
    retry: false,
  });
}
