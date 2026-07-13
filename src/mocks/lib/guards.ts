import { fail, MockError } from './mockEngine';
import type { MockRequest } from './mockEngine';

/**
 * Access-token guard shared by auth-required handlers. Parses the mock token
 * format `mock-access.{userId}.{expiresMs}` issued by auth.mock and returns
 * the userId; throws a 401 `MockError` when missing, malformed, or expired.
 */
function requireAuth(req: MockRequest, path: string): string {
  const token = req.authorization?.replace(/^Bearer\s+/i, '');
  const [prefix, userId, expiresAt] = (token ?? '').split('.');
  if (prefix !== 'mock-access' || !userId || Number(expiresAt) < Date.now()) {
    throw new MockError(fail(401, 'UNAUTHORIZED', 'Please log in to continue.', path));
  }
  return userId;
}

export { requireAuth };
