import Head from 'next/head';
import Link from 'next/link';
import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { DashboardLayout } from '@/src/components/layouts/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Badge } from '@/src/components/ui/badge';

interface MentoringSession {
  id: number;
  mentor_name: string;
  topic: string;
  scheduled_at: string;
  duration_minutes: number;
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
  notes: string;
}

const StudentMentoringPage: NextPage = () => {
  const [sessions, setSessions] = useState<MentoringSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await api.getProjects();
        if (response.error || !Array.isArray(response.data)) {
          setError(response.error || 'Unable to load mentoring sessions');
        } else {
          const mockSessions = (response.data as any[]).slice(0, 4).map((project, index) => ({
            id: project.id,
            mentor_name: ['Amina', 'Daniel', 'Priya', 'Karl'][index % 4] + ' Johnson',
            topic: project.title,
            scheduled_at: new Date(Date.now() + index * 86400000).toISOString(),
            duration_minutes: 45,
            status: (index % 3 === 2 ? 'COMPLETED' : 'SCHEDULED') as 'COMPLETED' | 'CANCELLED' | 'SCHEDULED',
            notes: project.description || 'Overview of goals and expectations.'
          }));
          setSessions(mockSessions);
        }
      } catch (err) {
        setError('Something went wrong while fetching mentoring sessions');
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  return (
    <>
      <Head>
        <title>Mentoring | AA Educates</title>
      </Head>
      <DashboardLayout backgroundClassName="bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
        <div className="space-y-10">
          <header className="flex flex-col gap-4">
            <h1 className="text-3xl font-extrabold">Mentoring hub</h1>
            <p className="text-muted-foreground max-w-3xl">
              Prepare for upcoming sessions, reflect on previous conversations, and access personalised guidance from mentors across
              the AA Educates community.
            </p>
            <Badge variant="secondary" className="w-fit">
              <span className="h-2.5 w-2.5 rounded-full bg-secondary mr-2" /> Accepting new mentoring requests this week
            </Badge>
          </header>

          {loading ? (
            <div className="flex items-center justify-center min-h-[300px]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
            </div>
          ) : error ? (
            <div className="max-w-2xl mx-auto">
              <Card className="border-destructive">
                <CardHeader>
                  <CardTitle className="text-destructive">Mentoring unavailable</CardTitle>
                  <CardDescription className="text-destructive">{error}</CardDescription>
                </CardHeader>
              </Card>
            </div>
          ) : (
            <div className="grid gap-6 lg:grid-cols-3">
              <section className="lg:col-span-2 space-y-6">
                {sessions.map((session) => (
                  <Card key={session.id} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-primary/20">
                    <CardHeader>
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                          <CardTitle>{session.topic}</CardTitle>
                          <CardDescription>With mentor {session.mentor_name}</CardDescription>
                        </div>
                        <Badge
                          variant={session.status === 'COMPLETED' ? 'default' : session.status === 'CANCELLED' ? 'destructive' : 'secondary'}
                          className="text-xs uppercase tracking-wide"
                        >
                          {session.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <dl className="grid gap-2 text-sm sm:grid-cols-2">
                        <div className="flex justify-between sm:block">
                          <dt className="font-medium text-muted-foreground">Date</dt>
                          <dd>{new Date(session.scheduled_at).toLocaleString()}</dd>
                        </div>
                        <div className="flex justify-between sm:block">
                          <dt className="font-medium text-muted-foreground">Duration</dt>
                          <dd>{session.duration_minutes} minutes</dd>
                        </div>
                      </dl>
                      <CardDescription className="leading-relaxed">{session.notes}</CardDescription>
                      <div className="flex flex-wrap gap-3">
                        <Button>
                          Join session
                        </Button>
                        <Button variant="outline" size="sm">
                          Reschedule
                        </Button>
                        <Button variant="outline" size="sm">
                          Add reflection
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </section>

              <aside>
                <Card className="border-primary/20">
                  <CardContent className="space-y-6 pt-6">
                    <section className="space-y-3">
                      <CardTitle>Mentoring tips</CardTitle>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex items-start gap-2">
                          <span className="mt-1 h-2 w-2 rounded-full bg-primary" /> Prepare questions in advance to make the most of each session.
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="mt-1 h-2 w-2 rounded-full bg-primary" /> Share your goals and what success looks like for you.
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="mt-1 h-2 w-2 rounded-full bg-primary" /> Follow up with notes or next steps to keep momentum going.
                        </li>
                      </ul>
                    </section>
                    <section className="space-y-3">
                      <CardTitle>Need a new mentor?</CardTitle>
                      <CardDescription>Let us know the support you're looking for and we'll match you with someone from our partner network.</CardDescription>
                      <Button asChild>
                        <Link href="/contact">
                          Request mentor
                        </Link>
                      </Button>
                    </section>
                  </CardContent>
                </Card>
              </aside>
            </div>
          )}
        </div>
      </DashboardLayout>
    </>
  );
};

export default StudentMentoringPage;
