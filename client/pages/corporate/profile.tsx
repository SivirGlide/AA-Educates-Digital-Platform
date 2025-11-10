import Head from 'next/head';
import type { NextPage } from 'next';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { api } from '../../lib/api';

interface CorporateProfile {
  id: number;
  company_name: string;
  industry: string;
  website: string;
  csr_report_link: string;
  about: string;
  created_at: string;
  updated_at: string;
}

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


const CorporateProfilePage: NextPage = () => {
  const [profile, setProfile] = useState<CorporateProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileId = parseInt(localStorage.getItem('profileId') || '0', 10);
        if (!profileId) {
          setError('Please log in to view your corporate profile.');
          setLoading(false);
          return;
        }
        const response = await api.getCorporatePartner(profileId);
        if (response.error) {
          setError(response.error);
        } else {
          setProfile({ ...response.data, about: response.data?.about || '' } as CorporateProfile);
        }
      } catch (err) {
        setError('Unable to load corporate profile.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return (
    <>
      <Head>
        <title>Corporate Profile | AA Educates</title>
      </Head>
      <main className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-pink-50">
        <CorporateNav active="/corporate/profile" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
          {loading ? (
            <div className="flex items-center justify-center min-h-[320px]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600" />
            </div>
          ) : error ? (
            <div className="max-w-2xl mx-auto">
              <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
                <h2 className="text-xl font-semibold text-red-700 mb-2">Profile unavailable</h2>
                <p className="text-red-600">{error}</p>
              </div>
            </div>
          ) : profile ? (
            <section className="bg-white border border-purple-100 rounded-2xl shadow p-8 space-y-8">
              <header className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-extrabold text-gray-900">{profile.company_name}</h1>
                  <p className="text-gray-600">Industry: {profile.industry || 'Not specified'}</p>
                  <div className="flex flex-wrap gap-3 mt-4 text-sm text-purple-600 font-semibold">
                    {profile.website && (
                      <Link href={profile.website} target="_blank" className="hover:text-purple-700">
                        Visit website
                      </Link>
                    )}
                    {profile.csr_report_link && (
                      <Link href={profile.csr_report_link} target="_blank" className="hover:text-purple-700">
                        View CSR report
                      </Link>
                    )}
                  </div>
                </div>
                <Link
                  href="/corporate/settings"
                  className="inline-flex items-center gap-2 rounded-xl bg-purple-600 text-white px-4 py-2 text-sm font-semibold hover:bg-purple-700 transition"
                >
                  Edit profile
                </Link>
              </header>

              <section className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900">About your organisation</h2>
                <p className="text-gray-600 leading-relaxed">
                  {profile.about || 'Share your mission, focus areas, and how you collaborate with AA Educates.'}
                </p>
              </section>

              <section className="grid gap-6 md:grid-cols-2">
                <div className="bg-purple-50 border border-purple-100 rounded-2xl p-6 space-y-3">
                  <h3 className="text-lg font-semibold text-gray-900">Programmes with AA Educates</h3>
                  <p className="text-gray-600">Track the initiatives your organisation has launched with our learners.</p>
                  <Link href="/corporate/projects" className="text-purple-600 font-semibold hover:text-purple-700">
                    View programmes →
                  </Link>
                </div>
                <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 space-y-3">
                  <h3 className="text-lg font-semibold text-gray-900">Volunteering activity</h3>
                  <p className="text-gray-600">See who from your company has volunteered and the hours logged.</p>
                  <Link href="/corporate/volunteers" className="text-indigo-600 font-semibold hover:text-indigo-700">
                    View volunteers →
                  </Link>
                </div>
              </section>

              <footer className="text-sm text-gray-500">
                Profile last updated {new Date(profile.updated_at).toLocaleDateString()}
              </footer>
            </section>
          ) : null}
        </div>
      </main>
    </>
  );
};

export default CorporateProfilePage;
