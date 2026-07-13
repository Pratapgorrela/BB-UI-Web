import { AxiosError, AxiosHeaders } from 'axios';
import type { AxiosAdapter, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import type { ApiErrorCode, ApiErrorDetail, Pagination } from '../../types/api';

interface MockRequest {
  method: string;
  path: string;
  params: Record<string, string>;
  query: URLSearchParams;
  body: unknown;
  authorization: string | null;
}

interface MockResult {
  status: number;
  body: unknown;
}

type MockHandlerFn = (req: MockRequest) => MockResult | Promise<MockResult>;

/** Thrown by handler helpers (e.g. auth guards) to short-circuit with an error result. */
class MockError extends Error {
  readonly result: MockResult;

  constructor(result: MockResult) {
    super('MockError');
    this.name = 'MockError';
    this.result = result;
  }
}

interface MockRoute {
  method: string;
  segments: string[];
  handler: MockHandlerFn;
}

const routes: MockRoute[] = [];

function registerMock(method: string, pattern: string, handler: MockHandlerFn): void {
  routes.push({
    method: method.toUpperCase(),
    segments: pattern.split('/').filter(Boolean),
    handler,
  });
}

function matchRoute(
  method: string,
  path: string,
): { handler: MockHandlerFn; params: Record<string, string> } | null {
  const pathSegments = path.split('/').filter(Boolean);
  for (const route of routes) {
    if (route.method !== method || route.segments.length !== pathSegments.length) continue;
    const params: Record<string, string> = {};
    const matched = route.segments.every((segment, index) => {
      if (segment.startsWith(':')) {
        params[segment.slice(1)] = decodeURIComponent(pathSegments[index]);
        return true;
      }
      return segment === pathSegments[index];
    });
    if (matched) return { handler: route.handler, params };
  }
  return null;
}

function ok<T>(data: T, status = 200): MockResult {
  return { status, body: { success: true, data, error: null } };
}

/** Paginated-list envelope. `page`/`limit` are the already-validated request values. */
function paginated<T>(items: T[], page: number, limit: number): MockResult {
  const totalItems = items.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / limit));
  const pagination: Pagination = {
    page,
    limit,
    totalItems,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  };
  const start = (page - 1) * limit;
  return {
    status: 200,
    body: { success: true, data: items.slice(start, start + limit), pagination, error: null },
  };
}

function fail(
  status: number,
  code: ApiErrorCode,
  message: string,
  path: string,
  details: ApiErrorDetail[] = [],
): MockResult {
  return {
    status,
    body: {
      success: false,
      data: null,
      error: { code, message, timestamp: new Date().toISOString(), path, details },
    },
  };
}

/** Contract requirement: 300-600ms simulated latency on every mock response. */
function simulateLatency(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 300 + Math.random() * 300));
}

function parseBody(data: unknown): unknown {
  if (typeof data !== 'string' || data === '') return data ?? null;
  try {
    return JSON.parse(data);
  } catch {
    return data;
  }
}

const mockAdapter: AxiosAdapter = async (
  config: InternalAxiosRequestConfig,
): Promise<AxiosResponse> => {
  await simulateLatency();

  const method = (config.method ?? 'get').toUpperCase();
  const [rawPath = '', rawQuery = ''] = (config.url ?? '').split('?');
  const path = `/${rawPath.split('/').filter(Boolean).join('/')}`;
  const fullPath = `/api/v1${path}`;
  const headers = AxiosHeaders.from(config.headers);
  const match = matchRoute(method, path);

  // Axios hands `config.params` to the adapter unserialized — merge it with any
  // query string already present in the URL so handlers see both.
  const query = new URLSearchParams(rawQuery);
  if (config.params && typeof config.params === 'object') {
    for (const [key, value] of Object.entries(config.params as Record<string, unknown>)) {
      if (value !== undefined && value !== null) query.set(key, String(value));
    }
  }

  let result: MockResult;
  if (!match) {
    result = fail(404, 'RESOURCE_NOT_FOUND', `No mock handler for ${method} ${path}.`, fullPath);
  } else {
    const request: MockRequest = {
      method,
      path,
      params: match.params,
      query,
      body: parseBody(config.data),
      authorization: (headers.get('Authorization') as string | null) ?? null,
    };
    try {
      result = await match.handler(request);
    } catch (error) {
      result =
        error instanceof MockError
          ? error.result
          : fail(500, 'INTERNAL_ERROR', 'Unexpected error in mock handler.', fullPath);
      if (!(error instanceof MockError)) {
        console.error('[MockAPI] Handler crashed:', error);
      }
    }
  }

  console.log(`[MockAPI] ${method} ${path} → ${result.status}`);

  const response: AxiosResponse = {
    data: result.body,
    status: result.status,
    statusText: result.status >= 400 ? 'Error' : 'OK',
    headers: {},
    config,
  };

  // Custom adapters bypass axios' settle/validateStatus — reject non-2xx manually.
  if (result.status >= 400) {
    const errorBody = result.body as { error?: { message?: string } };
    throw new AxiosError(
      errorBody.error?.message ?? `Request failed with status ${result.status}`,
      String(result.status),
      config,
      undefined,
      response,
    );
  }

  return response;
};

export { fail, MockError, mockAdapter, ok, paginated, registerMock };
export type { MockHandlerFn, MockRequest, MockResult };
