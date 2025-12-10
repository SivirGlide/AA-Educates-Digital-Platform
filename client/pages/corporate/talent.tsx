import Head from 'next/head';
import Link from 'next/link';
import type { NextPage } from 'next';
import { useMemo, useState } from 'react';
import { DashboardLayout } from '@/src/components/layouts/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Badge } from '@/src/components/ui/badge';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';

interface TalentProfile {
  id: number;
  name: string;
  role: string;
  skills: string[];
  badges: string[];
  readiness: 'INTERVIEW_READY' | 'WATCHLIST' | 'EMERGING';
  updated_at: string;
}

const mockTalent: TalentProfile[] = [
  {
    id: 101,
    name: 'Imani Cole',
    role: 'Data Analyst',
    skills: ['Python', 'Power BI', 'SQL'],
    badges: ['Data storyteller', 'Inclusive analyst'],
    readiness: 'INTERVIEW_READY',
    updated_at: '2025-10-14T12:00:00Z',
  },
  {
    id: 102,
    name: 'Daniel Ahmed',
    role: 'UX/Product Designer',
    skills: ['Figma', 'Design systems', 'Prototyping'],
    badges: ['Equity designer', 'Community mentor'],
    readiness: 'WATCHLIST',
    updated_at: '2025-10-09T12:00:00Z',
  },
  {
    id: 103,
    name: 'Sofia Rivera',
    role: 'Junior Software Engineer',
    skills: ['JavaScript', 'React', 'Node.js'],
    badges: ['Hackathon finalist'],
    readiness: 'EMERGING',
    updated_at: '2025-10-01T12:00:00Z',
  },
];

const readinessVariants: Record<TalentProfile['readiness'], 'default' | 'secondary' | 'outline'> = {
  INTERVIEW_READY: 'default',
  WATCHLIST: 'secondary',
  EMERGING: 'outline',
};

const CorporateTalentPage: NextPage = () => {
  const [search, setSearch] = useState('');
  const [readiness, setReadiness] = useState<'ALL' | TalentProfile['readiness']>('ALL');

  const filtered = useMemo(() => {
    return mockTalent.filter((profile) => {
      const matchesSearch = profile.name.toLowerCase().includes(search.toLowerCase()) ||
        profile.skills.some((skill) => skill.toLowerCase().includes(search.toLowerCase()));
      const matchesReadiness = readiness === 'ALL' || profile.readiness === readiness;
      return matchesSearch && matchesReadiness;
    });
  }, [search, readiness]);

  return (
    <>
      <Head>
        <title>Corporate Talent | AA Educates</title>
      </Head>
      <DashboardLayout backgroundClassName="bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
        <div className="space-y-10">
          <header className="space-y-3">
            <h1 className="text-3xl font-extrabold">Talent Pool</h1>
            <p className="text-muted-foreground max-w-3xl">
              Shortlisted learners ready for internships, mentoring, and hiring pipelines. These profiles combine verified skills, badges, and project experience.
            </p>
          </header>

          <Card className="border-primary/20">
            <CardContent className="p-6 space-y-4">
              <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div className="w-full md:max-w-md">
                  <Label htmlFor="search">Search talent</Label>
                  <Input
                    id="search"
                    type="text"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search by name or skill"
                    className="mt-2"
                  />
                </div>
                <div className="w-full md:max-w-xs">
                  <Label htmlFor="readiness">Readiness</Label>
                  <select
                    id="readiness"
                    value={readiness}
                    onChange={(event) => setReadiness(event.target.value as typeof readiness)}
                    className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring mt-2"
                  >
                    <option value="ALL">All statuses</option>
                    <option value="INTERVIEW_READY">Interview ready</option>
                    <option value="WATCHLIST">Watchlist</option>
                    <option value="EMERGING">Emerging</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((profile) => (
              <Card key={profile.id} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-primary/20">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{profile.name}</CardTitle>
                    <Badge variant={readinessVariants[profile.readiness]} className="text-xs uppercase tracking-wide">
                      {profile.readiness.replace('_', ' ')}
                    </Badge>
                  </div>
                  <CardDescription>{profile.role}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="text-sm font-semibold uppercase tracking-wide mb-1 text-muted-foreground">Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {profile.skills.map((skill) => (
                        <Badge key={skill} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold uppercase tracking-wide mb-1 text-muted-foreground">Recognition</h3>
                    <div className="flex flex-wrap gap-2">
                      {profile.badges.map((badge) => (
                        <Badge key={badge} variant="outline" className="text-xs">
                          {badge}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground pt-2 border-t">
                    <span>Updated {new Date(profile.updated_at).toLocaleDateString()}</span>
                    <div className="flex gap-3">
                      <Button asChild variant="ghost" size="sm">
                        <Link href={`/corporate/projects?talent=${profile.id}`}>
                          Add to project
                        </Link>
                      </Button>
                      <Button variant="ghost" size="sm">
                        Download CV
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {filtered.length === 0 && (
              <Card className="md:col-span-2 xl:col-span-3 border-dashed border-primary/20 text-center">
                <CardHeader>
                  <CardTitle>No talent profiles match those filters</CardTitle>
                  <CardDescription>Adjust your search or request curated recommendations from the AA Educates team.</CardDescription>
                </CardHeader>
              </Card>
            )}
          </div>
        </div>
      </DashboardLayout>
    </>
  );
};

export default CorporateTalentPage;
