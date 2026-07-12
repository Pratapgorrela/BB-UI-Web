import { fail, MockError, ok, registerMock } from '../lib/mockEngine';
import type { MockRequest } from '../lib/mockEngine';
import { seedUsers } from '../data/users.data';
import type { MockUserRecord } from '../data/users.data';
import {
  loginRequestSchema,
  registerRequestSchema,
} from '../../features/auth/types/auth.schema';
import type { AuthTokens, User } from '../../features/auth/types/auth';
import type { ApiErrorDetail } from '../../types/api';

const ACCESS_TOKEN_TTL_MS = 15 * 60 * 1000;
const REGISTERED_USERS_KEY = 'bb-mock-users';
const SESSIONS_KEY = 'bb-mock-sessions';

/* ── Persistence (survives page reloads so sessions stay valid) ── */

function readStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeStorage(key: string, value: unknown): void {
  localStorage.setItem(key, JSON.stringify(value));
}

const users: MockUserRecord[] = [
  ...seedUsers,
  ...readStorage<MockUserRecord[]>(REGISTERED_USERS_KEY, []),
];

function persistRegisteredUsers(): void {
  writeStorage(REGISTERED_USERS_KEY, users.slice(seedUsers.length));
}

/** refreshToken → userId */
type SessionMap = Record<string, string>;

function issueTokens(userId: string): AuthTokens {
  const accessToken = `mock-access.${userId}.${Date.now() + ACCESS_TOKEN_TTL_MS}`;
  const refreshToken = `mock-refresh.${crypto.randomUUID()}`;
  const sessions = readStorage<SessionMap>(SESSIONS_KEY, {});
  sessions[refreshToken] = userId;
  writeStorage(SESSIONS_KEY, sessions);
  return { accessToken, refreshToken };
}

function requireAuth(req: MockRequest, path: string): User {
  const token = req.authorization?.replace(/^Bearer\s+/i, '');
  if (!token) {
    throw new MockError(fail(401, 'UNAUTHORIZED', 'Missing authentication token.', path));
  }
  const [prefix, userId, expiresAt] = token.split('.');
  if (prefix !== 'mock-access' || !userId || Number(expiresAt) < Date.now()) {
    throw new MockError(
      fail(401, 'UNAUTHORIZED', 'Your session has expired. Please log in again.', path),
    );
  }
  const record = users.find((candidate) => candidate.user.id === userId);
  if (!record) {
    throw new MockError(fail(401, 'UNAUTHORIZED', 'Invalid authentication token.', path));
  }
  return record.user;
}

function toValidationDetails(issues: { path: PropertyKey[]; message: string }[]): ApiErrorDetail[] {
  return issues.map((issue) => ({ field: issue.path.join('.'), message: issue.message }));
}

/* ── POST /auth/register ── */

registerMock('POST', '/auth/register', (req) => {
  const path = '/api/v1/auth/register';
  const parsed = registerRequestSchema.safeParse(req.body);
  if (!parsed.success) {
    return fail(400, 'VALIDATION_ERROR', 'Request validation failed.', path, toValidationDetails(parsed.error.issues));
  }
  const { password, firstName, lastName, phone } = parsed.data;
  const email = parsed.data.email.toLowerCase();

  if (email === 'error@test.com') {
    return fail(500, 'INTERNAL_ERROR', 'Simulated server error. Please try again later.', path);
  }
  if (users.some((record) => record.user.email === email)) {
    return fail(409, 'CONFLICT', 'Email is already registered.', path, [
      { field: 'email', message: 'Email is already registered.' },
    ]);
  }

  const now = new Date().toISOString();
  const user: User = {
    id: crypto.randomUUID(),
    email,
    firstName,
    lastName,
    phone,
    avatarUrl: null,
    role: 'CUSTOMER',
    createdAt: now,
    updatedAt: now,
  };
  users.push({ user, password });
  persistRegisteredUsers();

  return ok({ ...issueTokens(user.id), user }, 201);
});

/* ── POST /auth/login ── */

registerMock('POST', '/auth/login', (req) => {
  const path = '/api/v1/auth/login';
  const parsed = loginRequestSchema.safeParse(req.body);
  if (!parsed.success) {
    return fail(400, 'VALIDATION_ERROR', 'Request validation failed.', path, toValidationDetails(parsed.error.issues));
  }
  const email = parsed.data.email.toLowerCase();
  const record = users.find((candidate) => candidate.user.email === email);
  if (!record || record.password !== parsed.data.password) {
    return fail(401, 'UNAUTHORIZED', 'Invalid email or password.', path);
  }
  return ok({ ...issueTokens(record.user.id), user: record.user });
});

/* ── POST /auth/refresh ── */

registerMock('POST', '/auth/refresh', (req) => {
  const path = '/api/v1/auth/refresh';
  const body = req.body as { refreshToken?: string } | null;
  const refreshToken = body?.refreshToken;
  const sessions = readStorage<SessionMap>(SESSIONS_KEY, {});
  const userId = refreshToken ? sessions[refreshToken] : undefined;
  if (!refreshToken || !userId) {
    return fail(401, 'UNAUTHORIZED', 'Invalid or expired refresh token.', path);
  }
  // Rotation: the used refresh token is invalidated before a new pair is issued.
  delete sessions[refreshToken];
  writeStorage(SESSIONS_KEY, sessions);
  return ok(issueTokens(userId));
});

/* ── POST /auth/logout ── */

registerMock('POST', '/auth/logout', (req) => {
  const path = '/api/v1/auth/logout';
  const user = requireAuth(req, path);
  const sessions = readStorage<SessionMap>(SESSIONS_KEY, {});
  const remaining: SessionMap = {};
  for (const [token, userId] of Object.entries(sessions)) {
    if (userId !== user.id) remaining[token] = userId;
  }
  writeStorage(SESSIONS_KEY, remaining);
  return ok(null);
});

/* ── GET /auth/me ── */

registerMock('GET', '/auth/me', (req) => {
  const path = '/api/v1/auth/me';
  const user = requireAuth(req, path);
  return ok(user);
});
