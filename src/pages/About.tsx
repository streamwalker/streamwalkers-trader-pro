import { TrendingUp, Shield, Globe, Users, Target, Award } from "lucide-react";
import Footer from "@/components/Footer";

const About = () => {
  return (
    <div className="bg-background min-h-screen">
      {/* Hero */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            About{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Streamwalkers Trader Pro
            </span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            We exist to identify the world's best traders and give them the capital they deserve. No gimmicks. No hidden rules. Just pure performance-based funding.
          </p>
        </div>

        {/* Mission */}
        <div className="grid md:grid-cols-2 gap-12 mb-20">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Our Mission</h2>
            <p className="text-muted-foreground leading-relaxed">
              The prop trading industry has a trust problem. Too many firms profit from trader failures rather than trader success. We built Streamwalkers to change that.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Our proprietary Trader Intelligence Engine analyzes thousands of traders and millions of trades to identify consistent, disciplined performers. When we find them, we allocate real capital — up to $400,000 — and share up to 90% of the profits.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              We succeed when our traders succeed. That alignment is the foundation of everything we do.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: Target, label: "Performance First", desc: "We fund skill, not luck" },
              { icon: Shield, label: "Fair Rules", desc: "No hidden traps or gotchas" },
              { icon: Globe, label: "Global Access", desc: "Traders in 120+ countries" },
              { icon: Award, label: "Fast Payouts", desc: "Withdraw every 7 days" },
            ].map((item) => (
              <div key={item.label} className="bg-card border border-border rounded-xl p-6 text-center space-y-3">
                <item.icon className="w-8 h-8 text-primary mx-auto" />
                <h3 className="font-semibold text-sm">{item.label}</h3>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* By the Numbers */}
        <div className="bg-card border border-border rounded-2xl p-10 mb-20">
          <h2 className="text-2xl font-bold text-center mb-10">By the Numbers</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "$12.4M+", label: "Paid to Traders" },
              { value: "15,000+", label: "Active Traders" },
              { value: "120+", label: "Countries" },
              { value: "7 Days", label: "Average Payout Cycle" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-3xl font-bold text-primary">{stat.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Team */}
        <div className="mb-20">
          <h2 className="text-2xl font-bold text-center mb-4">Leadership</h2>
          <p className="text-muted-foreground text-center mb-10 max-w-2xl mx-auto">
            Our team combines decades of experience in quantitative trading, fintech, and risk management.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: "Marcus Chen", role: "CEO & Co-Founder", bio: "Former quant trader at a top-tier hedge fund. 15+ years in derivatives markets." },
              { name: "Sarah Williams", role: "CTO", bio: "Built trading infrastructure at two major exchanges. ML & risk systems specialist." },
              { name: "David Park", role: "Head of Risk", bio: "Ex-risk director at a proprietary trading firm. Designed evaluation frameworks used industry-wide." },
            ].map((person) => (
              <div key={person.name} className="bg-card border border-border rounded-xl p-6 space-y-3">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <Users className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-semibold text-center">{person.name}</h3>
                <p className="text-sm text-primary text-center">{person.role}</p>
                <p className="text-sm text-muted-foreground text-center">{person.bio}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Regulatory */}
        <div className="bg-muted/50 border border-border rounded-2xl p-10">
          <h2 className="text-2xl font-bold mb-6">Regulatory & Compliance</h2>
          <div className="space-y-4 text-muted-foreground">
            <p>
              Streamwalkers Corp. is a registered entity operating in compliance with applicable financial regulations. Our evaluation programs use simulated trading environments that mirror real market conditions.
            </p>
            <p>
              We do not solicit or accept deposits for investment purposes. Challenge fees are for access to our evaluation platform and trading tools. All performance data shown on this site represents hypothetical or simulated results unless explicitly stated otherwise.
            </p>
            <p>
              Customers trade Futures products listed on CME, COMEX, NYMEX & CBOT exchanges only. Spot currencies, CFDs, stocks, options, and cryptocurrencies are not available.
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default About;
