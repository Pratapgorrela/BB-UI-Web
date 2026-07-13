import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/** Recent searches are device-local history — client state, never networked. */

const MAX_RECENT = 8;
const MAX_TERM_LENGTH = 60;

interface RecentSearchesState {
  items: string[];
  addSearch: (term: string) => void;
  removeSearch: (term: string) => void;
  clearSearches: () => void;
}

/** Trim + clamp to the stored length. Empty result means "ignore this term". */
function normalizeTerm(term: string): string {
  return term.trim().slice(0, MAX_TERM_LENGTH);
}

const useRecentSearchesStore = create<RecentSearchesState>()(
  persist(
    (set) => ({
      items: [],
      addSearch: (term) =>
        set((state) => {
          const value = normalizeTerm(term);
          if (!value) return state;
          // Case-insensitive dedupe, newest first, capped.
          const withoutDupe = state.items.filter(
            (item) => item.toLowerCase() !== value.toLowerCase(),
          );
          return { items: [value, ...withoutDupe].slice(0, MAX_RECENT) };
        }),
      removeSearch: (term) =>
        set((state) => ({
          items: state.items.filter((item) => item.toLowerCase() !== term.toLowerCase()),
        })),
      clearSearches: () => set({ items: [] }),
    }),
    {
      name: 'bb-recent-searches',
      partialize: (state) => ({ items: state.items }),
    },
  ),
);

export { MAX_RECENT, MAX_TERM_LENGTH, useRecentSearchesStore };
export type { RecentSearchesState };
