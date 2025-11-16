import Head from 'next/head';
import Link from 'next/link';
import type { NextPage } from 'next';

const ForbiddenPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>403 – Access Forbidden | AA Educates</title>
      </Head>
      <main className="min-h-screen bg-gradient-to-br from-red-50 via-rose-50 to-orange-50 flex items-center justify-center px-6">
        <div className="max-w-xl w-full bg-white border border-rose-100 rounded-3xl shadow-xl p-10 text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-rose-100 text-rose-600">
            <svg className="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 4h.01M4.293 4.293l15.414 15.414" />
            </svg>
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-3">403 – Access forbidden</h1>
          <p className="text-gray-600 mb-6">
            You don’t have permission to view this page. If you believe this is an error, contact the platform administrator or
            visit the help centre.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/" className="px-6 py-3 rounded-xl bg-purple-600 text-white font-semibold hover:bg-purple-700 transition">
              Go to homepage
            </Link>
            <Link href="/contact" className="px-6 py-3 rounded-xl border border-purple-200 text-purple-600 font-semibold hover:bg-white">
              Contact support
            </Link>
          </div>
        </div>
      </main>
    </>
  );
};

export default ForbiddenPage;
