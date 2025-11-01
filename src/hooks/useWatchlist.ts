import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
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
    staleTime: 300000, // 5 minutes
  });
};

// Optimistic Watchlist Hook - Instant display with background updates
export const useOptimisticWatchlist = () => {
  const queryClient = useQueryClient();
  const [optimisticData, setOptimisticData] = useState<(StockData & { stale?: boolean })[]>([]);
  const [loadingSymbols, setLoadingSymbols] = useState<Set<string>>(new Set());
  
  // Get watchlist symbols instantly (localStorage, no API)
  const watchlist = watchlistService.getUserWatchlist();
  
  // Initialize with cached/placeholder data immediately
  useEffect(() => {
    const initialData = watchlist.map(item => {
      // Try to get cached data first
      const cachedData = queryClient.getQueryData<StockData>(['symbolData', item.symbol, item.exchange]);
      
      if (cachedData) {
        return { ...cachedData, stale: true }; // Mark as stale but display immediately
      }
      
      // Return placeholder data for instant display
      return {
        symbol: item.symbol,
        name: item.companyName || item.symbol,
        price: 0,
        change: 0,
        changePercent: 0,
        volume: 0,
        marketCap: 0,
        pe: 0,
        dividendYield: 0,
        sector: 'Loading...',
        lastUpdated: Date.now(),
        marketValue: 0,
        position: item.position || 0,
        exchange: item.exchange,
        stale: true, // Flag to show loading indicator
      };
    });
    
    setOptimisticData(initialData);
  }, [watchlist.length]);
  
  // Fetch real data in background (non-blocking)
  useEffect(() => {
    if (!watchlist.length) return;
    
    // Rate limiter - 5 requests per minute
    let requestCount = 0;
    const maxRequests = 5;
    const timeWindow = 60000; // 1 minute
    
    const fetchSymbolData = async (item: UserWatchlistItem, index: number) => {
      // Stagger requests to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, index * 500));
      
      // Rate limiting check
      if (requestCount >= maxRequests) {
        console.warn(`Rate limit reached, delaying ${item.symbol}`);
        await new Promise(resolve => setTimeout(resolve, timeWindow));
        requestCount = 0;
      }
      
      setLoadingSymbols(prev => new Set(prev).add(item.symbol));
      
      try {
        requestCount++;
        const stockData = await marketDataService.getStockDataBySymbol(item.symbol, item.exchange);
        
        // Update optimistic data with real data
        setOptimisticData(prev => 
          prev.map(stock => 
            stock.symbol === item.symbol 
              ? { ...stockData, stale: false, position: item.position || 0 }
              : stock
          )
        );
      } catch (error) {
        console.warn(`Failed to fetch ${item.symbol}:`, error);
        // Keep placeholder data on error
      } finally {
        setLoadingSymbols(prev => {
          const next = new Set(prev);
          next.delete(item.symbol);
          return next;
        });
      }
    };
    
    // Start background fetching
    watchlist.forEach((item, index) => {
      fetchSymbolData(item, index);
    });
  }, [watchlist.length]);
  
  return {
    data: optimisticData,
    isLoading: false, // Never show loading spinner!
    loadingSymbols, // Individual symbols currently fetching
  };
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
  const { data: watchlistData, isLoading, loadingSymbols } = useOptimisticWatchlist();
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
    loadingSymbols,
    predictionSymbols: predictionSymbolsData.length,
    removeSymbol: removeSymbolAction,
  };
};