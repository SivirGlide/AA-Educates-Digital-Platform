import Head from 'next/head';
import Link from 'next/link';
import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { DashboardLayout } from '@/src/components/layouts/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Badge } from '@/src/components/ui/badge';

interface Resource {
  id: number;
  title: string;
  description: string;
  category: string;
  url: string;
}

const StudentResourcesPage: NextPage = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await api.getProjects();
        if (response.error || !Array.isArray(response.data)) {
          setError(response.error || 'Unable to load resources');
        } else {
          const mapped = (response.data as any[]).slice(0, 6).map((item, index) => ({
            id: item.id,
            title: item.title || `Resource ${index + 1}`,
            description: item.description || 'Download learning packs, project templates, and toolkits to support your work.',
            category: ['Guide', 'Worksheet', 'Video', 'Presentation'][index % 4],
            url: '/student/resources'
          }));
          setResources(mapped);
        }
      } catch (err) {
        setError('Something went wrong while fetching resources');
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, []);

  return (
    <>
      <Head>
        <title>Resources | AA Educates</title>
      </Head>
      <DashboardLayout backgroundClassName="bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
        <div className="space-y-10">
          <header className="space-y-3">
            <h1 className="text-3xl font-extrabold">Resource library</h1>
            <p className="text-muted-foreground max-w-3xl">
              Browse learning packs, project templates, and videos curated by mentors and educators. New resources are added every
              month to support your learning journey.
            </p>
          </header>

          {loading ? (
            <div className="flex items-center justify-center min-h-[280px]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
            </div>
          ) : error ? (
            <div className="max-w-2xl mx-auto">
              <Card className="border-destructive">
                <CardHeader>
                  <CardTitle className="text-destructive">Resources unavailable</CardTitle>
                  <CardDescription className="text-destructive">{error}</CardDescription>
                </CardHeader>
              </Card>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {resources.map((resource) => (
                <Card key={resource.id} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-primary/20">
                  <CardHeader>
                    <Badge variant="secondary" className="w-fit text-xs uppercase tracking-wide">
                      {resource.category}
                    </Badge>
                    <CardTitle>{resource.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <CardDescription className="leading-relaxed">{resource.description}</CardDescription>
                    <div className="flex gap-3">
                      <Button asChild>
                        <Link href={resource.url}>
                          Open resource
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm">
                        Save for later
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

export default StudentResourcesPage;
