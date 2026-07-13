export const homeKeys = {
  all: ['home'] as const,
  offers: () => [...homeKeys.all, 'offers'] as const,
  testimonials: () => [...homeKeys.all, 'testimonials'] as const,
  referral: () => [...homeKeys.all, 'referral'] as const,
};

/** Promotional/editorial content changes rarely — avoid refetch churn. */
export const HOME_STALE_TIME_MS = 5 * 60 * 1000;
