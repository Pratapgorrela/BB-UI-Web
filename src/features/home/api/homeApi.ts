import { apiClient } from '../../../lib/apiClient';
import type { ApiSuccess } from '../../../types/api';
import { offerSchema, referralSchema, testimonialSchema } from '../types/home.schema';
import type { Offer, Referral, Testimonial } from '../types/home';

async function fetchOffers(): Promise<Offer[]> {
  const response = await apiClient.get<ApiSuccess<Offer[]>>('/offers');
  return offerSchema.array().parse(response.data.data);
}

async function fetchTestimonials(): Promise<Testimonial[]> {
  const response = await apiClient.get<ApiSuccess<Testimonial[]>>('/testimonials');
  return testimonialSchema.array().parse(response.data.data);
}

async function fetchReferral(): Promise<Referral> {
  const response = await apiClient.get<ApiSuccess<Referral>>('/referral');
  return referralSchema.parse(response.data.data);
}

export { fetchOffers, fetchReferral, fetchTestimonials };
