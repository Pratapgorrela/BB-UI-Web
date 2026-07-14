import { useState } from 'react';
import { format } from 'date-fns';
import { Button, DataState, Modal } from '../../../components/ui';
import { DateStrip } from './DateStrip';
import { TimeSlotGrid } from './TimeSlotGrid';
import { useFetchTimeSlots } from '../hooks/useFetchTimeSlots';
import type { TimeSlot } from '../types/booking';

interface SlotPickerSheetProps {
  open: boolean;
  onClose: () => void;
  /** Currently confirmed slot (pre-selected when reopening to change). */
  initialSlot?: TimeSlot | null;
  onSelect: (slot: TimeSlot) => void;
}

function todayIso(): string {
  return format(new Date(), 'yyyy-MM-dd');
}

/** Skeleton mirroring the period-grouped pill grid. */
function SlotSkeleton() {
  return (
    <div className="flex flex-col gap-4" aria-hidden="true">
      {Array.from({ length: 3 }).map((_, group) => (
        <div key={group}>
          <div className="mb-2 h-4 w-20 animate-pulse rounded bg-neutral-200" />
          <div className="grid grid-cols-3 gap-2">
            {Array.from({ length: 3 }).map((_, pill) => (
              <div key={pill} className="h-11 animate-pulse rounded-lg bg-neutral-200" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Date + time-slot picker for checkout scheduling, in the shared bottom-sheet
 * Modal. No Figma screen exists for this — designed in-app from brand language.
 */
function SlotPickerSheet({ open, onClose, initialSlot, onSelect }: SlotPickerSheetProps) {
  const [activeDate, setActiveDate] = useState<string>(initialSlot?.date ?? todayIso());
  const [tentative, setTentative] = useState<TimeSlot | null>(initialSlot ?? null);

  // Re-sync with the confirmed slot each time the sheet opens — render-time
  // adjustment per the React docs, avoids an effect double-render.
  const [wasOpen, setWasOpen] = useState(open);
  if (wasOpen !== open) {
    setWasOpen(open);
    if (open) {
      setActiveDate(initialSlot?.date ?? todayIso());
      setTentative(initialSlot ?? null);
    }
  }

  const slotsQuery = useFetchTimeSlots(open ? activeDate : null);

  const handleConfirm = () => {
    if (!tentative) return;
    onSelect(tentative);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Choose date & time" padded={false}>
      <div className="flex flex-col">
        <div className="pt-4">
          <DateStrip selectedDate={activeDate} onSelect={setActiveDate} />
        </div>

        <div className="min-h-64 px-4 py-4">
          <DataState
            data={slotsQuery.data}
            isLoading={slotsQuery.isLoading}
            error={slotsQuery.error}
            onRetry={() => void slotsQuery.refetch()}
            emptyMessage="No slots available this day — try another date."
            skeleton={<SlotSkeleton />}
          >
            {(slots) => (
              <TimeSlotGrid
                slots={slots}
                selectedId={tentative?.id ?? null}
                onSelect={setTentative}
              />
            )}
          </DataState>
        </div>

        <div className="sticky bottom-0 border-t border-neutral-200 bg-neutral-0 p-4">
          <Button
            variant="primary"
            size="lg"
            className="w-full"
            disabled={!tentative}
            onClick={handleConfirm}
          >
            Confirm slot
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export { SlotPickerSheet };
