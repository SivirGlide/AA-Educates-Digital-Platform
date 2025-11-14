import { NextPageContext } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { Button } from '@/src/components/ui/button';
import { Home, ArrowLeft, RefreshCw } from 'lucide-react';

interface ErrorProps {
  statusCode: number;
  hasGetInitialPropsRun?: boolean;
  err?: Error;
}

function Error({ statusCode, err }: ErrorProps) {
  return (
    <>
      <Head>
        <title>
          {statusCode === 404 ? '404 - Page Not Found' : `${statusCode} - Error`} | AA Educates
        </title>
        <meta name="description" content="An error occurred." />
      </Head>
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center space-y-6 max-w-md">
          <div className="space-y-2">
            <h1 className="text-6xl md:text-8xl font-extrabold text-primary">
              {statusCode || 'Error'}
            </h1>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              {statusCode === 404
                ? 'Page Not Found'
                : statusCode === 500
                ? 'Internal Server Error'
                : 'Something went wrong'}
            </h2>
            <p className="text-muted-foreground">
              {statusCode === 404
                ? "The page you're looking for doesn't exist or has been moved."
                : statusCode === 500
                ? 'We encountered an error processing your request. Please try again later.'
                : 'An unexpected error occurred. Please try again.'}
            </p>
            {err && process.env.NODE_ENV === 'development' && (
              <details className="mt-4 text-left">
                <summary className="cursor-pointer text-sm text-muted-foreground">
                  Error Details (Development Only)
                </summary>
                <pre className="mt-2 p-4 bg-muted rounded-md text-xs overflow-auto">
                  {err.message}
                  {err.stack && `\n\n${err.stack}`}
                </pre>
              </details>
            )}
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button asChild size="lg">
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Go Home
              </Link>
            </Button>
            {statusCode !== 404 && (
              <Button
                variant="outline"
                size="lg"
                onClick={() => window.location.reload()}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Reload Page
              </Button>
            )}
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
    </>
  );
}

Error.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? (err as any).statusCode : 404;
  return { statusCode, err: err as Error | undefined };
};

export default Error;

