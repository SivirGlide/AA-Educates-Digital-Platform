import Head from 'next/head';
import Link from 'next/link';
import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { DashboardLayout } from '@/src/components/layouts/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Badge } from '@/src/components/ui/badge';

interface StudentProfile {
  id: number;
  user: number;
  bio: string;
  portfolio_link: string;
  badges: number[];
  certificates: number[];
  skills: number[];
}

interface StudentWithUser {
  profile: StudentProfile;
  name: string;
  email: string;
}

const ParentStudentsPage: NextPage = () => {
  const [students, setStudents] = useState<StudentWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const parentId = localStorage.getItem('profileId');
        if (!parentId) {
          setError('Please login to view students');
          setLoading(false);
          return;
        }

        const parentResponse = await api.getParent(parseInt(parentId, 10));
        if (parentResponse.error || !parentResponse.data) {
          setError(parentResponse.error || 'Unable to load parent record');
          setLoading(false);
          return;
        }

        const childIds: number[] = (parentResponse.data as any).students || [];
        if (childIds.length === 0) {
          setStudents([]);
          setLoading(false);
          return;
        }

        const childData = await Promise.all(
          childIds.map(async (id) => {
            const studentResponse = await api.getStudent(id);
            if (!studentResponse.data) return null;
            const userResponse = await api.getUser(studentResponse.data.user);
            return {
              profile: studentResponse.data as StudentProfile,
              name: `${userResponse.data?.first_name || 'Student'} ${userResponse.data?.last_name || ''}`.trim(),
              email: userResponse.data?.email || 'hello@aaeducates.com',
            };
          })
        );

        setStudents(childData.filter(Boolean) as StudentWithUser[]);
      } catch (err) {
        setError('Something went wrong while fetching students');
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  return (
    <>
      <Head>
        <title>Students | Parent Portal</title>
      </Head>
      <DashboardLayout backgroundClassName="bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
        <div className="space-y-10">
          <header className="space-y-3">
            <h1 className="text-3xl font-extrabold">My children</h1>
            <p className="text-muted-foreground max-w-3xl">
              Stay up to date with your child's learning journey. View a snapshot of achievements, projects, and the latest updates in
              one place.
            </p>
          </header>

          {loading ? (
            <div className="flex items-center justify-center min-h-[240px]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
            </div>
          ) : error ? (
            <Card className="border-destructive">
              <CardHeader>
                <CardTitle className="text-destructive">Students unavailable</CardTitle>
                <CardDescription className="text-destructive">{error}</CardDescription>
              </CardHeader>
            </Card>
          ) : students.length === 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>No students linked</CardTitle>
                <CardDescription>Once your child has been invited, their progress will appear here.</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild>
                  <Link href="/contact">Request an invite</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {students.map((student) => (
                <Card key={student.profile.id} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>{student.name}</CardTitle>
                      <Badge variant="secondary" className="text-xs uppercase tracking-wide">Student #{student.profile.id}</Badge>
                    </div>
                    <CardDescription>{student.email}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground leading-relaxed">{student.profile.bio || 'No bio provided yet.'}</p>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div>
                        <p className="text-2xl font-bold text-primary">{student.profile.badges?.length || 0}</p>
                        <p className="text-xs text-muted-foreground">Badges</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-secondary">{student.profile.certificates?.length || 0}</p>
                        <p className="text-xs text-muted-foreground">Certificates</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-accent">{student.profile.skills?.length || 0}</p>
                        <p className="text-xs text-muted-foreground">Skills</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Button asChild>
                        <Link href={`/parent/student/${student.profile.id}`}>View profile</Link>
                      </Button>
                      {student.profile.portfolio_link && (
                        <Button asChild variant="outline">
                          <Link href={student.profile.portfolio_link} target="_blank">Portfolio</Link>
                        </Button>
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

export default ParentStudentsPage;
