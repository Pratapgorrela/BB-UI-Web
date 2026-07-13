import { Check } from 'lucide-react';
import { formatSlotTime, groupSlotsByPeriod } from '../utils/slotFormat';
import type { TimeSlot } from '../types/booking';

interface TimeSlotGridProps {
  slots: TimeSlot[];
  selectedId: string | null;
  onSelect: (slot: TimeSlot) => void;
}

/** Time-slot pills grouped by period (Morning / Afternoon / Evening). */
function TimeSlotGrid({ slots, selectedId, onSelect }: TimeSlotGridProps) {
  const groups = groupSlotsByPeriod(slots);

  return (
    <div className="flex flex-col gap-4">
      {groups.map((group) => (
        <section key={group.label} aria-label={group.label}>
          <h3 className="mb-2 text-body-sm font-semibold text-neutral-500">{group.label}</h3>
          <div className="grid grid-cols-3 gap-2">
            {group.slots.map((slot) => {
              const isSelected = slot.id === selectedId;
              return (
                <button
                  key={slot.id}
                  type="button"
                  disabled={!slot.isAvailable}
                  aria-pressed={isSelected}
                  onClick={() => onSelect(slot)}
                  className={[
                    'flex min-h-11 items-center justify-center gap-1 rounded-lg border text-body-sm font-medium',
                    'transition-colors duration-fast ease-fast focus-visible:shadow-focus focus-visible:outline-none',
                    isSelected
                      ? 'border-primary-500 bg-primary-500 text-neutral-0'
                      : slot.isAvailable
                        ? 'border-neutral-300 bg-neutral-0 text-neutral-800 hover:border-primary-400'
                        : 'border-neutral-200 bg-neutral-100 text-neutral-400 line-through',
                  ].join(' ')}
                >
                  {isSelected && <Check size={14} aria-hidden="true" />}
                  {formatSlotTime(slot.startTime)}
                </button>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}

export { TimeSlotGrid };
