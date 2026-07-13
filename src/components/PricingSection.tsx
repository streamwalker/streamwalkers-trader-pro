import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Star, ArrowRight, Clock, Percent } from "lucide-react";
import { CHALLENGE_TIERS } from "@/lib/stripe-products";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const PricingSection = () => {
  const { toast } = useToast();
  const { t } = useTranslation();
  const [loading, setLoading] = useState<string | null>(null);

  const handleCheckout = async (priceId: string, tierName: string) => {
    setLoading(tierName);
    try {
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: { price_id: priceId, mode: "payment" },
      });
      if (error) throw error;
      if (data?.url) {
        window.open(data.url, "_blank");
      }
    } catch (err: any) {
      toast({
        title: "Checkout Error",
        description: err.message || "Please sign in to purchase a challenge.",
        variant: "destructive",
      });
    } finally {
      setLoading(null);
    }
  };

  const tiers = Object.values(CHALLENGE_TIERS);

  return (
    <section id="pricing" className="py-24 bg-gradient-hero">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            {t("pricing.titlePrefix")}{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              {t("pricing.titleAccent")}
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">{t("pricing.subtitle")}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {tiers.map((tier) => {
            const isPopular = "popular" in tier && tier.popular;
            return (
              <Card
                key={tier.name}
                className={`relative shadow-card hover:shadow-glow transition-all duration-300 ${
                  isPopular ? "border-primary shadow-primary scale-105" : "border-border"
                }`}
              >
                {isPopular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-primary px-4 py-1 rounded-full text-sm font-medium text-primary-foreground flex items-center gap-1">
                      <Star className="w-4 h-4" />
                      {t("pricing.mostPopular")}
                    </div>
                  </div>
                )}

                <CardHeader className="text-center pb-4">
                  <div className="inline-flex items-center gap-1 bg-profit/10 border border-profit/30 px-3 py-1 rounded-full mx-auto mb-3">
                    <Percent className="w-3 h-3 text-profit" />
                    <span className="text-xs font-bold text-profit">{t("pricing.profitSplit")}</span>
                  </div>

                  <CardTitle className="text-lg font-bold">{tier.name}</CardTitle>

                  <div className="mt-3">
                    <div className="text-3xl font-bold text-profit">{tier.accountSize}</div>
                    <div className="text-xs text-muted-foreground">{t("pricing.fundedAccount")}</div>
                  </div>

                  <div className="mt-3">
                    <span className="text-4xl font-bold">{tier.fee}</span>
                    <span className="text-muted-foreground ml-1 text-sm">{t("pricing.oneTime")}</span>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-muted rounded-md p-2 text-center">
                      <div className="text-muted-foreground">{t("pricing.target")}</div>
                      <div className="font-semibold text-profit">{tier.profitTarget}</div>
                    </div>
                    <div className="bg-muted rounded-md p-2 text-center">
                      <div className="text-muted-foreground">{t("pricing.drawdown")}</div>
                      <div className="font-semibold text-loss">{tier.maxDrawdown}</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-2 bg-primary/5 border border-primary/10 rounded-md p-2">
                    <Clock className="w-3.5 h-3.5 text-primary" />
                    <span className="text-xs font-medium text-primary">
                      {t("pricing.payoutFrequency")}
                    </span>
                  </div>

                  <ul className="space-y-2">
                    {tier.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-profit mt-0.5 flex-shrink-0" />
                        <span className="text-xs">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    variant={isPopular ? "hero" : "outline"}
                    size="lg"
                    className="w-full group"
                    onClick={() => handleCheckout(tier.price_id, tier.name)}
                    disabled={loading === tier.name}
                  >
                    {loading === tier.name ? t("pricing.loading") : t("pricing.getFunded")}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform rtl:rotate-180" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-16 text-center">
          <p className="text-muted-foreground mb-4">{t("pricing.guarantee")}</p>
          <div className="flex justify-center items-center gap-8 text-sm text-muted-foreground flex-wrap">
            <span>{t("pricing.perk1")}</span>
            <span>{t("pricing.perk2")}</span>
            <span>{t("pricing.perk3")}</span>
            <span>{t("pricing.perk4")}</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
