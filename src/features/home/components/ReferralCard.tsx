import { useNavigate } from 'react-router-dom';
import { Gift } from 'lucide-react';
import { Button, DataState, Skeleton } from '../../../components/ui';
import { formatPrice } from '../../../utils/format';
import { useFetchReferral } from '../hooks/useFetchReferral';

const HEADING_ID = 'home-referral';

/** "Share the Beauty, Get Rewarded" — referral CTA driven by the Referral record. */
function ReferralCard() {
  const navigate = useNavigate();
  const referralQuery = useFetchReferral();

  return (
    <section aria-labelledby={HEADING_ID}>
      <DataState
        data={referralQuery.data}
        isLoading={referralQuery.isLoading}
        error={referralQuery.error}
        onRetry={() => void referralQuery.refetch()}
        skeleton={<Skeleton variant="rectangle" height="9rem" className="w-full rounded-lg" />}
      >
        {(referral) => (
          <div className="relative overflow-hidden rounded-lg bg-primary-100 p-4">
            <Gift
              size={120}
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-4 -right-4 text-primary-300/60"
            />
            <div className="relative max-w-[72%]">
              <h2
                id={HEADING_ID}
                className="font-heading text-h4 font-semibold text-neutral-900"
              >
                Share the Beauty, Get Rewarded
              </h2>
              <p className="mt-1 text-body-sm text-neutral-600">
                They get {formatPrice(referral.refereeDiscount)} off on their first service and you
                earn {formatPrice(referral.referrerReward)} when they complete their booking.
              </p>
              <Button size="sm" className="mt-3" onClick={() => void navigate('/services')}>
                Book now
              </Button>
            </div>
          </div>
        )}
      </DataState>
    </section>
  );
}

export { ReferralCard };
