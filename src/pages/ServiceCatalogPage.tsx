import { DataState, Skeleton } from '../components/ui';
import { CategoryCard, useFetchCategories } from '../features/service-catalog';

const categoryGrid = 'grid grid-cols-2 gap-x-4 gap-y-5 md:grid-cols-3 xl:grid-cols-6';

export function Component() {
  const categoriesQuery = useFetchCategories();

  return (
    <div className="flex flex-col gap-6 py-6">
      <header>
        <h1 className="font-heading text-h1 font-bold text-neutral-800">Our Services</h1>
        <p className="text-body text-neutral-600">
          Choose from a wide range of beauty & wellness treatments.
        </p>
      </header>

      <section aria-labelledby="categories-heading">
        <h2 id="categories-heading" className="sr-only">
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
                <div key={index}>
                  <div className="aspect-182/157 w-full">
                    <Skeleton variant="card" height="100%" className="rounded-2xl" />
                  </div>
                  <Skeleton variant="line" width="4rem" className="mx-auto mt-2" />
                </div>
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
    </div>
  );
}
