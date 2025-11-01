/**
 * Example API call patterns for connecting Next.js to Django REST API
 * 
 * These examples show how to perform CRUD operations using the apiClient
 */

import apiClient from './api';

// ============================================
// GET (Read) Examples
// ============================================

// Get all users
export async function getUsers() {
  const response = await apiClient.get('/users/users/');
  return response.data;
}

// Get single user by ID
export async function getUser(id: number) {
  const response = await apiClient.get(`/users/users/${id}/`);
  return response.data;
}

// Get all projects
export async function getProjects() {
  const response = await apiClient.get('/projects/projects/');
  return response.data;
}

// Get all learning modules
export async function getModules() {
  const response = await apiClient.get('/learning/modules/');
  return response.data;
}

// ============================================
// POST (Create) Examples
// ============================================

// Create a new user
export async function createUser(userData: {
  username: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  role: string;
}) {
  const response = await apiClient.post('/users/users/', userData);
  return response.data;
}

// Create a project
export async function createProject(projectData: {
  title: string;
  description: string;
  created_by: number; // CorporatePartnerProfile ID
  status: string;
}) {
  const response = await apiClient.post('/projects/projects/', projectData);
  return response.data;
}

// ============================================
// PATCH/PUT (Update) Examples
// ============================================

// Update user
export async function updateUser(id: number, updates: Partial<{
  first_name: string;
  last_name: string;
  email: string;
}>) {
  const response = await apiClient.patch(`/users/users/${id}/`, updates);
  return response.data;
}

// ============================================
// DELETE Examples
// ============================================

// Delete user
export async function deleteUser(id: number) {
  const response = await apiClient.delete(`/users/users/${id}/`);
  return response.data;
}

// ============================================
// Using with React Query (Recommended)
// ============================================

// Example: Use in a component with React Query
/*
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUsers, createUser } from '@/lib/api-examples';

function UsersComponent() {
  const queryClient = useQueryClient();
  
  // Fetch users (cached, automatic refetching)
  const { data: users, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
  });
  
  // Create user mutation
  const createMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      // Invalidate and refetch users list
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
  
  return (
    <div>
      {isLoading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      {users?.map(user => <div key={user.id}>{user.email}</div>)}
    </div>
  );
}
*/

// ============================================
// Error Handling Example
// ============================================

export async function safeApiCall<T>(
  apiCall: () => Promise<T>
): Promise<{ data: T | null; error: string | null }> {
  try {
    const data = await apiCall();
    return { data, error: null };
  } catch (error: any) {
    console.error('API Error:', error);
    return {
      data: null,
      error: error.response?.data?.detail || error.message || 'Unknown error',
    };
  }
}

// Usage:
// const { data, error } = await safeApiCall(() => getUsers());

