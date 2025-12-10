import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { Project } from '../../lib/projects.api';
import { DashboardLayout } from '@/src/components/layouts/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Badge } from '@/src/components/ui/badge';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import { Textarea } from '@/src/components/ui/textarea';
import { X, Plus, Building2, FileText, Users, DollarSign, ArrowRight } from 'lucide-react';

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

const CorporateDashboard: NextPage = () => {
  const [corporate, setCorporate] = useState<CorporatePartnerProfile | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [creatingProject, setCreatingProject] = useState(false);
  const [deletingProject, setDeletingProject] = useState<number | null>(null);
  
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

  // Auto-hide success messages
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  useEffect(() => {
    fetchCorporateData();
    fetchProjects();
  }, []);

  const fetchCorporateData = async () => {
    try {
      // Get user ID from localStorage (set during login)
      const userId = localStorage.getItem('userId');

      if (!userId) {
        setError('Please login to access your dashboard');
        setLoading(false);
        return;
      }

      // Fetch corporate partner profile using list endpoint (returns only user's own profile)
      const corporateResponse = await api.getCorporatePartners();
      if (corporateResponse.error) {
        setError(corporateResponse.error);
        setLoading(false);
        return;
      }

      // Get the first (and only) profile from the list
      const corporateProfiles = Array.isArray(corporateResponse.data)
        ? corporateResponse.data
        : (corporateResponse.data as any)?.results || [];

      if (corporateProfiles.length > 0) {
        setCorporate(corporateProfiles[0] as CorporatePartnerProfile);

        // Fetch user data
        const userResponse = await api.getUser(parseInt(userId));
        if (userResponse.data && typeof userResponse.data === 'object' && 'id' in userResponse.data) {
          setUser(userResponse.data as User);
        } else {
          console.error('Failed to fetch user data:', userResponse.error);
        }
      } else {
        setError('No corporate partner profile found. Please contact support.');
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
    setCreatingProject(true);
    setError(null);
    
    const profileId = parseInt(localStorage.getItem('profileId') || '0');
    
    if (!profileId) {
      setError('Corporate partner profile not found. Please login again.');
      setCreatingProject(false);
      return;
    }

    // Prepare project data - only include dates if they're provided
    const projectData: any = {
      title: projectForm.title.trim(),
      description: projectForm.description.trim(),
      status: projectForm.status,
      created_by: profileId,
      skills_required: projectForm.skills_required,
    };

    // Only include dates if they're provided
    if (projectForm.start_date) {
      projectData.start_date = projectForm.start_date;
    }
    if (projectForm.end_date) {
      projectData.end_date = projectForm.end_date;
    }

    // Optimistic update: create temporary project and add to UI immediately
    const tempProject: Project = {
      id: Date.now(), // Temporary ID
      title: projectData.title,
      description: projectData.description,
      status: projectData.status,
      created_by: profileId,
      skills_required: projectData.skills_required || [],
      start_date: projectData.start_date,
      end_date: projectData.end_date,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const previousProjects = [...projects];
    setProjects(prevProjects => [...prevProjects, tempProject]);

    // Reset form immediately for better UX
    setProjectForm({
      title: '',
      description: '',
      status: 'DRAFT',
      start_date: '',
      end_date: '',
      skills_required: [],
    });
    setShowCreateForm(false);
    
    try {
      const response = await api.createProject(projectData);
      if (response.error) {
        // Restore previous state if creation failed
        setProjects(previousProjects);
        setShowCreateForm(true);
        setProjectForm({
          title: projectData.title,
          description: projectData.description,
          status: projectData.status,
          start_date: projectData.start_date || '',
          end_date: projectData.end_date || '',
          skills_required: projectData.skills_required || [],
        });
        setError(`Error creating project: ${response.error}`);
        setCreatingProject(false);
        return;
      }
      
      // Success! Replace temp project with real one from API
      if (response.data) {
        setProjects(prevProjects => 
          prevProjects.map(p => p.id === tempProject.id ? response.data! : p)
        );
      } else {
        // If no data returned, refresh from backend
        await fetchProjects();
      }
      
      setSuccessMessage('Project created successfully!');
    } catch (err) {
      // Restore previous state if creation failed
      setProjects(previousProjects);
      setShowCreateForm(true);
      setProjectForm({
        title: projectData.title,
        description: projectData.description,
        status: projectData.status,
        start_date: projectData.start_date || '',
        end_date: projectData.end_date || '',
        skills_required: projectData.skills_required || [],
      });
      setError('Failed to create project. Please try again.');
      console.error('Create project error:', err);
    } finally {
      setCreatingProject(false);
    }
  };

  const handleUpdateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;

    setCreatingProject(true);
    setError(null);

    const projectData: any = {
      title: projectForm.title.trim(),
      description: projectForm.description.trim(),
      status: projectForm.status,
      created_by: editingProject.created_by,
      skills_required: projectForm.skills_required,
    };

    // Only include dates if they're provided
    if (projectForm.start_date) {
      projectData.start_date = projectForm.start_date;
    }
    if (projectForm.end_date) {
      projectData.end_date = projectForm.end_date;
    }

    // Optimistic update: update project in UI immediately
    const previousProjects = [...projects];
    const updatedProject: Project = {
      ...editingProject,
      ...projectData,
      updated_at: new Date().toISOString(),
    };

    setProjects(prevProjects =>
      prevProjects.map(p => p.id === editingProject.id ? updatedProject : p)
    );

    // Reset form immediately for better UX
    setEditingProject(null);
    setProjectForm({
      title: '',
      description: '',
      status: 'DRAFT',
      start_date: '',
      end_date: '',
      skills_required: [],
    });
    setShowCreateForm(false);

    try {
      const response = await api.updateProject(editingProject.id, projectData);
      if (response.error) {
        // Restore previous state if update failed
        setProjects(previousProjects);
        setShowCreateForm(true);
        setEditingProject(editingProject);
        const formatDate = (dateString?: string) => {
          if (!dateString) return '';
          const date = new Date(dateString);
          return date.toISOString().split('T')[0];
        };
        setProjectForm({
          title: editingProject.title,
          description: editingProject.description,
          status: editingProject.status,
          start_date: formatDate(editingProject.start_date),
          end_date: formatDate(editingProject.end_date),
          skills_required: editingProject.skills_required || [],
        });
        setError(`Error updating project: ${response.error}`);
        setCreatingProject(false);
        return;
      }
      
      // Success! Replace with updated project from API
      if (response.data) {
        setProjects(prevProjects =>
          prevProjects.map(p => p.id === editingProject.id ? response.data! : p)
        );
      } else {
        // If no data returned, refresh from backend
        await fetchProjects();
      }
      
      setSuccessMessage('Project updated successfully!');
    } catch (err) {
      // Restore previous state if update failed
      setProjects(previousProjects);
      setShowCreateForm(true);
      setEditingProject(editingProject);
      const formatDate = (dateString?: string) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
      };
      setProjectForm({
        title: editingProject.title,
        description: editingProject.description,
        status: editingProject.status,
        start_date: formatDate(editingProject.start_date),
        end_date: formatDate(editingProject.end_date),
        skills_required: editingProject.skills_required || [],
      });
      setError('Failed to update project. Please try again.');
      console.error('Update project error:', err);
    } finally {
      setCreatingProject(false);
    }
  };

  const handleDeleteProject = async (id: number) => {
    if (!confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      return;
    }

    setDeletingProject(id);
    setError(null);

    // Optimistic update: remove project from UI immediately
    const previousProjects = [...projects];
    setProjects(prevProjects => prevProjects.filter(p => p.id !== id));

    try {
      const response = await api.deleteProject(id);
      if (response.error) {
        // Restore previous state if deletion failed
        setProjects(previousProjects);
        setError(`Error deleting project: ${response.error}`);
        setDeletingProject(null);
        return;
      }
      
      // Success! (204 No Content or successful response)
      setSuccessMessage('Project deleted successfully!');
      
      // Refresh projects list to ensure consistency with backend
      // Use functional update to ensure we're working with latest state
      await fetchProjects();
      
    } catch (err) {
      // Restore previous state if deletion failed
      setProjects(previousProjects);
      setError('Failed to delete project. Please try again.');
      console.error('Delete project error:', err);
    } finally {
      setDeletingProject(null);
    }
  };

  const startEditing = (project: Project) => {
    setEditingProject(project);
    setError(null);
    // Format dates for date input (YYYY-MM-DD)
    const formatDate = (dateString?: string) => {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toISOString().split('T')[0];
    };
    setProjectForm({
      title: project.title,
      description: project.description,
      status: project.status,
      start_date: formatDate(project.start_date),
      end_date: formatDate(project.end_date),
      skills_required: project.skills_required || [],
    });
    setShowCreateForm(true);
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'OPEN':
        return 'default';
      case 'CLOSED':
        return 'secondary';
      case 'DRAFT':
        return 'outline';
      default:
        return 'outline';
    }
  };

  return (
    <>
      <Head>
        <title>Corporate Dashboard - AA Educates</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <DashboardLayout backgroundClassName="bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
        <div className="space-y-8">
          {/* Success Message */}
          {successMessage && (
            <Card className="border-secondary/50 bg-secondary/10">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center">
                  <p className="text-secondary font-medium">{successMessage}</p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setSuccessMessage(null)}>
                  <X className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Error Message - Only show if not loading and it's not the initial load error */}
          {error && !loading && corporate && (
            <Card className="border-destructive">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center">
                  <p className="text-destructive font-medium">{error}</p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setError(null)}>
                  <X className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          )}

          {loading ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : error && !corporate ? (
            <Card className="border-destructive">
              <CardHeader>
                <CardTitle className="text-destructive">Error Loading Data</CardTitle>
                <CardDescription className="text-destructive">{error}</CardDescription>
              </CardHeader>
            </Card>
          ) : corporate && user ? (
            <>
              {/* Corporate Profile Header */}
              <Card className="border-primary/20">
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                    <div>
                      <CardTitle className="text-4xl md:text-5xl mb-2">
                        {corporate.company_name}
                      </CardTitle>
                      <CardDescription className="text-xl">{user.email}</CardDescription>
                      {corporate.industry && (
                        <Badge variant="secondary" className="mt-2">{corporate.industry}</Badge>
                      )}
                      {corporate.website && (
                        <Button asChild variant="link" className="mt-2">
                          <a href={corporate.website} target="_blank" rel="noopener noreferrer">
                            Visit Website
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </a>
                        </Button>
                      )}
                    </div>
                    <Badge variant="default" className="text-base px-4 py-2">
                      <Building2 className="mr-2 h-5 w-5" />
                      Corporate ID: {corporate.id}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Quick Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                    <Card className="bg-primary/10 border-primary/20">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-primary mb-1">Active Projects</p>
                            <p className="text-3xl font-bold text-primary">{projects.filter(p => p.status === 'OPEN').length}</p>
                          </div>
                          <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                            <FileText className="h-6 w-6 text-primary-foreground" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-secondary/10 border-secondary/20">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-secondary mb-1">Total Projects</p>
                            <p className="text-3xl font-bold text-secondary">{projects.length}</p>
                          </div>
                          <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center">
                            <FileText className="h-6 w-6 text-secondary-foreground" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-accent/10 border-accent/20">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-accent mb-1">Closed Projects</p>
                            <p className="text-3xl font-bold text-accent">{projects.filter(p => p.status === 'CLOSED').length}</p>
                          </div>
                          <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center">
                            <FileText className="h-6 w-6 text-accent-foreground" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>

              {/* CRUD Section - Projects */}
              <Card className="border-primary/20">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-3xl">My Projects</CardTitle>
                    <Button
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
                    >
                      <Plus className="mr-2 h-5 w-5" />
                      Create Project
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Create/Edit Form */}
                  {showCreateForm && (
                    <Card className="bg-primary/5 border-primary/20 mb-6">
                      <CardHeader>
                        <CardTitle>
                          {editingProject ? 'Edit Project' : 'Create New Project'}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <form onSubmit={editingProject ? handleUpdateProject : handleCreateProject} className="space-y-4">
                          <div>
                            <Label htmlFor="title">Title</Label>
                            <Input
                              id="title"
                              type="text"
                              value={projectForm.title}
                              onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                              className="mt-2"
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                              id="description"
                              value={projectForm.description}
                              onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                              className="mt-2"
                              rows={4}
                              required
                            />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <Label htmlFor="status">Status</Label>
                              <select
                                id="status"
                                value={projectForm.status}
                                onChange={(e) => setProjectForm({ ...projectForm, status: e.target.value })}
                                className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring mt-2"
                              >
                                <option value="DRAFT">Draft</option>
                                <option value="OPEN">Open</option>
                                <option value="CLOSED">Closed</option>
                                <option value="ARCHIVED">Archived</option>
                              </select>
                            </div>
                            <div>
                              <Label htmlFor="start_date">Start Date</Label>
                              <Input
                                id="start_date"
                                type="date"
                                value={projectForm.start_date}
                                onChange={(e) => setProjectForm({ ...projectForm, start_date: e.target.value })}
                                className="mt-2"
                              />
                            </div>
                            <div>
                              <Label htmlFor="end_date">End Date</Label>
                              <Input
                                id="end_date"
                                type="date"
                                value={projectForm.end_date}
                                onChange={(e) => setProjectForm({ ...projectForm, end_date: e.target.value })}
                                className="mt-2"
                              />
                            </div>
                          </div>
                          <div className="flex space-x-4">
                            <Button
                              type="submit"
                              disabled={creatingProject}
                            >
                              {creatingProject ? (
                                <>
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2"></div>
                                  {editingProject ? 'Updating...' : 'Creating...'}
                                </>
                              ) : (
                                editingProject ? 'Update Project' : 'Create Project'
                              )}
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              onClick={cancelForm}
                              disabled={creatingProject}
                            >
                              Cancel
                            </Button>
                          </div>
                        </form>
                      </CardContent>
                    </Card>
                  )}

                  {/* Projects List */}
                  {projects.length === 0 ? (
                    <div className="text-center py-12">
                      <CardDescription className="text-lg">No projects yet. Create your first project!</CardDescription>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {projects.map((project) => (
                        <Card
                          key={project.id}
                          className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-primary/20"
                        >
                          <CardHeader>
                            <div className="flex justify-between items-start">
                              <CardTitle className="group-hover:text-primary transition-colors">
                                {project.title}
                              </CardTitle>
                              <Badge variant={getStatusVariant(project.status)} className="text-xs uppercase tracking-wide">
                                {project.status}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <CardDescription className="line-clamp-3">
                              {project.description || 'No description'}
                            </CardDescription>
                            {project.start_date && (
                              <p className="text-xs text-muted-foreground">
                                Start: {new Date(project.start_date).toLocaleDateString()}
                              </p>
                            )}
                            <div className="flex space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => startEditing(project)}
                                disabled={deletingProject === project.id}
                                className="flex-1"
                              >
                                Edit
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDeleteProject(project.id)}
                                disabled={deletingProject === project.id || creatingProject}
                                className="flex-1"
                              >
                                {deletingProject === project.id ? (
                                  <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-destructive-foreground mr-2"></div>
                                    Deleting...
                                  </>
                                ) : (
                                  'Delete'
                                )}
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Dashboard Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-primary/20">
                  <CardHeader>
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <FileText className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="group-hover:text-primary transition-colors">Impact Reports</CardTitle>
                    <CardDescription>
                      Track the impact of your initiatives and view detailed analytics
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button asChild variant="ghost" className="w-full justify-between group-hover:text-primary">
                      <Link href="/corporate/impact">
                        View Reports
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>

                <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-secondary/20">
                  <CardHeader>
                    <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
                      <Users className="h-6 w-6 text-secondary" />
                    </div>
                    <CardTitle className="group-hover:text-secondary transition-colors">Student Engagement</CardTitle>
                    <CardDescription>
                      See student participation metrics and track engagement
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button asChild variant="ghost" className="w-full justify-between group-hover:text-secondary">
                      <Link href="/corporate/talent">
                        View Analytics
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>

                <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-accent/20">
                  <CardHeader>
                    <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                      <DollarSign className="h-6 w-6 text-accent" />
                    </div>
                    <CardTitle className="group-hover:text-accent transition-colors">Payments</CardTitle>
                    <CardDescription>
                      View transaction history and manage payments
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button asChild variant="ghost" className="w-full justify-between group-hover:text-accent">
                      <Link href="/corporate/settings">
                        View Payments
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </>
          ) : (
            <Card className="border-accent/20">
              <CardHeader>
                <CardTitle>No Corporate Partner Found</CardTitle>
                <CardDescription>Corporate Partner profile does not exist in the database.</CardDescription>
              </CardHeader>
            </Card>
          )}
        </div>
      </DashboardLayout>
    </>
  );
};

export default CorporateDashboard;
