/** FAQs are editorial content — cache aggressively. */
export const FAQS_STALE_TIME_MS = 5 * 60_000;

/** Requests change only via the caller's own submissions — 30s is plenty. */
export const SUPPORT_REQUESTS_STALE_TIME_MS = 30_000;

export const supportKeys = {
  all: ['support'] as const,
  faqs: () => [...supportKeys.all, 'faqs'] as const,
  requests: () => [...supportKeys.all, 'requests'] as const,
  requestList: (filters: { page: number }) => [...supportKeys.requests(), filters] as const,
};
