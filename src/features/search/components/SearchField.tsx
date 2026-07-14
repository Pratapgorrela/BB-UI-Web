import { useRef } from 'react';
import { ArrowLeft, Search, X } from 'lucide-react';

interface SearchFieldProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onBack: () => void;
  onClear: () => void;
}

/** Focused search entry: back arrow + purple-border input + inline clear (per Figma 184:7965). */
function SearchField({ value, onChange, onSubmit, onBack, onClear }: SearchFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        aria-label="Go back"
        onClick={onBack}
        className="flex size-touch-target shrink-0 items-center justify-center rounded-full text-neutral-700 transition-colors duration-fast ease-fast hover:bg-neutral-200 focus-visible:shadow-focus focus-visible:outline-none"
      >
        <ArrowLeft size={24} aria-hidden="true" />
      </button>

      <form
        role="search"
        className="relative flex-1"
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit();
          inputRef.current?.blur();
        }}
      >
        <span
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
          aria-hidden="true"
        >
          <Search size={20} />
        </span>
        <input
          ref={inputRef}
          type="text"
          // The search page exists to type into — autofocus is the intent here.
          autoFocus
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Search for services"
          aria-label="Search for services"
          enterKeyHint="search"
          autoComplete="off"
          className="h-11 w-full rounded-lg border border-primary-500 bg-neutral-0 pl-10 pr-10 text-body text-neutral-700 shadow-focus transition-colors duration-fast ease-fast placeholder:text-neutral-400 focus:border-primary-500 focus:shadow-focus focus:outline-none"
        />
        {value && (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => {
              onClear();
              inputRef.current?.focus();
            }}
            className="absolute right-2 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full text-neutral-400 transition-colors duration-fast ease-fast hover:bg-neutral-100 hover:text-neutral-600 focus-visible:shadow-focus focus-visible:outline-none"
          >
            <X size={18} aria-hidden="true" />
          </button>
        )}
      </form>
    </div>
  );
}

export { SearchField };
export type { SearchFieldProps };
