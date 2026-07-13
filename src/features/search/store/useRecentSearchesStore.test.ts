import { beforeEach, describe, expect, it } from 'vitest';
import { MAX_RECENT, useRecentSearchesStore } from './useRecentSearchesStore';

const { addSearch, removeSearch, clearSearches } = useRecentSearchesStore.getState();
const items = () => useRecentSearchesStore.getState().items;

beforeEach(() => {
  useRecentSearchesStore.setState({ items: [] });
});

describe('useRecentSearchesStore', () => {
  it('adds newest-first', () => {
    addSearch('haircut');
    addSearch('bridal');
    expect(items()).toEqual(['bridal', 'haircut']);
  });

  it('trims whitespace and ignores empty terms', () => {
    addSearch('  spa  ');
    addSearch('   ');
    addSearch('');
    expect(items()).toEqual(['spa']);
  });

  it('dedupes case-insensitively and moves the match to the front', () => {
    addSearch('Facial');
    addSearch('massage');
    addSearch('facial');
    expect(items()).toEqual(['facial', 'massage']);
  });

  it(`caps history at ${MAX_RECENT} entries`, () => {
    for (let i = 0; i < MAX_RECENT + 4; i += 1) addSearch(`term-${i}`);
    expect(items()).toHaveLength(MAX_RECENT);
    // Newest kept, oldest dropped.
    expect(items()[0]).toBe(`term-${MAX_RECENT + 3}`);
    expect(items()).not.toContain('term-0');
  });

  it('clamps overly long terms to the stored length', () => {
    addSearch('x'.repeat(200));
    expect(items()[0]).toHaveLength(60);
  });

  it('removes a single term case-insensitively', () => {
    addSearch('haircut');
    addSearch('bridal');
    removeSearch('HAIRCUT');
    expect(items()).toEqual(['bridal']);
  });

  it('clears all terms', () => {
    addSearch('haircut');
    addSearch('bridal');
    clearSearches();
    expect(items()).toEqual([]);
  });
});
