import Head from 'next/head';
import Link from 'next/link';
import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/src/components/layouts/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Badge } from '@/src/components/ui/badge';
import { Label } from '@/src/components/ui/label';

interface NotificationPrefs {
  projects: boolean;
  mentoring: boolean;
  community: boolean;
  newsletters: boolean;
}

const StudentSettingsPage: NextPage = () => {
  const [preferences, setPreferences] = useState<NotificationPrefs>({
    projects: true,
    mentoring: true,
    community: false,
    newsletters: false
  });
  const [darkModeDetected, setDarkModeDetected] = useState(false);

  useEffect(() => {
    setDarkModeDetected(window.matchMedia('(prefers-color-scheme: dark)').matches);
  }, []);

  return (
    <>
      <Head>
        <title>Settings | AA Educates</title>
      </Head>
      <DashboardLayout backgroundClassName="bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
        <div className="space-y-10">
          <header className="space-y-3">
            <h1 className="text-3xl font-extrabold">Account settings</h1>
            <p className="text-muted-foreground max-w-3xl">
              Control how you access AA Educates, manage notifications, and keep your account secure. Your preferences are synced
              across devices when you stay signed in.
            </p>
          </header>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>Choose the updates you want to receive.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4 text-sm">
                  {Object.entries(preferences).map(([key, value]) => (
                    <Label key={key} className="flex items-center justify-between gap-4 cursor-pointer">
                      <span className="capitalize">{key}</span>
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(event) =>
                          setPreferences((prev) => ({ ...prev, [key]: event.target.checked }))
                        }
                        className="h-4 w-4 rounded border-input text-primary focus:ring-2 focus:ring-ring"
                      />
                    </Label>
                  ))}
                </div>
                <Button>
                  Save preferences
                </Button>
              </CardContent>
            </Card>

            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle>Appearance</CardTitle>
                <CardDescription>Match the interface to your preferences.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span>Use dark mode when available</span>
                  <Badge variant={darkModeDetected ? 'default' : 'secondary'}>
                    {darkModeDetected ? 'Detected' : 'Off'}
                  </Badge>
                </div>
                <Button variant="outline">
                  Toggle dark mode
                </Button>
              </CardContent>
            </Card>

            <Card className="border-destructive/20">
              <CardHeader>
                <CardTitle>Security</CardTitle>
                <CardDescription>Protect your account with strong, unique credentials.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="destructive">
                  Change password
                </Button>
                <Button variant="outline">
                  Manage devices
                </Button>
              </CardContent>
            </Card>

            <Card className="border-accent/20">
              <CardHeader>
                <CardTitle>Privacy</CardTitle>
                <CardDescription>Review how your information is used across the platform.</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link className="text-primary font-semibold hover:underline" href="/terms">
                      Read privacy summary
                    </Link>
                  </li>
                  <li>
                    <Link className="text-primary font-semibold hover:underline" href="/contact">
                      Request data export
                    </Link>
                  </li>
                  <li>
                    <Link className="text-primary font-semibold hover:underline" href="/contact">
                      Deactivate account
                    </Link>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
};

export default StudentSettingsPage;
