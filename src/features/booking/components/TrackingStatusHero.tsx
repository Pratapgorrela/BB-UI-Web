import { formatDistanceToNow } from 'date-fns';
import type { TrackingStatus, VanTracking } from '../types/booking';

const STATUS_COPY: Record<TrackingStatus, { title: string; subtitle: (eta: number | null) => string }> = {
  NOT_DISPATCHED: {
    title: 'Getting your Beauty Bus ready',
    subtitle: () => "We'll dispatch your van closer to your slot.",
  },
  EN_ROUTE: {
    title: 'Your Beauty Bus is on the way!',
    subtitle: (eta) => (eta === null ? 'On the way to you.' : `Arriving in about ${eta} minutes.`),
  },
  ARRIVING: {
    title: 'Almost there!',
    subtitle: (eta) => (eta === null ? 'Arriving shortly.' : `Arriving in about ${eta} minutes.`),
  },
  ARRIVED: {
    title: 'Your Beauty Bus has arrived!',
    subtitle: () => 'Your team is at your address.',
  },
};

interface TrackingStatusHeroProps {
  tracking: VanTracking;
}

/** Purple hero banner: status headline + ETA line + snapshot freshness. */
function TrackingStatusHero({ tracking }: TrackingStatusHeroProps) {
  const copy = STATUS_COPY[tracking.status];
  return (
    <section
      aria-live="polite"
      className="rounded-lg bg-linear-to-br from-primary-500 to-primary-700 p-5 text-neutral-0"
    >
      {/* h2 — the page's h1 is the PageHeader title ("Track van"). */}
      <h2 className="font-heading text-h3 font-semibold">{copy.title}</h2>
      <p className="mt-1 text-body-sm text-primary-100">{copy.subtitle(tracking.etaMinutes)}</p>
      <p className="mt-3 text-caption text-primary-200">
        Updated {formatDistanceToNow(new Date(tracking.updatedAt), { addSuffix: true })}
      </p>
    </section>
  );
}

export { TrackingStatusHero };
