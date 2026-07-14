import { apiClient } from '../../../lib/apiClient';
import type { ApiPaginated, ApiSuccess } from '../../../types/api';
import type {
  CreateSupportRequestRequest,
  Faq,
  SupportRequest,
  SupportRequestListFilters,
  SupportRequestsPage,
} from '../types/support';

async function fetchFaqs(): Promise<Faq[]> {
  const response = await apiClient.get<ApiSuccess<Faq[]>>('/faqs');
  return response.data.data;
}

async function fetchSupportRequests(
  filters: SupportRequestListFilters = {},
): Promise<SupportRequestsPage> {
  const params: Record<string, string | number> = {
    page: filters.page ?? 1,
    limit: filters.limit ?? 20,
  };
  const response = await apiClient.get<ApiPaginated<SupportRequest>>('/support-requests', {
    params,
  });
  return { requests: response.data.data, pagination: response.data.pagination };
}

async function createSupportRequest(
  payload: CreateSupportRequestRequest,
): Promise<SupportRequest> {
  const response = await apiClient.post<ApiSuccess<SupportRequest>>('/support-requests', payload);
  return response.data.data;
}

export { createSupportRequest, fetchFaqs, fetchSupportRequests };
