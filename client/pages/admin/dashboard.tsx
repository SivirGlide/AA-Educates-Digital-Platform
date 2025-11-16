import Head from 'next/head';
import Link from 'next/link';
import type { NextPage } from 'next';
import { useMemo } from 'react';

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

const adminMetrics = [
  { id: 1, label: 'Total users', value: 1845, delta: 8 },
  { id: 2, label: 'Active subscriptions', value: 312, delta: 3 },
  { id: 3, label: 'Monthly revenue', value: '£24.6k', delta: 12 },
  { id: 4, label: 'Support tickets', value: 18, delta: -5 },
];

const AdminDashboardPage: NextPage = () => {
  const highlight = useMemo(() => adminMetrics.slice(0, 3), []);

  return (
    <>
      <Head>
        <title>Admin Dashboard | AA Educates</title>
      </Head>
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-indigo-50">
        <AdminNav active="/admin/dashboard" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
          <header className="space-y-3">
            <h1 className="text-3xl font-extrabold text-gray-900">Administrator overview</h1>
            <p className="text-gray-600 max-w-3xl">
              Monitor activity across the AA Educates platform. These snapshots combine user activity, subscription insights, and support trends.
            </p>
          </header>

          <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {adminMetrics.map((metric) => (
              <div key={metric.id} className="bg-white border border-blue-100 rounded-2xl shadow p-6 space-y-3">
                <div className="text-sm font-medium text-blue-700">{metric.label}</div>
                <div className="text-3xl font-extrabold text-gray-900">{metric.value}</div>
                <div className={`text-sm font-semibold ${metric.delta >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {metric.delta >= 0 ? '+' : ''}{metric.delta}% vs last 30 days
                </div>
              </div>
            ))}
          </section>

          <section className="grid gap-6 lg:grid-cols-2">
            <div className="bg-white border border-indigo-100 rounded-2xl shadow p-6 space-y-4">
              <header className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Platform pulse</h2>
                <Link href="/admin/analytics" className="text-sm font-semibold text-blue-600 hover:text-blue-700">
                  View analytics →
                </Link>
              </header>
              <ul className="space-y-3 text-sm text-gray-600">
                {highlight.map((metric) => (
                  <li key={metric.id} className="flex items-center justify-between">
                    <span>{metric.label}</span>
                    <span className="font-semibold text-gray-900">{metric.value}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white border border-purple-100 rounded-2xl shadow p-6 space-y-4">
              <header className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Quick actions</h2>
                <Link href="/admin/users" className="text-sm font-semibold text-blue-600 hover:text-blue-700">
                  Manage users →
                </Link>
              </header>
              <div className="grid gap-3 sm:grid-cols-2">
                <Link href="/admin/roles" className="rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50">
                  Review roles
                </Link>
                <Link href="/admin/content" className="rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50">
                  Publish update
                </Link>
                <Link href="/admin/crm" className="rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50">
                  Partner follow-up
                </Link>
                <Link href="/admin/settings" className="rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50">
                  Platform settings
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
};

export default AdminDashboardPage;
