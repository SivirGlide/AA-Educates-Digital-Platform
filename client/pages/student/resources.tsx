import Head from 'next/head';
import Link from 'next/link';
import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { api } from '../../lib/api';

interface Resource {
  id: number;
  title: string;
  description: string;
  category: string;
  url: string;
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

const StudentResourcesPage: NextPage = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await api.getProjects();
        if (response.error || !Array.isArray(response.data)) {
          setError(response.error || 'Unable to load resources');
        } else {
          const mapped = (response.data as any[]).slice(0, 6).map((item, index) => ({
            id: item.id,
            title: item.title || `Resource ${index + 1}`,
            description: item.description || 'Download learning packs, project templates, and toolkits to support your work.',
            category: ['Guide', 'Worksheet', 'Video', 'Presentation'][index % 4],
            url: '/student/resources'
          }));
          setResources(mapped);
        }
      } catch (err) {
        setError('Something went wrong while fetching resources');
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, []);

  return (
    <>
      <Head>
        <title>Resources | AA Educates</title>
      </Head>
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <StudentNav active="/student/resources" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
          <header className="space-y-3">
            <h1 className="text-3xl font-extrabold text-gray-900">Resource library</h1>
            <p className="text-gray-600 max-w-3xl">
              Browse learning packs, project templates, and videos curated by mentors and educators. New resources are added every
              month to support your learning journey.
            </p>
          </header>

          {loading ? (
            <div className="flex items-center justify-center min-h-[280px]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
            </div>
          ) : error ? (
            <div className="max-w-2xl mx-auto">
              <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
                <h2 className="text-xl font-semibold text-red-700 mb-2">Resources unavailable</h2>
                <p className="text-red-600">{error}</p>
              </div>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {resources.map((resource) => (
                <article key={resource.id} className="bg-white border border-indigo-100 rounded-2xl shadow hover:shadow-lg transition p-6 space-y-4">
                  <span className="inline-flex px-2 py-1 rounded-full text-xs font-semibold uppercase tracking-wide bg-indigo-50 text-indigo-600">
                    {resource.category}
                  </span>
                  <h2 className="text-xl font-semibold text-gray-900">{resource.title}</h2>
                  <p className="text-sm text-gray-600 leading-relaxed">{resource.description}</p>
                  <div className="flex gap-3">
                    <Link
                      href={resource.url}
                      className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 text-white px-4 py-2 text-sm font-semibold hover:bg-indigo-700 transition"
                    >
                      Open resource
                    </Link>
                    <button className="inline-flex items-center gap-2 rounded-xl border border-gray-200 text-gray-600 px-4 py-2 text-sm font-semibold hover:bg-gray-50 transition">
                      Save for later
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

export default StudentResourcesPage;
