import Footer from "@/components/Footer";

const TermsOfService = () => {
  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h1 className="text-4xl font-bold mb-2">Terms of Service</h1>
        <p className="text-muted-foreground mb-12">Last updated: March 15, 2026</p>

        <div className="prose prose-invert max-w-none space-y-8 text-muted-foreground">
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">1. Acceptance of Terms</h2>
            <p>By accessing or using the Streamwalkers Trader Pro platform, website, and services (collectively, "Services"), you agree to be bound by these Terms of Service. If you do not agree, do not use our Services.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">2. Account Registration</h2>
            <p>You must be at least 18 years old to create an account. You are responsible for maintaining the confidentiality of your login credentials and for all activity under your account. You agree to provide accurate, current information and to update it as necessary.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">3. Evaluation & Funded Accounts</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Challenge fees are non-refundable once you place your first trade in the evaluation.</li>
              <li>Evaluation accounts use simulated trading environments that mirror real market conditions, including commissions.</li>
              <li>Passing the evaluation does not guarantee a funded account. Final approval is at Streamwalkers's discretion.</li>
              <li>Funded (Performance) accounts may be simulated or live accounts. All trades should be considered hypothetical unless otherwise stated.</li>
              <li>Streamwalkers reserves the right to terminate any account that violates trading rules or engages in prohibited activities.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">4. Fees & Payments</h2>
            <p>All fees are listed in USD and are charged via Stripe. Recurring subscriptions (AI Membership) renew automatically until canceled. You may cancel at any time through your account settings. No partial refunds are provided for the current billing period.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">5. Profit Splits & Payouts</h2>
            <p>Profit splits are calculated based on the net profit in your funded account after applicable fees. Payouts are processed within 1–3 business days after approval. Streamwalkers reserves the right to audit any account before processing payouts. Fraudulent or rule-violating accounts forfeit all pending payouts.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">6. Prohibited Conduct</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Exploiting platform errors, latency, or data-feed issues</li>
              <li>Operating multiple accounts to circumvent rules</li>
              <li>Copy trading, signal mirroring, or account management by third parties</li>
              <li>Any form of market manipulation or fraudulent activity</li>
              <li>Sharing your account credentials with others</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">7. Intellectual Property</h2>
            <p>All content, branding, software, and proprietary technology (including the Trader Intelligence Engine) are owned by Streamwalkers Corp. You may not copy, modify, distribute, or reverse-engineer any part of our Services without written permission.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">8. Disclaimers</h2>
            <p>Our Services are provided "as is" without warranties of any kind. Trading involves substantial risk of loss. Past performance — whether real or simulated — does not guarantee future results. Streamwalkers is not a broker-dealer, investment advisor, or financial institution. We do not provide investment advice.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">9. Limitation of Liability</h2>
            <p>To the maximum extent permitted by law, Streamwalkers Corp. shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the Services, including but not limited to loss of profits, data, or trading opportunities.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">10. Governing Law</h2>
            <p>These Terms are governed by and construed in accordance with the laws of the State of New York, without regard to conflict of law principles. Any disputes shall be resolved in the courts located in New York County, New York.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">11. Changes to Terms</h2>
            <p>We may update these Terms at any time. Material changes will be communicated via email or a prominent notice on our website. Continued use of the Services after changes constitutes acceptance of the updated Terms.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">12. Contact</h2>
            <p className="text-foreground">
              Email: <a href="mailto:legal@equiforgetraderpro.com" className="text-primary hover:underline">legal@equiforgetraderpro.com</a><br />
              Streamwalkers Corp., New York, NY
            </p>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TermsOfService;
