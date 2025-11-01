import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCandlestickData } from '@/hooks/useMarketData';
import { createChart, ColorType, CandlestickSeries, HistogramSeries } from 'lightweight-charts';
import type { IChartApi, ISeriesApi, CandlestickData, HistogramData } from 'lightweight-charts';
import { format } from 'date-fns';
import { Plus, Download, Maximize2 } from 'lucide-react';
import { useWatchlistActions } from '@/hooks/useWatchlist';

interface CandlestickChartProps {
  symbol: string;
  supportLevels?: number[];
  resistanceLevels?: number[];
  mode?: 'futures' | 'stock';
}

// Timeframes matching the reference image
const timeframes = [
  { value: '1D', label: '1D' },
  { value: '2D', label: '2D' },
  { value: '5D', label: '5D' },
  { value: '10D', label: '10D' },
  { value: '1M', label: '1M' },
  { value: '3M', label: '3M' },
  { value: '6M', label: '6M' },
  { value: 'YTD', label: 'YTD' },
  { value: '1Y', label: '1Y' },
  { value: '2Y', label: '2Y' },
  { value: '5Y', label: '5Y' },
  { value: '10Y', label: '10Y' },
  { value: 'MAX', label: 'MAX' }
];

// Intraday frequency options
const frequencies = [
  { value: '1min', label: '1 Minute' },
  { value: '5min', label: '5 Minutes' },
  { value: '15min', label: '15 Minutes' },
  { value: '30min', label: '30 Minutes' },
  { value: '1h', label: '1 Hour' },
  { value: '4h', label: '4 Hours' }
];

const symbols = [
  { value: 'ES', label: 'ES (S&P 500)' },
  { value: 'NQ', label: 'NQ (Nasdaq)' },
  { value: 'YM', label: 'YM (Dow)' },
  { value: 'RTY', label: 'RTY (Russell)' }
];

interface OHLCData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export const CandlestickChart = ({ symbol: initialSymbol, supportLevels = [], resistanceLevels = [], mode = 'futures' }: CandlestickChartProps) => {
  const [selectedSymbol, setSelectedSymbol] = useState(initialSymbol);
  const [selectedTimeframe, setSelectedTimeframe] = useState('1M');
  const [selectedFrequency, setSelectedFrequency] = useState('1h');
  const [customSymbol, setCustomSymbol] = useState('');
  const [hoveredCandle, setHoveredCandle] = useState<OHLCData | null>(null);
  const { addSymbol } = useWatchlistActions();
  
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candlestickSeriesRef = useRef<any>(null);
  const volumeSeriesRef = useRef<any>(null);
  
  // Handle both futures and stock symbols
  const isStockSymbol = selectedSymbol.startsWith('STOCK:');
  const actualSymbol = isStockSymbol ? selectedSymbol.replace('STOCK:', '') : selectedSymbol;
  
  // Determine the actual interval to use based on timeframe
  const getInterval = () => {
    if (['1D', '2D', '5D'].includes(selectedTimeframe)) return selectedFrequency;
    if (['10D', '1M'].includes(selectedTimeframe)) return '1h';
    if (['3M', '6M'].includes(selectedTimeframe)) return '1d';
    return '1d'; // For longer timeframes
  };
  
  const { data: candlestickData, isLoading } = useCandlestickData(actualSymbol, getInterval());

  const chartData = candlestickData?.filter(item => {
    const date = new Date(item.timestamp);
    return !isNaN(date.getTime()) && date.getTime() > 0;
  }) || [];

  const hasValidData = chartData.length > 0;
  
  // Get the latest candle for display
  const latestCandle = chartData.length > 0 ? chartData[chartData.length - 1] : null;
  const displayCandle = hoveredCandle || latestCandle;

  // Format volume to M/K
  const formatVolume = (volume: number) => {
    if (volume >= 1000000) return `${(volume / 1000000).toFixed(2)}M`;
    if (volume >= 1000) return `${(volume / 1000).toFixed(2)}K`;
    return volume.toFixed(0);
  };

