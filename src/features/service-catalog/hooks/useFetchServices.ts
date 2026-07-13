import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { fetchServices } from '../api/catalogApi';
import { CATALOG_STALE_TIME_MS, catalogKeys } from './keys';
import { getApiErrorMessage } from '../../../utils/apiError';
import type { ServiceFilters } from '../types/catalog';

interface UseFetchServicesOptions {
  /** Set false to defer the query (e.g. until the category is resolved). */
  enabled?: boolean;
}

export function useFetchServices(
  filters: ServiceFilters = {},
  options: UseFetchServicesOptions = {},
) {
  return useQuery({
    enabled: options.enabled ?? true,
    queryKey: catalogKeys.services(filters),
    queryFn: async () => {
      try {
        return await fetchServices(filters);
      } catch (error) {
        console.error('[Catalog] Failed to fetch services:', getApiErrorMessage(error));
        throw error;
      }
    },
    staleTime: CATALOG_STALE_TIME_MS,
    // Keeps the previous page on screen while the next one loads (pagination/filtering).
    placeholderData: keepPreviousData,
  });
}
