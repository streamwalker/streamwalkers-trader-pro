import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TrendingUp, TrendingDown, BarChart3, Target, AlertTriangle, RefreshCw, DollarSign, Activity, X } from "lucide-react";
import { AddSymbolDialog } from "@/components/AddSymbolDialog";
import { InfoTooltip } from "@/components/InfoTooltip";
import { useFuturesData, useVIXData, useMarketConditions, useTradingSignals, useKeyLevels } from "@/hooks/useMarketData";
import { useWatchlistData, useWatchlistActions } from "@/hooks/useWatchlist";
import MarketDataService from "@/services/MarketDataService";
import { CustomAnalysisDialog } from "@/components/CustomAnalysisDialog";
import { QuickAlertsSheet } from "@/components/QuickAlertsSheet";
import { CandlestickChart } from "@/components/CandlestickChart";

const MarketAnalysis = () => {
  const { data: futuresData, isLoading: futuresLoading, refetch: refetchFutures } = useFuturesData();
  const { data: vixData, isLoading: vixLoading } = useVIXData();
  const { data: marketConditions, isLoading: conditionsLoading } = useMarketConditions();
  const { data: signals, isLoading: signalsLoading } = useTradingSignals();
  const { data: esLevels, isLoading: esLevelsLoading } = useKeyLevels('ES');
  const { data: nqLevels, isLoading: nqLevelsLoading } = useKeyLevels('NQ');
  const { data: watchlistData, isLoading: watchlistLoading, refetch: refetchWatchlist } = useWatchlistData();
  const { removeSymbol } = useWatchlistActions();

  const marketDataService = MarketDataService.getInstance();

  const handleRefresh = () => {
    refetchFutures();
    refetchWatchlist();
  };

  const getMarketSentiment = () => {
    if (!vixData || !futuresData) return 'Loading...';
    const avgChange = futuresData.reduce((sum, item) => sum + item.changePercent, 0) / futuresData.length;
    return marketDataService.getMarketSentiment(vixData.current, avgChange);
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
          <CustomAnalysisDialog>
            <Button variant="outline" size="sm">
              <BarChart3 className="mr-2 h-4 w-4" />
              Custom Analysis
            </Button>
          </CustomAnalysisDialog>
          <QuickAlertsSheet>
            <Button size="sm">
              <AlertTriangle className="mr-2 h-4 w-4" />
              Set Alerts
            </Button>
          </QuickAlertsSheet>
        </div>
      </div>

      {/* Candlestick Chart Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Live Charts</h2>
        <CandlestickChart 
          symbol="ES" 
          supportLevels={esLevels?.support || []} 
          resistanceLevels={esLevels?.resistance || []} 
        />
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
                <div className="flex items-center gap-1">
                  <CardTitle className="text-sm font-medium">{condition.name}</CardTitle>
                  <InfoTooltip content={`${condition.name} indicator shows current market sentiment and trend direction. Values above average indicate bullish conditions, while below average suggests bearish sentiment.`} />
                </div>
                {condition.status === "bullish" ? (
                  <TrendingUp className="h-4 w-4 text-green-500" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500" />
                )}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{condition.value}</div>
                <Badge 
                  variant={condition.status === "bullish" ? "default" : "secondary"}
                  className="mt-2"
                >
                  {condition.status === "bullish" ? "Bullish" : condition.status === "bearish" ? "Bearish" : "Neutral"}
                </Badge>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Dynamic Watchlist */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="text-lg font-semibold">Portfolio Watchlist</CardTitle>
            <CardDescription>Track any stock symbol with live updates</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {watchlistLoading && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                Updating...
              </div>
            )}
            <AddSymbolDialog onSymbolAdded={refetchWatchlist} />
          </div>
        </CardHeader>
        <CardContent>
          {watchlistLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ) : watchlistData?.length ? (
            <div className="space-y-4">
              {/* Portfolio Summary */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">Total Value</p>
                  <p className="text-2xl font-bold">
                    ${watchlistData.reduce((sum, stock) => sum + (stock.marketValue || 0), 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Daily P&L</p>
                  <p className={`text-2xl font-bold ${watchlistData.reduce((sum, stock) => sum + ((stock.change || 0) * (stock.position || 0)), 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {watchlistData.reduce((sum, stock) => sum + ((stock.change || 0) * (stock.position || 0)), 0) >= 0 ? '+' : ''}
                    ${watchlistData.reduce((sum, stock) => sum + ((stock.change || 0) * (stock.position || 0)), 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
              
              {/* Live Stock Positions */}
              <div className="space-y-2">
                <div className="grid grid-cols-7 gap-4 text-xs font-medium text-muted-foreground pb-2 border-b">
                  <div className="flex items-center gap-1">
                    <span>Symbol</span>
                    <InfoTooltip content="The stock ticker symbol representing the company or security being traded." />
                  </div>
                  <div className="flex items-center gap-1">
                    <span>Exchange</span>
                    <InfoTooltip content="The stock exchange where this security is listed and traded (e.g., NASDAQ, NYSE)." />
                  </div>
                  <div className="flex items-center gap-1">
                    <span>Price</span>
                    <InfoTooltip content="The current market price of the security in real-time or last known price." />
                  </div>
                  <div className="flex items-center gap-1">
                    <span>Change</span>
                    <InfoTooltip content="The dollar amount change in price from the previous trading session close." />
                  </div>
                  <div className="flex items-center gap-1">
                    <span>% Change</span>
                    <InfoTooltip content="The percentage change in price from the previous trading session close, showing relative performance." />
                  </div>
                  <div className="flex items-center gap-1">
                    <span>Position</span>
                    <InfoTooltip content="Number of shares currently owned in your portfolio for this security." />
                  </div>
                  <div>Actions</div>
                </div>
                {watchlistData.map((stock) => (
                  <div key={`${stock.symbol}-${stock.exchange || 'NASDAQ'}`} className="grid grid-cols-7 gap-4 text-sm py-2 border-b items-center">
                    <div className="font-medium">{stock.symbol}</div>
                    <div>
                      <Badge variant="outline" className="text-xs">
                        {stock.exchange || 'NASDAQ'}
                      </Badge>
                    </div>
                    <div>${stock.price ? stock.price.toFixed(2) : '0.00'}</div>
                    <div className={stock.change && stock.change >= 0 ? 'text-green-600' : 'text-red-600'}>
                      {stock.change ? (stock.change >= 0 ? '+' : '') + '$' + stock.change.toFixed(2) : '$0.00'}
                    </div>
                    <div className={stock.changePercent && stock.changePercent >= 0 ? 'text-green-600' : 'text-red-600'}>
                      {stock.changePercent ? (stock.changePercent >= 0 ? '+' : '') + stock.changePercent.toFixed(2) + '%' : '0.00%'}
                    </div>
                    <div>{stock.position} shares</div>
                    <div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSymbol(stock.symbol, stock.exchange || 'NASDAQ')}
                        className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">No symbols in your watchlist</p>
              <AddSymbolDialog onSymbolAdded={refetchWatchlist} />
            </div>
          )}
        </CardContent>
      </Card>

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
                          variant={signal.signal === "buy" ? "default" : signal.signal === "sell" ? "destructive" : "secondary"}
                        >
                          {signal.signal}
                        </Badge>
                        <Badge variant="outline">{signal.strength}</Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Entry: ${signal.entryPrice ? signal.entryPrice.toFixed(2) : '0.00'} | Target: ${signal.targetPrice ? signal.targetPrice.toFixed(2) : '0.00'}
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
                        <div key={idx} className="font-mono">{level ? level.toFixed(2) : '0.00'}</div>
                      ))}
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Support</div>
                      {esLevels?.support.map((level, idx) => (
                        <div key={idx} className="font-mono">{level ? level.toFixed(2) : '0.00'}</div>
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
                        <div key={idx} className="font-mono">{level ? level.toFixed(2) : '0.00'}</div>
                      ))}
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Support</div>
                      {nqLevels?.support.map((level, idx) => (
                        <div key={idx} className="font-mono">{level ? level.toFixed(2) : '0.00'}</div>
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
                      {vixData?.current}
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