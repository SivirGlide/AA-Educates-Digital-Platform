import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { DashboardLayout } from '@/src/components/layouts/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Badge } from '@/src/components/ui/badge';
import { Button } from '@/src/components/ui/button';
import { Users, FileText, Award, BarChart3, ArrowRight, CheckCircle2 } from 'lucide-react';

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
  school?: string;
  bio?: string;
  cv?: string;
  portfolio_link?: string;
  badges?: number[];
  certificates?: number[];
  skills?: number[];
}

interface StudentProjectSubmission {
  id: number;
  student: number;
  project: number;
  submission_link?: string;
  feedback?: string;
  grade?: number | null;
  status: string;
  submitted_at: string;
}

const ParentDashboard: NextPage = () => {
  const [parent, setParent] = useState<ParentProfile | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [children, setChildren] = useState<StudentProfile[]>([]);
  const [childrenData, setChildrenData] = useState<Array<{student: StudentProfile, user: User | null}>>([]);
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
      // Get user ID from localStorage (set during login)
      const userId = localStorage.getItem('userId');

      if (!userId) {
        setError('Please login to access your dashboard');
        setLoading(false);
        return;
      }

      // Fetch parent profile using list endpoint (returns only user's own profile)
      const parentsResponse = await api.getParents();
      if (parentsResponse.error) {
        setError(parentsResponse.error);
        setLoading(false);
        return;
      }

      // Get the first (and only) profile from the list
      const parentProfiles = Array.isArray(parentsResponse.data)
        ? parentsResponse.data
        : (parentsResponse.data as any)?.results || [];

      if (parentProfiles.length > 0) {
        setParent(parentProfiles[0] as ParentProfile);

        // Fetch user data
        const userResponse = await api.getUser(parseInt(userId));
        if (userResponse.data) {
          setUser(userResponse.data as User);
        }
      } else {
        setError('No parent profile found. Please contact support.');
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
          const studentData = studentResponse.data as any;
          const userResponse = await api.getUser(studentData.user);
          return {
            student: studentResponse.data,
            user: userResponse.data || null,
          };
        }
        return null;
      });

      const childrenDataArray = await Promise.all(childrenPromises);
      const validChildren = childrenDataArray.filter((c): c is NonNullable<typeof c> => c !== null);
      setChildrenData(validChildren);
      setChildren(validChildren.map(c => c.student));

      // Set first child as selected by default
      if (validChildren.length > 0 && validChildren[0]) {
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
        const childrenSubmissions = response.data.filter((sub: any) =>
          childrenIds.includes(sub.student)
        ) as StudentProjectSubmission[];
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

      <DashboardLayout backgroundClassName="bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
        {loading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="max-w-2xl mx-auto mt-12">
            <Card className="border-destructive">
              <CardHeader>
                <CardTitle className="text-destructive">Error Loading Data</CardTitle>
                <CardDescription className="text-destructive">{error}</CardDescription>
              </CardHeader>
            </Card>
          </div>
        ) : parent && user ? (
          <>
            {/* Parent Profile Header */}
            <Card className="mb-8">
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                  <div>
                    <CardTitle className="text-4xl md:text-5xl mb-2">
                      Welcome, {user.first_name || user.username}!
                    </CardTitle>
                    <CardDescription className="text-xl">{user.email}</CardDescription>
                  </div>
                  <Badge variant="default" className="text-base px-4 py-2">
                    <Users className="mr-2 h-5 w-5" />
                    Parent ID: {parent.id}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                  <Card className="bg-primary/10 border-primary/20">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-primary mb-1">Children</p>
                          <p className="text-3xl font-bold text-primary">{children.length}</p>
                        </div>
                        <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                          <Users className="h-6 w-6 text-primary-foreground" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-secondary/10 border-secondary/20">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-secondary mb-1">Total Submissions</p>
                          <p className="text-3xl font-bold text-secondary">{submissions.length}</p>
                        </div>
                        <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center">
                          <FileText className="h-6 w-6 text-secondary-foreground" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-accent/10 border-accent/20">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-accent mb-1">Achievements</p>
                          <p className="text-3xl font-bold text-accent">
                            {children.reduce((sum, child) => sum + (child.badges?.length || 0) + (child.certificates?.length || 0), 0)}
                          </p>
                        </div>
                        <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center">
                          <Award className="h-6 w-6 text-accent-foreground" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>

            {/* Children Section */}
            {childrenData.length > 0 && (
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="text-3xl">My Children</CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Child Selector */}
                  {childrenData.length > 1 && (
                    <div className="mb-6">
                      <label className="block text-sm font-medium mb-2">Select Child to View Details</label>
                      <div className="flex flex-wrap gap-3">
                        {childrenData.map((childData) => (
                          <Button
                            key={childData.student.id}
                            onClick={() => setSelectedChild(childData.student.id)}
                            variant={selectedChild === childData.student.id ? "default" : "outline"}
                          >
                            {childData.user?.first_name || childData.user?.username || `Student ${childData.student.id}`}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Children Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {childrenData.map((childData) => (
                      <Card
                        key={childData.student.id}
                        className={`cursor-pointer transition-all hover:shadow-xl hover:-translate-y-1 ${
                          selectedChild === childData.student.id
                            ? 'border-primary border-2'
                            : ''
                        }`}
                        onClick={() => setSelectedChild(childData.student.id)}
                      >
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle>
                              {childData.user?.first_name || childData.user?.username || `Student ${childData.student.id}`}
                            </CardTitle>
                            {selectedChild === childData.student.id && (
                              <Badge>Selected</Badge>
                            )}
                          </div>
                          <CardDescription>{childData.user?.email}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-3 gap-2 text-center">
                            <div>
                              <p className="text-2xl font-bold text-primary">{childData.student.badges?.length || 0}</p>
                              <p className="text-xs text-muted-foreground">Badges</p>
                            </div>
                            <div>
                              <p className="text-2xl font-bold text-secondary">{childData.student.certificates?.length || 0}</p>
                              <p className="text-xs text-muted-foreground">Certs</p>
                            </div>
                            <div>
                              <p className="text-2xl font-bold text-accent">{childData.student.skills?.length || 0}</p>
                              <p className="text-xs text-muted-foreground">Skills</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Selected Child Details */}
                  {selectedChildData && (
                    <Card className="bg-primary/5 border-primary/20">
                      <CardHeader>
                        <CardTitle>
                          {selectedChildData.user?.first_name || selectedChildData.user?.username}'s Details
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                          <div>
                            <h4 className="font-semibold mb-2">Contact</h4>
                            <p className="text-muted-foreground">{selectedChildData.user?.email}</p>
                            {selectedChildData.student.portfolio_link && (
                              <Button asChild variant="link" className="mt-2">
                                <a 
                                  href={selectedChildData.student.portfolio_link} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                >
                                  View Portfolio
                                  <ArrowRight className="ml-2 h-4 w-4" />
                                </a>
                              </Button>
                            )}
                          </div>
                          <div>
                            <h4 className="font-semibold mb-2">Bio</h4>
                            <p className="text-muted-foreground">{selectedChildData.student.bio || 'No bio available'}</p>
                          </div>
                        </div>

                        {/* Submissions for Selected Child */}
                        {selectedChildSubmissions.length > 0 && (
                          <div>
                            <h4 className="font-semibold mb-3">Recent Submissions</h4>
                            <div className="space-y-3">
                              {selectedChildSubmissions.slice(0, 3).map((submission) => (
                                <Card key={submission.id}>
                                  <CardContent className="p-4">
                                    <div className="flex justify-between items-start">
                                      <div>
                                        <p className="font-medium">Submission #{submission.id}</p>
                                        <p className="text-sm text-muted-foreground">
                                          Submitted: {new Date(submission.submitted_at).toLocaleDateString()}
                                        </p>
                                        {submission.grade && (
                                          <p className="text-sm text-primary font-semibold mt-1">
                                            Grade: {submission.grade}
                                          </p>
                                        )}
                                      </div>
                                      <Badge variant={
                                        submission.status === 'APPROVED' ? 'default' :
                                        submission.status === 'REVIEWED' ? 'secondary' :
                                        'outline'
                                      }>
                                        {submission.status}
                                      </Badge>
                                    </div>
                                    {submission.feedback && (
                                      <p className="text-sm text-muted-foreground mt-2">{submission.feedback}</p>
                                    )}
                                  </CardContent>
                                </Card>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Dashboard Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-primary/20">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <BarChart3 className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="group-hover:text-primary transition-colors">Progress Tracking</CardTitle>
                  <CardDescription>
                    Monitor learning progress and track achievements across all your children
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild variant="ghost" className="w-full justify-between group-hover:text-primary">
                    <Link href="/parent/progress">
                      View Progress
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-secondary/20">
                <CardHeader>
                  <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
                    <FileText className="h-6 w-6 text-secondary" />
                  </div>
                  <CardTitle className="group-hover:text-secondary transition-colors">Projects</CardTitle>
                  <CardDescription>
                    View your children's project submissions and track their work
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild variant="ghost" className="w-full justify-between group-hover:text-secondary">
                    <Link href="/parent/students">
                      View Projects
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-accent/20">
                <CardHeader>
                  <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                    <Award className="h-6 w-6 text-accent" />
                  </div>
                  <CardTitle className="group-hover:text-accent transition-colors">Achievements</CardTitle>
                  <CardDescription>
                    View badges, certificates, and skills earned by your children
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild variant="ghost" className="w-full justify-between group-hover:text-accent">
                    <Link href="/parent/certificates">
                      View Achievements
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </>
        ) : (
          <Card className="border-accent/20">
            <CardHeader>
              <CardTitle>No Parent Found</CardTitle>
              <CardDescription>Parent profile does not exist in the database.</CardDescription>
            </CardHeader>
          </Card>
        )}
      </DashboardLayout>
    </>
  );
};

export default ParentDashboard;
