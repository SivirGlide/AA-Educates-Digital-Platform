import Head from 'next/head';
import Link from 'next/link';
import type { NextPage } from 'next';
import { useState } from 'react';
import { DashboardLayout } from '@/src/components/layouts/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Label } from '@/src/components/ui/label';
import { Badge } from '@/src/components/ui/badge';

type PreferenceKey = 'incident_alerts' | 'weekly_digest' | 'product_updates' | 'billing';

type PreferenceState = Record<PreferenceKey, boolean>;

const defaultPrefs: PreferenceState = {
  incident_alerts: true,
  weekly_digest: true,
  product_updates: false,
  billing: true,
};

const AdminSettingsPage: NextPage = () => {
  const [preferences, setPreferences] = useState<PreferenceState>(defaultPrefs);
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
  };

  return (
    <>
      <Head>
        <title>Admin Settings | AA Educates</title>
      </Head>
      <DashboardLayout backgroundClassName="bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
        <div className="space-y-10">
          <header className="space-y-3">
            <h1 className="text-3xl font-extrabold">Platform settings</h1>
            <p className="text-muted-foreground max-w-3xl">Configure notifications, security, and integrations for AA Educates administrators.</p>
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
                    <Label key={key} className="flex items-center justify-between gap-4 capitalize">
                      <span>{key.replace('_', ' ')}</span>
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={() => togglePreference(key as PreferenceKey)}
                        className="h-4 w-4 rounded border-input"
                      />
                    </Label>
                  ))}
                </div>
                <Button onClick={handleSave}>Save preferences</Button>
                {saved && <p className="text-sm text-secondary">Preferences saved.</p>}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Security</CardTitle>
                <CardDescription>Keep administrator accounts protected.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Label className="flex items-center justify-between gap-4">
                  <span>Two-factor authentication</span>
                  <input
                    type="checkbox"
                    checked={twoFactorEnabled}
                    onChange={(event) => setTwoFactorEnabled(event.target.checked)}
                    className="h-4 w-4 rounded border-input"
                  />
                </Label>
                <Button variant="outline">Update password policy</Button>
                <Button variant="destructive">Review audit log</Button>
              </CardContent>
            </Card>

            <Card className="border-secondary/20">
              <CardHeader>
                <CardTitle>Integrations</CardTitle>
                <CardDescription>Connect AA Educates with your organisation's tools.</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center justify-between">
                    <span>SSO / Identity provider</span>
                    <Button variant="outline" size="sm">Configure</Button>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>Finance exports</span>
                    <Button variant="outline" size="sm">Generate token</Button>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>Analytics webhook</span>
                    <Button variant="outline" size="sm">Enable</Button>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-accent/20">
              <CardHeader>
                <CardTitle>Support</CardTitle>
                <CardDescription>Need to make a change across the platform? Talk to the AA Educates team.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button>Contact support</Button>
                <p className="text-xs text-muted-foreground">Response within 1 business day.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
};

export default AdminSettingsPage;
