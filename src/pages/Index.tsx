import Hero from "@/components/Hero";
import TradingTools from "@/components/TradingTools";
import PricingSection from "@/components/PricingSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="bg-background">
      <Hero />
      <TradingTools />
      <PricingSection />
      <Footer />
    </div>
  );
};

export default Index;
