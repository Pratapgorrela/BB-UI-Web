import { addDays, format } from 'date-fns';

interface DateStripProps {
  /** Selected date, `YYYY-MM-DD`. */
  selectedDate: string;
  onSelect: (date: string) => void;
  /** Booking horizon — matches the contract's 14-day window. */
  days?: number;
}

/** Horizontally scrollable strip of day chips starting today. */
function DateStrip({ selectedDate, onSelect, days = 14 }: DateStripProps) {
  const today = new Date();
  const dates = Array.from({ length: days }, (_, index) => addDays(today, index));

  return (
    <div
      className="flex snap-x snap-mandatory gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none]"
      role="group"
      aria-label="Choose a date"
    >
      {dates.map((date, index) => {
        const iso = format(date, 'yyyy-MM-dd');
        const isSelected = iso === selectedDate;
        return (
          <button
            key={iso}
            type="button"
            aria-pressed={isSelected}
            onClick={() => onSelect(iso)}
            className={[
              'flex min-h-11 min-w-14 shrink-0 snap-start flex-col items-center justify-center rounded-lg px-2 py-1.5',
              'transition-colors duration-fast ease-fast focus-visible:shadow-focus focus-visible:outline-none',
              isSelected
                ? 'bg-primary-500 text-neutral-0'
                : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200',
            ].join(' ')}
          >
            <span className={`text-caption ${isSelected ? 'text-neutral-0/80' : 'text-neutral-500'}`}>
              {index === 0 ? 'Today' : format(date, 'EEE')}
            </span>
            <span className="text-body-sm font-semibold">{format(date, 'd')}</span>
          </button>
        );
      })}
    </div>
  );
}

export { DateStrip };
