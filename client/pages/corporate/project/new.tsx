import Head from 'next/head';
import type { NextPage } from 'next';
import Link from 'next/link';
import { useState } from 'react';
import { api } from '../../../lib/api';

interface ProjectForm {
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  status: 'DRAFT' | 'OPEN' | 'CLOSED';
  skills_required: number[];
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


const defaultForm: ProjectForm = {
  title: '',
  description: '',
  start_date: '',
  end_date: '',
  status: 'DRAFT',
  skills_required: [],
};

const CorporateNewProjectPage: NextPage = () => {
  const [form, setForm] = useState<ProjectForm>(defaultForm);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setMessage(null);
    setError(null);

    try {
      const profileId = parseInt(localStorage.getItem('profileId') || '0', 10);
      if (!profileId) {
        setError('Please log in again to create a project.');
        setSubmitting(false);
        return;
      }
      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        created_by: profileId,
        status: form.status,
        skills_required: form.skills_required,
        ...(form.start_date && { start_date: form.start_date }),
        ...(form.end_date && { end_date: form.end_date }),
      };

      const response = await api.createProject(payload);
      if (response.error) {
        setError(response.error);
      } else {
        setMessage('Project created successfully. View it within your dashboard.');
        setForm(defaultForm);
      }
    } catch (err) {
      setError('Unable to create project right now.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Head>
        <title>Create New Project | AA Educates</title>
      </Head>
      <main className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-pink-50">
        <CorporateNav active="/corporate/project/new" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
          <header className="space-y-3">
            <h1 className="text-3xl font-extrabold text-gray-900">Create a project</h1>
            <p className="text-gray-600 max-w-3xl">Share a brief with AA Educates learners. You can edit details in your dashboard after submission.</p>
          </header>

          <section className="bg-white border border-purple-100 rounded-2xl shadow p-8 space-y-6">
            {message && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl p-4">
                {message}
              </div>
            )}
            {error && (
              <div className="bg-rose-50 border border-rose-200 text-rose-700 rounded-xl p-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Project title</label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={form.description}
                    onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
                    rows={6}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Start date</label>
                    <input
                      type="date"
                      value={form.start_date}
                      onChange={(event) => setForm((prev) => ({ ...prev, start_date: event.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">End date</label>
                    <input
                      type="date"
                      value={form.end_date}
                      onChange={(event) => setForm((prev) => ({ ...prev, end_date: event.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={form.status}
                    onChange={(event) => setForm((prev) => ({ ...prev, status: event.target.value as ProjectForm['status'] }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="DRAFT">Draft</option>
                    <option value="OPEN">Open</option>
                    <option value="CLOSED">Closed</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 rounded-xl bg-purple-600 text-white px-6 py-3 font-semibold hover:bg-purple-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Creating project...' : 'Create project'}
                </button>
                <Link
                  href="/corporate/projects"
                  className="inline-flex items-center gap-2 rounded-xl border border-gray-200 text-gray-600 px-6 py-3 font-semibold hover:bg-gray-50 transition"
                >
                  Cancel
                </Link>
              </div>
            </form>
          </section>
        </div>
      </main>
    </>
  );
};

export default CorporateNewProjectPage;
