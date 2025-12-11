import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import type { NextPage } from 'next';
import { Button } from '@/src/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Badge } from '@/src/components/ui/badge';
import { Navbar } from '@/src/components/navigation/Navbar';
import { GraduationCap, Users, Building2, School, ArrowRight, Sparkles } from 'lucide-react';

const HomePage: NextPage = () => {
  return (
    <>
      <Head>
        <title>AA Educates | Empowering Learners</title>
        <meta
          name="description"
          content="AA Educates connects students, parents, and corporate partners through collaborative learning experiences."
        />
      </Head>
      <Navbar />
      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5" />
          {/* Decorative Background Shapes */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Left side - 3 Purple Rectangles */}
            <div className="absolute top-40 -left-32 flex items-center gap-8 rotate-90">
              <div className="w-24 h-96 bg-primary" />
              <div className="w-24 h-96 bg-primary" />
              <div className="w-24 h-96 bg-primary" />
            </div>
            {/* Right side - Teal */}
            <div className="absolute top-10 -right-64 w-[28rem] h-[28rem] rounded-full bg-secondary" />
            {/* Bottom right - Orange */}
            <div className="absolute bottom-20 -right-56 w-80 h-80 bg-accent rotate-45" />
          </div>
          <div className="container relative mx-auto px-6 pt-8 pb-16 md:pt-12 md:pb-24">
            <div className="flex flex-col items-center text-center space-y-8">
              {/* Logo */}
              <div className="relative w-72 md:w-96">
                <Image
                  src="/AA_Educates_logo.svg"
                  alt="AA Educates Logo"
                  width={384}
                  height={200}
                  className="object-contain w-full h-auto"
                  priority
                />
              </div>

              {/* Main Heading */}
              <div className="space-y-4 max-w-4xl">
                <Badge variant="secondary" className="text-sm px-4 py-1">
                  <Sparkles className="mr-2 h-3 w-3" />
                  Empowering the Next Generation
                </Badge>
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground">
                  <span className="text-accent">Shaping</span> Futures from the{' '}
                  <span className="text-primary">classroom</span> to the{' '}
                  <span className="text-secondary">workplace</span>
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                  AA Educates is a digital platform that helps students discover their potential, parents stay engaged,
                  educators deliver personalised learning, and organisations invest in future talent.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button asChild size="lg" className="text-base px-8">
                  <Link href="/register">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="text-base px-8 bg-yellow-500 text-white border-yellow-500 hover:bg-yellow-400 hover:border-yellow-400">
                  <Link href="/about">Learn More</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="relative py-16 md:py-24 overflow-hidden">
          {/* Decorative Background Shapes */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Left side - Purple triangle */}
            <div className="absolute top-1/3 -left-40 w-0 h-0 border-l-[120px] border-l-primary border-t-[100px] border-t-transparent border-b-[100px] border-b-transparent" />
            {/* Right side - Teal large circle */}
            <div className="absolute bottom-1/4 -right-56 w-[24rem] h-[24rem] rounded-full bg-secondary" />
            {/* Center left - Orange rotated square */}
            <div className="absolute top-1/2 -left-56 w-64 h-64 bg-accent rotate-12" />
          </div>
          <div className="container mx-auto px-6 relative">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: GraduationCap,
                title: 'For Students',
                description:
                  'Access immersive projects, mentorship, and skills tracking to build confidence and career-ready portfolios.',
                color: 'text-primary',
                bgColor: 'bg-primary/10',
                borderColor: 'border-primary/20',
              },
              {
                icon: Users,
                title: 'For Parents',
                description:
                  "Stay connected with your child's learning journey, celebrate achievements, and explore enrichment opportunities.",
                color: 'text-secondary',
                bgColor: 'bg-secondary/10',
                borderColor: 'border-secondary/20',
              },
              {
                icon: Building2,
                title: 'For Companies',
                description:
                  'Partner with emerging talent, offer live briefs, and support inclusive talent pipelines with measurable impact.',
                color: 'text-accent',
                bgColor: 'bg-accent/10',
                borderColor: 'border-accent/20',
              },
              {
                icon: School,
                title: 'For Schools',
                description:
                  'Deliver personalised learning experiences, track student progress, and connect with industry partners to enhance curriculum.',
                color: 'text-primary',
                bgColor: 'bg-primary/10',
                borderColor: 'border-primary/20',
              },
            ].map((card) => {
              const Icon = card.icon;
              return (
                <Card
                  key={card.title}
                  className={`border-2 ${card.borderColor} hover:shadow-lg transition-all duration-300 hover:scale-105`}
                >
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-lg ${card.bgColor} flex items-center justify-center mb-4`}>
                      <Icon className={`h-6 w-6 ${card.color}`} />
                    </div>
                    <CardTitle className="text-2xl font-semibold">{card.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-relaxed">{card.description}</CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          </div>
        </section>

        {/* Additional CTA Section */}
        <section className="relative bg-muted/50 py-16 md:py-24 overflow-hidden">
          {/* Decorative Background Shapes */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Top left - Purple diamond */}
            <div className="absolute top-10 -left-44 w-80 h-80 bg-primary rotate-45" />
            {/* Right side - Teal triangle pointing right */}
            <div className="absolute bottom-1/3 -right-52 w-0 h-0 border-r-[140px] border-r-secondary border-t-[120px] border-t-transparent border-b-[120px] border-b-transparent" />
            {/* Bottom center - Orange circle */}
            <div className="absolute bottom-10 -right-40 w-72 h-72 rounded-full bg-accent" />
          </div>
          <div className="container relative mx-auto px-6 text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Ready to transform learning?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join thousands of students, parents, and companies already using AA Educates to build brighter futures.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button asChild size="lg" variant="default" className="text-base px-8">
                <Link href="/register">Start Your Journey</Link>
              </Button>
              <Button asChild size="lg" className="text-base px-8 bg-yellow-500 text-white hover:bg-yellow-400 hover:text-white">
                <Link href="/login">Sign In</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default HomePage;
