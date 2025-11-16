import Head from 'next/head';
import type { NextPage } from 'next';
import Link from 'next/link';
import { useMemo, useState } from 'react';

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

const categories = ['Engagement', 'Growth', 'Learning outcomes'];

const dataPoints = [
  { id: 1, category: 'Engagement', metric: 'Weekly active learners', value: 642, delta: 14 },
  { id: 2, category: 'Engagement', metric: 'Average session length', value: '18m', delta: 6 },
  { id: 3, category: 'Growth', metric: 'New corporate partners', value: 7, delta: 2 },
  { id: 4, category: 'Learning outcomes', metric: 'Certification completions', value: 126, delta: 9 },
];

const AdminAnalyticsPage: NextPage = () => {
  const [category, setCategory] = useState('Engagement');

  const insights = useMemo(() => {
    return dataPoints.filter((point) => point.category === category);
  }, [category]);

  return (
    <>
      <Head>
        <title>Admin Analytics | AA Educates</title>
      </Head>
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-indigo-50">
        <AdminNav active="/admin/analytics" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
          <header className="space-y-3">
            <h1 className="text-3xl font-extrabold text-gray-900">Analytics</h1>
            <p className="text-gray-600 max-w-3xl">Understand how learners, families, and partners engage with AA Educates.</p>
          </header>

          <div className="flex flex-wrap gap-3">
            {categories.map((option) => (
              <button
                key={option}
                onClick={() => setCategory(option)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold border ${category === option ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
              >
                {option}
              </button>
            ))}
          </div>

          <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {insights.map((insight) => (
              <article key={insight.id} className="bg-white border border-blue-100 rounded-2xl shadow p-6 space-y-3">
                <header className="space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">{insight.category}</p>
                  <h2 className="text-lg font-semibold text-gray-900">{insight.metric}</h2>
                </header>
                <p className="text-3xl font-extrabold text-gray-900">{insight.value}</p>
                <p className={`text-sm font-semibold ${insight.delta >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {insight.delta >= 0 ? '+' : ''}{insight.delta}% vs previous period
                </p>
              </article>
            ))}
          </section>
        </div>
      </main>
    </>
  );
};

export default AdminAnalyticsPage;
