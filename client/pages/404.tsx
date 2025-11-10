import Head from 'next/head';
import Link from 'next/link';
import type { NextPage } from 'next';

const NotFoundPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>404 – Page not found | AA Educates</title>
      </Head>
      <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center px-6">
        <div className="text-center max-w-xl">
          <h1 className="text-8xl font-black text-purple-600 mb-4">404</h1>
          <h2 className="text-3xl font-extrabold text-gray-900 mb-4">We can’t find the page you’re looking for</h2>
          <p className="text-gray-600 mb-8">
            The link may be broken or the page may have moved. Explore the latest learning experiences or head back to the
            homepage.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/" className="px-6 py-3 rounded-xl bg-purple-600 text-white font-semibold hover:bg-purple-700 transition">
              Return home
            </Link>
            <Link href="/contact" className="px-6 py-3 rounded-xl border border-purple-200 text-purple-600 font-semibold hover:bg-white">
              Tell us what happened
            </Link>
          </div>
        </div>
      </main>
    </>
  );
};

export default NotFoundPage;
