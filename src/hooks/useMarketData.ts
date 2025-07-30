import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import MarketDataService, { FuturesData, MarketCondition, VIXData, TradingSignal, CandlestickData, StockData, PortfolioData } from '@/services/MarketDataService';
import { QuoteData } from '@/services/LiveDataProvider';

const marketDataService = MarketDataService.getInstance();

export const useFuturesData = () => {
  return useQuery<FuturesData[]>({
    queryKey: ['futuresData'],
    queryFn: () => marketDataService.getFuturesData(),
    refetchInterval: 30000, // Refetch every 30 seconds
    staleTime: 25000, // Consider data stale after 25 seconds
  });
};

export const useVIXData = () => {
  return useQuery<VIXData>({
    queryKey: ['vixData'],
    queryFn: () => marketDataService.getVIXData(),
    refetchInterval: 30000,
    staleTime: 25000,
  });
};

export const useMarketConditions = () => {
  return useQuery<MarketCondition[]>({
    queryKey: ['marketConditions'],
    queryFn: () => marketDataService.getMarketConditions(),
    refetchInterval: 30000,
    staleTime: 25000,
  });
};

export const useTradingSignals = () => {
  return useQuery<TradingSignal[]>({
    queryKey: ['tradingSignals'],
    queryFn: () => marketDataService.getTradingSignals(),
    refetchInterval: 30000,
    staleTime: 25000,
  });
};

export const useKeyLevels = (symbol: string) => {
  return useQuery<{ resistance: number[]; support: number[] }>({
    queryKey: ['keyLevels', symbol],
    queryFn: () => marketDataService.getKeyLevels(symbol),
    refetchInterval: 60000, // Refetch every minute for levels
    staleTime: 55000,
  });
};

export const useCandlestickData = (symbol: string, timeframe: string = '1h') => {
  return useQuery<CandlestickData[]>({
    queryKey: ['candlestickData', symbol, timeframe],
    queryFn: () => marketDataService.getCandlestickData(symbol, timeframe),
    refetchInterval: timeframe === '1min' ? 10000 : timeframe === '5min' ? 30000 : 60000,
    staleTime: timeframe === '1min' ? 8000 : timeframe === '5min' ? 25000 : 55000,
  });
};

export const useStockData = () => {
  return useQuery<StockData[]>({
    queryKey: ['stockData'],
    queryFn: () => marketDataService.getStockData(),
    refetchInterval: 30000, // Refetch every 30 seconds
    staleTime: 25000, // Consider data stale after 25 seconds
  });
};

export const usePortfolioData = () => {
  return useQuery<PortfolioData>({
    queryKey: ['portfolioData'],
    queryFn: () => marketDataService.getPortfolioData(),
    refetchInterval: 30000, // Refetch every 30 seconds
    staleTime: 25000, // Consider data stale after 25 seconds
  });
};

// Real-time data hooks with WebSocket subscriptions
export const useRealTimeQuote = (symbol: string) => {
  const [quote, setQuote] = useState<QuoteData | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!symbol) return;

    const unsubscribe = marketDataService.subscribeToSymbol(symbol, (data: QuoteData) => {
      setQuote(data);
      setIsConnected(true);
      
      // Update React Query cache with real-time data
      queryClient.setQueryData(['quote', symbol], data);
      
      // Invalidate related queries to trigger refetch
      queryClient.invalidateQueries({ queryKey: ['futuresData'] });
      queryClient.invalidateQueries({ queryKey: ['stockData'] });
    });

    return () => {
      unsubscribe();
      setIsConnected(false);
    };
  }, [symbol, queryClient]);

  return { quote, isConnected };
};

export const useRealTimeQuotes = (symbols: string[]) => {
  const [quotes, setQuotes] = useState<{ [symbol: string]: QuoteData }>({});
  const [isConnected, setIsConnected] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!symbols.length) return;

    const quotesMap: { [symbol: string]: QuoteData } = {};

    const unsubscribe = marketDataService.subscribeToMultipleSymbols(symbols, (data: QuoteData) => {
      quotesMap[data.symbol] = data;
      setQuotes({ ...quotesMap });
      setIsConnected(true);
      
      // Update React Query cache
      queryClient.setQueryData(['quote', data.symbol], data);
      
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['futuresData'] });
      queryClient.invalidateQueries({ queryKey: ['stockData'] });
      queryClient.invalidateQueries({ queryKey: ['portfolioData'] });
    });

    return () => {
      unsubscribe();
      setIsConnected(false);
    };
  }, [symbols.join(','), queryClient]);

  return { quotes, isConnected };
};

// Connection status hook
export const useMarketDataConnection = () => {
  const [connectionStatus, setConnectionStatus] = useState(marketDataService.getConnectionStatus());
  const [marketStatus, setMarketStatus] = useState(marketDataService.getMarketStatus());

  useEffect(() => {
    const interval = setInterval(() => {
      setConnectionStatus(marketDataService.getConnectionStatus());
      setMarketStatus(marketDataService.getMarketStatus());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return { connectionStatus, marketStatus };
};

// Enhanced hook for live market data with fallback
export const useLiveMarketData = () => {
  const futuresData = useFuturesData();
  const vixData = useVIXData();
  const marketConditions = useMarketConditions();
  const connection = useMarketDataConnection();
  
  return {
    ...futuresData,
    vixData: vixData.data,
    marketConditions: marketConditions.data,
    connectionStatus: connection.connectionStatus,
    marketStatus: connection.marketStatus,
    isLive: connection.connectionStatus.isConnected,
    lastUpdated: Math.max(
      futuresData.dataUpdatedAt || 0,
      vixData.dataUpdatedAt || 0,
      marketConditions.dataUpdatedAt || 0
    )
  };
};