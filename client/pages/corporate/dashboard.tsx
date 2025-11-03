import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { api } from '../../lib/api';

interface CorporatePartnerProfile {
  id: number;
  user: number;
  company_name: string;
  industry: string;
  website: string;
  csr_report_link: string;
  logo: string;
}

interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
}

interface Project {
  id: number;
  title: string;
  description: string;
  created_by: number;
  skills_required: number[];
  start_date: string | null;
  end_date: string | null;
  status: string;
  approved_by: number | null;
  created_at: string;
  updated_at: string;
}

const CorporateDashboard: NextPage = () => {
  const [corporate, setCorporate] = useState<CorporatePartnerProfile | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Project CRUD states
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [projectForm, setProjectForm] = useState({
    title: '',
    description: '',
    status: 'DRAFT',
    start_date: '',
    end_date: '',
    skills_required: [] as number[],
  });

  useEffect(() => {
    fetchCorporateData();
    fetchProjects();
  }, []);

  const fetchCorporateData = async () => {
    try {
      // Get profile ID from localStorage (set during login)
      const profileId = localStorage.getItem('profileId');
      const userId = localStorage.getItem('userId');
      
      if (!profileId || !userId) {
        setError('Please login to access your dashboard');
        setLoading(false);
        return;
      }

      // Fetch corporate partner using authenticated user's profile ID
      const corporateResponse = await api.getCorporatePartner(parseInt(profileId));
      if (corporateResponse.error) {
        setError(corporateResponse.error);
        setLoading(false);
        return;
      }

      if (corporateResponse.data) {
        setCorporate(corporateResponse.data);
        
        // Fetch user data
        const userResponse = await api.getUser(parseInt(userId));
        if (userResponse.data) {
          setUser(userResponse.data);
        }
      }
    } catch (err) {
      setError('Failed to load corporate partner data');
    } finally {
      setLoading(false);
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await api.getProjects();
      if (response.data) {
        // Filter projects created by this corporate partner (from localStorage)
        const profileId = parseInt(localStorage.getItem('profileId') || '0');
        const corporateProjects = Array.isArray(response.data) 
          ? response.data.filter((p: Project) => p.created_by === profileId)
          : [];
        setProjects(corporateProjects);
      }
    } catch (err) {
      console.error('Failed to load projects:', err);
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const profileId = parseInt(localStorage.getItem('profileId') || '0');
      const projectData = {
        ...projectForm,
        created_by: profileId, // Authenticated corporate partner ID
        skills_required: projectForm.skills_required,
      };
      
      const response = await api.createProject(projectData);
      if (response.error) {
        alert(`Error creating project: ${response.error}`);
        return;
      }
      
      // Reset form and refresh projects
      setProjectForm({
        title: '',
        description: '',
        status: 'DRAFT',
        start_date: '',
        end_date: '',
        skills_required: [],
      });
      setShowCreateForm(false);
      fetchProjects();
    } catch (err) {
      alert('Failed to create project');
    }
  };

  const handleUpdateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;

    try {
      const projectData = {
        ...projectForm,
        created_by: editingProject.created_by,
        skills_required: projectForm.skills_required,
      };
      
      const response = await api.updateProject(editingProject.id, projectData);
      if (response.error) {
        alert(`Error updating project: ${response.error}`);
        return;
      }
      
      setEditingProject(null);
      setProjectForm({
        title: '',
        description: '',
        status: 'DRAFT',
        start_date: '',
        end_date: '',
        skills_required: [],
      });
      fetchProjects();
    } catch (err) {
      alert('Failed to update project');
    }
  };

  const handleDeleteProject = async (id: number) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      const response = await api.deleteProject(id);
      if (response.error) {
        alert(`Error deleting project: ${response.error}`);
        return;
      }
      
      fetchProjects();
    } catch (err) {
      alert('Failed to delete project');
    }
  };

  const startEditing = (project: Project) => {
    setEditingProject(project);
    setProjectForm({
      title: project.title,
      description: project.description,
      status: project.status,
      start_date: project.start_date || '',
      end_date: project.end_date || '',
      skills_required: project.skills_required || [],
    });
    setShowCreateForm(true);
  };

  const cancelForm = () => {
    setShowCreateForm(false);
    setEditingProject(null);
    setProjectForm({
      title: '',
      description: '',
      status: 'DRAFT',
      start_date: '',
      end_date: '',
      skills_required: [],
    });
  };

  return (
    <>
      <Head>
        <title>Corporate Dashboard - AA Educates</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-pink-50">
        {/* Navigation */}
        <nav className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200 sticky top-0 z-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              AA Educates
            </Link>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700 font-medium">Corporate Portal</span>
              <Link 
                href="/login" 
                className="px-4 py-2 text-purple-600 hover:text-purple-700 font-medium hover:bg-purple-50 rounded-lg transition-colors"
              >
                Logout
              </Link>
            </div>
          </div>
        </nav>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {loading ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
          ) : error ? (
            <div className="max-w-2xl mx-auto mt-12">
              <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                <h3 className="text-xl font-semibold text-red-800 mb-2">Error Loading Data</h3>
                <p className="text-red-600">{error}</p>
                <p className="text-sm text-red-500 mt-2">Corporate Partner ID 2 may not exist in the database.</p>
              </div>
            </div>
          ) : corporate && user ? (
            <>
              {/* Corporate Profile Header */}
              <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-purple-100">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                  <div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-2">
                      {corporate.company_name}
                    </h1>
                    <p className="text-xl text-gray-600 mb-2">
                      {user.email}
                    </p>
                    {corporate.industry && (
                      <p className="text-lg text-purple-600 font-medium">{corporate.industry}</p>
                    )}
                    {corporate.website && (
                      <a 
                        href={corporate.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:text-indigo-700 mt-2 inline-block"
                      >
                        Visit Website →
                      </a>
                    )}
                  </div>
                  <div className="mt-4 md:mt-0">
                    <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl font-semibold">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      Corporate ID: {corporate.id}
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-purple-700 mb-1">Active Projects</p>
                        <p className="text-3xl font-bold text-purple-900">{projects.filter(p => p.status === 'OPEN').length}</p>
                      </div>
                      <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-6 border border-indigo-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-indigo-700 mb-1">Total Projects</p>
                        <p className="text-3xl font-bold text-indigo-900">{projects.length}</p>
                      </div>
                      <div className="w-12 h-12 bg-indigo-500 rounded-xl flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl p-6 border border-pink-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-pink-700 mb-1">Closed Projects</p>
                        <p className="text-3xl font-bold text-pink-900">{projects.filter(p => p.status === 'CLOSED').length}</p>
                      </div>
                      <div className="w-12 h-12 bg-pink-500 rounded-xl flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* CRUD Section - Projects */}
              <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-purple-100">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-3xl font-bold text-gray-900">My Projects</h2>
                  <button
                    onClick={() => {
                      setShowCreateForm(true);
                      setEditingProject(null);
                      setProjectForm({
                        title: '',
                        description: '',
                        status: 'DRAFT',
                        start_date: '',
                        end_date: '',
                        skills_required: [],
                      });
                    }}
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 flex items-center"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Create Project
                  </button>
                </div>

                {/* Create/Edit Form */}
                {showCreateForm && (
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 mb-6 border border-purple-200">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      {editingProject ? 'Edit Project' : 'Create New Project'}
                    </h3>
                    <form onSubmit={editingProject ? handleUpdateProject : handleCreateProject} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                        <input
                          type="text"
                          value={projectForm.title}
                          onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                        <textarea
                          value={projectForm.description}
                          onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          rows={4}
                          required
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                          <select
                            value={projectForm.status}
                            onChange={(e) => setProjectForm({ ...projectForm, status: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          >
                            <option value="DRAFT">Draft</option>
                            <option value="OPEN">Open</option>
                            <option value="CLOSED">Closed</option>
                            <option value="ARCHIVED">Archived</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                          <input
                            type="date"
                            value={projectForm.start_date}
                            onChange={(e) => setProjectForm({ ...projectForm, start_date: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                          <input
                            type="date"
                            value={projectForm.end_date}
                            onChange={(e) => setProjectForm({ ...projectForm, end_date: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                      <div className="flex space-x-4">
                        <button
                          type="submit"
                          className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                        >
                          {editingProject ? 'Update Project' : 'Create Project'}
                        </button>
                        <button
                          type="button"
                          onClick={cancelForm}
                          className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-all"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Projects List */}
                {projects.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">No projects yet. Create your first project!</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project) => (
                      <div
                        key={project.id}
                        className="group bg-gradient-to-br from-white to-purple-50 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden border border-purple-100"
                      >
                        <div className="p-6">
                          <div className="flex justify-between items-start mb-4">
                            <h3 className="text-xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors">
                              {project.title}
                            </h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              project.status === 'OPEN' ? 'bg-green-100 text-green-700' :
                              project.status === 'CLOSED' ? 'bg-gray-100 text-gray-700' :
                              project.status === 'DRAFT' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-purple-100 text-purple-700'
                            }`}>
                              {project.status}
                            </span>
                          </div>
                          <p className="text-gray-600 mb-4 text-sm line-clamp-3">
                            {project.description || 'No description'}
                          </p>
                          {project.start_date && (
                            <p className="text-xs text-gray-500 mb-2">
                              Start: {new Date(project.start_date).toLocaleDateString()}
                            </p>
                          )}
                          <div className="flex space-x-2 mt-4">
                            <button
                              onClick={() => startEditing(project)}
                              className="flex-1 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg font-medium hover:bg-purple-200 transition-colors text-sm"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteProject(project.id)}
                              className="flex-1 px-4 py-2 bg-red-100 text-red-700 rounded-lg font-medium hover:bg-red-200 transition-colors text-sm"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Dashboard Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden border border-purple-100">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative p-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-6 transform group-hover:rotate-6 transition-transform duration-300">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors">
                      Impact Reports
                    </h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      Track the impact of your initiatives and view detailed analytics
                    </p>
                    <div className="flex items-center text-purple-600 font-semibold group-hover:translate-x-2 transition-transform duration-300">
                      View Reports
                      <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden border border-pink-100">
                  <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-pink-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative p-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center mb-6 transform group-hover:rotate-6 transition-transform duration-300">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-pink-600 transition-colors">
                      Student Engagement
                    </h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      See student participation metrics and track engagement
                    </p>
                    <div className="flex items-center text-pink-600 font-semibold group-hover:translate-x-2 transition-transform duration-300">
                      View Analytics
                      <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden border border-indigo-100">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative p-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center mb-6 transform group-hover:rotate-6 transition-transform duration-300">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors">
                      Payments
                    </h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      View transaction history and manage payments
                    </p>
                    <div className="flex items-center text-indigo-600 font-semibold group-hover:translate-x-2 transition-transform duration-300">
                      View Payments
                      <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="max-w-2xl mx-auto mt-12">
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center">
                <h3 className="text-xl font-semibold text-yellow-800 mb-2">No Corporate Partner Found</h3>
                <p className="text-yellow-600">Corporate Partner with ID 1 does not exist in the database.</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default CorporateDashboard;
