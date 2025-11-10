import Head from 'next/head';
import type { NextPage } from 'next';
import { useState } from 'react';

const ContactPage: NextPage = () => {
  const [formState, setFormState] = useState({ name: '', email: '', organisation: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <>
      <Head>
        <title>Contact | AA Educates</title>
        <meta name="description" content="Get in touch with the AA Educates team to explore partnerships and support." />
      </Head>
      <main className="min-h-screen bg-gray-50 py-16">
        <div className="container mx-auto px-6 max-w-4xl">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4 text-center">Let’s start a conversation</h1>
          <p className="text-gray-600 text-center max-w-2xl mx-auto mb-12">
            Share a few details and our team will reach out to explore how AA Educates can collaborate with you.
          </p>

          <div className="bg-white rounded-2xl shadow-lg border border-purple-100 p-8 md:p-10">
            {submitted ? (
              <div className="text-center py-12">
                <h2 className="text-2xl font-semibold text-purple-600 mb-2">Thank you for reaching out!</h2>
                <p className="text-gray-600">
                  A member of the team will get back to you shortly. In the meantime, explore our <a className="text-purple-600 underline" href="/about">mission</a> and
                  <a className="text-purple-600 underline ml-1" href="/terms">policies</a>.
                </p>
              </div>
            ) : (
              <form className="grid gap-6" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full name
                  </label>
                  <input
                    id="name"
                    name="name"
                    value={formState.name}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Alex Taylor"
                  />
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formState.email}
                      onChange={handleChange}
                      required
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="you@example.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="organisation" className="block text-sm font-medium text-gray-700 mb-2">
                      Organisation (optional)
                    </label>
                    <input
                      id="organisation"
                      name="organisation"
                      value={formState.organisation}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Company, school, or community group"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    How can we help?
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formState.message}
                    onChange={handleChange}
                    rows={5}
                    required
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Tell us more about your goals"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full md:w-auto inline-flex items-center justify-center px-6 py-3 rounded-xl bg-purple-600 text-white font-semibold hover:bg-purple-700 transition"
                >
                  Submit enquiry
                </button>
              </form>
            )}
          </div>
        </div>
      </main>
    </>
  );
};

export default ContactPage;
