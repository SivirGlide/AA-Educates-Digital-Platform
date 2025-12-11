import Head from 'next/head';
import { useRouter } from 'next/router';
import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { useAuth } from '@/src/hooks/useAuthCore';
import { Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/src/components/ui/card';

const LogoutPage: NextPage = () => {
  const router = useRouter();
  const { logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const performLogout = async () => {
      setIsLoggingOut(true);
      
      // Wait a moment before starting logout for smoother transition
      await new Promise(resolve => setTimeout(resolve, 400));
      
      // Use the auth hook's logout function to properly clear state
      logout();

      // Show "Signing out" state for longer
      await new Promise(resolve => setTimeout(resolve, 1200));

      setIsLoggingOut(false);

      // Show "Signed out" message before redirect
      await new Promise(resolve => setTimeout(resolve, 800));

      // Navigate to login
      router.replace('/login');
    };

    performLogout();
  }, [router, logout]);

  return (
    <>
      <Head>
        <title>Signing out… | AA Educates</title>
      </Head>
      <main className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 flex items-center justify-center px-4">
        <Card className="max-w-md w-full border-primary/20 shadow-lg animate-in zoom-in-95 fade-in duration-500">
          <CardContent className="p-8 text-center space-y-6">
            {isLoggingOut ? (
              <div className="animate-in fade-in duration-300">
                <div className="flex justify-center">
                  <div className="relative">
                    <Loader2 className="h-16 w-16 animate-spin text-primary" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="h-8 w-8 rounded-full bg-background"></div>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <h1 className="text-2xl font-semibold">Signing out</h1>
                  <p className="text-muted-foreground">Please wait while we sign you out...</p>
                </div>
              </div>
            ) : (
              <div className="animate-in fade-in zoom-in-95 duration-500">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-secondary/20">
                  <svg className="h-8 w-8 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H5a3 3 0 01-3-3V7a3 3 0 013-3h5a3 3 0 013 3v1" />
                  </svg>
                </div>
                <div className="space-y-2">
                  <h1 className="text-2xl font-semibold">You have been signed out</h1>
                  <p className="text-muted-foreground">Redirecting to login page...</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </>
  );
};

export default LogoutPage;
