import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Zap, TrendingUp, TrendingDown, Clock, Signal, Target, AlertTriangle, RefreshCw } from 'lucide-react';
import CryptoFuturesService, { CryptoOpportunity, CryptoFuturesData } from '@/services/CryptoFuturesService';
import AdvancedPatternService, { PatternResult } from '@/services/AdvancedPatternService';
import { useAdvancedMarketData } from '@/hooks/useAdvancedMarketData';

import { useToast } from '@/hooks/use-toast';

export const OpportunityScanner = () => {
  const { 
    cryptoData, 
    cryptoOpportunities, 
    momentumScalping, 
    marketRegime, 
    patternSetups, 
    scalpingSetups,
    isLoading 
  } = useAdvancedMarketData();
  
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const { toast } = useToast();

  const refreshData = () => {
    setLastUpdate(new Date());
    if (!isLoading) {
      const totalOpps = (cryptoOpportunities?.length || 0) + (patternSetups?.length || 0) + (scalpingSetups?.length || 0);
      if (totalOpps > 0) {
        toast({
          title: "🚀 Data Refreshed",
          description: `Found ${totalOpps} live opportunities`,
        });
      }
    }
  };

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(refreshData, 30000);
    return () => clearInterval(interval);
  }, [cryptoOpportunities, patternSetups, scalpingSetups, isLoading]);

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getSignalColor = (signal: string) => {
    switch (signal.toLowerCase()) {
      case 'long': case 'bullish': case 'buy': return 'bg-green-500';
      case 'short': case 'bearish': case 'sell': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const formatTimeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    return `${Math.floor(seconds / 3600)}h ago`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Zap className="w-6 h-6" />
            Live Opportunity Scanner
          </h2>
          <p className="text-muted-foreground">Real-time detection of explosive growth opportunities</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            Last updated: {lastUpdate.toLocaleTimeString()}
          </Badge>
          <Button
            onClick={refreshData}
            disabled={isLoading}
            size="sm"
            variant="outline"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Market Regime Alert */}
      {marketRegime && (
        <Alert className="border-l-4 border-l-blue-500">
          <Signal className="h-4 w-4" />
          <AlertDescription>
            <div className="flex items-center justify-between">
              <div>
                <strong>Market Regime:</strong> {marketRegime.regime.toUpperCase()} 
                <span className="ml-2 text-sm">({marketRegime.confidence}% confidence)</span>
              </div>
              <Badge variant="secondary">{marketRegime.tradingRecommendation}</Badge>
            </div>
            <p className="text-sm mt-1">{marketRegime.description}</p>
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="crypto" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="crypto" className="relative">
            Crypto Futures
            {(cryptoOpportunities?.length || 0) > 0 && (
              <Badge className="absolute -top-2 -right-2 bg-red-500 text-white w-5 h-5 text-xs rounded-full p-0 flex items-center justify-center">
                {cryptoOpportunities?.length || 0}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="patterns" className="relative">
            Pattern Setups
            {(patternSetups?.length || 0) > 0 && (
              <Badge className="absolute -top-2 -right-2 bg-blue-500 text-white w-5 h-5 text-xs rounded-full p-0 flex items-center justify-center">
                {patternSetups?.length || 0}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="scalping" className="relative">
            Scalping
            {(scalpingSetups?.length || 0) > 0 && (
              <Badge className="absolute -top-2 -right-2 bg-green-500 text-white w-5 h-5 text-xs rounded-full p-0 flex items-center justify-center">
                {scalpingSetups?.length || 0}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="overview">
            Live Data
          </TabsTrigger>
        </TabsList>

        <TabsContent value="crypto" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                High-Volatility Crypto Opportunities
              </CardTitle>
            </CardHeader>
            <CardContent>
              {(cryptoOpportunities?.length || 0) === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  No high-volatility crypto opportunities detected
                </div>
              ) : (
                <div className="space-y-3">
                  {cryptoOpportunities?.map((opp) => (
                    <div key={opp.id} className="p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge className={`${getSignalColor(opp.signal)} text-white`}>
                            {opp.signal === 'long' ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                            {opp.signal.toUpperCase()}
                          </Badge>
                          <span className="font-semibold">{opp.symbol}</span>
                          <Badge className={getUrgencyColor(opp.urgency)}>
                            {opp.urgency}
                          </Badge>
                          <Badge variant="outline">
                            <Signal className="w-3 h-3 mr-1" />
                            {Math.round(opp.confidence)}%
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          {opp.timeframe} • {formatTimeAgo(opp.timestamp)}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{opp.reasoning}</p>
                      <div className="grid grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Entry:</span>
                          <div className="font-medium">${opp.entryPrice.toFixed(2)}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Target:</span>
                          <div className="font-medium text-green-600">${opp.targetPrice.toFixed(2)}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Stop:</span>
                          <div className="font-medium text-red-600">${opp.stopLoss.toFixed(2)}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">R:R:</span>
                          <div className="font-medium">{opp.riskReward.toFixed(1)}:1</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="patterns" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Technical Pattern Setups
              </CardTitle>
            </CardHeader>
            <CardContent>
              {(patternSetups?.length || 0) === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  No high-probability patterns detected
                </div>
              ) : (
                <div className="space-y-3">
                  {patternSetups?.map((pattern) => (
                    <div key={pattern.id} className="p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge className={`${getSignalColor(pattern.signal)} text-white`}>
                            {pattern.signal.toUpperCase()}
                          </Badge>
                          <span className="font-semibold">{pattern.symbol}</span>
                          <Badge variant="outline" className="text-xs">
                            {pattern.pattern.replace('_', ' ')}
                          </Badge>
                          <Badge className={getUrgencyColor(pattern.urgency)}>
                            {pattern.urgency}
                          </Badge>
                        </div>
                        <Badge variant="outline">
                          {Math.round(pattern.confidence)}% confidence
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{pattern.description}</p>
                      <div className="grid grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Entry:</span>
                          <div className="font-medium">${pattern.entryPrice.toFixed(2)}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Target:</span>
                          <div className="font-medium text-green-600">${pattern.targetPrice.toFixed(2)}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Stop:</span>
                          <div className="font-medium text-red-600">${pattern.stopLoss.toFixed(2)}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Timeframe:</span>
                          <div className="font-medium">{pattern.timeframe}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scalping" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                High-Frequency Scalping Setups
              </CardTitle>
            </CardHeader>
            <CardContent>
              {(scalpingSetups?.length || 0) === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  No scalping opportunities available
                </div>
              ) : (
                <div className="space-y-3">
                  {scalpingSetups?.map((setup) => (
                    <div key={setup.id} className="p-3 border rounded-lg hover:bg-accent/50 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge className={`${getSignalColor(setup.signal)} text-white text-xs`}>
                            {setup.signal.toUpperCase()}
                          </Badge>
                          <span className="font-semibold text-sm">{setup.symbol}</span>
                          <Badge variant="outline" className="text-xs">
                            1M Scalp
                          </Badge>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {Math.round(setup.confidence)}%
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div>Entry: <span className="font-medium">${setup.entryPrice.toFixed(2)}</span></div>
                        <div>Target: <span className="font-medium text-green-600">${setup.targetPrice.toFixed(2)}</span></div>
                        <div>Stop: <span className="font-medium text-red-600">${setup.stopLoss.toFixed(2)}</span></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Signal className="w-5 h-5" />
                Live Crypto Futures Data
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {cryptoData?.map((crypto) => (
                  <div key={crypto.symbol} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold">{crypto.symbol}</span>
                      <Badge variant={crypto.changePercent >= 0 ? 'default' : 'destructive'}>
                        {crypto.changePercent >= 0 ? '+' : ''}{crypto.changePercent.toFixed(2)}%
                      </Badge>
                    </div>
                    <div className="text-2xl font-bold mb-1">${crypto.price.toFixed(2)}</div>
                    <div className="text-sm text-muted-foreground">
                      Vol: {crypto.volume.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Leverage: {crypto.leverage}x
                    </div>
                  </div>
                )) || (
                  <div className="col-span-full text-center text-muted-foreground py-8">
                    Loading crypto futures data...
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};