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
      title: "Footprint Charts",
      description: "Real-time bid/ask volume visualization within each price bar for institutional-level order flow analysis.",
      features: ["Real-time volume imprints", "Bid/Ask absorption levels", "Institutional activity detection"],
      category: "Order Flow"
    },
    {
      icon: TrendingUp,
      title: "Cumulative Delta",
      description: "Track buying vs selling pressure accumulation to identify market sentiment shifts.",
      features: ["Real-time delta tracking", "Divergence alerts", "Pressure accumulation analysis"],
      category: "Order Flow"
    },
    {
      icon: Target,
      title: "DOM Heatmap",
      description: "Visual representation of order book depth and live changes for market maker insights.",
      features: ["Live order book visualization", "Depth changes tracking", "Liquidity pool identification"],
      category: "Order Flow"
    },
    {
      icon: BarChart3,
      title: "Volume Profile",
      description: "Horizontal volume distribution analysis with POC, VAH, and VAL levels for key support/resistance.",
      features: ["Point of Control identification", "Value area calculations", "Volume nodes analysis"],
      category: "Market Structure"
    },
    {
      icon: Settings,
      title: "Market Profile (TPO)",
      description: "Time-Price-Opportunity charts showing market structure and auction theory implementation.",
      features: ["TPO chart generation", "Market balance analysis", "Auction theory application"],
      category: "Market Structure"
    },
    {
      icon: Zap,
      title: "Smart Money Concepts",
      description: "Order blocks, fair value gaps, and liquidity sweeps detection for institutional trading insights.",
      features: ["Order block identification", "Fair value gap detection", "Liquidity sweep alerts"],
      category: "Market Structure"
    },
    {
      icon: Shield,
      title: "Smart Stop Loss Manager",
      description: "Advanced stop loss automation with trailing stops, time-based exits, and profit target management.",
      features: ["Trailing stop automation", "Time-based exit rules", "Profit target scaling"],
      category: "Risk Management"
    },
    {
      icon: Target,
      title: "Position Sizing Calculator",
      description: "Kelly Criterion, fixed fractional, and risk-based position sizing for optimal capital allocation.",
      features: ["Kelly Criterion calculations", "Risk-based sizing", "Capital allocation optimization"],
      category: "Risk Management"
    },
    {
      icon: Shield,
      title: "Daily Loss Limit Enforcer",
      description: "Automatic account lockout and risk controls when daily loss limits are reached.",
      features: ["Automatic trading halt", "Real-time loss tracking", "Account protection alerts"],
      category: "Risk Management"
    },
    {
      icon: Settings,
      title: "ES/NQ Day Trading Workspace",
      description: "Pre-configured layouts optimized for index futures with multi-timeframe analysis.",
      features: ["Tick/1min/5min setup", "Index-specific indicators", "Market internals integration"],
      category: "Chart Templates"
    },
    {
      icon: TrendingUp,
      title: "Futures Scalping Template",
      description: "Ultra-fast execution template with sub-second entry/exit capabilities for scalping strategies.",
      features: ["Sub-second execution", "Tick chart optimization", "Scalping-specific tools"],
      category: "Chart Templates"
    },
    {
      icon: Zap,
      title: "Market Internals Dashboard",
      description: "A/D line, TICK, VIX, and breadth indicators for comprehensive market sentiment analysis.",
      features: ["Real-time market internals", "Sentiment indicators", "Breadth analysis tools"],
      category: "Market Analysis"
    },
    {
      icon: BarChart3,
      title: "Volume Spread Analysis",
      description: "Professional volume/price relationship analysis for identifying supply and demand imbalances.",
      features: ["Volume/price correlation", "Supply/demand analysis", "Wyckoff methodology"],
      category: "Market Analysis"
    },
    {
      icon: Target,
      title: "Advanced P&L Analytics",
      description: "Win rate, profit factor, expectancy, and Sharpe ratio calculations for performance optimization.",
      features: ["Comprehensive metrics", "Performance benchmarking", "Risk-adjusted returns"],
      category: "Analytics"
    },
    {
      icon: Settings,
      title: "Trade Journal Integration",
      description: "Automatic trade logging with screenshot capabilities and detailed performance analysis.",
      features: ["Automatic trade logging", "Screenshot integration", "Performance insights"],
      category: "Analytics"
    },
    {
      icon: Zap,
      title: "NinjaTrader 8 Add-ons",
      description: "Custom indicators, strategies, and market analyzer columns for NinjaTrader platform integration.",
      features: ["Custom indicators", "Strategy automation", "Market analyzer tools"],
      category: "Platform Integration"
    }
  ];

  const resources = [
    {
      title: "Order Flow Masterclass",
      description: "Complete 8-hour course on reading institutional order flow and market microstructure",
      type: "Course",
      duration: "8 hours"
    },
    {
      title: "Market Profile Deep Dive",
      description: "Advanced auction market theory and TPO chart analysis techniques",
      type: "Course", 
      duration: "6 hours"
    },
    {
      title: "Smart Money Concepts Guide",
      description: "Comprehensive guide to institutional trading concepts and liquidity analysis",
      type: "PDF Guide",
      duration: "45 pages"
    },
    {
      title: "NinjaTrader Platform Setup",
      description: "Complete platform configuration and optimization for professional trading",
      type: "Video Tutorial",
      duration: "45 min"
    },
    {
      title: "Risk Management Certification",
      description: "Professional-grade risk management strategies and position sizing methodologies",
      type: "Course",
      duration: "4 hours"
    },
    {
      title: "Live Trading Sessions",
      description: "Daily market analysis and real-time trade execution with our professional traders",
      type: "Video Tutorial",
      duration: "Daily"
    },
    {
      title: "Volume Spread Analysis Manual",
      description: "Complete guide to VSA methodology and Wyckoff market analysis techniques",
      type: "PDF Guide",
      duration: "38 pages"
    },
    {
      title: "Platform Integration Guides",
      description: "Setup instructions for NinjaTrader, Tradovate, TradingView, and Sierra Chart",
      type: "PDF Guide",
      duration: "28 pages"
    },
    {
      title: "Performance Analytics Workshop",
      description: "Advanced trade journaling and performance optimization techniques",
      type: "Video Tutorial",
      duration: "90 min"
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