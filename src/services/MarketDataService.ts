interface FuturesData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  timestamp: Date;
}

interface MarketCondition {
  metric: string;
  value: string;
  trend: 'up' | 'down';
  color: string;
}

interface VIXData {
  value: number;
  level: string;
  timestamp: Date;
}

interface TradingSignal {
  symbol: string;
  signal: 'Buy' | 'Sell' | 'Hold';
  strength: 'Strong' | 'Moderate' | 'Weak';
  price: number;
  target: number;
  confidence: number;
}

class MarketDataService {
  private static instance: MarketDataService;
  private cache = new Map<string, { data: any; timestamp: number }>();
  private readonly CACHE_DURATION = 30 * 1000; // 30 seconds
  private readonly API_KEY = 'demo'; // Replace with actual API key in production

  static getInstance(): MarketDataService {
    if (!MarketDataService.instance) {
      MarketDataService.instance = new MarketDataService();
    }
    return MarketDataService.instance;
  }

  private async fetchWithCache<T>(key: string, fetchFn: () => Promise<T>): Promise<T> {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data;
    }

    try {
      const data = await fetchFn();
      this.cache.set(key, { data, timestamp: Date.now() });
      return data;
    } catch (error) {
      // Return cached data if available during error
      if (cached) {
        return cached.data;
      }
      throw error;
    }
  }

  async getFuturesData(): Promise<FuturesData[]> {
    return this.fetchWithCache('futures', async () => {
      // Simulate live data for demo (replace with actual API calls)
      const baseData = [
        { symbol: 'ES', basePrice: 4567.25 },
        { symbol: 'NQ', basePrice: 15234.50 },
        { symbol: 'YM', basePrice: 37892.25 },
        { symbol: 'RTY', basePrice: 2089.75 }
      ];

      return baseData.map(item => {
        const change = (Math.random() - 0.5) * 50; // Random change for demo
        const price = item.basePrice + change;
        return {
          symbol: item.symbol,
          price,
          change,
          changePercent: (change / item.basePrice) * 100,
          timestamp: new Date()
        };
      });
    });
  }

  async getVIXData(): Promise<VIXData> {
    return this.fetchWithCache('vix', async () => {
      // Simulate VIX data (replace with actual API call)
      const value = 15 + Math.random() * 10; // Random between 15-25
      let level = 'Low';
      if (value > 20) level = 'Medium';
      if (value > 30) level = 'High';

      return {
        value: Number(value.toFixed(1)),
        level,
        timestamp: new Date()
      };
    });
  }

  async getMarketConditions(): Promise<MarketCondition[]> {
    return this.fetchWithCache('conditions', async () => {
      // Calculate conditions based on live data
      const futuresData = await this.getFuturesData();
      const vixData = await this.getVIXData();
      
      // Calculate average change to determine market trend
      const avgChange = futuresData.reduce((sum, item) => sum + item.changePercent, 0) / futuresData.length;
      const isPositive = avgChange > 0;

      return [
        { 
          metric: "Market Volatility", 
          value: vixData.level, 
          trend: vixData.value > 20 ? "up" : "down", 
          color: vixData.value > 20 ? "yellow" : "green" 
        },
        { 
          metric: "Trend Strength", 
          value: Math.abs(avgChange) > 0.5 ? "Strong" : "Moderate", 
          trend: isPositive ? "up" : "down", 
          color: isPositive ? "green" : "red" 
        },
        { 
          metric: "Volume Profile", 
          value: "Above Average", 
          trend: "up", 
          color: "blue" 
        },
        { 
          metric: "Momentum", 
          value: isPositive ? "Bullish" : "Bearish", 
          trend: isPositive ? "up" : "down", 
          color: isPositive ? "green" : "red" 
        },
      ];
    });
  }

  async getTradingSignals(): Promise<TradingSignal[]> {
    return this.fetchWithCache('signals', async () => {
      const futuresData = await this.getFuturesData();
      
      return futuresData.map(item => {
        const changeAbs = Math.abs(item.changePercent);
        let signal: 'Buy' | 'Sell' | 'Hold';
        let strength: 'Strong' | 'Moderate' | 'Weak';
        let confidence: number;

        // Simple signal generation based on price movement
        if (item.changePercent > 0.3) {
          signal = 'Buy';
          strength = changeAbs > 1 ? 'Strong' : 'Moderate';
          confidence = Math.min(90, 70 + changeAbs * 10);
        } else if (item.changePercent < -0.3) {
          signal = 'Sell';
          strength = changeAbs > 1 ? 'Strong' : 'Moderate';
          confidence = Math.min(90, 70 + changeAbs * 10);
        } else {
          signal = 'Hold';
          strength = 'Weak';
          confidence = 50 + Math.random() * 20;
        }

        const target = item.price + (signal === 'Buy' ? 50 : signal === 'Sell' ? -50 : 10);

        return {
          symbol: item.symbol,
          signal,
          strength,
          price: item.price,
          target,
          confidence: Math.round(confidence)
        };
      });
    });
  }

  async getKeyLevels(symbol: string): Promise<{ resistance: number[]; support: number[] }> {
    return this.fetchWithCache(`levels-${symbol}`, async () => {
      const futuresData = await this.getFuturesData();
      const symbolData = futuresData.find(item => item.symbol === symbol);
      
      if (!symbolData) {
        return { resistance: [], support: [] };
      }

      const price = symbolData.price;
      const resistance = [
        Math.round((price + 20) * 100) / 100,
        Math.round((price + 60) * 100) / 100
      ];
      const support = [
        Math.round((price - 20) * 100) / 100,
        Math.round((price - 60) * 100) / 100
      ];

      return { resistance, support };
    });
  }

  getMarketSentiment(vixLevel: number, avgChange: number): string {
    if (vixLevel > 25) return 'Fearful';
    if (vixLevel < 15 && avgChange > 0) return 'Bullish';
    if (avgChange < -0.5) return 'Bearish';
    return 'Neutral';
  }
}

export default MarketDataService;
export type { FuturesData, MarketCondition, VIXData, TradingSignal };