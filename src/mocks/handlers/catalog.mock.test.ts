import { describe, expect, it } from 'vitest';
import axios, { isAxiosError } from 'axios';
import { mockAdapter } from '../lib/mockEngine';
import './catalog.mock';
import { categoryIds } from '../data/categories.data';
import { seedServices } from '../data/services.data';
import {
  serviceCategorySchema,
  serviceSchema,
} from '../../features/service-catalog/types/catalog.schema';
import type { Service, ServiceCategory } from '../../features/service-catalog/types/catalog';
import type { ApiFailure, ApiPaginated, ApiSuccess } from '../../types/api';

// Requests go through the real mock adapter — the exact path the app uses,
// including axios `params` handling, envelopes and simulated latency.
const client = axios.create({ adapter: mockAdapter });

async function getServices(params: Record<string, unknown> = {}) {
  const response = await client.get<ApiPaginated<Service>>('/services', { params });
  return response.data;
}

async function expectApiError(promise: Promise<unknown>, status: number, code: string) {
  try {
    await promise;
    expect.unreachable('expected request to fail');
  } catch (error) {
    if (!isAxiosError(error)) throw error;
    expect(error.response?.status).toBe(status);
    const body = error.response?.data as ApiFailure;
    expect(body.success).toBe(false);
    expect(body.error.code).toBe(code);
  }
}

describe('seed data integrity', () => {
  it('every seed service satisfies the contract schema', () => {
    for (const service of seedServices) {
      expect(() => serviceSchema.parse(service)).not.toThrow();
    }
  });

  it('combos bundle SINGLE services from the same category, singles bundle nothing', () => {
    const byId = new Map(seedServices.map((service) => [service.id, service]));
    for (const service of seedServices) {
      if (service.type === 'COMBO') {
        expect(service.includedServiceIds.length).toBeGreaterThan(0);
        expect(service.originalPrice).not.toBeNull();
        expect(service.originalPrice!.amount).toBeGreaterThan(service.price.amount);
        expect(service.discountPercent).not.toBeNull();
        for (const includedId of service.includedServiceIds) {
          const included = byId.get(includedId);
          expect(included, `combo ${service.name} references unknown id ${includedId}`).toBeDefined();
          expect(included!.type).toBe('SINGLE');
          expect(included!.categoryId).toBe(service.categoryId);
        }
      } else {
        expect(service.includedServiceIds).toHaveLength(0);
        expect(service.originalPrice).toBeNull();
        expect(service.discountPercent).toBeNull();
      }
    }
  });

  it('Seniors intentionally has no combos (empty-state case)', () => {
    const seniorCombos = seedServices.filter(
      (service) => service.categoryId === categoryIds.seniors && service.type === 'COMBO',
    );
    expect(seniorCombos).toHaveLength(0);
  });
});

describe('GET /categories', () => {
  it('returns all categories sorted by sortOrder with derived serviceCount', async () => {
    const response = await client.get<ApiSuccess<ServiceCategory[]>>('/categories');
    const categories = response.data.data;

    expect(response.data.success).toBe(true);
    expect(categories).toHaveLength(6);
    for (const category of categories) {
      expect(() => serviceCategorySchema.parse(category)).not.toThrow();
    }
    const orders = categories.map((category) => category.sortOrder);
    expect(orders).toEqual([...orders].sort((a, b) => a - b));
    const totalCount = categories.reduce((sum, category) => sum + category.serviceCount, 0);
    expect(totalCount).toBe(seedServices.length);
  });
});

describe('GET /services — pagination', () => {
  it('paginates with defaults (page 1, limit 20)', async () => {
    const body = await getServices();
    expect(body.data).toHaveLength(20);
    expect(body.pagination).toEqual({
      page: 1,
      limit: 20,
      totalItems: seedServices.length,
      totalPages: 2,
      hasNextPage: true,
      hasPreviousPage: false,
    });
  });

  it('serves the last page with the remainder', async () => {
    const body = await getServices({ page: 2 });
    expect(body.data).toHaveLength(seedServices.length - 20);
    expect(body.pagination.hasNextPage).toBe(false);
    expect(body.pagination.hasPreviousPage).toBe(true);
  });

  it('respects a custom limit', async () => {
    const body = await getServices({ page: 3, limit: 12 });
    expect(body.data).toHaveLength(seedServices.length - 24);
    expect(body.pagination.totalPages).toBe(3);
  });
});

