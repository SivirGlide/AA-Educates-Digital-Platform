/**
 * Mentorship API: CRUD operations for mentorship sessions and mentors
 */

import { fetchApi, ApiResponse } from './api';

// Mentor Profile types
export interface MentorProfile {
  id: number;
  user?: number; // CorporatePartnerProfile ID (optional for independent mentors)
  bio?: string;
  skills?: string;
  availability?: string;
}

export interface CreateMentorProfileRequest {
  user?: number;
  bio?: string;
  skills?: string;
  availability?: string;
}

export interface UpdateMentorProfileRequest {
  user?: number;
  bio?: string;
  skills?: string;
  availability?: string;
}

// Session types
export type SessionType = 'ONE_TO_ONE' | 'GROUP' | 'CAREER_COACHING';
export type SessionStatus = 'BOOKED' | 'COMPLETED' | 'CANCELLED';

export interface MentorshipSession {
  id: number;
  mentor: number; // MentorProfile ID
  student: number; // StudentProfile ID
  session_type: SessionType;
  date_time: string;
  duration: number; // in minutes
  status: SessionStatus;
  meeting_link?: string;
}

export interface CreateSessionRequest {
  mentor: number;
  student: number;
  session_type: SessionType;
  date_time: string;
  duration: number;
  meeting_link?: string;
}

export interface UpdateSessionRequest {
  mentor?: number;
  student?: number;
  session_type?: SessionType;
  date_time?: string;
  duration?: number;
  status?: SessionStatus;
  meeting_link?: string;
}

// Session Feedback types
export interface SessionFeedback {
  id: number;
  session: number; // Session ID
  student: number; // StudentProfile ID
  rating: number; // 1-5
  comments?: string;
  created_at: string;
}

export interface CreateFeedbackRequest {
  session: number;
  student: number;
  rating: number;
  comments?: string;
}

export interface UpdateFeedbackRequest {
  rating?: number;
  comments?: string;
}

// Mentor Profile API

/**
 * Get all mentor profiles
 */
export function getMentors(): Promise<ApiResponse<MentorProfile[]>> {
  return fetchApi<MentorProfile[]>('/mentorship/mentors/');
}

/**
 * Get mentor profile by ID
 */
export function getMentor(id: number): Promise<ApiResponse<MentorProfile>> {
  return fetchApi<MentorProfile>(`/mentorship/mentors/${id}/`);
}

/**
 * Create a new mentor profile
 */
export function createMentor(
  data: CreateMentorProfileRequest
): Promise<ApiResponse<MentorProfile>> {
  return fetchApi<MentorProfile>('/mentorship/mentors/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Update a mentor profile
 */
export function updateMentor(
  id: number,
  data: UpdateMentorProfileRequest
): Promise<ApiResponse<MentorProfile>> {
  return fetchApi<MentorProfile>(`/mentorship/mentors/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

/**
 * Partially update a mentor profile (PATCH)
 */
export function patchMentor(
  id: number,
  data: Partial<UpdateMentorProfileRequest>
): Promise<ApiResponse<MentorProfile>> {
  return fetchApi<MentorProfile>(`/mentorship/mentors/${id}/`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

/**
 * Delete a mentor profile
 */
export function deleteMentor(id: number): Promise<ApiResponse<void>> {
  return fetchApi<void>(`/mentorship/mentors/${id}/`, {
    method: 'DELETE',
  });
}

// Mentorship Sessions API

/**
 * Get all mentorship sessions
 */
export function getSessions(): Promise<ApiResponse<MentorshipSession[]>> {
  return fetchApi<MentorshipSession[]>('/mentorship/mentorship-sessions/');
}

/**
 * Get session by ID
 */
export function getSession(id: number): Promise<ApiResponse<MentorshipSession>> {
  return fetchApi<MentorshipSession>(`/mentorship/mentorship-sessions/${id}/`);
}

/**
 * Create a new mentorship session
 */
export function createSession(
  data: CreateSessionRequest
): Promise<ApiResponse<MentorshipSession>> {
  return fetchApi<MentorshipSession>('/mentorship/mentorship-sessions/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Update a mentorship session
 */
export function updateSession(
  id: number,
  data: UpdateSessionRequest
): Promise<ApiResponse<MentorshipSession>> {
  return fetchApi<MentorshipSession>(`/mentorship/mentorship-sessions/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

/**
 * Partially update a session (PATCH)
 */
export function patchSession(
  id: number,
  data: Partial<UpdateSessionRequest>
): Promise<ApiResponse<MentorshipSession>> {
  return fetchApi<MentorshipSession>(`/mentorship/mentorship-sessions/${id}/`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

/**
 * Delete a mentorship session
 */
export function deleteSession(id: number): Promise<ApiResponse<void>> {
  return fetchApi<void>(`/mentorship/mentorship-sessions/${id}/`, {
    method: 'DELETE',
  });
}

// Session Feedback API

/**
 * Get all session feedbacks
 */
export function getFeedbacks(): Promise<ApiResponse<SessionFeedback[]>> {
  return fetchApi<SessionFeedback[]>('/mentorship/mentorship-feedback/');
}

/**
 * Get feedback by ID
 */
export function getFeedback(id: number): Promise<ApiResponse<SessionFeedback>> {
  return fetchApi<SessionFeedback>(`/mentorship/mentorship-feedback/${id}/`);
}

/**
 * Create a new session feedback
 */
export function createFeedback(
  data: CreateFeedbackRequest
): Promise<ApiResponse<SessionFeedback>> {
  return fetchApi<SessionFeedback>('/mentorship/mentorship-feedback/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Update a session feedback
 */
export function updateFeedback(
  id: number,
  data: UpdateFeedbackRequest
): Promise<ApiResponse<SessionFeedback>> {
  return fetchApi<SessionFeedback>(`/mentorship/mentorship-feedback/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

/**
 * Partially update a feedback (PATCH)
 */
export function patchFeedback(
  id: number,
  data: Partial<UpdateFeedbackRequest>
): Promise<ApiResponse<SessionFeedback>> {
  return fetchApi<SessionFeedback>(`/mentorship/mentorship-feedback/${id}/`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

/**
 * Delete a session feedback
 */
export function deleteFeedback(id: number): Promise<ApiResponse<void>> {
  return fetchApi<void>(`/mentorship/mentorship-feedback/${id}/`, {
    method: 'DELETE',
  });
}

