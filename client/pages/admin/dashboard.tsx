import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';

const AdminDashboard: NextPage = () => {
  return (
    <>
      <Head>
        <title>Admin Dashboard - AA Educates</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-red-600">AA Educates</h1>
            <div className="space-x-4">
              <span className="text-gray-700">Admin Dashboard</span>
              <Link href="/login" className="text-red-600 hover:text-red-700">
                Logout
              </Link>
            </div>
          </div>
        </nav>

        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Administrator Portal</h2>
            <p className="text-gray-600">Manage the entire platform</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">User Management</h3>
              <p className="text-gray-600 mb-4">Manage users, roles, and permissions</p>
              <button className="text-red-600 hover:text-red-700 font-medium">
                Manage Users →
              </button>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Projects</h3>
              <p className="text-gray-600 mb-4">Oversee all projects and submissions</p>
              <button className="text-red-600 hover:text-red-700 font-medium">
                Manage Projects →
              </button>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Achievements</h3>
              <p className="text-gray-600 mb-4">Manage badges, certificates, and skills</p>
              <button className="text-red-600 hover:text-red-700 font-medium">
                Manage Achievements →
              </button>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Learning Content</h3>
              <p className="text-gray-600 mb-4">Manage modules, resources, and workbooks</p>
              <button className="text-red-600 hover:text-red-700 font-medium">
                Manage Content →
              </button>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Mentorship</h3>
              <p className="text-gray-600 mb-4">Oversee mentorship programs</p>
              <button className="text-red-600 hover:text-red-700 font-medium">
                Manage Mentorship →
              </button>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Community</h3>
              <p className="text-gray-600 mb-4">Moderate posts and community activity</p>
              <button className="text-red-600 hover:text-red-700 font-medium">
                Moderate →
              </button>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Analytics</h3>
              <p className="text-gray-600 mb-4">Platform-wide analytics and reports</p>
              <button className="text-red-600 hover:text-red-700 font-medium">
                View Analytics →
              </button>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Payments</h3>
              <p className="text-gray-600 mb-4">Manage transactions and payments</p>
              <button className="text-red-600 hover:text-red-700 font-medium">
                Manage Payments →
              </button>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">System Settings</h3>
              <p className="text-gray-600 mb-4">Configure platform settings</p>
              <button className="text-red-600 hover:text-red-700 font-medium">
                Settings →
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default AdminDashboard;

