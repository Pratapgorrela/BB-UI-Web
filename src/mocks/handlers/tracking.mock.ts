import { fail, MockError, ok, registerMock } from '../lib/mockEngine';
import { requireAuth } from '../lib/guards';
import { allBookings } from './booking.mock';
import { findAddressRecord } from './profile.mock';
import { addressToLine } from '../../features/profile/utils/addressToLine';
import { seedSpecialists } from '../data/specialists.data';
import { seedVans } from '../data/vans.data';
import type {
  Booking,
  GeoPoint,
  TrackingDestination,
  TrackingStatus,
  VanTracking,
} from '../../features/booking/types/booking';

/** Vans "arriving" within this many minutes of the slot (contract mapping). */
const ARRIVING_THRESHOLD_MIN = 15;
const ETA_MIN = 5;
const ETA_MAX = 45;

/** City-centre fallback when the booking address has no coordinates (Hyderabad). */
const FALLBACK_DESTINATION: GeoPoint = { latitude: 17.4326, longitude: 78.4071 };

/** Stable van pick per booking — same booking always shows the same van/driver. */
function vanForBooking(bookingId: string) {
  let hash = 0;
  for (const char of bookingId) hash = (hash + char.charCodeAt(0)) % 997;
  return seedVans[hash % seedVans.length];
}

/**
 * Deterministic status + ETA per the contract mapping: PENDING → NOT_DISPATCHED;
 * CONFIRMED → EN_ROUTE (ETA = minutes-to-slot clamped 5–45) or ARRIVING when
 * ≤ 15 min remain; IN_PROGRESS → ARRIVED.
 */
function deriveStatus(booking: Booking): { status: TrackingStatus; etaMinutes: number | null } {
  if (booking.status === 'PENDING') return { status: 'NOT_DISPATCHED', etaMinutes: null };
  if (booking.status === 'IN_PROGRESS') return { status: 'ARRIVED', etaMinutes: 0 };

  // CONFIRMED — the only other status that reaches this function.
  const minutesUntil = Math.ceil(
    (new Date(booking.scheduledAt).getTime() - Date.now()) / 60_000,
  );
  const etaMinutes = Math.min(Math.max(minutesUntil, ETA_MIN), ETA_MAX);
  return {
    status: minutesUntil <= ARRIVING_THRESHOLD_MIN ? 'ARRIVING' : 'EN_ROUTE',
    etaMinutes,
  };
}

/** Van position: a small deterministic offset from the destination, shrinking with the ETA. */
function locateVan(status: TrackingStatus, etaMinutes: number | null, destination: GeoPoint): GeoPoint | null {
  if (status === 'NOT_DISPATCHED') return null;
  if (status === 'ARRIVED') return destination;
  const eta = etaMinutes ?? ETA_MIN;
  return {
    latitude: Number((destination.latitude + 0.0006 * eta).toFixed(6)),
    longitude: Number((destination.longitude - 0.0008 * eta).toFixed(6)),
  };
}

/* ── GET /bookings/:id/tracking ── */

registerMock('GET', '/bookings/:id/tracking', (req) => {
  const path = `/api/v1/bookings/${req.params.id}/tracking`;
  if (req.query.get('scenario') === 'error') {
    return fail(500, 'INTERNAL_ERROR', 'Simulated server error. Please try again later.', path);
  }

  const userId = requireAuth(req, path);

  // Owned-or-404 — mirrors GET /bookings/:id (other users' bookings are invisible).
  const booking = allBookings().find((candidate) => candidate.id === req.params.id);
  if (!booking || booking.userId !== userId) {
    throw new MockError(fail(404, 'RESOURCE_NOT_FOUND', 'Booking not found.', path));
  }

  if (booking.status === 'COMPLETED' || booking.status === 'CANCELLED') {
    return fail(
      422,
      'BUSINESS_RULE_VIOLATION',
      'Tracking is only available for active bookings.',
      path,
    );
  }

  const specialist = seedSpecialists.find(
    (candidate) => candidate.id === booking.specialistId,
  );
  if (!specialist) {
    return fail(500, 'INTERNAL_ERROR', 'Assigned specialist record is missing.', path);
  }

  const record = findAddressRecord(booking.addressId);
  const destination: TrackingDestination = record
    ? {
        label: record.label,
        line: addressToLine(record),
        latitude: record.latitude,
        longitude: record.longitude,
      }
    : { label: 'Saved address', line: 'Address on file', latitude: null, longitude: null };

  const { status, etaMinutes } = deriveStatus(booking);
  const destinationPoint: GeoPoint =
    destination.latitude !== null && destination.longitude !== null
      ? { latitude: destination.latitude, longitude: destination.longitude }
      : FALLBACK_DESTINATION;

  const tracking: VanTracking = {
    bookingId: booking.id,
    status,
    etaMinutes,
    van: vanForBooking(booking.id),
    specialist,
    destination,
    currentLocation: locateVan(status, etaMinutes, destinationPoint),
    updatedAt: new Date().toISOString(),
  };
  return ok(tracking);
});
