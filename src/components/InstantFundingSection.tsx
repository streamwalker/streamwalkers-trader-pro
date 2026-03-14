import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, ArrowRight } from "lucide-react";
import { INSTANT_FUNDING } from "@/lib/stripe-products";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

const InstantFundingSection = () => {
  const { toast } = useToast();
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
            <span className="text-sm font-medium text-warning">Skip the Evaluation</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-accent bg-clip-text text-transparent">Instant Funding</span> Accounts
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Start trading immediately. No evaluation required. Get funded today.
          </p>
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
                  <span className="text-sm text-muted-foreground ml-1">one-time</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <Zap className="w-3 h-3 text-warning" /> No evaluation — trade immediately
                  </li>
                  <li className="flex items-center gap-2">
                    <Zap className="w-3 h-3 text-warning" /> All trading tools included
                  </li>
                  <li className="flex items-center gap-2">
                    <Zap className="w-3 h-3 text-warning" /> 80% profit split
                  </li>
                </ul>
                <Button 
                  variant="premium" 
                  className="w-full group" 
                  size="lg"
                  onClick={() => handleCheckout(tier.price_id, tier.name)}
                  disabled={loading === tier.name}
                >
                  {loading === tier.name ? "Loading..." : "Get Instant Funding"}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
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
