import { apiClient } from '../../../lib/apiClient';
import type { ApiPaginated, ApiSuccess } from '../../../types/api';
import type {
  Service,
  ServiceCategory,
  ServiceFilters,
  ServicesPage,
} from '../types/catalog';

async function fetchCategories(): Promise<ServiceCategory[]> {
  const response = await apiClient.get<ApiSuccess<ServiceCategory[]>>('/categories');
  return response.data.data;
}

async function fetchServices(filters: ServiceFilters = {}): Promise<ServicesPage> {
  const response = await apiClient.get<ApiPaginated<Service>>('/services', {
    params: filters,
  });
  return { services: response.data.data, pagination: response.data.pagination };
}

async function fetchService(id: string): Promise<Service> {
  const response = await apiClient.get<ApiSuccess<Service>>(`/services/${id}`);
  return response.data.data;
}

export { fetchCategories, fetchService, fetchServices };
