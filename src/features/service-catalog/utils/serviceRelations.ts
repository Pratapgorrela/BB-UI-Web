import type { Service } from '../types/catalog';

const RECOMMENDED_LIMIT = 6;

interface ServiceRelations {
  /** For a COMBO: its included services resolved against the same-category pool. */
  included: Service[];
  /** Same-category SINGLE services excluding the service itself and its inclusions. */
  recommended: Service[];
}

/**
 * Derives the combo "what's included" and "recommended" add-on lists from one
 * same-category pool — no invented contract field. Shared by the service detail
 * page and the category-page details bottom sheet.
 */
function deriveServiceRelations(service: Service | undefined, pool: Service[]): ServiceRelations {
  if (!service) return { included: [], recommended: [] };

  const byId = new Map(pool.map((candidate) => [candidate.id, candidate]));
  const included =
    service.type === 'COMBO'
      ? service.includedServiceIds
          .map((includedId) => byId.get(includedId))
          .filter((item): item is Service => item != null)
      : [];

  const includedIds = new Set(service.includedServiceIds);
  const recommended = pool
    .filter(
      (candidate) =>
        candidate.id !== service.id &&
        candidate.type === 'SINGLE' &&
        !includedIds.has(candidate.id),
    )
    .slice(0, RECOMMENDED_LIMIT);

  return { included, recommended };
}

export { deriveServiceRelations };
export type { ServiceRelations };
