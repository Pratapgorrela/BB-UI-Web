import { DataState, Skeleton } from '../../../components/ui';
import { CategoryCard, useFetchCategories } from '../../service-catalog';

const HEADING_ID = 'home-categories';
const categoryGrid = 'grid grid-cols-2 gap-x-4 gap-y-5 md:grid-cols-3 xl:grid-cols-6';

/** The 6-category grid, reusing the catalog CategoryCard (links to /categories/:slug). */
function CategoryGridSection() {
  const categoriesQuery = useFetchCategories();

  return (
    <section aria-labelledby={HEADING_ID}>
      <h2 id={HEADING_ID} className="sr-only">
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
                  <Skeleton variant="card" height="100%" />
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
  );
}

export { CategoryGridSection };
