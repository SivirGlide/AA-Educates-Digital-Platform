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

const StudentCertificatesPage: NextPage = () => {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const response = await api.getCertificates();
        if (response.error || !Array.isArray(response.data)) {
          setError(response.error || 'Unable to load certificates');
        } else {
          setCertificates(response.data as Certificate[]);
        }
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
        <title>Certificates | AA Educates</title>
      </Head>
      <DashboardLayout backgroundClassName="bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
        <div className="space-y-10">
          <header className="space-y-3">
            <h1 className="text-3xl font-extrabold">Certificates & digital credentials</h1>
            <p className="text-muted-foreground max-w-3xl">
              Collect evidence of your impact, celebrate completed experiences, and share verifiable credentials with employers or
              further education providers.
            </p>
          </header>

          {loading ? (
            <div className="flex items-center justify-center min-h-[280px]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
            </div>
          ) : error ? (
            <div className="max-w-2xl mx-auto">
              <Card className="border-destructive">
                <CardHeader>
                  <CardTitle className="text-destructive">Certificates unavailable</CardTitle>
                  <CardDescription className="text-destructive">{error}</CardDescription>
                </CardHeader>
              </Card>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {certificates.map((certificate) => (
                <Card key={certificate.id} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-primary/20">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>{certificate.title}</CardTitle>
                      <Badge variant="secondary" className="text-xs uppercase tracking-wide">AA Educates</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <CardDescription className="leading-relaxed">{certificate.description || 'Certificate description coming soon.'}</CardDescription>
                    <p className="text-xs text-muted-foreground">Issued {new Date(certificate.issue_date).toLocaleDateString()}</p>
                    <div className="flex flex-wrap gap-3">
                      {certificate.file && (
                        <Button asChild>
                          <Link href={certificate.file} target="_blank">
                            View credential
                          </Link>
                        </Button>
                      )}
                      <Button variant="outline" size="sm">
                        Download PDF
                      </Button>
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

export default StudentCertificatesPage;
