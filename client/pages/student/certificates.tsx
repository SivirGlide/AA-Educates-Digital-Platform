import Head from 'next/head';
import Link from 'next/link';
import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { DashboardLayout } from '@/src/components/layouts/DashboardLayout';

interface Certificate {
  id: number;
  name: string;
  description: string;
  issued_on: string;
  issuer: string;
  credential_url?: string;
}

const StudentCertificatesPage: NextPage = () => {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const response = await api.getCertificates();
        if (response.error || !Array.isArray(response.data)) {
          setError(response.error || 'Unable to load certificates');
        } else {
          const mapped = (response.data as any[]).map((cert, index) => ({
            id: cert.id,
            name: cert.name || `Certificate ${index + 1}`,
            description: cert.description || 'Certificate description coming soon.',
            issued_on: cert.created_at || new Date().toISOString(),
            issuer: cert.issuer || 'AA Educates partner',
            credential_url: cert.credential_url
          }));
          setCertificates(mapped);
        }
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
        <title>Certificates | AA Educates</title>
      </Head>
      <DashboardLayout>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 -mx-6 -my-8 px-6 py-8 space-y-10">
          <header className="space-y-3">
            <h1 className="text-3xl font-extrabold text-gray-900">Certificates & digital credentials</h1>
            <p className="text-gray-600 max-w-3xl">
              Collect evidence of your impact, celebrate completed experiences, and share verifiable credentials with employers or
              further education providers.
            </p>
          </header>

          {loading ? (
            <div className="flex items-center justify-center min-h-[280px]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
            </div>
          ) : error ? (
            <div className="max-w-2xl mx-auto">
              <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
                <h2 className="text-xl font-semibold text-red-700 mb-2">Certificates unavailable</h2>
                <p className="text-red-600">{error}</p>
              </div>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {certificates.map((certificate) => (
                <article key={certificate.id} className="bg-white border border-indigo-100 rounded-2xl shadow hover:shadow-lg transition p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900">{certificate.name}</h2>
                    <span className="text-xs uppercase tracking-wide text-indigo-500">{certificate.issuer}</span>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">{certificate.description}</p>
                  <p className="text-xs text-gray-500">Issued {new Date(certificate.issued_on).toLocaleDateString()}</p>
                  <div className="flex flex-wrap gap-3">
                    {certificate.credential_url && (
                      <Link
                        href={certificate.credential_url}
                        target="_blank"
                        className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 text-white px-4 py-2 text-sm font-semibold hover:bg-indigo-700 transition"
                      >
                        View credential
                      </Link>
                    )}
                    <button className="inline-flex items-center gap-2 rounded-xl border border-gray-200 text-gray-600 px-4 py-2 text-sm font-semibold hover:bg-gray-50 transition">
                      Download PDF
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </DashboardLayout>
    </>
  );
};

export default StudentCertificatesPage;
