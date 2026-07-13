import { fail, ok, registerMock } from '../lib/mockEngine';
import { requireAuth } from '../lib/guards';
import { seedAddresses } from '../data/addresses.data';
import { findUserById } from './auth.mock';
import { allBookings } from './booking.mock';
import { toValidationDetails } from './cart.mock';
import {
  createAddressRequestSchema,
  updateAddressRequestSchema,
  updateProfileRequestSchema,
} from '../../features/profile/types/address.schema';
import type { Address } from '../../features/profile/types/address';
import type { User } from '../../features/auth/types/auth';

const ADDRESSES_KEY = 'bb-mock-addresses';
const ADDRESSES_DELETED_KEY = 'bb-mock-addresses-deleted';
const PROFILE_OVERRIDES_KEY = 'bb-mock-profile';

/* ── Guarded persistence (Vitest runs in node; private mode can throw) ── */

function readStorage<T>(key: string, fallback: T): T {
  try {
    const raw = globalThis.localStorage?.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeStorage(key: string, value: unknown): void {
  try {
    globalThis.localStorage?.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable — mutations just won't survive reload */
  }
}

/* ── Profile overrides (edits to seed/registered users, keyed by userId) ── */

type ProfileOverride = Partial<Pick<User, 'firstName' | 'lastName' | 'phone'>> & {
  updatedAt?: string;
};
type ProfileOverrides = Record<string, ProfileOverride>;

/** Base user + any stored profile edits. */
function resolveUser(userId: string): User | undefined {
  const base = findUserById(userId);
  if (!base) return undefined;
  const override = readStorage<ProfileOverrides>(PROFILE_OVERRIDES_KEY, {})[userId];
  return override ? { ...base, ...override } : base;
}

/* ── Address overlay store (seed ∪ stored − tombstoned), mirrors allBookings ── */

function readStored(): Address[] {
  return readStorage<Address[]>(ADDRESSES_KEY, []);
}

function readDeleted(): string[] {
  return readStorage<string[]>(ADDRESSES_DELETED_KEY, []);
}

/** The full address universe: seeds overlaid by stored edits, minus tombstones. */
function allAddresses(): Address[] {
  const stored = readStored();
  const deleted = new Set(readDeleted());
  const byId = new Map<string, Address>();
  for (const address of seedAddresses) byId.set(address.id, address);
  for (const address of stored) byId.set(address.id, address);
  for (const id of deleted) byId.delete(id);
  return [...byId.values()];
}

/** A user's addresses, default first then newest. */
function addressesForUser(userId: string): Address[] {
  return allAddresses()
    .filter((address) => address.userId === userId)
    .sort((a, b) => {
      if (a.isDefault !== b.isDefault) return a.isDefault ? -1 : 1;
      return b.createdAt.localeCompare(a.createdAt);
    });
}

/**
 * Any address by id across all users. Exported for booking.mock's detail
 * expansion (ownership is already enforced there via the booking's userId).
 */
function findAddressRecord(id: string): Address | undefined {
  return allAddresses().find((address) => address.id === id);
}

function upsertAddress(updated: Address): void {
  const stored = readStored();
  const index = stored.findIndex((address) => address.id === updated.id);
  if (index === -1) writeStorage(ADDRESSES_KEY, [...stored, updated]);
  else writeStorage(ADDRESSES_KEY, stored.map((a) => (a.id === updated.id ? updated : a)));
}

function tombstoneAddress(id: string): void {
  writeStorage(ADDRESSES_KEY, readStored().filter((address) => address.id !== id));
  const deleted = readDeleted();
  if (!deleted.includes(id)) writeStorage(ADDRESSES_DELETED_KEY, [...deleted, id]);
}

/** Make `exceptId` the user's only default by unsetting siblings (materialized into the store). */
function clearOtherDefaults(userId: string, exceptId: string): void {
  for (const address of allAddresses()) {
    if (address.userId === userId && address.id !== exceptId && address.isDefault) {
      upsertAddress({ ...address, isDefault: false });
    }
  }
}

/* ── GET /profile ── */

registerMock('GET', '/profile', (req) => {
  const path = '/api/v1/profile';
  const userId = requireAuth(req, path);
  const user = resolveUser(userId);
  if (!user) return fail(404, 'RESOURCE_NOT_FOUND', 'Profile not found.', path);
  return ok(user);
});

/* ── PATCH /profile ── */

registerMock('PATCH', '/profile', (req) => {
  const path = '/api/v1/profile';
  const userId = requireAuth(req, path);
  const base = findUserById(userId);
  if (!base) return fail(404, 'RESOURCE_NOT_FOUND', 'Profile not found.', path);

  const parsed = updateProfileRequestSchema.safeParse(req.body);
  if (!parsed.success) {
    return fail(400, 'VALIDATION_ERROR', 'Request validation failed.', path, toValidationDetails(parsed.error.issues));
  }

  const overrides = readStorage<ProfileOverrides>(PROFILE_OVERRIDES_KEY, {});
  const updatedAt = new Date().toISOString();
  overrides[userId] = { ...overrides[userId], ...parsed.data, updatedAt };
  writeStorage(PROFILE_OVERRIDES_KEY, overrides);

  return ok({ ...base, ...overrides[userId] });
});

/* ── GET /addresses ── */

registerMock('GET', '/addresses', (req) => {
  const path = '/api/v1/addresses';
  const userId = requireAuth(req, path);

  const scenario = req.query.get('scenario');
  if (scenario === 'error') {
    return fail(500, 'INTERNAL_ERROR', 'Simulated server error. Please try again later.', path);
  }
  if (scenario === 'empty') return ok<Address[]>([]);

  return ok(addressesForUser(userId));
});

/* ── POST /addresses ── */

registerMock('POST', '/addresses', (req) => {
  const path = '/api/v1/addresses';
  const userId = requireAuth(req, path);

  const parsed = createAddressRequestSchema.safeParse(req.body);
  if (!parsed.success) {
    return fail(400, 'VALIDATION_ERROR', 'Request validation failed.', path, toValidationDetails(parsed.error.issues));
  }

  const id = crypto.randomUUID();
  // First address is always the default; otherwise honour the request flag.
  const isDefault = parsed.data.isDefault || addressesForUser(userId).length === 0;
  const address: Address = {
    id,
    userId,
    label: parsed.data.label,
    street: parsed.data.street,
    apartment: parsed.data.apartment,
    city: parsed.data.city,
    state: parsed.data.state,
    zipCode: parsed.data.zipCode,
    country: parsed.data.country,
    latitude: null,
    longitude: null,
    isDefault,
    createdAt: new Date().toISOString(),
  };
  if (isDefault) clearOtherDefaults(userId, id);
  upsertAddress(address);
  return ok(address, 201);
});

/* ── PATCH /addresses/:id ── */

registerMock('PATCH', '/addresses/:id', (req) => {
  const path = `/api/v1/addresses/${req.params.id}`;
  const userId = requireAuth(req, path);

  const existing = allAddresses().find((address) => address.id === req.params.id);
  if (!existing || existing.userId !== userId) {
    return fail(404, 'RESOURCE_NOT_FOUND', 'Address not found.', path);
  }

  const parsed = updateAddressRequestSchema.safeParse(req.body);
  if (!parsed.success) {
    return fail(400, 'VALIDATION_ERROR', 'Request validation failed.', path, toValidationDetails(parsed.error.issues));
  }

  const updated: Address = { ...existing, ...parsed.data };
  if (parsed.data.isDefault === true) clearOtherDefaults(userId, updated.id);
  upsertAddress(updated);
  return ok(updated);
});

/* ── DELETE /addresses/:id ── */

registerMock('DELETE', '/addresses/:id', (req) => {
  const path = `/api/v1/addresses/${req.params.id}`;
  const userId = requireAuth(req, path);

  const existing = allAddresses().find((address) => address.id === req.params.id);
  if (!existing || existing.userId !== userId) {
    return fail(404, 'RESOURCE_NOT_FOUND', 'Address not found.', path);
  }

  // Business rule: cannot delete an address an upcoming booking still points to.
  const blockingBooking = allBookings().find(
    (booking) =>
      booking.userId === userId &&
      booking.addressId === existing.id &&
      (booking.status === 'PENDING' || booking.status === 'CONFIRMED'),
  );
  if (blockingBooking) {
    return fail(
      422,
      'BUSINESS_RULE_VIOLATION',
      'This address is used by an upcoming booking and cannot be deleted.',
      path,
      [{ field: 'id', message: `In use by booking ${blockingBooking.referenceCode}.` }],
    );
  }

  tombstoneAddress(existing.id);

  // Promote another address to default if we removed the default one.
  if (existing.isDefault) {
    const next = addressesForUser(userId)[0];
    if (next && !next.isDefault) upsertAddress({ ...next, isDefault: true });
  }

  return ok(null);
});

export { findAddressRecord };
