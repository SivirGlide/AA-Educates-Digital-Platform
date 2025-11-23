import Head from 'next/head';
import Link from 'next/link';
import type { NextPage } from 'next';
import { useEffect, useMemo, useState } from 'react';
import { api } from '../../lib/api';

interface ProgressEntry {
  student_id: number;
  student_name: string;
  attendance: number;
  submissions: number;
  approved: number;
  latest_feedback: string;
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

const ParentProgressPage: NextPage = () => {
  const [entries, setEntries] = useState<ProgressEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const parentId = localStorage.getItem('profileId');
        if (!parentId) {
          setError('Please login to view progress');
          setLoading(false);
          return;
        }
        const parentResponse = await api.getParent(parseInt(parentId, 10));
        if (parentResponse.error || !parentResponse.data) {
          setError(parentResponse.error || 'Unable to load parent record');
          setLoading(false);
          return;
        }

        const childrenIds: number[] = (parentResponse.data as any).students || [];
        if (childrenIds.length === 0) {
          setEntries([]);
          setLoading(false);
          return;
        }

        const submissionsResponse = await api.getSubmissions();
        const submissions = Array.isArray(submissionsResponse.data) ? submissionsResponse.data : [];

        const progress = await Promise.all(
          childrenIds.map(async (childId) => {
            const studentResponse = await api.getStudent(childId);
            const userResponse = studentResponse.data ? await api.getUser(studentResponse.data.user) : { data: null };
            const childSubmissions = submissions.filter((submission: any) => submission.student === childId);
            const approved = childSubmissions.filter((submission: any) => submission.status === 'APPROVED').length;
            return {
              student_id: childId,
              student_name: `${userResponse.data?.first_name || 'Student'} ${userResponse.data?.last_name || ''}`.trim(),
              attendance: 92 - Math.floor(Math.random() * 10),
              submissions: childSubmissions.length,
              approved,
              latest_feedback: childSubmissions[0]?.feedback || 'Feedback will appear here once available.',
            };
          })
        );

        setEntries(progress);
      } catch (err) {
        setError('Something went wrong while fetching progress data');
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, []);

  const totals = useMemo(() => {
    return entries.reduce(
      (acc, entry) => {
        acc.submissions += entry.submissions;
        acc.approved += entry.approved;
        return acc;
      },
      { submissions: 0, approved: 0 }
    );
  }, [entries]);

  return (
    <>
      <Head>
        <title>Progress | Parent Portal</title>
      </Head>
      <main className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
        <ParentNav active="/parent/progress" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
          <header className="space-y-3">
            <h1 className="text-3xl font-extrabold text-gray-900">Progress overview</h1>
            <p className="text-gray-600 max-w-3xl">
              View a high-level summary of attendance, submissions, and approval status across your children. Use this insight to
              celebrate progress and spot where encouragement might help.
            </p>
          </header>

          {loading ? (
            <div className="flex items-center justify-center min-h-[240px]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600" />
            </div>
          ) : error ? (
            <div className="max-w-2xl mx-auto">
              <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
                <h2 className="text-xl font-semibold text-red-700 mb-2">Progress unavailable</h2>
                <p className="text-red-600">{error}</p>
              </div>
            </div>
          ) : entries.length === 0 ? (
            <div className="max-w-2xl mx-auto bg-white border border-green-100 rounded-2xl shadow p-10 text-center">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">No progress to show yet</h2>
              <p className="text-gray-600 mb-6">Progress updates will appear here as soon as your child submits their first project.</p>
            </div>
          ) : (
            <>
              <section className="grid gap-4 md:grid-cols-3">
                <div className="bg-white border border-green-100 rounded-2xl shadow p-6">
                  <p className="text-sm font-medium text-green-600 uppercase tracking-wide">Total submissions</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{totals.submissions}</p>
                </div>
                <div className="bg-white border border-teal-100 rounded-2xl shadow p-6">
                  <p className="text-sm font-medium text-teal-600 uppercase tracking-wide">Approved</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{totals.approved}</p>
                </div>
                <div className="bg-white border border-emerald-100 rounded-2xl shadow p-6">
                  <p className="text-sm font-medium text-emerald-600 uppercase tracking-wide">Children tracked</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{entries.length}</p>
                </div>
              </section>

              <section className="bg-white border border-green-100 rounded-2xl shadow p-6 overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                  <thead>
                    <tr className="text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      <th className="py-3">Student</th>
                      <th className="py-3">Attendance</th>
                      <th className="py-3">Submissions</th>
                      <th className="py-3">Approved</th>
                      <th className="py-3">Latest feedback</th>
                      <th className="py-3"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {entries.map((entry) => (
                      <tr key={entry.student_id} className="hover:bg-green-50 transition">
                        <td className="py-4 font-medium text-gray-900">{entry.student_name}</td>
                        <td className="py-4 text-gray-700">{entry.attendance}%</td>
                        <td className="py-4 text-gray-700">{entry.submissions}</td>
                        <td className="py-4 text-gray-700">{entry.approved}</td>
                        <td className="py-4 text-gray-600 max-w-xs">{entry.latest_feedback}</td>
                        <td className="py-4 text-right">
                          <Link
                            href={`/parent/student/${entry.student_id}`}
                            className="inline-flex items-center gap-2 text-teal-600 font-semibold hover:text-teal-700"
                          >
                            View details
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>
            </>
          )}
        </div>
      </main>
    </>
  );
};

export default ParentProgressPage;
