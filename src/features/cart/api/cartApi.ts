import { apiClient } from '../../../lib/apiClient';
import type { ApiSuccess } from '../../../types/api';
import type {
  CheckoutSummaryRequest,
  Coupon,
  Order,
  PaymentSummary,
  PlaceOrderRequest,
} from '../types/cart';

async function fetchCoupons(): Promise<Coupon[]> {
  const response = await apiClient.get<ApiSuccess<Coupon[]>>('/coupons');
  return response.data.data;
}

async function fetchCheckoutSummary(request: CheckoutSummaryRequest): Promise<PaymentSummary> {
  const response = await apiClient.post<ApiSuccess<PaymentSummary>>('/checkout/summary', request);
  return response.data.data;
}

async function placeOrder(request: PlaceOrderRequest): Promise<Order> {
  const response = await apiClient.post<ApiSuccess<Order>>('/orders', request);
  return response.data.data;
}

export { fetchCheckoutSummary, fetchCoupons, placeOrder };
