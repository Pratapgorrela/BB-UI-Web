import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SearchX } from 'lucide-react';
import { DataState, Skeleton, SkeletonCard, useToast } from '../components/ui';
import {
  CatalogControls,
  CatalogPagination,
  CategoryCard,
  CategoryFilterBar,
  ServiceCard,
  serviceFiltersSchema,
  useFetchCategories,
  useFetchServices,
} from '../features/service-catalog';
import type { ServiceFilters } from '../features/service-catalog';

const PAGE_SIZE = 12;

/** URL searchParams → validated filters; invalid or unknown params are dropped. */
function parseFilters(searchParams: URLSearchParams): ServiceFilters {
  const raw: Record<string, string> = {};
  for (const [key, value] of searchParams.entries()) {
    if (value !== '') raw[key] = value;
  }
  const parsed = serviceFiltersSchema.safeParse(raw);
  return parsed.success ? parsed.data : {};
}

const categoryGrid = 'grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6';
const serviceGrid = 'grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';

export function Component() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { addToast } = useToast();

  const filters = parseFilters(searchParams);
  const categoriesQuery = useFetchCategories();
  const servicesQuery = useFetchServices({ ...filters, limit: PAGE_SIZE });

  const updateParams = useCallback(
    (patch: Record<string, string | undefined>, { resetPage = true, replace = false } = {}) => {
      setSearchParams(
        (previous) => {
          const next = new URLSearchParams(previous);
          for (const [key, value] of Object.entries(patch)) {
            if (value == null || value === '') next.delete(key);
            else next.set(key, value);
          }
          if (resetPage) next.delete('page');
          return next;
        },
        { replace },
      );
    },
    [setSearchParams],
  );

  const handleSearchChange = useCallback(
    (search: string) => updateParams({ search }, { resetPage: true, replace: true }),
    [updateParams],
  );

  const handleAdd = useCallback(() => {
    addToast('Cart is coming soon', 'info');
  }, [addToast]);

  return (
    <div className="flex flex-col gap-6 py-6">
      <header>
        <h1 className="font-heading text-h1 font-bold text-neutral-800">Services</h1>
        <p className="text-body text-neutral-600">Salon-quality care, at your doorstep.</p>
      </header>

      <section aria-labelledby="categories-heading" className="flex flex-col gap-3">
        <h2 id="categories-heading" className="font-heading text-h3 font-semibold text-neutral-800">
          Browse by category
        </h2>
        <DataState
          data={categoriesQuery.data}
          isLoading={categoriesQuery.isLoading}
          error={categoriesQuery.error}
          onRetry={() => void categoriesQuery.refetch()}
          emptyMessage="No categories available yet"
          skeleton={
            <div className={categoryGrid}>
              {Array.from({ length: 6 }).map((_, index) => (
                <Skeleton key={index} variant="card" className="h-36" />
              ))}
            </div>
          }
        >
          {(categories) => (
            <div className={categoryGrid}>
              {categories.map((category) => (
                <CategoryCard key={category.id} category={category} />
              ))}
            </div>
          )}
        </DataState>
      </section>

      <section aria-labelledby="services-heading" className="flex flex-col gap-4">
        <h2 id="services-heading" className="font-heading text-h3 font-semibold text-neutral-800">
          All services
        </h2>
        <CategoryFilterBar
          categories={categoriesQuery.data ?? []}
          selectedId={filters.categoryId}
          onSelect={(categoryId) => updateParams({ categoryId })}
        />
        <CatalogControls
          search={filters.search ?? ''}
          onSearchChange={handleSearchChange}
          sortBy={filters.sortBy}
          onSortChange={(sortBy) => updateParams({ sortBy })}
        />
        <DataState
          data={servicesQuery.data}
          isLoading={servicesQuery.isLoading}
          error={servicesQuery.error}
          onRetry={() => void servicesQuery.refetch()}
          isEmpty={(page) => page.services.length === 0}
          emptyMessage="No services match your filters"
          emptyIcon={<SearchX size={48} className="text-neutral-400" />}
          emptyCta={{ label: 'Clear filters', onClick: () => setSearchParams({}) }}
          skeleton={
            <div className={serviceGrid}>
              {Array.from({ length: 8 }).map((_, index) => (
                <SkeletonCard key={index} />
              ))}
            </div>
          }
        >
          {({ services, pagination }) => (
            <div
              className={
                servicesQuery.isFetching
                  ? 'opacity-60 transition-opacity duration-fast'
                  : 'transition-opacity duration-fast'
              }
            >
              <div className={serviceGrid}>
                {services.map((service) => (
                  <ServiceCard key={service.id} service={service} onAdd={handleAdd} />
                ))}
              </div>
              <CatalogPagination
                pagination={pagination}
                onPageChange={(page) => updateParams({ page: String(page) }, { resetPage: false })}
              />
            </div>
          )}
        </DataState>
      </section>
    </div>
  );
}
