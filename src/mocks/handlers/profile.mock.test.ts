import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest';
import axios, { isAxiosError } from 'axios';
import type { AxiosRequestConfig } from 'axios';
import { mockAdapter } from '../lib/mockEngine';
import './profile.mock';
import { seedAddresses } from '../data/addresses.data';
import { addressSchema } from '../../features/profile/types/address.schema';
import type { Address, CreateAddressRequest } from '../../features/profile/types/address';
import type { User } from '../../features/auth/types/auth';
import type { ApiFailure, ApiSuccess } from '../../types/api';

const client = axios.create({ adapter: mockAdapter });

const PRIYA_ID = '3f1c2a9e-8b4d-4c6a-9e2f-1a5b7c3d9e0f';
const RAHUL_ID = '7d4e5f2b-1c8a-4b3d-8f6e-2c9a0b1d4e7f';
const PRIYA_HOME_ID = 'a1e7c9d2-4b6f-4a1e-9c3d-7f2b8e5a1c40'; // referenced by a PENDING seed booking
const PRIYA_PARENTS_ID = 'c3a9e1f4-6d8b-4c3a-9e5f-0b4d8a7c3e62'; // referenced by nothing
const RAHUL_HOME_ID = 'd4b0f2a5-7e9c-4d4b-8f60-1c5e9b8d4f73';

function auth(userId: string): AxiosRequestConfig {
  const token = `mock-access.${userId}.${Date.now() + 60 * 60 * 1000}`;
  return { headers: { Authorization: `Bearer ${token}` } };
}

const validAddress: CreateAddressRequest = {
  label: 'Studio',
  street: '3 Film Nagar',
  apartment: null,
  city: 'Hyderabad',
  state: 'Telangana',
  zipCode: '500096',
  country: 'IN',
  isDefault: false,
};

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

/** Map-backed localStorage shim — Vitest runs in node (no DOM). */
function storageShim(): Storage {
  const store = new Map<string, string>();
  return {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => void store.set(key, String(value)),
    removeItem: (key: string) => void store.delete(key),
    clear: () => store.clear(),
    key: (index: number) => [...store.keys()][index] ?? null,
    get length() {
      return store.size;
    },
  } as Storage;
}

beforeEach(() => {
  vi.stubGlobal('localStorage', storageShim());
});

afterAll(() => {
  vi.unstubAllGlobals();
});

async function listAddresses(userId: string): Promise<Address[]> {
  const response = await client.get<ApiSuccess<Address[]>>('/addresses', auth(userId));
  return response.data.data;
}

describe('seed addresses integrity', () => {
  it('every seed address satisfies the contract schema', () => {
    for (const address of seedAddresses) {
      expect(() => addressSchema.parse(address)).not.toThrow();
    }
  });

  it('gives each user exactly one default address', () => {
    for (const userId of [PRIYA_ID, RAHUL_ID]) {
      const defaults = seedAddresses.filter((a) => a.userId === userId && a.isDefault);
      expect(defaults).toHaveLength(1);
    }
  });
});

describe('GET /profile', () => {
  it('rejects an unauthenticated request with 401', async () => {
    await expectApiError(client.get('/profile'), 401, 'UNAUTHORIZED');
  });

  it('returns the current user', async () => {
    const response = await client.get<ApiSuccess<User>>('/profile', auth(PRIYA_ID));
    expect(response.data.data.id).toBe(PRIYA_ID);
    expect(response.data.data.email).toBe('priya@example.com');
  });
});

describe('PATCH /profile', () => {
  it('rejects an unauthenticated request with 401', async () => {
    await expectApiError(client.patch('/profile', { firstName: 'X' }), 401, 'UNAUTHORIZED');
  });

  it('rejects a malformed phone with 400', async () => {
    await expectApiError(
      client.patch('/profile', { phone: '12345' }, auth(PRIYA_ID)),
      400,
      'VALIDATION_ERROR',
    );
  });

  it('updates a field and persists it for the next GET /profile', async () => {
    const patched = await client.patch<ApiSuccess<User>>(
      '/profile',
      { firstName: 'Priyanka' },
      auth(PRIYA_ID),
    );
    expect(patched.data.data.firstName).toBe('Priyanka');

    const fetched = await client.get<ApiSuccess<User>>('/profile', auth(PRIYA_ID));
    expect(fetched.data.data.firstName).toBe('Priyanka');
    expect(fetched.data.data.lastName).toBe('Sharma'); // untouched
  });
});

