import { fail, MockError, ok, registerMock } from '../lib/mockEngine';
import { requireAuth } from '../lib/guards';
import { seedServices } from '../data/services.data';
import { seedSpecialists } from '../data/specialists.data';
import { makeReferenceCode, priceCart, toValidationDetails } from './cart.mock';
import {
  createBookingRequestSchema,
  timeSlotsQuerySchema,
} from '../../features/booking/types/booking.schema';
import type { Booking, TimeSlot } from '../../features/booking/types/booking';
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

function isWindowBooked(date: string, startHour: number, bookings: Booking[]): boolean {
  const startMs = slotStartInstant(date, startHour).getTime();
  return bookings.some(
    (booking) =>
      booking.status !== 'CANCELLED' && new Date(booking.scheduledAt).getTime() === startMs,
  );
}

function slotsForDate(date: string): TimeSlot[] {
  const offset = dayOffset(date);
  if (offset === null || offset < 0 || offset >= HORIZON_DAYS) return [];

  const bookings = readBookings();
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
  const bookings = readBookings();
  const isPast = slotStartInstant(date, startHour).getTime() <= Date.now();
  if (
    offset === null ||
    offset < 0 ||
    offset >= HORIZON_DAYS ||
    startHour < FIRST_HOUR ||
    startHour > LAST_HOUR ||
    isPast ||
    isCapacityExhausted(date, startHour) ||
    isWindowBooked(date, startHour, bookings)
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

  writeBookings([...bookings, booking]);
  return ok(booking, 201);
});
