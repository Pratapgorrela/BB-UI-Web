import axios, { AxiosHeaders, isAxiosError } from 'axios';
import type { InternalAxiosRequestConfig } from 'axios';
import { installMocks } from '../mocks';
import { useAuthStore } from '../store/useAuthStore';
import type { ApiSuccess } from '../types/api';
import type { AuthTokens } from '../features/auth/types/auth';

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === 'true';
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

if (USE_MOCKS) {
  installMocks(apiClient);
}

/* ── Auth header injection ── */

apiClient.interceptors.request.use((config) => {
  const { accessToken } = useAuthStore.getState();
  if (accessToken && !config.headers.has('Authorization')) {
    config.headers.set('Authorization', `Bearer ${accessToken}`);
  }
  return config;
});

/* ── 401 → single-flight refresh → retry ── */

type RetriableConfig = InternalAxiosRequestConfig & { _retry?: boolean };

const AUTH_PATHS = ['/auth/login', '/auth/register', '/auth/refresh'];

let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  const { refreshToken, setTokens, clearSession } = useAuthStore.getState();
  if (!refreshToken) return null;
  try {
    const response = await apiClient.post<ApiSuccess<AuthTokens>>('/auth/refresh', {
      refreshToken,
    });
    const tokens = response.data.data;
    setTokens(tokens);
    console.log('[apiClient] Access token refreshed');
    return tokens.accessToken;
  } catch (error) {
    console.error(
      '[apiClient] Token refresh failed — clearing session:',
      error instanceof Error ? error.message : error,
    );
    clearSession();
    return null;
  }
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (!isAxiosError(error)) {
      return Promise.reject(error instanceof Error ? error : new Error(String(error)));
    }

    const config = error.config as RetriableConfig | undefined;
    const status = error.response?.status;
    const url = config?.url ?? '';
    const isAuthPath = AUTH_PATHS.some((path) => url.includes(path));

    if (status === 401 && config && !config._retry && !isAuthPath) {
      config._retry = true;
      refreshPromise ??= refreshAccessToken().finally(() => {
        refreshPromise = null;
      });
      const newToken = await refreshPromise;
      if (newToken) {
        config.headers = AxiosHeaders.from(config.headers);
        config.headers.set('Authorization', `Bearer ${newToken}`);
        return apiClient.request(config);
      }
    }

    return Promise.reject(error);
  },
);

export { USE_MOCKS };
