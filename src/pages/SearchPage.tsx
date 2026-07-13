import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useToast } from '../components/ui';
import {
  RecentSearches,
  SearchField,
  SearchResults,
  useDebouncedValue,
  useRecentSearchesStore,
} from '../features/search';
import { useFetchServices } from '../features/service-catalog';
import type { Service } from '../features/service-catalog';
import { useCartStore } from '../store/useCartStore';

/** Below this length we show recent searches instead of firing a query. */
const MIN_QUERY_LENGTH = 2;
const RESULTS_LIMIT = 24;

export function Component() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { addToast } = useToast();
  const addItem = useCartStore((state) => state.addItem);
  const addSearch = useRecentSearchesStore((state) => state.addSearch);

  const [term, setTerm] = useState(() => searchParams.get('q') ?? '');
  const debounced = useDebouncedValue(term.trim(), 300);
  const isSearching = debounced.length >= MIN_QUERY_LENGTH;

  // Mirror the committed query into the URL (replace — don't flood history while typing).
  useEffect(() => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (debounced) next.set('q', debounced);
        else next.delete('q');
        return next;
      },
      { replace: true },
    );
  }, [debounced, setSearchParams]);

  const servicesQuery = useFetchServices(
    { search: debounced, limit: RESULTS_LIMIT },
    { enabled: isSearching },
  );

  // Record recents only on an explicit commit (Enter / picking a recent) — not per keystroke.
  const commitRecent = (value: string) => {
    if (value.trim().length >= MIN_QUERY_LENGTH) addSearch(value);
  };

  const handlePickRecent = (value: string) => {
    setTerm(value);
    commitRecent(value);
  };

  const handleAdd = (service: Service) => {
    addItem(service);
    addToast(`${service.name} added to cart`, 'success');
  };

  return (
    <div className="flex flex-col gap-6 py-4">
      <SearchField
        value={term}
        onChange={setTerm}
        onSubmit={() => commitRecent(term)}
        onBack={() => void navigate(-1)}
        onClear={() => setTerm('')}
      />

      {isSearching ? (
        <SearchResults
          services={servicesQuery.data?.services}
          isLoading={servicesQuery.isLoading}
          error={servicesQuery.error}
          query={debounced}
          onRetry={() => void servicesQuery.refetch()}
          onOpen={(service) => void navigate(`/services/${service.id}`)}
          onAdd={handleAdd}
          onBrowseAll={() => void navigate('/services')}
        />
      ) : (
        <RecentSearches onPick={handlePickRecent} />
      )}
    </div>
  );
}
