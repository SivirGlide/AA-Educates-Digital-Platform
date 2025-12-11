import Head from 'next/head';
import type { NextPage } from 'next';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { DashboardLayout } from '@/src/components/layouts/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Badge } from '@/src/components/ui/badge';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface ImpactMetric {
  id: number;
  label: string;
  value: number;
  change: number;
  unit: string;
}

interface Initiative {
  id: number;
  title: string;
  summary: string;
  learners: number;
  hours: number;
  status: 'ACTIVE' | 'COMPLETED';
  impactScore: number;
}

const metrics: ImpactMetric[] = [
  { id: 1, label: 'Learners supported', value: 184, change: 12, unit: '' },
  { id: 2, label: 'Volunteer hours', value: 640, change: 18, unit: 'hrs' },
  { id: 3, label: 'Projects delivered', value: 27, change: 5, unit: '' },
  { id: 4, label: 'Satisfaction score', value: 94, change: 3, unit: '%' },
];

const initiatives: Initiative[] = [
  {
    id: 1,
    title: 'STEM Innovators Challenge',
    summary: 'Learners tackled emerging tech challenges with coaching from your team.',
    learners: 45,
    hours: 120,
    status: 'ACTIVE',
    impactScore: 86,
  },
  {
    id: 2,
    title: 'Sustainable Futures Hackathon',
    summary: 'Cross-disciplinary teams prototyped solutions for climate resilience.',
    learners: 60,
    hours: 220,
    status: 'COMPLETED',
    impactScore: 91,
  },
  {
    id: 3,
    title: 'Mentoring Sprint',
    summary: 'Volunteers offered four-week mentoring pods focused on career readiness.',
    learners: 32,
    hours: 160,
    status: 'ACTIVE',
    impactScore: 88,
  },
];

const CorporateImpactPage: NextPage = () => {
  const [statusFilter, setStatusFilter] = useState<'ALL' | Initiative['status']>('ALL');

  const filtered = useMemo(() => {
    return initiatives.filter((initiative) => statusFilter === 'ALL' || initiative.status === statusFilter);
  }, [statusFilter]);

  return (
    <>
      <Head>
        <title>Corporate Impact | AA Educates</title>
      </Head>
      <DashboardLayout backgroundClassName="bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
        <div className="space-y-10">
          <header className="space-y-3">
            <h1 className="text-3xl font-extrabold">Impact Dashboard</h1>
            <p className="text-muted-foreground max-w-3xl">
              Track how AA Educates learners are progressing through your programmes. These snapshots combine project data, feedback, and engagement metrics.
            </p>
          </header>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {metrics.map((metric) => (
              <Card key={metric.id} className="border-primary/20">
                <CardHeader>
                  <CardDescription className="text-sm font-medium">{metric.label}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-extrabold">
                    {metric.value}
                    {metric.unit && <span className="text-lg font-semibold text-muted-foreground ml-1">{metric.unit}</span>}
                  </div>
                  <div className={`text-sm font-semibold mt-2 flex items-center gap-1 ${metric.change >= 0 ? 'text-secondary' : 'text-destructive'}`}>
                    {metric.change >= 0 ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
                    {metric.change >= 0 ? '+' : ''}{metric.change}% vs last quarter
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="border-primary/20">
            <CardHeader>
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <CardTitle>Initiatives</CardTitle>
                  <CardDescription>Review active programmes and completed collaborations.</CardDescription>
                </div>
                <div className="flex gap-3">
                  <Button
                    variant={statusFilter === 'ALL' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setStatusFilter('ALL')}
                  >
                    All
                  </Button>
                  <Button
                    variant={statusFilter === 'ACTIVE' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setStatusFilter('ACTIVE')}
                  >
                    Active
                  </Button>
                  <Button
                    variant={statusFilter === 'COMPLETED' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setStatusFilter('COMPLETED')}
                  >
                    Completed
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                {filtered.map((initiative) => (
                  <Card key={initiative.id} className="border-primary/20">
                    <CardContent className="p-6">
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <Badge variant={initiative.status === 'ACTIVE' ? 'default' : 'secondary'}>
                              {initiative.status}
                            </Badge>
                            <Badge variant="outline">Impact score {initiative.impactScore}</Badge>
                          </div>
                          <CardTitle>{initiative.title}</CardTitle>
                          <CardDescription className="max-w-2xl">{initiative.summary}</CardDescription>
                          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                            <span>{initiative.learners} learners reached</span>
                            <span>{initiative.hours} volunteer hours</span>
                          </div>
                        </div>
                        <div className="flex flex-col gap-3">
                          <Button asChild>
                            <Link href={`/corporate/dashboard?initiative=${initiative.id}`}>
                              View details
                            </Link>
                          </Button>
                          <Button variant="outline" size="sm">
                            Download report
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </>
  );
};

export default CorporateImpactPage;
