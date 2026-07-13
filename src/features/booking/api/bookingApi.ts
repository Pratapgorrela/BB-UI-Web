import { apiClient } from '../../../lib/apiClient';
import type { ApiPaginated, ApiSuccess } from '../../../types/api';
import type {
  Booking,
  BookingDetail,
  BookingListFilters,
  BookingsPage,
  CancelBookingRequest,
  CreateBookingRequest,
  RescheduleBookingRequest,
  TimeSlot,
} from '../types/booking';

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

async function fetchBookings(filters: BookingListFilters = {}): Promise<BookingsPage> {
  const response = await apiClient.get<ApiPaginated<Booking>>('/bookings', {
    params: {
      status: filters.status?.join(','),
      page: filters.page,
      limit: filters.limit,
    },
  });
  return { bookings: response.data.data, pagination: response.data.pagination };
}

async function fetchBooking(id: string): Promise<BookingDetail> {
  const response = await apiClient.get<ApiSuccess<BookingDetail>>(`/bookings/${id}`);
  return response.data.data;
}

async function cancelBooking(id: string, request: CancelBookingRequest): Promise<Booking> {
  const response = await apiClient.patch<ApiSuccess<Booking>>(`/bookings/${id}/cancel`, request);
  return response.data.data;
}

async function rescheduleBooking(
  id: string,
  request: RescheduleBookingRequest,
): Promise<Booking> {
  const response = await apiClient.patch<ApiSuccess<Booking>>(
    `/bookings/${id}/reschedule`,
    request,
  );
  return response.data.data;
}

export {
  cancelBooking,
  createBooking,
  fetchBooking,
  fetchBookings,
  fetchTimeSlots,
  rescheduleBooking,
};
