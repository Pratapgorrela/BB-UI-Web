import { fail, MockError, ok, paginated, registerMock } from '../lib/mockEngine';
import { requireAuth } from '../lib/guards';
import { seedBookings } from '../data/bookings.data';
import { seedServices } from '../data/services.data';
import { seedSpecialists } from '../data/specialists.data';
import { checkoutAddresses } from '../../features/cart/data/checkoutAddresses';
import { makeReferenceCode, priceCart, toValidationDetails } from './cart.mock';
import {
  bookingsListQuerySchema,
  cancelBookingRequestSchema,
  createBookingRequestSchema,
  rescheduleBookingRequestSchema,
  timeSlotsQuerySchema,
} from '../../features/booking/types/booking.schema';
import type {
  Booking,
  BookingAddress,
  BookingDetail,
  TimeSlot,
} from '../../features/booking/types/booking';
import type { CartItem } from '../../features/cart/types/cart';

const BOOKINGS_STORAGE_KEY = 'bb-mock-bookings';
const HORIZON_DAYS = 14;
const FIRST_HOUR = 9;
const LAST_HOUR = 18;
/** Test-only 409 trigger (UI never sends notes) — mirrors the catalog FORCE_500 convention. */
const FORCE_SLOT_UNAVAILABLE = 'FORCE_SLOT_UNAVAILABLE';

/* ── Persistence (bb-mock-bookings) ──
 * Lazy + guarded: Vitest runs in the node environment where localStorage is
 * undefined, and browsers can throw in private mode / when quota is full. */

function readBookings(): Booking[] {
  try {
    const raw = globalThis.localStorage?.getItem(BOOKINGS_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Booking[]) : [];
  } catch {
    return [];
  }
}

function writeBookings(bookings: Booking[]): void {
  try {
    globalThis.localStorage?.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(bookings));
  } catch {
    /* storage unavailable — bookings just won't survive reload */
  }
}

/**
 * The full booking universe: localStorage (write store) merged with the
 * read-only seeds. localStorage wins by id — cancelling/rescheduling a seed
 * upserts the mutated copy there, so the seeds module is never mutated.
 */
function allBookings(): Booking[] {
  const stored = readBookings();
  const storedIds = new Set(stored.map((booking) => booking.id));
  return [...stored, ...seedBookings.filter((seed) => !storedIds.has(seed.id))];
}

function upsertBooking(updated: Booking): void {
  const stored = readBookings();
  const index = stored.findIndex((booking) => booking.id === updated.id);
  if (index === -1) {
    writeBookings([...stored, updated]);
  } else {
    writeBookings(stored.map((booking) => (booking.id === updated.id ? updated : booking)));
  }
}

/** Owned booking or 404 — the contract hides other users' bookings (404, not 403). */
function findOwnedBooking(id: string, userId: string, path: string): Booking {
  const booking = allBookings().find((candidate) => candidate.id === id);
  if (!booking || booking.userId !== userId) {
    throw new MockError(fail(404, 'RESOURCE_NOT_FOUND', 'Booking not found.', path));
  }
  return booking;
}

const TWO_HOURS_MS = 2 * 60 * 60 * 1000;

/** 422 unless the booking is PENDING/CONFIRMED and ≥2h before its slot. */
function assertModifiable(booking: Booking, path: string): void {
  if (booking.status !== 'PENDING' && booking.status !== 'CONFIRMED') {
    throw new MockError(
      fail(
        422,
        'BUSINESS_RULE_VIOLATION',
        'Only pending or confirmed bookings can be changed.',
        path,
      ),
    );
  }
  if (new Date(booking.scheduledAt).getTime() - Date.now() < TWO_HOURS_MS) {
    throw new MockError(
      fail(
        422,
        'BUSINESS_RULE_VIOLATION',
        'Changes are locked within 2 hours of your slot.',
        path,
      ),
    );
  }
}

/* ── Deterministic slot grid ── */

function pad2(value: number): string {
  return String(value).padStart(2, '0');
}

/** Stable slot id encoding date + startTime in the last UUID group (v4-shaped). */
function slotId(date: string, startTime: string): string {
  return `00000000-0000-4000-8000-${date.replaceAll('-', '')}${startTime.replace(':', '')}`;
}

function decodeSlotId(id: string): { date: string; startHour: number } | null {
  const match = /^00000000-0000-4000-8000-(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})$/.exec(id);
  if (!match) return null;
  const [, year, month, day, hour, minute] = match;
  if (minute !== '00') return null;
  return { date: `${year}-${month}-${day}`, startHour: Number(hour) };
}

