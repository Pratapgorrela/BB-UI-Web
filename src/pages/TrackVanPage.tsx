import { useNavigate, useParams } from 'react-router-dom';
import { Info, MapPin, Phone, Star, Truck } from 'lucide-react';
import { PageHeader } from '../components/layout';
import { Avatar, Card, DataState, Skeleton, SkeletonCard } from '../components/ui';
import {
  TrackingMapPlaceholder,
  TrackingStatusHero,
  useFetchVanTracking,
} from '../features/booking';
import type { VanTracking } from '../features/booking';
import { getApiError } from '../utils/apiError';

function DestinationBar({ tracking }: { tracking: VanTracking }) {
  return (
    <Card padding="md" className="flex items-start gap-3">
      <MapPin size={20} aria-hidden="true" className="mt-0.5 shrink-0 text-primary-500" />
      <div className="flex min-w-0 flex-col gap-0.5">
        <p className="font-heading text-body font-semibold text-neutral-900">
          {tracking.destination.label}
        </p>
        <p className="text-body-sm text-neutral-600">{tracking.destination.line}</p>
      </div>
    </Card>
  );
}

function VanCard({ tracking }: { tracking: VanTracking }) {
  const { van } = tracking;
  return (
    <Card padding="md" className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-100">
          <Truck size={20} aria-hidden="true" className="text-primary-600" />
        </span>
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <p className="text-caption text-neutral-500">Your van</p>
          <p className="font-heading text-body font-semibold text-neutral-900">{van.vanCode}</p>
          <p className="font-mono text-body-sm text-neutral-600">{van.vehicleNumber}</p>
        </div>
      </div>
      <div className="flex items-center justify-between gap-3 border-t border-neutral-200 pt-3">
        <div className="flex min-w-0 flex-col gap-0.5">
          <p className="text-caption text-neutral-500">Driver</p>
          <p className="truncate text-body font-medium text-neutral-800">{van.driverName}</p>
        </div>
        <a
          href={`tel:${van.driverPhone}`}
          aria-label={`Call ${van.driverName}`}
          className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-md bg-primary-100 px-4 text-body-sm font-semibold text-primary-700 transition-colors duration-fast hover:bg-primary-200 focus-visible:shadow-focus focus-visible:outline-none"
        >
          <Phone size={16} aria-hidden="true" />
          Call
        </a>
      </div>
    </Card>
  );
}

function StylistCard({ tracking }: { tracking: VanTracking }) {
  const { specialist } = tracking;
  const fullName = `${specialist.firstName} ${specialist.lastName}`;
  return (
    <Card padding="md" className="flex items-center gap-3">
      <Avatar src={specialist.avatarUrl} name={fullName} alt={fullName} size="lg" />
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <p className="text-caption text-neutral-500">Your stylist</p>
        <p className="truncate font-heading text-body font-semibold text-neutral-900">{fullName}</p>
        <p className="flex items-center gap-1 text-body-sm text-neutral-600">
          <Star size={14} aria-hidden="true" className="fill-warning-500 text-warning-500" />
          {specialist.rating.toFixed(1)}
          <span className="text-neutral-400">({specialist.reviewCount} reviews)</span>
        </p>
      </div>
    </Card>
  );
}

function ReminderCard() {
  return (
    <Card padding="md" className="flex items-start gap-3 border border-info-300 bg-info-100">
      <Info size={20} aria-hidden="true" className="mt-0.5 shrink-0 text-info-700" />
      <p className="text-body-sm text-info-700">
        Please be available at your address around your slot time. Our team will call you when
        they arrive.
      </p>
    </Card>
  );
}

function TrackVanSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <Skeleton className="h-28 w-full rounded-lg" />
      <Skeleton className="h-48 w-full rounded-xl md:h-64" />
      {Array.from({ length: 2 }).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </div>
  );
}

export function Component() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const query = useFetchVanTracking(id);

  // 404 and 422 are outcomes, not failures — route them to the empty state so
  // only real errors show the retry UI (mirrors ServiceDetailPage's 404 handling).
  const apiCode = getApiError(query.error)?.code;
  const notFound = apiCode === 'RESOURCE_NOT_FOUND';
  const inactive = apiCode === 'BUSINESS_RULE_VIOLATION';

  return (
    <div className="mx-auto max-w-xl py-2">
      {/* Prefer history back so the detail page's state survives; fall back for deep links. */}
      <PageHeader
        title="Track van"
        onBack={() =>
          ((window.history.state as { idx?: number } | null)?.idx ?? 0) > 0
            ? navigate(-1)
            : navigate(id ? `/bookings/${id}` : '/bookings')
        }
      />

      <DataState<VanTracking>
        data={query.data}
        isLoading={query.isLoading}
        error={notFound || inactive ? null : query.error}
        onRetry={() => void query.refetch()}
        emptyMessage={
          inactive
            ? 'Tracking is only available for active bookings.'
            : "We couldn't find that booking."
        }
        emptyIcon={<Truck size={48} className="text-neutral-400" />}
        emptyCta={
          inactive && id
            ? { label: 'View booking', onClick: () => void navigate(`/bookings/${id}`) }
            : { label: 'My bookings', onClick: () => void navigate('/bookings') }
        }
        skeleton={<TrackVanSkeleton />}
      >
        {(tracking) => (
          <div className="flex flex-col gap-4 pb-6">
            <TrackingStatusHero tracking={tracking} />
            <TrackingMapPlaceholder tracking={tracking} />
            <DestinationBar tracking={tracking} />
            <VanCard tracking={tracking} />
            <StylistCard tracking={tracking} />
            <ReminderCard />
          </div>
        )}
      </DataState>
    </div>
  );
}
