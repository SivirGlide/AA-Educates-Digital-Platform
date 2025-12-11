import Head from 'next/head';
import Link from 'next/link';
import type { NextPage } from 'next';
import { useState } from 'react';
import { DashboardLayout } from '@/src/components/layouts/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface RoleDefinition {
  key: string;
  title: string;
  description: string;
  permissions: string[];
}

const roles: RoleDefinition[] = [
  {
    key: 'platform_admin',
    title: 'Platform administrator',
    description: 'Full access to all AA Educates features, settings, and data.',
    permissions: ['Manage users', 'Configure settings', 'View financial reports', 'Approve content'],
  },
  {
    key: 'content_manager',
    title: 'Content manager',
    description: 'Publishes marketing pages, learning resources, and announcements.',
    permissions: ['Publish content', 'Manage resources', 'Schedule updates'],
  },
  {
    key: 'support_analyst',
    title: 'Support analyst',
    description: 'Handles support tickets, monitors platform health, and escalates incidents.',
    permissions: ['View tickets', 'Update ticket status', 'Escalate issues'],
  },
];

const AdminRolesPage: NextPage = () => {
  const [expanded, setExpanded] = useState<string | null>(roles[0]?.key ?? null);

  return (
    <>
      <Head>
        <title>Admin Roles | AA Educates</title>
      </Head>
      <DashboardLayout backgroundClassName="bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
        <div className="space-y-10">
          <header className="space-y-3">
            <h1 className="text-3xl font-extrabold">Roles & permissions</h1>
            <p className="text-muted-foreground max-w-3xl">Define how administrators, content managers, and support analysts access AA Educates.</p>
          </header>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {roles.map((role) => (
              <Card key={role.key} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardHeader>
                  <CardTitle>{role.title}</CardTitle>
                  <CardDescription>{role.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setExpanded((prev) => (prev === role.key ? null : role.key))}
                    className="w-full justify-between"
                  >
                    {expanded === role.key ? 'Hide permissions' : 'Show permissions'}
                    {expanded === role.key ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                  {expanded === role.key && (
                    <ul className="space-y-2 text-sm">
                      {role.permissions.map((permission) => (
                        <li key={permission} className="flex items-center gap-2 text-muted-foreground">
                          <span className="h-2 w-2 rounded-full bg-primary" aria-hidden />
                          {permission}
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </DashboardLayout>
    </>
  );
};

export default AdminRolesPage;
