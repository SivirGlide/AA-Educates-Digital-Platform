import type { AppProps } from 'next/app';
import { useEffect } from 'react';
import '../styles/globals.css';
import { AuthProvider } from '@/src/hooks/useAuthCore';
import { ErrorBoundary } from '@/src/components/feedback/ErrorBoundary';

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    // Handle unhandled promise rejections gracefully
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled promise rejection:', event.reason);
      // Log but don't crash - let ErrorBoundary handle it
      event.preventDefault();
    };

    // Handle uncaught errors gracefully
    const handleError = (event: ErrorEvent) => {
      console.error('Uncaught error:', event.error);
      // Log but don't crash - let ErrorBoundary handle it
      event.preventDefault();
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('unhandledrejection', handleUnhandledRejection);
      window.addEventListener('error', handleError);

      return () => {
        window.removeEventListener('unhandledrejection', handleUnhandledRejection);
        window.removeEventListener('error', handleError);
      };
    }
  }, []);

  return (
    <ErrorBoundary>
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </ErrorBoundary>
  );
}

