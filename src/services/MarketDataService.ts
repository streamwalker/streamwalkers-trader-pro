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

interface CandlestickData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface StockData {
  symbol: string;
  companyName: string;
  price: number;
  change: number;
  changePercent: number;
  marketValue: number;
  position: number;
  volume: number;
  timestamp: Date;
  exchange?: string;
}

interface PortfolioData {
  stocks: StockData[];
  totalValue: number;
  totalChange: number;
  totalChangePercent: number;
  timestamp: Date;
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

  async getCandlestickData(symbol: string, timeframe: string = '1h'): Promise<CandlestickData[]> {
    return this.fetchWithCache(`candlestick-${symbol}-${timeframe}`, async () => {
      const futuresData = await this.getFuturesData();
      const current = futuresData.find(f => f.symbol === symbol);
      
      if (!current) {
        return [];
      }

      // Generate historical OHLC data
      const periods = timeframe === '1min' ? 1440 : timeframe === '5min' ? 288 : timeframe === '15min' ? 96 : timeframe === '1h' ? 24 : 30;
      const basePrice = current.price;
      const data: CandlestickData[] = [];
      
      for (let i = periods; i >= 0; i--) {
        const time = new Date(Date.now() - i * this.getTimeframeMs(timeframe));
        const volatility = (Math.random() - 0.5) * (basePrice * 0.02);
        
        const open = basePrice + volatility + (Math.random() - 0.5) * 10;
        const close = open + (Math.random() - 0.5) * 15;
        const high = Math.max(open, close) + Math.random() * 8;
        const low = Math.min(open, close) - Math.random() * 8;
        const volume = Math.floor(Math.random() * 50000) + 10000;
        
        data.push({
          time: time.toISOString(),
          open: Math.round(open * 100) / 100,
          high: Math.round(high * 100) / 100,
          low: Math.round(low * 100) / 100,
          close: Math.round(close * 100) / 100,
          volume
        });
      }
      
      return data.sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());
    });
  }

  private getTimeframeMs(timeframe: string): number {
    switch (timeframe) {
      case '1min': return 60 * 1000;
      case '5min': return 5 * 60 * 1000;
      case '15min': return 15 * 60 * 1000;
      case '1h': return 60 * 60 * 1000;
      case '1d': return 24 * 60 * 60 * 1000;
      default: return 60 * 60 * 1000;
    }
  }

  async getStockData(): Promise<StockData[]> {
    return this.fetchWithCache('stocks', async () => {
      const stocksConfig = [
        { symbol: 'CRCL', companyName: 'Curacyte Inc', basePrice: 15.42, position: 100 },
        { symbol: 'CRWD', companyName: 'CrowdStrike Holdings', basePrice: 342.85, position: 50 },
        { symbol: 'MNTN', companyName: 'Everest Networks', basePrice: 28.67, position: 200 },
        { symbol: 'PLTR', companyName: 'Palantir Technologies', basePrice: 75.23, position: 150 },
        { symbol: 'QBTS', companyName: 'D-Wave Quantum', basePrice: 4.89, position: 500 },
        { symbol: 'QTUM', companyName: 'Qtum', basePrice: 3.21, position: 1000 },
        { symbol: 'QUBT', companyName: 'Quantum Computing', basePrice: 12.45, position: 300 },
        { symbol: 'RGTI', companyName: 'Rigetti Computing', basePrice: 9.87, position: 250 },
        { symbol: 'TSLA', companyName: 'Tesla Inc', basePrice: 436.58, position: 25 }
      ];

      return stocksConfig.map(stock => {
        const change = (Math.random() - 0.5) * stock.basePrice * 0.05; // ±2.5% variation
        const price = stock.basePrice + change;
        const changePercent = (change / stock.basePrice) * 100;
        const marketValue = price * stock.position;

        return {
          symbol: stock.symbol,
          companyName: stock.companyName,
          price: Number(price.toFixed(2)),
          change: Number(change.toFixed(2)),
          changePercent: Number(changePercent.toFixed(2)),
          marketValue: Number(marketValue.toFixed(2)),
          position: stock.position,
          volume: Math.floor(Math.random() * 1000000) + 100000,
          timestamp: new Date()
        };
      });
    });
  }

  async getPortfolioData(): Promise<PortfolioData> {
    return this.fetchWithCache('portfolio', async () => {
      const stocks = await this.getStockData();
      
      const totalValue = stocks.reduce((sum, stock) => sum + stock.marketValue, 0);
      const totalChange = stocks.reduce((sum, stock) => sum + (stock.change * stock.position), 0);
      const totalChangePercent = stocks.reduce((sum, stock) => sum + stock.changePercent, 0) / stocks.length;

      return {
        stocks,
        totalValue: Number(totalValue.toFixed(2)),
        totalChange: Number(totalChange.toFixed(2)),
        totalChangePercent: Number(totalChangePercent.toFixed(2)),
        timestamp: new Date()
      };
    });
  }

  // Get data for a specific symbol
  async getStockDataBySymbol(symbol: string, exchange: string = 'NASDAQ'): Promise<StockData> {
    const cacheKey = `stock_${symbol}_${exchange}`;
    
    return this.fetchWithCache(cacheKey, async () => {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, Math.random() * 200 + 100));
      
      const basePrice = this.getBasePrice(symbol);
      const change = (Math.random() - 0.5) * basePrice * 0.1;
      const changePercent = (change / basePrice) * 100;
      const volume = Math.floor(Math.random() * 1000000) + 100000;
      const position = Math.floor(Math.random() * 100) + 10;
      
      return {
        symbol,
        companyName: this.getCompanyName(symbol),
        price: basePrice + change,
        change,
        changePercent,
        volume,
        position,
        marketValue: (basePrice + change) * position,
        timestamp: new Date(),
        exchange,
      };
    });
  }

  private getBasePrice(symbol: string): number {
    // Base prices for different symbols
    const basePrices: Record<string, number> = {
      'AAPL': 185.00,
      'GOOGL': 140.50,
      'MSFT': 415.30,
      'AMZN': 175.80,
      'TSLA': 248.42,
      'NVDA': 875.25,
      'META': 514.75,
      'NFLX': 486.20,
      'CRCL': 32.15,
      'CRWD': 285.75,
      'MNTN': 8.25,
      'PLTR': 62.80,
      'QBTS': 4.15,
      'QTUM': 3.25,
      'QUBT': 18.50,
      'RGTI': 12.75,
    };
    
    // Return base price or generate a random price for unknown symbols
    return basePrices[symbol] || Math.random() * 200 + 20;
  }

  private getCompanyName(symbol: string): string {
    const companies: Record<string, string> = {
      'AAPL': 'Apple Inc.',
      'GOOGL': 'Alphabet Inc.',
      'MSFT': 'Microsoft Corporation',
      'AMZN': 'Amazon.com Inc.',
      'TSLA': 'Tesla Inc.',
      'NVDA': 'NVIDIA Corporation',
      'META': 'Meta Platforms Inc.',
      'NFLX': 'Netflix Inc.',
      'CRCL': 'Circle Internet Financial',
      'CRWD': 'CrowdStrike Holdings Inc.',
      'MNTN': 'Everest Group Ltd.',
      'PLTR': 'Palantir Technologies Inc.',
      'QBTS': 'D-Wave Quantum Inc.',
      'QTUM': 'Qtum',
      'QUBT': 'Quantum Computing Inc.',
      'RGTI': 'Rigetti Computing Inc.',
    };
    
    return companies[symbol] || `${symbol} Corp.`;
  }

  getMarketSentiment(vixLevel: number, avgChange: number): string {
    if (vixLevel > 25) return 'Fearful';
    if (vixLevel < 15 && avgChange > 0) return 'Bullish';
    if (avgChange < -0.5) return 'Bearish';
    return 'Neutral';
  }
}

export default MarketDataService;
export type { FuturesData, MarketCondition, VIXData, TradingSignal, CandlestickData, StockData, PortfolioData };