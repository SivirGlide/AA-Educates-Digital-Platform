import Head from 'next/head';
import Link from 'next/link';
import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/src/components/layouts/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Label } from '@/src/components/ui/label';
import { Badge } from '@/src/components/ui/badge';

type NotificationPrefs = Record<'projects' | 'mentoring' | 'events' | 'newsletters', boolean>;

const ParentSettingsPage: NextPage = () => {
  const [preferences, setPreferences] = useState<NotificationPrefs>({
    projects: true,
    mentoring: true,
    events: false,
    newsletters: false,
  });
  const [darkModeDetected, setDarkModeDetected] = useState(false);

  useEffect(() => {
    setDarkModeDetected(window.matchMedia('(prefers-color-scheme: dark)').matches);
  }, []);

  return (
    <>
      <Head>
        <title>Settings | Parent Portal</title>
      </Head>
      <DashboardLayout backgroundClassName="bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
        <div className="space-y-10">
          <header className="space-y-3">
            <h1 className="text-3xl font-extrabold">Settings</h1>
            <CardDescription className="max-w-3xl">
              Manage communication preferences, appearance, and privacy settings for your parent account. These settings apply across all
              devices when you sign in with the same credentials.
            </CardDescription>
          </header>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>Choose the updates you'd like to receive.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  {Object.entries(preferences).map(([key, value]) => (
                    <Label key={key} className="flex items-center justify-between gap-4">
                      <span className="capitalize">{key}</span>
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(event) =>
                          setPreferences((prev) => ({ ...prev, [key]: event.target.checked }))
                        }
                        className="h-4 w-4 rounded border-input"
                      />
                    </Label>
                  ))}
                </div>
                <Button>Save preferences</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Appearance</CardTitle>
                <CardDescription>Match the interface to your household's preferences.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Use dark mode when available</span>
                  <Badge variant={darkModeDetected ? "default" : "secondary"}>
                    {darkModeDetected ? 'Detected' : 'Off'}
                  </Badge>
                </div>
                <Button variant="outline">Toggle dark mode</Button>
              </CardContent>
            </Card>

            <Card className="border-destructive/20">
              <CardHeader>
                <CardTitle>Security</CardTitle>
                <CardDescription>Keep your parent account protected.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="destructive">Change password</Button>
                <Button variant="outline">Review sign-in activity</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Privacy</CardTitle>
                <CardDescription>Understand how your data is used across AA Educates.</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li><Link className="text-primary font-semibold hover:underline" href="/terms">Read privacy summary</Link></li>
                  <li><Link className="text-primary font-semibold hover:underline" href="/contact">Request data export</Link></li>
                  <li><Link className="text-primary font-semibold hover:underline" href="/contact">Deactivate account</Link></li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
};

export default ParentSettingsPage;
