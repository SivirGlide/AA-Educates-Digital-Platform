import Head from 'next/head';
import Link from 'next/link';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { FormEvent, useState } from 'react';
import { api } from '../lib/api';

const RegisterPage: NextPage = () => {
  const router = useRouter();
  const [formState, setFormState] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    role: 'STUDENT',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const response = await api.register(formState);

    if (response.error || !response.data) {
      setError(response.error || 'Unable to register. Please try again.');
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
    setTimeout(() => router.push('/login'), 1500);
  };

  return (
    <>
      <Head>
        <title>Create an account | AA Educates</title>
        <meta name="description" content="Register for an AA Educates account to access tailored learning experiences." />
      </Head>
      <main className="min-h-screen bg-white flex items-center justify-center px-4 py-16">
        <div className="max-w-3xl w-full grid md:grid-cols-2 bg-white border border-gray-200 rounded-3xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-br from-purple-600 to-pink-600 text-white p-10 flex flex-col justify-between">
            <div>
              <h1 className="text-3xl font-extrabold mb-4">Join AA Educates</h1>
              <p className="text-purple-100 leading-relaxed">
                Unlock personalised learning journeys, connect with mentors, and collaborate on projects that build real-world skills.
              </p>
            </div>
            <div className="text-sm text-purple-100 mt-10 space-y-2">
              <p>Already have an account?{' '}
                <Link href="/login" className="text-white font-semibold underline">Sign in</Link>.</p>
              <p>
                By creating an account you agree to our{' '}
                <Link href="/terms" className="text-white font-semibold underline">Terms of Use</Link>.
              </p>
            </div>
          </div>
          <div className="p-10">
            {success ? (
              <div className="text-center py-12">
                <h2 className="text-2xl font-semibold text-purple-600 mb-2">Welcome aboard!</h2>
                <p className="text-gray-600">Redirecting you to the login page…</p>
              </div>
            ) : (
              <form className="grid gap-5" onSubmit={handleSubmit}>
                {error && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                  </div>
                )}
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-2">
                      First name
                    </label>
                    <input
                      id="first_name"
                      name="first_name"
                      value={formState.first_name}
                      onChange={handleChange}
                      required
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-2">
                      Last name
                    </label>
                    <input
                      id="last_name"
                      name="last_name"
                      value={formState.last_name}
                      onChange={handleChange}
                      required
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email address
                  </label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formState.email}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    name="password"
                    value={formState.password}
                    onChange={handleChange}
                    required
                    minLength={8}
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                    I am a…
                  </label>
                  <select
                    id="role"
                    name="role"
                    value={formState.role}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="STUDENT">Student</option>
                    <option value="PARENT">Parent / Guardian</option>
                    <option value="CORPORATE_PARTNER">Corporate partner</option>
                    <option value="ADMIN">Administrator</option>
                  </select>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center justify-center rounded-xl bg-purple-600 px-6 py-3 font-semibold text-white shadow hover:bg-purple-700 transition disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? 'Creating account…' : 'Create account'}
                </button>
              </form>
            )}
          </div>
        </div>
      </main>
    </>
  );
};

export default RegisterPage;
