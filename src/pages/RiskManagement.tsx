import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, AlertTriangle, Calculator, TrendingDown } from "lucide-react";
import { useState } from "react";

const RiskManagement = () => {
  const [accountSize, setAccountSize] = useState("100000");
  const [riskPercent, setRiskPercent] = useState("2");
  const [entryPrice, setEntryPrice] = useState("4567.25");
  const [stopLoss, setStopLoss] = useState("4540.00");

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
        <Button>
          <Shield className="mr-2 h-4 w-4" />
          Risk Assessment
        </Button>
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