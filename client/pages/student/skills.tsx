import Head from 'next/head';
import Link from 'next/link';
import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { DashboardLayout } from '@/src/components/layouts/DashboardLayout';

interface Skill {
  id: number;
  name: string;
  description: string;
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  last_updated: string;
}

const levelStyles: Record<string, string> = {
  BEGINNER: 'bg-emerald-100 text-emerald-700',
  INTERMEDIATE: 'bg-amber-100 text-amber-700',
  ADVANCED: 'bg-purple-100 text-purple-700'
};

const StudentSkillsPage: NextPage = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await api.getSkills();
        if (response.error || !Array.isArray(response.data)) {
          setError(response.error || 'Unable to load skills');
        } else {
          const mapped = (response.data as any[]).map((skill, index) => ({
            id: skill.id,
            name: skill.name || `Skill ${index + 1}`,
            description: skill.description || 'Skill description coming soon.',
            level: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'][index % 3] as Skill['level'],
            last_updated: new Date().toISOString()
          }));
          setSkills(mapped);
        }
      } catch (err) {
        setError('Something went wrong while fetching skills');
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, []);

  return (
    <>
      <Head>
        <title>Skills | AA Educates</title>
      </Head>
      <DashboardLayout>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 -mx-6 -my-8 px-6 py-8 space-y-10">
          <header className="space-y-3">
            <h1 className="text-3xl font-extrabold text-gray-900">Skills passport</h1>
            <p className="text-gray-600 max-w-3xl">
              Track the skills you are developing across academic, creative, and employability domains. Use this passport to evidence
              achievements during mentoring sessions and project showcases.
            </p>
          </header>

          {loading ? (
            <div className="flex items-center justify-center min-h-[280px]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
            </div>
          ) : error ? (
            <div className="max-w-2xl mx-auto">
              <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
                <h2 className="text-xl font-semibold text-red-700 mb-2">Skills unavailable</h2>
                <p className="text-red-600">{error}</p>
              </div>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {skills.map((skill) => (
                <article key={skill.id} className="bg-white border border-indigo-100 rounded-2xl shadow hover:shadow-lg transition p-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900">{skill.name}</h2>
                    <span className={`px-3 py-1 text-xs font-semibold uppercase tracking-wide rounded-full ${levelStyles[skill.level]}`}>
                      {skill.level.toLowerCase()}
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-gray-600 leading-relaxed">{skill.description}</p>
                  <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
                    <span>Updated {new Date(skill.last_updated).toLocaleDateString()}</span>
                    <button className="inline-flex items-center gap-1 text-indigo-600 font-semibold">
                      Add evidence
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </DashboardLayout>
    </>
  );
};

export default StudentSkillsPage;
