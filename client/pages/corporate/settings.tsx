import Head from 'next/head';
import type { NextPage } from 'next';
import { useState } from 'react';
import { DashboardLayout } from '@/src/components/layouts/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Badge } from '@/src/components/ui/badge';
import { Label } from '@/src/components/ui/label';

type PreferenceKey = 'project_updates' | 'volunteer_digest' | 'impact_reports' | 'product_announcements';

const defaultPrefs: Record<PreferenceKey, boolean> = {
  project_updates: true,
  volunteer_digest: true,
  impact_reports: false,
  product_announcements: false,
};

const CorporateSettingsPage: NextPage = () => {
  const [preferences, setPreferences] = useState(defaultPrefs);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [saved, setSaved] = useState(false);

  const togglePreference = (key: PreferenceKey) => {
    setPreferences((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      setSaved(false);
      return next;
    });
  };

  const handleSave = () => {
    setSaved(true);
    // integrate with API later
  };

  return (
    <>
      <Head>
        <title>Corporate Settings | AA Educates</title>
      </Head>
      <DashboardLayout backgroundClassName="bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
        <div className="space-y-10">
          <header className="space-y-3">
            <h1 className="text-3xl font-extrabold">Account settings</h1>
            <p className="text-muted-foreground max-w-3xl">Configure notification preferences, security features, and collaboration tools for your corporate account.</p>
          </header>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>Select the updates you want to receive from AA Educates.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4 text-sm">
                  {Object.entries(preferences).map(([key, value]) => (
                    <Label key={key} className="flex items-center justify-between gap-4 capitalize cursor-pointer">
                      <span>{key.replace('_', ' ')}</span>
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={() => togglePreference(key as PreferenceKey)}
                        className="h-4 w-4 rounded border-input text-primary focus:ring-2 focus:ring-ring"
                      />
                    </Label>
                  ))}
                </div>
                <Button onClick={handleSave}>
                  Save preferences
                </Button>
                {saved && <p className="text-sm text-secondary">Preferences saved</p>}
              </CardContent>
            </Card>

            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle>Security</CardTitle>
                <CardDescription>Keep your corporate portal secure.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Label className="flex items-center justify-between gap-4 text-sm cursor-pointer">
                  <span>Two-factor authentication</span>
                  <input
                    type="checkbox"
                    checked={twoFactorEnabled}
                    onChange={(event) => setTwoFactorEnabled(event.target.checked)}
                    className="h-4 w-4 rounded border-input text-primary focus:ring-2 focus:ring-ring"
                  />
                </Label>
                <Button variant="outline">
                  Update password
                </Button>
                <Button variant="destructive" size="sm">
                  Review account activity
                </Button>
              </CardContent>
            </Card>

            <Card className="border-secondary/20">
              <CardHeader>
                <CardTitle>Integrations</CardTitle>
                <CardDescription>Connect your corporate tools.</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center justify-between">
                    <span>HRIS sync</span>
                    <Button variant="outline" size="sm">Connect</Button>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>Slack notifications</span>
                    <Button variant="outline" size="sm">Connect</Button>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>Power BI export</span>
                    <Button variant="outline" size="sm">Generate token</Button>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-accent/20">
              <CardHeader>
                <CardTitle>Support</CardTitle>
                <CardDescription>Need to update something complex? Talk to the AA Educates team.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="default">
                  Contact support
                </Button>
                <p className="text-xs text-muted-foreground">Response within 1 business day.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
};

export default CorporateSettingsPage;
