import { seedServices } from './services.data';
import { seedSpecialists } from './specialists.data';
import { priceCart } from '../handlers/cart.mock';
import type { Booking, BookingStatus } from '../../features/booking/types/booking';
import type { CartItem, CartLineInput } from '../../features/cart/types/cart';

/**
 * Read-only seed bookings so the My Bookings tabs are never empty on first
 * login. Merged with the localStorage write store (`bb-mock-bookings`) at read
 * time by booking.mock — localStorage wins by id, so cancelling/rescheduling a
 * seed upserts the mutated copy there and this module is never mutated.
 *
 * Dates are computed relative to "now" at module load so every tab stays
 * populated regardless of when the app runs. Pricing goes through `priceCart`
 * so seed payment summaries are byte-identical to /checkout/summary output.
 */

const PRIYA_USER_ID = '3f1c2a9e-8b4d-4c6a-9e2f-1a5b7c3d9e0f';
const RAHUL_USER_ID = '7d4e5f2b-1c8a-4b3d-8f6e-2c9a0b1d4e7f';
const HOME_ADDRESS_ID = 'a1e7c9d2-4b6f-4a1e-9c3d-7f2b8e5a1c40';
const OFFICE_ADDRESS_ID = 'b2f8d0e3-5c7a-4b2f-8d4e-9a3c7f6b2d51';

function seedBookingId(n: number): string {
  return `bb8f0000-0000-4000-8000-${String(n).padStart(12, '0')}`;
}

/** Local instant `dayOffset` days from today at `hour`:00 (matches slot windows). */
function at(dayOffset: number, hour: number): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate() + dayOffset, hour, 0, 0, 0);
}

function minutesFromNow(minutes: number): Date {
  return new Date(Date.now() + minutes * 60 * 1000);
}

function makeItems(lines: CartLineInput[]): CartItem[] {
  return lines.map((line) => {
    const service = seedServices.find((candidate) => candidate.id === line.serviceId);
    if (!service) throw new Error(`Seed booking references unknown service ${line.serviceId}`);
    return {
      serviceId: service.id,
      service,
      quantity: line.quantity,
      selected: true,
      lineTotal: { amount: service.price.amount * line.quantity, currency: service.price.currency },
    };
  });
}

function sid(n: number): string {
  return `bb5e0000-0000-4000-8000-${String(n).padStart(12, '0')}`;
}

interface SeedBookingInput {
  n: number;
  userId: string;
  status: BookingStatus;
  scheduledAt: Date;
  lines: CartLineInput[];
  couponCode?: string;
  addressId?: string;
  specialistIndex?: number;
  referenceSuffix: string;
  cancellationReason?: string;
  /** Days before scheduledAt the booking was created. */
  createdDaysBefore?: number;
}

function makeSeedBooking(input: SeedBookingInput): Booking {
  const items = makeItems(input.lines);
  const scheduledMs = input.scheduledAt.getTime();
  const createdAt = new Date(scheduledMs - (input.createdDaysBefore ?? 2) * 24 * 60 * 60 * 1000);
  const scheduled = input.scheduledAt;
  const stamp = `${scheduled.getUTCFullYear()}${String(scheduled.getUTCMonth() + 1).padStart(2, '0')}${String(
    scheduled.getUTCDate(),
  ).padStart(2, '0')}`;
  return {
    id: seedBookingId(input.n),
    userId: input.userId,
    referenceCode: `BB-${stamp}-${input.referenceSuffix}`,
    items,
    paymentSummary: priceCart(input.lines, input.couponCode ?? null, '/api/v1/bookings'),
    addressId: input.addressId ?? HOME_ADDRESS_ID,
    specialistId: seedSpecialists[(input.specialistIndex ?? 0) % seedSpecialists.length].id,
    status: input.status,
    scheduledAt: input.scheduledAt.toISOString(),
    duration: items.reduce((total, item) => total + item.service.duration * item.quantity, 0),
    notes: null,
    cancellationReason: input.cancellationReason ?? null,
    createdAt: createdAt.toISOString(),
    updatedAt: createdAt.toISOString(),
  };
}

const seedBookings: Booking[] = [
  // Priya — PENDING, comfortably outside the 2h window: demo cancel/reschedule.
  makeSeedBooking({
    n: 1,
    userId: PRIYA_USER_ID,
    status: 'PENDING',
    scheduledAt: at(2, 10),
    lines: [{ serviceId: sid(1), quantity: 1 }],
    specialistIndex: 0,
    referenceSuffix: 'SD01',
  }),
  // Priya — CONFIRMED inside the 2h lock: buttons disabled client-side, 422 server-side.
  makeSeedBooking({
    n: 2,
    userId: PRIYA_USER_ID,
    status: 'CONFIRMED',
    scheduledAt: minutesFromNow(90),
    lines: [
      { serviceId: sid(5), quantity: 1 },
      { serviceId: sid(8), quantity: 1 },
    ],
    addressId: OFFICE_ADDRESS_ID,
    specialistIndex: 1,
    referenceSuffix: 'SD02',
  }),
  // Priya — IN_PROGRESS (started an hour ago): Track Van + Rebook only.
  makeSeedBooking({
    n: 3,
    userId: PRIYA_USER_ID,
    status: 'IN_PROGRESS',
    scheduledAt: minutesFromNow(-60),
    lines: [{ serviceId: sid(3), quantity: 1 }],
    specialistIndex: 2,
    referenceSuffix: 'SD03',
  }),
  // Priya — COMPLETED, plain pricing.
  makeSeedBooking({
    n: 4,
    userId: PRIYA_USER_ID,
    status: 'COMPLETED',
    scheduledAt: at(-3, 14),
    lines: [{ serviceId: sid(5), quantity: 2 }],
    specialistIndex: 3,
    referenceSuffix: 'SD04',
  }),
  // Priya — COMPLETED with a coupon: exercises the discount row on Payment Summary.
  makeSeedBooking({
    n: 5,
    userId: PRIYA_USER_ID,
    status: 'COMPLETED',
    scheduledAt: at(-10, 11),
    lines: [
      { serviceId: sid(2), quantity: 1 },
      { serviceId: sid(9), quantity: 1 },
    ],
    couponCode: 'FLAT100',
    addressId: OFFICE_ADDRESS_ID,
    specialistIndex: 1,
    referenceSuffix: 'SD05',
    createdDaysBefore: 4,
  }),
  // Priya — CANCELLED with a stored reason.
  makeSeedBooking({
    n: 6,
    userId: PRIYA_USER_ID,
    status: 'CANCELLED',
    scheduledAt: at(-1, 12),
    lines: [{ serviceId: sid(4), quantity: 1 }],
    specialistIndex: 2,
    referenceSuffix: 'SD06',
    cancellationReason: 'Travelling out of town that week.',
  }),
  // Rahul — proves per-user scoping: must never appear in Priya's list.
  makeSeedBooking({
    n: 7,
    userId: RAHUL_USER_ID,
    status: 'PENDING',
    scheduledAt: at(3, 15),
    lines: [{ serviceId: sid(6), quantity: 1 }],
    specialistIndex: 3,
    referenceSuffix: 'SD07',
  }),
];

export { seedBookings };
