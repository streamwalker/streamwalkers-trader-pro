import { Button } from "@/components/ui/button";
import { ArrowRight, Play, TrendingUp, DollarSign, Users, Zap } from "lucide-react";
import heroImage from "@/assets/trading-hero.jpg";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="absolute inset-0 bg-background/85 backdrop-blur-sm" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-profit/10 border border-profit/30 px-4 py-2 rounded-full mb-8">
            <DollarSign className="w-4 h-4 text-profit" />
            <span className="text-sm font-medium text-profit">$18,420,000+ Paid Out To Traders</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Trade Our Capital.
            <br />
            Keep Up To <span className="bg-gradient-primary bg-clip-text text-transparent">90% of the Profits.</span>
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            AI-powered prop trading platform designed to identify profitable traders 
            and fund them up to <span className="text-foreground font-semibold">$400,000</span> in trading capital.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mb-12 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-profit">$400K</div>
              <div className="text-sm text-muted-foreground">Max Funding</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-primary">12,417+</div>
              <div className="text-sm text-muted-foreground">Traders Funded</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-warning">90%</div>
              <div className="text-sm text-muted-foreground">Profit Split</div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" size="lg" className="group text-base px-10 py-6" asChild>
              <a href="#pricing">
                Start Challenge — From $79
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
            </Button>
            <Button variant="outline" size="lg" className="group text-base px-10 py-6" asChild>
              <a href="#instant-funding">
                <Zap className="w-5 h-5" />
                Instant Funding
              </a>
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="mt-12 text-center">
            <p className="text-sm text-muted-foreground mb-4">Trusted by traders worldwide</p>
            <div className="flex justify-center items-center gap-8 opacity-60 flex-wrap">
              <div className="text-xs font-medium">CME • COMEX • NYMEX • CBOT</div>
              <div className="w-1 h-1 bg-muted-foreground rounded-full hidden sm:block" />
              <div className="text-xs font-medium">NinjaTrader • Tradovate</div>
              <div className="w-1 h-1 bg-muted-foreground rounded-full hidden sm:block" />
              <div className="text-xs font-medium">Fast Payouts • No Monthly Fees</div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-1/4 left-10 w-20 h-20 bg-primary/20 rounded-full blur-xl animate-float" />
      <div className="absolute bottom-1/4 right-10 w-32 h-32 bg-profit/20 rounded-full blur-xl animate-float" style={{ animationDelay: '1s' }} />
    </section>
  );
};

export default Hero;
