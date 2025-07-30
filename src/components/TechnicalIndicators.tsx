import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, Activity, BarChart3, Target, Zap } from 'lucide-react';

interface Indicator {
  id: string;
  name: string;
  category: 'momentum' | 'trend' | 'volatility' | 'volume';
  value: number;
  signal: 'bullish' | 'bearish' | 'neutral';
  period: number;
  description: string;
}

const mockIndicators: Indicator[] = [
  {
    id: 'rsi',
    name: 'RSI (14)',
    category: 'momentum',
    value: 65.2,
    signal: 'bullish',
    period: 14,
    description: 'Relative Strength Index measures momentum'
  },
  {
    id: 'macd',
    name: 'MACD (12,26,9)',
    category: 'momentum',
    value: 1.25,
    signal: 'bullish',
    period: 26,
    description: 'Moving Average Convergence Divergence'
  },
  {
    id: 'bb',
    name: 'Bollinger Bands',
    category: 'volatility',
    value: 75.5,
    signal: 'neutral',
    period: 20,
    description: 'Price volatility and mean reversion indicator'
  },
  {
    id: 'sma20',
    name: 'SMA (20)',
    category: 'trend',
    value: 425.80,
    signal: 'bullish',
    period: 20,
    description: 'Simple Moving Average - trend direction'
  },
  {
    id: 'ema50',
    name: 'EMA (50)',
    category: 'trend',
    value: 423.15,
    signal: 'bullish',
    period: 50,
    description: 'Exponential Moving Average - responsive trend'
  },
  {
    id: 'volume',
    name: 'Volume SMA',
    category: 'volume',
    value: 125.3,
    signal: 'bullish',
    period: 10,
    description: 'Volume moving average comparison'
  },
  {
    id: 'stoch',
    name: 'Stochastic %K',
    category: 'momentum',
    value: 72.8,
    signal: 'bullish',
    period: 14,
    description: 'Stochastic oscillator momentum indicator'
  },
  {
    id: 'atr',
    name: 'ATR (14)',
    category: 'volatility',
    value: 8.45,
    signal: 'neutral',
    period: 14,
    description: 'Average True Range - volatility measure'
  }
];

interface TechnicalIndicatorsProps {
  symbol?: string;
}

export const TechnicalIndicators = ({ symbol = "ES" }: TechnicalIndicatorsProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTimeframe, setSelectedTimeframe] = useState('1h');

  const categories = ['all', 'momentum', 'trend', 'volatility', 'volume'];
  const filteredIndicators = selectedCategory === 'all' 
    ? mockIndicators 
    : mockIndicators.filter(ind => ind.category === selectedCategory);

  const getSignalColor = (signal: string) => {
    switch (signal) {
      case 'bullish': return 'text-green-600';
      case 'bearish': return 'text-red-600';
      default: return 'text-yellow-600';
    }
  };

  const getSignalIcon = (signal: string) => {
    switch (signal) {
      case 'bullish': return <TrendingUp className="h-4 w-4" />;
      case 'bearish': return <TrendingDown className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getSignalBadgeVariant = (signal: string) => {
    switch (signal) {
      case 'bullish': return 'default';
      case 'bearish': return 'destructive';
      default: return 'secondary';
    }
  };

  const getOverallSentiment = () => {
    const bullishCount = mockIndicators.filter(ind => ind.signal === 'bullish').length;
    const bearishCount = mockIndicators.filter(ind => ind.signal === 'bearish').length;
    const neutralCount = mockIndicators.filter(ind => ind.signal === 'neutral').length;
    
    return { bullishCount, bearishCount, neutralCount };
  };

  const sentiment = getOverallSentiment();
  const totalIndicators = mockIndicators.length;
  const bullishPercentage = (sentiment.bullishCount / totalIndicators) * 100;

  return (
    <div className="space-y-6">
      {/* Overall Sentiment */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Technical Analysis Summary
          </CardTitle>
          <CardDescription>
            Overall market sentiment based on technical indicators
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Bullish Signals</span>
                <span className="font-medium">{sentiment.bullishCount}/{totalIndicators}</span>
              </div>
              <Progress value={bullishPercentage} className="h-2" />
              <div className="text-xs text-muted-foreground">
                {bullishPercentage.toFixed(0)}% bullish sentiment
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-600">{sentiment.bullishCount}</div>
                <div className="text-xs text-muted-foreground">Bullish</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-600">{sentiment.neutralCount}</div>
                <div className="text-xs text-muted-foreground">Neutral</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-600">{sentiment.bearishCount}</div>
                <div className="text-xs text-muted-foreground">Bearish</div>
              </div>
            </div>

            <div className="flex items-center justify-center">
              <Badge 
                variant={bullishPercentage > 60 ? 'default' : bullishPercentage < 40 ? 'destructive' : 'secondary'}
                className="text-sm py-2 px-4"
              >
                {bullishPercentage > 60 ? (
                  <>
                    <TrendingUp className="h-4 w-4 mr-1" />
                    BULLISH
                  </>
                ) : bullishPercentage < 40 ? (
                  <>
                    <TrendingDown className="h-4 w-4 mr-1" />
                    BEARISH
                  </>
                ) : (
                  <>
                    <Activity className="h-4 w-4 mr-1" />
                    NEUTRAL
                  </>
                )}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Controls */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Category:</span>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map(category => (
                <SelectItem key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Timeframe:</span>
          <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1m">1m</SelectItem>
              <SelectItem value="5m">5m</SelectItem>
              <SelectItem value="15m">15m</SelectItem>
              <SelectItem value="1h">1h</SelectItem>
              <SelectItem value="4h">4h</SelectItem>
              <SelectItem value="1d">1d</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Badge variant="outline" className="gap-1">
          <Zap className="h-3 w-3" />
          Live Updates
        </Badge>
      </div>

      {/* Indicators Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredIndicators.map((indicator) => (
          <Card key={indicator.id}>
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-sm">{indicator.name}</h3>
                  <Badge 
                    variant={getSignalBadgeVariant(indicator.signal)}
                    className="text-xs"
                  >
                    {getSignalIcon(indicator.signal)}
                  </Badge>
                </div>
                
                <div className="space-y-1">
                  <div className="text-2xl font-bold">
                    {indicator.category === 'volume' ? `${indicator.value}%` : indicator.value.toFixed(2)}
                  </div>
                  <div className={`text-sm font-medium ${getSignalColor(indicator.signal)}`}>
                    {indicator.signal.toUpperCase()}
                  </div>
                </div>
                
                <div className="text-xs text-muted-foreground">
                  {indicator.description}
                </div>
                
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Period: {indicator.period}</span>
                  <span className="capitalize">{indicator.category}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Quick Analysis Tools
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => window.parent.postMessage({ type: 'ACTIVATE_TREND_ANALYSIS', symbol }, '*')}
            >
              <TrendingUp className="h-3 w-3 mr-1" />
              Trend Analysis
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => window.parent.postMessage({ type: 'ACTIVATE_MOMENTUM_SCAN', symbol }, '*')}
            >
              <Activity className="h-3 w-3 mr-1" />
              Momentum Scan
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => window.parent.postMessage({ type: 'DETECT_SUPPORT_RESISTANCE', symbol }, '*')}
            >
              <Target className="h-3 w-3 mr-1" />
              Support/Resistance
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => window.parent.postMessage({ type: 'TOGGLE_SIGNAL_ALERTS', symbol }, '*')}
            >
              <Zap className="h-3 w-3 mr-1" />
              Signal Alerts
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};