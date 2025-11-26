import Head from 'next/head';
import { useRouter } from 'next/router';
import type { NextPage } from 'next';
import { useEffect } from 'react';

const LogoutPage: NextPage = () => {
  const router = useRouter();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Clear all auth-related localStorage items
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    localStorage.removeItem('userId');
    localStorage.removeItem('userRole');
    localStorage.removeItem('profileId');

    const timeout = setTimeout(() => router.replace('/login'), 1500);

    return () => clearTimeout(timeout);
  }, [router]);

  return (
    <>
      <Head>
        <title>Logging out… | AA Educates</title>
      </Head>
      <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-8 text-center max-w-md">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-purple-100 text-purple-600">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H5a3 3 0 01-3-3V7a3 3 0 013-3h5a3 3 0 013 3v1" />
            </svg>
          </div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">You have been signed out</h1>
          <p className="text-gray-600 mb-4">Taking you back to the homepage…</p>
          <p className="text-sm text-gray-400">If you are not redirected automatically, <a href="/" className="text-purple-600 font-semibold">click here</a>.</p>
        </div>
      </main>
    </>
  );
};

export default LogoutPage;
