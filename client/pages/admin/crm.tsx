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

const partnerPipeline = [
  {
    id: 1,
    organisation: 'FutureTech Labs',
    contact: 'ayesha.khan@ftlabs.com',
    status: 'Discovery call',
    nextStep: 'Share pilot proposal',
  },
  {
    id: 2,
    organisation: 'Inclusive Bank',
    contact: 'marcus.lee@inclusivebank.co.uk',
    status: 'Proposal submitted',
    nextStep: 'Awaiting feedback',
  },
  {
    id: 3,
    organisation: 'Northbridge College',
    contact: 'principal@northbridge.ac.uk',
    status: 'Contract signed',
    nextStep: 'Schedule onboarding',
  },
];

const AdminCrmPage: NextPage = () => {
  const [search, setSearch] = useState('');
  const filteredPipeline = useMemo(() => {
    return partnerPipeline.filter((partner) =>
      partner.organisation.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  return (
    <>
      <Head>
        <title>Admin CRM | AA Educates</title>
      </Head>
      <DashboardLayout backgroundClassName="bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
        <div className="space-y-10">
          <header className="space-y-3">
            <h1 className="text-3xl font-extrabold">Partner relationships</h1>
            <p className="text-muted-foreground max-w-3xl">Track outreach with corporate partners, schools, and community organisations.</p>
          </header>

          <Card>
            <CardContent className="p-6 space-y-4">
              <Label htmlFor="search">Search pipeline</Label>
              <Input
                id="search"
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by organisation name"
                className="mt-2"
              />
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredPipeline.map((partner) => (
              <Card key={partner.id} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardHeader>
                  <CardTitle>{partner.organisation}</CardTitle>
                  <CardDescription>{partner.contact}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Badge variant={
                    partner.status === 'Contract signed' ? 'default' :
                    partner.status === 'Proposal submitted' ? 'secondary' :
                    'outline'
                  }>
                    {partner.status}
                  </Badge>
                  <p className="text-sm text-muted-foreground">Next step: {partner.nextStep}</p>
                  <div className="flex gap-3">
                    <Button asChild>
                      <Link href={`/admin/crm?partner=${partner.id}`}>View timeline</Link>
                    </Button>
                    <Button variant="outline">Add note</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            {filteredPipeline.length === 0 && (
              <Card className="md:col-span-2 xl:col-span-3 border-dashed">
                <CardContent className="p-10 text-center text-sm text-muted-foreground">
                  No partners match that search yet.
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </DashboardLayout>
    </>
  );
};

export default AdminCrmPage;
