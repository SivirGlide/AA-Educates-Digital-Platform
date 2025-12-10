import Head from 'next/head';
import Link from 'next/link';
import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { api } from '../../lib/api';

interface StudentProfile {
  id: number;
  user: number;
  bio: string;
  portfolio_link: string;
  badges: number[];
  certificates: number[];
  skills: number[];
}

interface StudentWithUser {
  profile: StudentProfile;
  name: string;
  email: string;
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

const ParentStudentsPage: NextPage = () => {
  const [students, setStudents] = useState<StudentWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const parentId = localStorage.getItem('profileId');
        if (!parentId) {
          setError('Please login to view students');
          setLoading(false);
          return;
        }

        const parentResponse = await api.getParent(parseInt(parentId, 10));
        if (parentResponse.error || !parentResponse.data) {
          setError(parentResponse.error || 'Unable to load parent record');
          setLoading(false);
          return;
        }

        const childIds: number[] = (parentResponse.data as any).students || [];
        if (childIds.length === 0) {
          setStudents([]);
          setLoading(false);
          return;
        }

        const childData = await Promise.all(
          childIds.map(async (id) => {
            const studentResponse = await api.getStudent(id);
            if (!studentResponse.data) return null;
            const userResponse = await api.getUser(studentResponse.data.user);
            return {
              profile: studentResponse.data as StudentProfile,
              name: `${userResponse.data?.first_name || 'Student'} ${userResponse.data?.last_name || ''}`.trim(),
              email: userResponse.data?.email || 'hello@aaeducates.com',
            };
          })
        );

        setStudents(childData.filter(Boolean) as StudentWithUser[]);
      } catch (err) {
        setError('Something went wrong while fetching students');
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  return (
    <>
      <Head>
        <title>Students | Parent Portal</title>
      </Head>
      <main className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
        <ParentNav active="/parent/students" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
          <header className="space-y-3">
            <h1 className="text-3xl font-extrabold text-gray-900">My children</h1>
            <p className="text-gray-600 max-w-3xl">
              Stay up to date with your child’s learning journey. View a snapshot of achievements, projects, and the latest updates in
              one place.
            </p>
          </header>

          {loading ? (
            <div className="flex items-center justify-center min-h-[240px]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600" />
            </div>
          ) : error ? (
            <div className="max-w-2xl mx-auto">
              <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
                <h2 className="text-xl font-semibold text-red-700 mb-2">Students unavailable</h2>
                <p className="text-red-600">{error}</p>
              </div>
            </div>
          ) : students.length === 0 ? (
            <div className="max-w-2xl mx-auto bg-white border border-green-100 rounded-2xl shadow p-10 text-center">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">No students linked</h2>
              <p className="text-gray-600 mb-6">Once your child has been invited, their progress will appear here.</p>
              <Link
                href="/contact"
                className="inline-flex items-center px-4 py-2 rounded-xl bg-teal-600 text-white font-semibold hover:bg-teal-700 transition"
              >
                Request an invite
              </Link>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {students.map((student) => (
                <article
                  key={student.profile.id}
                  className="group bg-white border border-green-100 rounded-2xl shadow hover:shadow-xl transition p-6 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900">{student.name}</h2>
                    <span className="text-xs text-teal-500 uppercase tracking-wide">Student #{student.profile.id}</span>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">{student.profile.bio || 'No bio provided yet.'}</p>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <p className="text-2xl font-bold text-green-700">{student.profile.badges?.length || 0}</p>
                      <p className="text-xs text-gray-600">Badges</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-teal-700">{student.profile.certificates?.length || 0}</p>
                      <p className="text-xs text-gray-600">Certificates</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-emerald-700">{student.profile.skills?.length || 0}</p>
                      <p className="text-xs text-gray-600">Skills</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Link
                      href={`/parent/student/${student.profile.id}`}
                      className="inline-flex items-center gap-2 rounded-xl bg-teal-600 text-white px-4 py-2 text-sm font-semibold hover:bg-teal-700 transition"
                    >
                      View profile
                    </Link>
                    {student.profile.portfolio_link && (
                      <Link
                        href={student.profile.portfolio_link}
                        target="_blank"
                        className="inline-flex items-center gap-2 rounded-xl border border-gray-200 text-gray-600 px-4 py-2 text-sm font-semibold hover:bg-gray-50 transition"
                      >
                        Portfolio
                      </Link>
                    )}
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

export default ParentStudentsPage;
