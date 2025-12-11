import Head from 'next/head';
import Link from 'next/link';
import type { NextPage } from 'next';

const TermsPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Terms of Use & Privacy Policy | AA Educates</title>
        <meta name="description" content="AA Educates Platform Terms of Use & Privacy Policy" />
      </Head>
      <main className="min-h-screen bg-gray-50 py-16">
        <div className="container mx-auto px-6 max-w-5xl">
          <article className="bg-white rounded-2xl shadow-lg border border-gray-200 p-10">
            <header className="mb-10">
              <h1 className="text-4xl font-extrabold text-gray-900 mb-3">
                AA Educates – Platform Terms of Use & Privacy Policy
              </h1>
              <p className="text-gray-500">Effective Date: [Insert]</p>
            </header>

            <div className="space-y-10 prose prose-lg max-w-none">
              {/* ACCEPTANCE */}
              <section>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">ACCEPTANCE</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  By clicking "Accept" you confirm that:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li>You have read, understood and agree to be bound by the Terms of Use and the Privacy Policy</li>
                  <li>You consent to the processing and sharing of your personal data as described</li>
                  <li>You agree to comply with all Platform rules and safeguarding requirements</li>
                </ul>
                <p className="text-gray-700 leading-relaxed mt-4">
                  If you do not agree, click "Decline" and do not use the Platform.
                </p>
              </section>

              {/* 1. ABOUT US */}
              <section>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">1. ABOUT US</h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  The AA Educates digital platform ("the Platform") is operated by AA Educates Ltd ("we", "us", "our").
                </p>
                <p className="text-gray-700 leading-relaxed mb-3">
                  We provide online programmes, career readiness resources, mentoring, coaching sessions, and project-based learning for students aged 14+, as well as tools for teachers, schools, parents/carers, mentors, coaches, and corporate partners.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  We are the Data Controller for personal data processed through the Platform under the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018.
                </p>
              </section>

              {/* 2. WHO MAY USE THE PLATFORM */}
              <section>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">2. WHO MAY USE THE PLATFORM</h2>
                <p className="text-gray-700 leading-relaxed mb-3">You may use the Platform if:</p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li>You are 14 years or older, or</li>
                  <li>You are a parent/carer, teacher, corporate partner, mentor, coach, or administrator authorised to access and manage accounts; and</li>
                  <li>You agree to these Terms.</li>
                </ul>
                <p className="text-gray-700 leading-relaxed mt-4">
                  Parents/carers and schools may access student data where access is lawfully authorised.
                </p>
                <p className="text-gray-700 leading-relaxed mt-3">
                  You must only create an account for yourself unless you are authorised to create an account on behalf of a student or employee.
                </p>
              </section>

              {/* 3. YOUR ACCOUNT */}
              <section>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">3. YOUR ACCOUNT</h2>
                <p className="text-gray-700 leading-relaxed mb-3">You must:</p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li>Keep your login details safe;</li>
                  <li>Use accurate and up-to-date information;</li>
                  <li>Not share your login with others;</li>
                  <li>Notify us immediately of unauthorised use or security concerns.</li>
                </ul>
                <p className="text-gray-700 leading-relaxed mt-4">
                  We may suspend or terminate accounts where necessary for safeguarding, misuse, legal reasons, or breach of these Terms.
                </p>
              </section>

              {/* 4. ACCEPTABLE USE */}
              <section>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">4. ACCEPTABLE USE</h2>
                <p className="text-gray-700 leading-relaxed mb-3">You must not:</p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li>Upload unlawful, harmful, discriminatory, infringing, or inappropriate content;</li>
                  <li>Harass, bully, or misuse the Platform or its communication features;</li>
                  <li>Attempt to circumvent security controls;</li>
                  <li>Access another user's data without permission;</li>
                  <li>Use the Platform for commercial, political, or unrelated purposes.</li>
                </ul>
                <p className="text-gray-700 leading-relaxed mt-4">
                  We may remove content, restrict accounts, or notify relevant authorities if safeguarding or legal concerns arise.
                </p>
              </section>

              {/* 5. WHAT PERSONAL DATA WE COLLECT */}
              <section>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">5. WHAT PERSONAL DATA WE COLLECT</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Depending on your role and activity, we collect:
                </p>

                <div className="ml-6 space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">5.1 Account & Identification Data</h3>
                    <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                      <li>Name, email, phone number</li>
                      <li>Age/year group (students)</li>
                      <li>School/organisation details</li>
                      <li>Parent/carer or school contact information</li>
                      <li>Mentor/coach/corporate partner professional details</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">5.2 Profile & Portfolio Data</h3>
                    <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                      <li>CVs, work history, personal statements</li>
                      <li>Skills, badges, certificates</li>
                      <li>Portfolios, uploaded documents, achievements</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">5.3 Participation Data</h3>
                    <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                      <li>Course progress, modules completed</li>
                      <li>Project submissions, assessments, feedback</li>
                      <li>Session bookings (mentoring/coaching)</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">5.4 Technical Data</h3>
                    <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                      <li>Device/browser details</li>
                      <li>Login records, usage analytics</li>
                      <li>IP address and security logs</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">5.5 Communications</h3>
                    <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                      <li>Messages exchanged through the Platform</li>
                      <li>Feedback forms, mentoring reflections</li>
                      <li>Support queries and safeguarding notifications</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* 6. HOW WE USE YOUR PERSONAL DATA */}
              <section>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">6. HOW WE USE YOUR PERSONAL DATA</h2>
                <p className="text-gray-700 leading-relaxed mb-3">We process data to:</p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li>Provide access to the Platform and your account</li>
                  <li>Deliver learning modules, coaching, mentoring and project experiences</li>
                  <li>Enable CV building, portfolio development and student showcasing</li>
                  <li>Connect students with mentors, coaches or corporate programmes</li>
                  <li>Support teachers, schools and parents in tracking progress</li>
                  <li>Issue certificates, badges, reporting and analytics</li>
                  <li>Maintain safeguarding, safety, fraud prevention and compliance</li>
                  <li>Fulfil regulatory and legal obligations</li>
                </ul>
                <p className="text-gray-700 leading-relaxed mt-4 font-semibold">
                  We never sell personal data.
                </p>
                <p className="text-gray-700 leading-relaxed mt-3">
                  Processing is based on contract, legitimate interests, legal obligations, or consent where required.
                </p>
              </section>

              {/* 7. HOW AND WITH WHOM WE SHARE DATA */}
              <section>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">7. HOW AND WITH WHOM WE SHARE DATA</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We only share data where necessary for the purposes above:
                </p>

                <div className="ml-6 space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">7.1 Teachers & Schools</h3>
                    <p className="text-gray-700 leading-relaxed mb-2">
                      Where an account is linked to a school, authorised staff may access:
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                      <li>Student progress</li>
                      <li>Project submissions</li>
                      <li>Skills data, attendance and certificates</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">7.2 Parents/Carers</h3>
                    <p className="text-gray-700 leading-relaxed">
                      Where authorised, parents/carers may access student progress and documentation.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">7.3 Mentors & Coaches</h3>
                    <p className="text-gray-700 leading-relaxed">
                      Mentors/coaches may view only the information required to deliver mentoring or coaching sessions.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">7.4 Corporate Partners</h3>
                    <p className="text-gray-700 leading-relaxed mb-2">
                      Corporate partners may access:
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                      <li>Project submissions</li>
                      <li>Student CVs/portfolios only where the student has submitted work to the partner or consented to share their profile for opportunities.</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">7.5 Service Providers</h3>
                    <p className="text-gray-700 leading-relaxed">
                      We use third-party providers for hosting, authentication, analytics, payments, communications, and support. They must comply with UK GDPR and act only on our instructions.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">7.6 Legal, Safeguarding & Compliance</h3>
                    <p className="text-gray-700 leading-relaxed mb-2">
                      We may disclose information where required to:
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                      <li>Safeguarding authorities</li>
                      <li>Law enforcement</li>
                      <li>Regulators</li>
                      <li>Courts or legal processes</li>
                    </ul>
                    <p className="text-gray-700 leading-relaxed mt-3">
                      We will limit disclosures to what is strictly necessary.
                    </p>
                  </div>
                </div>
              </section>

              {/* 8. INTERNATIONAL TRANSFERS */}
              <section>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">8. INTERNATIONAL TRANSFERS</h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  Where data is transferred outside the UK (e.g., secure cloud hosting), we use:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li>UK Addendum to EU Standard Contractual Clauses</li>
                  <li>International Data Transfer Agreements (IDTAs)</li>
                  <li>Adequacy regulations, where applicable</li>
                </ul>
              </section>

              {/* 9. RETENTION */}
              <section>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">9. RETENTION</h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  We retain data only for as long as necessary for:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li>Creating and maintaining accounts</li>
                  <li>Delivering the educational service</li>
                  <li>Legal, safeguarding and reporting requirements</li>
                </ul>
                <p className="text-gray-700 leading-relaxed mt-4">
                  You may request deletion, unless we must retain the data under law.
                </p>
              </section>

              {/* 10. YOUR RIGHTS UNDER UK GDPR */}
              <section>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">10. YOUR RIGHTS UNDER UK GDPR</h2>
                <p className="text-gray-700 leading-relaxed mb-3">You have the rights to:</p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li>Access your data</li>
                  <li>Correct inaccurate information</li>
                  <li>Request deletion ("right to be forgotten")</li>
                  <li>Object to processing</li>
                  <li>Restrict processing</li>
                  <li>Data portability</li>
                  <li>Withdraw consent (where processing is based on consent)</li>
                  <li>Complain to the Information Commissioner's Office (ICO)</li>
                </ul>
                <p className="text-gray-700 leading-relaxed mt-4">
                  Requests may be submitted to: [Insert contact email]
                </p>
              </section>

              {/* 11. SAFEGUARDING */}
              <section>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">11. SAFEGUARDING</h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  We take safeguarding seriously.
                </p>
                <p className="text-gray-700 leading-relaxed mb-3">
                  Any concerns raised through the Platform may be shared with trained staff, schools, parents/carers or relevant authorities.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Where legally required, safeguarding overrides data protection objections.
                </p>
              </section>

              {/* 12. INTELLECTUAL PROPERTY */}
              <section>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">12. INTELLECTUAL PROPERTY</h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  All Platform content (excluding user-uploaded content) is owned by us.
                </p>
                <p className="text-gray-700 leading-relaxed mb-3">
                  You may not copy, distribute, or adapt materials without written permission.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  You retain ownership of your uploaded content (CVs, portfolios, submissions) but grant us a licence to store, display, and use it for Platform purposes.
                </p>
              </section>

              {/* 13. LIABILITY */}
              <section>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">13. LIABILITY</h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  We provide the Platform with reasonable skill and care but do not guarantee uninterrupted service.
                </p>
                <p className="text-gray-700 leading-relaxed mb-3">
                  To the extent permitted by law, we are not liable for:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li>Losses not caused by our breach</li>
                  <li>Losses beyond what is reasonably foreseeable</li>
                  <li>Harm caused by user-generated content</li>
                  <li>Technical issues beyond our control</li>
                </ul>
                <p className="text-gray-700 leading-relaxed mt-4">
                  Nothing excludes liability for death, personal injury, fraud, or where unlawful to do so.
                </p>
              </section>

              {/* 14. TERMINATION */}
              <section>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">14. TERMINATION</h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  We may suspend or terminate accounts for:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li>Breach of these Terms</li>
                  <li>Safeguarding concerns</li>
                  <li>Misuse or unlawful behaviour</li>
                  <li>False information</li>
                  <li>Failure to comply with school/mentor obligations</li>
                  <li>Legal or regulatory requirements</li>
                </ul>
                <p className="text-gray-700 leading-relaxed mt-4">
                  Users may delete their accounts at any time.
                </p>
              </section>

              {/* 15. CHANGES TO THESE TERMS */}
              <section>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">15. CHANGES TO THESE TERMS</h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  We may update these Terms and this Privacy Policy from time to time.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  We will notify users of material changes. Continued use of the Platform constitutes acceptance of updated terms.
                </p>
              </section>

              {/* 16. GOVERNING LAW */}
              <section>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">16. GOVERNING LAW</h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  These Terms are governed by the law of England and Wales.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Courts of England and Wales have exclusive jurisdiction, except where mandatory local law provides otherwise.
                </p>
              </section>

              {/* 17. CONTACT US */}
              <section>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">17. CONTACT US</h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  For privacy or legal questions:
                </p>
                <p className="text-gray-700 leading-relaxed">
                  [Insert official email]
                </p>
                <p className="text-gray-700 leading-relaxed">
                  [Insert postal address]
                </p>
              </section>
            </div>

            <footer className="mt-12 text-sm text-gray-500 border-t border-gray-100 pt-6">
              <p>
                Questions? Contact <Link href="mailto:hello@aaeducates.com" className="text-purple-600 font-medium hover:underline">hello@aaeducates.com</Link> or read our{' '}
                <Link href="/contact" className="text-purple-600 font-medium hover:underline">contact page</Link>.
              </p>
            </footer>
          </article>
        </div>
      </main>
    </>
  );
};

export default TermsPage;
