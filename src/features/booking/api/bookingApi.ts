import { apiClient } from '../../../lib/apiClient';
import type { ApiSuccess } from '../../../types/api';
import type { Booking, CreateBookingRequest, TimeSlot } from '../types/booking';

async function fetchTimeSlots(date: string): Promise<TimeSlot[]> {
  const response = await apiClient.get<ApiSuccess<TimeSlot[]>>('/time-slots', {
    params: { date },
  });
  return response.data.data;
}

async function createBooking(request: CreateBookingRequest): Promise<Booking> {
  const response = await apiClient.post<ApiSuccess<Booking>>('/bookings', request);
  return response.data.data;
}

export { createBooking, fetchTimeSlots };
