import { useQuery, useQueryClient } from '@tanstack/react-query';
import { UserWatchlistItem, SymbolSearchResult } from '@/types/watchlist';
import WatchlistService from '@/services/WatchlistService';
import MarketDataService, { StockData } from '@/services/MarketDataService';

const watchlistService = WatchlistService.getInstance();
const marketDataService = MarketDataService.getInstance();

// Get user's watchlist
export const useWatchlist = () => {
  return useQuery<UserWatchlistItem[]>({
    queryKey: ['watchlist'],
    queryFn: () => watchlistService.getUserWatchlist(),
    staleTime: 0, // Always refetch to ensure localStorage sync
  });
};

// Get live data for watchlist symbols
export const useWatchlistData = () => {
  const { data: watchlist } = useWatchlist();
  
  return useQuery<StockData[]>({
    queryKey: ['watchlistData', watchlist?.map(item => `${item.symbol}-${item.exchange}`).join(',')],
    queryFn: async () => {
      if (!watchlist?.length) return [];
      
      const promises = watchlist.map(async (item) => {
        const stockData = await marketDataService.getStockDataBySymbol(item.symbol, item.exchange);
        return {
          ...stockData,
          position: item.position || 0,
          marketValue: (item.position || 0) * stockData.price,
        };
      });
      
      return Promise.all(promises);
    },
    enabled: !!watchlist?.length,
    refetchInterval: 30000, // Refetch every 30 seconds
    staleTime: 25000,
  });
};

// Search symbols
export const useSymbolSearch = (query: string) => {
  return useQuery<SymbolSearchResult[]>({
    queryKey: ['symbolSearch', query],
    queryFn: () => watchlistService.searchSymbols(query),
    enabled: query.length >= 2,
    staleTime: 300000, // 5 minutes
  });
};

// Get data for a specific symbol
export const useSymbolData = (symbol: string, exchange: string = 'NASDAQ') => {
  return useQuery<StockData>({
    queryKey: ['symbolData', symbol, exchange],
    queryFn: () => marketDataService.getStockDataBySymbol(symbol, exchange),
    enabled: !!symbol,
    refetchInterval: 30000,
    staleTime: 25000,
  });
};

// Watchlist actions hook
export const useWatchlistActions = () => {
  const queryClient = useQueryClient();

  const addSymbol = (symbol: string, exchange: string = 'NASDAQ', position?: number): boolean => {
    try {
      if (!watchlistService.validateSymbol(symbol, exchange)) {
        return false;
      }
      
      watchlistService.addSymbolToWatchlist(symbol, exchange, position);
      
      // Invalidate and refetch watchlist data
      queryClient.invalidateQueries({ queryKey: ['watchlist'] });
      queryClient.invalidateQueries({ queryKey: ['watchlistData'] });
      
      return true;
    } catch (error) {
      console.error('Error adding symbol:', error);
      return false;
    }
  };

  const removeSymbol = (symbol: string, exchange: string): boolean => {
    try {
      const success = watchlistService.removeSymbolFromWatchlist(symbol, exchange);
      
      if (success) {
        // Invalidate and refetch watchlist data
        queryClient.invalidateQueries({ queryKey: ['watchlist'] });
        queryClient.invalidateQueries({ queryKey: ['watchlistData'] });
      }
      
      return success;
    } catch (error) {
      console.error('Error removing symbol:', error);
      return false;
    }
  };

  const updatePosition = (symbol: string, exchange: string, position: number): boolean => {
    try {
      const success = watchlistService.updateSymbolPosition(symbol, exchange, position);
      
      if (success) {
        // Invalidate and refetch watchlist data
        queryClient.invalidateQueries({ queryKey: ['watchlist'] });
        queryClient.invalidateQueries({ queryKey: ['watchlistData'] });
      }
      
      return success;
    } catch (error) {
      console.error('Error updating position:', error);
      return false;
    }
  };

  const clearWatchlist = (): void => {
    try {
      watchlistService.clearWatchlist();
      
      // Invalidate and refetch watchlist data
      queryClient.invalidateQueries({ queryKey: ['watchlist'] });
      queryClient.invalidateQueries({ queryKey: ['watchlistData'] });
    } catch (error) {
      console.error('Error clearing watchlist:', error);
    }
  };

  const exportWatchlist = (): string => {
    return watchlistService.exportWatchlist();
  };

  const importWatchlist = (jsonData: string): boolean => {
    try {
      const success = watchlistService.importWatchlist(jsonData);
      
      if (success) {
        // Invalidate and refetch watchlist data
        queryClient.invalidateQueries({ queryKey: ['watchlist'] });
        queryClient.invalidateQueries({ queryKey: ['watchlistData'] });
      }
      
      return success;
    } catch (error) {
      console.error('Error importing watchlist:', error);
      return false;
    }
  };

  return {
    addSymbol,
    removeSymbol,
    updatePosition,
    clearWatchlist,
    exportWatchlist,
    importWatchlist,
  };
};

// Oracle Watchlist Hook - Enhanced with prediction data
export const useOracleWatchlist = (predictions?: any[]) => {
  const { data: watchlist } = useWatchlist();
  const { data: watchlistData, isLoading } = useWatchlistData();
  const { addSymbol, removeSymbol: removeSymbolAction } = useWatchlistActions();

  // Extract symbols from predictions with metadata
  const extractSymbolsFromPredictions = () => {
    if (!predictions || predictions.length === 0) return [];
    
    const symbolMap = new Map();
    
    predictions.forEach(pred => {
      pred.trade_recommendations?.forEach((rec: any) => {
        rec.symbols?.forEach((symbol: string) => {
          if (!symbolMap.has(symbol)) {
            symbolMap.set(symbol, {
              symbol,
              exchange: 'NASDAQ',
              action: rec.action,
              confidence: rec.confidence,
              entry: rec.entry,
              target: rec.target,
              stop_loss: rec.stop_loss,
              sector: rec.sector,
              reasoning: rec.reasoning,
              timeframe: rec.timeframe,
              fromPrediction: true,
            });
          }
        });
      });
    });
    
    return Array.from(symbolMap.values());
  };

  const predictionSymbolsData = extractSymbolsFromPredictions();

  // Auto-add prediction symbols to watchlist
  predictionSymbolsData.forEach(symbolData => {
    const existsInWatchlist = watchlist?.some(
      item => item.symbol === symbolData.symbol && item.exchange === symbolData.exchange
    );
    
    if (!existsInWatchlist) {
      addSymbol(symbolData.symbol, symbolData.exchange);
    }
  });

  // Merge watchlist data with prediction metadata
  const enhancedWatchlistData = watchlistData?.map(stockData => {
    const predictionData = predictionSymbolsData.find(
      p => p.symbol === stockData.symbol
    );
    
    return {
      ...stockData,
      action: predictionData?.action,
      confidence: predictionData?.confidence,
      entry: predictionData?.entry,
      target: predictionData?.target,
      stop_loss: predictionData?.stop_loss,
      reasoning: predictionData?.reasoning,
      timeframe: predictionData?.timeframe,
      fromPrediction: predictionData?.fromPrediction || false,
    };
  });

  return {
    enhancedWatchlistData,
    isLoading,
    predictionSymbols: predictionSymbolsData.length,
    removeSymbol: removeSymbolAction,
  };
};