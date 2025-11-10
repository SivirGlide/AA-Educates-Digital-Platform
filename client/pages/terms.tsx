import Head from 'next/head';
import Link from 'next/link';
import type { NextPage } from 'next';

const TermsPage: NextPage = () => {
  const sections = [
    {
      title: '1. Introduction',
      content:
        'These Terms of Use outline how you may access and use the AA Educates platform. By creating an account or using our services you agree to these terms.',
    },
    {
      title: '2. Accounts & access',
      content:
        'Users must provide accurate information during registration and are responsible for safeguarding their login credentials. Different roles (student, parent, corporate partner, administrator) may have varying levels of access.',
    },
    {
      title: '3. Safeguarding & data protection',
      content:
        'AA Educates is committed to protecting young people online. All partners must adhere to safeguarding guidelines and use learner data responsibly in compliance with GDPR and other applicable regulations.',
    },
    {
      title: '4. Acceptable use',
      content:
        'You agree not to misuse platform resources, attempt to gain unauthorised access, or share harmful or discriminatory content. We may suspend accounts that breach community standards.',
    },
    {
      title: '5. Intellectual property',
      content:
        'Content shared on the platform remains the property of its creators unless otherwise agreed. By uploading materials you grant AA Educates a licence to display and share them with relevant stakeholders.',
    },
    {
      title: '6. Limitation of liability',
      content:
        'AA Educates provides resources on an “as-is” basis and is not liable for indirect or consequential losses. Organisations are responsible for their own compliance and due diligence.',
    },
    {
      title: '7. Updates to these terms',
      content:
        'We may update these terms periodically. Continued use of the platform after changes constitutes acceptance of the updated terms.',
    },
  ];

  return (
    <>
      <Head>
        <title>Terms of Use | AA Educates</title>
        <meta name="description" content="Review the AA Educates platform terms of use." />
      </Head>
      <main className="min-h-screen bg-gray-50 py-16">
        <div className="container mx-auto px-6 max-w-5xl">
          <article className="bg-white rounded-2xl shadow-lg border border-gray-200 p-10">
            <header className="mb-10">
              <h1 className="text-4xl font-extrabold text-gray-900 mb-3">Terms of Use</h1>
              <p className="text-gray-500">Last updated {new Date().toLocaleDateString()}</p>
            </header>

            <div className="space-y-8">
              {sections.map((section) => (
                <section key={section.title}>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-2">{section.title}</h2>
                  <p className="text-gray-600 leading-relaxed">{section.content}</p>
                </section>
              ))}
            </div>

            <footer className="mt-12 text-sm text-gray-500 border-t border-gray-100 pt-6">
              <p>
                Questions? Contact <Link href="mailto:hello@aaeducates.com" className="text-purple-600 font-medium">hello@aaeducates.com</Link> or read our{' '}
                <Link href="/contact" className="text-purple-600 font-medium">privacy summary</Link>.
              </p>
            </footer>
          </article>
        </div>
      </main>
    </>
  );
};

export default TermsPage;
