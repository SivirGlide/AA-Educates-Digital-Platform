import Head from 'next/head';
import Link from 'next/link';
import type { NextPage } from 'next';
import { useMemo, useState } from 'react';

interface Volunteer {
  id: number;
  name: string;
  skills: string[];
  interests: string[];
  availability: 'AVAILABLE' | 'LIMITED' | 'UNAVAILABLE';
  hours: number;
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

const mockVolunteers: Volunteer[] = [
  {
    id: 1,
    name: 'Jordan Cooper',
    skills: ['Product design', 'UX research'],
    interests: ['Inclusive design', 'Mentoring'],
    availability: 'AVAILABLE',
    hours: 8,
  },
  {
    id: 2,
    name: 'Aaliyah Chen',
    skills: ['Data analysis', 'Power BI'],
    interests: ['Social impact', 'STEM'],
    availability: 'LIMITED',
    hours: 4,
  },
  {
    id: 3,
    name: 'Samuel Ola',
    skills: ['Cybersecurity', 'Python'],
    interests: ['Digital safety', 'Workshops'],
    availability: 'AVAILABLE',
    hours: 6,
  },
];

const CorporateVolunteersPage: NextPage = () => {
  const [search, setSearch] = useState('');
  const [availability, setAvailability] = useState<'ALL' | Volunteer['availability']>('ALL');

  const filtered = useMemo(() => {
    return mockVolunteers.filter((volunteer) => {
      const matchesSearch = volunteer.name.toLowerCase().includes(search.toLowerCase()) ||
        volunteer.skills.some((skill) => skill.toLowerCase().includes(search.toLowerCase()));
      const matchesAvailability = availability === 'ALL' || volunteer.availability === availability;
      return matchesSearch && matchesAvailability;
    });
  }, [search, availability]);

  return (
    <>
      <Head>
        <title>Corporate Volunteers | AA Educates</title>
      </Head>
      <main className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-pink-50">
        <CorporateNav active="/corporate/volunteers" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
          <header className="space-y-3">
            <h1 className="text-3xl font-extrabold text-gray-900">Volunteers</h1>
            <p className="text-gray-600 max-w-3xl">
              Discover professionals who have offered their time and expertise to support your learners. Use filters to match volunteers with projects and initiatives.
            </p>
          </header>

          <section className="bg-white border border-purple-100 rounded-2xl shadow p-6 space-y-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div className="w-full md:max-w-md">
                <label className="block text-sm font-medium text-gray-700 mb-2">Search volunteers</label>
                <input
                  type="text"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search by name or skill"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div className="w-full md:max-w-xs">
                <label className="block text-sm font-medium text-gray-700 mb-2">Availability</label>
                <select
                  value={availability}
                  onChange={(event) => setAvailability(event.target.value as typeof availability)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="ALL">All availability</option>
                  <option value="AVAILABLE">Available</option>
                  <option value="LIMITED">Limited</option>
                  <option value="UNAVAILABLE">Unavailable</option>
                </select>
              </div>
            </div>
          </section>

          <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((volunteer) => (
              <article key={volunteer.id} className="bg-white border border-purple-100 rounded-2xl shadow hover:shadow-lg transition p-6 space-y-4">
                <header className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900">{volunteer.name}</h2>
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        volunteer.availability === 'AVAILABLE'
                          ? 'bg-emerald-100 text-emerald-700'
                          : volunteer.availability === 'LIMITED'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {formatLabel(volunteer.availability.replace('_', ' '))}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">{volunteer.hours} hrs available this month</p>
                </header>
                <div className="space-y-3">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-1">Skills</h3>
                    <ul className="flex flex-wrap gap-2 text-xs text-purple-700 font-medium">
                      {volunteer.skills.map((skill) => (
                        <li key={skill} className="px-3 py-1 rounded-full bg-purple-50 border border-purple-200">
                          {skill}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-1">Interests</h3>
                    <ul className="flex flex-wrap gap-2 text-xs text-pink-700 font-medium">
                      {volunteer.interests.map((interest) => (
                        <li key={interest} className="px-3 py-1 rounded-full bg-pink-50 border border-pink-200">
                          {interest}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <footer className="flex items-center justify-between">
                  <Link
                    href={`/corporate/dashboard?volunteer=${volunteer.id}`}
                    className="inline-flex items-center gap-2 rounded-xl bg-purple-600 text-white px-4 py-2 text-sm font-semibold hover:bg-purple-700 transition"
                  >
                    Invite to project
                  </Link>
                  <button className="text-sm font-medium text-purple-600 hover:text-purple-700">Message</button>
                </footer>
              </article>
            ))}
            {filtered.length === 0 && (
              <div className="md:col-span-2 xl:col-span-3 bg-white border border-dashed border-purple-200 rounded-2xl p-10 text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No volunteers match those filters yet</h3>
                <p className="text-gray-600">Adjust your search or request a volunteer with specific expertise.</p>
              </div>
            )}
          </section>
        </div>
      </main>
    </>
  );
};

export default CorporateVolunteersPage;
