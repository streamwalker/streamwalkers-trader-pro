import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Star, Zap } from "lucide-react";

const PricingSection = () => {
  const plans = [
    {
      name: "Starter",
      amount: "$10K",
      price: "$147",
      period: "one-time",
      description: "Perfect for new traders",
      features: [
        "NinjaTrader Templates",
        "Basic Order Flow Tools",
        "Daily Loss Limit: $500",
        "Profit Target: $800",
        "Email Support",
        "Educational Videos"
      ],
      popular: false,
      variant: "outline" as const
    },
    {
      name: "Professional",
      amount: "$50K",
      price: "$327",
      period: "one-time",
      description: "Most popular choice",
      features: [
        "All Starter Features",
        "Advanced Indicators Suite",
        "Trade Copier Access",
        "Daily Loss Limit: $2,500",
        "Profit Target: $4,000",
        "Priority Support",
        "Live Trading Sessions",
        "Risk Management Tools"
      ],
      popular: true,
      variant: "hero" as const
    },
    {
      name: "Elite",
      amount: "$250K",
      price: "$657",
      period: "one-time",
      description: "For serious traders",
      features: [
        "All Professional Features",
        "Custom Automation Tools",
        "1-on-1 Mentorship",
        "Daily Loss Limit: $12,500",
        "Profit Target: $20,000",
        "White-Glove Support",
        "Exclusive Community Access",
        "Performance Analytics",
        "API Access"
      ],
      popular: false,
      variant: "premium" as const
    }
  ];

  return (
    <section id="pricing" className="py-24 bg-gradient-hero">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Choose Your <span className="bg-gradient-primary bg-clip-text text-transparent">Funding Level</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Start your journey to becoming a funded trader. All plans include comprehensive trading tools and education.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card 
              key={index} 
              className={`relative shadow-card hover:shadow-glow transition-all duration-300 ${
                plan.popular ? 'border-primary shadow-primary' : 'border-border'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-primary px-4 py-1 rounded-full text-sm font-medium text-primary-foreground flex items-center gap-1">
                    <Star className="w-4 h-4" />
                    Most Popular
                  </div>
                </div>
              )}

              <CardHeader className="text-center pb-8">
                <CardTitle className="text-xl font-bold">{plan.name}</CardTitle>
                <CardDescription className="text-muted-foreground">{plan.description}</CardDescription>
                
                <div className="mt-4">
                  <div className="text-3xl font-bold text-profit">{plan.amount}</div>
                  <div className="text-sm text-muted-foreground">Funding Amount</div>
                </div>

                <div className="mt-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground ml-1">/{plan.period}</span>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-profit mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button variant={plan.variant} size="lg" className="w-full group">
                  {plan.popular && <Zap className="w-4 h-4" />}
                  Get {plan.name} Plan
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-16 text-center">
          <p className="text-muted-foreground mb-4">
            All plans include a 30-day money-back guarantee
          </p>
          <div className="flex justify-center items-center gap-8 text-sm text-muted-foreground">
            <span>✓ No Monthly Fees</span>
            <span>✓ Keep 90% of Profits</span>
            <span>✓ Instant Platform Access</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;