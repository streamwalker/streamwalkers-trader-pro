import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, ArrowRight } from "lucide-react";
import { INSTANT_FUNDING } from "@/lib/stripe-products";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const InstantFundingSection = () => {
  const { toast } = useToast();
  const { t } = useTranslation();
  const [loading, setLoading] = useState<string | null>(null);

  const handleCheckout = async (priceId: string, name: string) => {
    setLoading(name);
    try {
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: { price_id: priceId, mode: "payment" },
      });
      if (error) throw error;
      if (data?.url) window.open(data.url, "_blank");
    } catch (err: any) {
      toast({
        title: "Checkout Error",
        description: err.message || "Please sign in to purchase.",
        variant: "destructive",
      });
    } finally {
      setLoading(null);
    }
  };

  const tiers = Object.values(INSTANT_FUNDING);

  return (
    <section id="instant-funding" className="py-24 bg-background">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-warning/10 border border-warning/30 px-4 py-2 rounded-full mb-6">
            <Zap className="w-4 h-4 text-warning" />
            <span className="text-sm font-medium text-warning">{t("instant.badge")}</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-accent bg-clip-text text-transparent">
              {t("instant.titleAccent")}
            </span>{" "}
            {t("instant.titleSuffix")}
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">{t("instant.subtitle")}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tiers.map((tier) => (
            <Card key={tier.name} className="shadow-card hover:shadow-glow transition-all duration-300 border-border">
              <CardHeader className="text-center">
                <div className="mx-auto w-12 h-12 bg-warning/10 rounded-full flex items-center justify-center mb-3">
                  <Zap className="w-6 h-6 text-warning" />
                </div>
                <CardTitle className="text-xl">{tier.accountSize}</CardTitle>
                <div className="mt-2">
                  <span className="text-3xl font-bold">{tier.fee}</span>
                  <span className="text-sm text-muted-foreground ml-1">{t("instant.oneTime")}</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <Zap className="w-3 h-3 text-warning" /> {t("instant.perk1")}
                  </li>
                  <li className="flex items-center gap-2">
                    <Zap className="w-3 h-3 text-warning" /> {t("instant.perk2")}
                  </li>
                  <li className="flex items-center gap-2">
                    <Zap className="w-3 h-3 text-warning" /> {t("instant.perk3")}
                  </li>
                </ul>
                <Button
                  variant="premium"
                  className="w-full group"
                  size="lg"
                  onClick={() => handleCheckout(tier.price_id, tier.name)}
                  disabled={loading === tier.name}
                >
                  {loading === tier.name ? t("pricing.loading") : t("instant.cta")}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform rtl:rotate-180" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InstantFundingSection;
