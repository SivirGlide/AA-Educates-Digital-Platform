import Head from 'next/head';
import Link from 'next/link';
import type { NextPage } from 'next';

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
      <main className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50">
        <div className="container mx-auto px-6 py-16">
          <header className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-4">
              Building pathways from the classroom to the workplace
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              AA Educates is a digital platform that helps students discover their potential, parents stay engaged,
              educators deliver personalised learning, and organisations invest in future talent.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/register"
                className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold shadow hover:shadow-lg transition-all"
              >
                Get Started
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center justify-center px-6 py-3 rounded-xl border border-purple-200 text-purple-600 font-semibold hover:bg-white transition-all"
              >
                Learn More
              </Link>
            </div>
          </header>

          <section className="grid gap-8 md:grid-cols-3">
            {[
              {
                title: 'For Students',
                description:
                  'Access immersive projects, mentorship, and skills tracking to build confidence and career-ready portfolios.',
              },
              {
                title: 'For Parents',
                description:
                  'Stay connected with your child’s learning journey, celebrate achievements, and explore enrichment opportunities.',
              },
              {
                title: 'For Companies',
                description:
                  'Partner with emerging talent, offer live briefs, and support inclusive talent pipelines with measurable impact.',
              },
            ].map((card) => (
              <div
                key={card.title}
                className="bg-white/90 border border-purple-100 rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow"
              >
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">{card.title}</h3>
                <p className="text-gray-600 leading-relaxed">{card.description}</p>
              </div>
            ))}
          </section>
        </div>
      </main>
    </>
  );
};

export default HomePage;
