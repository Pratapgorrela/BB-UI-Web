import { useQuery } from '@tanstack/react-query';
import { fetchCoupons } from '../api/cartApi';
import { CART_STALE_TIME_MS, cartKeys } from './keys';
import { getApiErrorMessage } from '../../../utils/apiError';

export function useFetchCoupons() {
  return useQuery({
    queryKey: cartKeys.coupons(),
    queryFn: async () => {
      try {
        return await fetchCoupons();
      } catch (error) {
        console.error('[Cart] Failed to fetch coupons:', getApiErrorMessage(error));
        throw error;
      }
    },
    staleTime: CART_STALE_TIME_MS,
  });
}
