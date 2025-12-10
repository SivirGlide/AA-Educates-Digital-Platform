import Head from 'next/head';
import Link from 'next/link';
import type { NextPage } from 'next';
import { useMemo, useState } from 'react';
import { DashboardLayout } from '@/src/components/layouts/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Badge } from '@/src/components/ui/badge';

const contentQueue = [
  {
    id: 1,
    title: 'Student success spotlight: Creative computing',
    type: 'Article',
    status: 'Scheduled',
    scheduled_for: '2025-11-15T09:00:00Z',
  },
  {
    id: 2,
    title: 'Corporate partner onboarding webinar',
    type: 'Event',
    status: 'Draft',
    scheduled_for: null,
  },
  {
    id: 3,
    title: 'Parent engagement toolkit',
    type: 'Resource',
    status: 'Published',
    scheduled_for: '2025-10-31T12:00:00Z',
  },
];

const AdminContentPage: NextPage = () => {
  const [filter, setFilter] = useState('ALL');

  const filteredContent = useMemo(() => {
    return contentQueue.filter((item) => (filter === 'ALL' ? true : item.status === filter));
  }, [filter]);

  return (
    <>
      <Head>
        <title>Admin Content | AA Educates</title>
      </Head>
      <DashboardLayout backgroundClassName="bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
        <div className="space-y-10">
          <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-3">
              <h1 className="text-3xl font-extrabold">Content hub</h1>
              <p className="text-muted-foreground max-w-3xl">Plan announcements, surface stories, and coordinate platform messaging.</p>
            </div>
            <div className="flex gap-3">
              <Button variant={filter === 'ALL' ? 'default' : 'outline'} onClick={() => setFilter('ALL')}>
                All
              </Button>
              <Button variant={filter === 'Scheduled' ? 'default' : 'outline'} onClick={() => setFilter('Scheduled')}>
                Scheduled
              </Button>
              <Button variant={filter === 'Draft' ? 'default' : 'outline'} onClick={() => setFilter('Draft')}>
                Drafts
              </Button>
              <Button variant={filter === 'Published' ? 'default' : 'outline'} onClick={() => setFilter('Published')}>
                Published
              </Button>
            </div>
          </header>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredContent.map((item) => (
              <Card key={item.id} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardHeader>
                  <CardTitle>{item.title}</CardTitle>
                  <CardDescription>Type: {item.type}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Status:</span>
                    <Badge variant={
                      item.status === 'Published' ? 'default' :
                      item.status === 'Scheduled' ? 'secondary' :
                      'outline'
                    }>
                      {item.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {item.scheduled_for ? `Scheduled for ${new Date(item.scheduled_for).toLocaleString()}` : 'Not scheduled yet'}
                  </p>
                  <div className="flex gap-3">
                    <Button asChild>
                      <Link href={`/admin/content?id=${item.id}`}>Edit</Link>
                    </Button>
                    <Button variant="outline">Preview</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </DashboardLayout>
    </>
  );
};

export default AdminContentPage;
