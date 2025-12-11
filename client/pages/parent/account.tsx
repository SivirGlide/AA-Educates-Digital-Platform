import Head from 'next/head';
import Link from 'next/link';
import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { DashboardLayout } from '@/src/components/layouts/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Label } from '@/src/components/ui/label';

interface ParentProfile {
  id: number;
  user: number;
  students: number[];
}

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
}

const ParentAccountPage: NextPage = () => {
  const [profile, setProfile] = useState<ParentProfile | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAccount = async () => {
      try {
        const profileId = localStorage.getItem('profileId');
        const userId = localStorage.getItem('userId');
        if (!profileId || !userId) {
          setError('Please login to view account details');
          setLoading(false);
          return;
        }

        const parentResponse = await api.getParent(parseInt(profileId, 10));
        if (parentResponse.error || !parentResponse.data) {
          setError(parentResponse.error || 'Unable to load account');
          setLoading(false);
          return;
        }
        setProfile(parentResponse.data as ParentProfile);

        const userResponse = await api.getUser(parseInt(userId, 10));
        if (userResponse.data) {
          setUser(userResponse.data as User);
        }
      } catch (err) {
        setError('Something went wrong while fetching account information');
      } finally {
        setLoading(false);
      }
    };

    fetchAccount();
  }, []);

  return (
    <>
      <Head>
        <title>Account | Parent Portal</title>
      </Head>
      <DashboardLayout backgroundClassName="bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
        <div className="space-y-10">
          <header className="space-y-3">
            <h1 className="text-3xl font-extrabold">Account information</h1>
            <p className="text-muted-foreground max-w-3xl">
              Keep your details up to date so we can stay in touch about your child's progress, enrichment opportunities, and impact
              stories.
            </p>
          </header>

          {loading ? (
            <div className="flex items-center justify-center min-h-[240px]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
            </div>
          ) : error ? (
            <Card className="border-destructive">
              <CardHeader>
                <CardTitle className="text-destructive">Account unavailable</CardTitle>
                <CardDescription className="text-destructive">{error}</CardDescription>
              </CardHeader>
            </Card>
          ) : profile && user ? (
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Personal details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3 text-sm">
                    <p><span className="font-medium">Name:</span> {user.first_name} {user.last_name}</p>
                    <p><span className="font-medium">Email:</span> {user.email}</p>
                    <p><span className="font-medium">Role:</span> {user.role.replace('_', ' ')}</p>
                    <p><span className="font-medium">Linked students:</span> {profile.students.length}</p>
                  </div>
                  <Button>Update contact details</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Communication preferences</CardTitle>
                  <CardDescription>
                    Choose the updates you'd like to receive from AA Educates.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-3" onSubmit={(event) => event.preventDefault()}>
                    <Label className="flex items-center justify-between gap-4">
                      <span>Student progress reports</span>
                      <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-input" />
                    </Label>
                    <Label className="flex items-center justify-between gap-4">
                      <span>Mentoring reminders</span>
                      <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-input" />
                    </Label>
                    <Label className="flex items-center justify-between gap-4">
                      <span>Community newsletters</span>
                      <input type="checkbox" className="h-4 w-4 rounded border-input" />
                    </Label>
                    <Label className="flex items-center justify-between gap-4">
                      <span>Workbooks & resources</span>
                      <input type="checkbox" className="h-4 w-4 rounded border-input" />
                    </Label>
                    <Button className="mt-3">Save preferences</Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          ) : null}
        </div>
      </DashboardLayout>
    </>
  );
};

export default ParentAccountPage;
