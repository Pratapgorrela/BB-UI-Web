import { fail, ok, paginated, registerMock } from '../lib/mockEngine';
import { seedCategories } from '../data/categories.data';
import { seedServices } from '../data/services.data';
import { serviceFiltersSchema } from '../../features/service-catalog/types/catalog.schema';
import type { Service, ServiceCategory } from '../../features/service-catalog/types/catalog';
import type { ApiErrorDetail } from '../../types/api';

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;

/** serviceCount derived from the seed services so the two data files never drift. */
const categories: ServiceCategory[] = [...seedCategories]
  .sort((a, b) => a.sortOrder - b.sortOrder)
  .map((base) => ({
    ...base,
    serviceCount: seedServices.filter((service) => service.categoryId === base.id).length,
  }));

function toValidationDetails(issues: { path: PropertyKey[]; message: string }[]): ApiErrorDetail[] {
  return issues.map((issue) => ({ field: issue.path.join('.'), message: issue.message }));
}

function matchesSearch(service: Service, needle: string): boolean {
  const haystack =
    `${service.name} ${service.shortDescription} ${service.description}`.toLowerCase();
  return haystack.includes(needle);
}

const sorters: Record<string, (a: Service, b: Service) => number> = {
  price_asc: (a, b) => a.price.amount - b.price.amount,
  price_desc: (a, b) => b.price.amount - a.price.amount,
  rating: (a, b) => b.rating - a.rating,
  name: (a, b) => a.name.localeCompare(b.name),
};

/* ── GET /categories ── */

registerMock('GET', '/categories', () => ok(categories));

/* ── GET /services ── */

registerMock('GET', '/services', (req) => {
  const path = '/api/v1/services';

  // Empty params (e.g. `?search=`) mean "not provided".
  const rawFilters: Record<string, string> = {};
  for (const [key, value] of req.query.entries()) {
    if (value !== '') rawFilters[key] = value;
  }

  const parsed = serviceFiltersSchema.safeParse(rawFilters);
  if (!parsed.success) {
    return fail(400, 'VALIDATION_ERROR', 'Invalid query parameters.', path, toValidationDetails(parsed.error.issues));
  }
  const filters = parsed.data;

  // Forced error for testing the error data state.
  if (filters.search === 'FORCE_500') {
    return fail(500, 'INTERNAL_ERROR', 'Simulated server error. Please try again later.', path);
  }

  let results = seedServices.filter((service) => {
    if (filters.categoryId && service.categoryId !== filters.categoryId) return false;
    if (filters.type && service.type !== filters.type) return false;
    if (filters.isPopular !== undefined && service.isPopular !== filters.isPopular) return false;
    if (filters.minPrice !== undefined && service.price.amount < filters.minPrice) return false;
    if (filters.maxPrice !== undefined && service.price.amount > filters.maxPrice) return false;
    if (filters.search && !matchesSearch(service, filters.search.toLowerCase())) return false;
    return true;
  });

  if (filters.sortBy) {
    results = [...results].sort(sorters[filters.sortBy]);
  }

  return paginated(results, filters.page ?? DEFAULT_PAGE, filters.limit ?? DEFAULT_LIMIT);
});

/* ── GET /services/:id ── */

/** Reserved id that forces a 500 — mirrors the `FORCE_500` search convention above. */
const FORCE_500_ID = 'FORCE_500';

registerMock('GET', '/services/:id', (req) => {
  const { id } = req.params;
  const path = `/api/v1/services/${id}`;

  if (id === FORCE_500_ID) {
    return fail(500, 'INTERNAL_ERROR', 'Simulated server error. Please try again later.', path);
  }

  const service = seedServices.find((candidate) => candidate.id === id);
  if (!service) {
    return fail(404, 'RESOURCE_NOT_FOUND', 'Service not found.', path);
  }

  return ok(service);
});
