import { Button } from "@/components/ui/button";
import { ArrowRight, GraduationCap, ShieldCheck, TrendingUp, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();

  const steps = [
    { icon: BookOpen, label: "Learn", detail: "Structured courses" },
    { icon: ShieldCheck, label: "Prove", detail: "Pass the evaluation" },
    { icon: TrendingUp, label: "Trade", detail: "Up to $200K funded" },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-hero">
      {/* Subtle decorative grid */}
      <div
        className="absolute inset-0 opacity-[0.4]"
        style={{
          backgroundImage:
            "linear-gradient(hsl(var(--border)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--border)) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage: "radial-gradient(ellipse 80% 60% at 50% 0%, black 30%, transparent 70%)",
          WebkitMaskImage: "radial-gradient(ellipse 80% 60% at 50% 0%, black 30%, transparent 70%)",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 lg:pt-28 lg:pb-32 text-center">
        <div className="max-w-3xl mx-auto animate-fade-up">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-primary/5 border border-primary/20 px-4 py-1.5 rounded-full mb-8">
            <GraduationCap className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              Education-first funding — start learning free
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-[1.05]">
            Learn to trade.
            <br />
            Get funded. <span className="text-gradient-primary">Keep the profits.</span>
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            Streamwalkers Trader Pro takes you from your first candlestick chart to a
            funded futures account — with structured courses, professional tools, and
            up to <span className="text-foreground font-semibold">90% profit splits</span> when you're ready.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-14">
            <Button size="lg" className="group text-base px-8 py-6 shadow-primary" onClick={() => navigate("/education")}>
              Start Learning Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="outline" size="lg" className="text-base px-8 py-6" asChild>
              <a href="#pricing">View Funding Challenges</a>
            </Button>
          </div>

          {/* Three-step path */}
          <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.label}
                  className="relative bg-card border border-border rounded-2xl p-5 shadow-card text-center"
                >
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 h-6 w-6 rounded-full bg-gradient-primary text-white text-xs font-bold flex items-center justify-center">
                    {i + 1}
                  </div>
                  <Icon className="w-6 h-6 text-primary mx-auto mb-2 mt-1" />
                  <div className="font-display font-semibold text-sm md:text-base">{step.label}</div>
                  <div className="text-xs text-muted-foreground mt-0.5 hidden sm:block">{step.detail}</div>
                </div>
              );
            })}
          </div>

          {/* Trust Indicators */}
          <div className="mt-14">
            <div className="flex justify-center items-center gap-x-8 gap-y-2 text-xs font-medium text-muted-foreground flex-wrap">
              <span>CME • COMEX • NYMEX • CBOT</span>
              <span className="w-1 h-1 bg-muted-foreground/50 rounded-full hidden sm:block" />
              <span>NinjaTrader • Tradovate</span>
              <span className="w-1 h-1 bg-muted-foreground/50 rounded-full hidden sm:block" />
              <span>Payouts every 7 days • No monthly fees</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
