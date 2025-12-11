import Head from 'next/head';
import Link from 'next/link';
import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { DashboardLayout } from '@/src/components/layouts/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Badge } from '@/src/components/ui/badge';
import type { Certificate } from '../../lib/certificates.api';

const ParentCertificatesPage: NextPage = () => {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const parentId = localStorage.getItem('profileId');
        if (!parentId) {
          setError('Please login to view certificates');
          setLoading(false);
          return;
        }

        const parentResponse = await api.getParent(parseInt(parentId, 10));
        if (parentResponse.error || !parentResponse.data) {
          setError(parentResponse.error || 'Unable to load parent record');
          setLoading(false);
          return;
        }

        const parentData = parentResponse.data as any;
        const childIds: number[] = parentData?.students || [];
        const certificatesResponse = await api.getCertificates();
        if (certificatesResponse.error || !Array.isArray(certificatesResponse.data)) {
          setError(certificatesResponse.error || 'Unable to load certificates');
          setLoading(false);
          return;
        }

        const filtered = (certificatesResponse.data as Certificate[])
          .filter((cert) => childIds.includes(cert.issued_to));

        setCertificates(filtered);
      } catch (err) {
        setError('Something went wrong while fetching certificates');
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();
  }, []);

  return (
    <>
      <Head>
        <title>Certificates | Parent Portal</title>
      </Head>
      <DashboardLayout backgroundClassName="bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
        <div className="space-y-10">
          <header className="space-y-3">
            <h1 className="text-3xl font-extrabold">Certificates & celebrations</h1>
            <p className="text-muted-foreground max-w-3xl">
              Download and share certificates earned by your child. These digital badges and credentials recognise commitment,
              progress, and community impact.
            </p>
          </header>

          {loading ? (
            <div className="flex items-center justify-center min-h-[240px]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
            </div>
          ) : error ? (
            <Card className="border-destructive">
              <CardHeader>
                <CardTitle className="text-destructive">Certificates unavailable</CardTitle>
                <CardDescription className="text-destructive">{error}</CardDescription>
              </CardHeader>
            </Card>
          ) : certificates.length === 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>No certificates yet</CardTitle>
                <CardDescription>
                  Certificates will appear here as soon as your child completes projects and milestones accredited by our partners.
                </CardDescription>
              </CardHeader>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {certificates.map((certificate) => (
                <Card key={certificate.id} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>{certificate.title}</CardTitle>
                      <Badge variant="secondary" className="text-xs uppercase tracking-wide">Student #{certificate.issued_to}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <CardDescription className="leading-relaxed">{certificate.description || 'Awarded for participation in AA Educates learning experiences.'}</CardDescription>
                    <p className="text-xs text-muted-foreground">Issued {new Date(certificate.issue_date).toLocaleDateString()}</p>
                    <div className="flex gap-3">
                      {certificate.file ? (
                        <Button asChild>
                          <Link href={certificate.file} target="_blank">Download PDF</Link>
                        </Button>
                      ) : (
                        <Button disabled>Download PDF</Button>
                      )}
                      <Button variant="outline">Share with school</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </DashboardLayout>
    </>
  );
};

export default ParentCertificatesPage;
