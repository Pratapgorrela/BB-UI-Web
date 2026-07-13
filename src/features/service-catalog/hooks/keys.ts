import type { ServiceFilters } from '../types/catalog';

export const catalogKeys = {
  all: ['catalog'] as const,
  categories: () => [...catalogKeys.all, 'categories'] as const,
  services: (filters?: ServiceFilters) => [...catalogKeys.all, 'services', filters] as const,
  service: (id: string) => [...catalogKeys.all, 'service', id] as const,
  specialists: (serviceId?: string) => [...catalogKeys.all, 'specialists', serviceId] as const,
  specialist: (id: string) => [...catalogKeys.all, 'specialist', id] as const,
};

/** Catalog data changes rarely — avoid refetch churn while browsing. */
export const CATALOG_STALE_TIME_MS = 5 * 60 * 1000;
