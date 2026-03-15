import Hero from "@/components/Hero";
import TrustSection from "@/components/TrustSection";
import HowItWorks from "@/components/HowItWorks";
import PricingSection from "@/components/PricingSection";
import InstantFundingSection from "@/components/InstantFundingSection";
import TraderLeaderboard from "@/components/TraderLeaderboard";
import ScalePlan from "@/components/ScalePlan";
import AIMembershipSection from "@/components/AIMembershipSection";
import TradingTools from "@/components/TradingTools";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="bg-background">
      <Hero />
      <TrustSection />
      <PricingSection />
      <HowItWorks />
      <InstantFundingSection />
      <TraderLeaderboard />
      <ScalePlan />
      <AIMembershipSection />
      <TradingTools />
      <Footer />
      
      {/* Risk Disclosure Section */}
      <section id="risk-disclosure" className="bg-muted/50 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="space-y-8 text-xs text-muted-foreground">
            <div>
              <h3 className="font-semibold text-sm text-foreground mb-3">RISK DISCLOSURE:</h3>
              <p className="leading-relaxed">
                This is not an investment opportunity. You do not deposit any funds for investment. We do not ask for any funds for investment. At no time do you risk your own capital. There are no promises of rewards or returns.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-sm text-foreground mb-3">HYPOTHETICAL PERFORMANCE DISCLOSURE:</h3>
              <p className="leading-relaxed">
                Hypothetical performance results have many inherent limitations, some of which are described below. No representation is being made that any account will or is likely to achieve profits or losses similar to those shown. In fact, there are frequently sharp differences between hypothetical performance results and the actual results subsequently achieved by any particular trading program. One of the limitations of hypothetical performance results is that they are generally prepared with the benefit of hindsight. In addition, hypothetical trading does not involve financial risk, and no hypothetical trading record can completely account for the impact of financial risk of actual trading.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-sm text-foreground mb-3">AVAILABLE INSTRUMENTS:</h3>
              <p className="leading-relaxed">
                Equiforge ™️ Trader Pro customers are allowed to only trade Futures products, listed on the following exchanges: CME, COMEX, NYMEX & CBOT. Trading of Spot Currencies, CFD's Stocks, Options, and Cryptocurrencies are not permitted or available in our programs vendors or platforms.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-sm text-foreground mb-3">EVALUATION DISCLAIMER:</h3>
              <p className="leading-relaxed">
                The customer pass rate of the evaluation program was 43.13% between January 1, 2023 – Sept 1, 2023, who traded at least one evaluation and obtained a PA Account during this time period. The Evaluation and PA are meant to be as close to a realistic simulation of trading under actual market conditions, including commissions, to mimic real market conditions, and the evaluation is difficult to pass even for experienced traders.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-sm text-foreground mb-3">CUSTOMER COMPENSATION DISCLOSURE:</h3>
              <p className="leading-relaxed">
                All trades presented for compensation to customers should be considered hypothetical and should not be expected to be replicated in a live trading account. PA Accounts may represent simulated accounts or live or copied accounts. Testimonials and payouts appearing on this website may not be representative of other clients or customers and are not a guarantee of future performance or success.
              </p>
            </div>
            <div className="border-t border-border pt-8 text-center">
              <p className="text-xs text-muted-foreground">
                © 2021-2031, Equiforge Corp. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Index;
