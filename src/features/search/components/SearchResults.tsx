import { DataState, Skeleton } from '../../../components/ui';
import { ServiceCard } from '../../service-catalog';
import type { Service } from '../../service-catalog';

interface SearchResultsProps {
  services: Service[] | undefined;
  isLoading: boolean;
  error: Error | null;
  query: string;
  onRetry: () => void;
  onOpen: (service: Service) => void;
  onAdd: (service: Service) => void;
  onBrowseAll: () => void;
}

const resultsGrid = 'grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3';

function SearchResults({
  services,
  isLoading,
  error,
  query,
  onRetry,
  onOpen,
  onAdd,
  onBrowseAll,
}: SearchResultsProps) {
  return (
    <section aria-label="Search results" aria-live="polite">
      <DataState
        data={services}
        isLoading={isLoading}
        error={error}
        onRetry={onRetry}
        emptyMessage={`No results for “${query}”`}
        emptyCta={{ label: 'Browse all services', onClick: onBrowseAll }}
        skeleton={
          <div className={resultsGrid}>
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="flex flex-col gap-2">
                <div className="aspect-4/3 w-full">
                  <Skeleton variant="card" height="100%" />
                </div>
                <Skeleton variant="line" width="70%" />
                <Skeleton variant="line" width="40%" />
              </div>
            ))}
          </div>
        }
      >
        {(list) => (
          <>
            <p className="mb-3 text-body-sm text-neutral-500">
              {list.length} {list.length === 1 ? 'result' : 'results'}
            </p>
            <div className={resultsGrid}>
              {list.map((service) => (
                <ServiceCard key={service.id} service={service} onOpen={onOpen} onAdd={onAdd} />
              ))}
            </div>
          </>
        )}
      </DataState>
    </section>
  );
}

export { SearchResults };
export type { SearchResultsProps };
