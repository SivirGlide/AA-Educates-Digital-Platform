import Head from 'next/head';
import Link from 'next/link';
import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { api } from '../../lib/api';

interface StudentProfile {
  id: number;
  user: number;
  school: number | null;
  bio: string;
  cv: string;
  portfolio_link: string;
  badges: number[];
  certificates: number[];
  skills: number[];
}

interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
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

const StudentProfilePage: NextPage = () => {
  const [student, setStudent] = useState<StudentProfile | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileId = localStorage.getItem('profileId');
        const userId = localStorage.getItem('userId');

        if (!profileId || !userId) {
          setError('Please login to view your profile');
          setLoading(false);
          return;
        }

        const studentResponse = await api.getStudent(parseInt(profileId, 10));
        if (studentResponse.error || !studentResponse.data) {
          setError(studentResponse.error || 'Unable to load student profile');
          setLoading(false);
          return;
        }

        setStudent(studentResponse.data as StudentProfile);

        const userResponse = await api.getUser(parseInt(userId, 10));
        if (userResponse.data && typeof userResponse.data === 'object' && 'id' in userResponse.data) {
          setUser(userResponse.data as User);
        }
      } catch (err) {
        setError('Something went wrong while fetching your profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return (
    <>
      <Head>
        <title>Student Profile | AA Educates</title>
      </Head>
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <StudentNav active="/student/profile" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {loading ? (
            <div className="flex items-center justify-center min-h-[360px]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
            </div>
          ) : error ? (
            <div className="max-w-2xl mx-auto">
              <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
                <h2 className="text-xl font-semibold text-red-700 mb-2">Profile unavailable</h2>
                <p className="text-red-600">{error}</p>
              </div>
            </div>
          ) : student && user ? (
            <div className="space-y-10">
              <section className="bg-white rounded-2xl shadow-lg border border-indigo-100 p-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                  <div>
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
                      {user.first_name || user.username} {user.last_name}
                    </h1>
                    <p className="text-gray-600">{user.email}</p>
                    <p className="text-sm text-indigo-500 mt-2 uppercase tracking-wide">Role: {user.role.replace('_', ' ')}</p>
                  </div>
                  <div className="flex gap-4">
                    <Link
                      href="/student/settings"
                      className="inline-flex items-center px-4 py-2 rounded-xl border border-indigo-200 text-indigo-600 font-medium hover:bg-indigo-50"
                    >
                      Edit profile
                    </Link>
                    {student.portfolio_link && (
                      <Link
                        href={student.portfolio_link}
                        target="_blank"
                        className="inline-flex items-center px-4 py-2 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700"
                      >
                        View portfolio
                      </Link>
                    )}
                  </div>
                </div>
                {student.bio && (
                  <p className="mt-6 text-gray-700 leading-relaxed">{student.bio}</p>
                )}
              </section>

              <section className="grid gap-6 md:grid-cols-2">
                <div className="bg-white rounded-2xl shadow border border-blue-100 p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact & documents</h2>
                  <dl className="space-y-3 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <dt>CV / Resume</dt>
                      <dd>
                        {student.cv ? (
                          <a href={student.cv} className="text-indigo-600 font-medium">Download</a>
                        ) : (
                          'Not uploaded'
                        )}
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt>Portfolio link</dt>
                      <dd>
                        {student.portfolio_link ? (
                          <a href={student.portfolio_link} className="text-indigo-600 font-medium">Open link</a>
                        ) : (
                          'Not provided'
                        )}
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt>School ID</dt>
                      <dd>{student.school ?? 'Not assigned'}</dd>
                    </div>
                  </dl>
                </div>

                <div className="bg-white rounded-2xl shadow border border-purple-100 p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">At a glance</h2>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="rounded-xl bg-indigo-50 py-4">
                      <p className="text-3xl font-bold text-indigo-600">{student.badges?.length ?? 0}</p>
                      <p className="text-xs uppercase tracking-wide text-indigo-500">Badges</p>
                    </div>
                    <div className="rounded-xl bg-emerald-50 py-4">
                      <p className="text-3xl font-bold text-emerald-600">{student.certificates?.length ?? 0}</p>
                      <p className="text-xs uppercase tracking-wide text-emerald-500">Certificates</p>
                    </div>
                    <div className="rounded-xl bg-amber-50 py-4">
                      <p className="text-3xl font-bold text-amber-600">{student.skills?.length ?? 0}</p>
                      <p className="text-xs uppercase tracking-wide text-amber-500">Skills</p>
                    </div>
                  </div>
                </div>
              </section>

              <section className="bg-white rounded-2xl shadow border border-gray-100 p-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Update your profile</h2>
                <form className="grid gap-6 md:grid-cols-2" onSubmit={(event) => event.preventDefault()}>
                  <div className="md:col-span-2">
                    <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
                      Professional summary
                    </label>
                    <textarea
                      id="bio"
                      rows={4}
                      defaultValue={student.bio}
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Share your interests, passions, and goals"
                    />
                  </div>
                  <div>
                    <label htmlFor="cv" className="block text-sm font-medium text-gray-700 mb-2">
                      CV link
                    </label>
                    <input
                      id="cv"
                      type="url"
                      defaultValue={student.cv}
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="https://..."
                    />
                  </div>
                  <div>
                    <label htmlFor="portfolio" className="block text-sm font-medium text-gray-700 mb-2">
                      Portfolio link
                    </label>
                    <input
                      id="portfolio"
                      type="url"
                      defaultValue={student.portfolio_link}
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="https://..."
                    />
                  </div>
                  <div className="md:col-span-2 flex justify-end">
                    <button
                      type="submit"
                      className="inline-flex items-center px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
                    >
                      Save changes
                    </button>
                  </div>
                </form>
              </section>
            </div>
          ) : null}
        </div>
      </main>
    </>
  );
};

export default StudentProfilePage;
