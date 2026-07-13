import { useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Check, PackageOpen, Star } from 'lucide-react';
import {
  DataState,
  DiscountBadge,
  Skeleton,
  StickyBottomBar,
  useToast,
} from '../components/ui';
import {
  ServiceListItem,
  useFetchService,
  useFetchServices,
} from '../features/service-catalog';
import type { Service } from '../features/service-catalog';
import { formatDuration, formatPrice } from '../utils/format';
import { getApiError } from '../utils/apiError';

const RECOMMENDED_LIMIT = 6;

function ServiceDetailSkeleton() {
  return (
    <div aria-hidden="true">
      <Skeleton variant="rectangle" className="h-72 w-full rounded-none" />
      <div className="relative -mt-6 rounded-t-xl bg-neutral-0 px-5 pt-6">
        <Skeleton variant="line" width="60%" height="1.75rem" />
        <Skeleton variant="line" width="40%" className="mt-3" />
        <Skeleton variant="line" width="90%" className="mt-4" />
        <Skeleton variant="line" width="80%" className="mt-2" />
        <div className="mt-6 flex flex-col gap-3">
          <Skeleton variant="line" width="50%" />
          <Skeleton variant="line" width="45%" />
        </div>
      </div>
    </div>
  );
}

interface DetailBodyProps {
  service: Service;
  included: Service[];
  recommended: Service[];
  onOpen: (service: Service) => void;
  onAdd: (service: Service) => void;
}

function DetailBody({ service, included, recommended, onOpen, onAdd }: DetailBodyProps) {
  return (
    <div className="relative -mt-6 rounded-t-xl bg-neutral-0 px-5 pt-6 pb-[calc(env(safe-area-inset-bottom)+6.5rem)]">
      <header>
        <div className="flex items-start justify-between gap-3">
          <h1 className="font-heading text-h3 font-bold text-neutral-900">{service.name}</h1>
          {service.discountPercent != null && (
            <DiscountBadge percentage={service.discountPercent} className="mt-1 shrink-0" />
          )}
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="font-mono text-h4 font-bold text-neutral-900">
            {formatPrice(service.price)}
          </span>
          {service.originalPrice && (
            <span className="font-mono text-body text-neutral-400 line-through">
              {formatPrice(service.originalPrice)}
            </span>
          )}
          <span aria-hidden="true" className="text-neutral-300">
            ·
          </span>
          <span className="text-body-sm text-neutral-500">{formatDuration(service.duration)}</span>
          {service.reviewCount > 0 && (
            <>
              <span aria-hidden="true" className="text-neutral-300">
                ·
              </span>
              <span className="flex items-center gap-1 text-body-sm text-neutral-600">
                <Star size={14} className="fill-warning-400 text-warning-400" aria-hidden="true" />
                {service.rating.toFixed(1)}
                <span className="text-neutral-400">({service.reviewCount})</span>
              </span>
            </>
          )}
        </div>
      </header>

      <p className="mt-4 text-body-sm text-neutral-600">{service.description}</p>

      {included.length > 0 && (
        <section className="mt-6">
          <h2 className="font-heading text-h4 font-semibold text-neutral-800">What's included</h2>
          <ul className="mt-3 flex flex-col gap-2">
            {included.map((item) => (
              <li key={item.id} className="flex items-center gap-2 text-body-sm text-neutral-700">
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-success-100">
                  <Check size={14} className="text-success-600" aria-hidden="true" />
                </span>
                {item.name}
              </li>
            ))}
          </ul>
        </section>
      )}

      {recommended.length > 0 && (
        <section className="mt-6">
          <h2 className="font-heading text-h4 font-semibold text-neutral-800">Recommended</h2>
          <div className="mt-1 divide-y divide-neutral-100">
            {recommended.map((item) => (
              <ServiceListItem key={item.id} service={item} onOpen={onOpen} onAdd={onAdd} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export function Component() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const serviceQuery = useFetchService(id ?? '');
  const service = serviceQuery.data;

  // A 404 is a "not found" outcome, not a failure — route it to the empty state
  // (with a Browse CTA) rather than the generic error/retry UI.
  const notFound = getApiError(serviceQuery.error)?.code === 'RESOURCE_NOT_FOUND';

  // Same-category services power both the combo "what's included" list and the
  // recommended add-ons — one query, derived two ways (no invented contract field).
  const categoryServicesQuery = useFetchServices(
    { categoryId: service?.categoryId, limit: 50 },
    { enabled: !!service },
  );

  const all = categoryServicesQuery.data?.services ?? [];
  const byId = new Map(all.map((candidate) => [candidate.id, candidate]));
  const included =
    service?.type === 'COMBO'
      ? service.includedServiceIds
          .map((includedId) => byId.get(includedId))
          .filter((item): item is Service => item != null)
      : [];
  const includedIds = new Set(service?.includedServiceIds ?? []);
  const recommended = all
    .filter(
      (candidate) =>
        candidate.id !== service?.id &&
        candidate.type === 'SINGLE' &&
        !includedIds.has(candidate.id),
    )
    .slice(0, RECOMMENDED_LIMIT);

  const handleOpen = useCallback(
    (target: Service) => {
      void navigate(`/services/${target.id}`);
    },
    [navigate],
  );

  const handleAdd = useCallback(() => {
    addToast('Cart is coming soon', 'info');
  }, [addToast]);

  return (
    <div className="min-h-dvh bg-neutral-0">
      <DataState
        data={service}
        isLoading={serviceQuery.isLoading}
        error={notFound ? null : serviceQuery.error}
        onRetry={() => void serviceQuery.refetch()}
        emptyMessage="We couldn't find that service"
        emptyIcon={<PackageOpen size={48} className="text-neutral-400" />}
        emptyCta={{ label: 'Browse services', onClick: () => void navigate('/services') }}
        skeleton={<ServiceDetailSkeleton />}
      >
        {(resolved) => (
          <>
            <div className="relative">
              <img
                src={resolved.imageUrl}
                alt=""
                aria-hidden="true"
                className="h-72 w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/50 via-neutral-900/5 to-transparent" />
              <button
                type="button"
                aria-label="Go back"
                onClick={() => void navigate(-1)}
                className="absolute left-4 top-[calc(env(safe-area-inset-top)+1rem)] flex size-10 items-center justify-center rounded-full bg-neutral-0/90 text-neutral-800 shadow-md transition-colors duration-fast ease-fast hover:bg-neutral-0 focus-visible:shadow-focus focus-visible:outline-none"
              >
                <ArrowLeft size={22} aria-hidden="true" />
              </button>
            </div>

            <DetailBody
              service={resolved}
              included={included}
              recommended={recommended}
              onOpen={handleOpen}
              onAdd={handleAdd}
            />

            <StickyBottomBar
              totalPrice={resolved.price.amount / 100}
              serviceCount={1}
              duration={formatDuration(resolved.duration)}
              ctaLabel="Add to cart"
              currency={resolved.price.currency}
              onCtaClick={handleAdd}
            />
          </>
        )}
      </DataState>
    </div>
  );
}
