import Head from 'next/head';
import Link from 'next/link';
import type { NextPage } from 'next';
import { useEffect, useState } from 'react';

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

interface NotificationPrefs {
  projects: boolean;
  mentoring: boolean;
  community: boolean;
  newsletters: boolean;
}

const StudentSettingsPage: NextPage = () => {
  const [preferences, setPreferences] = useState<NotificationPrefs>({
    projects: true,
    mentoring: true,
    community: false,
    newsletters: false
  });
  const [darkModeDetected, setDarkModeDetected] = useState(false);

  useEffect(() => {
    setDarkModeDetected(window.matchMedia('(prefers-color-scheme: dark)').matches);
  }, []);

  return (
    <>
      <Head>
        <title>Settings | AA Educates</title>
      </Head>
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <StudentNav active="/student/settings" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
          <header className="space-y-3">
            <h1 className="text-3xl font-extrabold text-gray-900">Account settings</h1>
            <p className="text-gray-600 max-w-3xl">
              Control how you access AA Educates, manage notifications, and keep your account secure. Your preferences are synced
              across devices when you stay signed in.
            </p>
          </header>

          <section className="grid gap-6 lg:grid-cols-2">
            <div className="bg-white border border-indigo-100 rounded-2xl shadow p-6 space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">Notifications</h2>
              <p className="text-sm text-gray-600">Choose the updates you want to receive.</p>
              <div className="space-y-4 text-sm text-gray-700">
                {Object.entries(preferences).map(([key, value]) => (
                  <label key={key} className="flex items-center justify-between gap-4">
                    <span className="capitalize">{key}</span>
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={(event) =>
                        setPreferences((prev) => ({ ...prev, [key]: event.target.checked }))
                      }
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600"
                    />
                  </label>
                ))}
              </div>
              <button className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 text-white px-4 py-2 text-sm font-semibold hover:bg-indigo-700 transition">
                Save preferences
              </button>
            </div>

            <div className="bg-white border border-indigo-100 rounded-2xl shadow p-6 space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">Appearance</h2>
              <p className="text-sm text-gray-600">Match the interface to your preferences.</p>
              <div className="flex items-center justify-between text-sm text-gray-700">
                <span>Use dark mode when available</span>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  darkModeDetected ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-500'
                }`}>
                  {darkModeDetected ? 'Detected' : 'Off'}
                </span>
              </div>
              <button className="inline-flex items-center gap-2 rounded-xl border border-gray-200 text-gray-600 px-4 py-2 text-sm font-semibold hover:bg-gray-50 transition">
                Toggle dark mode
              </button>
            </div>

            <div className="bg-white border border-rose-100 rounded-2xl shadow p-6 space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">Security</h2>
              <p className="text-sm text-gray-600">Protect your account with strong, unique credentials.</p>
              <button className="inline-flex items-center gap-2 rounded-xl bg-rose-600 text-white px-4 py-2 text-sm font-semibold hover:bg-rose-700 transition">
                Change password
              </button>
              <button className="inline-flex items-center gap-2 rounded-xl border border-gray-200 text-gray-600 px-4 py-2 text-sm font-semibold hover:bg-gray-50 transition">
                Manage devices
              </button>
            </div>

            <div className="bg-white border border-amber-100 rounded-2xl shadow p-6 space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">Privacy</h2>
              <p className="text-sm text-gray-600">Review how your information is used across the platform.</p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <Link className="text-indigo-600 font-semibold" href="/terms">
                    Read privacy summary
                  </Link>
                </li>
                <li>
                  <Link className="text-indigo-600 font-semibold" href="/contact">
                    Request data export
                  </Link>
                </li>
                <li>
                  <Link className="text-indigo-600 font-semibold" href="/contact">
                    Deactivate account
                  </Link>
                </li>
              </ul>
            </div>
          </section>
        </div>
      </main>
    </>
  );
};

export default StudentSettingsPage;
