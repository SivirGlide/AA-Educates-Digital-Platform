import Head from 'next/head';
import Link from 'next/link';
import type { NextPage } from 'next';
import { useEffect, useMemo, useState } from 'react';
import { api } from '../../lib/api';
import { Project } from '../../lib/projects.api';
import { DashboardLayout } from '@/src/components/layouts/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Badge } from '@/src/components/ui/badge';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import { ArrowRight } from 'lucide-react';

const CorporateProjectsPage: NextPage = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({ status: 'ALL', search: '' });

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await api.getProjects();
        if (response.error || !Array.isArray(response.data)) {
          setError(response.error || 'Unable to load projects');
        } else {
          const profileId = parseInt(localStorage.getItem('profileId') || '0', 10);
          const ownProjects = response.data.filter((project: Project) => project.created_by === profileId);
          setProjects(ownProjects as Project[]);
        }
      } catch (err) {
        setError('Something went wrong while fetching projects');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const filtered = useMemo(() => {
    return projects
      .filter((project) => (filters.status === 'ALL' ? true : project.status === filters.status))
      .filter((project) => project.title.toLowerCase().includes(filters.search.toLowerCase()));
  }, [projects, filters]);

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
        <title>Corporate Projects | AA Educates</title>
      </Head>
      <DashboardLayout backgroundClassName="bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
        <div className="space-y-10">
          <header className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-3xl font-extrabold">Projects</h1>
              <p className="text-muted-foreground max-w-2xl mt-2">
                Manage live briefs, monitor progress, and revisit archived collaborations. Create a new opportunity to engage AA Educates learners.
              </p>
            </div>
            <Button asChild>
              <Link href="/corporate/project/new">
                New project
              </Link>
            </Button>
          </header>

          <Card className="border-primary/20">
            <CardContent className="p-6 space-y-4">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <Label htmlFor="search">Search projects</Label>
                  <Input
                    id="search"
                    type="text"
                    value={filters.search}
                    onChange={(event) => setFilters((prev) => ({ ...prev, search: event.target.value }))}
                    placeholder="Search by title"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <select
                    id="status"
                    value={filters.status}
                    onChange={(event) => setFilters((prev) => ({ ...prev, status: event.target.value }))}
                    className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring mt-2"
                  >
                    <option value="ALL">All</option>
                    <option value="DRAFT">Draft</option>
                    <option value="OPEN">Open</option>
                    <option value="CLOSED">Closed</option>
                    <option value="ARCHIVED">Archived</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {loading ? (
            <div className="flex items-center justify-center min-h-[240px]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
            </div>
          ) : error ? (
            <Card className="border-destructive">
              <CardHeader>
                <CardTitle className="text-destructive">Projects unavailable</CardTitle>
                <CardDescription className="text-destructive">{error}</CardDescription>
              </CardHeader>
            </Card>
          ) : filtered.length === 0 ? (
            <Card className="border-primary/20 text-center">
              <CardHeader>
                <CardTitle>No projects found</CardTitle>
                <CardDescription>Try adjusting the filters or create a new brief to get started.</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" onClick={() => setFilters({ status: 'ALL', search: '' })}>
                  Clear filters
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filtered.map((project) => (
                <Card key={project.id} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-primary/20">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="group-hover:text-primary transition-colors">{project.title}</CardTitle>
                      <Badge variant={getStatusVariant(project.status)} className="text-xs uppercase tracking-wide">
                        {project.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <CardDescription className="leading-relaxed">
                      {project.description || 'No description provided.'}
                    </CardDescription>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Created {new Date(project.created_at).toLocaleDateString()}</span>
                      {project.start_date && <span>Starts {new Date(project.start_date).toLocaleDateString()}</span>}
                    </div>
                    <div className="flex gap-3">
                      <Button asChild variant="default" size="sm">
                        <Link href={`/corporate/dashboard?project=${project.id}`}>
                          Manage
                        </Link>
                      </Button>
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/student/project/${project.id}`}>
                          View as student
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </DashboardLayout>
    </>
  );
};

export default CorporateProjectsPage;
