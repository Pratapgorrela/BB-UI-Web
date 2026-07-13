import { useNavigate } from 'react-router-dom';
import { DataState, Skeleton, useToast } from '../../../components/ui';
import { ServiceCard, useFetchServices } from '../../service-catalog';
import type { Service, ServicesPage } from '../../service-catalog';
import { SectionHeading } from './SectionHeading';

const HEADING_ID = 'home-popular-combos';

/** Horizontal row of popular combo services, reusing the catalog ServiceCard. */
function PopularCombosSection() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const combosQuery = useFetchServices({ type: 'COMBO', isPopular: true, limit: 10 });

  return (
    <section aria-labelledby={HEADING_ID}>
      <SectionHeading
        id={HEADING_ID}
        title="Popular Combos"
        subtitle="Pick your preferred service from the list."
      />

      <DataState<ServicesPage>
        data={combosQuery.data}
        isLoading={combosQuery.isLoading}
        error={combosQuery.error}
        onRetry={() => void combosQuery.refetch()}
        isEmpty={(page) => page.services.length === 0}
        emptyMessage="No combos available right now"
        skeleton={
          <div className="flex gap-4 overflow-x-auto pb-1">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="w-64 shrink-0">
                <Skeleton variant="rectangle" height="12rem" className="w-full" />
              </div>
            ))}
          </div>
        }
      >
        {(page) => (
          <ul className="flex list-none gap-4 overflow-x-auto pb-1">
            {page.services.map((service: Service) => (
              <li key={service.id} className="w-64 shrink-0">
                <ServiceCard
                  service={service}
                  onOpen={(item) => void navigate(`/services/${item.id}`)}
                  onAdd={() => addToast('Cart is coming soon', 'info')}
                />
              </li>
            ))}
          </ul>
        )}
      </DataState>
    </section>
  );
}

export { PopularCombosSection };
