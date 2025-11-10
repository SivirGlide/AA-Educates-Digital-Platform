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
  created_at: string;
  updated_at: string;
  created_by: number;
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


const CorporateProjectsPage: NextPage = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({ status: 'ALL', search: '' });

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await api.getProjects();
        if (response.error || !Array.isArray(response.data)) {
          setError(response.error || 'Unable to load projects');
        } else {
          const profileId = parseInt(localStorage.getItem('profileId') || '0', 10);
          const ownProjects = response.data.filter((project: Project) => project.created_by === profileId);
          setProjects(ownProjects as Project[]);
        }
      } catch (err) {
        setError('Something went wrong while fetching projects');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const filtered = useMemo(() => {
    return projects
      .filter((project) => (filters.status === 'ALL' ? true : project.status === filters.status))
      .filter((project) => project.title.toLowerCase().includes(filters.search.toLowerCase()));
  }, [projects, filters]);

  return (
    <>
      <Head>
        <title>Corporate Projects | AA Educates</title>
      </Head>
      <main className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-pink-50">
        <CorporateNav active="/corporate/projects" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
          <header className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900">Projects</h1>
              <p className="text-gray-600 max-w-2xl">
                Manage live briefs, monitor progress, and revisit archived collaborations. Create a new opportunity to engage AA Educates learners.
              </p>
            </div>
            <Link
              href="/corporate/project/new"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white px-5 py-3 font-semibold shadow hover:shadow-lg transition"
            >
              New project
            </Link>
          </header>

          <section className="bg-white border border-purple-100 rounded-2xl shadow p-6 space-y-4">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Search projects</label>
                <input
                  type="text"
                  value={filters.search}
                  onChange={(event) => setFilters((prev) => ({ ...prev, search: event.target.value }))}
                  placeholder="Search by title"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={filters.status}
                  onChange={(event) => setFilters((prev) => ({ ...prev, status: event.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="ALL">All</option>
                  <option value="DRAFT">Draft</option>
                  <option value="OPEN">Open</option>
                  <option value="CLOSED">Closed</option>
                  <option value="ARCHIVED">Archived</option>
                </select>
              </div>
            </div>
          </section>

          {loading ? (
            <div className="flex items-center justify-center min-h-[240px]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600" />
            </div>
          ) : error ? (
            <div className="max-w-2xl mx-auto">
              <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
                <h2 className="text-xl font-semibold text-red-700 mb-2">Projects unavailable</h2>
                <p className="text-red-600">{error}</p>
              </div>
            </div>
          ) : filtered.length === 0 ? (
            <div className="max-w-2xl mx-auto bg-white border border-purple-100 rounded-2xl shadow p-10 text-center">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">No projects found</h2>
              <p className="text-gray-600 mb-6">Try adjusting the filters or create a new brief to get started.</p>
              <button
                onClick={() => setFilters({ status: 'ALL', search: '' })}
                className="inline-flex items-center px-4 py-2 rounded-xl border border-gray-200 text-gray-600 font-semibold hover:bg-gray-50"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filtered.map((project) => (
                <article key={project.id} className="group bg-white border border-purple-100 rounded-2xl shadow hover:shadow-xl transition p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900">{project.title}</h2>
                    <span className={`px-3 py-1 text-xs font-semibold uppercase tracking-wide rounded-full ${
                      project.status === 'OPEN'
                        ? 'bg-emerald-100 text-emerald-700'
                        : project.status === 'CLOSED'
                        ? 'bg-gray-100 text-gray-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}>
                      {project.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {project.description || 'No description provided.'}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Created {new Date(project.created_at).toLocaleDateString()}</span>
                    {project.start_date && <span>Starts {new Date(project.start_date).toLocaleDateString()}</span>}
                  </div>
                  <div className="flex gap-3">
                    <Link
                      href={`/corporate/dashboard?project=${project.id}`}
                      className="inline-flex items-center gap-2 rounded-xl bg-purple-600 text-white px-4 py-2 text-sm font-semibold hover:bg-purple-700 transition"
                    >
                      Manage
                    </Link>
                    <Link
                      href={`/student/project/${project.id}`}
                      className="inline-flex items-center gap-2 rounded-xl border border-gray-200 text-gray-600 px-4 py-2 text-sm font-semibold hover:bg-gray-50 transition"
                    >
                      View as student
                    </Link>
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

export default CorporateProjectsPage;
