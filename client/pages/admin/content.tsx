import Head from 'next/head';
import Link from 'next/link';
import type { NextPage } from 'next';
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

const contentQueue = [
  {
    id: 1,
    title: 'Student success spotlight: Creative computing',
    type: 'Article',
    status: 'Scheduled',
    scheduled_for: '2025-11-15T09:00:00Z',
  },
  {
    id: 2,
    title: 'Corporate partner onboarding webinar',
    type: 'Event',
    status: 'Draft',
    scheduled_for: null,
  },
  {
    id: 3,
    title: 'Parent engagement toolkit',
    type: 'Resource',
    status: 'Published',
    scheduled_for: '2025-10-31T12:00:00Z',
  },
];

const AdminContentPage: NextPage = () => {
  const [filter, setFilter] = useState('ALL');

  const filteredContent = useMemo(() => {
    return contentQueue.filter((item) => (filter === 'ALL' ? true : item.status === filter));
  }, [filter]);

  return (
    <>
      <Head>
        <title>Admin Content | AA Educates</title>
      </Head>
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-indigo-50">
        <AdminNav active="/admin/content" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
          <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-3">
              <h1 className="text-3xl font-extrabold text-gray-900">Content hub</h1>
              <p className="text-gray-600 max-w-3xl">Plan announcements, surface stories, and coordinate platform messaging.</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setFilter('ALL')}
                className={`px-4 py-2 rounded-xl text-sm font-semibold border ${filter === 'ALL' ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('Scheduled')}
                className={`px-4 py-2 rounded-xl text-sm font-semibold border ${filter === 'Scheduled' ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
              >
                Scheduled
              </button>
              <button
                onClick={() => setFilter('Draft')}
                className={`px-4 py-2 rounded-xl text-sm font-semibold border ${filter === 'Draft' ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
              >
                Drafts
              </button>
              <button
                onClick={() => setFilter('Published')}
                className={`px-4 py-2 rounded-xl text-sm font-semibold border ${filter === 'Published' ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
              >
                Published
              </button>
            </div>
          </header>

          <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredContent.map((item) => (
              <article key={item.id} className="bg-white border border-blue-100 rounded-2xl shadow p-6 space-y-3">
                <header className="space-y-2">
                  <h2 className="text-xl font-semibold text-gray-900">{item.title}</h2>
                  <p className="text-sm text-gray-500">Type: {item.type}</p>
                </header>
                <p className="text-sm text-gray-600 font-medium">Status: {item.status}</p>
                <p className="text-sm text-gray-500">
                  {item.scheduled_for ? `Scheduled for ${new Date(item.scheduled_for).toLocaleString()}` : 'Not scheduled yet'}
                </p>
                <div className="flex gap-3">
                  <Link
                    href={`/admin/content?id=${item.id}`}
                    className="inline-flex items-center gap-2 rounded-xl bg-blue-600 text-white px-4 py-2 text-sm font-semibold hover:bg-blue-700 transition"
                  >
                    Edit
                  </Link>
                  <button className="inline-flex items-center gap-2 rounded-xl border border-gray-200 text-gray-600 px-4 py-2 text-sm font-semibold hover:bg-gray-50 transition">
                    Preview
                  </button>
                </div>
              </article>
            ))}
          </section>
        </div>
      </main>
    </>
  );
};

export default AdminContentPage;
