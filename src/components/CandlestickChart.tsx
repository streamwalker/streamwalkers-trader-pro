import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCandlestickData } from '@/hooks/useMarketData';
import { ComposedChart, XAxis, YAxis, ResponsiveContainer, ReferenceLine, Tooltip, Bar } from 'recharts';
import { format } from 'date-fns';

interface CandlestickChartProps {
  symbol: string;
  supportLevels?: number[];
  resistanceLevels?: number[];
}

const timeframes = [
  { value: '1min', label: '1m' },
  { value: '5min', label: '5m' },
  { value: '15min', label: '15m' },
  { value: '1h', label: '1h' },
  { value: '1d', label: '1d' }
];

const symbols = [
  { value: 'ES', label: 'ES (S&P 500)' },
  { value: 'NQ', label: 'NQ (Nasdaq)' },
  { value: 'YM', label: 'YM (Dow)' },
  { value: 'RTY', label: 'RTY (Russell)' }
];

// Custom Candlestick component for Recharts
const Candlestick = (props: any) => {
  const { payload, x, y, width, height } = props;
  if (!payload) return null;
  
  const { open, close, high, low } = payload;
  const isGreen = close > open;
  const color = isGreen ? 'hsl(var(--success))' : 'hsl(var(--destructive))';
  
  const bodyHeight = Math.abs(close - open);
  const bodyY = Math.min(open, close);
  const wickTop = Math.max(high, Math.max(open, close));
  const wickBottom = Math.min(low, Math.min(open, close));
  
  return (
    <g>
      {/* Wick */}
      <line
        x1={x + width / 2}
        y1={wickTop}
        x2={x + width / 2}
        y2={wickBottom}
        stroke={color}
        strokeWidth={1}
      />
      {/* Body */}
      <rect
        x={x + width * 0.25}
        y={bodyY}
        width={width * 0.5}
        height={bodyHeight || 1}
        fill={isGreen ? 'transparent' : color}
        stroke={color}
        strokeWidth={1}
      />
    </g>
  );
};

export const CandlestickChart = ({ symbol: initialSymbol, supportLevels = [], resistanceLevels = [] }: CandlestickChartProps) => {
  const [selectedSymbol, setSelectedSymbol] = useState(initialSymbol);
  const [selectedTimeframe, setSelectedTimeframe] = useState('1h');
  
  // Handle both futures and stock symbols
  const isStockSymbol = selectedSymbol.startsWith('STOCK:');
  const actualSymbol = isStockSymbol ? selectedSymbol.replace('STOCK:', '') : selectedSymbol;
  
  const { data: candlestickData, isLoading } = useCandlestickData(actualSymbol, selectedTimeframe);

  const chartData = candlestickData?.map(item => ({
    ...item,
    time: new Date(item.time).getTime(),
    formattedTime: format(new Date(item.time), selectedTimeframe === '1min' || selectedTimeframe === '5min' ? 'HH:mm' : 'MMM dd'),
  })) || [];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium">{format(new Date(label), 'MMM dd, yyyy HH:mm')}</p>
          <div className="grid grid-cols-2 gap-2 text-xs mt-2">
            <div>O: {data.open?.toFixed(2)}</div>
            <div>H: {data.high?.toFixed(2)}</div>
            <div>L: {data.low?.toFixed(2)}</div>
            <div>C: {data.close?.toFixed(2)}</div>
          </div>
          <div className="text-xs mt-1">Vol: {data.volume?.toLocaleString()}</div>
        </div>
      );
    }
    return null;
  };

  const handleDownload = () => {
    // Simple implementation - in a real app, you'd capture the chart as image
    const dataStr = JSON.stringify(candlestickData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${selectedSymbol}-${selectedTimeframe}-data.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleFullscreen = () => {
    // For now, just a placeholder - in a real implementation, you'd handle fullscreen
    console.log('Fullscreen requested');
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse">
          <div className="h-[400px] bg-muted rounded-lg"></div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
        <Tabs value={selectedSymbol} onValueChange={setSelectedSymbol} className="w-auto">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="ES">ES</TabsTrigger>
            <TabsTrigger value="NQ">NQ</TabsTrigger>
            <TabsTrigger value="YM">YM</TabsTrigger>
            <TabsTrigger value="RTY">RTY</TabsTrigger>
          </TabsList>
        </Tabs>
        
        {/* Stock Symbol Input */}
        <div className="flex items-center gap-2">
          <Input
            placeholder="Enter stock symbol (e.g., AAPL)"
            value={selectedSymbol.startsWith('STOCK:') ? selectedSymbol.replace('STOCK:', '') : ''}
            onChange={(e) => {
              const value = e.target.value.toUpperCase();
              if (value) {
                setSelectedSymbol(`STOCK:${value}`);
              }
            }}
            className="w-48"
          />
        </div>
          
          <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {timeframes.map(tf => (
                <SelectItem key={tf.value} value={tf.value}>
                  {tf.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleDownload}>
            Export
          </Button>
          <Button variant="outline" size="sm" onClick={handleFullscreen}>
            Fullscreen
          </Button>
        </div>
      </div>

      <div className="w-full h-[400px] bg-background rounded-lg border">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <XAxis 
              dataKey="formattedTime"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
            />
            <YAxis 
              domain={['dataMin - 10', 'dataMax + 10']}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
            />
            <YAxis 
              yAxisId="volume"
              orientation="right"
              domain={[0, 'dataMax']}
              axisLine={false}
              tickLine={false}
              tick={false}
              width={0}
            />
            <Tooltip content={<CustomTooltip />} />
            
            {/* Support Lines */}
            {supportLevels.map((level, idx) => (
              <ReferenceLine 
                key={`support-${idx}`} 
                y={level} 
                stroke="hsl(var(--success))" 
                strokeDasharray="5 5"
                strokeOpacity={0.7}
              />
            ))}
            
            {/* Resistance Lines */}
            {resistanceLevels.map((level, idx) => (
              <ReferenceLine 
                key={`resistance-${idx}`} 
                y={level} 
                stroke="hsl(var(--destructive))" 
                strokeDasharray="5 5"
                strokeOpacity={0.7}
              />
            ))}
            
            {/* Volume Bars */}
            <Bar 
              dataKey="volume" 
              fill="hsl(var(--muted-foreground))" 
              opacity={0.3}
              yAxisId="volume"
            />
            
            {/* Custom Candlestick rendering would go here */}
            {/* For now, we'll use a line chart as a simplified representation */}
            <Bar dataKey="close" fill="hsl(var(--primary))" opacity={0.8} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-success rounded"></div>
            <span>Support</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-destructive rounded"></div>
            <span>Resistance</span>
          </div>
        </div>
        <div>
          {candlestickData && candlestickData.length > 0 && (
            <span>
              Last: {candlestickData[candlestickData.length - 1]?.close.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </Card>
  );
};