describe('GET /addresses', () => {
  it('rejects an unauthenticated request with 401', async () => {
    await expectApiError(client.get('/addresses'), 401, 'UNAUTHORIZED');
  });

  it("returns only the caller's addresses, default first", async () => {
    const list = await listAddresses(PRIYA_ID);
    expect(list).toHaveLength(3);
    expect(list.every((a) => a.userId === PRIYA_ID)).toBe(true);
    expect(list[0].isDefault).toBe(true);
    expect(list.map((a) => a.id)).not.toContain(RAHUL_HOME_ID);
  });

  it('scenario=empty returns an empty list', async () => {
    const response = await client.get<ApiSuccess<Address[]>>('/addresses', {
      ...auth(PRIYA_ID),
      params: { scenario: 'empty' },
    });
    expect(response.data.data).toHaveLength(0);
  });

  it('scenario=error returns the simulated server error', async () => {
    await expectApiError(
      client.get('/addresses', { ...auth(PRIYA_ID), params: { scenario: 'error' } }),
      500,
      'INTERNAL_ERROR',
    );
  });
});

describe('POST /addresses', () => {
  it('rejects an unauthenticated request with 401', async () => {
    await expectApiError(client.post('/addresses', validAddress), 401, 'UNAUTHORIZED');
  });

  it('rejects an invalid PIN code with 400', async () => {
    await expectApiError(
      client.post('/addresses', { ...validAddress, zipCode: 'abc' }, auth(PRIYA_ID)),
      400,
      'VALIDATION_ERROR',
    );
  });

  it('creates an address (201) and includes it in the list', async () => {
    const created = await client.post<ApiSuccess<Address>>('/addresses', validAddress, auth(PRIYA_ID));
    expect(created.status).toBe(201);
    expect(created.data.data.isDefault).toBe(false);

    const list = await listAddresses(PRIYA_ID);
    expect(list).toHaveLength(4);
    expect(list.map((a) => a.id)).toContain(created.data.data.id);
  });

  it('setting isDefault:true unsets the previous default (exclusive)', async () => {
    await client.post('/addresses', { ...validAddress, isDefault: true }, auth(PRIYA_ID));
    const list = await listAddresses(PRIYA_ID);
    const defaults = list.filter((a) => a.isDefault);
    expect(defaults).toHaveLength(1);
    expect(defaults[0].label).toBe('Studio');
  });
});

describe('PATCH /addresses/:id', () => {
  it('returns 404 for an unknown id', async () => {
    await expectApiError(
      client.patch('/addresses/nope', { label: 'X' }, auth(PRIYA_ID)),
      404,
      'RESOURCE_NOT_FOUND',
    );
  });

  it("returns 404 for another user's address", async () => {
    await expectApiError(
      client.patch(`/addresses/${RAHUL_HOME_ID}`, { label: 'X' }, auth(PRIYA_ID)),
      404,
      'RESOURCE_NOT_FOUND',
    );
  });

  it('edits a field and persists it', async () => {
    await client.patch(`/addresses/${PRIYA_PARENTS_ID}`, { label: 'Grandparents' }, auth(PRIYA_ID));
    const list = await listAddresses(PRIYA_ID);
    expect(list.find((a) => a.id === PRIYA_PARENTS_ID)?.label).toBe('Grandparents');
  });
});

describe('DELETE /addresses/:id', () => {
  it('returns 404 for another user’s address', async () => {
    await expectApiError(
      client.delete(`/addresses/${RAHUL_HOME_ID}`, auth(PRIYA_ID)),
      404,
      'RESOURCE_NOT_FOUND',
    );
  });

  it('blocks deleting an address used by an upcoming booking (422)', async () => {
    await expectApiError(
      client.delete(`/addresses/${PRIYA_HOME_ID}`, auth(PRIYA_ID)),
      422,
      'BUSINESS_RULE_VIOLATION',
    );
    // Still present after the blocked delete.
    const list = await listAddresses(PRIYA_ID);
    expect(list.map((a) => a.id)).toContain(PRIYA_HOME_ID);
  });

  it('deletes an unreferenced address (200) and removes it from the list', async () => {
    const response = await client.delete<ApiSuccess<null>>(
      `/addresses/${PRIYA_PARENTS_ID}`,
      auth(PRIYA_ID),
    );
    expect(response.status).toBe(200);
    const list = await listAddresses(PRIYA_ID);
    expect(list.map((a) => a.id)).not.toContain(PRIYA_PARENTS_ID);
    expect(list).toHaveLength(2);
  });

  it('promotes another address to default when the default is deleted', async () => {
    // Make the (unreferenced) Parents address the default, then delete it.
    await client.patch(`/addresses/${PRIYA_PARENTS_ID}`, { isDefault: true }, auth(PRIYA_ID));
    await client.delete(`/addresses/${PRIYA_PARENTS_ID}`, auth(PRIYA_ID));

    const list = await listAddresses(PRIYA_ID);
    expect(list).toHaveLength(2);
    expect(list.filter((a) => a.isDefault)).toHaveLength(1);
  });
});