  const handleDownload = () => {
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
    if (chartContainerRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        chartContainerRef.current.requestFullscreen();
      }
    }
  };

  // Initialize and update chart
  useEffect(() => {
    if (!chartContainerRef.current || !hasValidData) return;

    const container = chartContainerRef.current;
    
    // Create chart
    const chart = createChart(container, {
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: '#666',
      },
      width: container.clientWidth,
      height: 500,
      grid: {
        vertLines: { color: '#f0f0f0' },
        horzLines: { color: '#f0f0f0' },
      },
      rightPriceScale: {
        borderColor: '#e0e0e0',
      },
      timeScale: {
        borderColor: '#e0e0e0',
        timeVisible: true,
        secondsVisible: false,
      },
      crosshair: {
        mode: 1,
      },
    });

    chartRef.current = chart;

    // Add candlestick series
    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderVisible: false,
      wickUpColor: '#26a69a',
      wickDownColor: '#ef5350',
    });
    candlestickSeriesRef.current = candlestickSeries;

    // Add volume series
    const volumeSeries = chart.addSeries(HistogramSeries, {
      color: '#26a69a',
      priceFormat: {
        type: 'volume',
      },
      priceScaleId: '',
    });
    volumeSeriesRef.current = volumeSeries;

    // Apply scale margins to volume series
    volumeSeries.priceScale().applyOptions({
      scaleMargins: {
        top: 0.8,
        bottom: 0,
      },
    });

    // Transform and set data
    const formattedCandleData = chartData.map(item => ({
      time: Math.floor(item.timestamp / 1000) as any,
      open: item.open,
      high: item.high,
      low: item.low,
      close: item.close,
    }));

    const formattedVolumeData = chartData.map(item => ({
      time: Math.floor(item.timestamp / 1000) as any,
      value: item.volume,
      color: item.close >= item.open ? '#26a69a80' : '#ef535080',
    }));

    candlestickSeries.setData(formattedCandleData);
    volumeSeries.setData(formattedVolumeData);

    // Add support/resistance lines
    supportLevels.forEach(level => {
      candlestickSeries.createPriceLine({
        price: level,
        color: '#26a69a',
        lineWidth: 1,
        lineStyle: 2, // Dashed
        axisLabelVisible: true,
        title: 'Support',
      });
    });

    resistanceLevels.forEach(level => {
      candlestickSeries.createPriceLine({
        price: level,
        color: '#ef5350',
        lineWidth: 1,
        lineStyle: 2, // Dashed
        axisLabelVisible: true,
        title: 'Resistance',
      });
    });

    // Subscribe to crosshair move for hover data
    chart.subscribeCrosshairMove((param) => {
      if (param.time && param.seriesData.get(candlestickSeries)) {
        const data = param.seriesData.get(candlestickSeries) as any;
        if (data) {
          const originalData = chartData.find(
            item => Math.floor(item.timestamp / 1000) === param.time
          );
          if (originalData) {
            setHoveredCandle({
              time: format(new Date(originalData.timestamp), 'MMM dd, yyyy HH:mm'),
              open: originalData.open,
              high: originalData.high,
              low: originalData.low,
              close: originalData.close,
              volume: originalData.volume,
            });
          }
        }
      } else {
        setHoveredCandle(null);
      }
    });

    // Fit content
    chart.timeScale().fitContent();

    // Handle resize
    const handleResize = () => {
      if (container && chartRef.current) {
        chartRef.current.applyOptions({
          width: container.clientWidth,
        });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
      chartRef.current = null;
    };
  }, [chartData, hasValidData, supportLevels, resistanceLevels]);

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse">
          <div className="h-[600px] bg-muted rounded-lg"></div>
        </div>
      </Card>
    );
  }

  if (!isLoading && !hasValidData) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center h-[600px] text-muted-foreground">
          <div className="text-center space-y-2">
            <p className="text-lg font-medium">No chart data available</p>
            <p className="text-sm">This symbol may not have data for the selected timeframe</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 space-y-4">
      {/* Symbol Header and Controls */}
      <div className="flex items-center justify-between">
        {mode === 'stock' ? (
          <h3 className="text-xl font-bold font-mono">{actualSymbol}</h3>
        ) : (
          <div className="flex items-center gap-3">
            <Select value={selectedSymbol} onValueChange={setSelectedSymbol}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {symbols.map(s => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <div className="flex items-center gap-2">
              <Input
                placeholder="Stock symbol"
                value={customSymbol}
                onChange={(e) => {
                  const value = e.target.value.toUpperCase();
                  setCustomSymbol(value);
                  if (value) {
                    setSelectedSymbol(`STOCK:${value}`);
                  }
                }}
                className="w-32"
              />
              {customSymbol && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => addSymbol(customSymbol, 'NASDAQ')}
                  className="gap-1"
                >
                  <Plus className="h-3 w-3" />
                  Add
                </Button>
              )}
            </div>
          </div>
        )}

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={handleDownload}>
            <Download className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleFullscreen}>
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* OHLCV Summary */}
      {displayCandle && (
        <div className="flex items-center gap-6 text-sm">
          <span className="text-muted-foreground">
            {'time' in displayCandle ? displayCandle.time : format(new Date((displayCandle as any).timestamp), 'MMM dd, yyyy')}
          </span>
          <span className="font-mono">O: <span className="font-semibold">{displayCandle.open.toFixed(2)}</span></span>
          <span className="font-mono">H: <span className="font-semibold">{displayCandle.high.toFixed(2)}</span></span>
          <span className="font-mono">L: <span className="font-semibold">{displayCandle.low.toFixed(2)}</span></span>
          <span className={`font-mono ${displayCandle.close >= displayCandle.open ? 'text-[#26a69a]' : 'text-[#ef5350]'}`}>
            C: <span className="font-semibold">{displayCandle.close.toFixed(2)}</span>
          </span>
          <span className="font-mono text-muted-foreground">V: {formatVolume(displayCandle.volume)}</span>
        </div>
      )}

      {/* Timeframe Selector */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1 flex-wrap">
          {timeframes.map(tf => (
            <Button
              key={tf.value}
              variant={selectedTimeframe === tf.value ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setSelectedTimeframe(tf.value)}
              className="h-8 px-3"
            >
              {tf.label}
            </Button>
          ))}
        </div>
        
        <div className="ml-auto">
          <Select value={selectedFrequency} onValueChange={setSelectedFrequency}>
            <SelectTrigger className="w-32 h-8">
              <SelectValue placeholder="Frequency" />
            </SelectTrigger>
            <SelectContent>
              {frequencies.map(freq => (
                <SelectItem key={freq.value} value={freq.value}>
                  {freq.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Chart Container */}
      <div 
        ref={chartContainerRef} 
        className="w-full h-[500px] bg-white rounded-lg border"
      />

      {/* Legend */}
      {(supportLevels.length > 0 || resistanceLevels.length > 0) && (
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          {supportLevels.length > 0 && (
            <div className="flex items-center gap-2">
              <div className="w-3 h-0.5 bg-[#26a69a] border-dashed"></div>
              <span>Support</span>
            </div>
          )}
          {resistanceLevels.length > 0 && (
            <div className="flex items-center gap-2">
              <div className="w-3 h-0.5 bg-[#ef5350] border-dashed"></div>
              <span>Resistance</span>
            </div>
          )}
        </div>
      )}
    </Card>
  );
};