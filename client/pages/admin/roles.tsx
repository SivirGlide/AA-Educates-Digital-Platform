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

interface RoleDefinition {
  key: string;
  title: string;
  description: string;
  permissions: string[];
}

const roles: RoleDefinition[] = [
  {
    key: 'platform_admin',
    title: 'Platform administrator',
    description: 'Full access to all AA Educates features, settings, and data.',
    permissions: ['Manage users', 'Configure settings', 'View financial reports', 'Approve content'],
  },
  {
    key: 'content_manager',
    title: 'Content manager',
    description: 'Publishes marketing pages, learning resources, and announcements.',
    permissions: ['Publish content', 'Manage resources', 'Schedule updates'],
  },
  {
    key: 'support_analyst',
    title: 'Support analyst',
    description: 'Handles support tickets, monitors platform health, and escalates incidents.',
    permissions: ['View tickets', 'Update ticket status', 'Escalate issues'],
  },
];

const AdminRolesPage: NextPage = () => {
  const [expanded, setExpanded] = useState<string | null>(roles[0]?.key ?? null);

  return (
    <>
      <Head>
        <title>Admin Roles | AA Educates</title>
      </Head>
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-indigo-50">
        <AdminNav active="/admin/roles" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
          <header className="space-y-3">
            <h1 className="text-3xl font-extrabold text-gray-900">Roles & permissions</h1>
            <p className="text-gray-600 max-w-3xl">Define how administrators, content managers, and support analysts access AA Educates.</p>
          </header>

          <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {roles.map((role) => (
              <article key={role.key} className="bg-white border border-blue-100 rounded-2xl shadow p-6 space-y-4">
                <header className="space-y-2">
                  <h2 className="text-xl font-semibold text-gray-900">{role.title}</h2>
                  <p className="text-sm text-gray-600">{role.description}</p>
                </header>
                <button
                  onClick={() => setExpanded((prev) => (prev === role.key ? null : role.key))}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700"
                >
                  {expanded === role.key ? 'Hide permissions' : 'Show permissions'}
                </button>
                {expanded === role.key && (
                  <ul className="space-y-2 text-sm text-gray-600">
                    {role.permissions.map((permission) => (
                      <li key={permission} className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-blue-500" aria-hidden />
                        {permission}
                      </li>
                    ))}
                  </ul>
                )}
              </article>
            ))}
          </section>
        </div>
      </main>
    </>
  );
};

export default AdminRolesPage;
