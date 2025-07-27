import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, BarChart3, Target, AlertTriangle } from "lucide-react";

const MarketAnalysis = () => {
  const signals = [
    { symbol: "ES", signal: "Buy", strength: "Strong", price: 4567.25, target: 4620.00, confidence: 87 },
    { symbol: "NQ", signal: "Sell", strength: "Moderate", price: 15234.50, target: 15100.00, confidence: 72 },
    { symbol: "YM", signal: "Hold", strength: "Weak", price: 37892.25, target: 37900.00, confidence: 58 },
    { symbol: "RTY", signal: "Buy", strength: "Strong", price: 2089.75, target: 2150.00, confidence: 91 },
  ];

  const marketConditions = [
    { metric: "Market Volatility", value: "Medium", trend: "up", color: "yellow" },
    { metric: "Trend Strength", value: "Strong", trend: "up", color: "green" },
    { metric: "Volume Profile", value: "Above Average", trend: "up", color: "blue" },
    { metric: "Momentum", value: "Bullish", trend: "up", color: "green" },
  ];

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Market Analysis</h1>
          <p className="text-muted-foreground">
            Technical analysis, trading signals, and market intelligence.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <BarChart3 className="mr-2 h-4 w-4" />
            Custom Analysis
          </Button>
          <Button size="sm">
            <AlertTriangle className="mr-2 h-4 w-4" />
            Set Alerts
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {marketConditions.map((condition, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{condition.metric}</CardTitle>
              {condition.trend === "up" ? (
                <TrendingUp className="h-4 w-4 text-green-500" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500" />
              )}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{condition.value}</div>
              <Badge 
                variant={condition.color === "green" ? "default" : "secondary"}
                className="mt-2"
              >
                {condition.trend === "up" ? "Positive" : "Negative"}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Trading Signals</CardTitle>
            <CardDescription>AI-powered signals based on technical analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {signals.map((signal, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{signal.symbol}</span>
                      <Badge 
                        variant={signal.signal === "Buy" ? "default" : signal.signal === "Sell" ? "destructive" : "secondary"}
                      >
                        {signal.signal}
                      </Badge>
                      <Badge variant="outline">{signal.strength}</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Entry: ${signal.price.toFixed(2)} | Target: ${signal.target.toFixed(2)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{signal.confidence}%</div>
                    <div className="text-xs text-muted-foreground">Confidence</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Key Levels</CardTitle>
            <CardDescription>Important support and resistance levels</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <h4 className="text-sm font-medium flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  ES (S&P 500 E-mini)
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-xs text-muted-foreground">Resistance</div>
                    <div className="font-mono">4580.00</div>
                    <div className="font-mono">4620.00</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Support</div>
                    <div className="font-mono">4540.00</div>
                    <div className="font-mono">4500.00</div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="text-sm font-medium flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  NQ (Nasdaq E-mini)
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-xs text-muted-foreground">Resistance</div>
                    <div className="font-mono">15300.00</div>
                    <div className="font-mono">15450.00</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Support</div>
                    <div className="font-mono">15150.00</div>
                    <div className="font-mono">15000.00</div>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">VIX Level</span>
                  <Badge variant="secondary">16.8 (Low)</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Market Sentiment</span>
                  <Badge variant="default">Bullish</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MarketAnalysis;