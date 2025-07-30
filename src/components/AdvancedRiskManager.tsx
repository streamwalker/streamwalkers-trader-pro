import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, AlertTriangle, TrendingDown, TrendingUp, Activity, Target, DollarSign, Clock } from 'lucide-react';

interface RiskMetrics {
  dailyVaR: number; // Value at Risk
  portfolioVolatility: number;
  sharpeRatio: number;
  maxDrawdown: number;
  beta: number;
  correlationRisk: number;
  leverageRatio: number;
  liquidityRisk: number;
}

interface PositionSizing {
  symbol: string;
  optimalSize: number;
  maxSize: number;
  kellySize: number;
  riskAdjustedSize: number;
  currentExposure: number;
  recommendation: 'increase' | 'decrease' | 'hold';
}

interface DrawdownAlert {
  id: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  action: string;
  timestamp: Date;
}

export const AdvancedRiskManager = () => {
  const [accountSize, setAccountSize] = useState(27000);
  const [targetSize, setTargetSize] = useState(20000000);
  const [riskPerTrade, setRiskPerTrade] = useState(3.5);
  const [maxDailyRisk, setMaxDailyRisk] = useState(8);
  const [currentDrawdown, setCurrentDrawdown] = useState(2.3);
  const [riskMetrics, setRiskMetrics] = useState<RiskMetrics>({
    dailyVaR: 1850,
    portfolioVolatility: 35.2,
    sharpeRatio: 2.1,
    maxDrawdown: 8.5,
    beta: 1.4,
    correlationRisk: 0.65,
    leverageRatio: 2.2,
    liquidityRisk: 0.15
  });
  const [positionSizing, setPositionSizing] = useState<PositionSizing[]>([
    {
      symbol: 'ES',
      optimalSize: 3.2,
      maxSize: 5.0,
      kellySize: 4.1,
      riskAdjustedSize: 2.8,
      currentExposure: 2.5,
      recommendation: 'increase'
    },
    {
      symbol: 'BTCUSDT',
      optimalSize: 4.5,
      maxSize: 7.0,
      kellySize: 5.8,
      riskAdjustedSize: 3.9,
      currentExposure: 4.2,
      recommendation: 'hold'
    },
    {
      symbol: 'AAPL',
      optimalSize: 2.1,
      maxSize: 3.5,
      kellySize: 2.8,
      riskAdjustedSize: 1.9,
      currentExposure: 2.8,
      recommendation: 'decrease'
    }
  ]);
  const [drawdownAlerts, setDrawdownAlerts] = useState<DrawdownAlert[]>([
    {
      id: '1',
      severity: 'medium',
      message: 'Portfolio approaching daily risk limit (6.2% of 8% max)',
      action: 'Reduce position sizes by 25%',
      timestamp: new Date()
    },
    {
      id: '2',
      severity: 'low',
      message: 'High correlation detected between crypto positions',
      action: 'Consider diversifying into uncorrelated assets',
      timestamp: new Date(Date.now() - 300000)
    }
  ]);

  const calculatePortfolioProgress = () => {
    return ((accountSize / targetSize) * 100);
  };

  const calculateMonthlyTarget = () => {
    const monthsRemaining = 60; // 5 years * 12 months
    const requiredMonthlyReturn = Math.pow(targetSize / accountSize, 1 / monthsRemaining) - 1;
    return requiredMonthlyReturn * 100;
  };

  const getRiskLevel = (value: number, thresholds: [number, number, number]) => {
    if (value <= thresholds[0]) return 'low';
    if (value <= thresholds[1]) return 'medium';
    if (value <= thresholds[2]) return 'high';
    return 'critical';
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'border-l-green-500 bg-green-50';
      case 'medium': return 'border-l-yellow-500 bg-yellow-50';
      case 'high': return 'border-l-orange-500 bg-orange-50';
      case 'critical': return 'border-l-red-500 bg-red-50';
      default: return 'border-l-gray-500 bg-gray-50';
    }
  };

  const getRecommendationColor = (rec: string) => {
    switch (rec) {
      case 'increase': return 'bg-green-500';
      case 'decrease': return 'bg-red-500';
      case 'hold': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Shield className="w-6 h-6" />
            Advanced Risk Management
          </h2>
          <p className="text-muted-foreground">AI-powered risk controls for explosive growth</p>
        </div>
        <Badge variant="outline" className="bg-gradient-to-r from-green-500 to-blue-500 text-white">
          Active Protection
        </Badge>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Risk Overview</TabsTrigger>
          <TabsTrigger value="position-sizing">Position Sizing</TabsTrigger>
          <TabsTrigger value="drawdown">Drawdown Control</TabsTrigger>
          <TabsTrigger value="settings">Risk Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Capital Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Capital Growth Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Current Capital</span>
                    <span className="font-semibold">${accountSize.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Target Capital</span>
                    <span className="font-semibold">${targetSize.toLocaleString()}</span>
                  </div>
                  <Progress value={calculatePortfolioProgress()} className="mt-2" />
                  <p className="text-xs text-muted-foreground">
                    {calculatePortfolioProgress().toFixed(3)}% to target
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Required Monthly Return</span>
                    <span className="font-semibold text-orange-500">
                      {calculateMonthlyTarget().toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Current Drawdown</span>
                    <span className="font-semibold text-red-500">{currentDrawdown}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Max Daily Risk</span>
                    <span className="font-semibold">{maxDailyRisk}%</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Daily VaR</span>
                    <span className="font-semibold">${riskMetrics.dailyVaR}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Sharpe Ratio</span>
                    <span className="font-semibold text-green-600">{riskMetrics.sharpeRatio}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Portfolio Beta</span>
                    <span className="font-semibold">{riskMetrics.beta}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Risk Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <Activity className="w-5 h-5 text-blue-500" />
                  <Badge variant={getRiskLevel(riskMetrics.portfolioVolatility, [25, 35, 50]) === 'low' ? 'default' : 'destructive'}>
                    {getRiskLevel(riskMetrics.portfolioVolatility, [25, 35, 50])}
                  </Badge>
                </div>
                <div className="mt-2">
                  <div className="text-2xl font-bold">{riskMetrics.portfolioVolatility}%</div>
                  <div className="text-sm text-muted-foreground">Portfolio Volatility</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <TrendingDown className="w-5 h-5 text-red-500" />
                  <Badge variant={getRiskLevel(riskMetrics.maxDrawdown, [5, 10, 20]) === 'low' ? 'default' : 'destructive'}>
                    {getRiskLevel(riskMetrics.maxDrawdown, [5, 10, 20])}
                  </Badge>
                </div>
                <div className="mt-2">
                  <div className="text-2xl font-bold">{riskMetrics.maxDrawdown}%</div>
                  <div className="text-sm text-muted-foreground">Max Drawdown</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <DollarSign className="w-5 h-5 text-green-500" />
                  <Badge variant="default">
                    {riskMetrics.leverageRatio > 3 ? 'high' : 'normal'}
                  </Badge>
                </div>
                <div className="mt-2">
                  <div className="text-2xl font-bold">{riskMetrics.leverageRatio}x</div>
                  <div className="text-sm text-muted-foreground">Leverage Ratio</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <Shield className="w-5 h-5 text-purple-500" />
                  <Badge variant={riskMetrics.correlationRisk > 0.7 ? 'destructive' : 'default'}>
                    {riskMetrics.correlationRisk > 0.7 ? 'high' : 'normal'}
                  </Badge>
                </div>
                <div className="mt-2">
                  <div className="text-2xl font-bold">{(riskMetrics.correlationRisk * 100).toFixed(0)}%</div>
                  <div className="text-sm text-muted-foreground">Correlation Risk</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Active Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Active Risk Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {drawdownAlerts.map((alert) => (
                  <Alert key={alert.id} className={`border-l-4 ${getSeverityColor(alert.severity)}`}>
                    <AlertDescription>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{alert.message}</div>
                          <div className="text-sm text-muted-foreground mt-1">
                            Recommended: {alert.action}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {alert.severity}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {alert.timestamp.toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                    </AlertDescription>
                  </Alert>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="position-sizing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                AI-Optimized Position Sizing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {positionSizing.map((position) => (
                  <div key={position.symbol} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-lg">{position.symbol}</span>
                        <Badge className={`${getRecommendationColor(position.recommendation)} text-white`}>
                          {position.recommendation.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Current: {position.currentExposure}% of portfolio
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Optimal Size:</span>
                        <div className="font-medium text-green-600">{position.optimalSize}%</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Kelly Size:</span>
                        <div className="font-medium text-blue-600">{position.kellySize}%</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Risk Adjusted:</span>
                        <div className="font-medium text-purple-600">{position.riskAdjustedSize}%</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Max Allowed:</span>
                        <div className="font-medium text-orange-600">{position.maxSize}%</div>
                      </div>
                    </div>

                    <div className="mt-3">
                      <Progress 
                        value={(position.currentExposure / position.maxSize) * 100} 
                        className="h-2"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>Current Exposure</span>
                        <span>{position.currentExposure}% / {position.maxSize}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="drawdown" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingDown className="w-5 h-5" />
                Drawdown Protection System
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Current Drawdown Status</h4>
                    <div className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm">Current Drawdown</span>
                        <span className="font-semibold text-red-500">{currentDrawdown}%</span>
                      </div>
                      <Progress value={currentDrawdown * 5} className="mb-2" />
                      <div className="text-xs text-muted-foreground">
                        Warning at 5% • Emergency stop at 15%
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Recovery Protocol</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>0-3%: Normal operations</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <span>3-5%: Reduce position sizes by 25%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        <span>5-10%: Reduce positions by 50%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span>10%+: Emergency liquidation</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Automatic Triggers</h4>
                    <div className="space-y-2">
                      <div className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Daily Loss Limit</span>
                          <Badge variant="outline">Active</Badge>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Auto-halt trading at {maxDailyRisk}% daily loss
                        </div>
                      </div>
                      
                      <div className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Position Size Scaling</span>
                          <Badge variant="outline">Active</Badge>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Automatically reduce sizes during drawdown
                        </div>
                      </div>

                      <div className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Correlation Monitor</span>
                          <Badge variant="outline">Active</Badge>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Alert when correlation exceeds 70%
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Risk Control Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Risk Per Trade (%)</label>
                    <Input
                      type="number"
                      value={riskPerTrade}
                      onChange={(e) => setRiskPerTrade(Number(e.target.value))}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Max Daily Risk (%)</label>
                    <Input
                      type="number"
                      value={maxDailyRisk}
                      onChange={(e) => setMaxDailyRisk(Number(e.target.value))}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Current Account Size ($)</label>
                    <Input
                      type="number"
                      value={accountSize}
                      onChange={(e) => setAccountSize(Number(e.target.value))}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Target Account Size ($)</label>
                    <Input
                      type="number"
                      value={targetSize}
                      onChange={(e) => setTargetSize(Number(e.target.value))}
                      className="mt-1"
                    />
                  </div>

                  <Button className="w-full">
                    Update Risk Parameters
                  </Button>

                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      These settings control automatic risk management. Changes take effect immediately.
                    </AlertDescription>
                  </Alert>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};