import { CalendarCheck, CalendarPlus } from 'lucide-react';
import { Button } from '../../../components/ui';
import { formatSlotLabel } from '../utils/slotFormat';
import type { TimeSlot } from '../types/booking';

interface SelectedSlotCardProps {
  slot: TimeSlot | null;
  /** Pre-formatted total service duration, e.g. "1 hr 30 min". */
  durationLabel?: string;
  /** Opens the slot picker (both the empty CTA and "Change"). */
  onOpen: () => void;
}

/** Checkout scheduling row — dashed "Add slot" affordance until a slot is chosen. */
function SelectedSlotCard({ slot, durationLabel, onOpen }: SelectedSlotCardProps) {
  if (!slot) {
    return (
      <button
        type="button"
        onClick={onOpen}
        className="flex min-h-11 items-center justify-center gap-2 rounded-lg border border-dashed border-neutral-300 py-3 text-body-sm font-semibold text-neutral-600 transition-colors duration-fast ease-fast hover:bg-neutral-100 focus-visible:shadow-focus focus-visible:outline-none"
      >
        <CalendarPlus size={18} aria-hidden="true" />
        Add slot
        <span className="font-normal text-neutral-400">(required)</span>
      </button>
    );
  }

  return (
    <section
      aria-label="Selected slot"
      className="flex items-center gap-3 rounded-lg bg-neutral-0 p-4"
    >
      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-700">
        <CalendarCheck size={20} aria-hidden="true" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-body-sm font-semibold text-neutral-900">
          {formatSlotLabel(slot)}
        </p>
        {durationLabel && (
          <p className="text-caption text-neutral-500">Est. duration {durationLabel}</p>
        )}
      </div>
      <Button variant="ghost" size="sm" onClick={onOpen}>
        Change
      </Button>
    </section>
  );
}

export { SelectedSlotCard };
