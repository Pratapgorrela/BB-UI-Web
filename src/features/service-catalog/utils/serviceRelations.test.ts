import { describe, expect, it } from 'vitest';
import { deriveServiceRelations } from './serviceRelations';
import type { Service } from '../types/catalog';

function makeService(overrides: Partial<Service> & Pick<Service, 'id' | 'type'>): Service {
  return {
    categoryId: 'cat_men',
    name: `Service ${overrides.id}`,
    description: 'Full description',
    shortDescription: 'Short description',
    imageUrl: 'https://example.com/img.jpg',
    galleryUrls: [],
    price: { amount: 39900, currency: 'INR' },
    originalPrice: null,
    discountPercent: null,
    includedServiceIds: [],
    duration: 30,
    isPopular: false,
    rating: 4.5,
    reviewCount: 10,
    tags: [],
    createdAt: '2026-01-01T00:00:00.000Z',
    ...overrides,
  };
}

describe('deriveServiceRelations', () => {
  const singles = ['s1', 's2', 's3', 's4', 's5', 's6', 's7', 's8'].map((id) =>
    makeService({ id, type: 'SINGLE' }),
  );
  const combo = makeService({
    id: 'c1',
    type: 'COMBO',
    includedServiceIds: ['s1', 's2', 'missing'],
  });
  const pool = [combo, ...singles];

  it("resolves a combo's included services and skips unknown ids", () => {
    const { included } = deriveServiceRelations(combo, pool);
    expect(included.map((service) => service.id)).toEqual(['s1', 's2']);
  });

  it('recommends same-pool singles excluding self and inclusions, capped at 6', () => {
    const { recommended } = deriveServiceRelations(combo, pool);
    expect(recommended.every((service) => service.type === 'SINGLE')).toBe(true);
    expect(recommended.map((service) => service.id)).toEqual(['s3', 's4', 's5', 's6', 's7', 's8']);
  });

  it('recommends other singles for a single service (never itself)', () => {
    const firstSingle = singles[0];
    const { included, recommended } = deriveServiceRelations(firstSingle, pool);
    expect(included).toEqual([]);
    expect(recommended.map((service) => service.id)).toEqual(['s2', 's3', 's4', 's5', 's6', 's7']);
  });

  it('returns empty lists without a service', () => {
    expect(deriveServiceRelations(undefined, pool)).toEqual({ included: [], recommended: [] });
  });
});
