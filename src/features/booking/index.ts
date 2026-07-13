export type {
  Booking,
  BookingStatus,
  CreateBookingRequest,
  Specialist,
  TimeSlot,
} from './types/booking';

export {
  bookingSchema,
  bookingStatusSchema,
  createBookingRequestSchema,
  isoDateSchema,
  specialistSchema,
  timeSlotSchema,
  timeSlotsQuerySchema,
} from './types/booking.schema';

export { createBooking, fetchTimeSlots } from './api/bookingApi';

export { bookingKeys, SLOTS_STALE_TIME_MS } from './hooks/keys';
export { useFetchTimeSlots } from './hooks/useFetchTimeSlots';
export { useCreateBooking } from './hooks/useCreateBooking';
