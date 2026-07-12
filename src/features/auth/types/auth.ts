type UserRole = 'CUSTOMER';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  avatarUrl: string | null;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

interface AuthSession extends AuthTokens {
  user: User;
}

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
}

interface RefreshRequest {
  refreshToken: string;
}

export type {
  AuthSession,
  AuthTokens,
  LoginRequest,
  RefreshRequest,
  RegisterRequest,
  User,
  UserRole,
};
