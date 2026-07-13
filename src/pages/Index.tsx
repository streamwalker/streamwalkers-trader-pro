import { useTranslation } from "react-i18next";
import Hero from "@/components/Hero";
import TrustSection from "@/components/TrustSection";
import HowItWorks from "@/components/HowItWorks";
import EducationSpotlight from "@/components/EducationSpotlight";
import PricingSection from "@/components/PricingSection";
import InstantFundingSection from "@/components/InstantFundingSection";
import AIMembershipSection from "@/components/AIMembershipSection";
import TraderLeaderboard from "@/components/TraderLeaderboard";

const Index = () => {
  const { t } = useTranslation();

  const disclosures: Array<{ label: string; body: string }> = [
    { label: t("risk.riskLabel"), body: t("risk.riskBody") },
    { label: t("risk.hypoLabel"), body: t("risk.hypoBody") },
    { label: t("risk.instrumentsLabel"), body: t("risk.instrumentsBody") },
    { label: t("risk.evalLabel"), body: t("risk.evalBody") },
    { label: t("risk.compLabel"), body: t("risk.compBody") },
  ];

  return (
    <div className="bg-background">
      <Hero />
      <TrustSection />
      <HowItWorks />
      <EducationSpotlight />
      <PricingSection />
      <InstantFundingSection />
      <AIMembershipSection />
      <TraderLeaderboard />

      <section id="risk-disclosure" className="bg-muted/50 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="space-y-8 text-xs text-muted-foreground">
            {disclosures.map((d) => (
              <div key={d.label}>
                <h3 className="font-semibold text-sm text-foreground mb-3">{d.label}</h3>
                <p className="leading-relaxed">{d.body}</p>
              </div>
            ))}
            <div className="border-t border-border pt-8 text-center">
              <p className="text-xs text-muted-foreground">{t("risk.copyright")}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
