import { useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PackageOpen } from 'lucide-react';
import { PageHeader } from '../components/layout';
import { DataState, Skeleton, SkeletonCard, SkeletonText, useToast } from '../components/ui';
import { ServiceCard, useFetchCategories, useFetchServices } from '../features/service-catalog';
import type { Service } from '../features/service-catalog';

const sectionGrid = 'grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3';

interface ServiceSectionProps {
  title: string;
  query: ReturnType<typeof useFetchServices>;
  emptyMessage: string;
  onAdd: (service: Service) => void;
}

function ServiceSection({ title, query, emptyMessage, onAdd }: ServiceSectionProps) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="font-heading text-h3 font-semibold text-neutral-800">{title}</h2>
      <DataState
        data={query.data}
        isLoading={query.isLoading}
        error={query.error}
        onRetry={() => void query.refetch()}
        isEmpty={(page) => page.services.length === 0}
        emptyMessage={emptyMessage}
        emptyIcon={<PackageOpen size={48} className="text-neutral-400" />}
        skeleton={
          <div className={sectionGrid}>
            {Array.from({ length: 3 }).map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        }
      >
        {({ services }) => (
          <div className={sectionGrid}>
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} onAdd={onAdd} />
            ))}
          </div>
        )}
      </DataState>
    </section>
  );
}

function CategoryDetailSkeleton() {
  return (
    <div className="flex flex-col gap-6" aria-hidden="true">
      <Skeleton variant="rectangle" className="h-40 rounded-2xl md:h-56" />
      <SkeletonText lines={2} />
      <div className={sectionGrid}>
        {Array.from({ length: 3 }).map((_, index) => (
          <SkeletonCard key={index} />
        ))}
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

  const handleAdd = useCallback(() => {
    addToast('Cart is coming soon', 'info');
  }, [addToast]);

  return (
    <div className="flex flex-col gap-6 py-2 pb-8">
      <PageHeader title={category?.name ?? 'Category'} backTo="/services" />
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
          <div className="flex flex-col gap-6">
            <div className="overflow-hidden rounded-2xl bg-neutral-200">
              <img
                src={resolved.heroImageUrl}
                alt={resolved.name}
                className="h-40 w-full object-cover md:h-56"
              />
            </div>
            <p className="text-body text-neutral-600">{resolved.description}</p>
            <ServiceSection
              title="Combos"
              query={combosQuery}
              emptyMessage="No combos in this category yet"
              onAdd={handleAdd}
            />
            <ServiceSection
              title="Single services"
              query={singlesQuery}
              emptyMessage="No individual services in this category yet"
              onAdd={handleAdd}
            />
          </div>
        )}
      </DataState>
    </div>
  );
}
