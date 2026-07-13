import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';

/**
 * Read-only search entry point. Tapping navigates to the catalog for now (the
 * module-map's "CTA to catalog" deliverable); F14 Search will repoint this to `/search`.
 */
function HomeSearchBar() {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => void navigate('/services')}
      className="flex w-full items-center gap-2 rounded-lg border border-neutral-200 bg-neutral-0 px-4 py-3 text-left text-neutral-400 transition-colors duration-fast ease-fast hover:border-neutral-300 focus-visible:shadow-focus focus-visible:outline-none"
    >
      <Search size={20} className="shrink-0" aria-hidden="true" />
      <span className="text-body">Search here</span>
    </button>
  );
}

export { HomeSearchBar };
