export const bookingKeys = {
  all: ['booking'] as const,
  slots: (date: string) => [...bookingKeys.all, 'slots', date] as const,
  list: (filters?: Record<string, unknown>) => [...bookingKeys.all, 'list', filters] as const,
  detail: (id: string) => [...bookingKeys.all, 'detail', id] as const,
};

/** Slot availability is time-sensitive — keep it fresh. */
export const SLOTS_STALE_TIME_MS = 60 * 1000;

/** Bookings change via cancel/reschedule — short cache, invalidated on mutation. */
export const BOOKINGS_STALE_TIME_MS = 30 * 1000;
