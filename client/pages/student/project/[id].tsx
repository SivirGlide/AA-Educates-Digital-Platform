import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import type { NextPage } from 'next';
import { useEffect, useMemo, useState } from 'react';
import { api } from '../../../lib/api';

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

const StudentProjectDetailPage: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchProject = async () => {
      try {
        const response = await api.getProject(Number(id));
        if (response.error || !response.data) {
          setError(response.error || 'Project not found');
        } else {
          setProject(response.data as Project);
        }
      } catch (err) {
        setError('Unable to load this project');
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  const timeline = useMemo(() => {
    if (!project) return [];
    return [
      project.start_date && {
        label: 'Applications open',
        value: new Date(project.start_date).toLocaleDateString(),
      },
      project.end_date && {
        label: 'Submissions due',
        value: new Date(project.end_date).toLocaleDateString(),
      },
      {
        label: 'Last updated',
        value: new Date(project.updated_at).toLocaleString(),
      },
    ].filter(Boolean) as { label: string; value: string }[];
  }, [project]);

  return (
    <>
      <Head>
        <title>{project ? `${project.title} | Student Projects` : 'Project details'} | AA Educates</title>
      </Head>
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <StudentNav active="/student/projects" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
          <Link
            href="/student/projects"
            className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to projects
          </Link>

          {loading ? (
            <div className="flex items-center justify-center min-h-[320px]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
            </div>
          ) : error ? (
            <div className="max-w-2xl mx-auto">
              <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
                <h2 className="text-xl font-semibold text-red-700 mb-2">Project unavailable</h2>
                <p className="text-red-600">{error}</p>
              </div>
            </div>
          ) : project ? (
            <div className="grid gap-8 lg:grid-cols-3">
              <article className="lg:col-span-2 bg-white border border-indigo-100 rounded-2xl shadow-lg p-8 space-y-6">
                <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-wide">
                  <span className={
                    project.status === 'OPEN'
                      ? 'inline-flex items-center gap-2 px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 font-semibold'
                      : project.status === 'CLOSED'
                      ? 'inline-flex items-center gap-2 px-2 py-1 rounded-full bg-gray-200 text-gray-700 font-semibold'
                      : 'inline-flex items-center gap-2 px-2 py-1 rounded-full bg-amber-100 text-amber-700 font-semibold'
                  }>
                    {project.status}
                  </span>
                  <span className="text-gray-500">Project ID #{project.id}</span>
                  <span className="text-gray-400">Created {new Date(project.created_at).toLocaleDateString()}</span>
                </div>

                <header>
                  <h1 className="text-3xl font-bold text-gray-900 mb-3">{project.title}</h1>
                  <p className="text-gray-600 leading-relaxed text-lg">
                    {project.description || 'No description provided for this project.'}
                  </p>
                </header>

                <section className="space-y-4">
                  <h2 className="text-xl font-semibold text-gray-900">What you will do</h2>
                  <p className="text-gray-600 leading-relaxed">
                    Use your creativity, collaboration, and problem-solving skills to address a real brief set by our corporate
                    partners. Demonstrate your approach, communicate your impact, and document your journey along the way.
                  </p>
                  <ul className="list-disc pl-5 space-y-2 text-gray-600">
                    <li>Research the challenge and identify insight-led opportunities.</li>
                    <li>Collaborate with teammates or mentors to prototype ideas.</li>
                    <li>Submit your findings, reflections, and final deliverables by the deadline.</li>
                  </ul>
                </section>

                <section className="space-y-4">
                  <h2 className="text-xl font-semibold text-gray-900">How to take part</h2>
                  <ol className="list-decimal pl-5 space-y-2 text-gray-600">
                    <li>Confirm you are available to meet the project timeline.</li>
                    <li>Prepare examples of related work or transferable skills.</li>
                    <li>Submit your expression of interest via the button below.</li>
                  </ol>
                </section>
              </article>

              <aside className="bg-white border border-indigo-100 rounded-2xl shadow-md p-6 space-y-6">
                <section>
                  <h2 className="text-lg font-semibold text-gray-900 mb-3">Key dates</h2>
                  <dl className="space-y-3 text-sm text-gray-600">
                    {timeline.map((item) => (
                      <div key={item.label} className="flex justify-between">
                        <dt>{item.label}</dt>
                        <dd className="font-medium text-gray-900">{item.value}</dd>
                      </div>
                    ))}
                  </dl>
                </section>

                <section className="space-y-3">
                  <h2 className="text-lg font-semibold text-gray-900">Ready to apply?</h2>
                  <p className="text-sm text-gray-600">
                    Express your interest and we will notify the project sponsors. You can withdraw your application at any time.
                  </p>
                  <button className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition">
                    Submit expression of interest
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14m-7-7l7 7-7 7" />
                    </svg>
                  </button>
                  <button className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 transition">
                    Save to shortlist
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5v14l7-5 7 5V5a2 2 0 00-2-2H7a2 2 0 00-2 2z" />
                    </svg>
                  </button>
                </section>

                <section className="space-y-3 text-sm text-gray-500">
                  <p>Questions about this brief? Reach out to your mentor or email <a className="text-indigo-600" href="mailto:projects@aaeducates.com">projects@aaeducates.com</a>.</p>
                  <p>Remember to follow safeguarding guidelines and only share work you are comfortable uploading.</p>
                </section>
              </aside>
            </div>
          ) : null}
        </div>
      </main>
    </>
  );
};

export default StudentProjectDetailPage;
