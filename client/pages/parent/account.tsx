import Head from 'next/head';
import Link from 'next/link';
import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { api } from '../../lib/api';

interface ParentProfile {
  id: number;
  user: number;
  students: number[];
}

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
}

const navLinks = [
  { href: '/parent/dashboard', label: 'Dashboard' },
  { href: '/parent/students', label: 'Students' },
  { href: '/parent/progress', label: 'Progress' },
  { href: '/parent/workbooks', label: 'Workbooks' },
  { href: '/parent/certificates', label: 'Certificates' },
  { href: '/parent/account', label: 'Account' },
  { href: '/parent/settings', label: 'Settings' }
];

const ParentNav: React.FC<{ active: string }> = ({ active }) => (
  <nav className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200 sticky top-0 z-40">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="text-2xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent"
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
                ? 'bg-teal-600 text-white shadow'
                : 'text-gray-600 hover:text-teal-600 hover:bg-teal-50'
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

const ParentAccountPage: NextPage = () => {
  const [profile, setProfile] = useState<ParentProfile | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAccount = async () => {
      try {
        const profileId = localStorage.getItem('profileId');
        const userId = localStorage.getItem('userId');
        if (!profileId || !userId) {
          setError('Please login to view account details');
          setLoading(false);
          return;
        }

        const parentResponse = await api.getParent(parseInt(profileId, 10));
        if (parentResponse.error || !parentResponse.data) {
          setError(parentResponse.error || 'Unable to load account');
          setLoading(false);
          return;
        }
        setProfile(parentResponse.data as ParentProfile);

        const userResponse = await api.getUser(parseInt(userId, 10));
        if (userResponse.data) {
          setUser(userResponse.data as User);
        }
      } catch (err) {
        setError('Something went wrong while fetching account information');
      } finally {
        setLoading(false);
      }
    };

    fetchAccount();
  }, []);

  return (
    <>
      <Head>
        <title>Account | Parent Portal</title>
      </Head>
      <main className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
        <ParentNav active="/parent/account" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
          <header className="space-y-3">
            <h1 className="text-3xl font-extrabold text-gray-900">Account information</h1>
            <p className="text-gray-600 max-w-3xl">
              Keep your details up to date so we can stay in touch about your child’s progress, enrichment opportunities, and impact
              stories.
            </p>
          </header>

          {loading ? (
            <div className="flex items-center justify-center min-h-[240px]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600" />
            </div>
          ) : error ? (
            <div className="max-w-2xl mx-auto">
              <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
                <h2 className="text-xl font-semibold text-red-700 mb-2">Account unavailable</h2>
                <p className="text-red-600">{error}</p>
              </div>
            </div>
          ) : profile && user ? (
            <div className="grid gap-6 lg:grid-cols-2">
              <section className="bg-white border border-green-100 rounded-2xl shadow p-6 space-y-4">
                <h2 className="text-xl font-semibold text-gray-900">Personal details</h2>
                <div className="space-y-3 text-sm text-gray-600">
                  <p><span className="font-medium text-gray-700">Name:</span> {user.first_name} {user.last_name}</p>
                  <p><span className="font-medium text-gray-700">Email:</span> {user.email}</p>
                  <p><span className="font-medium text-gray-700">Role:</span> {user.role.replace('_', ' ')}</p>
                  <p><span className="font-medium text-gray-700">Linked students:</span> {profile.students.length}</p>
                </div>
                <button className="inline-flex items-center gap-2 rounded-xl bg-teal-600 text-white px-4 py-2 text-sm font-semibold hover:bg-teal-700 transition">
                  Update contact details
                </button>
              </section>

              <section className="bg-white border border-green-100 rounded-2xl shadow p-6 space-y-4">
                <h2 className="text-xl font-semibold text-gray-900">Communication preferences</h2>
                <p className="text-sm text-gray-600">
                  Choose the updates you’d like to receive from AA Educates.
                </p>
                <form className="space-y-3 text-sm text-gray-700" onSubmit={(event) => event.preventDefault()}>
                  <label className="flex items-center justify-between gap-4">
                    <span>Student progress reports</span>
                    <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-gray-300 text-teal-600" />
                  </label>
                  <label className="flex items-center justify-between gap-4">
                    <span>Mentoring reminders</span>
                    <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-gray-300 text-teal-600" />
                  </label>
                  <label className="flex items-center justify-between gap-4">
                    <span>Community newsletters</span>
                    <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-teal-600" />
                  </label>
                  <label className="flex items-center justify-between gap-4">
                    <span>Workbooks & resources</span>
                    <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-teal-600" />
                  </label>
                  <button className="mt-3 inline-flex items-center gap-2 rounded-xl bg-teal-600 text-white px-4 py-2 text-sm font-semibold hover:bg-teal-700 transition">
                    Save preferences
                  </button>
                </form>
              </section>
            </div>
          ) : null}
        </div>
      </main>
    </>
  );
};

export default ParentAccountPage;
