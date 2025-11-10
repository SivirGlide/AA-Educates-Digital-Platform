import Head from 'next/head';
import type { NextPage } from 'next';
import Link from 'next/link';
import { useMemo, useState } from 'react';

interface ImpactMetric {
  id: number;
  label: string;
  value: number;
  change: number;
  unit: string;
}

interface Initiative {
  id: number;
  title: string;
  summary: string;
  learners: number;
  hours: number;
  status: 'ACTIVE' | 'COMPLETED';
  impactScore: number;
}

const navLinks = [
  { href: '/corporate/dashboard', label: 'Dashboard' },
  { href: '/corporate/projects', label: 'Projects' },
  { href: '/corporate/project/new', label: 'New Project' },
  { href: '/corporate/volunteers', label: 'Volunteers' },
  { href: '/corporate/talent', label: 'Talent' },
  { href: '/corporate/impact', label: 'Impact' },
  { href: '/corporate/profile', label: 'Profile' },
  { href: '/corporate/settings', label: 'Settings' }
];

const CorporateNav: React.FC<{ active: string }> = ({ active }) => (
  <nav className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200 sticky top-0 z-40">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
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
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
              link.href === active
                ? 'bg-purple-600 text-white shadow'
                : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
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


const formatLabel = (value: string) =>
  value
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

const metrics: ImpactMetric[] = [
  { id: 1, label: 'Learners supported', value: 184, change: 12, unit: '' },
  { id: 2, label: 'Volunteer hours', value: 640, change: 18, unit: 'hrs' },
  { id: 3, label: 'Projects delivered', value: 27, change: 5, unit: '' },
  { id: 4, label: 'Satisfaction score', value: 94, change: 3, unit: '%' },
];

const initiatives: Initiative[] = [
  {
    id: 1,
    title: 'STEM Innovators Challenge',
    summary: 'Learners tackled emerging tech challenges with coaching from your team.',
    learners: 45,
    hours: 120,
    status: 'ACTIVE',
    impactScore: 86,
  },
  {
    id: 2,
    title: 'Sustainable Futures Hackathon',
    summary: 'Cross-disciplinary teams prototyped solutions for climate resilience.',
    learners: 60,
    hours: 220,
    status: 'COMPLETED',
    impactScore: 91,
  },
  {
    id: 3,
    title: 'Mentoring Sprint',
    summary: 'Volunteers offered four-week mentoring pods focused on career readiness.',
    learners: 32,
    hours: 160,
    status: 'ACTIVE',
    impactScore: 88,
  },
];

const CorporateImpactPage: NextPage = () => {
  const [statusFilter, setStatusFilter] = useState<'ALL' | Initiative['status']>('ALL');

  const filtered = useMemo(() => {
    return initiatives.filter((initiative) => statusFilter === 'ALL' || initiative.status === statusFilter);
  }, [statusFilter]);

  return (
    <>
      <Head>
        <title>Corporate Impact | AA Educates</title>
      </Head>
      <main className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-pink-50">
        <CorporateNav active="/corporate/impact" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
          <header className="space-y-3">
            <h1 className="text-3xl font-extrabold text-gray-900">Impact Dashboard</h1>
            <p className="text-gray-600 max-w-3xl">
              Track how AA Educates learners are progressing through your programmes. These snapshots combine project data, feedback, and engagement metrics.
            </p>
          </header>

          <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {metrics.map((metric) => (
              <div key={metric.id} className="bg-white border border-purple-100 rounded-2xl shadow p-6 space-y-4">
                <div className="text-sm font-medium text-purple-700">{metric.label}</div>
                <div className="text-3xl font-extrabold text-gray-900">
                  {metric.value}
                  {metric.unit && <span className="text-lg font-semibold text-gray-500 ml-1">{metric.unit}</span>}
                </div>
                <div className={`text-sm font-semibold ${metric.change >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {metric.change >= 0 ? '+' : ''}{metric.change}% vs last quarter
                </div>
              </div>
            ))}
          </section>

          <section className="bg-white border border-purple-100 rounded-2xl shadow p-6 space-y-6">
            <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Initiatives</h2>
                <p className="text-gray-600">Review active programmes and completed collaborations.</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setStatusFilter('ALL')}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold border ${
                    statusFilter === 'ALL'
                      ? 'bg-purple-600 text-white border-purple-600'
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setStatusFilter('ACTIVE')}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold border ${
                    statusFilter === 'ACTIVE'
                      ? 'bg-purple-600 text-white border-purple-600'
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  Active
                </button>
                <button
                  onClick={() => setStatusFilter('COMPLETED')}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold border ${
                    statusFilter === 'COMPLETED'
                      ? 'bg-purple-600 text-white border-purple-600'
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  Completed
                </button>
              </div>
            </header>

            <div className="grid gap-6">
              {filtered.map((initiative) => (
                <article key={initiative.id} className="border border-purple-100 rounded-2xl p-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <span
                        className={`px-3 py-1 text-xs font-semibold rounded-full ${
                          initiative.status === 'ACTIVE'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {formatLabel(initiative.status.toLowerCase())}
                      </span>
                      <span className="text-sm font-semibold text-purple-600">Impact score {initiative.impactScore}</span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">{initiative.title}</h3>
                    <p className="text-gray-600 max-w-2xl">{initiative.summary}</p>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                      <span>{initiative.learners} learners reached</span>
                      <span>{initiative.hours} volunteer hours</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-3">
                    <Link
                      href={`/corporate/dashboard?initiative=${initiative.id}`}
                      className="inline-flex items-center gap-2 rounded-xl bg-purple-600 text-white px-4 py-2 text-sm font-semibold hover:bg-purple-700 transition"
                    >
                      View details
                    </Link>
                    <button className="inline-flex items-center gap-2 rounded-xl border border-gray-200 text-gray-600 px-4 py-2 text-sm font-semibold hover:bg-gray-50 transition">
                      Download report
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      </main>
    </>
  );
};

export default CorporateImpactPage;
