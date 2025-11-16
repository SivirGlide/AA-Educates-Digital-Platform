import Head from 'next/head';
import Link from 'next/link';
import type { NextPage } from 'next';
import { useEffect, useMemo, useState } from 'react';
import { api } from '../../lib/api';

const adminNavLinks = [
  { href: '/admin/dashboard', label: 'Dashboard' },
  { href: '/admin/users', label: 'Users' },
  { href: '/admin/content', label: 'Content' },
  { href: '/admin/analytics', label: 'Analytics' },
  { href: '/admin/payments', label: 'Payments' },
  { href: '/admin/crm', label: 'CRM' },
  { href: '/admin/roles', label: 'Roles' },
  { href: '/admin/settings', label: 'Settings' }
];

const AdminNav: React.FC<{ active: string }> = ({ active }) => (
  <nav className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200 sticky top-0 z-40">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
        >
          AA Educates
        </Link>
        <Link
          href="/logout"
          className="inline-flex lg:hidden items-center px-3 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50"
        >
          Logout
        </Link>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {adminNavLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
              link.href === active
                ? 'bg-blue-600 text-white shadow'
                : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
            }`}
          >
            {link.label}
          </Link>
        ))}
        <Link
          href="/logout"
          className="hidden lg:inline-flex items-center px-3 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50"
        >
          Logout
        </Link>
      </div>
    </div>
  </nav>
);

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
        const [students, parents, corporates] = await Promise.all([
          api.getStudents(),
          api.getParents(),
          api.getCorporatePartners(),
        ]);

        const nextUsers: AdminUser[] = [];

        if (Array.isArray(students.data)) {
          students.data.forEach((student: any) => {
            nextUsers.push({
              id: student.id || student.user || Math.random(),
              name: student.full_name || `${student.first_name || 'Student'} ${student.last_name || ''}`.trim(),
              email: student.email || student.user_email || 'unknown@example.com',
              role: 'Student',
              status: student.is_active === false ? 'inactive' : 'active',
            });
          });
        }

        if (Array.isArray(parents.data)) {
          parents.data.forEach((parent: any) => {
            nextUsers.push({
              id: parent.id || parent.user || Math.random(),
              name: parent.full_name || `${parent.first_name || 'Parent'} ${parent.last_name || ''}`.trim(),
              email: parent.email || parent.user_email || 'unknown@example.com',
              role: 'Parent',
              status: parent.is_active === false ? 'inactive' : 'active',
            });
          });
        }

        if (Array.isArray(corporates.data)) {
          corporates.data.forEach((corp: any) => {
            nextUsers.push({
              id: corp.id || corp.user || Math.random(),
              name: corp.company_name || 'Corporate partner',
              email: corp.email || corp.user_email || 'unknown@example.com',
              role: 'Corporate',
              status: corp.is_active === false ? 'inactive' : 'active',
            });
          });
        }

        setUsers(nextUsers);
      } catch (err) {
        setError('Unable to load users right now.');
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
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-indigo-50">
        <AdminNav active="/admin/users" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
          <header className="space-y-3">
            <h1 className="text-3xl font-extrabold text-gray-900">User management</h1>
            <p className="text-gray-600 max-w-3xl">Review people and organisations connected to AA Educates.</p>
          </header>

          <section className="bg-white border border-blue-100 rounded-2xl shadow p-6 space-y-4">
            <div className="grid gap-6 md:grid-cols-3">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Search users</label>
                <input
                  type="text"
                  value={filters.search}
                  onChange={(event) => setFilters((prev) => ({ ...prev, search: event.target.value }))}
                  placeholder="Search by name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                <select
                  value={filters.role}
                  onChange={(event) => setFilters((prev) => ({ ...prev, role: event.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="ALL">All roles</option>
                  <option value="Student">Students</option>
                  <option value="Parent">Parents</option>
                  <option value="Corporate">Corporate partners</option>
                </select>
              </div>
            </div>
          </section>

          {loading ? (
            <div className="flex items-center justify-center min-h-[240px]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
            </div>
          ) : error ? (
            <div className="max-w-2xl mx-auto">
              <div className="bg-rose-50 border border-rose-200 rounded-2xl p-8 text-center">
                <h2 className="text-xl font-semibold text-rose-700 mb-2">Users unavailable</h2>
                <p className="text-rose-600">{error}</p>
              </div>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="max-w-2xl mx-auto bg-white border border-blue-100 rounded-2xl shadow p-10 text-center">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">No users match those filters</h2>
              <p className="text-gray-600 mb-6">Adjust your search or role filters and try again.</p>
              <button
                onClick={() => setFilters({ role: 'ALL', search: '' })}
                className="inline-flex items-center px-4 py-2 rounded-xl border border-gray-200 text-gray-600 font-semibold hover:bg-gray-50"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <section className="bg-white border border-blue-100 rounded-2xl shadow divide-y divide-gray-100">
              {filteredUsers.map((user) => (
                <article key={`${user.role}-${user.id}`} className="flex flex-col gap-4 px-6 py-5 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">{user.name}</h2>
                    <p className="text-sm text-gray-500">{user.email}</p>
                    <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mt-1">{user.role}</p>
                  </div>
                  <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        user.status === 'active'
                          ? 'bg-emerald-100 text-emerald-700'
                          : user.status === 'pending'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {formatLabel(user.status)}
                    </span>
                    <Link
                      href={`/admin/user/${user.id}`}
                      className="inline-flex items-center gap-2 rounded-xl border border-gray-200 text-gray-600 px-4 py-2 text-sm font-semibold hover:bg-gray-50 transition"
                    >
                      View profile
                    </Link>
                  </div>
                </article>
              ))}
            </section>
          )}
        </div>
      </main>
    </>
  );
};

export default AdminUsersPage;
