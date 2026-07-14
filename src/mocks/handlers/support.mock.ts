import { fail, ok, paginated, registerMock } from '../lib/mockEngine';
import { requireAuth } from '../lib/guards';
import { toValidationDetails } from './cart.mock';
import { allBookings } from './booking.mock';
import { seedFaqs } from '../data/faqs.data';
import { seedSupportRequests } from '../data/supportRequests.data';
import { createSupportRequestRequestSchema } from '../../features/support/types/support.schema';
import type { SupportRequest } from '../../features/support/types/support';

const REQUESTS_KEY = 'bb-mock-support-requests';

/* ── Guarded persistence (Vitest runs in node; private mode can throw) ── */

function readStored(): SupportRequest[] {
  try {
    const raw = globalThis.localStorage?.getItem(REQUESTS_KEY);
    return raw ? (JSON.parse(raw) as SupportRequest[]) : [];
  } catch {
    return [];
  }
}

function persistRequest(request: SupportRequest): void {
  try {
    globalThis.localStorage?.setItem(REQUESTS_KEY, JSON.stringify([...readStored(), request]));
  } catch {
    /* storage unavailable — the created request just won't survive reload */
  }
}

/* ── Request universe (seed ∪ stored — creations only, no tombstones needed) ── */

function allSupportRequests(): SupportRequest[] {
  const byId = new Map<string, SupportRequest>();
  for (const request of seedSupportRequests) byId.set(request.id, request);
  for (const request of readStored()) byId.set(request.id, request);
  return [...byId.values()];
}

/** A user's support requests, newest first. */
function requestsForUser(userId: string): SupportRequest[] {
  return allSupportRequests()
    .filter((request) => request.userId === userId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

/** `SR-YYYYMMDD-XXXX` — mirrors the booking `makeReferenceCode` shape. */
function makeSupportReferenceCode(): string {
  const now = new Date();
  const stamp = `${now.getUTCFullYear()}${String(now.getUTCMonth() + 1).padStart(2, '0')}${String(
    now.getUTCDate(),
  ).padStart(2, '0')}`;
  const suffix = crypto.randomUUID().replace(/-/g, '').slice(0, 4).toUpperCase();
  return `SR-${stamp}-${suffix}`;
}

/* ── GET /faqs (guest) ── */

registerMock('GET', '/faqs', (req) => {
  const path = '/api/v1/faqs';

  const scenario = req.query.get('scenario');
  if (scenario === 'error') {
    return fail(500, 'INTERNAL_ERROR', 'Simulated server error. Please try again later.', path);
  }
  if (scenario === 'empty') return ok([]);

  return ok([...seedFaqs].sort((a, b) => a.sortOrder - b.sortOrder));
});

/* ── GET /support-requests ── */

registerMock('GET', '/support-requests', (req) => {
  const path = '/api/v1/support-requests';
  const userId = requireAuth(req, path);

  const scenario = req.query.get('scenario');
  if (scenario === 'error') {
    return fail(500, 'INTERNAL_ERROR', 'Simulated server error. Please try again later.', path);
  }

  const page = Math.max(1, Number(req.query.get('page')) || 1);
  const limit = Math.min(100, Math.max(1, Number(req.query.get('limit')) || 20));

  const items = scenario === 'empty' ? [] : requestsForUser(userId);
  return paginated(items, page, limit);
});

/* ── POST /support-requests ── */

registerMock('POST', '/support-requests', (req) => {
  const path = '/api/v1/support-requests';
  const userId = requireAuth(req, path);

  const parsed = createSupportRequestRequestSchema.safeParse(req.body);
  if (!parsed.success) {
    return fail(
      400,
      'VALIDATION_ERROR',
      'Request validation failed.',
      path,
      toValidationDetails(parsed.error.issues),
    );
  }

  const { bookingId = null, issueType, description } = parsed.data;

  // Contract convention: FORCE_500 in the description simulates a server failure
  // (powers the Figma submission-failure state).
  if (description.includes('FORCE_500')) {
    return fail(500, 'INTERNAL_ERROR', 'Simulated server error. Please try again later.', path);
  }

  let bookingReferenceCode: string | null = null;
  if (bookingId) {
    const booking = allBookings().find((candidate) => candidate.id === bookingId);
    if (!booking || booking.userId !== userId) {
      return fail(400, 'VALIDATION_ERROR', 'Request validation failed.', path, [
        { field: 'bookingId', message: 'Unknown booking.' },
      ]);
    }
    bookingReferenceCode = booking.referenceCode;
  }

  const now = new Date().toISOString();
  const request: SupportRequest = {
    id: crypto.randomUUID(),
    userId,
    referenceCode: makeSupportReferenceCode(),
    bookingId,
    bookingReferenceCode,
    issueType,
    description,
    status: 'OPEN',
    createdAt: now,
    updatedAt: now,
  };

  persistRequest(request);
  return ok(request, 201);
});
