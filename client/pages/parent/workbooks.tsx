import Head from 'next/head';
import Link from 'next/link';
import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { api } from '../../lib/api';

interface Workbook {
  id: number;
  title: string;
  description: string;
  price: number;
  url: string;
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

const ParentWorkbooksPage: NextPage = () => {
  const [workbooks, setWorkbooks] = useState<Workbook[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWorkbooks = async () => {
      try {
        const response = await api.getProjects();
        if (response.error || !Array.isArray(response.data)) {
          setError(response.error || 'Unable to load workbooks');
        } else {
          const mapped = (response.data as any[]).slice(0, 6).map((item, index) => ({
            id: item.id,
            title: item.title || `Workbook ${index + 1}`,
            description: item.description || 'Printable workbook with activities, reflection questions, and extension tasks.',
            price: 9.99 + index,
            url: '/student/resources'
          }));
          setWorkbooks(mapped);
        }
      } catch (err) {
        setError('Something went wrong while fetching workbooks');
      } finally {
        setLoading(false);
      }
    };

    fetchWorkbooks();
  }, []);

  return (
    <>
      <Head>
        <title>Workbooks | Parent Portal</title>
      </Head>
      <main className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
        <ParentNav active="/parent/workbooks" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
          <header className="space-y-3">
            <h1 className="text-3xl font-extrabold text-gray-900">Workbooks & enrichment packs</h1>
            <p className="text-gray-600 max-w-3xl">
              Download activity packs that extend project learning at home. Each workbook is designed to support scaffolding,
              reflection, and family conversation.
            </p>
          </header>

          {loading ? (
            <div className="flex items-center justify-center min-h-[240px]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600" />
            </div>
          ) : error ? (
            <div className="max-w-2xl mx-auto">
              <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
                <h2 className="text-xl font-semibold text-red-700 mb-2">Workbooks unavailable</h2>
                <p className="text-red-600">{error}</p>
              </div>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {workbooks.map((workbook) => (
                <article key={workbook.id} className="bg-white border border-green-100 rounded-2xl shadow hover:shadow-lg transition p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900">{workbook.title}</h2>
                    <span className="text-sm font-semibold text-teal-600">£{workbook.price.toFixed(2)}</span>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">{workbook.description}</p>
                  <div className="flex gap-3">
                    <Link
                      href={workbook.url}
                      className="inline-flex items-center gap-2 rounded-xl bg-teal-600 text-white px-4 py-2 text-sm font-semibold hover:bg-teal-700 transition"
                    >
                      View preview
                    </Link>
                    <button className="inline-flex items-center gap-2 rounded-xl border border-gray-200 text-gray-600 px-4 py-2 text-sm font-semibold hover:bg-gray-50 transition">
                      Add to basket
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

export default ParentWorkbooksPage;
