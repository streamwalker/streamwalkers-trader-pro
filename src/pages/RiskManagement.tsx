import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Shield, AlertTriangle, Calculator, TrendingDown, Activity, Target, Zap } from "lucide-react";
import { useState } from "react";
import { useFuturesData, useVIXData, useMarketConditions } from "@/hooks/useMarketData";

const RiskManagement = () => {
  const [accountSize, setAccountSize] = useState("100000");
  const [riskPercent, setRiskPercent] = useState("2");
  const [entryPrice, setEntryPrice] = useState("4567.25");
  const [stopLoss, setStopLoss] = useState("4540.00");

  // Fetch live market data
  const { data: futuresData, isLoading: futuresLoading } = useFuturesData();
  const { data: vixData, isLoading: vixLoading } = useVIXData();
  const { data: marketConditions, isLoading: conditionsLoading } = useMarketConditions();

  const calculatePositionSize = () => {
    const account = parseFloat(accountSize);
    const risk = parseFloat(riskPercent) / 100;
    const entry = parseFloat(entryPrice);
    const stop = parseFloat(stopLoss);
    
    const riskAmount = account * risk;
    const pointRisk = Math.abs(entry - stop);
    const positionSize = Math.floor(riskAmount / pointRisk);
    
    return { riskAmount, pointRisk, positionSize };
  };

  const { riskAmount, pointRisk, positionSize } = calculatePositionSize();

  // Calculate live risk assessment data
  const getLiveRiskAssessment = () => {
    if (!futuresData || !vixData || !marketConditions) return null;
    
    const avgVolatility = futuresData.reduce((sum, item) => sum + Math.abs(item.changePercent || 0), 0) / futuresData.length;
    const marketStress = vixData.current > 25 ? 'High' : vixData.current > 20 ? 'Medium' : 'Low';
    const overallRisk = avgVolatility > 1.5 ? 'High' : avgVolatility > 0.75 ? 'Medium' : 'Low';
    
    return {
      marketStress,
      avgVolatility: avgVolatility.toFixed(2),
      overallRisk,
      vixLevel: vixData.current,
      recommendation: overallRisk === 'High' ? 'Reduce position sizes' : overallRisk === 'Medium' ? 'Standard risk management' : 'Favorable conditions'
    };
  };

  const liveAssessment = getLiveRiskAssessment();

  const riskMetrics = [
    { label: "Current Drawdown", value: "-3.2%", status: "good", icon: TrendingDown },
    { label: "Max Daily Risk", value: "2.0%", status: "good", icon: Shield },
    { label: "Risk-Reward Ratio", value: "1:3.2", status: "excellent", icon: Calculator },
    { label: "Win Rate Required", value: "23.8%", status: "good", icon: AlertTriangle },
  ];

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Risk Management</h1>
          <p className="text-muted-foreground">
            Position sizing, risk calculation, and portfolio protection tools.
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Shield className="mr-2 h-4 w-4" />
              Risk Assessment
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Live Risk Assessment
              </DialogTitle>
              <DialogDescription>
                Real-time market risk analysis based on current conditions
              </DialogDescription>
            </DialogHeader>
            
            {futuresLoading || vixLoading || conditionsLoading ? (
              <div className="space-y-4">
                <div className="animate-pulse">
                  <div className="h-20 bg-muted rounded-lg"></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="animate-pulse">
                    <div className="h-16 bg-muted rounded-lg"></div>
                  </div>
                  <div className="animate-pulse">
                    <div className="h-16 bg-muted rounded-lg"></div>
                  </div>
                </div>
              </div>
            ) : liveAssessment ? (
              <div className="space-y-6">
                {/* Overall Risk Summary */}
                <Card className="border-l-4" style={{ borderLeftColor: 
                  liveAssessment.overallRisk === 'High' ? 'hsl(var(--destructive))' : 
                  liveAssessment.overallRisk === 'Medium' ? 'hsl(var(--warning))' : 
                  'hsl(var(--success))' 
                }}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Market Risk Level</span>
                      <Badge variant={
                        liveAssessment.overallRisk === 'High' ? 'destructive' : 
                        liveAssessment.overallRisk === 'Medium' ? 'secondary' : 
                        'default'
                      }>
                        {liveAssessment.overallRisk}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      <strong>Recommendation:</strong> {liveAssessment.recommendation}
                    </p>
                  </CardContent>
                </Card>

                {/* Live Metrics Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">VIX Level</CardTitle>
                      <Zap className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{liveAssessment.vixLevel}</div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Market Stress: {liveAssessment.marketStress}
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Avg Volatility</CardTitle>
                      <Target className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{liveAssessment.avgVolatility}%</div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Futures price movement
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Live Futures Data */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Live Futures</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {futuresData?.map((future) => (
                        <div key={future.symbol} className="flex items-center justify-between">
                          <span className="font-medium">{future.symbol}</span>
                          <div className="text-right">
                            <div className="font-mono text-sm">{future.price ? future.price.toFixed(2) : '0.00'}</div>
                            <div className={`text-xs ${future.changePercent && future.changePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {future.changePercent ? (future.changePercent >= 0 ? '+' : '') + future.changePercent.toFixed(2) + '%' : '0.00%'}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Market Conditions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Market Conditions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-3">
                      {marketConditions?.map((condition, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-sm font-medium">{condition.name}</span>
                          <Badge variant="outline">{condition.value}</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Unable to load risk assessment data</p>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {riskMetrics.map((metric, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.label}</CardTitle>
              <metric.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <Badge 
                variant={
                  metric.status === "excellent" ? "default" : 
                  metric.status === "good" ? "secondary" : "destructive"
                }
                className="mt-2"
              >
                {metric.status.charAt(0).toUpperCase() + metric.status.slice(1)}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Position Size Calculator</CardTitle>
            <CardDescription>Calculate optimal position size based on risk parameters</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="accountSize">Account Size ($)</Label>
              <Input
                type="number"
                id="accountSize"
                value={accountSize}
                onChange={(e) => setAccountSize(e.target.value)}
                placeholder="100000"
              />
            </div>
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="riskPercent">Risk Percentage (%)</Label>
              <Input
                type="number"
                id="riskPercent"
                value={riskPercent}
                onChange={(e) => setRiskPercent(e.target.value)}
                placeholder="2"
                step="0.1"
              />
            </div>
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="entryPrice">Entry Price</Label>
              <Input
                type="number"
                id="entryPrice"
                value={entryPrice}
                onChange={(e) => setEntryPrice(e.target.value)}
                placeholder="4567.25"
                step="0.01"
              />
            </div>
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="stopLoss">Stop Loss</Label>
              <Input
                type="number"
                id="stopLoss"
                value={stopLoss}
                onChange={(e) => setStopLoss(e.target.value)}
                placeholder="4540.00"
                step="0.01"
              />
            </div>
            
            <div className="pt-4 border-t space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Risk Amount:</span>
                <span className="text-sm font-mono">${riskAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Point Risk:</span>
                <span className="text-sm font-mono">{pointRisk.toFixed(2)} pts</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Position Size:</span>
                <span className="text-sm font-mono font-bold">{positionSize} contracts</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Risk Limits</CardTitle>
            <CardDescription>Current risk exposure and limits</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Daily Risk Used</span>
                  <span className="text-sm">$640 / $2,000</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: "32%" }}></div>
                </div>
                <div className="text-xs text-muted-foreground mt-1">32% of daily limit</div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Weekly Risk Used</span>
                  <span className="text-sm">$2,840 / $7,000</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-secondary h-2 rounded-full" style={{ width: "41%" }}></div>
                </div>
                <div className="text-xs text-muted-foreground mt-1">41% of weekly limit</div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Max Drawdown</span>
                  <span className="text-sm">$3,200 / $10,000</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: "32%" }}></div>
                </div>
                <div className="text-xs text-muted-foreground mt-1">Well within limits</div>
              </div>

              <div className="pt-4 border-t space-y-2">
                <h4 className="text-sm font-medium">Active Positions</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>ES Long (2 contracts)</span>
                    <Badge variant="outline">$545 risk</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>NQ Short (1 contract)</span>
                    <Badge variant="outline">$320 risk</Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RiskManagement;