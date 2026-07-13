import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { fetchCheckoutSummary } from '../api/cartApi';
import { cartKeys } from './keys';
import { getApiErrorMessage } from '../../../utils/apiError';
import type { CheckoutSummaryRequest } from '../types/cart';

interface UseCheckoutSummaryOptions {
  enabled?: boolean;
}

/**
 * Computes the payment breakdown for the given items + optional coupon.
 * Semantically a query (idempotent price computation) despite the POST.
 * `keepPreviousData` keeps the last good breakdown on screen while a new coupon
 * is validated — so a rejected coupon shows an error without blanking the totals.
 */
export function useCheckoutSummary(
  request: CheckoutSummaryRequest,
  options: UseCheckoutSummaryOptions = {},
) {
  return useQuery({
    enabled: (options.enabled ?? true) && request.items.length > 0,
    queryKey: cartKeys.summary(request),
    queryFn: async () => {
      try {
        return await fetchCheckoutSummary(request);
      } catch (error) {
        console.error('[Cart] Failed to compute checkout summary:', getApiErrorMessage(error));
        throw error;
      }
    },
    placeholderData: keepPreviousData,
    retry: false,
  });
}
