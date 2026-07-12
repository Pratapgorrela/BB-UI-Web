import { isAxiosError } from 'axios';
import type { ApiErrorPayload, ApiFailure } from '../types/api';

function getApiError(error: unknown): ApiErrorPayload | null {
  if (isAxiosError(error)) {
    const data = error.response?.data as ApiFailure | undefined;
    if (data && data.success === false && data.error) {
      return data.error;
    }
  }
  return null;
}

function getApiErrorMessage(
  error: unknown,
  fallback = 'Something went wrong. Please try again.',
): string {
  return getApiError(error)?.message ?? fallback;
}

export { getApiError, getApiErrorMessage };
