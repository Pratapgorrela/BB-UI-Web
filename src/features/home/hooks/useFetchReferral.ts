import { useQuery } from '@tanstack/react-query';
import { fetchReferral } from '../api/homeApi';
import { HOME_STALE_TIME_MS, homeKeys } from './keys';
import { getApiErrorMessage } from '../../../utils/apiError';

export function useFetchReferral() {
  return useQuery({
    queryKey: homeKeys.referral(),
    queryFn: async () => {
      try {
        return await fetchReferral();
      } catch (error) {
        console.error('[HomeReferral] Failed to fetch referral:', getApiErrorMessage(error));
        throw error;
      }
    },
    staleTime: HOME_STALE_TIME_MS,
  });
}
