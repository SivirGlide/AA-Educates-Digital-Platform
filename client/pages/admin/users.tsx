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
import { Label } from '@/src/components/ui/label';

interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'pending' | 'inactive';
}

const formatLabel = (value: string) =>
  value
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

const AdminUsersPage: NextPage = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({ role: 'ALL', search: '' });

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.getUsers();
        
        if (response.error) {
          setError(response.error);
          setLoading(false);
          return;
        }

        if (!Array.isArray(response.data)) {
          setError('Invalid response format');
          setLoading(false);
          return;
        }

        // Map users to AdminUser format
        const nextUsers: AdminUser[] = response.data.map((user: any) => {
          // Format role name for display - handle both uppercase (from API) and lowercase
          const roleUpper = (user.role || '').toUpperCase();
          let roleDisplay = user.role || 'User';
          
          if (roleUpper === 'STUDENT') roleDisplay = 'Student';
          else if (roleUpper === 'PARENT') roleDisplay = 'Parent';
          else if (roleUpper === 'CORPORATE_PARTNER') roleDisplay = 'Corporate';
          else if (roleUpper === 'ADMIN') roleDisplay = 'Admin';
          else if (roleUpper === 'SCHOOL') roleDisplay = 'School';
          else {
            // If it's already in a readable format, just capitalize it properly
            roleDisplay = formatLabel(user.role || 'User');
          }

          // Get display name
          const name = user.first_name && user.last_name
            ? `${user.first_name} ${user.last_name}`.trim()
            : user.first_name || user.username || user.email?.split('@')[0] || 'Unknown User';

          return {
            id: user.id,
            name: name,
            email: user.email || 'No email',
            role: roleDisplay,
            status: user.is_active === false ? 'inactive' : 'active',
          };
        });

        setUsers(nextUsers);
      } catch (err) {
        setError('Unable to load users right now.');
        console.error('Error fetching users:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    return users
      .filter((user) => (filters.role === 'ALL' ? true : user.role === filters.role))
      .filter((user) => user.name.toLowerCase().includes(filters.search.toLowerCase()));
  }, [users, filters]);

  return (
    <>
      <Head>
        <title>Admin Users | AA Educates</title>
      </Head>
      <DashboardLayout backgroundClassName="bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
        <div className="space-y-10">
          <header className="space-y-3">
            <h1 className="text-3xl font-extrabold">User management</h1>
            <p className="text-muted-foreground max-w-3xl">Review people and organisations connected to AA Educates.</p>
          </header>

          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="grid gap-6 md:grid-cols-3">
                <div className="md:col-span-2">
                  <Label htmlFor="search">Search users</Label>
                  <Input
                    id="search"
                    type="text"
                    value={filters.search}
                    onChange={(event) => setFilters((prev) => ({ ...prev, search: event.target.value }))}
                    placeholder="Search by name"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="role">Role</Label>
                  <select
                    id="role"
                    value={filters.role}
                    onChange={(event) => setFilters((prev) => ({ ...prev, role: event.target.value }))}
                    className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring mt-2"
                  >
                    <option value="ALL">All roles</option>
                    <option value="Student">Students</option>
                    <option value="Parent">Parents</option>
                    <option value="Corporate">Corporate partners</option>
                    <option value="Admin">Admins</option>
                    <option value="School">Schools</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {loading ? (
            <div className="flex items-center justify-center min-h-[240px]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
            </div>
          ) : error ? (
            <Card className="border-destructive">
              <CardHeader>
                <CardTitle className="text-destructive">Users unavailable</CardTitle>
                <CardDescription className="text-destructive">{error}</CardDescription>
              </CardHeader>
            </Card>
          ) : filteredUsers.length === 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>No users match those filters</CardTitle>
                <CardDescription>Adjust your search or role filters and try again.</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" onClick={() => setFilters({ role: 'ALL', search: '' })}>
                  Clear filters
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-0 divide-y divide-border">
                {filteredUsers.map((user) => (
                  <div key={`${user.role}-${user.id}`} className="flex flex-col gap-4 px-6 py-5 md:flex-row md:items-center md:justify-between">
                    <div>
                      <h2 className="text-lg font-semibold">{user.name}</h2>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                      <div className="mt-2">
                        <span className="text-sm text-muted-foreground">Role: </span>
                        <Badge variant="secondary" className="text-xs uppercase tracking-wide">{user.role}</Badge>
                      </div>
                    </div>
                    <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
                      <Badge
                        variant={
                          user.status === 'active' ? 'default' :
                          user.status === 'pending' ? 'secondary' :
                          'outline'
                        }
                      >
                        {formatLabel(user.status)}
                      </Badge>
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/admin/user/${user.id}`}>View profile</Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </DashboardLayout>
    </>
  );
};

export default AdminUsersPage;
