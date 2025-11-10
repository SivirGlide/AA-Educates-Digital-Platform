import Head from 'next/head';
import Link from 'next/link';
import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { api } from '../../lib/api';

interface MentoringSession {
  id: number;
  mentor_name: string;
  topic: string;
  scheduled_at: string;
  duration_minutes: number;
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
  notes: string;
}

const navLinks = [
  { href: '/student/dashboard', label: 'Dashboard' },
  { href: '/student/profile', label: 'Profile' },
  { href: '/student/projects', label: 'Projects' },
  { href: '/student/mentoring', label: 'Mentoring' },
  { href: '/student/skills', label: 'Skills' },
  { href: '/student/certificates', label: 'Certificates' },
  { href: '/student/community', label: 'Community' },
  { href: '/student/resources', label: 'Resources' },
  { href: '/student/settings', label: 'Settings' }
];

const StudentNav: React.FC<{ active: string }> = ({ active }) => (
  <nav className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200 sticky top-0 z-40">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
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
                ? 'bg-indigo-600 text-white shadow'
                : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50'
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

const StudentMentoringPage: NextPage = () => {
  const [sessions, setSessions] = useState<MentoringSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await api.getProjects();
        if (response.error || !Array.isArray(response.data)) {
          setError(response.error || 'Unable to load mentoring sessions');
        } else {
          const mockSessions = (response.data as any[]).slice(0, 4).map((project, index) => ({
            id: project.id,
            mentor_name: ['Amina', 'Daniel', 'Priya', 'Karl'][index % 4] + ' Johnson',
            topic: project.title,
            scheduled_at: new Date(Date.now() + index * 86400000).toISOString(),
            duration_minutes: 45,
            status: index % 3 === 2 ? 'COMPLETED' : 'SCHEDULED',
            notes: project.description || 'Overview of goals and expectations.'
          }));
          setSessions(mockSessions);
        }
      } catch (err) {
        setError('Something went wrong while fetching mentoring sessions');
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  return (
    <>
      <Head>
        <title>Mentoring | AA Educates</title>
      </Head>
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <StudentNav active="/student/mentoring" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
          <header className="flex flex-col gap-4">
            <h1 className="text-3xl font-extrabold text-gray-900">Mentoring hub</h1>
            <p className="text-gray-600 max-w-3xl">
              Prepare for upcoming sessions, reflect on previous conversations, and access personalised guidance from mentors across
              the AA Educates community.
            </p>
            <div className="inline-flex items-center gap-2 rounded-full bg-white border border-indigo-100 px-4 py-2 text-sm text-indigo-600 shadow">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> Accepting new mentoring requests this week
            </div>
          </header>

          {loading ? (
            <div className="flex items-center justify-center min-h-[300px]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
            </div>
          ) : error ? (
            <div className="max-w-2xl mx-auto">
              <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
                <h2 className="text-xl font-semibold text-red-700 mb-2">Mentoring unavailable</h2>
                <p className="text-red-600">{error}</p>
              </div>
            </div>
          ) : (
            <div className="grid gap-6 lg:grid-cols-3">
              <section className="lg:col-span-2 space-y-6">
                {sessions.map((session) => (
                  <article key={session.id} className="bg-white border border-indigo-100 rounded-2xl shadow hover:shadow-lg transition p-6">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <h2 className="text-xl font-semibold text-gray-900">{session.topic}</h2>
                        <p className="text-sm text-indigo-500">With mentor {session.mentor_name}</p>
                      </div>
                      <span className={`text-xs font-semibold uppercase tracking-wide px-3 py-1 rounded-full ${
                        session.status === 'COMPLETED'
                          ? 'bg-emerald-100 text-emerald-700'
                          : session.status === 'CANCELLED'
                          ? 'bg-rose-100 text-rose-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}>
                        {session.status}
                      </span>
                    </div>
                    <dl className="mt-4 grid gap-2 text-sm text-gray-600 sm:grid-cols-2">
                      <div className="flex justify-between sm:block">
                        <dt className="font-medium text-gray-500">Date</dt>
                        <dd>{new Date(session.scheduled_at).toLocaleString()}</dd>
                      </div>
                      <div className="flex justify-between sm:block">
                        <dt className="font-medium text-gray-500">Duration</dt>
                        <dd>{session.duration_minutes} minutes</dd>
                      </div>
                    </dl>
                    <p className="mt-4 text-sm text-gray-600 leading-relaxed">{session.notes}</p>
                    <div className="mt-6 flex flex-wrap gap-3">
                      <button className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 text-white px-4 py-2 text-sm font-semibold hover:bg-indigo-700 transition">
                        Join session
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14m-7-7l7 7-7 7" />
                        </svg>
                      </button>
                      <button className="inline-flex items-center gap-2 rounded-xl border border-gray-200 text-gray-600 px-4 py-2 text-sm font-semibold hover:bg-gray-50 transition">
                        Reschedule
                      </button>
                      <button className="inline-flex items-center gap-2 rounded-xl border border-gray-200 text-gray-600 px-4 py-2 text-sm font-semibold hover:bg-gray-50 transition">
                        Add reflection
                      </button>
                    </div>
                  </article>
                ))}
              </section>

              <aside className="bg-white border border-indigo-100 rounded-2xl shadow p-6 space-y-6">
                <section className="space-y-3">
                  <h2 className="text-lg font-semibold text-gray-900">Mentoring tips</h2>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start gap-2">
                      <span className="mt-1 h-2 w-2 rounded-full bg-indigo-500" /> Prepare questions in advance to make the most of each session.
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 h-2 w-2 rounded-full bg-indigo-500" /> Share your goals and what success looks like for you.
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 h-2 w-2 rounded-full bg-indigo-500" /> Follow up with notes or next steps to keep momentum going.
                    </li>
                  </ul>
                </section>
                <section className="space-y-3 text-sm text-gray-600">
                  <h2 className="text-lg font-semibold text-gray-900">Need a new mentor?</h2>
                  <p>Let us know the support you’re looking for and we’ll match you with someone from our partner network.</p>
                  <Link
                    href="/contact"
                    className="inline-flex items-center px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
                  >
                    Request mentor
                  </Link>
                </section>
              </aside>
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default StudentMentoringPage;
