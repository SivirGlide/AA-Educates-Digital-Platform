import Head from 'next/head';
import Link from 'next/link';
import type { NextPage } from 'next';
import { useMemo, useState } from 'react';

interface TalentProfile {
  id: number;
  name: string;
  role: string;
  skills: string[];
  badges: string[];
  readiness: 'INTERVIEW_READY' | 'WATCHLIST' | 'EMERGING';
  updated_at: string;
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

const mockTalent: TalentProfile[] = [
  {
    id: 101,
    name: 'Imani Cole',
    role: 'Data Analyst',
    skills: ['Python', 'Power BI', 'SQL'],
    badges: ['Data storyteller', 'Inclusive analyst'],
    readiness: 'INTERVIEW_READY',
    updated_at: '2025-10-14T12:00:00Z',
  },
  {
    id: 102,
    name: 'Daniel Ahmed',
    role: 'UX/Product Designer',
    skills: ['Figma', 'Design systems', 'Prototyping'],
    badges: ['Equity designer', 'Community mentor'],
    readiness: 'WATCHLIST',
    updated_at: '2025-10-09T12:00:00Z',
  },
  {
    id: 103,
    name: 'Sofia Rivera',
    role: 'Junior Software Engineer',
    skills: ['JavaScript', 'React', 'Node.js'],
    badges: ['Hackathon finalist'],
    readiness: 'EMERGING',
    updated_at: '2025-10-01T12:00:00Z',
  },
];

const readinessStyles: Record<TalentProfile['readiness'], string> = {
  INTERVIEW_READY: 'bg-emerald-100 text-emerald-700',
  WATCHLIST: 'bg-amber-100 text-amber-700',
  EMERGING: 'bg-indigo-100 text-indigo-700',
};

const CorporateTalentPage: NextPage = () => {
  const [search, setSearch] = useState('');
  const [readiness, setReadiness] = useState<'ALL' | TalentProfile['readiness']>('ALL');

  const filtered = useMemo(() => {
    return mockTalent.filter((profile) => {
      const matchesSearch = profile.name.toLowerCase().includes(search.toLowerCase()) ||
        profile.skills.some((skill) => skill.toLowerCase().includes(search.toLowerCase()));
      const matchesReadiness = readiness === 'ALL' || profile.readiness === readiness;
      return matchesSearch && matchesReadiness;
    });
  }, [search, readiness]);

  return (
    <>
      <Head>
        <title>Corporate Talent | AA Educates</title>
      </Head>
      <main className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-pink-50">
        <CorporateNav active="/corporate/talent" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
          <header className="space-y-3">
            <h1 className="text-3xl font-extrabold text-gray-900">Talent Pool</h1>
            <p className="text-gray-600 max-w-3xl">
              Shortlisted learners ready for internships, mentoring, and hiring pipelines. These profiles combine verified skills, badges, and project experience.
            </p>
          </header>

          <section className="bg-white border border-purple-100 rounded-2xl shadow p-6 space-y-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div className="w-full md:max-w-md">
                <label className="block text-sm font-medium text-gray-700 mb-2">Search talent</label>
                <input
                  type="text"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search by name or skill"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div className="w-full md:max-w-xs">
                <label className="block text-sm font-medium text-gray-700 mb-2">Readiness</label>
                <select
                  value={readiness}
                  onChange={(event) => setReadiness(event.target.value as typeof readiness)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="ALL">All statuses</option>
                  <option value="INTERVIEW_READY">Interview ready</option>
                  <option value="WATCHLIST">Watchlist</option>
                  <option value="EMERGING">Emerging</option>
                </select>
              </div>
            </div>
          </section>

          <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((profile) => (
              <article key={profile.id} className="bg-white border border-purple-100 rounded-2xl shadow hover:shadow-lg transition p-6 space-y-4">
                <header className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900">{profile.name}</h2>
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full ${readinessStyles[profile.readiness]}`}
                    >
                      {formatLabel(profile.readiness.replace('_', ' '))}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">{profile.role}</p>
                </header>
                <div className="space-y-3">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-1">Skills</h3>
                    <ul className="flex flex-wrap gap-2 text-xs text-purple-700 font-medium">
                      {profile.skills.map((skill) => (
                        <li key={skill} className="px-3 py-1 rounded-full bg-purple-50 border border-purple-200">
                          {skill}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-1">Recognition</h3>
                    <ul className="flex flex-wrap gap-2 text-xs text-pink-700 font-medium">
                      {profile.badges.map((badge) => (
                        <li key={badge} className="px-3 py-1 rounded-full bg-pink-50 border border-pink-200">
                          {badge}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <footer className="flex items-center justify-between text-sm text-gray-500">
                  <span>Updated {new Date(profile.updated_at).toLocaleDateString()}</span>
                  <div className="flex gap-3">
                    <Link
                      href={`/corporate/projects?talent=${profile.id}`}
                      className="text-purple-600 font-semibold hover:text-purple-700"
                    >
                      Add to project
                    </Link>
                    <button className="text-purple-600 font-semibold hover:text-purple-700">Download CV</button>
                  </div>
                </footer>
              </article>
            ))}
            {filtered.length === 0 && (
              <div className="md:col-span-2 xl:col-span-3 bg-white border border-dashed border-purple-200 rounded-2xl p-10 text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No talent profiles match those filters</h3>
                <p className="text-gray-600">Adjust your search or request curated recommendations from the AA Educates team.</p>
              </div>
            )}
          </section>
        </div>
      </main>
    </>
  );
};

export default CorporateTalentPage;
