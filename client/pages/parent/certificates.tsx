import Head from 'next/head';
import Link from 'next/link';
import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { api } from '../../lib/api';

interface Certificate {
  id: number;
  student_id: number;
  name: string;
  description: string;
  issued_on: string;
  issuer: string;
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

const ParentCertificatesPage: NextPage = () => {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const parentId = localStorage.getItem('profileId');
        if (!parentId) {
          setError('Please login to view certificates');
          setLoading(false);
          return;
        }

        const parentResponse = await api.getParent(parseInt(parentId, 10));
        if (parentResponse.error || !parentResponse.data) {
          setError(parentResponse.error || 'Unable to load parent record');
          setLoading(false);
          return;
        }

        const childIds: number[] = parentResponse.data.students || [];
        const certificatesResponse = await api.getCertificates();
        if (certificatesResponse.error || !Array.isArray(certificatesResponse.data)) {
          setError(certificatesResponse.error || 'Unable to load certificates');
          setLoading(false);
          return;
        }

        const mapped = (certificatesResponse.data as any[])
          .filter((cert) => childIds.includes(cert.student || cert.student_id || 0))
          .map((cert) => ({
            id: cert.id,
            student_id: cert.student || cert.student_id || 0,
            name: cert.name || 'Certificate of achievement',
            description: cert.description || 'Awarded for participation in AA Educates learning experiences.',
            issued_on: cert.created_at || cert.issued_on || new Date().toISOString(),
            issuer: cert.issuer || 'AA Educates partner'
          }));

        setCertificates(mapped);
      } catch (err) {
        setError('Something went wrong while fetching certificates');
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();
  }, []);

  return (
    <>
      <Head>
        <title>Certificates | Parent Portal</title>
      </Head>
      <main className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
        <ParentNav active="/parent/certificates" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
          <header className="space-y-3">
            <h1 className="text-3xl font-extrabold text-gray-900">Certificates & celebrations</h1>
            <p className="text-gray-600 max-w-3xl">
              Download and share certificates earned by your child. These digital badges and credentials recognise commitment,
              progress, and community impact.
            </p>
          </header>

          {loading ? (
            <div className="flex items-center justify-center min-h-[240px]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600" />
            </div>
          ) : error ? (
            <div className="max-w-2xl mx-auto">
              <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
                <h2 className="text-xl font-semibold text-red-700 mb-2">Certificates unavailable</h2>
                <p className="text-red-600">{error}</p>
              </div>
            </div>
          ) : certificates.length === 0 ? (
            <div className="max-w-2xl mx-auto bg-white border border-green-100 rounded-2xl shadow p-10 text-center">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">No certificates yet</h2>
              <p className="text-gray-600">
                Certificates will appear here as soon as your child completes projects and milestones accredited by our partners.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {certificates.map((certificate) => (
                <article key={certificate.id} className="bg-white border border-green-100 rounded-2xl shadow hover:shadow-lg transition p-6 space-y-4">
                  <div className="space-y-1">
                    <p className="text-xs uppercase tracking-wide text-teal-500">Student #{certificate.student_id}</p>
                    <h2 className="text-xl font-semibold text-gray-900">{certificate.name}</h2>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">{certificate.description}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Issued {new Date(certificate.issued_on).toLocaleDateString()}</span>
                    <span>{certificate.issuer}</span>
                  </div>
                  <div className="flex gap-3">
                    <button className="inline-flex items-center gap-2 rounded-xl bg-teal-600 text-white px-4 py-2 text-sm font-semibold hover:bg-teal-700 transition">
                      Download PDF
                    </button>
                    <button className="inline-flex items-center gap-2 rounded-xl border border-gray-200 text-gray-600 px-4 py-2 text-sm font-semibold hover:bg-gray-50 transition">
                      Share with school
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

export default ParentCertificatesPage;
