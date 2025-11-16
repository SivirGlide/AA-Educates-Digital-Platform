import Head from 'next/head';
import Link from 'next/link';
import type { NextPage } from 'next';
import { useState } from 'react';

const navLinks = [
  { href: '/corporate/dashboard', label: 'Dashboard' },
  { href: '/corporate/projects', label: 'Projects' },
  { href: '/corporate/project/new', label: 'New Project' },
  { href: '/corporate/volunteers', label: 'Volunteers' },
  { href: '/corporate/talent', label: 'Talent' },
  { href: '/corporate/impact', label: 'Impact' },
  { href: '/corporate/profile', label: 'Profile' },
  { href: '/corporate/settings', label: 'Settings' }
];

const CorporateNav: React.FC<{ active: string }> = ({ active }) => (
  <nav className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200 sticky top-0 z-40">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
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
                ? 'bg-purple-600 text-white shadow'
                : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
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


type PreferenceKey = 'project_updates' | 'volunteer_digest' | 'impact_reports' | 'product_announcements';

const defaultPrefs: Record<PreferenceKey, boolean> = {
  project_updates: true,
  volunteer_digest: true,
  impact_reports: false,
  product_announcements: false,
};

const CorporateSettingsPage: NextPage = () => {
  const [preferences, setPreferences] = useState(defaultPrefs);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [saved, setSaved] = useState(false);

  const togglePreference = (key: PreferenceKey) => {
    setPreferences((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      setSaved(false);
      return next;
    });
  };

  const handleSave = () => {
    setSaved(true);
    // integrate with API later
  };

  return (
    <>
      <Head>
        <title>Corporate Settings | AA Educates</title>
      </Head>
      <main className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-pink-50">
        <CorporateNav active="/corporate/settings" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
          <header className="space-y-3">
            <h1 className="text-3xl font-extrabold text-gray-900">Account settings</h1>
            <p className="text-gray-600 max-w-3xl">Configure notification preferences, security features, and collaboration tools for your corporate account.</p>
          </header>

          <section className="grid gap-6 lg:grid-cols-2">
            <div className="bg-white border border-purple-100 rounded-2xl shadow p-6 space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">Notifications</h2>
              <p className="text-sm text-gray-600">Select the updates you want to receive from AA Educates.</p>
              <div className="space-y-4 text-sm text-gray-700">
                {Object.entries(preferences).map(([key, value]) => (
                  <label key={key} className="flex items-center justify-between gap-4 capitalize">
                    <span>{key.replace('_', ' ')}</span>
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={() => togglePreference(key as PreferenceKey)}
                      className="h-4 w-4 rounded border-gray-300 text-purple-600"
                    />
                  </label>
                ))}
              </div>
              <button
                onClick={handleSave}
                className="inline-flex items-center gap-2 rounded-xl bg-purple-600 text-white px-4 py-2 text-sm font-semibold hover:bg-purple-700 transition"
              >
                Save preferences
              </button>
              {saved && <p className="text-sm text-emerald-600">Preferences saved</p>}
            </div>

            <div className="bg-white border border-purple-100 rounded-2xl shadow p-6 space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">Security</h2>
              <p className="text-sm text-gray-600">Keep your corporate portal secure.</p>
              <label className="flex items-center justify-between gap-4 text-sm text-gray-700">
                <span>Two-factor authentication</span>
                <input
                  type="checkbox"
                  checked={twoFactorEnabled}
                  onChange={(event) => setTwoFactorEnabled(event.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-purple-600"
                />
              </label>
              <button className="inline-flex items-center gap-2 rounded-xl border border-gray-200 text-gray-600 px-4 py-2 text-sm font-semibold hover:bg-gray-50 transition">
                Update password
              </button>
              <button className="inline-flex items-center gap-2 rounded-xl border border-red-200 text-red-600 px-4 py-2 text-sm font-semibold hover:bg-red-50 transition">
                Review account activity
              </button>
            </div>

            <div className="bg-white border border-indigo-100 rounded-2xl shadow p-6 space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">Integrations</h2>
              <p className="text-sm text-gray-600">Connect your corporate tools.</p>
              <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex items-center justify-between">
                  <span>HRIS sync</span>
                  <button className="px-3 py-1 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50">Connect</button>
                </li>
                <li className="flex items-center justify-between">
                  <span>Slack notifications</span>
                  <button className="px-3 py-1 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50">Connect</button>
                </li>
                <li className="flex items-center justify-between">
                  <span>Power BI export</span>
                  <button className="px-3 py-1 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50">Generate token</button>
                </li>
              </ul>
            </div>

            <div className="bg-white border border-pink-100 rounded-2xl shadow p-6 space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">Support</h2>
              <p className="text-sm text-gray-600">Need to update something complex? Talk to the AA Educates team.</p>
              <button className="inline-flex items-center gap-2 rounded-xl bg-pink-600 text-white px-4 py-2 text-sm font-semibold hover:bg-pink-700 transition">
                Contact support
              </button>
              <p className="text-xs text-gray-500">Response within 1 business day.</p>
            </div>
          </section>
        </div>
      </main>
    </>
  );
};

export default CorporateSettingsPage;
