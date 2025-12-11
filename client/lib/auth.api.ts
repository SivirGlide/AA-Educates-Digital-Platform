/**
 * Authentication API: Login, Logout, Register
 */

import { API_BASE_URL, ApiResponse, setTokens, clearAuth, fetchApiPublic } from './api';

// Login request payload
export interface LoginRequest {
  email: string;
  password: string;
}

// Register request payload
export interface RegisterRequest {
  email: string;
  password: string;
  username?: string;
  first_name?: string;
  last_name?: string;
  role?: string;
}

// Auth response with tokens and user info
export interface AuthResponse {
  access: string;
  refresh: string;
  user: {
    id: number;
    email: string;
    username: string;
    first_name: string;
    last_name: string;
    role?: string;
    profile_id?: number;
  };
}

/**
 * Login with email and password
 * Stores tokens in localStorage on success
 */
export async function login(
  email: string,
  password: string
): Promise<ApiResponse<AuthResponse>> {
  try {
    const response = await fetchApiPublic<AuthResponse>('/users/auth/login/', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    // Store tokens and user info on successful login
    if (response.data) {
      setTokens(response.data.access, response.data.refresh);
      // Store user info in localStorage
      if (typeof window !== 'undefined') {
        const { user } = response.data;
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('userId', String(user.id ?? ''));
        localStorage.setItem('userRole', user.role ?? '');
        if (user.profile_id) {
          localStorage.setItem('profileId', String(user.profile_id));
        }
      }
    }

    return response;
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Login failed' };
  }
}

/**
 * Register a new user account
 * Stores tokens in localStorage on success
 */
export async function register(
  data: RegisterRequest
): Promise<ApiResponse<AuthResponse>> {
  try {
    const response = await fetchApiPublic<AuthResponse>('/users/auth/register/', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    // Store tokens and user info on successful registration
    if (response.data) {
      setTokens(response.data.access, response.data.refresh);
      // Store user info in localStorage
      if (typeof window !== 'undefined') {
        const { user } = response.data;
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('userId', String(user.id ?? ''));
        localStorage.setItem('userRole', user.role ?? '');
        if (user.profile_id) {
          localStorage.setItem('profileId', String(user.profile_id));
        }
      }
    }

    return response;
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Registration failed' };
  }
}

/**
 * Logout: Clear tokens and redirect to login
 */
export function logout(): void {
  clearAuth();
  if (typeof window !== 'undefined') {
    window.location.href = '/login';
  }
}

/**
 * Refresh access token using refresh token
 */
export async function refreshAccessToken(): Promise<ApiResponse<{ access: string }>> {
  const refreshToken = typeof window !== 'undefined' 
    ? localStorage.getItem('refresh_token') 
    : null;

  if (!refreshToken) {
    return { error: 'No refresh token available' };
  }

  try {
    const response = await fetchApiPublic<{ access: string }>('/users/auth/refresh/', {
      method: 'POST',
      body: JSON.stringify({ refresh: refreshToken }),
    });

    // Update access token on success
    if (response.data && typeof window !== 'undefined') {
      localStorage.setItem('access_token', response.data.access);
    }

    return response;
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Token refresh failed' };
  }
}

/**
 * Verify if current token is valid
 */
export async function verifyToken(): Promise<ApiResponse<{ detail: string }>> {
  return fetchApiPublic<{ detail: string }>('/users/auth/verify/', {
    method: 'POST',
  });
}

