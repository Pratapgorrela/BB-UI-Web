import { fail, ok, registerMock } from '../lib/mockEngine';
import type { MockRequest, MockResult } from '../lib/mockEngine';
import { seedOffers } from '../data/offers.data';
import { seedTestimonials } from '../data/testimonials.data';
import { seedReferral } from '../data/referral.data';

/**
 * `?scenario=error` → 500 (exercise the error data-state);
 * `?scenario=empty` → empty list (exercise the empty data-state).
 * Mirrors the FORCE_500 convention in catalog.mock.ts.
 */
function scenarioResult<T>(req: MockRequest, path: string, items: T[]): MockResult {
  const scenario = req.query.get('scenario');
  if (scenario === 'error') {
    return fail(500, 'INTERNAL_ERROR', 'Simulated server error. Please try again later.', path);
  }
  if (scenario === 'empty') {
    return ok([]);
  }
  return ok(items);
}

/* ── GET /offers ── */

const offers = [...seedOffers].sort((a, b) => a.sortOrder - b.sortOrder);

registerMock('GET', '/offers', (req) => scenarioResult(req, '/api/v1/offers', offers));

/* ── GET /testimonials ── */

registerMock('GET', '/testimonials', (req) =>
  scenarioResult(req, '/api/v1/testimonials', seedTestimonials),
);

/* ── GET /referral ── */

registerMock('GET', '/referral', (req) => {
  const scenario = req.query.get('scenario');
  if (scenario === 'error') {
    return fail(
      500,
      'INTERNAL_ERROR',
      'Simulated server error. Please try again later.',
      '/api/v1/referral',
    );
  }
  return ok(seedReferral);
});
