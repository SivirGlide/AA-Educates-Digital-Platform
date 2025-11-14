import Head from 'next/head';
import Link from 'next/link';
import type { NextPage } from 'next';
import { DashboardLayout } from '@/src/components/layouts/DashboardLayout';
import { Button } from '@/src/components/ui/button';
import { Home, ArrowLeft } from 'lucide-react';

const NotFoundPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>404 - Page Not Found | AA Educates</title>
        <meta name="description" content="The page you're looking for doesn't exist." />
      </Head>
      <DashboardLayout>
        <div className="min-h-[60vh] flex items-center justify-center -mx-6 -my-8 px-6 py-8">
          <div className="text-center space-y-6 max-w-md">
            <div className="space-y-2">
              <h1 className="text-6xl md:text-8xl font-extrabold text-primary">404</h1>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">Page Not Found</h2>
              <p className="text-muted-foreground">
                The page you're looking for doesn't exist or has been moved.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button asChild size="lg">
                <Link href="/">
                  <Home className="mr-2 h-4 w-4" />
                  Go Home
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => window.history.back()}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Go Back
              </Button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
};

export default NotFoundPage;
