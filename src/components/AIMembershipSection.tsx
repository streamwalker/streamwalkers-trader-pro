import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, Brain, ArrowRight } from "lucide-react";
import { AI_MEMBERSHIP } from "@/lib/stripe-products";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

const AIMembershipSection = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: { price_id: AI_MEMBERSHIP.price_id, mode: "subscription" },
      });
      if (error) throw error;
      if (data?.url) window.open(data.url, "_blank");
    } catch (err: any) {
      toast({
        title: "Checkout Error",
        description: err.message || "Please sign in first.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-24 bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="shadow-glow border-primary/20 overflow-hidden">
          <CardContent className="p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 px-3 py-1 rounded-full mb-4">
                  <Brain className="w-4 h-4 text-primary" />
                  <span className="text-xs font-medium text-primary">AI-Powered</span>
                </div>
                <h2 className="text-3xl font-bold mb-3">
                  TraderPro AI <span className="bg-gradient-primary bg-clip-text text-transparent">Membership</span>
                </h2>
                <p className="text-muted-foreground mb-6">
                  Supercharge your trading with AI-powered analysis, coaching, and market intelligence.
                  Available as a standalone subscription or included with select challenge tiers.
                </p>
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-4xl font-bold">$39</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <Button variant="hero" size="lg" className="group" onClick={handleCheckout} disabled={loading}>
                  {loading ? "Loading..." : "Subscribe Now"}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
              <div>
                <ul className="space-y-3">
                  {AI_MEMBERSHIP.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-profit flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default AIMembershipSection;
