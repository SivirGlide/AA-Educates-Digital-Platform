import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { api } from '../../../lib/api';
import { DashboardLayout } from '@/src/components/layouts/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Badge } from '@/src/components/ui/badge';
import { ArrowLeft } from 'lucide-react';

const formatLabel = (value: string) =>
  value
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

const formatRole = (role: string) => {
  const roleUpper = (role || '').toUpperCase();
  if (roleUpper === 'STUDENT') return 'Student';
  if (roleUpper === 'PARENT') return 'Parent';
  if (roleUpper === 'CORPORATE_PARTNER') return 'Corporate Partner';
  if (roleUpper === 'ADMIN') return 'Admin';
  if (roleUpper === 'SCHOOL') return 'School';
  return formatLabel(role || 'Unknown');
};

const AdminUserDetailPage: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [user, setUser] = useState<Record<string, any> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchUser = async () => {
      setLoading(true);
      setError(null);
      try {
        const numericId = Array.isArray(id) ? parseInt(id[0], 10) : parseInt(id, 10);
        if (Number.isNaN(numericId)) {
          setError('Invalid user id');
          setLoading(false);
          return;
        }
        const response = await api.getUser(numericId);
        if (response.error) {
          setError(response.error);
        } else {
          setUser(response.data || null);
        }
      } catch (err) {
        setError('Unable to load user data.');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const displayName = user?.first_name && user?.last_name
    ? `${user.first_name} ${user.last_name}`.trim()
    : user?.first_name || user?.username || 'Unknown user';

  return (
    <>
      <Head>
        <title>Admin User Detail | AA Educates</title>
      </Head>
      <DashboardLayout backgroundClassName="bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
        <div className="space-y-8">
          <Button asChild variant="ghost" className="mb-4">
            <Link href="/admin/users">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to users
            </Link>
          </Button>

          {loading ? (
            <div className="flex items-center justify-center min-h-[240px]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
            </div>
          ) : error ? (
            <Card className="border-destructive">
              <CardHeader>
                <CardTitle className="text-destructive">User unavailable</CardTitle>
                <CardDescription className="text-destructive">{error}</CardDescription>
              </CardHeader>
            </Card>
          ) : user ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-3xl">{displayName}</CardTitle>
                    <CardDescription className="text-lg mt-2">{user.email || 'No email available'}</CardDescription>
                  </div>
                  <Badge variant="secondary" className="text-sm uppercase tracking-wide">
                    {formatRole(user.role || 'Unknown')}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-3">
                    <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Profile</h2>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Role:</span>
                        <Badge variant="outline">{formatRole(user.role || 'Unknown')}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Joined: {user.date_joined ? new Date(user.date_joined).toLocaleDateString() : 'Unknown'}
                      </p>
                      {user.username && (
                        <p className="text-sm text-muted-foreground">
                          Username: {user.username}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Status</h2>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Active:</span>
                        <Badge variant={user.is_active === false ? 'outline' : 'default'}>
                          {user.is_active === false ? 'No' : 'Yes'}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Verified:</span>
                        <Badge variant={user.is_verified ? 'default' : 'outline'}>
                          {user.is_verified ? 'Yes' : 'No'}
                        </Badge>
                      </div>
                      {user.is_staff && (
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">Staff:</span>
                          <Badge variant="default">Yes</Badge>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h2 className="text-lg font-semibold mb-3">Recent activity</h2>
                  <p className="text-sm text-muted-foreground">Activity timeline will appear here once analytics are connected.</p>
                </div>
              </CardContent>
            </Card>
          ) : null}
        </div>
      </DashboardLayout>
    </>
  );
};

export default AdminUserDetailPage;
