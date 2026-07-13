import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { CheckCircle, XCircle, AlertTriangle, DollarSign, TrendingUp, Scale } from "lucide-react";

const TradingRules = () => {
  const { hash } = useLocation();
  const { t } = useTranslation();

  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.replace("#", ""));
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [hash]);

  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-16">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t("pages.tradingRules.title")}</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t("pages.tradingRules.subtitle")}
          </p>
          <p className="text-xs text-muted-foreground italic mt-4 max-w-2xl mx-auto">
            {t("legal.englishNotice")}
          </p>
        </div>


        {/* Evaluation Process */}
        <section id="evaluation" className="scroll-mt-24 space-y-6">
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <TrendingUp className="w-6 h-6 text-primary" />
            Evaluation Process
          </h2>
          <div className="bg-card border border-border rounded-xl p-6 space-y-4">
            <p className="text-muted-foreground">Our evaluation is a 2-step process designed to identify consistently profitable traders:</p>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="font-semibold">Step 1: Challenge</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-primary mt-0.5 shrink-0" /> Reach your profit target (6% of account size)</li>
                  <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-primary mt-0.5 shrink-0" /> Trade for a minimum of 5 trading days</li>
                  <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-primary mt-0.5 shrink-0" /> Stay within daily loss limit (3%)</li>
                  <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-primary mt-0.5 shrink-0" /> Stay within max trailing drawdown (6%)</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h3 className="font-semibold">Step 2: Verification</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-primary mt-0.5 shrink-0" /> Reach verification profit target (4%)</li>
                  <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-primary mt-0.5 shrink-0" /> Trade for a minimum of 5 trading days</li>
                  <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-primary mt-0.5 shrink-0" /> Same risk management rules apply</li>
                  <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-primary mt-0.5 shrink-0" /> Demonstrate consistent, disciplined trading</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Trading Rules */}
        <section id="rules" className="scroll-mt-24 space-y-6">
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-primary" />
            Trading Rules
          </h2>
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 pr-4 font-semibold">Rule</th>
                    <th className="text-left py-3 pr-4 font-semibold">Challenge</th>
                    <th className="text-left py-3 pr-4 font-semibold">Verification</th>
                    <th className="text-left py-3 font-semibold">Funded</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  {[
                    ["Profit Target", "6%", "4%", "None"],
                    ["Daily Loss Limit", "3%", "3%", "3%"],
                    ["Max Trailing Drawdown", "6%", "6%", "6%"],
                    ["Minimum Trading Days", "5 days", "5 days", "None"],
                    ["Max Time Limit", "Unlimited", "Unlimited", "Unlimited"],
                    ["Weekend Holding", "Allowed", "Allowed", "Allowed"],
                    ["News Trading", "Allowed", "Allowed", "Allowed"],
                  ].map(([rule, c, v, f]) => (
                    <tr key={rule} className="border-b border-border/50">
                      <td className="py-3 pr-4 font-medium text-foreground">{rule}</td>
                      <td className="py-3 pr-4">{c}</td>
                      <td className="py-3 pr-4">{v}</td>
                      <td className="py-3">{f}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="bg-card border border-border rounded-xl p-6 space-y-3">
            <h3 className="font-semibold">Prohibited Activities</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2"><XCircle className="w-4 h-4 text-destructive mt-0.5 shrink-0" /> Copy trading or signal mirroring from other accounts</li>
              <li className="flex items-start gap-2"><XCircle className="w-4 h-4 text-destructive mt-0.5 shrink-0" /> Exploiting platform latency or data-feed errors</li>
              <li className="flex items-start gap-2"><XCircle className="w-4 h-4 text-destructive mt-0.5 shrink-0" /> Hedging between multiple Streamwalkers accounts</li>
              <li className="flex items-start gap-2"><XCircle className="w-4 h-4 text-destructive mt-0.5 shrink-0" /> Using third-party EAs or bots without approval</li>
            </ul>
          </div>
          <div className="bg-card border border-border rounded-xl p-6 space-y-3">
            <h3 className="font-semibold">Allowed Instruments</h3>
            <p className="text-sm text-muted-foreground">
              Futures products listed on <span className="text-foreground font-medium">CME, COMEX, NYMEX & CBOT</span> exchanges. This includes ES, NQ, YM, RTY, CL, GC, SI, ZB, ZN, 6E, 6J, and more. Spot currencies, CFDs, stocks, options, and cryptocurrencies are not available.
            </p>
          </div>
        </section>

        {/* Funded Accounts */}
        <section id="funded-accounts" className="scroll-mt-24 space-y-6">
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <Scale className="w-6 h-6 text-primary" />
            Funded Accounts
          </h2>
          <div className="bg-card border border-border rounded-xl p-6 space-y-4">
            <p className="text-muted-foreground">Once you pass both evaluation steps, you receive a Performance Account (PA) with the following benefits:</p>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                "Same account size as your evaluation",
                "Up to 90% profit split from day one",
                "No time limits — trade at your own pace",
                "Scale up to $400K (and beyond with the Scale Plan)",
                "Access to the Trader Intelligence Engine",
                "Dedicated account manager support",
              ].map((item) => (
                <div key={item} className="flex items-start gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <span className="text-muted-foreground">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Profit Splits */}
        <section id="profit-splits" className="scroll-mt-24 space-y-6">
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <DollarSign className="w-6 h-6 text-primary" />
            Profit Splits
          </h2>
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 pr-4 font-semibold">Account Tier</th>
                    <th className="text-left py-3 pr-4 font-semibold">Standard Split</th>
                    <th className="text-left py-3 font-semibold">With AI Membership</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  {[
                    ["$25K Account", "80%", "90%"],
                    ["$50K Account", "80%", "90%"],
                    ["$100K Account", "80%", "90%"],
                    ["$200K Account", "80%", "90%"],
                    ["Scaled Accounts", "85%", "90%"],
                  ].map(([tier, standard, ai]) => (
                    <tr key={tier} className="border-b border-border/50">
                      <td className="py-3 pr-4 font-medium text-foreground">{tier}</td>
                      <td className="py-3 pr-4">{standard}</td>
                      <td className="py-3">
                        <span className="text-primary font-semibold">{ai}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Withdrawals */}
        <section id="withdrawals" className="scroll-mt-24 space-y-6">
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <DollarSign className="w-6 h-6 text-primary" />
            Withdrawals & Payouts
          </h2>
          <div className="bg-card border border-border rounded-xl p-6 space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="font-semibold">Payout Schedule</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-primary mt-0.5 shrink-0" /> Request a payout every 7 days</li>
                  <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-primary mt-0.5 shrink-0" /> First payout available after 7 trading days</li>
                  <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-primary mt-0.5 shrink-0" /> Minimum withdrawal: $100</li>
                  <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-primary mt-0.5 shrink-0" /> No maximum withdrawal limit</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h3 className="font-semibold">Payment Methods</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-primary mt-0.5 shrink-0" /> Bank wire transfer</li>
                  <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-primary mt-0.5 shrink-0" /> PayPal</li>
                  <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-primary mt-0.5 shrink-0" /> Cryptocurrency (BTC, USDT)</li>
                  <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-primary mt-0.5 shrink-0" /> Processing time: 1–3 business days</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default TradingRules;
