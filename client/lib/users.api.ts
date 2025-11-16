/**
 * Users API: User profiles, roles, and permissions
 */

import { fetchApi, ApiResponse } from './api';

// User types
export interface User {
  id: number;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  role: string;
  is_staff: boolean;
  is_active: boolean;
  date_joined: string;
}

export interface StudentProfile {
  id: number;
  user: number;
  date_of_birth?: string;
  school?: string;
  grade?: string;
  parent?: number;
}

export interface ParentProfile {
  id: number;
  user: number;
  phone?: string;
  address?: string;
}

export interface CorporatePartnerProfile {
  id: number;
  user: number;
  company_name: string;
  industry?: string;
  website?: string;
  contact_email?: string;
  phone?: string;
}

export interface SchoolProfile {
  id: number;
  user: number;
  name: string;
  address?: string;
}

export interface AdminProfile {
  id: number;
  user: number;
  department?: string;
}

/**
 * Get current user's information
 */
export function getCurrentUser(): Promise<ApiResponse<User>> {
  return fetchApi<User>('/users/users/me/');
}

/**
 * Get user by ID
 */
export function getUser(id: number): Promise<ApiResponse<User>> {
  return fetchApi<User>(`/users/users/${id}/`);
}

/**
 * Update user profile
 */
export function updateUser(id: number, data: Partial<User>): Promise<ApiResponse<User>> {
  return fetchApi<User>(`/users/users/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

/**
 * Get all users (admin only)
 */
export function getUsers(): Promise<ApiResponse<User[]>> {
  return fetchApi<User[]>('/users/users/');
}

// Student Profile API
export function getStudent(id: number): Promise<ApiResponse<StudentProfile>> {
  return fetchApi<StudentProfile>(`/users/students/${id}/`);
}

export function getStudents(): Promise<ApiResponse<StudentProfile[]>> {
  return fetchApi<StudentProfile[]>('/users/students/');
}

export function createStudent(data: Partial<StudentProfile>): Promise<ApiResponse<StudentProfile>> {
  return fetchApi<StudentProfile>('/users/students/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateStudent(
  id: number,
  data: Partial<StudentProfile>
): Promise<ApiResponse<StudentProfile>> {
  return fetchApi<StudentProfile>(`/users/students/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export function deleteStudent(id: number): Promise<ApiResponse<void>> {
  return fetchApi<void>(`/users/students/${id}/`, {
    method: 'DELETE',
  });
}

// Parent Profile API
export function getParent(id: number): Promise<ApiResponse<ParentProfile>> {
  return fetchApi<ParentProfile>(`/users/parents/${id}/`);
}

export function getParents(): Promise<ApiResponse<ParentProfile[]>> {
  return fetchApi<ParentProfile[]>('/users/parents/');
}

export function createParent(data: Partial<ParentProfile>): Promise<ApiResponse<ParentProfile>> {
  return fetchApi<ParentProfile>('/users/parents/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateParent(
  id: number,
  data: Partial<ParentProfile>
): Promise<ApiResponse<ParentProfile>> {
  return fetchApi<ParentProfile>(`/users/parents/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export function deleteParent(id: number): Promise<ApiResponse<void>> {
  return fetchApi<void>(`/users/parents/${id}/`, {
    method: 'DELETE',
  });
}

// Corporate Partner Profile API
export function getCorporatePartner(
  id: number
): Promise<ApiResponse<CorporatePartnerProfile>> {
  return fetchApi<CorporatePartnerProfile>(`/users/corporate-partners/${id}/`);
}

export function getCorporatePartners(): Promise<ApiResponse<CorporatePartnerProfile[]>> {
  return fetchApi<CorporatePartnerProfile[]>('/users/corporate-partners/');
}

export function createCorporatePartner(
  data: Partial<CorporatePartnerProfile>
): Promise<ApiResponse<CorporatePartnerProfile>> {
  return fetchApi<CorporatePartnerProfile>('/users/corporate-partners/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateCorporatePartner(
  id: number,
  data: Partial<CorporatePartnerProfile>
): Promise<ApiResponse<CorporatePartnerProfile>> {
  return fetchApi<CorporatePartnerProfile>(`/users/corporate-partners/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export function deleteCorporatePartner(id: number): Promise<ApiResponse<void>> {
  return fetchApi<void>(`/users/corporate-partners/${id}/`, {
    method: 'DELETE',
  });
}

// School Profile API
export function getSchool(id: number): Promise<ApiResponse<SchoolProfile>> {
  return fetchApi<SchoolProfile>(`/users/schools/${id}/`);
}

export function getSchools(): Promise<ApiResponse<SchoolProfile[]>> {
  return fetchApi<SchoolProfile[]>('/users/schools/');
}

export function createSchool(data: Partial<SchoolProfile>): Promise<ApiResponse<SchoolProfile>> {
  return fetchApi<SchoolProfile>('/users/schools/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateSchool(
  id: number,
  data: Partial<SchoolProfile>
): Promise<ApiResponse<SchoolProfile>> {
  return fetchApi<SchoolProfile>(`/users/schools/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export function deleteSchool(id: number): Promise<ApiResponse<void>> {
  return fetchApi<void>(`/users/schools/${id}/`, {
    method: 'DELETE',
  });
}

// Admin Profile API (admin only)
export function getAdmin(id: number): Promise<ApiResponse<AdminProfile>> {
  return fetchApi<AdminProfile>(`/users/admins/${id}/`);
}

export function getAdmins(): Promise<ApiResponse<AdminProfile[]>> {
  return fetchApi<AdminProfile[]>('/users/admins/');
}

