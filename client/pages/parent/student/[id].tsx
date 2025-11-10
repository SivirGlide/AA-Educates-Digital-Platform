import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import type { NextPage } from 'next';
import { useEffect, useMemo, useState } from 'react';
import { api } from '../../../lib/api';

interface StudentProfile {
  id: number;
  user: number;
  bio: string;
  portfolio_link: string;
  badges: number[];
  certificates: number[];
  skills: number[];
}

interface Badge {
  id: number;
  name: string;
  description: string;
}

interface Certificate {
  id: number;
  name: string;
  description: string;
  issued_on: string;
}

interface Submission {
  id: number;
  project: number;
  submission_link: string;
  feedback: string;
  grade: number | null;
  status: string;
  submitted_at: string;
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

const ParentStudentDetailPage: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [student, setStudent] = useState<StudentProfile | null>(null);
  const [studentName, setStudentName] = useState('');
  const [email, setEmail] = useState('');
  const [badges, setBadges] = useState<Badge[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchStudent = async () => {
      try {
        const profileResponse = await api.getStudent(Number(id));
        if (profileResponse.error || !profileResponse.data) {
          setError(profileResponse.error || 'Student not found');
          setLoading(false);
          return;
        }

        const profile = profileResponse.data as StudentProfile;
        setStudent(profile);

        const userResponse = await api.getUser(profile.user);
        if (userResponse.data) {
          setStudentName(`${userResponse.data.first_name || 'Student'} ${userResponse.data.last_name || ''}`.trim());
          setEmail(userResponse.data.email || 'hello@aaeducates.com');
        }

        const badgesResponse = await api.getBadges();
        if (Array.isArray(badgesResponse.data)) {
          setBadges(badgesResponse.data.slice(0, 6) as Badge[]);
        }

        const certificatesResponse = await api.getCertificates();
        if (Array.isArray(certificatesResponse.data)) {
          setCertificates(certificatesResponse.data.slice(0, 6) as Certificate[]);
        }

        const submissionsResponse = await api.getSubmissions();
        if (Array.isArray(submissionsResponse.data)) {
          setSubmissions(
            submissionsResponse.data.filter((submission: Submission) => submission.student === profile.id)
          );
        }
      } catch (err) {
        setError('Something went wrong while fetching student details');
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [id]);

  const submissionSummary = useMemo(() => {
    if (!submissions.length) return { approved: 0, reviewed: 0, pending: 0 };
    return submissions.reduce(
      (acc, submission) => {
        if (submission.status === 'APPROVED') acc.approved += 1;
        else if (submission.status === 'REVIEWED') acc.reviewed += 1;
        else acc.pending += 1;
        return acc;
      },
      { approved: 0, reviewed: 0, pending: 0 }
    );
  }, [submissions]);

  return (
    <>
      <Head>
        <title>{studentName ? `${studentName} | Parent Portal` : 'Student details'} | AA Educates</title>
      </Head>
      <main className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
        <ParentNav active="/parent/students" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
          <Link
            href="/parent/students"
            className="inline-flex items-center gap-2 text-sm font-semibold text-teal-600 hover:text-teal-700"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to students
          </Link>

          {loading ? (
            <div className="flex items-center justify-center min-h-[300px]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600" />
            </div>
          ) : error ? (
            <div className="max-w-2xl mx-auto">
              <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
                <h2 className="text-xl font-semibold text-red-700 mb-2">Student unavailable</h2>
                <p className="text-red-600">{error}</p>
              </div>
            </div>
          ) : student ? (
            <div className="grid gap-8 lg:grid-cols-3">
              <section className="lg:col-span-2 bg-white border border-green-100 rounded-2xl shadow-lg p-8 space-y-6">
                <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">{studentName || `Student #${student.id}`}</h1>
                    <p className="text-sm text-gray-600">{email}</p>
                  </div>
                  {student.portfolio_link && (
                    <Link
                      href={student.portfolio_link}
                      target="_blank"
                      className="inline-flex items-center gap-2 rounded-xl bg-teal-600 text-white px-4 py-2 text-sm font-semibold hover:bg-teal-700 transition"
                    >
                      View portfolio
                    </Link>
                  )}
                </header>

                <section className="space-y-3">
                  <h2 className="text-xl font-semibold text-gray-900">Overview</h2>
                  <p className="text-sm text-gray-600 leading-relaxed">{student.bio || 'No bio provided yet.'}</p>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="rounded-xl bg-green-50 py-4">
                      <p className="text-2xl font-bold text-green-700">{student.badges?.length || 0}</p>
                      <p className="text-xs uppercase tracking-wide text-green-500">Badges</p>
                    </div>
                    <div className="rounded-xl bg-emerald-50 py-4">
                      <p className="text-2xl font-bold text-emerald-700">{student.certificates?.length || 0}</p>
                      <p className="text-xs uppercase tracking-wide text-emerald-500">Certificates</p>
                    </div>
                    <div className="rounded-xl bg-teal-50 py-4">
                      <p className="text-2xl font-bold text-teal-700">{student.skills?.length || 0}</p>
                      <p className="text-xs uppercase tracking-wide text-teal-500">Skills</p>
                    </div>
                  </div>
                </section>

                <section className="space-y-3">
                  <h2 className="text-xl font-semibold text-gray-900">Project submissions</h2>
                  {submissions.length === 0 ? (
                    <p className="text-sm text-gray-600">No submissions yet. Encourage your child to explore current projects.</p>
                  ) : (
                    <div className="space-y-3">
                      {submissions.slice(0, 5).map((submission) => (
                        <article key={submission.id} className="border border-green-100 rounded-xl p-4 bg-white">
                          <div className="flex items-center justify-between text-sm text-gray-500">
                            <span>Submitted {new Date(submission.submitted_at).toLocaleDateString()}</span>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              submission.status === 'APPROVED'
                                ? 'bg-green-100 text-green-700'
                                : submission.status === 'REVIEWED'
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-amber-100 text-amber-700'
                            }`}>
                              {submission.status}
                            </span>
                          </div>
                          <p className="mt-2 text-sm text-gray-700 leading-relaxed">
                            {submission.feedback || 'Feedback to be shared soon.'}
                          </p>
                          <div className="mt-3 flex gap-3 text-sm">
                            <Link
                              href={submission.submission_link || '#'}
                              className="inline-flex items-center gap-2 text-teal-600 font-semibold hover:text-teal-700"
                            >
                              View submission
                            </Link>
                            {submission.grade && (
                              <span className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-semibold">
                                Grade {submission.grade}
                              </span>
                            )}
                          </div>
                        </article>
                      ))}
                    </div>
                  )}
                </section>
              </section>

              <aside className="space-y-6">
                <section className="bg-white border border-green-100 rounded-2xl shadow p-6 space-y-4">
                  <h2 className="text-lg font-semibold text-gray-900">Summary</h2>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center justify-between">
                      <span>Approved submissions</span>
                      <span className="font-semibold text-green-700">{submissionSummary.approved}</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span>Awaiting review</span>
                      <span className="font-semibold text-amber-700">{submissionSummary.pending}</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span>Reviewed</span>
                      <span className="font-semibold text-blue-600">{submissionSummary.reviewed}</span>
                    </li>
                  </ul>
                </section>

                <section className="bg-white border border-green-100 rounded-2xl shadow p-6 space-y-3">
                  <h2 className="text-lg font-semibold text-gray-900">Support your child</h2>
                  <p className="text-sm text-gray-600">
                    Celebrate wins and encourage reflection. Ask about what they learned, what challenged them, and what they want to try next.
                  </p>
                  <Link
                    href="/contact"
                    className="inline-flex items-center px-4 py-2 rounded-xl bg-teal-600 text-white font-semibold hover:bg-teal-700 transition"
                  >
                    Contact mentor team
                  </Link>
                </section>
              </aside>
            </div>
          ) : null}
        </div>
      </main>
    </>
  );
};

export default ParentStudentDetailPage;
