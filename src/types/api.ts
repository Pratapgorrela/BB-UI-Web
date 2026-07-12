type ApiErrorCode =
  | 'RESOURCE_NOT_FOUND'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'VALIDATION_ERROR'
  | 'SLOT_UNAVAILABLE'
  | 'BUSINESS_RULE_VIOLATION'
  | 'CONFLICT'
  | 'INTERNAL_ERROR';

interface ApiErrorDetail {
  field: string;
  message: string;
}

interface ApiErrorPayload {
  code: ApiErrorCode;
  message: string;
  timestamp: string;
  path: string;
  details: ApiErrorDetail[];
}

interface Pagination {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface ApiSuccess<T> {
  success: true;
  data: T;
  error: null;
}

interface ApiPaginated<T> {
  success: true;
  data: T[];
  pagination: Pagination;
  error: null;
}

interface ApiFailure {
  success: false;
  data: null;
  error: ApiErrorPayload;
}

export type {
  ApiErrorCode,
  ApiErrorDetail,
  ApiErrorPayload,
  ApiFailure,
  ApiPaginated,
  ApiSuccess,
  Pagination,
};
