import { LiveDataProvider, QuoteData, HistoricalData, NewsItem } from './LiveDataProvider';
import { AlphaVantageProvider } from './AlphaVantageProvider';
import { FinnhubProvider } from './FinnhubProvider';

export class LiveMarketDataService {
  private static instance: LiveMarketDataService;
  private providers: LiveDataProvider[] = [];
  private activeProvider: LiveDataProvider | null = null;
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>();
  private subscriptions = new Map<string, (() => void)[]>();

  private constructor() {
    this.initializeProviders();
  }

  static getInstance(): LiveMarketDataService {
    if (!LiveMarketDataService.instance) {
      LiveMarketDataService.instance = new LiveMarketDataService();
    }
    return LiveMarketDataService.instance;
  }

  private async initializeProviders() {
    // In a real implementation, these would come from Supabase secrets
    const alphaVantageKey = 'demo'; // Replace with actual API key
    const finnhubKey = 'demo'; // Replace with actual API key

    this.providers = [
      new FinnhubProvider(finnhubKey),
      new AlphaVantageProvider(alphaVantageKey)
    ];

    // Try to connect to providers in order of preference
    for (const provider of this.providers) {
      try {
        await provider.connect();
        if (provider.isConnected) {
          this.activeProvider = provider;
          console.log(`Connected to ${provider.name}`);
          break;
        }
      } catch (error) {
        console.warn(`Failed to connect to ${provider.name}:`, error);
      }
    }

    if (!this.activeProvider) {
      console.warn('No live data providers available, using simulated data');
    }
  }

  private getCacheKey(method: string, ...args: any[]): string {
    return `${method}_${args.join('_')}`;
  }

  private async fetchWithCache<T>(
    key: string,
    fetchFn: () => Promise<T>,
    ttl: number = 30000
  ): Promise<T> {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < cached.ttl) {
      return cached.data;
    }

