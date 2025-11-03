import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { api } from '../../lib/api';

interface ParentProfile {
  id: number;
  user: number;
  students: number[];
}

interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
}

interface StudentProfile {
  id: number;
  user: number;
  school: number | null;
  bio: string;
  cv: string;
  portfolio_link: string;
  badges: number[];
  certificates: number[];
  skills: number[];
}

interface Project {
  id: number;
  title: string;
  description: string;
  status: string;
  created_at: string;
}

interface StudentProjectSubmission {
  id: number;
  student: number;
  project: number;
  submission_link: string;
  feedback: string;
  grade: number | null;
  status: string;
  submitted_at: string;
}

const ParentDashboard: NextPage = () => {
  const [parent, setParent] = useState<ParentProfile | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [children, setChildren] = useState<StudentProfile[]>([]);
  const [childrenData, setChildrenData] = useState<Array<{student: StudentProfile, user: User}>>([]);
  const [submissions, setSubmissions] = useState<StudentProjectSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedChild, setSelectedChild] = useState<number | null>(null);

  useEffect(() => {
    fetchParentData();
  }, []);

  useEffect(() => {
    if (parent?.students && parent.students.length > 0) {
      fetchChildrenData();
      fetchSubmissions();
    }
  }, [parent]);

  const fetchParentData = async () => {
    try {
      // Fetch parent profile with ID 1
      const parentResponse = await api.getParent(1);
      if (parentResponse.error) {
        setError(parentResponse.error);
        setLoading(false);
        return;
      }

      if (parentResponse.data) {
        setParent(parentResponse.data);
        
        // Fetch user data
        const userResponse = await api.getUser(parentResponse.data.user);
        if (userResponse.data) {
          setUser(userResponse.data);
        }
      }
    } catch (err) {
      setError('Failed to load parent data');
    } finally {
      setLoading(false);
    }
  };

  const fetchChildrenData = async () => {
    if (!parent?.students) return;

    try {
      const childrenPromises = parent.students.map(async (studentId) => {
        const studentResponse = await api.getStudent(studentId);
        if (studentResponse.data) {
          const userResponse = await api.getUser(studentResponse.data.user);
          return {
            student: studentResponse.data,
            user: userResponse.data || null,
          };
        }
        return null;
      });

      const childrenDataArray = await Promise.all(childrenPromises);
      const validChildren = childrenDataArray.filter(c => c !== null) as Array<{student: StudentProfile, user: User}>;
      setChildrenData(validChildren);
      setChildren(validChildren.map(c => c.student));
      
      // Set first child as selected by default
      if (validChildren.length > 0) {
        setSelectedChild(validChildren[0].student.id);
      }
    } catch (err) {
      console.error('Failed to load children data:', err);
    }
  };

  const fetchSubmissions = async () => {
    try {
      const response = await api.getSubmissions();
      if (response.data && Array.isArray(response.data)) {
        // Filter submissions from parent's children
        const childrenIds = parent?.students || [];
        const childrenSubmissions = response.data.filter((sub: StudentProjectSubmission) => 
          childrenIds.includes(sub.student)
        );
        setSubmissions(childrenSubmissions);
      }
    } catch (err) {
      console.error('Failed to load submissions:', err);
    }
  };

  const selectedChildData = childrenData.find(c => c.student.id === selectedChild);
  const selectedChildSubmissions = submissions.filter(s => s.student === selectedChild);

  return (
    <>
      <Head>
        <title>Parent Dashboard - AA Educates</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
        {/* Navigation */}
        <nav className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200 sticky top-0 z-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
              AA Educates
            </Link>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700 font-medium">Parent Portal</span>
              <Link 
                href="/login" 
                className="px-4 py-2 text-green-600 hover:text-green-700 font-medium hover:bg-green-50 rounded-lg transition-colors"
              >
                Logout
              </Link>
            </div>
          </div>
        </nav>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {loading ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
          ) : error ? (
            <div className="max-w-2xl mx-auto mt-12">
              <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                <h3 className="text-xl font-semibold text-red-800 mb-2">Error Loading Data</h3>
                <p className="text-red-600">{error}</p>
                <p className="text-sm text-red-500 mt-2">Parent ID 1 may not exist in the database.</p>
              </div>
            </div>
          ) : parent && user ? (
            <>
              {/* Parent Profile Header */}
              <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-green-100">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                  <div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-2">
                      Welcome, {user.first_name || user.username}!
                    </h1>
                    <p className="text-xl text-gray-600 mb-2">
                      {user.email}
                    </p>
                    <p className="text-lg text-green-600 font-medium">Parent Dashboard</p>
                  </div>
                  <div className="mt-4 md:mt-0">
                    <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-xl font-semibold">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                      Parent ID: {parent.id}
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-green-700 mb-1">Children</p>
                        <p className="text-3xl font-bold text-green-900">{children.length}</p>
                      </div>
                      <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl p-6 border border-teal-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-teal-700 mb-1">Total Submissions</p>
                        <p className="text-3xl font-bold text-teal-900">{submissions.length}</p>
                      </div>
                      <div className="w-12 h-12 bg-teal-500 rounded-xl flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-6 border border-emerald-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-emerald-700 mb-1">Achievements</p>
                        <p className="text-3xl font-bold text-emerald-900">
                          {children.reduce((sum, child) => sum + (child.badges?.length || 0) + (child.certificates?.length || 0), 0)}
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Children Section */}
              {childrenData.length > 0 && (
                <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-green-100">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">My Children</h2>
                  
                  {/* Child Selector */}
                  {childrenData.length > 1 && (
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Select Child to View Details</label>
                      <div className="flex flex-wrap gap-3">
                        {childrenData.map((childData) => (
                          <button
                            key={childData.student.id}
                            onClick={() => setSelectedChild(childData.student.id)}
                            className={`px-4 py-2 rounded-lg font-medium transition-all ${
                              selectedChild === childData.student.id
                                ? 'bg-gradient-to-r from-green-500 to-teal-600 text-white shadow-lg'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {childData.user?.first_name || childData.user?.username || `Student ${childData.student.id}`}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Children Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {childrenData.map((childData) => (
                      <div
                        key={childData.student.id}
                        className={`group bg-gradient-to-br ${
                          selectedChild === childData.student.id
                            ? 'from-green-50 to-teal-50 border-2 border-green-400'
                            : 'from-white to-green-50 border border-green-100'
                        } rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden cursor-pointer`}
                        onClick={() => setSelectedChild(childData.student.id)}
                      >
                        <div className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold text-gray-900">
                              {childData.user?.first_name || childData.user?.username || `Student ${childData.student.id}`}
                            </h3>
                            {selectedChild === childData.student.id && (
                              <span className="px-2 py-1 bg-green-500 text-white text-xs font-semibold rounded-full">Selected</span>
                            )}
                          </div>
                          <p className="text-gray-600 text-sm mb-4">{childData.user?.email}</p>
                          <div className="grid grid-cols-3 gap-2 text-center">
                            <div>
                              <p className="text-2xl font-bold text-green-700">{childData.student.badges?.length || 0}</p>
                              <p className="text-xs text-gray-600">Badges</p>
                            </div>
                            <div>
                              <p className="text-2xl font-bold text-teal-700">{childData.student.certificates?.length || 0}</p>
                              <p className="text-xs text-gray-600">Certs</p>
                            </div>
                            <div>
                              <p className="text-2xl font-bold text-emerald-700">{childData.student.skills?.length || 0}</p>
                              <p className="text-xs text-gray-600">Skills</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Selected Child Details */}
                  {selectedChildData && (
                    <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-xl p-6 border border-green-200">
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">
                        {selectedChildData.user?.first_name || selectedChildData.user?.username}'s Details
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                          <h4 className="font-semibold text-gray-700 mb-2">Contact</h4>
                          <p className="text-gray-600">{selectedChildData.user?.email}</p>
                          {selectedChildData.student.portfolio_link && (
                            <a 
                              href={selectedChildData.student.portfolio_link} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-green-600 hover:text-green-700 mt-2 inline-block"
                            >
                              View Portfolio →
                            </a>
                          )}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-700 mb-2">Bio</h4>
                          <p className="text-gray-600">{selectedChildData.student.bio || 'No bio available'}</p>
                        </div>
                      </div>

                      {/* Submissions for Selected Child */}
                      {selectedChildSubmissions.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-gray-700 mb-3">Recent Submissions</h4>
                          <div className="space-y-3">
                            {selectedChildSubmissions.slice(0, 3).map((submission) => (
                              <div key={submission.id} className="bg-white rounded-lg p-4 border border-green-200">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <p className="font-medium text-gray-900">Submission #{submission.id}</p>
                                    <p className="text-sm text-gray-600">
                                      Submitted: {new Date(submission.submitted_at).toLocaleDateString()}
                                    </p>
                                    {submission.grade && (
                                      <p className="text-sm text-green-600 font-semibold mt-1">
                                        Grade: {submission.grade}
                                      </p>
                                    )}
                                  </div>
                                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                    submission.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                                    submission.status === 'REVIEWED' ? 'bg-blue-100 text-blue-700' :
                                    'bg-yellow-100 text-yellow-700'
                                  }`}>
                                    {submission.status}
                                  </span>
                                </div>
                                {submission.feedback && (
                                  <p className="text-sm text-gray-600 mt-2">{submission.feedback}</p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Dashboard Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden border border-green-100">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-green-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative p-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-6 transform group-hover:rotate-6 transition-transform duration-300">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-green-600 transition-colors">
                      Progress Tracking
                    </h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      Monitor learning progress and track achievements across all your children
                    </p>
                    <div className="flex items-center text-green-600 font-semibold group-hover:translate-x-2 transition-transform duration-300">
                      View Progress
                      <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden border border-teal-100">
                  <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-teal-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative p-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center mb-6 transform group-hover:rotate-6 transition-transform duration-300">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-teal-600 transition-colors">
                      Projects
                    </h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      View your children's project submissions and track their work
                    </p>
                    <div className="flex items-center text-teal-600 font-semibold group-hover:translate-x-2 transition-transform duration-300">
                      View Projects
                      <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden border border-emerald-100">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-emerald-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative p-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center mb-6 transform group-hover:rotate-6 transition-transform duration-300">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-emerald-600 transition-colors">
                      Achievements
                    </h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      View badges, certificates, and skills earned by your children
                    </p>
                    <div className="flex items-center text-emerald-600 font-semibold group-hover:translate-x-2 transition-transform duration-300">
                      View Achievements
                      <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden border border-green-100">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-green-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative p-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-6 transform group-hover:rotate-6 transition-transform duration-300">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-green-600 transition-colors">
                      Mentorship
                    </h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      View mentorship sessions and guidance provided to your children
                    </p>
                    <div className="flex items-center text-green-600 font-semibold group-hover:translate-x-2 transition-transform duration-300">
                      View Sessions
                      <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden border border-teal-100">
                  <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-teal-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative p-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center mb-6 transform group-hover:rotate-6 transition-transform duration-300">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-teal-600 transition-colors">
                      Communications
                    </h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      Messages, notifications, and communication with school and mentors
                    </p>
                    <div className="flex items-center text-teal-600 font-semibold group-hover:translate-x-2 transition-transform duration-300">
                      View Messages
                      <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden border border-emerald-100">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-emerald-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative p-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center mb-6 transform group-hover:rotate-6 transition-transform duration-300">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-emerald-600 transition-colors">
                      Analytics
                    </h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      Detailed analytics and insights into your children's learning journey
                    </p>
                    <div className="flex items-center text-emerald-600 font-semibold group-hover:translate-x-2 transition-transform duration-300">
                      View Analytics
                      <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="max-w-2xl mx-auto mt-12">
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center">
                <h3 className="text-xl font-semibold text-yellow-800 mb-2">No Parent Found</h3>
                <p className="text-yellow-600">Parent with ID 1 does not exist in the database.</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default ParentDashboard;
