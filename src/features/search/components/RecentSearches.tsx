import { Clock, Search, X } from 'lucide-react';
import { useRecentSearchesStore } from '../store/useRecentSearchesStore';

interface RecentSearchesProps {
  onPick: (term: string) => void;
}

/** Idle state of the search page: device-local recent terms, or a first-time hint. */
function RecentSearches({ onPick }: RecentSearchesProps) {
  const items = useRecentSearchesStore((state) => state.items);
  const removeSearch = useRecentSearchesStore((state) => state.removeSearch);
  const clearSearches = useRecentSearchesStore((state) => state.clearSearches);

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-16 text-center">
        <Search size={40} className="text-neutral-300" aria-hidden="true" />
        <p className="text-body font-medium text-neutral-700">Search for a service</p>
        <p className="text-body-sm text-neutral-500">Try “haircut”, “bridal”, or “spa”.</p>
      </div>
    );
  }

  return (
    <section aria-labelledby="recent-heading" className="flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <h2 id="recent-heading" className="text-body font-semibold text-neutral-800">
          Recent searches
        </h2>
        <button
          type="button"
          onClick={clearSearches}
          className="rounded-sm px-1 text-body-sm font-medium text-primary-600 transition-colors duration-fast ease-fast hover:text-primary-700 focus-visible:shadow-focus focus-visible:outline-none"
        >
          Clear all
        </button>
      </div>

      <ul>
        {items.map((term) => (
          <li key={term} className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onPick(term)}
              className="flex min-w-0 flex-1 items-center gap-3 rounded-sm py-3 text-left transition-colors duration-fast ease-fast focus-visible:shadow-focus focus-visible:outline-none"
            >
              <Clock size={18} className="shrink-0 text-neutral-400" aria-hidden="true" />
              <span className="truncate text-body text-neutral-700">{term}</span>
            </button>
            <button
              type="button"
              aria-label={`Remove ${term}`}
              onClick={() => removeSearch(term)}
              className="flex size-9 shrink-0 items-center justify-center rounded-full text-neutral-400 transition-colors duration-fast ease-fast hover:bg-neutral-100 hover:text-neutral-600 focus-visible:shadow-focus focus-visible:outline-none"
            >
              <X size={16} aria-hidden="true" />
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

export { RecentSearches };
export type { RecentSearchesProps };
