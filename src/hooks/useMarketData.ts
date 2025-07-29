import { useQuery } from '@tanstack/react-query';
import MarketDataService, { FuturesData, MarketCondition, VIXData, TradingSignal } from '@/services/MarketDataService';

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