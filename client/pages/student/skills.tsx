import Head from 'next/head';
import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { DashboardLayout } from '@/src/components/layouts/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Badge } from '@/src/components/ui/badge';
import { Plus } from 'lucide-react';

interface Skill {
  id: number;
  name: string;
  description: string;
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  last_updated: string;
}

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

  const getLevelVariant = (level: string) => {
    switch (level) {
      case 'BEGINNER':
        return 'secondary';
      case 'INTERMEDIATE':
        return 'default';
      case 'ADVANCED':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  return (
    <>
      <Head>
        <title>Skills | AA Educates</title>
      </Head>
      <DashboardLayout backgroundClassName="bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
        <div className="space-y-10">
          <header className="space-y-3">
            <h1 className="text-3xl font-extrabold">Skills passport</h1>
            <p className="text-muted-foreground max-w-3xl">
              Track the skills you are developing across academic, creative, and employability domains. Use this passport to evidence
              achievements during mentoring sessions and project showcases.
            </p>
          </header>

          {loading ? (
            <div className="flex items-center justify-center min-h-[280px]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
            </div>
          ) : error ? (
            <div className="max-w-2xl mx-auto">
              <Card className="border-destructive">
                <CardHeader>
                  <CardTitle className="text-destructive">Skills unavailable</CardTitle>
                  <CardDescription className="text-destructive">{error}</CardDescription>
                </CardHeader>
              </Card>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {skills.map((skill) => (
                <Card key={skill.id} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-primary/20">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>{skill.name}</CardTitle>
                      <Badge variant={getLevelVariant(skill.level)} className="text-xs uppercase tracking-wide">
                        {skill.level.toLowerCase()}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <CardDescription className="leading-relaxed">{skill.description}</CardDescription>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Updated {new Date(skill.last_updated).toLocaleDateString()}</span>
                      <Button variant="ghost" size="sm">
                        Add evidence
                        <Plus className="ml-1 h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </DashboardLayout>
    </>
  );
};

export default StudentSkillsPage;
