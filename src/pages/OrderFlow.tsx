import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowUp, ArrowDown, Volume2, Clock, TrendingUp, Activity, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";
import { EnhancedOrderBook } from "@/components/EnhancedOrderBook";
import { TechnicalIndicators } from "@/components/TechnicalIndicators";

const OrderFlow = () => {
  const orderFlowData = [
    { price: 4567.50, bid: 125, ask: 98, volume: 223, delta: +27 },
    { price: 4567.25, bid: 89, ask: 156, volume: 245, delta: -67 },
    { price: 4567.00, bid: 234, ask: 112, volume: 346, delta: +122 },
    { price: 4566.75, bid: 78, ask: 201, volume: 279, delta: -123 },
    { price: 4566.50, bid: 167, ask: 89, volume: 256, delta: +78 },
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
          <Badge variant="default" className="flex items-center gap-1">
            <Activity className="h-3 w-3" />
            Live Data
          </Badge>
          <Button variant="outline" size="sm" asChild>
            <Link to="/tools/order-flow/alerts">
              <Clock className="mr-2 h-4 w-4" />
              Configure Alerts
            </Link>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="orderbook" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="orderbook">Order Book & Flow</TabsTrigger>
          <TabsTrigger value="technical">Technical Analysis</TabsTrigger>
          <TabsTrigger value="legacy">Legacy View</TabsTrigger>
        </TabsList>

        <TabsContent value="orderbook" className="space-y-6">
          <EnhancedOrderBook symbol="SPY" />
        </TabsContent>

        <TabsContent value="technical" className="space-y-6">
          <TechnicalIndicators />
        </TabsContent>

        <TabsContent value="legacy" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Current Bid</CardTitle>
                <ArrowDown className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4566.75</div>
                <p className="text-xs text-muted-foreground">
                  Size: 1,247 contracts
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Current Ask</CardTitle>
                <ArrowUp className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4567.00</div>
                <p className="text-xs text-muted-foreground">
                  Size: 892 contracts
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Volume Delta</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-500">+847</div>
                <p className="text-xs text-muted-foreground">
                  Bullish momentum
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Volume</CardTitle>
                <Volume2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24,567</div>
                <p className="text-xs text-muted-foreground">
                  Last 1 hour
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
                        <div className="w-3/4 h-full bg-green-500"></div>
                      </div>
                      <span className="text-sm text-green-500">75%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Aggressive Selling</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                        <div className="w-1/4 h-full bg-red-500"></div>
                      </div>
                      <span className="text-sm text-red-500">25%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Order Flow Imbalance</span>
                    <Badge variant="default">Bullish</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">VWAP Distance</span>
                    <span className="text-sm">+2.3 pts</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">POC (Point of Control)</span>
                    <span className="text-sm font-mono">4566.25</span>
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