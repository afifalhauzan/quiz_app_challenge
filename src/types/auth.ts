import type { ReactNode } from 'react';

// ================== USER & AUTH TYPES ==================

export interface User {
  id: number;
  username: string;
  name: string;
  email: string;
}

export interface UserWithSession extends User {
  loginAt: string;
  sessionId: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

// ================== AUTH STATE TYPES ==================

export interface AuthState {
  user: UserWithSession | null;
  loading: boolean;
}

export interface AuthContextValue extends AuthState {
  login: (credentials: LoginCredentials) => Promise<UserWithSession>;
  logout: () => Promise<void>;
}

// ================== AUTH SERVICE TYPES ==================

export interface AuthServiceResponse {
  message: string;
}

export interface MockUser extends User {
  password: string; // Only used internally in mock service
}

// ================== COMPONENT PROP TYPES ==================

export interface PageProps {
  children: ReactNode;
}

export interface LayoutProps {
  children: ReactNode;
}

// ================== API RESPONSE TYPES ==================

export interface ApiError {
  message: string;
  code?: string | number;
}

export interface ApiResponse<T = any> {
  data: T;
  success: boolean;
  error?: ApiError;
}

// ================== FORM TYPES ==================

export interface LoginFormData {
  username: string;
  password: string;
  rememberMe?: boolean;
}

// ================== UTILITY TYPES ==================

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface AsyncState<T = any> {
  data: T | null;
  loading: boolean;
  error: string | null;
}