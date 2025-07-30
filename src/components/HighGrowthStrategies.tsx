import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { TrendingUp, Target, AlertTriangle, Zap, BarChart3, DollarSign } from 'lucide-react';

interface Strategy {
  name: string;
  description: string;
  targetReturn: number;
  riskLevel: 'High' | 'Very High' | 'Extreme';
  timeframe: string;
  capitalRequired: number;
  difficulty: number;
  successRate: number;
}

export const HighGrowthStrategies = () => {
  const [selectedStrategy, setSelectedStrategy] = useState<Strategy | null>(null);

  const strategies: Strategy[] = [
    {
      name: "Momentum Breakout Scalping",
      description: "Trade high-momentum breakouts on 1-5 minute timeframes with tight stops and quick profits.",
      targetReturn: 300,
      riskLevel: "Very High",
      timeframe: "Intraday",
      capitalRequired: 25000,
      difficulty: 8,
      successRate: 45
    },
    {
      name: "Earnings Gap Trading",
      description: "Trade earnings gaps and momentum continuation with leveraged positions.",
      targetReturn: 500,
      riskLevel: "Extreme",
      timeframe: "Event-based",
      capitalRequired: 50000,
      difficulty: 9,
      successRate: 35
    },
    {
      name: "Crypto Futures Arbitrage",
      description: "Exploit price differences between crypto spot and futures markets.",
      targetReturn: 200,
      riskLevel: "High",
      timeframe: "Multiple",
      capitalRequired: 30000,
      difficulty: 7,
      successRate: 60
    },
    {
      name: "Options Momentum Trading",
      description: "Trade high-gamma options on momentum stocks with precise entry/exit timing.",
      targetReturn: 800,
      riskLevel: "Extreme",
      timeframe: "Weekly",
      capitalRequired: 40000,
      difficulty: 10,
      successRate: 25
    },
    {
      name: "Futures Spread Trading",
      description: "Trade correlated futures spreads with high leverage for consistent small gains.",
      targetReturn: 150,
      riskLevel: "High",
      timeframe: "Daily",
      capitalRequired: 20000,
      difficulty: 6,
      successRate: 70
    },
    {
      name: "Market Making Automation",
      description: "Automated market making on high-volume pairs for consistent income.",
      targetReturn: 180,
      riskLevel: "High",
      timeframe: "Continuous",
      capitalRequired: 100000,
      difficulty: 9,
      successRate: 75
    }
  ];

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'High': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'Very High': return 'text-red-600 bg-red-50 border-red-200';
      case 'Extreme': return 'text-red-800 bg-red-100 border-red-300';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-red-50 to-orange-50 border-orange-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-700">
            <AlertTriangle className="h-5 w-5" />
            High-Growth Trading Strategies
          </CardTitle>
          <CardDescription className="text-red-600">
            Aggressive strategies designed for explosive capital growth. High risk, high reward.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-700">
              <strong>Warning:</strong> These strategies carry extreme risk. Only use with capital you can afford to lose. 
              Success requires exceptional skill, discipline, and risk management.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {strategies.map((strategy, index) => (
          <Card 
            key={index} 
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedStrategy === strategy ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => setSelectedStrategy(strategy === selectedStrategy ? null : strategy)}
          >
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-orange-500" />
                    {strategy.name}
                  </CardTitle>
                  <CardDescription className="mt-1">
                    {strategy.description}
                  </CardDescription>
                </div>
                <Badge className={`${getRiskColor(strategy.riskLevel)} border`}>
                  {strategy.riskLevel} Risk
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-xl font-bold text-green-600">{strategy.targetReturn}%</div>
                  <div className="text-xs text-muted-foreground">Target Return</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-blue-600">{strategy.successRate}%</div>
                  <div className="text-xs text-muted-foreground">Success Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-orange-600">{strategy.difficulty}/10</div>
                  <div className="text-xs text-muted-foreground">Difficulty</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-purple-600">${(strategy.capitalRequired / 1000)}K</div>
                  <div className="text-xs text-muted-foreground">Min Capital</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-gray-600">{strategy.timeframe}</div>
                  <div className="text-xs text-muted-foreground">Timeframe</div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Difficulty Level</span>
                  <span>{strategy.difficulty}/10</span>
                </div>
                <Progress value={strategy.difficulty * 10} className="h-2" />
              </div>

              {selectedStrategy === strategy && (
                <div className="mt-4 p-4 bg-muted rounded-lg space-y-3">
                  <h4 className="font-semibold">Implementation Details:</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="font-medium text-sm">Setup Requirements:</h5>
                      <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                        <li>• Minimum ${strategy.capitalRequired.toLocaleString()} capital</li>
                        <li>• Advanced charting platform</li>
                        <li>• Low-latency execution</li>
                        <li>• Risk management system</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-medium text-sm">Risk Considerations:</h5>
                      <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                        <li>• Potential for rapid losses</li>
                        <li>• Requires constant monitoring</li>
                        <li>• High stress environment</li>
                        <li>• Significant learning curve</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1">
                      <BarChart3 className="h-3 w-3 mr-1" />
                      Backtest Strategy
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      <Target className="h-3 w-3 mr-1" />
                      Practice Mode
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-gradient-to-br from-green-50 to-blue-50 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-700">
            <DollarSign className="h-5 w-5" />
            Capital Allocation Strategy
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              For optimal growth while managing risk, consider allocating capital across multiple strategies:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-white rounded border">
                <div className="font-semibold text-green-600">Conservative (40%)</div>
                <div className="text-sm text-muted-foreground mt-1">
                  Futures spreads, market making - steady returns with lower risk
                </div>
              </div>
              <div className="p-4 bg-white rounded border">
                <div className="font-semibold text-orange-600">Aggressive (40%)</div>
                <div className="text-sm text-muted-foreground mt-1">
                  Momentum trading, breakouts - higher returns with managed risk
                </div>
              </div>
              <div className="p-4 bg-white rounded border">
                <div className="font-semibold text-red-600">Extreme (20%)</div>
                <div className="text-sm text-muted-foreground mt-1">
                  Options, earnings gaps - maximum returns with maximum risk
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};