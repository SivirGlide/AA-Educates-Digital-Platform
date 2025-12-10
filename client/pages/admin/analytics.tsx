import Head from 'next/head';
import type { NextPage } from 'next';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { DashboardLayout } from '@/src/components/layouts/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Badge } from '@/src/components/ui/badge';
import { TrendingUp, TrendingDown } from 'lucide-react';

const categories = ['Engagement', 'Growth', 'Learning outcomes'];

const dataPoints = [
  { id: 1, category: 'Engagement', metric: 'Weekly active learners', value: 642, delta: 14 },
  { id: 2, category: 'Engagement', metric: 'Average session length', value: '18m', delta: 6 },
  { id: 3, category: 'Growth', metric: 'New corporate partners', value: 7, delta: 2 },
  { id: 4, category: 'Learning outcomes', metric: 'Certification completions', value: 126, delta: 9 },
];

const AdminAnalyticsPage: NextPage = () => {
  const [category, setCategory] = useState('Engagement');

  const insights = useMemo(() => {
    return dataPoints.filter((point) => point.category === category);
  }, [category]);

  return (
    <>
      <Head>
        <title>Admin Analytics | AA Educates</title>
      </Head>
      <DashboardLayout backgroundClassName="bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
        <div className="space-y-10">
          <header className="space-y-3">
            <h1 className="text-3xl font-extrabold">Analytics</h1>
            <p className="text-muted-foreground max-w-3xl">Understand how learners, families, and partners engage with AA Educates.</p>
          </header>

          <div className="flex flex-wrap gap-3">
            {categories.map((option) => (
              <Button
                key={option}
                variant={category === option ? 'default' : 'outline'}
                onClick={() => setCategory(option)}
              >
                {option}
              </Button>
            ))}
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {insights.map((insight) => (
              <Card key={insight.id} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardHeader>
                  <Badge variant="secondary" className="text-xs uppercase tracking-wide w-fit">{insight.category}</Badge>
                  <CardTitle>{insight.metric}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-3xl font-extrabold">{insight.value}</p>
                  <div className={`text-sm font-semibold flex items-center gap-1 ${
                    insight.delta >= 0 ? 'text-secondary' : 'text-destructive'
                  }`}>
                    {insight.delta >= 0 ? (
                      <TrendingUp className="h-4 w-4" />
                    ) : (
                      <TrendingDown className="h-4 w-4" />
                    )}
                    {insight.delta >= 0 ? '+' : ''}{insight.delta}% vs previous period
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </DashboardLayout>
    </>
  );
};

export default AdminAnalyticsPage;
