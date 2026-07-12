import { apiClient } from '../../../lib/apiClient';
import type { ApiSuccess } from '../../../types/api';
import type {
  AuthSession,
  AuthTokens,
  LoginRequest,
  RefreshRequest,
  RegisterRequest,
  User,
} from '../types/auth';

async function registerUser(payload: RegisterRequest): Promise<AuthSession> {
  const response = await apiClient.post<ApiSuccess<AuthSession>>('/auth/register', payload);
  return response.data.data;
}

async function loginUser(payload: LoginRequest): Promise<AuthSession> {
  const response = await apiClient.post<ApiSuccess<AuthSession>>('/auth/login', payload);
  return response.data.data;
}

async function refreshTokens(payload: RefreshRequest): Promise<AuthTokens> {
  const response = await apiClient.post<ApiSuccess<AuthTokens>>('/auth/refresh', payload);
  return response.data.data;
}

async function logoutUser(): Promise<null> {
  const response = await apiClient.post<ApiSuccess<null>>('/auth/logout');
  return response.data.data;
}

async function fetchCurrentUser(): Promise<User> {
  const response = await apiClient.get<ApiSuccess<User>>('/auth/me');
  return response.data.data;
}

export { fetchCurrentUser, loginUser, logoutUser, refreshTokens, registerUser };
