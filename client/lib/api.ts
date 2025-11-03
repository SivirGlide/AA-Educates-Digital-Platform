const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    
    // Get token from localStorage
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    
    // Prepare headers
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
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
      if (typeof window !== 'undefined') {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
      return { error: 'Unauthorized. Please login again.' };
    }

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

export const api = {
  // Students
  getStudent: (id: number) => fetchApi(`/users/students/${id}/`),
  getStudents: () => fetchApi('/users/students/'),
  
  // Parents
  getParent: (id: number) => fetchApi(`/users/parents/${id}/`),
  getParents: () => fetchApi('/users/parents/'),
  updateParent: (id: number, data: any) => fetchApi(`/users/parents/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  // Corporate Partners
  getCorporatePartner: (id: number) => fetchApi(`/users/corporate-partners/${id}/`),
  getCorporatePartners: () => fetchApi('/users/corporate-partners/'),
  updateCorporatePartner: (id: number, data: any) => fetchApi(`/users/corporate-partners/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  // Users
  getUser: (id: number) => fetchApi(`/users/users/${id}/`),
  
  // Projects - CRUD operations
  getProjects: () => fetchApi('/projects/projects/'),
  getProject: (id: number) => fetchApi(`/projects/projects/${id}/`),
  createProject: (data: any) => fetchApi('/projects/projects/', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateProject: (id: number, data: any) => fetchApi(`/projects/projects/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  deleteProject: (id: number) => fetchApi(`/projects/projects/${id}/`, {
    method: 'DELETE',
  }),
  
  // Project Submissions
  getSubmissions: () => fetchApi('/projects/student-submissions/'),
  getSubmission: (id: number) => fetchApi(`/projects/student-submissions/${id}/`),
  
  // Achievements
  getBadges: () => fetchApi('/achievements/badges/'),
  getCertificates: () => fetchApi('/achievements/certificates/'),
  getSkills: () => fetchApi('/achievements/skills/'),
  
  // Authentication (no token needed for these)
  login: async (email: string, password: string) => {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
    try {
      const response = await fetch(`${API_BASE_URL}/users/auth/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        return { error: data.error || 'Login failed' };
      }
      return { data };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Network error' };
    }
  },
  register: async (data: any) => {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
    try {
      const response = await fetch(`${API_BASE_URL}/users/auth/register/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      const responseData = await response.json();
      if (!response.ok) {
        return { error: responseData.error || 'Registration failed' };
      }
      return { data: responseData };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Network error' };
    }
  },
};

export default api;

