/**
 * Core API utility: base URL, JWT token handling, and fetch logic
 */

// Import API modules for backward compatibility
import * as authApi from './auth.api';
import * as usersApi from './users.api';
import * as projectsApi from './projects.api';
import * as mentorsApi from './mentors.api';
import * as certificatesApi from './certificates.api';
import * as paymentsApi from './payments.api';

// Base API URL
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

// Response type for all API calls
export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

/**
 * Get JWT token from localStorage
 */
export function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('access_token');
}

/**
 * Get refresh token from localStorage
 */
export function getRefreshToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('refresh_token');
}

/**
 * Set JWT tokens in localStorage
 */
export function setTokens(access: string, refresh: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('access_token', access);
  localStorage.setItem('refresh_token', refresh);
}

/**
 * Clear all auth tokens and user data from localStorage
 */
export function clearAuth(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user');
  localStorage.removeItem('userId');
  localStorage.removeItem('userRole');
  localStorage.removeItem('profileId');
}

/**
 * Core fetch function with JWT authentication
 * Handles token injection, error handling, and automatic logout on 401
 */
export async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    
    // Get token from localStorage
    const token = getAccessToken();
    
    // Prepare headers
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {}),
    };
    
    // Add authorization header if token exists
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    // Handle 401 Unauthorized - token expired or invalid
    if (response.status === 401) {
      clearAuth();
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      return { error: 'Unauthorized. Please login again.' };
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: 'An error occurred' }));
      return { error: errorData.detail || errorData.error || `HTTP ${response.status}` };
    }

    // Handle 204 No Content responses (common for DELETE requests)
    if (response.status === 204) {
      return { data: undefined };
    }

    // Check if response has content
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      return { data };
    }

    // For other content types or empty responses, return undefined data
    return { data: undefined };
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Network error' };
  }
}

/**
 * Fetch without authentication (for public endpoints)
 */
export async function fetchApiPublic<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {}),
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: 'An error occurred' }));
      return { error: errorData.detail || errorData.error || `HTTP ${response.status}` };
    }

    const data = await response.json();
    return { data };
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Network error' };
  }
}

/**
 * Backward-compatible API object
 * @deprecated Use specific API modules instead:
 * - auth.api.ts for login/register/logout
 * - users.api.ts for user operations
 * - projects.api.ts for project operations
 * - mentors.api.ts for mentorship operations
 * - certificates.api.ts for certificates/achievements
 */
export const api = {
  // Authentication
  login: authApi.login,
  register: authApi.register,
  
  // Users
  getUser: usersApi.getUser,
  getUsers: usersApi.getUsers,
  getStudent: usersApi.getStudent,
  getStudents: usersApi.getStudents,
  getParent: usersApi.getParent,
  getParents: usersApi.getParents,
  updateParent: usersApi.updateParent,
  getCorporatePartner: usersApi.getCorporatePartner,
  getCorporatePartners: usersApi.getCorporatePartners,
  updateCorporatePartner: usersApi.updateCorporatePartner,
  
  // Projects
  getProjects: projectsApi.getProjects,
  getProject: projectsApi.getProject,
  createProject: projectsApi.createProject,
  updateProject: projectsApi.updateProject,
  deleteProject: projectsApi.deleteProject,
  getSubmissions: projectsApi.getSubmissions,
  getSubmission: projectsApi.getSubmission,
  
  // Achievements
  getBadges: certificatesApi.getBadges,
  getCertificates: certificatesApi.getCertificates,
  getSkills: certificatesApi.getSkills,
  
  // Payments
  createCheckoutSession: paymentsApi.createCheckoutSession,
  verifyPayment: paymentsApi.verifyPayment,
};

export default api;

