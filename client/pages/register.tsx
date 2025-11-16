import Head from 'next/head';
import Link from 'next/link';
import type { NextPage } from 'next';
import { RegisterForm } from '@/src/components/forms/RegisterForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card';
import Image from 'next/image';

const RegisterPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Create an account | AA Educates</title>
        <meta name="description" content="Register for an AA Educates account to access tailored learning experiences." />
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
              <h1 className="text-3xl font-extrabold mb-4">Join AA Educates</h1>
              <p className="text-primary-foreground/90 leading-relaxed">
                Unlock personalised learning journeys, connect with mentors, and collaborate on projects that build real-world skills.
              </p>
            </div>
            <div className="text-sm text-primary-foreground/80 mt-10 space-y-2">
              <p>
                Already have an account?{' '}
                <Link href="/login" className="text-primary-foreground font-semibold underline hover:text-primary-foreground/90">
                  Sign in
                </Link>.
              </p>
              <p>
                By creating an account you agree to our{' '}
                <Link href="/terms" className="text-primary-foreground font-semibold underline hover:text-primary-foreground/90">
                  Terms of Use
                </Link>.
              </p>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="p-10">
            <Card className="border-0 shadow-none">
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl">Create your account</CardTitle>
                <CardDescription>
                  Fill in your details to get started
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RegisterForm />
              </CardContent>
            </Card>
          </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default RegisterPage;
