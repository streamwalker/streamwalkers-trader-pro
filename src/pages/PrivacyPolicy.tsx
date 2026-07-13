import Footer from "@/components/Footer";

const PrivacyPolicy = () => {
  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-muted-foreground mb-12">Last updated: March 15, 2026</p>

        <div className="prose prose-invert max-w-none space-y-8 text-muted-foreground">
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">1. Information We Collect</h2>
            <p>We collect information you provide directly when you create an account, purchase an evaluation, or contact support. This includes:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Name, email address, and phone number</li>
              <li>Billing and payment information (processed securely via Stripe)</li>
              <li>Trading performance data from your evaluation and funded accounts</li>
              <li>Communications with our support team</li>
              <li>Device and browser information collected automatically</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">2. How We Use Your Information</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>To provide, maintain, and improve our evaluation and trading services</li>
              <li>To process transactions and send related billing information</li>
              <li>To analyze trading patterns through our Trader Intelligence Engine</li>
              <li>To send you technical notices, updates, and support messages</li>
              <li>To detect, prevent, and address fraud or security issues</li>
              <li>To comply with legal obligations and enforce our terms</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">3. Cookies & Tracking</h2>
            <p>We use cookies and similar technologies to maintain your session, remember preferences, and analyze site usage. You can control cookies through your browser settings, though some features may not function properly without them.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">4. Third-Party Services</h2>
            <p>We share data with trusted third parties only as necessary to provide our services:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li><span className="text-foreground font-medium">Stripe</span> — Payment processing</li>
              <li><span className="text-foreground font-medium">Supabase</span> — Database and authentication</li>
              <li><span className="text-foreground font-medium">Trading platforms</span> — NinjaTrader, Tradovate (for order execution)</li>
              <li><span className="text-foreground font-medium">Analytics providers</span> — To improve our services</li>
            </ul>
            <p>We do not sell your personal information to any third party.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">5. Data Security</h2>
            <p>We implement industry-standard security measures including encryption in transit (TLS), encrypted storage, and access controls. While no system is 100% secure, we take reasonable precautions to protect your data.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">6. Your Rights</h2>
            <p>Depending on your jurisdiction, you may have the right to:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Access and receive a copy of your personal data</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your data (subject to legal requirements)</li>
              <li>Object to or restrict certain processing activities</li>
              <li>Data portability — receive your data in a structured format</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">7. Data Retention</h2>
            <p>We retain your personal information for as long as your account is active or as needed to provide services, comply with legal obligations, resolve disputes, and enforce our agreements.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">8. Contact Us</h2>
            <p>If you have questions about this Privacy Policy or wish to exercise your rights, contact us at:</p>
            <p className="text-foreground">
              Email: <a href="mailto:privacy@streamwalkers.com" className="text-primary hover:underline">privacy@streamwalkers.com</a><br />
              Streamwalkers Corp., New York, NY
            </p>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