describe('GET /services — filters', () => {
  it('filters by categoryId', async () => {
    const body = await getServices({ categoryId: categoryIds.men, limit: 100 });
    const expected = seedServices.filter((service) => service.categoryId === categoryIds.men);
    expect(body.pagination.totalItems).toBe(expected.length);
    expect(body.data.every((service) => service.categoryId === categoryIds.men)).toBe(true);
  });

  it('filters by type within a category and returns empty for Seniors combos', async () => {
    const body = await getServices({ categoryId: categoryIds.seniors, type: 'COMBO' });
    expect(body.data).toHaveLength(0);
    expect(body.pagination.totalItems).toBe(0);
    expect(body.pagination.totalPages).toBe(1);
  });

  it('searches name/short/long descriptions case-insensitively', async () => {
    const needle = 'bridal';
    const body = await getServices({ search: needle, limit: 100 });
    const matches = (service: Service) =>
      `${service.name} ${service.shortDescription} ${service.description}`
        .toLowerCase()
        .includes(needle);
    const expected = seedServices.filter(matches);
    expect(expected.length).toBeGreaterThan(0);
    expect(body.pagination.totalItems).toBe(expected.length);
    expect(body.data.every(matches)).toBe(true);
  });

  it('returns an empty page for a no-match search', async () => {
    const body = await getServices({ search: 'zzz-no-such-service' });
    expect(body.data).toHaveLength(0);
    expect(body.pagination.totalItems).toBe(0);
  });

  // F14 Search fires at a 2-char minimum — the server still filters normally.
  it('filters on a short (2-char) query the way the search page sends it', async () => {
    const needle = 'ha';
    const body = await getServices({ search: needle, limit: 100 });
    const matches = (service: Service) =>
      `${service.name} ${service.shortDescription} ${service.description}`
        .toLowerCase()
        .includes(needle);
    const expected = seedServices.filter(matches);
    expect(expected.length).toBeGreaterThan(0);
    expect(body.pagination.totalItems).toBe(expected.length);
    expect(body.data.every(matches)).toBe(true);
  });

  it('filters popular services and price range', async () => {
    const popular = await getServices({ isPopular: true, limit: 100 });
    expect(popular.pagination.totalItems).toBe(
      seedServices.filter((service) => service.isPopular).length,
    );
    expect(popular.data.every((service) => service.isPopular)).toBe(true);

    const priced = await getServices({ minPrice: 100000, limit: 100 });
    expect(priced.data.length).toBeGreaterThan(0);
    expect(priced.data.every((service) => service.price.amount >= 100000)).toBe(true);
  });
});

describe('GET /services — sorting', () => {
  it('sorts by price ascending and descending', async () => {
    const asc = await getServices({ sortBy: 'price_asc', limit: 100 });
    const ascAmounts = asc.data.map((service) => service.price.amount);
    expect(ascAmounts).toEqual([...ascAmounts].sort((a, b) => a - b));

    const desc = await getServices({ sortBy: 'price_desc', limit: 100 });
    const descAmounts = desc.data.map((service) => service.price.amount);
    expect(descAmounts).toEqual([...descAmounts].sort((a, b) => b - a));
  });

  it('sorts by rating (top first) and name (A–Z)', async () => {
    const rated = await getServices({ sortBy: 'rating', limit: 100 });
    const ratings = rated.data.map((service) => service.rating);
    expect(ratings).toEqual([...ratings].sort((a, b) => b - a));

    const named = await getServices({ sortBy: 'name', limit: 100 });
    const names = named.data.map((service) => service.name);
    expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)));
  });
});

describe('GET /services/:id', () => {
  it('returns the matching service in a single-resource envelope', async () => {
    const target = seedServices[0];
    const response = await client.get<ApiSuccess<Service>>(`/services/${target.id}`);

    expect(response.data.success).toBe(true);
    expect(response.data.error).toBeNull();
    expect(response.data.data.id).toBe(target.id);
    expect(() => serviceSchema.parse(response.data.data)).not.toThrow();
  });

  it('returns 404 RESOURCE_NOT_FOUND for an unknown id', async () => {
    await expectApiError(
      client.get('/services/00000000-0000-4000-8000-000000000000'),
      404,
      'RESOURCE_NOT_FOUND',
    );
  });

  it('id=FORCE_500 returns the simulated server error', async () => {
    await expectApiError(client.get('/services/FORCE_500'), 500, 'INTERNAL_ERROR');
  });
});

describe('GET /services — errors', () => {
  it('search=FORCE_500 returns the simulated server error', async () => {
    await expectApiError(getServices({ search: 'FORCE_500' }), 500, 'INTERNAL_ERROR');
  });

  it('rejects invalid query params with VALIDATION_ERROR details', async () => {
    try {
      await getServices({ sortBy: 'banana' });
      expect.unreachable('expected request to fail');
    } catch (error) {
      if (!isAxiosError(error)) throw error;
      expect(error.response?.status).toBe(400);
      const body = error.response?.data as ApiFailure;
      expect(body.error.code).toBe('VALIDATION_ERROR');
      expect(body.error.details.some((detail) => detail.field === 'sortBy')).toBe(true);
    }
  });

  it('rejects page=0 and limit>100', async () => {
    await expectApiError(getServices({ page: 0 }), 400, 'VALIDATION_ERROR');
    await expectApiError(getServices({ limit: 101 }), 400, 'VALIDATION_ERROR');
  });
});
