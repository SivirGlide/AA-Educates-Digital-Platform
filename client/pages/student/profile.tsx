import Head from 'next/head';
import Link from 'next/link';
import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { DashboardLayout } from '@/src/components/layouts/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Badge } from '@/src/components/ui/badge';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import type { StudentProfile, User } from '../../lib/users.api';

const StudentProfilePage: NextPage = () => {
  const [student, setStudent] = useState<any>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileId = localStorage.getItem('profileId');
        const userId = localStorage.getItem('userId');

        if (!profileId || !userId) {
          setError('Please login to view your profile');
          setLoading(false);
          return;
        }

        const studentResponse = await api.getStudent(parseInt(profileId, 10));
        if (studentResponse.error || !studentResponse.data) {
          setError(studentResponse.error || 'Unable to load student profile');
          setLoading(false);
          return;
        }

        setStudent(studentResponse.data as StudentProfile);

        const userResponse = await api.getUser(parseInt(userId, 10));
        if (userResponse.data && typeof userResponse.data === 'object' && 'id' in userResponse.data) {
          setUser(userResponse.data as User);
        }
      } catch (err) {
        setError('Something went wrong while fetching your profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return (
    <>
      <Head>
        <title>Student Profile | AA Educates</title>
      </Head>
      <DashboardLayout backgroundClassName="bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
        {loading ? (
          <div className="flex items-center justify-center min-h-[360px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
          </div>
        ) : error ? (
          <div className="max-w-2xl mx-auto">
            <Card className="border-destructive">
              <CardHeader>
                <CardTitle className="text-destructive">Profile unavailable</CardTitle>
                <CardDescription className="text-destructive">{error}</CardDescription>
              </CardHeader>
            </Card>
          </div>
        ) : student && user ? (
          <div className="space-y-10">
            <Card className="border-primary/20">
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                  <div>
                    <CardTitle className="text-4xl mb-2">
                      {user.first_name || user.username} {user.last_name}
                    </CardTitle>
                    <CardDescription>{user.email}</CardDescription>
                    <Badge variant="secondary" className="mt-2 uppercase tracking-wide">
                      Role: {user.role.replace('_', ' ')}
                    </Badge>
                  </div>
                  <div className="flex gap-4">
                    <Button asChild variant="outline">
                      <Link href="/student/settings">
                        Edit profile
                      </Link>
                    </Button>
                    {student.portfolio_link && (
                      <Button asChild>
                        <Link href={student.portfolio_link} target="_blank">
                          View portfolio
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              {student.bio && (
                <CardContent>
                  <p className="leading-relaxed">{student.bio}</p>
                </CardContent>
              )}
            </Card>

            <div className="grid gap-6 md:grid-cols-2">
              <Card className="border-primary/20">
                <CardHeader>
                  <CardTitle>Contact & documents</CardTitle>
                </CardHeader>
                <CardContent>
                  <dl className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">CV / Resume</dt>
                      <dd>
                        {student.cv ? (
                          <a href={student.cv} className="text-primary font-medium hover:underline">Download</a>
                        ) : (
                          'Not uploaded'
                        )}
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Portfolio link</dt>
                      <dd>
                        {student.portfolio_link ? (
                          <a href={student.portfolio_link} className="text-primary font-medium hover:underline">Open link</a>
                        ) : (
                          'Not provided'
                        )}
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">School ID</dt>
                      <dd>{student.school ?? 'Not assigned'}</dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>

              <Card className="border-secondary/20">
                <CardHeader>
                  <CardTitle>At a glance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="rounded-xl bg-primary/10 py-4">
                      <p className="text-3xl font-bold text-primary">{student.badges?.length ?? 0}</p>
                      <p className="text-xs uppercase tracking-wide text-primary/70 mt-1">Badges</p>
                    </div>
                    <div className="rounded-xl bg-secondary/10 py-4">
                      <p className="text-3xl font-bold text-secondary">{student.certificates?.length ?? 0}</p>
                      <p className="text-xs uppercase tracking-wide text-secondary/70 mt-1">Certificates</p>
                    </div>
                    <div className="rounded-xl bg-accent/10 py-4">
                      <p className="text-3xl font-bold text-accent">{student.skills?.length ?? 0}</p>
                      <p className="text-xs uppercase tracking-wide text-accent/70 mt-1">Skills</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle>Update your profile</CardTitle>
              </CardHeader>
              <CardContent>
                <form className="grid gap-6 md:grid-cols-2" onSubmit={(event) => event.preventDefault()}>
                  <div className="md:col-span-2">
                    <Label htmlFor="bio">Professional summary</Label>
                    <textarea
                      id="bio"
                      rows={4}
                      defaultValue={student.bio}
                      className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring mt-2"
                      placeholder="Share your interests, passions, and goals"
                    />
                  </div>
                  <div>
                    <Label htmlFor="cv">CV link</Label>
                    <Input
                      id="cv"
                      type="url"
                      defaultValue={student.cv}
                      className="mt-2"
                      placeholder="https://..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="portfolio">Portfolio link</Label>
                    <Input
                      id="portfolio"
                      type="url"
                      defaultValue={student.portfolio_link}
                      className="mt-2"
                      placeholder="https://..."
                    />
                  </div>
                  <div className="md:col-span-2 flex justify-end">
                    <Button type="submit">
                      Save changes
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        ) : null}
      </DashboardLayout>
    </>
  );
};

export default StudentProfilePage;
