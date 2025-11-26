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

    // Store tokens on successful login
    if (response.data) {
      setTokens(response.data.access, response.data.refresh);
      // Also store user info in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(response.data.user));
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
    console.log('Registration request data:', data);
    const response = await fetchApiPublic<AuthResponse>('/users/auth/register/', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    console.log('Registration response:', response);

    // Check if response has error
    if (response.error) {
      console.error('Registration error:', response.error);
      return response;
    }

    // Check if response has required data
    if (!response.data) {
      console.error('Registration succeeded but no data returned');
      return { error: 'Registration succeeded but no data returned' };
    }

    // Validate response structure
    if (!response.data.access || !response.data.refresh) {
      console.error('Registration response missing tokens:', response.data);
      return { error: 'Registration succeeded but missing authentication tokens' };
    }

    // Store tokens on successful registration
    setTokens(response.data.access, response.data.refresh);
    // Also store user info in localStorage
    if (typeof window !== 'undefined' && response.data.user) {
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }

    return response;
  } catch (error) {
    console.error('Registration exception:', error);
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

