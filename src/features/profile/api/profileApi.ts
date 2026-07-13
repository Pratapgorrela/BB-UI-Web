import { apiClient } from '../../../lib/apiClient';
import type { ApiSuccess } from '../../../types/api';
import type { User } from '../../auth/types/auth';
import type {
  Address,
  CreateAddressRequest,
  UpdateAddressRequest,
  UpdateProfileRequest,
} from '../types/address';

async function fetchProfile(): Promise<User> {
  const response = await apiClient.get<ApiSuccess<User>>('/profile');
  return response.data.data;
}

async function updateProfile(payload: UpdateProfileRequest): Promise<User> {
  const response = await apiClient.patch<ApiSuccess<User>>('/profile', payload);
  return response.data.data;
}

async function fetchAddresses(): Promise<Address[]> {
  const response = await apiClient.get<ApiSuccess<Address[]>>('/addresses');
  return response.data.data;
}

async function createAddress(payload: CreateAddressRequest): Promise<Address> {
  const response = await apiClient.post<ApiSuccess<Address>>('/addresses', payload);
  return response.data.data;
}

async function updateAddress(id: string, payload: UpdateAddressRequest): Promise<Address> {
  const response = await apiClient.patch<ApiSuccess<Address>>(`/addresses/${id}`, payload);
  return response.data.data;
}

async function deleteAddress(id: string): Promise<null> {
  const response = await apiClient.delete<ApiSuccess<null>>(`/addresses/${id}`);
  return response.data.data;
}

export { createAddress, deleteAddress, fetchAddresses, fetchProfile, updateAddress, updateProfile };
