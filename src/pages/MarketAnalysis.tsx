import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, TrendingDown, BarChart3, Target, AlertTriangle, RefreshCw } from "lucide-react";
import { useFuturesData, useVIXData, useMarketConditions, useTradingSignals, useKeyLevels } from "@/hooks/useMarketData";
import MarketDataService from "@/services/MarketDataService";

const MarketAnalysis = () => {
  const { data: futuresData, isLoading: futuresLoading, refetch: refetchFutures } = useFuturesData();
  const { data: vixData, isLoading: vixLoading } = useVIXData();
  const { data: marketConditions, isLoading: conditionsLoading } = useMarketConditions();
  const { data: signals, isLoading: signalsLoading } = useTradingSignals();
  const { data: esLevels, isLoading: esLevelsLoading } = useKeyLevels('ES');
  const { data: nqLevels, isLoading: nqLevelsLoading } = useKeyLevels('NQ');

  const marketDataService = MarketDataService.getInstance();

  const handleRefresh = () => {
    refetchFutures();
  };

  const getMarketSentiment = () => {
    if (!vixData || !futuresData) return 'Loading...';
    const avgChange = futuresData.reduce((sum, item) => sum + item.changePercent, 0) / futuresData.length;
    return marketDataService.getMarketSentiment(vixData.value, avgChange);
  };

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
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh Data
          </Button>
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
        {conditionsLoading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-6 w-20" />
              </CardContent>
            </Card>
          ))
        ) : (
          marketConditions?.map((condition, index) => (
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
          ))
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Trading Signals</CardTitle>
            <CardDescription>AI-powered signals based on technical analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {signalsLoading ? (
                Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-4 w-8" />
                        <Skeleton className="h-6 w-12" />
                        <Skeleton className="h-6 w-16" />
                      </div>
                      <Skeleton className="h-4 w-40" />
                    </div>
                    <div className="text-right">
                      <Skeleton className="h-4 w-8 mb-1" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                ))
              ) : (
                signals?.map((signal, index) => (
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
                ))
              )}
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
                {esLevelsLoading ? (
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-xs text-muted-foreground">Resistance</div>
                      <Skeleton className="h-4 w-20 mb-1" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Support</div>
                      <Skeleton className="h-4 w-20 mb-1" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-xs text-muted-foreground">Resistance</div>
                      {esLevels?.resistance.map((level, idx) => (
                        <div key={idx} className="font-mono">{level.toFixed(2)}</div>
                      ))}
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Support</div>
                      {esLevels?.support.map((level, idx) => (
                        <div key={idx} className="font-mono">{level.toFixed(2)}</div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <h4 className="text-sm font-medium flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  NQ (Nasdaq E-mini)
                </h4>
                {nqLevelsLoading ? (
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-xs text-muted-foreground">Resistance</div>
                      <Skeleton className="h-4 w-20 mb-1" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Support</div>
                      <Skeleton className="h-4 w-20 mb-1" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-xs text-muted-foreground">Resistance</div>
                      {nqLevels?.resistance.map((level, idx) => (
                        <div key={idx} className="font-mono">{level.toFixed(2)}</div>
                      ))}
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Support</div>
                      {nqLevels?.support.map((level, idx) => (
                        <div key={idx} className="font-mono">{level.toFixed(2)}</div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-2 border-t">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">VIX Level</span>
                  {vixLoading ? (
                    <Skeleton className="h-6 w-20" />
                  ) : (
                    <Badge variant="secondary">
                      {vixData?.value} ({vixData?.level})
                    </Badge>
                  )}
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Market Sentiment</span>
                  {vixLoading || futuresLoading ? (
                    <Skeleton className="h-6 w-16" />
                  ) : (
                    <Badge variant="default">{getMarketSentiment()}</Badge>
                  )}
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