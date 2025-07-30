import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowUp, ArrowDown, Activity, Clock, TrendingUp, Volume2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OrderBookLevel {
  price: number;
  bidSize: number;
  askSize: number;
  marketMaker?: string;
  timestamp?: number;
}

interface TimeAndSale {
  id: string;
  price: number;
  size: number;
  side: 'buy' | 'sell';
  timestamp: number;
  exchange: string;
}

interface OrderBookProps {
  symbol?: string;
}

export const EnhancedOrderBook = ({ symbol = 'SPY' }: OrderBookProps) => {
  const [orderBookData, setOrderBookData] = useState<OrderBookLevel[]>([]);
  const [timeAndSales, setTimeAndSales] = useState<TimeAndSale[]>([]);
  const [lastPrice, setLastPrice] = useState(428.50);
  const [spread, setSpread] = useState(0.02);

  // Generate realistic order book data
  useEffect(() => {
    const generateOrderBook = () => {
      const levels: OrderBookLevel[] = [];
      const basePrice = lastPrice;
      const tickSize = 0.01;
      
      // Generate 10 levels above and below current price
      for (let i = -10; i <= 10; i++) {
        if (i === 0) continue; // Skip current price level
        
        const price = basePrice + (i * tickSize);
        const distance = Math.abs(i);
        const baseSize = Math.max(100, 1000 - (distance * 50));
        
        const level: OrderBookLevel = {
          price: parseFloat(price.toFixed(2)),
          bidSize: i < 0 ? baseSize + Math.random() * 500 : 0,
          askSize: i > 0 ? baseSize + Math.random() * 500 : 0,
          marketMaker: ['ARCA', 'NSDQ', 'BATS', 'EDGX'][Math.floor(Math.random() * 4)],
          timestamp: Date.now() - Math.random() * 60000
        };
        levels.push(level);
      }
      
      setOrderBookData(levels.sort((a, b) => b.price - a.price));
    };

    const generateTimeAndSales = () => {
      const newSale: TimeAndSale = {
        id: Date.now().toString(),
        price: lastPrice + (Math.random() - 0.5) * 0.10,
        size: Math.floor(Math.random() * 1000) + 100,
        side: Math.random() > 0.5 ? 'buy' : 'sell',
        timestamp: Date.now(),
        exchange: ['ARCA', 'NSDQ', 'BATS', 'EDGX'][Math.floor(Math.random() * 4)]
      };
      
      setTimeAndSales(prev => [newSale, ...prev.slice(0, 99)]);
    };

    generateOrderBook();
    const bookInterval = setInterval(generateOrderBook, 1000);
    const salesInterval = setInterval(generateTimeAndSales, 200);

    return () => {
      clearInterval(bookInterval);
      clearInterval(salesInterval);
    };
  }, [lastPrice]);

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const bestBid = orderBookData.find(level => level.bidSize > 0);
  const bestAsk = orderBookData.find(level => level.askSize > 0);

  return (
    <div className="space-y-6">
      {/* Market Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-xs text-foreground/70">Best Bid</p>
                <p className="text-lg font-semibold">${bestBid?.price.toFixed(2)}</p>
                <p className="text-xs text-foreground/70">Size: {bestBid?.bidSize.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <ArrowUp className="h-4 w-4 text-red-600" />
              <div>
                <p className="text-xs text-foreground/70">Best Ask</p>
                <p className="text-lg font-semibold">${bestAsk?.price.toFixed(2)}</p>
                <p className="text-xs text-foreground/70">Size: {bestAsk?.askSize.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-xs text-foreground/70">Spread</p>
                <p className="text-lg font-semibold">${spread.toFixed(2)}</p>
                <p className="text-xs text-foreground/70">{((spread / lastPrice) * 100).toFixed(3)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Volume2 className="h-4 w-4 text-purple-600" />
              <div>
                <p className="text-xs text-foreground/70">Total Volume</p>
                <p className="text-lg font-semibold">2.4M</p>
                <p className="text-xs text-foreground/70">+12.5% vs avg</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="orderbook" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="orderbook">Order Book</TabsTrigger>
          <TabsTrigger value="timesales">Time & Sales</TabsTrigger>
        </TabsList>

        <TabsContent value="orderbook">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Level 2 Order Book - {symbol}</span>
                <Badge variant="secondary" className="gap-1">
                  <Activity className="h-3 w-3" />
                  Live
                </Badge>
              </CardTitle>
              <CardDescription>
                Real-time bid/ask depth with market maker information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-auto max-h-96">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>MM</TableHead>
                      <TableHead className="text-right">Bid Size</TableHead>
                      <TableHead className="text-center">Price</TableHead>
                      <TableHead>Ask Size</TableHead>
                      <TableHead>Time</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orderBookData.map((level, index) => (
                      <TableRow 
                        key={`${level.price}-${index}`}
                        className={cn(
                          level.price === lastPrice ? 'bg-yellow-50 dark:bg-yellow-900/20' : '',
                          level.bidSize > 0 && level.askSize > 0 ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                        )}
                      >
                        <TableCell className="text-xs text-foreground/80">
                          {level.marketMaker}
                        </TableCell>
                        <TableCell className={cn(
                          "text-right font-mono",
                          level.bidSize > 0 ? "text-green-600 bg-green-50 dark:bg-green-900/20" : ""
                        )}>
                          {level.bidSize > 0 ? level.bidSize.toLocaleString() : '-'}
                        </TableCell>
                        <TableCell className="text-center font-mono font-medium">
                          ${level.price.toFixed(2)}
                        </TableCell>
                        <TableCell className={cn(
                          "font-mono",
                          level.askSize > 0 ? "text-red-600 bg-red-50 dark:bg-red-900/20" : ""
                        )}>
                          {level.askSize > 0 ? level.askSize.toLocaleString() : '-'}
                        </TableCell>
                        <TableCell className="text-xs text-foreground/80">
                          {level.timestamp ? formatTime(level.timestamp) : '-'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timesales">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Time & Sales - {symbol}</span>
                <Badge variant="secondary" className="gap-1">
                  <Clock className="h-3 w-3" />
                  Real-time
                </Badge>
              </CardTitle>
              <CardDescription>
                Executed trades with price, size, and exchange information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-auto max-h-96">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Time</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead>Side</TableHead>
                      <TableHead>Exchange</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {timeAndSales.map((sale) => (
                      <TableRow key={sale.id}>
                        <TableCell className="text-xs font-mono">
                          {formatTime(sale.timestamp)}
                        </TableCell>
                        <TableCell className="font-mono">
                          ${sale.price.toFixed(2)}
                        </TableCell>
                        <TableCell className="font-mono">
                          {sale.size.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={sale.side === 'buy' ? 'default' : 'destructive'}
                            className="text-xs"
                          >
                            {sale.side === 'buy' ? (
                              <ArrowUp className="h-3 w-3 mr-1" />
                            ) : (
                              <ArrowDown className="h-3 w-3 mr-1" />
                            )}
                            {sale.side.toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs text-foreground/80">
                          {sale.exchange}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};