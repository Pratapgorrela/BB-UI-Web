import { useQuery } from '@tanstack/react-query';
import { fetchOffers } from '../api/homeApi';
import { HOME_STALE_TIME_MS, homeKeys } from './keys';
import { getApiErrorMessage } from '../../../utils/apiError';

export function useFetchOffers() {
  return useQuery({
    queryKey: homeKeys.offers(),
    queryFn: async () => {
      try {
        return await fetchOffers();
      } catch (error) {
        console.error('[HomeOffers] Failed to fetch offers:', getApiErrorMessage(error));
        throw error;
      }
    },
    staleTime: HOME_STALE_TIME_MS,
  });
}
