import Head from 'next/head';
import Link from 'next/link';
import type { NextPage } from 'next';

const AboutPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>About | AA Educates</title>
        <meta
          name="description"
          content="Discover the mission, vision, and team behind AA Educates, the digital platform bridging education and industry."
        />
      </Head>
      <main className="min-h-screen bg-white">
        <section className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-20">
          <div className="container mx-auto px-6">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">About AA Educates</h1>
            <p className="max-w-3xl text-lg text-purple-50">
              We believe every learner deserves access to meaningful, industry-connected experiences. AA Educates brings together
              students, parents, educators, and corporate partners to co-create impactful learning journeys.
            </p>
          </div>
        </section>

        <section className="container mx-auto px-6 py-16 grid gap-12 md:grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-gray-600 leading-relaxed">
              To democratise access to experiential learning, unlock talent pipelines for organisations, and empower communities with
              the skills needed for a rapidly evolving world of work.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Approach</h2>
            <p className="text-gray-600 leading-relaxed">
              We combine curriculum-aligned projects, mentorship, analytics, and community support to deliver personalised pathways
              for learners while giving corporate partners quantifiable impact.
            </p>
          </div>
        </section>

        <section className="bg-gray-50 py-16">
          <div className="container mx-auto px-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">What we value</h2>
            <div className="grid gap-8 md:grid-cols-3">
              {[
                {
                  title: 'Equity',
                  description:
                    'Ensuring all learners—regardless of background—have access to high-quality, culturally responsive opportunities.',
                },
                {
                  title: 'Collaboration',
                  description:
                    'Connecting educators, families, and employers to create shared responsibility for future-ready outcomes.',
                },
                {
                  title: 'Innovation',
                  description:
                    'Leveraging technology, data, and storytelling to make learning immersive, measurable, and engaging.',
                },
              ].map((value) => (
                <div key={value.title} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{value.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="container mx-auto px-6 py-16 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to partner with us?</h2>
          <p className="text-gray-600 mb-8">
            Whether you are an educator, parent, or organisation, we would love to explore how AA Educates can support you.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center px-6 py-3 rounded-xl bg-purple-600 text-white font-semibold hover:bg-purple-700 transition"
          >
            Contact our team
          </Link>
        </section>
      </main>
    </>
  );
};

export default AboutPage;
