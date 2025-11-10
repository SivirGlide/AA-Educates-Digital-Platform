import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import type { NextPage } from 'next';
import { FormEvent, useState } from 'react';
import { api } from '../lib/api';

const LoginPage: NextPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const response = await api.login(email, password);

    if (response.error || !response.data) {
      setError(response.error || 'Unable to login. Please try again.');
      setLoading(false);
      return;
    }

    const { access, refresh, user } = response.data;

    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      localStorage.setItem('userId', String(user?.id ?? ''));
      localStorage.setItem('userRole', user?.role ?? '');
      if (user?.profile_id) {
        localStorage.setItem('profileId', String(user.profile_id));
      }
    }

    setLoading(false);

    const role = (user?.role ?? '').toLowerCase();
    const destination =
      role === 'corporate_partner'
        ? '/corporate/dashboard'
        : role === 'parent'
        ? '/parent/dashboard'
        : role === 'admin'
        ? '/admin/dashboard'
        : '/student/dashboard';

    router.push(destination);
  };

  return (
    <>
      <Head>
        <title>Login | AA Educates</title>
        <meta name="description" content="Sign in to access the AA Educates platform." />
      </Head>
      <main className="min-h-screen bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-500 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-10">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Welcome back</h1>
          <p className="text-gray-600 mb-8">
            Enter your credentials to continue. Don’t have an account?{' '}
            <Link href="/register" className="text-purple-600 font-semibold">
              Create one here
            </Link>
            .
          </p>

          {error && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <form className="grid gap-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="••••••••"
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-gray-600">
                <input type="checkbox" className="rounded border-gray-300 text-purple-600" />
                Remember me
              </label>
              <Link href="/contact" className="text-purple-600 font-medium">
                Need help?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center rounded-xl bg-purple-600 px-6 py-3 font-semibold text-white shadow hover:bg-purple-700 transition disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </div>
      </main>
    </>
  );
};

export default LoginPage;
