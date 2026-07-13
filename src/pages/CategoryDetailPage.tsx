import { useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, PackageOpen } from 'lucide-react';
import { DataState, Skeleton, useToast } from '../components/ui';
import { ServiceListItem, useFetchCategories, useFetchServices } from '../features/service-catalog';
import type { Service } from '../features/service-catalog';

interface ServiceSectionProps {
  title: string;
  query: ReturnType<typeof useFetchServices>;
  emptyMessage: string;
  onOpen: (service: Service) => void;
  onAdd: (service: Service) => void;
}

function ServiceListSkeleton() {
  return (
    <div className="divide-y divide-neutral-100" aria-hidden="true">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="flex items-center gap-3 py-3">
          <Skeleton variant="rectangle" className="size-16 shrink-0 rounded-xl" />
          <div className="flex flex-1 flex-col gap-2">
            <Skeleton variant="line" width="60%" />
            <Skeleton variant="line" width="40%" />
          </div>
        </div>
      ))}
    </div>
  );
}

function ServiceSection({ title, query, emptyMessage, onOpen, onAdd }: ServiceSectionProps) {
  return (
    <section className="flex flex-col gap-2">
      <h2 className="font-heading text-h4 font-semibold text-neutral-800">{title}</h2>
      <DataState
        data={query.data}
        isLoading={query.isLoading}
        error={query.error}
        onRetry={() => void query.refetch()}
        isEmpty={(page) => page.services.length === 0}
        emptyMessage={emptyMessage}
        emptyIcon={<PackageOpen size={48} className="text-neutral-400" />}
        skeleton={<ServiceListSkeleton />}
      >
        {({ services }) => (
          <div className="divide-y divide-neutral-100">
            {services.map((service) => (
              <ServiceListItem
                key={service.id}
                service={service}
                onOpen={onOpen}
                onAdd={onAdd}
              />
            ))}
          </div>
        )}
      </DataState>
    </section>
  );
}

function CategoryDetailSkeleton() {
  return (
    <div aria-hidden="true">
      <Skeleton variant="rectangle" className="h-60 w-full rounded-none" />
      <div className="relative -mt-6 rounded-t-xl bg-neutral-0 px-5 pt-6">
        <Skeleton variant="line" width="55%" height="1.75rem" />
        <Skeleton variant="line" width="80%" className="mt-2" />
        <div className="mt-6 flex flex-col gap-6">
          <ServiceListSkeleton />
          <ServiceListSkeleton />
        </div>
      </div>
    </div>
  );
}

export function Component() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const categoriesQuery = useFetchCategories();
  const category = categoriesQuery.data?.find((candidate) => candidate.slug === slug);

  const combosQuery = useFetchServices(
    { categoryId: category?.id, type: 'COMBO', limit: 50 },
    { enabled: !!category },
  );
  const singlesQuery = useFetchServices(
    { categoryId: category?.id, type: 'SINGLE', limit: 50 },
    { enabled: !!category },
  );

  const handleOpen = useCallback(
    (service: Service) => {
      void navigate(`/services/${service.id}`);
    },
    [navigate],
  );

  const handleAdd = useCallback(() => {
    addToast('Cart is coming soon', 'info');
  }, [addToast]);

  return (
    <div className="min-h-dvh bg-neutral-0">
      <DataState
        data={category}
        isLoading={categoriesQuery.isLoading}
        error={categoriesQuery.error}
        onRetry={() => void categoriesQuery.refetch()}
        emptyMessage="We couldn't find that category"
        emptyCta={{ label: 'Browse services', onClick: () => void navigate('/services') }}
        skeleton={<CategoryDetailSkeleton />}
      >
        {(resolved) => (
          <>
            <div className="relative">
              <img
                src={resolved.heroImageUrl}
                alt=""
                aria-hidden="true"
                className="h-60 w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/60 via-neutral-900/10 to-transparent" />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute bottom-9 left-5 font-heading text-h1 font-bold text-neutral-0/30"
              >
                {resolved.name}
              </span>
              <button
                type="button"
                aria-label="Go back"
                onClick={() => void navigate('/services')}
                className="absolute left-4 top-[calc(env(safe-area-inset-top)+1rem)] flex size-10 items-center justify-center rounded-full bg-neutral-0/90 text-neutral-800 shadow-md transition-colors duration-fast ease-fast hover:bg-neutral-0 focus-visible:shadow-focus focus-visible:outline-none"
              >
                <ArrowLeft size={22} aria-hidden="true" />
              </button>
            </div>

            <div className="relative -mt-6 rounded-t-xl bg-neutral-0 px-5 pt-6 pb-[calc(env(safe-area-inset-bottom)+2rem)]">
              <header className="mb-5">
                <h1 className="font-heading text-h3 font-bold text-neutral-900">{resolved.name}</h1>
                <p className="mt-1 text-body-sm text-neutral-500">{resolved.description}</p>
              </header>

              <div className="flex flex-col gap-6">
                <ServiceSection
                  title="Combos"
                  query={combosQuery}
                  emptyMessage="No combos in this category yet"
                  onOpen={handleOpen}
                  onAdd={handleAdd}
                />
                <ServiceSection
                  title="Single services"
                  query={singlesQuery}
                  emptyMessage="No individual services in this category yet"
                  onOpen={handleOpen}
                  onAdd={handleAdd}
                />
              </div>
            </div>
          </>
        )}
      </DataState>
    </div>
  );
}
