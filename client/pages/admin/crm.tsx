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

const partnerPipeline = [
  {
    id: 1,
    organisation: 'FutureTech Labs',
    contact: 'ayesha.khan@ftlabs.com',
    status: 'Discovery call',
    nextStep: 'Share pilot proposal',
  },
  {
    id: 2,
    organisation: 'Inclusive Bank',
    contact: 'marcus.lee@inclusivebank.co.uk',
    status: 'Proposal submitted',
    nextStep: 'Awaiting feedback',
  },
  {
    id: 3,
    organisation: 'Northbridge College',
    contact: 'principal@northbridge.ac.uk',
    status: 'Contract signed',
    nextStep: 'Schedule onboarding',
  },
];

const statusStyles: Record<string, string> = {
  'Discovery call': 'bg-sky-100 text-sky-700',
  'Proposal submitted': 'bg-amber-100 text-amber-700',
  'Contract signed': 'bg-emerald-100 text-emerald-700',
};

const AdminCrmPage: NextPage = () => {
  const [search, setSearch] = useState('');
  const filteredPipeline = useMemo(() => {
    return partnerPipeline.filter((partner) =>
      partner.organisation.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  return (
    <>
      <Head>
        <title>Admin CRM | AA Educates</title>
      </Head>
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-indigo-50">
        <AdminNav active="/admin/crm" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
          <header className="space-y-3">
            <h1 className="text-3xl font-extrabold text-gray-900">Partner relationships</h1>
            <p className="text-gray-600 max-w-3xl">Track outreach with corporate partners, schools, and community organisations.</p>
          </header>

          <section className="bg-white border border-blue-100 rounded-2xl shadow p-6 space-y-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Search pipeline</label>
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by organisation name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </section>

          <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredPipeline.map((partner) => (
              <article key={partner.id} className="bg-white border border-blue-100 rounded-2xl shadow p-6 space-y-4">
                <header className="space-y-2">
                  <h2 className="text-xl font-semibold text-gray-900">{partner.organisation}</h2>
                  <p className="text-sm text-gray-500">{partner.contact}</p>
                </header>
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusStyles[partner.status] || 'bg-gray-100 text-gray-700'}`}>
                  {partner.status}
                </span>
                <p className="text-sm text-gray-600">Next step: {partner.nextStep}</p>
                <div className="flex gap-3">
                  <Link
                    href={`/admin/crm?partner=${partner.id}`}
                    className="inline-flex items-center gap-2 rounded-xl bg-blue-600 text-white px-4 py-2 text-sm font-semibold hover:bg-blue-700 transition"
                  >
                    View timeline
                  </Link>
                  <button className="inline-flex items-center gap-2 rounded-xl border border-gray-200 text-gray-600 px-4 py-2 text-sm font-semibold hover:bg-gray-50 transition">
                    Add note
                  </button>
                </div>
              </article>
            ))}
            {filteredPipeline.length === 0 && (
              <div className="md:col-span-2 xl:col-span-3 bg-white border border-dashed border-blue-200 rounded-2xl p-10 text-center text-sm text-gray-600">
                No partners match that search yet.
              </div>
            )}
          </section>
        </div>
      </main>
    </>
  );
};

export default AdminCrmPage;
