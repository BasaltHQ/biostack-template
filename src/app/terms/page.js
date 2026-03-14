import React from "react";

export default function TermsAndConditions() {
  return (
    <main className="flex-grow pt-32 pb-24 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-slate-900">Terms and Conditions</h1>
        <p className="text-slate-600 mb-4">Last updated: February 2026</p>

        <div className="prose prose-slate max-w-none space-y-6 text-slate-700">
          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-3">1. Introduction</h2>
            <p>
              Welcome to BioStack Limitless. These Terms and Conditions govern your use of our website and services. By
              accessing or using our Service, you agree to be bound by these Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-3">2. Medical Disclaimer</h2>
            <p>
              The information provided on this website is for educational purposes only and is not intended as medical
              advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health
              provider with any questions you may have regarding a medical condition.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-3">3. Purchases</h2>
            <p>
              If you wish to purchase any product or service made available through the Service, you may be asked to
              supply certain information relevant to your Purchase including, without limitation, your credit card
              number, the expiration date of your credit card, your billing address, and your shipping information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-3">4. Limitation of Liability</h2>
            <p>
              In no event shall BioStack Limitless, nor its directors, employees, partners, agents, suppliers, or
              affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including
              without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your
              access to or use of or inability to access or use the Service.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
