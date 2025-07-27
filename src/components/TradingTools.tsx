import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  BarChart3, 
  TrendingUp, 
  Settings, 
  Shield, 
  Zap, 
  Target,
  Download,
  PlayCircle
} from "lucide-react";

const TradingTools = () => {
  const tools = [
    {
      icon: BarChart3,
      title: "Order Flow Indicators",
      description: "Advanced DOM visualization and order flow analysis tools for better entry and exit timing.",
      features: ["Real-time DOM heatmaps", "Volume profile analysis", "Bid/Ask pressure indicators"],
      category: "Indicators"
    },
    {
      icon: TrendingUp,
      title: "Chart Templates",
      description: "Pre-configured NinjaTrader and Tradovate templates with professional setups.",
      features: ["Futures-optimized layouts", "Multi-timeframe analysis", "Custom indicator presets"],
      category: "Templates"
    },
    {
      icon: Settings,
      title: "Trade Automation",
      description: "Smart automation tools for risk management and trade execution.",
      features: ["Auto stop-loss management", "Position sizing calculator", "Trade copier functionality"],
      category: "Automation"
    },
    {
      icon: Shield,
      title: "Risk Management",
      description: "Built-in safety features to protect your trading account from unexpected losses.",
      features: ["Daily loss limit alerts", "Max position size controls", "Drawdown protection"],
      category: "Safety"
    },
    {
      icon: Zap,
      title: "Market Scanners",
      description: "Real-time market opportunity identification and alert systems.",
      features: ["Momentum scanners", "Volume spike alerts", "Break-out notifications"],
      category: "Analysis"
    },
    {
      icon: Target,
      title: "Performance Analytics",
      description: "Comprehensive trading performance tracking and improvement insights.",
      features: ["P&L tracking", "Win rate analysis", "Risk-reward metrics"],
      category: "Analytics"
    }
  ];

  const resources = [
    {
      title: "NinjaTrader Setup Guide",
      description: "Complete installation and configuration walkthrough",
      type: "Video Tutorial",
      duration: "15 min"
    },
    {
      title: "Order Flow Masterclass",
      description: "Advanced strategies using our proprietary indicators",
      type: "Course",
      duration: "2 hours"
    },
    {
      title: "Risk Management Blueprint",
      description: "Proven risk management strategies for consistent profits",
      type: "PDF Guide",
      duration: "25 pages"
    }
  ];

  return (
    <section id="features" className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Professional <span className="bg-gradient-primary bg-clip-text text-transparent">Trading Tools</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Everything you need to trade like a professional. Our comprehensive suite of tools gives you the edge in today's markets.
          </p>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {tools.map((tool, index) => {
            const IconComponent = tool.icon;
            return (
              <Card key={index} className="shadow-card hover:shadow-glow transition-all duration-300 group">
                <CardHeader>
                  <div className="flex items-center gap-4 mb-2">
                    <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                      <IconComponent className="w-6 h-6 text-primary" />
                    </div>
                    <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
                      {tool.category}
                    </span>
                  </div>
                  <CardTitle className="text-xl">{tool.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">{tool.description}</p>
                  <ul className="space-y-2">
                    {tool.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-2 text-sm">
                        <div className="w-1.5 h-1.5 bg-profit rounded-full" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Resources Section */}
        <div className="bg-card rounded-2xl p-8 shadow-card">
          <div className="text-center mb-8">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Training & <span className="bg-gradient-accent bg-clip-text text-transparent">Resources</span>
            </h3>
            <p className="text-muted-foreground">
              Master our tools with comprehensive training materials and ongoing support.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {resources.map((resource, index) => (
              <div key={index} className="p-6 bg-background rounded-lg border border-border hover:border-primary/30 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <h4 className="font-semibold">{resource.title}</h4>
                  {resource.type === "Video Tutorial" && <PlayCircle className="w-5 h-5 text-primary" />}
                  {resource.type === "PDF Guide" && <Download className="w-5 h-5 text-profit" />}
                  {resource.type === "Course" && <Target className="w-5 h-5 text-warning" />}
                </div>
                <p className="text-sm text-muted-foreground mb-3">{resource.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-primary font-medium">{resource.type}</span>
                  <span className="text-xs text-muted-foreground">{resource.duration}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Button variant="outline" size="lg">
              View All Resources
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TradingTools;