function localMidnight(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

/** Day offset of `YYYY-MM-DD` from today (local) — 0 = today; null = invalid date. */
function dayOffset(dateStr: string): number | null {
  const [year, month, day] = dateStr.split('-').map(Number);
  const target = new Date(year, month - 1, day);
  if (Number.isNaN(target.getTime()) || target.getMonth() !== month - 1 || target.getDate() !== day) {
    return null;
  }
  const msPerDay = 24 * 60 * 60 * 1000;
  return Math.round((target.getTime() - localMidnight(new Date()).getTime()) / msPerDay);
}

function slotStartInstant(date: string, startHour: number): Date {
  const [year, month, day] = date.split('-').map(Number);
  return new Date(year, month - 1, day, startHour, 0, 0, 0);
}

/** ~25% deterministic capacity exhaustion, varying by day. */
function isCapacityExhausted(date: string, startHour: number): boolean {
  const dayOfMonth = Number(date.slice(8, 10));
  return (dayOfMonth + startHour) % 4 === 0;
}

function isWindowBooked(
  date: string,
  startHour: number,
  bookings: Booking[],
  excludeId?: string,
): boolean {
  const startMs = slotStartInstant(date, startHour).getTime();
  return bookings.some(
    (booking) =>
      booking.id !== excludeId &&
      booking.status !== 'CANCELLED' &&
      new Date(booking.scheduledAt).getTime() === startMs,
  );
}

function slotsForDate(date: string): TimeSlot[] {
  const offset = dayOffset(date);
  if (offset === null || offset < 0 || offset >= HORIZON_DAYS) return [];

  const bookings = allBookings();
  const now = new Date();
  const slots: TimeSlot[] = [];

  for (let hour = FIRST_HOUR; hour <= LAST_HOUR; hour += 1) {
    const startTime = `${pad2(hour)}:00`;
    const isPast = offset === 0 && slotStartInstant(date, hour).getTime() <= now.getTime();
    slots.push({
      id: slotId(date, startTime),
      date,
      startTime,
      endTime: `${pad2(hour + 1)}:00`,
      isAvailable: !isPast && !isCapacityExhausted(date, hour) && !isWindowBooked(date, hour, bookings),
    });
  }
  return slots;
}

/* ── GET /time-slots ── */

registerMock('GET', '/time-slots', (req) => {
  const path = '/api/v1/time-slots';
  const scenario = req.query.get('scenario');
  if (scenario === 'error') {
    return fail(500, 'INTERNAL_ERROR', 'Simulated server error. Please try again later.', path);
  }
  if (scenario === 'empty') return ok([]);

  const parsed = timeSlotsQuerySchema.safeParse({ date: req.query.get('date') ?? undefined });
  if (!parsed.success) {
    return fail(
      400,
      'VALIDATION_ERROR',
      'Request validation failed.',
      path,
      toValidationDetails(parsed.error.issues),
    );
  }
  return ok(slotsForDate(parsed.data.date));
});

/* ── POST /bookings ── */

registerMock('POST', '/bookings', (req) => {
  const path = '/api/v1/bookings';
  const userId = requireAuth(req, path);

  const parsed = createBookingRequestSchema.safeParse(req.body);
  if (!parsed.success) {
    return fail(
      400,
      'VALIDATION_ERROR',
      'Request validation failed.',
      path,
      toValidationDetails(parsed.error.issues),
    );
  }

  const { items, couponCode, addressId, timeSlotId, notes } = parsed.data;
  const paymentSummary = priceCart(items, couponCode, path);

  const slotUnavailable = () =>
    new MockError(
      fail(409, 'SLOT_UNAVAILABLE', 'That slot was just taken — please pick another.', path),
    );

  if (notes === FORCE_SLOT_UNAVAILABLE) throw slotUnavailable();

  const decoded = decodeSlotId(timeSlotId);
  if (!decoded) throw slotUnavailable();

  const { date, startHour } = decoded;
  const offset = dayOffset(date);
  const isPast = slotStartInstant(date, startHour).getTime() <= Date.now();
  if (
    offset === null ||
    offset < 0 ||
    offset >= HORIZON_DAYS ||
    startHour < FIRST_HOUR ||
    startHour > LAST_HOUR ||
    isPast ||
    isCapacityExhausted(date, startHour) ||
    isWindowBooked(date, startHour, allBookings())
  ) {
    throw slotUnavailable();
  }

  // priceCart already validated every serviceId exists, so the lookups below are safe.
  const bookingItems: CartItem[] = items.map((line) => {
    const service = seedServices.find((candidate) => candidate.id === line.serviceId)!;
    return {
      serviceId: service.id,
      service,
      quantity: line.quantity,
      selected: true,
      lineTotal: { amount: service.price.amount * line.quantity, currency: service.price.currency },
    };
  });

  const now = new Date().toISOString();
  const booking: Booking = {
    id: crypto.randomUUID(),
    userId,
    referenceCode: makeReferenceCode(),
    items: bookingItems,
    paymentSummary,
    addressId,
    specialistId: seedSpecialists[startHour % seedSpecialists.length].id,
    status: 'PENDING',
    scheduledAt: slotStartInstant(date, startHour).toISOString(),
    duration: bookingItems.reduce(
      (total, item) => total + item.service.duration * item.quantity,
      0,
    ),
    notes: notes ?? null,
    cancellationReason: null,
    createdAt: now,
    updatedAt: now,
  };

  writeBookings([...readBookings(), booking]);
  return ok(booking, 201);
});

/* ── GET /bookings ── */

registerMock('GET', '/bookings', (req) => {
  const path = '/api/v1/bookings';
  const scenario = req.query.get('scenario');
  if (scenario === 'error') {
    return fail(500, 'INTERNAL_ERROR', 'Simulated server error. Please try again later.', path);
  }

  const userId = requireAuth(req, path);
  if (scenario === 'empty') return paginated([], 1, 10);

  const parsed = bookingsListQuerySchema.safeParse({
    status: req.query.get('status') ?? undefined,
    page: req.query.get('page') ?? undefined,
    limit: req.query.get('limit') ?? undefined,
  });
  if (!parsed.success) {
    return fail(
      400,
      'VALIDATION_ERROR',
      'Request validation failed.',
      path,
      toValidationDetails(parsed.error.issues),
    );
  }

  const { status, page, limit } = parsed.data;
  const bookings = allBookings()
    .filter(
      (booking) =>
        booking.userId === userId && (!status || status.includes(booking.status)),
    )
    .sort(
      (a, b) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime(),
    );
  return paginated(bookings, page, limit);
});

/* ── GET /bookings/:id ── */

registerMock('GET', '/bookings/:id', (req) => {
  const path = `/api/v1/bookings/${req.params.id}`;
  const userId = requireAuth(req, path);
  const booking = findOwnedBooking(req.params.id, userId, path);

  // priceCart validated specialists/addresses at creation; seeds are integrity-tested.
  const specialist = seedSpecialists.find(
    (candidate) => candidate.id === booking.specialistId,
  );
  if (!specialist) {
    return fail(500, 'INTERNAL_ERROR', 'Assigned specialist record is missing.', path);
  }
  const address: BookingAddress = checkoutAddresses.find(
    (candidate) => candidate.id === booking.addressId,
  ) ?? { id: booking.addressId, label: 'Saved address', line: 'Address on file' };

  const detail: BookingDetail = { ...booking, specialist, address };
  return ok(detail);
});

/* ── PATCH /bookings/:id/cancel ── */

registerMock('PATCH', '/bookings/:id/cancel', (req) => {
  const path = `/api/v1/bookings/${req.params.id}/cancel`;
  const userId = requireAuth(req, path);
  const booking = findOwnedBooking(req.params.id, userId, path);

  const parsed = cancelBookingRequestSchema.safeParse(req.body);
  if (!parsed.success) {
    return fail(
      400,
      'VALIDATION_ERROR',
      'Request validation failed.',
      path,
      toValidationDetails(parsed.error.issues),
    );
  }

  assertModifiable(booking, path);

  const updated: Booking = {
    ...booking,
    status: 'CANCELLED',
    cancellationReason: parsed.data.cancellationReason,
    updatedAt: new Date().toISOString(),
  };
  upsertBooking(updated);
  return ok(updated);
});

/* ── PATCH /bookings/:id/reschedule ── */

registerMock('PATCH', '/bookings/:id/reschedule', (req) => {
  const path = `/api/v1/bookings/${req.params.id}/reschedule`;
  const userId = requireAuth(req, path);
  const booking = findOwnedBooking(req.params.id, userId, path);

  const parsed = rescheduleBookingRequestSchema.safeParse(req.body);
  if (!parsed.success) {
    return fail(
      400,
      'VALIDATION_ERROR',
      'Request validation failed.',
      path,
      toValidationDetails(parsed.error.issues),
    );
  }

  assertModifiable(booking, path);

  const slotUnavailable = () =>
    new MockError(
      fail(409, 'SLOT_UNAVAILABLE', 'That slot was just taken — please pick another.', path),
    );

  const decoded = decodeSlotId(parsed.data.timeSlotId);
  if (!decoded) throw slotUnavailable();

  const { date, startHour } = decoded;
  const offset = dayOffset(date);
  const isPast = slotStartInstant(date, startHour).getTime() <= Date.now();
  if (
    offset === null ||
    offset < 0 ||
    offset >= HORIZON_DAYS ||
    startHour < FIRST_HOUR ||
    startHour > LAST_HOUR ||
    isPast ||
    isCapacityExhausted(date, startHour) ||
    isWindowBooked(date, startHour, allBookings(), booking.id)
  ) {
    throw slotUnavailable();
  }

  const updated: Booking = {
    ...booking,
    scheduledAt: slotStartInstant(date, startHour).toISOString(),
    updatedAt: new Date().toISOString(),
  };
  upsertBooking(updated);
  return ok(updated);
});
