import { BookOpen, ClipboardCheck, DollarSign } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      icon: BookOpen,
      step: "1",
      title: "Learn the Craft",
      description: "Start with free structured courses — from your first chart to a complete trading plan. No experience required.",
    },
    {
      icon: ClipboardCheck,
      step: "2",
      title: "Prove Your Skill",
      description: "When you're ready, take a funding challenge. Trade within the rules and hit your profit target to pass the evaluation.",
    },
    {
      icon: DollarSign,
      step: "3",
      title: "Trade Funded. Keep Profits.",
      description: "Trade our capital on CME, COMEX, NYMEX & CBOT. Withdraw up to 90% of profits with payouts every 7 days.",
    },
  ];

  return (
    <section id="how-it-works" className="py-24 bg-background">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            How It <span className="bg-gradient-accent bg-clip-text text-transparent">Works</span>
          </h2>
          <p className="text-xl text-muted-foreground">Three steps to a funded trading career</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div key={step.step} className="text-center">
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 relative">
                  <Icon className="w-8 h-8 text-primary" />
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center text-xs font-bold text-primary-foreground">
                    {step.step}
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
