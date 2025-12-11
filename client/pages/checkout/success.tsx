import Head from 'next/head';
import { useRouter } from 'next/router';
import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/src/components/layouts/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { api } from '../../lib/api';
import { useAuth } from '@/src/hooks/useAuthCore';
import { CheckCircle2, Loader2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const CheckoutSuccessPage: NextPage = () => {
  const router = useRouter();
  const { session_id } = router.query;
  const { role } = useAuth();
  const [verifying, setVerifying] = useState(true);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get dashboard path based on user role
  const getDashboardPath = () => {
    const roleLower = role?.toLowerCase() || '';
    switch (roleLower) {
      case 'student':
        return '/student/dashboard';
      case 'parent':
        return '/parent/dashboard';
      case 'corporate_partner':
        return '/corporate/dashboard';
      case 'admin':
        return '/admin/dashboard';
      default:
        return '/'; // Fallback to homepage if role is unknown
    }
  };

  useEffect(() => {
    const verifyPayment = async () => {
      if (!session_id) {
        setError('No session ID provided');
        setVerifying(false);
        return;
      }

      try {
        const response = await api.verifyPayment({ session_id: session_id as string });
        
        if (response.error) {
          setError(response.error);
        } else {
          setVerified(true);
        }
      } catch (err) {
        setError('Failed to verify payment');
      } finally {
        setVerifying(false);
      }
    };

    if (session_id) {
      verifyPayment();
    }
  }, [session_id]);

  return (
    <>
      <Head>
        <title>Payment Success | AA Educates</title>
      </Head>
      <DashboardLayout backgroundClassName="bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
        <div className="max-w-2xl mx-auto space-y-8">
          {verifying ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
                <CardTitle>Verifying Payment...</CardTitle>
                <CardDescription className="mt-2">
                  Please wait while we verify your payment
                </CardDescription>
              </CardContent>
            </Card>
          ) : error ? (
            <Card className="border-destructive">
              <CardHeader>
                <CardTitle className="text-destructive">Verification Failed</CardTitle>
                <CardDescription className="text-destructive">{error}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild>
                  <Link href="/checkout">Try Again</Link>
                </Button>
              </CardContent>
            </Card>
          ) : verified ? (
            <Card className="border-secondary/50 bg-secondary/10">
              <CardContent className="p-12 text-center">
                <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="h-8 w-8 text-secondary-foreground" />
                </div>
                <CardTitle className="text-3xl mb-4">Payment Successful!</CardTitle>
                <CardDescription className="text-lg mb-6">
                  Thank you for your payment. Your transaction has been completed successfully.
                </CardDescription>
                <div className="flex gap-4 justify-center">
                  <Button asChild>
                    <Link href={getDashboardPath()}>
                      Go to Dashboard
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="/checkout">Make Another Payment</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : null}
        </div>
      </DashboardLayout>
    </>
  );
};

export default CheckoutSuccessPage;
