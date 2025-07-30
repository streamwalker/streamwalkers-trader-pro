import { useQuery } from '@tanstack/react-query';
import CryptoFuturesService, { CryptoFuturesData, CryptoOpportunity } from '@/services/CryptoFuturesService';
import AdvancedPatternService, { PatternResult } from '@/services/AdvancedPatternService';

const cryptoService = CryptoFuturesService.getInstance();
const patternService = AdvancedPatternService.getInstance();

export const useCryptoFuturesData = () => {
  return useQuery<CryptoFuturesData[]>({
    queryKey: ['cryptoFuturesData'],
    queryFn: () => cryptoService.getCryptoFuturesData(),
    refetchInterval: 15000, // Refetch every 15 seconds for crypto
    staleTime: 10000, // Consider data stale after 10 seconds
  });
};

export const useCryptoOpportunities = () => {
  return useQuery<CryptoOpportunity[]>({
    queryKey: ['cryptoOpportunities'],
    queryFn: () => cryptoService.getHighVolatilityOpportunities(),
    refetchInterval: 30000, // Refetch every 30 seconds
    staleTime: 25000,
  });
};

export const useMomentumScalping = () => {
  return useQuery<CryptoOpportunity[]>({
    queryKey: ['momentumScalping'],
    queryFn: () => cryptoService.getMomentumScalping(),
    refetchInterval: 10000, // Refetch every 10 seconds for scalping
    staleTime: 8000,
  });
};

export const useMarketRegime = () => {
  return useQuery({
    queryKey: ['marketRegime'],
    queryFn: () => cryptoService.getMarketRegime(),
    refetchInterval: 60000, // Refetch every minute
    staleTime: 55000,
  });
};

export const usePatternSetups = (symbols: string[] = ['SPY', 'QQQ', 'AAPL', 'TSLA', 'NVDA']) => {
  return useQuery<PatternResult[]>({
    queryKey: ['patternSetups', symbols.join(',')],
    queryFn: () => patternService.scanForHighProbabilitySetups(symbols),
    refetchInterval: 30000, // Refetch every 30 seconds
    staleTime: 25000,
  });
};

export const useScalpingSetups = () => {
  return useQuery<PatternResult[]>({
    queryKey: ['scalpingSetups'],
    queryFn: () => patternService.getIntradayScalpingSetups(),
    refetchInterval: 15000, // Refetch every 15 seconds for scalping
    staleTime: 12000,
  });
};

export const useEarningsSetups = () => {
  return useQuery<PatternResult[]>({
    queryKey: ['earningsSetups'],
    queryFn: () => patternService.getEarningsReactionSetups(),
    refetchInterval: 60000, // Refetch every minute
    staleTime: 55000,
  });
};

// Combined hook for comprehensive market data
export const useAdvancedMarketData = () => {
  const cryptoData = useCryptoFuturesData();
  const cryptoOpportunities = useCryptoOpportunities();
  const scalping = useMomentumScalping();
  const regime = useMarketRegime();
  const patterns = usePatternSetups();
  const scalpingSetups = useScalpingSetups();
  const earningsSetups = useEarningsSetups();

  return {
    cryptoData: cryptoData.data,
    cryptoOpportunities: cryptoOpportunities.data,
    momentumScalping: scalping.data,
    marketRegime: regime.data,
    patternSetups: patterns.data,
    scalpingSetups: scalpingSetups.data,
    earningsSetups: earningsSetups.data,
    isLoading: 
      cryptoData.isLoading || 
      cryptoOpportunities.isLoading || 
      scalping.isLoading || 
      regime.isLoading || 
      patterns.isLoading ||
      scalpingSetups.isLoading ||
      earningsSetups.isLoading,
    hasData: !!(
      cryptoData.data || 
      cryptoOpportunities.data || 
      scalping.data || 
      patterns.data ||
      scalpingSetups.data ||
      earningsSetups.data
    ),
    lastUpdated: Math.max(
      cryptoData.dataUpdatedAt || 0,
      cryptoOpportunities.dataUpdatedAt || 0,
      scalping.dataUpdatedAt || 0,
      regime.dataUpdatedAt || 0,
      patterns.dataUpdatedAt || 0,
      scalpingSetups.dataUpdatedAt || 0,
      earningsSetups.dataUpdatedAt || 0
    )
  };
};