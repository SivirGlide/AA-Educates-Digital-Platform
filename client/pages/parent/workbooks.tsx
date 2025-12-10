import Head from 'next/head';
import Link from 'next/link';
import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { DashboardLayout } from '@/src/components/layouts/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Badge } from '@/src/components/ui/badge';

interface Workbook {
  id: number;
  title: string;
  description: string;
  price: number;
  url: string;
}

const ParentWorkbooksPage: NextPage = () => {
  const [workbooks, setWorkbooks] = useState<Workbook[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWorkbooks = async () => {
      try {
        const response = await api.getProjects();
        if (response.error || !Array.isArray(response.data)) {
          setError(response.error || 'Unable to load workbooks');
        } else {
          const mapped = (response.data as any[]).slice(0, 6).map((item, index) => ({
            id: item.id,
            title: item.title || `Workbook ${index + 1}`,
            description: item.description || 'Printable workbook with activities, reflection questions, and extension tasks.',
            price: 9.99 + index,
            url: '/student/resources'
          }));
          setWorkbooks(mapped);
        }
      } catch (err) {
        setError('Something went wrong while fetching workbooks');
      } finally {
        setLoading(false);
      }
    };

    fetchWorkbooks();
  }, []);

  return (
    <>
      <Head>
        <title>Workbooks | Parent Portal</title>
      </Head>
      <DashboardLayout backgroundClassName="bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
        <div className="space-y-10">
          <header className="space-y-3">
            <h1 className="text-3xl font-extrabold">Workbooks & enrichment packs</h1>
            <p className="text-muted-foreground max-w-3xl">
              Download activity packs that extend project learning at home. Each workbook is designed to support scaffolding,
              reflection, and family conversation.
            </p>
          </header>

          {loading ? (
            <div className="flex items-center justify-center min-h-[240px]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
            </div>
          ) : error ? (
            <Card className="border-destructive">
              <CardHeader>
                <CardTitle className="text-destructive">Workbooks unavailable</CardTitle>
                <CardDescription className="text-destructive">{error}</CardDescription>
              </CardHeader>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {workbooks.map((workbook) => (
                <Card key={workbook.id} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>{workbook.title}</CardTitle>
                      <Badge variant="secondary">£{workbook.price.toFixed(2)}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <CardDescription className="leading-relaxed">{workbook.description}</CardDescription>
                    <div className="flex gap-3">
                      <Button asChild>
                        <Link href={workbook.url}>View preview</Link>
                      </Button>
                      <Button variant="outline">Add to basket</Button>
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

export default ParentWorkbooksPage;
