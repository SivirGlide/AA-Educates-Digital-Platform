import Head from 'next/head';
import Link from 'next/link';
import type { NextPage } from 'next';
import { useState } from 'react';

const adminNavLinks = [
  { href: '/admin/dashboard', label: 'Dashboard' },
  { href: '/admin/users', label: 'Users' },
  { href: '/admin/content', label: 'Content' },
  { href: '/admin/analytics', label: 'Analytics' },
  { href: '/admin/payments', label: 'Payments' },
  { href: '/admin/crm', label: 'CRM' },
  { href: '/admin/roles', label: 'Roles' },
  { href: '/admin/settings', label: 'Settings' }
];

const AdminNav: React.FC<{ active: string }> = ({ active }) => (
  <nav className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200 sticky top-0 z-40">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
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
        {adminNavLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
              link.href === active
                ? 'bg-blue-600 text-white shadow'
                : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
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

type PreferenceKey = 'incident_alerts' | 'weekly_digest' | 'product_updates' | 'billing';

type PreferenceState = Record<PreferenceKey, boolean>;

const defaultPrefs: PreferenceState = {
  incident_alerts: true,
  weekly_digest: true,
  product_updates: false,
  billing: true,
};

const AdminSettingsPage: NextPage = () => {
  const [preferences, setPreferences] = useState<PreferenceState>(defaultPrefs);
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
  };

  return (
    <>
      <Head>
        <title>Admin Settings | AA Educates</title>
      </Head>
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-indigo-50">
        <AdminNav active="/admin/settings" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
          <header className="space-y-3">
            <h1 className="text-3xl font-extrabold text-gray-900">Platform settings</h1>
            <p className="text-gray-600 max-w-3xl">Configure notifications, security, and integrations for AA Educates administrators.</p>
          </header>

          <section className="grid gap-6 lg:grid-cols-2">
            <div className="bg-white border border-blue-100 rounded-2xl shadow p-6 space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">Notifications</h2>
              <p className="text-sm text-gray-600">Choose the updates you’d like to receive.</p>
              <div className="space-y-4 text-sm text-gray-700">
                {Object.entries(preferences).map(([key, value]) => (
                  <label key={key} className="flex items-center justify-between gap-4 capitalize">
                    <span>{key.replace('_', ' ')}</span>
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={() => togglePreference(key as PreferenceKey)}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600"
                    />
                  </label>
                ))}
              </div>
              <button
                onClick={handleSave}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 text-white px-4 py-2 text-sm font-semibold hover:bg-blue-700 transition"
              >
                Save preferences
              </button>
              {saved && <p className="text-sm text-emerald-600">Preferences saved.</p>}
            </div>

            <div className="bg-white border border-blue-100 rounded-2xl shadow p-6 space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">Security</h2>
              <p className="text-sm text-gray-600">Keep administrator accounts protected.</p>
              <label className="flex items-center justify-between gap-4 text-sm text-gray-700">
                <span>Two-factor authentication</span>
                <input
                  type="checkbox"
                  checked={twoFactorEnabled}
                  onChange={(event) => setTwoFactorEnabled(event.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600"
                />
              </label>
              <button className="inline-flex items-center gap-2 rounded-xl border border-gray-200 text-gray-600 px-4 py-2 text-sm font-semibold hover:bg-gray-50 transition">
                Update password policy
              </button>
              <button className="inline-flex items-center gap-2 rounded-xl border border-rose-200 text-rose-600 px-4 py-2 text-sm font-semibold hover:bg-rose-50 transition">
                Review audit log
              </button>
            </div>

            <div className="bg-white border border-indigo-100 rounded-2xl shadow p-6 space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">Integrations</h2>
              <p className="text-sm text-gray-600">Connect AA Educates with your organisation’s tools.</p>
              <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex items-center justify-between">
                  <span>SSO / Identity provider</span>
                  <button className="px-3 py-1 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50">Configure</button>
                </li>
                <li className="flex items-center justify-between">
                  <span>Finance exports</span>
                  <button className="px-3 py-1 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50">Generate token</button>
                </li>
                <li className="flex items-center justify-between">
                  <span>Analytics webhook</span>
                  <button className="px-3 py-1 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50">Enable</button>
                </li>
              </ul>
            </div>

            <div className="bg-white border border-pink-100 rounded-2xl shadow p-6 space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">Support</h2>
              <p className="text-sm text-gray-600">Need to make a change across the platform? Talk to the AA Educates team.</p>
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

export default AdminSettingsPage;
