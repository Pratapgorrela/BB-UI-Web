import { Clock, Truck } from 'lucide-react';
import type { VanTracking } from '../types/booking';

interface TrackingMapPlaceholderProps {
  tracking: VanTracking;
}

/**
 * Static map stand-in (no map SDK in MVP — Rule 10). Shows the van pin once
 * dispatched; before dispatch it doubles as the "not yet" visual.
 */
function TrackingMapPlaceholder({ tracking }: TrackingMapPlaceholderProps) {
  const dispatched = tracking.status !== 'NOT_DISPATCHED';
  return (
    <div
      role="img"
      aria-label={dispatched ? 'Map showing your van on its way' : 'Map — van not dispatched yet'}
      className="relative h-48 overflow-hidden rounded-xl bg-primary-100 md:h-64"
    >
      {/* Decorative "streets" */}
      <div aria-hidden="true" className="absolute inset-0">
        <div className="absolute left-0 top-1/3 h-2 w-full -rotate-3 bg-neutral-0/70" />
        <div className="absolute left-0 top-2/3 h-1.5 w-full rotate-2 bg-neutral-0/50" />
        <div className="absolute left-1/4 top-0 h-full w-1.5 rotate-6 bg-neutral-0/50" />
        <div className="absolute left-2/3 top-0 h-full w-2 -rotate-3 bg-neutral-0/70" />
      </div>

      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
        {dispatched ? (
          <span className="relative flex h-12 w-12 items-center justify-center rounded-full bg-primary-500 shadow-lg">
            <span
              aria-hidden="true"
              className="absolute inset-0 animate-ping rounded-full bg-primary-400 opacity-40 motion-reduce:hidden"
            />
            <Truck size={24} aria-hidden="true" className="relative text-neutral-0" />
          </span>
        ) : (
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-200">
            <Clock size={24} aria-hidden="true" className="text-neutral-500" />
          </span>
        )}
        <p className="rounded-full bg-neutral-0/90 px-3 py-1 text-caption text-neutral-600 shadow-sm">
          {dispatched ? 'Live map coming soon' : 'Van not dispatched yet'}
        </p>
      </div>
    </div>
  );
}

export { TrackingMapPlaceholder };
