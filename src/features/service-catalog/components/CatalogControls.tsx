import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { Select, TextInput } from '../../../components/ui';
import type { ServiceSortBy } from '../types/catalog';

const SEARCH_DEBOUNCE_MS = 350;

const sortOptions: { value: string; label: string }[] = [
  { value: '', label: 'Recommended' },
  { value: 'price_asc', label: 'Price: low to high' },
  { value: 'price_desc', label: 'Price: high to low' },
  { value: 'rating', label: 'Top rated' },
  { value: 'name', label: 'Name (A–Z)' },
];

interface CatalogControlsProps {
  search: string;
  onSearchChange: (search: string) => void;
  sortBy?: ServiceSortBy;
  onSortChange: (sortBy?: ServiceSortBy) => void;
}

function CatalogControls({ search, onSearchChange, sortBy, onSortChange }: CatalogControlsProps) {
  const [draft, setDraft] = useState(search);
  const [syncedSearch, setSyncedSearch] = useState(search);

  // Sync back when the URL changes externally (back/forward, Clear filters) —
  // render-time adjustment per the React docs, avoids an effect double-render.
  if (syncedSearch !== search) {
    setSyncedSearch(search);
    setDraft(search);
  }

  // Debounce keystrokes before pushing the term into the URL (and the query).
  useEffect(() => {
    if (draft === search) return;
    const timer = setTimeout(() => onSearchChange(draft), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [draft, search, onSearchChange]);

  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center">
      <div className="flex-1">
        <TextInput
          type="search"
          aria-label="Search services"
          placeholder="Search services"
          leftIcon={<Search size={20} />}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
        />
      </div>
      <div className="md:w-56">
        <Select
          aria-label="Sort services"
          options={sortOptions}
          value={sortBy ?? ''}
          onChange={(event) => onSortChange((event.target.value || undefined) as ServiceSortBy | undefined)}
        />
      </div>
    </div>
  );
}

export { CatalogControls };
export type { CatalogControlsProps };
