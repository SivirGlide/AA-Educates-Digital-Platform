import Head from 'next/head';
import type { NextPage } from 'next';
import Link from 'next/link';
import { DashboardLayout } from '@/src/components/layouts/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { XCircle, ArrowLeft } from 'lucide-react';

const CheckoutCancelPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Payment Cancelled | AA Educates</title>
      </Head>
      <DashboardLayout backgroundClassName="bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
        <div className="max-w-2xl mx-auto space-y-8">
          <Card className="border-accent/50">
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <XCircle className="h-8 w-8 text-accent" />
              </div>
              <CardTitle className="text-3xl mb-4">Payment Cancelled</CardTitle>
              <CardDescription className="text-lg mb-6">
                Your payment was cancelled. No charges have been made to your account.
              </CardDescription>
              <div className="flex gap-4 justify-center">
                <Button asChild>
                  <Link href="/checkout">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Return to Checkout
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/">Go to Dashboard</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </>
  );
};

export default CheckoutCancelPage;
