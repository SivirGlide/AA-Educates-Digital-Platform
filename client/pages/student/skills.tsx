import Head from 'next/head';
import Link from 'next/link';
import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { api } from '../../lib/api';

interface Skill {
  id: number;
  name: string;
  description: string;
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  last_updated: string;
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

const levelStyles: Record<string, string> = {
  BEGINNER: 'bg-emerald-100 text-emerald-700',
  INTERMEDIATE: 'bg-amber-100 text-amber-700',
  ADVANCED: 'bg-purple-100 text-purple-700'
};

const StudentSkillsPage: NextPage = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await api.getSkills();
        if (response.error || !Array.isArray(response.data)) {
          setError(response.error || 'Unable to load skills');
        } else {
          const mapped = (response.data as any[]).map((skill, index) => ({
            id: skill.id,
            name: skill.name || `Skill ${index + 1}`,
            description: skill.description || 'Skill description coming soon.',
            level: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'][index % 3] as Skill['level'],
            last_updated: new Date().toISOString()
          }));
          setSkills(mapped);
        }
      } catch (err) {
        setError('Something went wrong while fetching skills');
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, []);

  return (
    <>
      <Head>
        <title>Skills | AA Educates</title>
      </Head>
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <StudentNav active="/student/skills" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
          <header className="space-y-3">
            <h1 className="text-3xl font-extrabold text-gray-900">Skills passport</h1>
            <p className="text-gray-600 max-w-3xl">
              Track the skills you are developing across academic, creative, and employability domains. Use this passport to evidence
              achievements during mentoring sessions and project showcases.
            </p>
          </header>

          {loading ? (
            <div className="flex items-center justify-center min-h-[280px]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
            </div>
          ) : error ? (
            <div className="max-w-2xl mx-auto">
              <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
                <h2 className="text-xl font-semibold text-red-700 mb-2">Skills unavailable</h2>
                <p className="text-red-600">{error}</p>
              </div>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {skills.map((skill) => (
                <article key={skill.id} className="bg-white border border-indigo-100 rounded-2xl shadow hover:shadow-lg transition p-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900">{skill.name}</h2>
                    <span className={`px-3 py-1 text-xs font-semibold uppercase tracking-wide rounded-full ${levelStyles[skill.level]}`}>
                      {skill.level.toLowerCase()}
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-gray-600 leading-relaxed">{skill.description}</p>
                  <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
                    <span>Updated {new Date(skill.last_updated).toLocaleDateString()}</span>
                    <button className="inline-flex items-center gap-1 text-indigo-600 font-semibold">
                      Add evidence
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default StudentSkillsPage;
