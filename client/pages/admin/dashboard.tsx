import Head from 'next/head';
import Link from 'next/link';
import type { NextPage } from 'next';
import { useMemo } from 'react';
import { DashboardLayout } from '@/src/components/layouts/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Badge } from '@/src/components/ui/badge';
import { ArrowRight, TrendingUp, TrendingDown } from 'lucide-react';

const adminMetrics = [
  { id: 1, label: 'Total users', value: 1845, delta: 8 },
  { id: 2, label: 'Active subscriptions', value: 312, delta: 3 },
  { id: 3, label: 'Monthly revenue', value: '£24.6k', delta: 12 },
  { id: 4, label: 'Support tickets', value: 18, delta: -5 },
];

const AdminDashboardPage: NextPage = () => {
  const highlight = useMemo(() => adminMetrics.slice(0, 3), []);

  return (
    <>
      <Head>
        <title>Admin Dashboard | AA Educates</title>
      </Head>
      <DashboardLayout backgroundClassName="bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
        <div className="space-y-12">
          <header className="space-y-3">
            <h1 className="text-3xl font-extrabold">Administrator overview</h1>
            <p className="text-muted-foreground max-w-3xl">
              Monitor activity across the AA Educates platform. These snapshots combine user activity, subscription insights, and support trends.
            </p>
          </header>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {adminMetrics.map((metric) => (
              <Card key={metric.id} className="border-primary/20">
                <CardContent className="p-6 space-y-3">
                  <div className="text-sm font-medium text-primary">{metric.label}</div>
                  <div className="text-3xl font-extrabold">{metric.value}</div>
                  <div className={`text-sm font-semibold flex items-center gap-1 ${
                    metric.delta >= 0 ? 'text-secondary' : 'text-destructive'
                  }`}>
                    {metric.delta >= 0 ? (
                      <TrendingUp className="h-4 w-4" />
                    ) : (
                      <TrendingDown className="h-4 w-4" />
                    )}
                    {metric.delta >= 0 ? '+' : ''}{metric.delta}% vs last 30 days
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="border-secondary/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Platform pulse</CardTitle>
                  <Button asChild variant="ghost" size="sm">
                    <Link href="/admin/analytics">
                      View analytics
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm">
                  {highlight.map((metric) => (
                    <li key={metric.id} className="flex items-center justify-between">
                      <span className="text-muted-foreground">{metric.label}</span>
                      <span className="font-semibold">{metric.value}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="border-accent/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Quick actions</CardTitle>
                  <Button asChild variant="ghost" size="sm">
                    <Link href="/admin/users">
                      Manage users
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Button asChild variant="outline">
                    <Link href="/admin/roles">Review roles</Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="/admin/content">Publish update</Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="/admin/crm">Partner follow-up</Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="/admin/settings">Platform settings</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
};

export default AdminDashboardPage;
