import Head from 'next/head';
import type { NextPage } from 'next';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { DashboardLayout } from '@/src/components/layouts/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Badge } from '@/src/components/ui/badge';
import { ExternalLink } from 'lucide-react';

interface CorporateProfile {
  id: number;
  company_name: string;
  industry: string;
  website: string;
  csr_report_link: string;
  about: string;
  created_at: string;
  updated_at: string;
}

const CorporateProfilePage: NextPage = () => {
  const [profile, setProfile] = useState<CorporateProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileId = parseInt(localStorage.getItem('profileId') || '0', 10);
        if (!profileId) {
          setError('Please log in to view your corporate profile.');
          setLoading(false);
          return;
        }
        const response = await api.getCorporatePartner(profileId);
        if (response.error) {
          setError(response.error);
        } else if (response.data) {
          const data = response.data as any;
          setProfile({
            ...data,
            about: data?.about || '',
          } as CorporateProfile);
        }
      } catch (err) {
        setError('Unable to load corporate profile.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return (
    <>
      <Head>
        <title>Corporate Profile | AA Educates</title>
      </Head>
      <DashboardLayout backgroundClassName="bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
        <div className="space-y-10">
          {loading ? (
            <div className="flex items-center justify-center min-h-[320px]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
            </div>
          ) : error ? (
            <Card className="border-destructive">
              <CardHeader>
                <CardTitle className="text-destructive">Profile unavailable</CardTitle>
                <CardDescription className="text-destructive">{error}</CardDescription>
              </CardHeader>
            </Card>
          ) : profile ? (
            <Card className="border-primary/20">
              <CardHeader>
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div>
                    <CardTitle className="text-3xl mb-2">{profile.company_name}</CardTitle>
                    <CardDescription>Industry: {profile.industry || 'Not specified'}</CardDescription>
                    <div className="flex flex-wrap gap-3 mt-4">
                      {profile.website && (
                        <Button asChild variant="outline" size="sm">
                          <Link href={profile.website} target="_blank">
                            Visit website
                            <ExternalLink className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      )}
                      {profile.csr_report_link && (
                        <Button asChild variant="outline" size="sm">
                          <Link href={profile.csr_report_link} target="_blank">
                            View CSR report
                            <ExternalLink className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      )}
                    </div>
                  </div>
                  <Button asChild>
                    <Link href="/corporate/settings">
                      Edit profile
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-8">
                <section className="space-y-4">
                  <CardTitle>About your organisation</CardTitle>
                  <CardDescription className="leading-relaxed">
                    {profile.about || 'Share your mission, focus areas, and how you collaborate with AA Educates.'}
                  </CardDescription>
                </section>

                <div className="grid gap-6 md:grid-cols-2">
                  <Card className="border-primary/20">
                    <CardHeader>
                      <CardTitle>Programmes with AA Educates</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription>Track the initiatives your organisation has launched with our learners.</CardDescription>
                      <Button asChild variant="ghost" className="mt-4">
                        <Link href="/corporate/projects">
                          View programmes
                          <ExternalLink className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                  <Card className="border-secondary/20">
                    <CardHeader>
                      <CardTitle>Volunteering activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription>See who from your company has volunteered and the hours logged.</CardDescription>
                      <Button asChild variant="ghost" className="mt-4">
                        <Link href="/corporate/volunteers">
                          View volunteers
                          <ExternalLink className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                <footer className="text-sm text-muted-foreground">
                  Profile last updated {new Date(profile.updated_at).toLocaleDateString()}
                </footer>
              </CardContent>
            </Card>
          ) : null}
        </div>
      </DashboardLayout>
    </>
  );
};

export default CorporateProfilePage;
