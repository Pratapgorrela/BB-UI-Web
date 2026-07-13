import { DataState, Skeleton } from '../../../components/ui';
import { useFetchOffers } from '../hooks/useFetchOffers';
import { OfferCard } from './OfferCard';
import { SectionHeading } from './SectionHeading';

const HEADING_ID = 'home-offers';

/** "Offers for You" — horizontal carousel of promotional banner cards. */
function OffersSection() {
  const offersQuery = useFetchOffers();

  return (
    <section aria-labelledby={HEADING_ID}>
      <SectionHeading
        id={HEADING_ID}
        title="Offers for You"
        subtitle="Limited-time deals on premium services."
      />

      <DataState
        data={offersQuery.data}
        isLoading={offersQuery.isLoading}
        error={offersQuery.error}
        onRetry={() => void offersQuery.refetch()}
        emptyMessage="No offers right now — check back soon"
        skeleton={
          <div className="flex gap-4 overflow-x-auto pb-1">
            {Array.from({ length: 2 }).map((_, index) => (
              <Skeleton key={index} variant="rectangle" height="11rem" className="w-72 shrink-0" />
            ))}
          </div>
        }
      >
        {(offers) => (
          <ul className="flex list-none gap-4 overflow-x-auto pb-1">
            {offers.map((offer) => (
              <li key={offer.id}>
                <OfferCard offer={offer} />
              </li>
            ))}
          </ul>
        )}
      </DataState>
    </section>
  );
}

export { OffersSection };
