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

interface Volunteer {
  id: number;
  name: string;
  skills: string[];
  interests: string[];
  availability: 'AVAILABLE' | 'LIMITED' | 'UNAVAILABLE';
  hours: number;
}

const mockVolunteers: Volunteer[] = [
  {
    id: 1,
    name: 'Jordan Cooper',
    skills: ['Product design', 'UX research'],
    interests: ['Inclusive design', 'Mentoring'],
    availability: 'AVAILABLE',
    hours: 8,
  },
  {
    id: 2,
    name: 'Aaliyah Chen',
    skills: ['Data analysis', 'Power BI'],
    interests: ['Social impact', 'STEM'],
    availability: 'LIMITED',
    hours: 4,
  },
  {
    id: 3,
    name: 'Samuel Ola',
    skills: ['Cybersecurity', 'Python'],
    interests: ['Digital safety', 'Workshops'],
    availability: 'AVAILABLE',
    hours: 6,
  },
];

const availabilityVariants: Record<Volunteer['availability'], 'default' | 'secondary' | 'outline'> = {
  AVAILABLE: 'default',
  LIMITED: 'secondary',
  UNAVAILABLE: 'outline',
};

const CorporateVolunteersPage: NextPage = () => {
  const [search, setSearch] = useState('');
  const [availability, setAvailability] = useState<'ALL' | Volunteer['availability']>('ALL');

  const filtered = useMemo(() => {
    return mockVolunteers.filter((volunteer) => {
      const matchesSearch = volunteer.name.toLowerCase().includes(search.toLowerCase()) ||
        volunteer.skills.some((skill) => skill.toLowerCase().includes(search.toLowerCase()));
      const matchesAvailability = availability === 'ALL' || volunteer.availability === availability;
      return matchesSearch && matchesAvailability;
    });
  }, [search, availability]);

  return (
    <>
      <Head>
        <title>Corporate Volunteers | AA Educates</title>
      </Head>
      <DashboardLayout backgroundClassName="bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
        <div className="space-y-10">
          <header className="space-y-3">
            <h1 className="text-3xl font-extrabold">Volunteers</h1>
            <p className="text-muted-foreground max-w-3xl">
              Discover professionals who have offered their time and expertise to support your learners. Use filters to match volunteers with projects and initiatives.
            </p>
          </header>

          <Card className="border-primary/20">
            <CardContent className="p-6 space-y-4">
              <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div className="w-full md:max-w-md">
                  <Label htmlFor="search">Search volunteers</Label>
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
                  <Label htmlFor="availability">Availability</Label>
                  <select
                    id="availability"
                    value={availability}
                    onChange={(event) => setAvailability(event.target.value as typeof availability)}
                    className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring mt-2"
                  >
                    <option value="ALL">All availability</option>
                    <option value="AVAILABLE">Available</option>
                    <option value="LIMITED">Limited</option>
                    <option value="UNAVAILABLE">Unavailable</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((volunteer) => (
              <Card key={volunteer.id} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-primary/20">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{volunteer.name}</CardTitle>
                    <Badge variant={availabilityVariants[volunteer.availability]} className="text-xs uppercase tracking-wide">
                      {volunteer.availability.replace('_', ' ')}
                    </Badge>
                  </div>
                  <CardDescription>{volunteer.hours} hrs available this month</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="text-sm font-semibold uppercase tracking-wide mb-1 text-muted-foreground">Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {volunteer.skills.map((skill) => (
                        <Badge key={skill} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold uppercase tracking-wide mb-1 text-muted-foreground">Interests</h3>
                    <div className="flex flex-wrap gap-2">
                      {volunteer.interests.map((interest) => (
                        <Badge key={interest} variant="outline" className="text-xs">
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t">
                    <Button asChild>
                      <Link href={`/corporate/dashboard?volunteer=${volunteer.id}`}>
                        Invite to project
                      </Link>
                    </Button>
                    <Button variant="ghost" size="sm">
                      Message
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            {filtered.length === 0 && (
              <Card className="md:col-span-2 xl:col-span-3 border-dashed border-primary/20 text-center">
                <CardHeader>
                  <CardTitle>No volunteers match those filters yet</CardTitle>
                  <CardDescription>Adjust your search or request a volunteer with specific expertise.</CardDescription>
                </CardHeader>
              </Card>
            )}
          </div>
        </div>
      </DashboardLayout>
    </>
  );
};

export default CorporateVolunteersPage;
