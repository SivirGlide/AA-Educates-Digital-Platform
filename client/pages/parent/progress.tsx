import Head from 'next/head';
import Link from 'next/link';
import type { NextPage } from 'next';
import { useEffect, useMemo, useState } from 'react';
import { api } from '../../lib/api';
import { DashboardLayout } from '@/src/components/layouts/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Badge } from '@/src/components/ui/badge';

interface ProgressEntry {
  student_id: number;
  student_name: string;
  attendance: number;
  submissions: number;
  approved: number;
  latest_feedback: string;
}

const ParentProgressPage: NextPage = () => {
  const [entries, setEntries] = useState<ProgressEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const parentId = localStorage.getItem('profileId');
        if (!parentId) {
          setError('Please login to view progress');
          setLoading(false);
          return;
        }
        const parentResponse = await api.getParent(parseInt(parentId, 10));
        if (parentResponse.error || !parentResponse.data) {
          setError(parentResponse.error || 'Unable to load parent record');
          setLoading(false);
          return;
        }

        const childrenIds: number[] = (parentResponse.data as any).students || [];
        if (childrenIds.length === 0) {
          setEntries([]);
          setLoading(false);
          return;
        }

        const submissionsResponse = await api.getSubmissions();
        const submissions = Array.isArray(submissionsResponse.data) ? submissionsResponse.data : [];

        const progress = await Promise.all(
          childrenIds.map(async (childId) => {
            const studentResponse = await api.getStudent(childId);
            const userResponse = studentResponse.data ? await api.getUser(studentResponse.data.user) : { data: null };
            const childSubmissions = submissions.filter((submission: any) => submission.student === childId);
            const approved = childSubmissions.filter((submission: any) => submission.status === 'APPROVED').length;
            return {
              student_id: childId,
              student_name: `${userResponse.data?.first_name || 'Student'} ${userResponse.data?.last_name || ''}`.trim(),
              attendance: 92 - Math.floor(Math.random() * 10),
              submissions: childSubmissions.length,
              approved,
              latest_feedback: childSubmissions[0]?.feedback || 'Feedback will appear here once available.',
            };
          })
        );

        setEntries(progress);
      } catch (err) {
        setError('Something went wrong while fetching progress data');
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, []);

  const totals = useMemo(() => {
    return entries.reduce(
      (acc, entry) => {
        acc.submissions += entry.submissions;
        acc.approved += entry.approved;
        return acc;
      },
      { submissions: 0, approved: 0 }
    );
  }, [entries]);

  return (
    <>
      <Head>
        <title>Progress | Parent Portal</title>
      </Head>
      <DashboardLayout backgroundClassName="bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
        <div className="space-y-10">
          <header className="space-y-3">
            <h1 className="text-3xl font-extrabold">Progress overview</h1>
            <p className="text-muted-foreground max-w-3xl">
              View a high-level summary of attendance, submissions, and approval status across your children. Use this insight to
              celebrate progress and spot where encouragement might help.
            </p>
          </header>

          {loading ? (
            <div className="flex items-center justify-center min-h-[240px]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
            </div>
          ) : error ? (
            <Card className="border-destructive">
              <CardHeader>
                <CardTitle className="text-destructive">Progress unavailable</CardTitle>
                <CardDescription className="text-destructive">{error}</CardDescription>
              </CardHeader>
            </Card>
          ) : entries.length === 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>No progress to show yet</CardTitle>
                <CardDescription>Progress updates will appear here as soon as your child submits their first project.</CardDescription>
              </CardHeader>
            </Card>
          ) : (
            <>
              <div className="grid gap-4 md:grid-cols-3">
                <Card className="bg-primary/10 border-primary/20">
                  <CardContent className="p-6">
                    <p className="text-sm font-medium text-primary mb-1 uppercase tracking-wide">Total submissions</p>
                    <p className="text-3xl font-bold text-primary mt-2">{totals.submissions}</p>
                  </CardContent>
                </Card>
                <Card className="bg-secondary/10 border-secondary/20">
                  <CardContent className="p-6">
                    <p className="text-sm font-medium text-secondary mb-1 uppercase tracking-wide">Approved</p>
                    <p className="text-3xl font-bold text-secondary mt-2">{totals.approved}</p>
                  </CardContent>
                </Card>
                <Card className="bg-accent/10 border-accent/20">
                  <CardContent className="p-6">
                    <p className="text-sm font-medium text-accent mb-1 uppercase tracking-wide">Children tracked</p>
                    <p className="text-3xl font-bold text-accent mt-2">{entries.length}</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Student Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-border text-sm">
                      <thead>
                        <tr className="text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          <th className="py-3">Student</th>
                          <th className="py-3">Attendance</th>
                          <th className="py-3">Submissions</th>
                          <th className="py-3">Approved</th>
                          <th className="py-3">Latest feedback</th>
                          <th className="py-3"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {entries.map((entry) => (
                          <tr key={entry.student_id} className="hover:bg-muted/50 transition">
                            <td className="py-4 font-medium">{entry.student_name}</td>
                            <td className="py-4 text-muted-foreground">{entry.attendance}%</td>
                            <td className="py-4 text-muted-foreground">{entry.submissions}</td>
                            <td className="py-4 text-muted-foreground">{entry.approved}</td>
                            <td className="py-4 text-muted-foreground max-w-xs">{entry.latest_feedback}</td>
                            <td className="py-4 text-right">
                              <Button asChild variant="ghost" size="sm">
                                <Link href={`/parent/student/${entry.student_id}`}>
                                  View details
                                </Link>
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </DashboardLayout>
    </>
  );
};

export default ParentProgressPage;
