/**
 * Projects API: CRUD operations for projects and submissions
 */

import { fetchApi, ApiResponse } from './api';

// Project types
export type ProjectStatus = 'DRAFT' | 'OPEN' | 'CLOSED' | 'ARCHIVED';

export interface Project {
  id: number;
  title: string;
  description: string;
  created_by: number; // CorporatePartnerProfile ID
  skills_required: number[]; // Skill IDs
  start_date?: string;
  end_date?: string;
  status: ProjectStatus;
  approved_by?: number; // AdminProfile ID
  created_at: string;
  updated_at: string;
}

export interface CreateProjectRequest {
  title: string;
  description?: string;
  created_by: number;
  skills_required?: number[];
  start_date?: string;
  end_date?: string;
  status?: ProjectStatus;
}

export interface UpdateProjectRequest {
  title?: string;
  description?: string;
  skills_required?: number[];
  start_date?: string;
  end_date?: string;
  status?: ProjectStatus;
  approved_by?: number;
}

// Project Submission types
export type SubmissionStatus = 'SUBMITTED' | 'REVIEWED' | 'APPROVED';

export interface ProjectSubmission {
  id: number;
  student: number; // StudentProfile ID
  project: number; // Project ID
  submission_link?: string;
  feedback?: string;
  grade?: string;
  status: SubmissionStatus;
  submitted_at: string;
  updated_at: string;
}

export interface CreateSubmissionRequest {
  student: number;
  project: number;
  submission_link?: string;
}

export interface UpdateSubmissionRequest {
  submission_link?: string;
  feedback?: string;
  grade?: string;
  status?: SubmissionStatus;
}

/**
 * Get all projects
 */
export function getProjects(): Promise<ApiResponse<Project[]>> {
  return fetchApi<Project[]>('/projects/projects/');
}

/**
 * Get project by ID
 */
export function getProject(id: number): Promise<ApiResponse<Project>> {
  return fetchApi<Project>(`/projects/projects/${id}/`);
}

/**
 * Create a new project
 */
export function createProject(
  data: CreateProjectRequest
): Promise<ApiResponse<Project>> {
  return fetchApi<Project>('/projects/projects/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Update an existing project
 */
export function updateProject(
  id: number,
  data: UpdateProjectRequest
): Promise<ApiResponse<Project>> {
  return fetchApi<Project>(`/projects/projects/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

/**
 * Partially update a project (PATCH)
 */
export function patchProject(
  id: number,
  data: Partial<UpdateProjectRequest>
): Promise<ApiResponse<Project>> {
  return fetchApi<Project>(`/projects/projects/${id}/`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

/**
 * Delete a project
 */
export function deleteProject(id: number): Promise<ApiResponse<void>> {
  return fetchApi<void>(`/projects/projects/${id}/`, {
    method: 'DELETE',
  });
}

// Project Submissions API

/**
 * Get all project submissions
 */
export function getSubmissions(): Promise<ApiResponse<ProjectSubmission[]>> {
  return fetchApi<ProjectSubmission[]>('/projects/student-submissions/');
}

/**
 * Get submission by ID
 */
export function getSubmission(id: number): Promise<ApiResponse<ProjectSubmission>> {
  return fetchApi<ProjectSubmission>(`/projects/student-submissions/${id}/`);
}

/**
 * Create a new project submission
 */
export function createSubmission(
  data: CreateSubmissionRequest
): Promise<ApiResponse<ProjectSubmission>> {
  return fetchApi<ProjectSubmission>('/projects/student-submissions/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Update a project submission
 */
export function updateSubmission(
  id: number,
  data: UpdateSubmissionRequest
): Promise<ApiResponse<ProjectSubmission>> {
  return fetchApi<ProjectSubmission>(`/projects/student-submissions/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

/**
 * Partially update a submission (PATCH)
 */
export function patchSubmission(
  id: number,
  data: Partial<UpdateSubmissionRequest>
): Promise<ApiResponse<ProjectSubmission>> {
  return fetchApi<ProjectSubmission>(`/projects/student-submissions/${id}/`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

/**
 * Delete a project submission
 */
export function deleteSubmission(id: number): Promise<ApiResponse<void>> {
  return fetchApi<void>(`/projects/student-submissions/${id}/`, {
    method: 'DELETE',
  });
}

