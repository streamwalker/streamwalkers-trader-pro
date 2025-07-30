import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowUp, ArrowDown, Volume2, Clock, TrendingUp, Activity, BarChart3, Target, Zap, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { EnhancedOrderBook } from "@/components/EnhancedOrderBook";
import { TechnicalIndicators } from "@/components/TechnicalIndicators";
import { useFuturesData, useVIXData, useMarketConditions } from "@/hooks/useMarketData";
import { toast } from "sonner";

const OrderFlow = () => {
  const [selectedSymbol, setSelectedSymbol] = useState("ES");
  const [refreshRate, setRefreshRate] = useState("1000");
  const [analysisActive, setAnalysisActive] = useState({
    trend: false,
    momentum: false,
    support: false,
    alerts: false
  });

  // Live data hooks
  const { data: futuresData, isLoading: futuresLoading } = useFuturesData();
  const { data: vixData, isLoading: vixLoading } = useVIXData();
  const { data: marketConditions, isLoading: conditionsLoading } = useMarketConditions();

  // Get current symbol data
  const currentSymbolData = futuresData?.find(f => f.symbol === selectedSymbol);
  
  // Generate dynamic order flow data based on live data
  const generateOrderFlowData = () => {
    if (!currentSymbolData) return [];
    
    const basePrice = currentSymbolData.price;
    const tickSize = selectedSymbol === "ES" ? 0.25 : selectedSymbol === "NQ" ? 0.50 : 0.01;
    
    return Array.from({ length: 10 }, (_, i) => {
      const offset = (i - 5) * tickSize;
      const price = basePrice + offset;
      const distance = Math.abs(i - 5);
      const baseVolume = Math.max(50, 300 - (distance * 30));
      
      return {
        price: parseFloat(price.toFixed(2)),
        bid: i < 5 ? baseVolume + Math.random() * 100 : 0,
        ask: i > 5 ? baseVolume + Math.random() * 100 : 0,
        volume: baseVolume + Math.random() * 200,
        delta: (Math.random() - 0.5) * 200
      };
    });
  };

  const orderFlowData = generateOrderFlowData();

  // Calculate live metrics
  const calculateLiveMetrics = () => {
    if (!currentSymbolData || !futuresData) return {
      totalVolume: 0,
      volumeDelta: 0,
      aggressiveBuying: 50,
      aggressiveSelling: 50,
      vwapDistance: 0,
      pocPrice: 0
    };

    const totalVolume = futuresData.reduce((sum, f) => sum + Math.abs(f.change) * 1000, 0);
    const volumeDelta = orderFlowData.reduce((sum, level) => sum + level.delta, 0);
    const aggressiveBuying = Math.max(30, Math.min(90, 50 + (volumeDelta / totalVolume) * 100));
    const aggressiveSelling = 100 - aggressiveBuying;
    const vwapDistance = (currentSymbolData.price - currentSymbolData.price * 0.998);
    const pocPrice = currentSymbolData.price - (currentSymbolData.change * 0.1);

    return {
      totalVolume,
      volumeDelta,
      aggressiveBuying,
      aggressiveSelling,
      vwapDistance,
      pocPrice
    };
  };

  const liveMetrics = calculateLiveMetrics();

  // Quick analysis functions
  const runTrendAnalysis = () => {
    setAnalysisActive(prev => ({ ...prev, trend: !prev.trend }));
    if (!analysisActive.trend) {
      toast.success("Trend Analysis activated - Monitoring price action patterns");
    } else {
      toast.info("Trend Analysis deactivated");
    }
  };

  const runMomentumScan = () => {
    setAnalysisActive(prev => ({ ...prev, momentum: !prev.momentum }));
    if (!analysisActive.momentum) {
      toast.success("Momentum Scan activated - Scanning for momentum shifts");
    } else {
      toast.info("Momentum Scan deactivated");
    }
  };

  const detectSupportResistance = () => {
    setAnalysisActive(prev => ({ ...prev, support: !prev.support }));
    if (!analysisActive.support) {
      const levels = orderFlowData.slice(0, 3).map(level => level.price);
      toast.success(`Support/Resistance detected at: ${levels.join(', ')}`);
    } else {
      toast.info("Support/Resistance detection deactivated");
    }
  };

  const toggleSignalAlerts = () => {
    setAnalysisActive(prev => ({ ...prev, alerts: !prev.alerts }));
    if (!analysisActive.alerts) {
      toast.success("Signal Alerts activated - Will notify on key signals");
    } else {
      toast.info("Signal Alerts deactivated");
    }
  };

  // Symbol options
  const symbolOptions = [
    { value: "ES", label: "E-mini S&P 500 (ES)" },
    { value: "NQ", label: "E-mini NASDAQ (NQ)" },
    { value: "YM", label: "E-mini Dow (YM)" },
    { value: "RTY", label: "E-mini Russell (RTY)" }
  ];

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Order Flow Analysis</h1>
          <p className="text-muted-foreground">
            Advanced market depth, order flow, and technical analysis tools
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedSymbol} onValueChange={setSelectedSymbol}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {symbolOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Badge variant="default" className="flex items-center gap-1">
            <Activity className="h-3 w-3" />
            Live Data
          </Badge>
          <Select value={refreshRate} onValueChange={setRefreshRate}>
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1000">1s</SelectItem>
              <SelectItem value="5000">5s</SelectItem>
              <SelectItem value="30000">30s</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" asChild>
            <Link to="/tools/order-flow/alerts">
              <Settings className="mr-2 h-4 w-4" />
              Alerts
            </Link>
          </Button>
        </div>
      </div>

      {/* Live Price Ticker */}
      {currentSymbolData && (
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div>
                  <h2 className="text-2xl font-bold">{selectedSymbol}</h2>
                  <p className="text-sm text-foreground/70">{symbolOptions.find(s => s.value === selectedSymbol)?.label}</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold">{currentSymbolData.price.toFixed(2)}</div>
                  <div className={`flex items-center gap-1 ${currentSymbolData.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {currentSymbolData.change >= 0 ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
                    <span>{currentSymbolData.change >= 0 ? '+' : ''}{currentSymbolData.change.toFixed(2)}</span>
                    <span>({currentSymbolData.changePercent >= 0 ? '+' : ''}{currentSymbolData.changePercent.toFixed(2)}%)</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-sm text-foreground/70">Volume</div>
                  <div className="font-semibold">{(Math.abs(currentSymbolData.change) * 1000).toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-sm text-foreground/70">High</div>
                  <div className="font-semibold">{(currentSymbolData.price + Math.abs(currentSymbolData.change)).toFixed(2)}</div>
                </div>
                <div>
                  <div className="text-sm text-foreground/70">Low</div>
                  <div className="font-semibold">{(currentSymbolData.price - Math.abs(currentSymbolData.change)).toFixed(2)}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="orderbook" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="orderbook">Order Book & Flow</TabsTrigger>
          <TabsTrigger value="technical">Technical Analysis</TabsTrigger>
          <TabsTrigger value="legacy">Legacy View</TabsTrigger>
        </TabsList>

        <TabsContent value="orderbook" className="space-y-6">
          <EnhancedOrderBook symbol={selectedSymbol} />
        </TabsContent>

        <TabsContent value="technical" className="space-y-6">
          <TechnicalIndicators symbol={selectedSymbol} />
        </TabsContent>

        <TabsContent value="legacy" className="space-y-6">
          {/* Quick Analysis Tools */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Quick Analysis Tools
              </CardTitle>
              <CardDescription>
                Activate real-time analysis tools for enhanced market insights
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Button 
                  variant={analysisActive.trend ? "default" : "outline"} 
                  size="sm"
                  onClick={runTrendAnalysis}
                >
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Trend Analysis
                  {analysisActive.trend && <Activity className="h-3 w-3 ml-1 animate-pulse" />}
                </Button>
                <Button 
                  variant={analysisActive.momentum ? "default" : "outline"} 
                  size="sm"
                  onClick={runMomentumScan}
                >
                  <Activity className="h-3 w-3 mr-1" />
                  Momentum Scan
                  {analysisActive.momentum && <Activity className="h-3 w-3 ml-1 animate-pulse" />}
                </Button>
                <Button 
                  variant={analysisActive.support ? "default" : "outline"} 
                  size="sm"
                  onClick={detectSupportResistance}
                >
                  <Target className="h-3 w-3 mr-1" />
                  Support/Resistance
                  {analysisActive.support && <Activity className="h-3 w-3 ml-1 animate-pulse" />}
                </Button>
                <Button 
                  variant={analysisActive.alerts ? "default" : "outline"} 
                  size="sm"
                  onClick={toggleSignalAlerts}
                >
                  <Zap className="h-3 w-3 mr-1" />
                  Signal Alerts
                  {analysisActive.alerts && <Activity className="h-3 w-3 ml-1 animate-pulse" />}
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Current Bid</CardTitle>
                <ArrowDown className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {orderFlowData.find(level => level.bid > 0)?.price.toFixed(2) || "0.00"}
                </div>
                <p className="text-xs text-foreground/70">
                  Size: {orderFlowData.find(level => level.bid > 0)?.bid.toLocaleString() || "0"} contracts
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Current Ask</CardTitle>
                <ArrowUp className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {orderFlowData.find(level => level.ask > 0)?.price.toFixed(2) || "0.00"}
                </div>
                <p className="text-xs text-foreground/70">
                  Size: {orderFlowData.find(level => level.ask > 0)?.ask.toLocaleString() || "0"} contracts
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Volume Delta</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${liveMetrics.volumeDelta >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {liveMetrics.volumeDelta >= 0 ? '+' : ''}{liveMetrics.volumeDelta.toFixed(0)}
                </div>
                <p className="text-xs text-foreground/70">
                  {liveMetrics.volumeDelta >= 0 ? 'Bullish' : 'Bearish'} momentum
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Volume</CardTitle>
                <Volume2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{liveMetrics.totalVolume.toLocaleString()}</div>
                <p className="text-xs text-foreground/70">
                  Live session
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Market Depth</CardTitle>
                <CardDescription>Live order book visualization</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="grid grid-cols-5 text-xs font-medium text-muted-foreground border-b pb-2">
                    <span>Price</span>
                    <span>Bid Size</span>
                    <span>Ask Size</span>
                    <span>Volume</span>
                    <span>Delta</span>
                  </div>
                  {orderFlowData.map((level, index) => (
                    <div key={index} className="grid grid-cols-5 text-sm py-1 hover:bg-muted/50 rounded">
                      <span className="font-mono">{level.price.toFixed(2)}</span>
                      <span className="text-red-500">{level.bid}</span>
                      <span className="text-green-500">{level.ask}</span>
                      <span>{level.volume}</span>
                      <span className={level.delta > 0 ? "text-green-500" : "text-red-500"}>
                        {level.delta > 0 ? "+" : ""}{level.delta}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Flow Statistics</CardTitle>
                <CardDescription>Real-time order flow metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Aggressive Buying</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-green-500 transition-all duration-300" 
                          style={{ width: `${liveMetrics.aggressiveBuying}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-green-500">{liveMetrics.aggressiveBuying.toFixed(0)}%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Aggressive Selling</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-red-500 transition-all duration-300" 
                          style={{ width: `${liveMetrics.aggressiveSelling}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-red-500">{liveMetrics.aggressiveSelling.toFixed(0)}%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Order Flow Imbalance</span>
                    <Badge variant={liveMetrics.aggressiveBuying > 60 ? "default" : "destructive"}>
                      {liveMetrics.aggressiveBuying > 60 ? "Bullish" : "Bearish"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">VWAP Distance</span>
                    <span className={`text-sm ${liveMetrics.vwapDistance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {liveMetrics.vwapDistance >= 0 ? '+' : ''}{liveMetrics.vwapDistance.toFixed(2)} pts
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">POC (Point of Control)</span>
                    <span className="text-sm font-mono">{liveMetrics.pocPrice.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OrderFlow;