    try {
      const data = await fetchFn();
      this.cache.set(key, { data, timestamp: Date.now(), ttl });
      return data;
    } catch (error) {
      // Return cached data if available, even if expired
      if (cached) {
        console.warn('Using expired cache data due to fetch error:', error);
        return cached.data;
      }
      throw error;
    }
  }

  async getQuote(symbol: string): Promise<QuoteData> {
    const cacheKey = this.getCacheKey('quote', symbol);
    return this.fetchWithCache(
      cacheKey,
      async () => {
        if (this.activeProvider) {
          return await this.activeProvider.getQuote(symbol);
        }
        return this.getSimulatedQuote(symbol);
      },
      5000 // 5 second cache for quotes
    );
  }

  async getMultipleQuotes(symbols: string[]): Promise<QuoteData[]> {
    const promises = symbols.map(symbol => this.getQuote(symbol));
    return Promise.all(promises);
  }

  subscribeToQuotes(symbols: string[], callback: (data: QuoteData) => void): () => void {
    const subscriptionKey = symbols.join(',');
    
    if (this.activeProvider) {
      const unsubscribe = this.activeProvider.subscribeToQuotes(symbols, callback);
      
      if (!this.subscriptions.has(subscriptionKey)) {
        this.subscriptions.set(subscriptionKey, []);
      }
      this.subscriptions.get(subscriptionKey)!.push(unsubscribe);
      
      return () => {
        unsubscribe();
        const subs = this.subscriptions.get(subscriptionKey);
        if (subs) {
          const index = subs.indexOf(unsubscribe);
          if (index > -1) {
            subs.splice(index, 1);
          }
          if (subs.length === 0) {
            this.subscriptions.delete(subscriptionKey);
          }
        }
      };
    } else {
      // Fallback to polling for simulated data
      const interval = setInterval(() => {
        symbols.forEach(symbol => {
          callback(this.getSimulatedQuote(symbol));
        });
      }, 5000);
      
      return () => clearInterval(interval);
    }
  }

  async getHistoricalData(symbol: string, interval: string = 'daily'): Promise<HistoricalData> {
    const cacheKey = this.getCacheKey('historical', symbol, interval);
    return this.fetchWithCache(
      cacheKey,
      async () => {
        if (this.activeProvider) {
          return await this.activeProvider.getHistoricalData(symbol, interval);
        }
        return this.getSimulatedHistoricalData(symbol);
      },
      300000 // 5 minute cache for historical data
    );
  }

  async getMarketNews(symbol?: string): Promise<NewsItem[]> {
    const cacheKey = this.getCacheKey('news', symbol || 'general');
    return this.fetchWithCache(
      cacheKey,
      async () => {
        if (this.activeProvider) {
          return await this.activeProvider.getMarketNews(symbol);
        }
        return [];
      },
      60000 // 1 minute cache for news
    );
  }

  // Market status and hours
  getMarketStatus(): { isOpen: boolean; nextOpen?: number; nextClose?: number } {
    const now = new Date();
    const currentTime = now.getTime();
    const currentHour = now.getHours();
    const currentDay = now.getDay();

    // Basic market hours (9:30 AM - 4:00 PM ET, Monday-Friday)
    const isWeekday = currentDay >= 1 && currentDay <= 5;
    const isMarketHours = currentHour >= 9.5 && currentHour < 16;
    const isOpen = isWeekday && isMarketHours;

    return { isOpen };
  }

  // Utility methods for simulated data (fallback)
  private getSimulatedQuote(symbol: string): QuoteData {
    const basePrice = this.getBasePriceForSymbol(symbol);
    const change = (Math.random() - 0.5) * (basePrice * 0.05);
    
    return {
      symbol,
      price: basePrice + change,
      change,
      changePercent: (change / basePrice) * 100,
      volume: Math.floor(Math.random() * 10000000),
      high: basePrice + Math.abs(change) + Math.random() * 5,
      low: basePrice - Math.abs(change) - Math.random() * 5,
      open: basePrice + (Math.random() - 0.5) * 3,
      previousClose: basePrice,
      timestamp: Date.now()
    };
  }

  private getSimulatedHistoricalData(symbol: string): HistoricalData {
    const data = [];
    let price = this.getBasePriceForSymbol(symbol);
    const now = Date.now();
    
    for (let i = 29; i >= 0; i--) {
      const timestamp = now - (i * 24 * 60 * 60 * 1000);
      const change = (Math.random() - 0.5) * (price * 0.03);
      const open = price;
      const close = price + change;
      const high = Math.max(open, close) + Math.random() * (price * 0.02);
      const low = Math.min(open, close) - Math.random() * (price * 0.02);
      
      data.push({
        timestamp,
        open,
        high,
        low,
        close,
        volume: Math.floor(Math.random() * 10000000)
      });
      
      price = close;
    }
    
    return { symbol, data };
  }

  private getBasePriceForSymbol(symbol: string): number {
    const priceMap: { [key: string]: number } = {
      'AAPL': 175,
      'GOOGL': 2800,
      'MSFT': 340,
      'TSLA': 250,
      'AMZN': 3200,
      'META': 320,
      'NVDA': 450,
      'SPY': 420,
      'QQQ': 360,
      'ES': 4500,
      'NQ': 15000,
      'YM': 34000,
      'RTY': 2000
    };
    
    return priceMap[symbol.toUpperCase()] || 100 + Math.random() * 400;
  }

  // Connection status
  getConnectionStatus(): { provider: string | null; isConnected: boolean } {
    return {
      provider: this.activeProvider?.name || null,
      isConnected: this.activeProvider?.isConnected || false
    };
  }

  // Cleanup
  disconnect(): void {
    // Clear all subscriptions
    this.subscriptions.forEach(subs => {
      subs.forEach(unsub => unsub());
    });
    this.subscriptions.clear();

    // Disconnect providers
    this.providers.forEach(provider => provider.disconnect());
    this.activeProvider = null;
  }
}