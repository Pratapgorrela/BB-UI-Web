import type { CheckoutSummaryRequest } from '../types/cart';

export const cartKeys = {
  all: ['cart'] as const,
  coupons: () => [...cartKeys.all, 'coupons'] as const,
  summary: (request: CheckoutSummaryRequest) => [...cartKeys.all, 'summary', request] as const,
};

/** Coupons are curated and change rarely. */
export const CART_STALE_TIME_MS = 5 * 60 * 1000;
