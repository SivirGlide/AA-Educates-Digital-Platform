import Head from 'next/head';
import type { NextPage } from 'next';
import Link from 'next/link';
import { useMemo, useState } from 'react';

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

const transactions = [
  { id: 'INV-4021', account: 'Corporate partner', amount: 1250, status: 'Paid', date: '2025-10-18T10:32:00Z' },
  { id: 'INV-4019', account: 'School subscription', amount: 880, status: 'Pending', date: '2025-10-16T14:05:00Z' },
  { id: 'INV-4017', account: 'Parent membership', amount: 45, status: 'Failed', date: '2025-10-15T08:11:00Z' },
];

const statusStyles: Record<string, string> = {
  Paid: 'bg-emerald-100 text-emerald-700',
  Pending: 'bg-amber-100 text-amber-700',
  Failed: 'bg-rose-100 text-rose-700',
};

const AdminPaymentsPage: NextPage = () => {
  const [status, setStatus] = useState('ALL');

  const filteredTransactions = useMemo(() => {
    return transactions.filter((txn) => (status === 'ALL' ? true : txn.status === status));
  }, [status]);

  const total = useMemo(() => {
    return filteredTransactions.reduce((sum, txn) => (txn.status === 'Paid' ? sum + txn.amount : sum), 0);
  }, [filteredTransactions]);

  return (
    <>
      <Head>
        <title>Admin Payments | AA Educates</title>
      </Head>
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-indigo-50">
        <AdminNav active="/admin/payments" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
          <header className="space-y-3">
            <h1 className="text-3xl font-extrabold text-gray-900">Payments</h1>
            <p className="text-gray-600 max-w-3xl">Track invoices, subscriptions, and membership payments across AA Educates.</p>
          </header>

          <section className="bg-white border border-blue-100 rounded-2xl shadow p-6 space-y-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex gap-3">
                <button
                  onClick={() => setStatus('ALL')}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold border ${status === 'ALL' ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                >
                  All
                </button>
                <button
                  onClick={() => setStatus('Paid')}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold border ${status === 'Paid' ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                >
                  Paid
                </button>
                <button
                  onClick={() => setStatus('Pending')}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold border ${status === 'Pending' ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                >
                  Pending
                </button>
                <button
                  onClick={() => setStatus('Failed')}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold border ${status === 'Failed' ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                >
                  Failed
                </button>
              </div>
              <div className="ml-auto text-sm text-gray-600">
                Paid total (visible): <span className="font-semibold text-gray-900">£{total.toLocaleString()}</span>
              </div>
            </div>
          </section>

          <section className="bg-white border border-blue-100 rounded-2xl shadow divide-y divide-gray-100">
            {filteredTransactions.map((txn) => (
              <article key={txn.id} className="px-6 py-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">{txn.account}</h2>
                  <p className="text-sm text-gray-500">Invoice {txn.id}</p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
                  <span className="text-sm font-semibold text-gray-900">£{txn.amount.toLocaleString()}</span>
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusStyles[txn.status] || 'bg-gray-100 text-gray-700'}`}>
                    {txn.status}
                  </span>
                  <span className="text-sm text-gray-500">{new Date(txn.date).toLocaleString()}</span>
                  <button className="inline-flex items-center gap-2 rounded-xl border border-gray-200 text-gray-600 px-4 py-2 text-sm font-semibold hover:bg-gray-50 transition">
                    View receipt
                  </button>
                </div>
              </article>
            ))}
            {filteredTransactions.length === 0 && (
              <div className="px-6 py-10 text-center text-gray-600 text-sm">No transactions in this view yet.</div>
            )}
          </section>
        </div>
      </main>
    </>
  );
};

export default AdminPaymentsPage;
