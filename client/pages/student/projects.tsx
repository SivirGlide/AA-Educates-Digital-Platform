import Head from 'next/head';
import Link from 'next/link';
import type { NextPage } from 'next';
import { useEffect, useMemo, useState } from 'react';
import { api } from '../../lib/api';
import { DashboardLayout } from '@/src/components/layouts/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Badge } from '@/src/components/ui/badge';
import { Input } from '@/src/components/ui/input';
import { ArrowRight } from 'lucide-react';

interface Project {
  id: number;
  title: string;
  description: string;
  status: string;
  start_date: string | null;
  end_date: string | null;
  created_by: number;
}

const StudentProjectsPage: NextPage = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({ status: 'OPEN', search: '' });

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await api.getProjects();
        if (response.error || !Array.isArray(response.data)) {
          setError(response.error || 'Unable to load projects');
        } else {
          setProjects(response.data as Project[]);
        }
      } catch (err) {
        setError('Something went wrong while fetching projects');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const filteredProjects = useMemo(() => {
    return projects
      .filter((project) => (filters.status === 'ALL' ? true : project.status === filters.status))
      .filter((project) => project.title.toLowerCase().includes(filters.search.toLowerCase()));
  }, [projects, filters]);

  return (
    <>
      <Head>
        <title>Student Projects | AA Educates</title>
      </Head>
      <DashboardLayout backgroundClassName="bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
        <div className="space-y-8">
          <header className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-3xl font-extrabold">Projects marketplace</h1>
              <p className="text-muted-foreground mt-2 max-w-2xl">
                Explore live briefs from corporate partners, revisit accepted projects, and track your submissions in one place.
              </p>
            </div>
            <Card className="border-primary/20">
              <CardContent className="p-4 flex flex-col sm:flex-row gap-4 sm:items-center">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Filter</span>
                  <select
                    value={filters.status}
                    onChange={(event) => setFilters((prev) => ({ ...prev, status: event.target.value }))}
                    className="rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="OPEN">Open projects</option>
                    <option value="DRAFT">Draft</option>
                    <option value="CLOSED">Completed</option>
                    <option value="ALL">All projects</option>
                  </select>
                </div>
                <Input
                  type="search"
                  placeholder="Search projects"
                  className="flex-1"
                  value={filters.search}
                  onChange={(event) => setFilters((prev) => ({ ...prev, search: event.target.value }))}
                />
              </CardContent>
            </Card>
          </header>

          {loading ? (
            <div className="flex items-center justify-center min-h-[300px]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
            </div>
          ) : error ? (
            <div className="max-w-2xl mx-auto">
              <Card className="border-destructive">
                <CardHeader>
                  <CardTitle className="text-destructive">Projects unavailable</CardTitle>
                  <CardDescription className="text-destructive">{error}</CardDescription>
                </CardHeader>
              </Card>
            </div>
          ) : filteredProjects.length === 0 ? (
            <Card className="max-w-2xl mx-auto text-center border-primary/20">
              <CardHeader>
                <CardTitle>No projects match your filters</CardTitle>
                <CardDescription>
                  Adjust your filters or check back soon—new opportunities are added regularly by our community partners.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => setFilters({ status: 'OPEN', search: '' })}>
                  Reset filters
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredProjects.map((project) => (
                <Card
                  key={project.id}
                  className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-primary/20"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between text-xs uppercase tracking-wide">
                      <Badge
                        variant={
                          project.status === 'OPEN'
                            ? 'default'
                            : project.status === 'CLOSED'
                            ? 'secondary'
                            : 'outline'
                        }
                        className="text-xs"
                      >
                        {project.status}
                      </Badge>
                      {project.start_date && (
                        <span className="text-muted-foreground">Starts {new Date(project.start_date).toLocaleDateString()}</span>
                      )}
                    </div>
                    <CardTitle className="group-hover:text-primary transition-colors">
                      {project.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <CardDescription className="leading-relaxed line-clamp-3">
                      {project.description || 'No description provided for this project.'}
                    </CardDescription>
                    <div className="flex justify-between items-center">
                      <Button asChild variant="ghost" size="sm">
                        <Link href={`/student/project/${project.id}`}>
                          View details
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                      {project.end_date && (
                        <span className="text-xs text-muted-foreground">Due {new Date(project.end_date).toLocaleDateString()}</span>
                      )}
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

export default StudentProjectsPage;
