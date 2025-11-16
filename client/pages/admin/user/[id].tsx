import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { api } from '../../../lib/api';

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

  return (
    <>
      <Head>
        <title>Admin User Detail | AA Educates</title>
      </Head>
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-indigo-50">
        <AdminNav active="/admin/users" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
          <Link href="/admin/users" className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700">
            ← Back to users
          </Link>

          {loading ? (
            <div className="flex items-center justify-center min-h-[240px]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
            </div>
          ) : error ? (
            <div className="max-w-2xl">
              <div className="bg-rose-50 border border-rose-200 rounded-2xl p-8 text-center">
                <h2 className="text-xl font-semibold text-rose-700 mb-2">User unavailable</h2>
                <p className="text-rose-600">{error}</p>
              </div>
            </div>
          ) : user ? (
            <section className="bg-white border border-blue-100 rounded-2xl shadow p-8 space-y-6">
              <header className="space-y-2">
                <h1 className="text-3xl font-extrabold text-gray-900">{user.username || user.full_name || 'Unknown user'}</h1>
                <p className="text-gray-600">{user.email || 'No email available'}</p>
              </header>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Profile</h2>
                  <p className="text-sm text-gray-600">Role: {user.role || 'Unknown'}</p>
                  <p className="text-sm text-gray-600">Joined: {user.date_joined ? new Date(user.date_joined).toLocaleDateString() : 'Unknown'}</p>
                </div>
                <div className="space-y-2">
                  <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Status</h2>
                  <p className="text-sm text-gray-600">Active: {user.is_active === false ? 'No' : 'Yes'}</p>
                  <p className="text-sm text-gray-600">Verified: {user.is_verified ? 'Yes' : 'No'}</p>
                </div>
              </div>

              <section className="space-y-3">
                <h2 className="text-lg font-semibold text-gray-900">Recent activity</h2>
                <p className="text-sm text-gray-600">Activity timeline will appear here once analytics are connected.</p>
              </section>
            </section>
          ) : null}
        </div>
      </main>
    </>
  );
};

export default AdminUserDetailPage;
