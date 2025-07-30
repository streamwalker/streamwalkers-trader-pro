import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TrendingUp, TrendingDown, Volume2, DollarSign, BarChart3, Plus } from 'lucide-react';
import { useStockData } from '@/hooks/useMarketData';
import { useWatchlistActions } from '@/hooks/useWatchlist';
import { StockData } from '@/services/MarketDataService';

interface ScreenerCriteria {
  minPrice: number | null;
  maxPrice: number | null;
  minVolume: number | null;
  minMarketCap: number | null;
  minChangePercent: number | null;
  maxChangePercent: number | null;
  sector: string;
}

const prebuiltScreens = [
  { id: 'top-gainers', name: 'Top Gainers', icon: TrendingUp },
  { id: 'top-losers', name: 'Top Losers', icon: TrendingDown },
  { id: 'most-active', name: 'Most Active', icon: Volume2 },
  { id: 'high-value', name: 'High Value Stocks', icon: DollarSign },
  { id: 'breakouts', name: 'Technical Breakouts', icon: BarChart3 },
];

export const StockScreener = () => {
  const [activeScreen, setActiveScreen] = useState<string>('custom');
  const [criteria, setCriteria] = useState<ScreenerCriteria>({
    minPrice: null,
    maxPrice: null,
    minVolume: null,
    minMarketCap: null,
    minChangePercent: null,
    maxChangePercent: null,
    sector: 'all'
  });
  const [filteredStocks, setFilteredStocks] = useState<StockData[]>([]);
  
  const { data: stockData } = useStockData();
  const { addSymbol } = useWatchlistActions();

  const applyPrebuiltScreen = (screenId: string) => {
    if (!stockData) return [];
    
    let filtered = [...stockData];
    
    switch (screenId) {
      case 'top-gainers':
        filtered = filtered.filter(stock => stock.changePercent > 5).sort((a, b) => b.changePercent - a.changePercent);
        break;
      case 'top-losers':
        filtered = filtered.filter(stock => stock.changePercent < -5).sort((a, b) => a.changePercent - b.changePercent);
        break;
      case 'most-active':
        filtered = filtered.sort((a, b) => b.volume - a.volume);
        break;
      case 'high-value':
        filtered = filtered.filter(stock => stock.price > 100);
        break;
      case 'breakouts':
        filtered = filtered.filter(stock => stock.changePercent > 3 && stock.volume > 1000000);
        break;
      default:
        return applyCustomCriteria();
    }
    
    return filtered.slice(0, 50);
  };

  const applyCustomCriteria = () => {
    if (!stockData) return [];
    
    return stockData.filter(stock => {
      if (criteria.minPrice && stock.price < criteria.minPrice) return false;
      if (criteria.maxPrice && stock.price > criteria.maxPrice) return false;
      if (criteria.minVolume && stock.volume < criteria.minVolume) return false;
      if (criteria.minChangePercent && stock.changePercent < criteria.minChangePercent) return false;
      if (criteria.maxChangePercent && stock.changePercent > criteria.maxChangePercent) return false;
      return true;
    }).slice(0, 50);
  };

  useEffect(() => {
    if (activeScreen === 'custom') {
      setFilteredStocks(applyCustomCriteria());
    } else {
      setFilteredStocks(applyPrebuiltScreen(activeScreen));
    }
  }, [stockData, criteria, activeScreen]);

  const formatMarketCap = (volume: number) => {
    const marketCap = volume * 50; // Simplified calculation
    if (marketCap >= 1e9) return `$${(marketCap / 1e9).toFixed(1)}B`;
    if (marketCap >= 1e6) return `$${(marketCap / 1e6).toFixed(1)}M`;
    return `$${(marketCap / 1e3).toFixed(1)}K`;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Stock Screener
          </CardTitle>
          <CardDescription>
            Filter and discover stocks based on your criteria
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Pre-built Screens */}
          <div>
            <h3 className="text-sm font-medium mb-3">Pre-built Screens</h3>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={activeScreen === 'custom' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveScreen('custom')}
              >
                Custom
              </Button>
              {prebuiltScreens.map(screen => {
                const Icon = screen.icon;
                return (
                  <Button
                    key={screen.id}
                    variant={activeScreen === screen.id ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setActiveScreen(screen.id)}
                  >
                    <Icon className="h-3 w-3 mr-1" />
                    {screen.name}
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Custom Criteria */}
          {activeScreen === 'custom' && (
            <div>
              <h3 className="text-sm font-medium mb-3">Custom Criteria</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <div>
                  <label className="text-xs text-muted-foreground">Min Price</label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={criteria.minPrice || ''}
                    onChange={(e) => setCriteria(prev => ({
                      ...prev,
                      minPrice: e.target.value ? Number(e.target.value) : null
                    }))}
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Max Price</label>
                  <Input
                    type="number"
                    placeholder="1000"
                    value={criteria.maxPrice || ''}
                    onChange={(e) => setCriteria(prev => ({
                      ...prev,
                      maxPrice: e.target.value ? Number(e.target.value) : null
                    }))}
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Min Volume</label>
                  <Input
                    type="number"
                    placeholder="100000"
                    value={criteria.minVolume || ''}
                    onChange={(e) => setCriteria(prev => ({
                      ...prev,
                      minVolume: e.target.value ? Number(e.target.value) : null
                    }))}
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Min Change %</label>
                  <Input
                    type="number"
                    placeholder="-10"
                    value={criteria.minChangePercent || ''}
                    onChange={(e) => setCriteria(prev => ({
                      ...prev,
                      minChangePercent: e.target.value ? Number(e.target.value) : null
                    }))}
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Max Change %</label>
                  <Input
                    type="number"
                    placeholder="10"
                    value={criteria.maxChangePercent || ''}
                    onChange={(e) => setCriteria(prev => ({
                      ...prev,
                      maxChangePercent: e.target.value ? Number(e.target.value) : null
                    }))}
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Sector</label>
                  <Select value={criteria.sector} onValueChange={(value) => setCriteria(prev => ({ ...prev, sector: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Sectors</SelectItem>
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="energy">Energy</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Screening Results ({filteredStocks.length})</span>
            <Badge variant="secondary">Live Data</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Symbol</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Change</TableHead>
                  <TableHead>Change %</TableHead>
                  <TableHead>Volume</TableHead>
                  <TableHead>Market Cap</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStocks.map((stock) => (
                  <TableRow key={stock.symbol}>
                    <TableCell className="font-medium">{stock.symbol}</TableCell>
                    <TableCell>${stock.price.toFixed(2)}</TableCell>
                    <TableCell className={stock.change >= 0 ? 'text-green-600' : 'text-red-600'}>
                      {stock.change >= 0 ? '+' : ''}${stock.change.toFixed(2)}
                    </TableCell>
                    <TableCell className={stock.changePercent >= 0 ? 'text-green-600' : 'text-red-600'}>
                      {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                    </TableCell>
                    <TableCell>{stock.volume.toLocaleString()}</TableCell>
                    <TableCell>{formatMarketCap(stock.volume)}</TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => addSymbol(stock.symbol, stock.exchange)}
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Add
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};