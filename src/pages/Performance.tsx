import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, TrendingDown, Target, Calendar, Download } from "lucide-react";
import { CapitalGrowthDashboard } from '@/components/CapitalGrowthDashboard';
import { KellyCriterionCalculator } from '@/components/KellyCriterionCalculator';
import { CompoundGrowthCalculator } from '@/components/CompoundGrowthCalculator';
import { HighGrowthStrategies } from '@/components/HighGrowthStrategies';
import { FinancialRatiosCalculator } from '@/components/FinancialRatiosCalculator';
import { BreakEvenAnalyzer } from '@/components/BreakEvenAnalyzer';
import { InvestmentValuationCalc } from '@/components/InvestmentValuationCalc';

const Performance = () => {
  const performanceMetrics = [
    { label: "Total Return", value: "+24.7%", change: "+3.2%", trend: "up" },
    { label: "Sharpe Ratio", value: "1.84", change: "+0.12", trend: "up" },
    { label: "Max Drawdown", value: "-8.2%", change: "-1.1%", trend: "down" },
    { label: "Win Rate", value: "67.8%", change: "+2.3%", trend: "up" },
  ];

  const monthlyReturns = [
    { month: "Jan 2024", return: 4.2, trades: 23 },
    { month: "Dec 2023", return: -1.8, trades: 19 },
    { month: "Nov 2023", return: 6.7, trades: 31 },
    { month: "Oct 2023", return: 3.1, trades: 27 },
    { month: "Sep 2023", return: 8.9, trades: 35 },
    { month: "Aug 2023", return: 2.4, trades: 22 },
  ];

  const topPerformingTrades = [
    { symbol: "ES", date: "2024-01-28", entry: 4520.25, exit: 4567.75, pnl: 2375, return: 5.2 },
    { symbol: "NQ", date: "2024-01-26", entry: 15240.50, exit: 15018.25, pnl: -2222, return: -1.5 },
    { symbol: "RTY", date: "2024-01-24", entry: 2089.75, exit: 2134.50, pnl: 1788, return: 2.1 },
    { symbol: "YM", date: "2024-01-22", entry: 37892.25, exit: 38240.75, pnl: 1392, return: 0.9 },
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Performance & Growth Strategy</h1>
          <p className="text-muted-foreground">Track performance and optimize for explosive capital growth</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            Custom Period
          </Button>
          <Button size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      <Tabs defaultValue="growth" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
          <TabsTrigger value="growth">Capital Growth</TabsTrigger>
          <TabsTrigger value="strategies">Strategies</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="calculator">Growth Calc</TabsTrigger>
          <TabsTrigger value="kelly">Position Sizing</TabsTrigger>
          <TabsTrigger value="fundamentals">Fundamentals</TabsTrigger>
          <TabsTrigger value="valuation">Valuation</TabsTrigger>
          <TabsTrigger value="breakeven">Break-Even</TabsTrigger>
        </TabsList>

        <TabsContent value="growth" className="space-y-6">
          <CapitalGrowthDashboard />
        </TabsContent>

        <TabsContent value="strategies" className="space-y-6">
          <HighGrowthStrategies />
        </TabsContent>

        <TabsContent value="fundamentals" className="space-y-6">
          <FinancialRatiosCalculator />
        </TabsContent>

        <TabsContent value="valuation" className="space-y-6">
          <InvestmentValuationCalc />
        </TabsContent>

        <TabsContent value="breakeven" className="space-y-6">
          <BreakEvenAnalyzer />
        </TabsContent>

        <TabsContent value="calculator" className="space-y-6">
          <CompoundGrowthCalculator />
        </TabsContent>

        <TabsContent value="kelly" className="space-y-6">
          <KellyCriterionCalculator />
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {performanceMetrics.map((metric, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.label}</CardTitle>
              {metric.trend === "up" ? (
                <TrendingUp className="h-4 w-4 text-green-500" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500" />
              )}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <p className={`text-xs ${metric.trend === "up" ? "text-green-500" : "text-red-500"}`}>
                {metric.change} from last period
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Performance</CardTitle>
            <CardDescription>Monthly returns and trading activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {monthlyReturns.map((month, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">{month.month}</div>
                    <div className="text-sm text-muted-foreground">{month.trades} trades</div>
                  </div>
                  <div className="text-right">
                    <div className={`text-lg font-bold ${month.return > 0 ? "text-green-500" : "text-red-500"}`}>
                      {month.return > 0 ? "+" : ""}{month.return}%
                    </div>
                    <Badge variant={month.return > 0 ? "default" : "destructive"}>
                      {month.return > 0 ? "Profit" : "Loss"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Significant Trades</CardTitle>
            <CardDescription>Your most impactful trades this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topPerformingTrades.map((trade, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{trade.symbol}</span>
                      <Badge variant="outline">{trade.date}</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {trade.entry} → {trade.exit}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-bold ${trade.pnl > 0 ? "text-green-500" : "text-red-500"}`}>
                      {trade.pnl > 0 ? "+" : ""}${trade.pnl}
                    </div>
                    <div className={`text-sm ${trade.return > 0 ? "text-green-500" : "text-red-500"}`}>
                      {trade.return > 0 ? "+" : ""}{trade.return}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Risk Metrics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Beta</span>
              <span className="text-sm">0.87</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Alpha</span>
              <span className="text-sm text-green-500">+4.2%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Volatility</span>
              <span className="text-sm">12.4%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Information Ratio</span>
              <span className="text-sm">1.32</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Trade Statistics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Total Trades</span>
              <span className="text-sm">187</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Winning Trades</span>
              <span className="text-sm text-green-500">127</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Losing Trades</span>
              <span className="text-sm text-red-500">60</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Avg. Trade</span>
              <span className="text-sm">$431</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Goals & Targets</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Annual Target</span>
                <span className="text-sm">30%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: "82%" }}></div>
              </div>
              <div className="text-xs text-muted-foreground">82% achieved (24.7%)</div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Monthly Goal</span>
              <Badge variant="default">
                <Target className="w-3 h-3 mr-1" />
                Exceeded
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Performance;