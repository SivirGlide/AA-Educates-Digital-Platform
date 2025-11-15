/**
 * Certificates & Achievements API: Fetch certificates, badges, and skills
 */

import { fetchApi, ApiResponse } from './api';

// Skill types
export interface Skill {
  id: number;
  name: string;
  description?: string;
  category?: string;
}

export interface CreateSkillRequest {
  name: string;
  description?: string;
  category?: string;
}

export interface UpdateSkillRequest {
  name?: string;
  description?: string;
  category?: string;
}

// Badge types
export interface Badge {
  id: number;
  name: string;
  description?: string;
  icon?: string;
  criteria?: string;
  skill?: number; // Skill ID
}

export interface CreateBadgeRequest {
  name: string;
  description?: string;
  icon?: string;
  criteria?: string;
  skill?: number;
}

export interface UpdateBadgeRequest {
  name?: string;
  description?: string;
  icon?: string;
  criteria?: string;
  skill?: number;
}

// Certificate types
export interface Certificate {
  id: number;
  title: string;
  description?: string;
  file?: string; // URL to certificate file
  issued_to: number; // StudentProfile ID
  issued_by?: number; // AdminProfile ID
  issue_date: string;
}

export interface CreateCertificateRequest {
  title: string;
  description?: string;
  file?: File | string;
  issued_to: number;
  issued_by?: number;
  issue_date: string;
}

export interface UpdateCertificateRequest {
  title?: string;
  description?: string;
  file?: File | string;
  issued_by?: number;
  issue_date?: string;
}

// Skills API

/**
 * Get all skills
 */
export function getSkills(): Promise<ApiResponse<Skill[]>> {
  return fetchApi<Skill[]>('/achievements/skills/');
}

/**
 * Get skill by ID
 */
export function getSkill(id: number): Promise<ApiResponse<Skill>> {
  return fetchApi<Skill>(`/achievements/skills/${id}/`);
}

/**
 * Create a new skill (admin only)
 */
export function createSkill(data: CreateSkillRequest): Promise<ApiResponse<Skill>> {
  return fetchApi<Skill>('/achievements/skills/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Update a skill (admin only)
 */
export function updateSkill(
  id: number,
  data: UpdateSkillRequest
): Promise<ApiResponse<Skill>> {
  return fetchApi<Skill>(`/achievements/skills/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

/**
 * Partially update a skill (PATCH, admin only)
 */
export function patchSkill(
  id: number,
  data: Partial<UpdateSkillRequest>
): Promise<ApiResponse<Skill>> {
  return fetchApi<Skill>(`/achievements/skills/${id}/`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

/**
 * Delete a skill (admin only)
 */
export function deleteSkill(id: number): Promise<ApiResponse<void>> {
  return fetchApi<void>(`/achievements/skills/${id}/`, {
    method: 'DELETE',
  });
}

// Badges API

/**
 * Get all badges
 */
export function getBadges(): Promise<ApiResponse<Badge[]>> {
  return fetchApi<Badge[]>('/achievements/badges/');
}

/**
 * Get badge by ID
 */
export function getBadge(id: number): Promise<ApiResponse<Badge>> {
  return fetchApi<Badge>(`/achievements/badges/${id}/`);
}

/**
 * Create a new badge (admin only)
 */
export function createBadge(data: CreateBadgeRequest): Promise<ApiResponse<Badge>> {
  return fetchApi<Badge>('/achievements/badges/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Update a badge (admin only)
 */
export function updateBadge(
  id: number,
  data: UpdateBadgeRequest
): Promise<ApiResponse<Badge>> {
  return fetchApi<Badge>(`/achievements/badges/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

/**
 * Partially update a badge (PATCH, admin only)
 */
export function patchBadge(
  id: number,
  data: Partial<UpdateBadgeRequest>
): Promise<ApiResponse<Badge>> {
  return fetchApi<Badge>(`/achievements/badges/${id}/`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

/**
 * Delete a badge (admin only)
 */
export function deleteBadge(id: number): Promise<ApiResponse<void>> {
  return fetchApi<void>(`/achievements/badges/${id}/`, {
    method: 'DELETE',
  });
}

// Certificates API

/**
 * Get all certificates
 */
export function getCertificates(): Promise<ApiResponse<Certificate[]>> {
  return fetchApi<Certificate[]>('/achievements/certificates/');
}

/**
 * Get certificate by ID
 */
export function getCertificate(id: number): Promise<ApiResponse<Certificate>> {
  return fetchApi<Certificate>(`/achievements/certificates/${id}/`);
}

/**
 * Create a new certificate (admin only)
 * Note: File uploads may require FormData instead of JSON
 */
export function createCertificate(
  data: CreateCertificateRequest
): Promise<ApiResponse<Certificate>> {
  // Handle file upload with FormData if file is present
  if (data.file && data.file instanceof File) {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('issued_to', data.issued_to.toString());
    formData.append('issue_date', data.issue_date);
    if (data.description) formData.append('description', data.description);
    if (data.issued_by) formData.append('issued_by', data.issued_by.toString());
    formData.append('file', data.file);

    return fetchApi<Certificate>('/achievements/certificates/', {
      method: 'POST',
      headers: {}, // Let browser set Content-Type with boundary for FormData
      body: formData as any,
    });
  }

  // Regular JSON request
  return fetchApi<Certificate>('/achievements/certificates/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Update a certificate (admin only)
 */
export function updateCertificate(
  id: number,
  data: UpdateCertificateRequest
): Promise<ApiResponse<Certificate>> {
  // Handle file upload with FormData if file is present
  if (data.file && data.file instanceof File) {
    const formData = new FormData();
    if (data.title) formData.append('title', data.title);
    if (data.description) formData.append('description', data.description);
    if (data.issued_by) formData.append('issued_by', data.issued_by.toString());
    if (data.issue_date) formData.append('issue_date', data.issue_date);
    formData.append('file', data.file);

    return fetchApi<Certificate>(`/achievements/certificates/${id}/`, {
      method: 'PUT',
      headers: {},
      body: formData as any,
    });
  }

  // Regular JSON request
  return fetchApi<Certificate>(`/achievements/certificates/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

/**
 * Partially update a certificate (PATCH, admin only)
 */
export function patchCertificate(
  id: number,
  data: Partial<UpdateCertificateRequest>
): Promise<ApiResponse<Certificate>> {
  // Handle file upload with FormData if file is present
  if (data.file && data.file instanceof File) {
    const formData = new FormData();
    if (data.title) formData.append('title', data.title);
    if (data.description) formData.append('description', data.description);
    if (data.issued_by) formData.append('issued_by', data.issued_by.toString());
    if (data.issue_date) formData.append('issue_date', data.issue_date);
    formData.append('file', data.file);

    return fetchApi<Certificate>(`/achievements/certificates/${id}/`, {
      method: 'PATCH',
      headers: {},
      body: formData as any,
    });
  }

  // Regular JSON request
  return fetchApi<Certificate>(`/achievements/certificates/${id}/`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

/**
 * Delete a certificate (admin only)
 */
export function deleteCertificate(id: number): Promise<ApiResponse<void>> {
  return fetchApi<void>(`/achievements/certificates/${id}/`, {
    method: 'DELETE',
  });
}

