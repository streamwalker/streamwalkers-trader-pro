import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, AlertTriangle, Activity } from 'lucide-react';
import { useFuturesData, useVIXData, useMarketConditions, useTradingSignals } from '@/hooks/useMarketData';

export const MarketInsights = () => {
  const { data: futuresData } = useFuturesData();
  const { data: vixData } = useVIXData();
  const { data: marketConditions } = useMarketConditions();
  const { data: tradingSignals } = useTradingSignals();

  const getMarketSentiment = () => {
    if (!marketConditions) return { sentiment: 'neutral', score: 50 };
    
    const bullishCount = marketConditions.filter(c => c.status === 'bullish').length;
    const bearishCount = marketConditions.filter(c => c.status === 'bearish').length;
    const totalConditions = marketConditions.length;
    
    const bullishRatio = bullishCount / totalConditions;
    
    if (bullishRatio > 0.6) return { sentiment: 'bullish', score: Math.round(bullishRatio * 100) };
    if (bullishRatio < 0.4) return { sentiment: 'bearish', score: Math.round((1 - bullishRatio) * 100) };
    return { sentiment: 'neutral', score: 50 };
  };

  const getVIXStatus = () => {
    if (!vixData) return { status: 'normal', color: 'bg-gray-500' };
    
    if (vixData.current > 30) return { status: 'high fear', color: 'bg-red-500' };
    if (vixData.current > 20) return { status: 'elevated', color: 'bg-yellow-500' };
    return { status: 'low fear', color: 'bg-green-500' };
  };

  const marketSentiment = getMarketSentiment();
  const vixStatus = getVIXStatus();

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'bullish': return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'bearish': return <TrendingDown className="w-4 h-4 text-red-500" />;
      default: return <Activity className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'bullish': return 'text-green-500';
      case 'bearish': return 'text-red-500';
      default: return 'text-yellow-500';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* Market Sentiment */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            {getSentimentIcon(marketSentiment.sentiment)}
            Market Sentiment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className={`text-lg font-bold capitalize ${getSentimentColor(marketSentiment.sentiment)}`}>
                {marketSentiment.sentiment}
              </span>
              <Badge variant="outline">
                {marketSentiment.score}%
              </Badge>
            </div>
            <Progress value={marketSentiment.score} className="h-2" />
            <p className="text-xs text-muted-foreground">
              Based on {marketConditions?.length || 0} market indicators
            </p>
          </div>
        </CardContent>
      </Card>

      {/* VIX Fear Index */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Fear & Greed Index
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold">
                {vixData?.current?.toFixed(1) || '--'}
              </span>
              <Badge className={`${vixStatus.color} text-white`}>
                {vixStatus.status}
              </Badge>
            </div>
            <Progress 
              value={Math.min((vixData?.current || 0) / 50 * 100, 100)} 
              className="h-2" 
            />
            <p className="text-xs text-muted-foreground">
              VIX Level: {vixData?.change > 0 ? '+' : ''}{vixData?.change?.toFixed(2) || '--'}%
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Active Signals */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Active Signals
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {tradingSignals && tradingSignals.length > 0 ? (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold">
                    {tradingSignals.filter(s => s.signal === 'buy').length}
                  </span>
                  <Badge className="bg-green-500 text-white">
                    Buy Signals
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold">
                    {tradingSignals.filter(s => s.signal === 'sell').length}
                  </span>
                  <Badge className="bg-red-500 text-white">
                    Sell Signals
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Total signals: {tradingSignals.length}
                </p>
              </>
            ) : (
              <div className="text-center">
                <span className="text-lg font-bold text-muted-foreground">--</span>
                <p className="text-xs text-muted-foreground">No active signals</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Market Breadth */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Market Breadth</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">Advancing</span>
              <span className="text-sm font-medium text-green-500">65%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Declining</span>
              <span className="text-sm font-medium text-red-500">35%</span>
            </div>
            <Progress value={65} className="h-2" />
            <p className="text-xs text-muted-foreground">
              Broad market participation
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Futures Overview */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Futures Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {futuresData && futuresData.length > 0 ? (
              futuresData.slice(0, 3).map((future, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm">{future.symbol}</span>
                  <span className={`text-sm font-medium ${
                    future.change > 0 ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {future.change > 0 ? '+' : ''}{future.change?.toFixed(2)}%
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">Loading futures data...</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Risk Level */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Risk Level
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-yellow-500">Moderate</span>
              <Badge variant="outline">
                5/10
              </Badge>
            </div>
            <Progress value={50} className="h-2" />
            <p className="text-xs text-muted-foreground">
              Market volatility and uncertainty
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};