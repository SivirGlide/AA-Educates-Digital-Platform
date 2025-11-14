import Head from 'next/head';
import Link from 'next/link';
import type { NextPage } from 'next';
import { LoginForm } from '@/src/components/forms/LoginForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card';
import Image from 'next/image';

const LoginPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Login | AA Educates</title>
        <meta name="description" content="Sign in to access the AA Educates platform." />
      </Head>
      <main className="min-h-screen bg-background flex items-center justify-center px-4 py-16">
        <section className="relative overflow-hidden w-full max-w-4xl">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5" />
          <div className="relative max-w-4xl w-full grid md:grid-cols-2 gap-0 bg-card border border-border rounded-xl shadow-lg overflow-hidden">
            {/* Left Side - Branding */}
            <div className="bg-gradient-to-br from-primary via-primary/90 to-secondary p-10 flex flex-col justify-between text-primary-foreground">
              <div>
                <div className="relative w-32 h-16 mb-6">
                  <Image
                    src="/AA_Educates_logo.svg"
                    alt="AA Educates Logo"
                    fill
                    className="object-contain"
                  />
                </div>
                <h1 className="text-3xl font-extrabold mb-4">Welcome back</h1>
                <p className="text-primary-foreground/90 leading-relaxed">
                  Sign in to continue your learning journey and access your personalised dashboard.
                </p>
              </div>
              <div className="text-sm text-primary-foreground/80 mt-10 space-y-2">
                <p>
                  Don't have an account?{' '}
                  <Link href="/register" className="text-primary-foreground font-semibold underline hover:text-primary-foreground/90">
                    Create one here
                  </Link>.
                </p>
                <p>
                  <Link href="/contact" className="text-primary-foreground font-semibold underline hover:text-primary-foreground/90">
                    Need help?
                  </Link>
                </p>
              </div>
            </div>

            {/* Right Side - Form */}
            <div className="p-10">
              <Card className="border-0 shadow-none">
                <CardHeader className="pb-4">
                  <CardTitle className="text-2xl">Sign in</CardTitle>
                  <CardDescription>
                    Enter your credentials to continue
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <LoginForm />
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default LoginPage;
