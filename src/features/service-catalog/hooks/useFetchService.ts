import { useQuery } from '@tanstack/react-query';
import { fetchService } from '../api/catalogApi';
import { CATALOG_STALE_TIME_MS, catalogKeys } from './keys';
import { getApiErrorMessage } from '../../../utils/apiError';

interface UseFetchServiceOptions {
  /** Set false to defer the query (e.g. until the id is resolved from the route). */
  enabled?: boolean;
}

export function useFetchService(id: string, options: UseFetchServiceOptions = {}) {
  return useQuery({
    enabled: (options.enabled ?? true) && !!id,
    queryKey: catalogKeys.service(id),
    queryFn: async () => {
      try {
        return await fetchService(id);
      } catch (error) {
        console.error('[Catalog] Failed to fetch service:', getApiErrorMessage(error));
        throw error;
      }
    },
    staleTime: CATALOG_STALE_TIME_MS,
  });
}
