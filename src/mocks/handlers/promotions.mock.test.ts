import { describe, expect, it } from 'vitest';
import axios, { isAxiosError } from 'axios';
import { mockAdapter } from '../lib/mockEngine';
import './promotions.mock';
import { seedOffers } from '../data/offers.data';
import { seedTestimonials } from '../data/testimonials.data';
import { seedReferral } from '../data/referral.data';
import {
  offerSchema,
  referralSchema,
  testimonialSchema,
} from '../../features/home/types/home.schema';
import type { Offer, Referral, Testimonial } from '../../features/home/types/home';
import type { ApiFailure, ApiSuccess } from '../../types/api';

// Requests go through the real mock adapter — the exact path the app uses.
const client = axios.create({ adapter: mockAdapter });

async function expectApiError(promise: Promise<unknown>, status: number, code: string) {
  try {
    await promise;
    expect.unreachable('expected request to fail');
  } catch (error) {
    if (!isAxiosError(error)) throw error;
    expect(error.response?.status).toBe(status);
    const body = error.response?.data as ApiFailure;
    expect(body.success).toBe(false);
    expect(body.error.code).toBe(code);
  }
}

describe('seed data integrity', () => {
  it('every seed offer/testimonial and the referral satisfy the contract schema', () => {
    for (const offer of seedOffers) expect(() => offerSchema.parse(offer)).not.toThrow();
    for (const testimonial of seedTestimonials) {
      expect(() => testimonialSchema.parse(testimonial)).not.toThrow();
    }
    expect(() => referralSchema.parse(seedReferral)).not.toThrow();
  });

  it('has at least one testimonial with a null avatar (initials fallback case)', () => {
    expect(seedTestimonials.some((testimonial) => testimonial.avatarUrl === null)).toBe(true);
  });
});

describe('GET /offers', () => {
  it('returns all offers sorted by sortOrder in a single-resource envelope', async () => {
    const response = await client.get<ApiSuccess<Offer[]>>('/offers');

    expect(response.data.success).toBe(true);
    expect(response.data.error).toBeNull();
    expect(response.data.data).toHaveLength(seedOffers.length);
    const orders = response.data.data.map((offer) => offer.sortOrder);
    expect(orders).toEqual([...orders].sort((a, b) => a - b));
  });

  it('scenario=empty returns an empty list', async () => {
    const response = await client.get<ApiSuccess<Offer[]>>('/offers', {
      params: { scenario: 'empty' },
    });
    expect(response.data.data).toHaveLength(0);
  });

  it('scenario=error returns the simulated server error', async () => {
    await expectApiError(client.get('/offers', { params: { scenario: 'error' } }), 500, 'INTERNAL_ERROR');
  });
});

describe('GET /testimonials', () => {
  it('returns all testimonials in a single-resource envelope', async () => {
    const response = await client.get<ApiSuccess<Testimonial[]>>('/testimonials');

    expect(response.data.success).toBe(true);
    expect(response.data.data).toHaveLength(seedTestimonials.length);
    for (const testimonial of response.data.data) {
      expect(() => testimonialSchema.parse(testimonial)).not.toThrow();
    }
  });

  it('scenario=empty returns an empty list', async () => {
    const response = await client.get<ApiSuccess<Testimonial[]>>('/testimonials', {
      params: { scenario: 'empty' },
    });
    expect(response.data.data).toHaveLength(0);
  });

  it('scenario=error returns the simulated server error', async () => {
    await expectApiError(
      client.get('/testimonials', { params: { scenario: 'error' } }),
      500,
      'INTERNAL_ERROR',
    );
  });
});

describe('GET /referral', () => {
  it('returns the referral record in a single-resource envelope', async () => {
    const response = await client.get<ApiSuccess<Referral>>('/referral');

    expect(response.data.success).toBe(true);
    expect(response.data.data.code).toBe(seedReferral.code);
    expect(() => referralSchema.parse(response.data.data)).not.toThrow();
  });

  it('scenario=error returns the simulated server error', async () => {
    await expectApiError(
      client.get('/referral', { params: { scenario: 'error' } }),
      500,
      'INTERNAL_ERROR',
    );
  });
});
