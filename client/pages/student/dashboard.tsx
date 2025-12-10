import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { DashboardLayout } from '@/src/components/layouts/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Badge } from '@/src/components/ui/badge';
import { Button } from '@/src/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  Award, 
  GraduationCap, 
  Users, 
  BookOpen, 
  FileText, 
  BarChart3,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Circle,
  Clock,
  Calendar,
  Trophy,
  Star
} from 'lucide-react';

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

interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
}

interface Project {
  id: number;
  title: string;
  description: string;
  due_date?: string;
  status?: string;
  created_at?: string;
}

interface Achievement {
  id: number;
  name: string;
  description?: string;
  type: 'badge' | 'certificate' | 'skill';
  earned_at?: string;
}

const StudentDashboard: NextPage = () => {
  const [student, setStudent] = useState<StudentProfile | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loadingTasks, setLoadingTasks] = useState(true);
  
  // Calculate student level based on achievements
  const calculateLevel = () => {
    const totalAchievements = achievements.length;
    if (totalAchievements >= 20) return 'Expert';
    if (totalAchievements >= 15) return 'Advanced';
    if (totalAchievements >= 10) return 'Intermediate';
    if (totalAchievements >= 5) return 'Beginner';
    return 'Starter';
  };

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        // Get user ID from localStorage (set during login)
        const userId = localStorage.getItem('userId');
        const accessToken = localStorage.getItem('access_token');

        console.log('LocalStorage check:');
        console.log('  userId:', userId);
        console.log('  access_token:', accessToken ? 'Present (length: ' + accessToken.length + ')' : 'MISSING!');

        if (!userId) {
          setError('Please login to access your dashboard');
          setLoading(false);
          return;
        }

        if (!accessToken) {
          setError('No authentication token found. Please login again.');
          setLoading(false);
          return;
        }

        // Fetch student profile using list endpoint (returns only user's own profile)
        const studentsResponse = await api.getStudents();

        console.log('Students API Response:', studentsResponse);

        if (studentsResponse.error) {
          console.error('Error from API:', studentsResponse.error);
          setError(studentsResponse.error);
          setLoading(false);
          return;
        }

        // Get the first (and only) profile from the list
        const studentProfiles = Array.isArray(studentsResponse.data)
          ? studentsResponse.data
          : (studentsResponse.data as any)?.results || [];

        console.log('Parsed student profiles:', studentProfiles);
        console.log('Profile count:', studentProfiles.length);

        if (studentProfiles.length > 0) {
          console.log('Setting student profile:', studentProfiles[0]);
          setStudent(studentProfiles[0] as StudentProfile);

          // Fetch user data
          const userResponse = await api.getUser(parseInt(userId));
          if (userResponse.data) {
            setUser(userResponse.data as User);
          }
        } else {
          setError('No student profile found. Please contact support.');
        }
      } catch (err) {
        setError('Failed to load student data');
      } finally {
        setLoading(false);
      }
    };

    const fetchTasksAndAchievements = async () => {
      try {
        setLoadingTasks(true);
        
        // Fetch projects/tasks
        const projectsResponse = await api.getProjects();
        if (projectsResponse.data) {
          const projectsData = Array.isArray(projectsResponse.data) 
            ? projectsResponse.data 
            : (projectsResponse.data as any).results || [];
          setProjects(projectsData.slice(0, 5) as Project[]); // Show latest 5
        }

        // Fetch achievements (badges, certificates, skills)
        const [badgesResponse, certificatesResponse, skillsResponse] = await Promise.all([
          api.getBadges(),
          api.getCertificates(),
          api.getSkills(),
        ]);

        const achievementsList: Achievement[] = [];
        
        if (badgesResponse.data) {
          const badges = Array.isArray(badgesResponse.data) 
            ? badgesResponse.data 
            : (badgesResponse.data as any).results || [];
          achievementsList.push(...badges.map((b: any) => ({ ...b, type: 'badge' as const })));
        }
        
        if (certificatesResponse.data) {
          const certificates = Array.isArray(certificatesResponse.data) 
            ? certificatesResponse.data 
            : (certificatesResponse.data as any).results || [];
          achievementsList.push(...certificates.map((c: any) => ({ ...c, type: 'certificate' as const })));
        }
        
        if (skillsResponse.data) {
          const skills = Array.isArray(skillsResponse.data) 
            ? skillsResponse.data 
            : (skillsResponse.data as any).results || [];
          achievementsList.push(...skills.map((s: any) => ({ ...s, type: 'skill' as const })));
        }

        setAchievements(achievementsList.slice(0, 6)); // Show latest 6
      } catch (err) {
        console.error('Failed to load tasks and achievements:', err);
      } finally {
        setLoadingTasks(false);
      }
    };

    fetchStudentData();
    fetchTasksAndAchievements();
  }, []);

  return (
    <>
      <Head>
        <title>Student Dashboard - AA Educates</title>
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
          ) : student && user ? (
            <>
              {/* Student Profile Header */}
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="text-4xl md:text-5xl mb-2">
                    Welcome, {user.first_name || user.username}!
                  </CardTitle>
                </CardHeader>
                <CardContent>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="bg-primary/10 border-primary/20">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-primary mb-1">Badges</p>
                            <p className="text-3xl font-bold text-primary">{student.badges?.length || 0}</p>
                          </div>
                          <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                            <Award className="h-6 w-6 text-primary-foreground" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-secondary/10 border-secondary/20">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-secondary mb-1">Certificates</p>
                            <p className="text-3xl font-bold text-secondary">{student.certificates?.length || 0}</p>
                          </div>
                          <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center">
                            <GraduationCap className="h-6 w-6 text-secondary-foreground" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-accent/10 border-accent/20">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-accent mb-1">Skills</p>
                            <p className="text-3xl font-bold text-accent">{student.skills?.length || 0}</p>
                          </div>
                          <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center">
                            <Sparkles className="h-6 w-6 text-accent-foreground" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>

              {/* Tasks and Achievements Module */}
              <Card className="mb-8">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Trophy className="h-6 w-6 text-primary" />
                    </div>
                    
                    {/* Title and Level */}
                    <div className="flex-1">
                      <CardTitle className="mb-1">Projects</CardTitle>
                      <CardDescription className="text-xs">
                        Level: {calculateLevel()}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Tasks Section */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-sm">Tasks</h3>
                        <Button asChild variant="ghost" size="sm">
                          <Link href="/student/projects">
                            View All
                            <ArrowRight className="ml-1 h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                      {loadingTasks ? (
                        <div className="flex items-center justify-center py-8">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                        </div>
                      ) : projects.length > 0 ? (
                        <div className="space-y-3">
                          {projects.map((project) => (
                            <div
                              key={project.id}
                              className="flex items-start gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors cursor-pointer group"
                            >
                              <div className="mt-0.5">
                                {project.status === 'completed' ? (
                                  <CheckCircle2 className="h-5 w-5 text-secondary" />
                                ) : (
                                  <Circle className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-sm group-hover:text-primary transition-colors">
                                  {project.title}
                                </h4>
                                {project.description && (
                                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                    {project.description}
                                  </p>
                                )}
                                {project.due_date && (
                                  <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                                    <Calendar className="h-3 w-3" />
                                    <span>
                                      {new Date(project.due_date).toLocaleDateString('en-GB', {
                                        day: 'numeric',
                                        month: 'short',
                                      })}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                          <p className="text-sm">No tasks available</p>
                        </div>
                      )}
                    </div>

                    {/* Achievements Section */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-sm">Achievements</h3>
                        <Button asChild variant="ghost" size="sm">
                          <Link href="/student/certificates">
                            View All
                            <ArrowRight className="ml-1 h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                      {loadingTasks ? (
                        <div className="flex items-center justify-center py-8">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-accent"></div>
                        </div>
                      ) : achievements.length > 0 ? (
                        <div className="grid grid-cols-2 gap-3">
                          {achievements.map((achievement) => (
                            <div
                              key={achievement.id}
                              className="flex flex-col items-center p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors cursor-pointer group"
                            >
                              <div className={cn(
                                "w-12 h-12 rounded-full flex items-center justify-center mb-2",
                                achievement.type === 'badge' && "bg-primary/10 group-hover:bg-primary/20",
                                achievement.type === 'certificate' && "bg-secondary/10 group-hover:bg-secondary/20",
                                achievement.type === 'skill' && "bg-accent/10 group-hover:bg-accent/20"
                              )}>
                                {achievement.type === 'badge' && (
                                  <Award className={cn(
                                    "h-6 w-6",
                                    "text-primary"
                                  )} />
                                )}
                                {achievement.type === 'certificate' && (
                                  <GraduationCap className={cn(
                                    "h-6 w-6",
                                    "text-secondary"
                                  )} />
                                )}
                                {achievement.type === 'skill' && (
                                  <Star className={cn(
                                    "h-6 w-6",
                                    "text-accent"
                                  )} />
                                )}
                              </div>
                              <h4 className="font-medium text-xs text-center group-hover:text-primary transition-colors line-clamp-2">
                                {achievement.name}
                              </h4>
                              {achievement.earned_at && (
                                <p className="text-xs text-muted-foreground mt-1">
                                  {new Date(achievement.earned_at).toLocaleDateString('en-GB', {
                                    month: 'short',
                                    year: 'numeric',
                                  })}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          <Trophy className="h-12 w-12 mx-auto mb-3 opacity-50" />
                          <p className="text-sm">No achievements yet</p>
                          <p className="text-xs mt-1">Complete tasks to earn achievements!</p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Dashboard Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-primary/20">
                  <CardHeader>
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <FileText className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle>My Projects</CardTitle>
                    <CardDescription>
                      View and manage your projects, track submissions, and see feedback
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button asChild variant="ghost" className="w-full justify-between group-hover:text-primary">
                      <Link href="/student/projects">
                        View Projects
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>

                <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-secondary/20">
                  <CardHeader>
                    <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
                      <Award className="h-6 w-6 text-secondary" />
                    </div>
                    <CardTitle>Achievements</CardTitle>
                    <CardDescription>
                      Your badges, certificates, and skills earned throughout your journey
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button asChild variant="ghost" className="w-full justify-between group-hover:text-secondary">
                      <Link href="/student/certificates">
                        View Achievements
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>

                <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-accent/20">
                  <CardHeader>
                    <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                      <Users className="h-6 w-6 text-accent" />
                    </div>
                    <CardTitle>Mentorship</CardTitle>
                    <CardDescription>
                      Connect with mentors, schedule sessions, and get personalized guidance
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button asChild variant="ghost" className="w-full justify-between group-hover:text-accent">
                      <Link href="/student/mentoring">
                        View Sessions
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>

                <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-primary/20">
                  <CardHeader>
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <BookOpen className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle>Learning</CardTitle>
                    <CardDescription>
                      Browse modules, access resources, and purchase workbooks to enhance your skills
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button asChild variant="ghost" className="w-full justify-between group-hover:text-primary">
                      <Link href="/student/resources">
                        Browse Learning
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>

                <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-secondary/20">
                  <CardHeader>
                    <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
                      <Users className="h-6 w-6 text-secondary" />
                    </div>
                    <CardTitle>Community</CardTitle>
                    <CardDescription>
                      Engage with posts, comments, and group chats to connect with peers
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button asChild variant="ghost" className="w-full justify-between group-hover:text-secondary">
                      <Link href="/student/community">
                        Visit Community
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>

                <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-accent/20">
                  <CardHeader>
                    <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                      <BarChart3 className="h-6 w-6 text-accent" />
                    </div>
                    <CardTitle>Progress</CardTitle>
                    <CardDescription>
                      Track your learning progress, engagement metrics, and view detailed analytics
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button asChild variant="ghost" className="w-full justify-between group-hover:text-accent">
                      <Link href="/student/skills">
                        View Analytics
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </>
          ) : (
            <Card className="max-w-2xl mx-auto mt-12 border-yellow-200">
              <CardHeader>
                <CardTitle className="text-yellow-800">No Student Found</CardTitle>
                <CardDescription className="text-yellow-600">
                  Student profile does not exist in the database.
                </CardDescription>
              </CardHeader>
            </Card>
          )}
      </DashboardLayout>
    </>
  );
};

export default StudentDashboard;

