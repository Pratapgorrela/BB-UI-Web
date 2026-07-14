/** Reviews change only when someone submits one — 30s matches the other lists. */
export const REVIEWS_STALE_TIME_MS = 30_000;

export const reviewKeys = {
  all: ['reviews'] as const,
  service: (serviceId: string) => [...reviewKeys.all, 'service', serviceId] as const,
  serviceList: (serviceId: string, filters: { page: number }) =>
    [...reviewKeys.service(serviceId), filters] as const,
};
