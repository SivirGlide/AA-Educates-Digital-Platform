import Head from 'next/head';
import Link from 'next/link';
import type { NextPage } from 'next';
import { useEffect, useMemo, useState } from 'react';
import { api } from '../../lib/api';

interface Project {
  id: number;
  title: string;
  description: string;
  status: string;
  start_date: string | null;
  end_date: string | null;
  created_by: number;
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

const StudentProjectsPage: NextPage = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({ status: 'OPEN', search: '' });

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await api.getProjects();
        if (response.error || !Array.isArray(response.data)) {
          setError(response.error || 'Unable to load projects');
        } else {
          setProjects(response.data as Project[]);
        }
      } catch (err) {
        setError('Something went wrong while fetching projects');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const filteredProjects = useMemo(() => {
    return projects
      .filter((project) => (filters.status === 'ALL' ? true : project.status === filters.status))
      .filter((project) => project.title.toLowerCase().includes(filters.search.toLowerCase()));
  }, [projects, filters]);

  return (
    <>
      <Head>
        <title>Student Projects | AA Educates</title>
      </Head>
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <StudentNav active="/student/projects" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
          <header className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900">Projects marketplace</h1>
              <p className="text-gray-600 mt-2 max-w-2xl">
                Explore live briefs from corporate partners, revisit accepted projects, and track your submissions in one place.
              </p>
            </div>
            <div className="bg-white border border-indigo-100 rounded-2xl shadow p-4 flex flex-col sm:flex-row gap-4 sm:items-center">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">Filter</span>
                <select
                  value={filters.status}
                  onChange={(event) => setFilters((prev) => ({ ...prev, status: event.target.value }))}
                  className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="OPEN">Open projects</option>
                  <option value="DRAFT">Draft</option>
                  <option value="CLOSED">Completed</option>
                  <option value="ALL">All projects</option>
                </select>
              </div>
              <input
                type="search"
                placeholder="Search projects"
                className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={filters.search}
                onChange={(event) => setFilters((prev) => ({ ...prev, search: event.target.value }))}
              />
            </div>
          </header>

          {loading ? (
            <div className="flex items-center justify-center min-h-[300px]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
            </div>
          ) : error ? (
            <div className="max-w-2xl mx-auto">
              <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
                <h2 className="text-xl font-semibold text-red-700 mb-2">Projects unavailable</h2>
                <p className="text-red-600">{error}</p>
              </div>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="max-w-2xl mx-auto text-center bg-white border border-indigo-100 rounded-2xl shadow p-10">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">No projects match your filters</h2>
              <p className="text-gray-600 mb-6">
                Adjust your filters or check back soon—new opportunities are added regularly by our community partners.
              </p>
              <button
                onClick={() => setFilters({ status: 'OPEN', search: '' })}
                className="inline-flex items-center px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
              >
                Reset filters
              </button>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredProjects.map((project) => (
                <article
                  key={project.id}
                  className="group bg-white border border-indigo-100 rounded-2xl shadow hover:shadow-xl transition-all duration-300 overflow-hidden"
                >
                  <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between text-xs uppercase tracking-wide">
                      <span className={
                        project.status === 'OPEN'
                          ? 'inline-flex items-center gap-2 px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 font-semibold'
                          : project.status === 'CLOSED'
                          ? 'inline-flex items-center gap-2 px-2 py-1 rounded-full bg-gray-200 text-gray-700 font-semibold'
                          : 'inline-flex items-center gap-2 px-2 py-1 rounded-full bg-amber-100 text-amber-700 font-semibold'
                      }>
                        {project.status}
                      </span>
                      {project.start_date && (
                        <span className="text-gray-500">Starts {new Date(project.start_date).toLocaleDateString()}</span>
                      )}
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                      {project.title}
                    </h2>
                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                      {project.description || 'No description provided for this project.'}
                    </p>
                    <div className="flex justify-between items-center">
                      <Link
                        href={`/student/project/${project.id}`}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
                      >
                        View details
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                      {project.end_date && (
                        <span className="text-xs text-gray-500">Due {new Date(project.end_date).toLocaleDateString()}</span>
                      )}
                    </div>
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

export default StudentProjectsPage;
