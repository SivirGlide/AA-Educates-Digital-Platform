import Head from 'next/head';
import Link from 'next/link';
import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { api } from '../../lib/api';

interface Post {
  id: number;
  content: string;
  created_at: string;
  author: string;
}

const navLinks = [
  { href: '/student/dashboard', label: 'Dashboard' },
  { href: '/student/profile', label: 'Profile' },
  { href: '/student/projects', label: 'Projects' },
  { href: '/student/mentoring', label: 'Mentoring' },
  { href: '/student/skills', label: 'Skills' },
  { href: '/student/certificates', label: 'Certificates' },
  { href: '/student/community', label: 'Community' },
  { href: '/student/resources', label: 'Resources' },
  { href: '/student/settings', label: 'Settings' }
];

const StudentNav: React.FC<{ active: string }> = ({ active }) => (
  <nav className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200 sticky top-0 z-40">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
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
                ? 'bg-indigo-600 text-white shadow'
                : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50'
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

const StudentCommunityPage: NextPage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCommunity = async () => {
      try {
        const response = await api.getProjects();
        if (response.error || !Array.isArray(response.data)) {
          setError(response.error || 'Unable to load community posts');
        } else {
          const mapped = (response.data as any[]).slice(0, 5).map((item, index) => ({
            id: item.id,
            content: item.description || 'Share your latest achievement or ask the community for tips!',
            created_at: new Date(Date.now() - index * 3600000).toISOString(),
            author: ['Maya', 'Leo', 'Zara', 'Arjun', 'Isabella'][index % 5] + ' • Year ' + (10 + index)
          }));
          setPosts(mapped);
        }
      } catch (err) {
        setError('Something went wrong while fetching community posts');
      } finally {
        setLoading(false);
      }
    };

    fetchCommunity();
  }, []);

  return (
    <>
      <Head>
        <title>Community | AA Educates</title>
      </Head>
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <StudentNav active="/student/community" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
          <header className="space-y-3">
            <h1 className="text-3xl font-extrabold text-gray-900">Community feed</h1>
            <p className="text-gray-600 max-w-3xl">
              Celebrate wins, ask questions, and collaborate with peers from across the AA Educates network. This space is moderated to
              keep everyone safe and supported.
            </p>
          </header>

          {loading ? (
            <div className="flex items-center justify-center min-h-[280px]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
            </div>
          ) : error ? (
            <div className="max-w-2xl mx-auto">
              <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
                <h2 className="text-xl font-semibold text-red-700 mb-2">Community unavailable</h2>
                <p className="text-red-600">{error}</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <section className="bg-white border border-indigo-100 rounded-2xl shadow p-6 space-y-4">
                <h2 className="text-lg font-semibold text-gray-900">Share something new</h2>
                <textarea
                  rows={4}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="What are you working on or curious about today?"
                />
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Be kind. Protect your privacy. Credit collaborators.</span>
                  <button className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 text-white px-4 py-2 font-semibold hover:bg-indigo-700 transition">
                    Post update
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </button>
                </div>
              </section>

              {posts.map((post) => (
                <article key={post.id} className="bg-white border border-indigo-100 rounded-2xl shadow p-6 space-y-3">
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span className="font-semibold text-gray-700">{post.author}</span>
                    <time>{new Date(post.created_at).toLocaleString()}</time>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{post.content}</p>
                  <div className="flex gap-4 text-sm text-gray-500">
                    <button className="inline-flex items-center gap-1 text-indigo-600 font-semibold">Like</button>
                    <button className="inline-flex items-center gap-1 text-indigo-600 font-semibold">Comment</button>
                    <button className="inline-flex items-center gap-1 text-indigo-600 font-semibold">Share</button>
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

export default StudentCommunityPage;
