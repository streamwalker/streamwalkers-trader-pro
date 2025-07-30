import { LiveMarketDataService } from './LiveMarketDataService';
import { QuoteData } from './LiveDataProvider';

// Enhanced interfaces with live data integration
export interface FuturesData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  high: number;
  low: number;
  lastUpdated: number;
  tick: number;
  openInterest?: number;
  impliedVolatility?: number;
}

export interface VIXData {
  current: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  timestamp: number;
  trend: 'up' | 'down' | 'stable';
  fearGreedIndex: number;
}

export interface MarketCondition {
  name: string;
  value: string | number;
  status: 'bullish' | 'bearish' | 'neutral';
  description: string;
  lastUpdated: number;
  confidence: number;
}

export interface TradingSignal {
  id: string;
  symbol: string;
  signal: 'buy' | 'sell' | 'hold';
  strength: number;
  entryPrice: number;
  targetPrice?: number;
  stopLoss?: number;
  confidence: number;
  timestamp: number;
  reason: string;
  timeframe: string;
  riskReward?: number;
}

export interface CandlestickData {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap?: number;
  pe?: number;
  dividendYield?: number;
  sector?: string;
  lastUpdated: number;
  marketValue: number;
  position: number;
  exchange?: string;
  sharesOutstanding?: number;
  floatShares?: number;
  floatPercent?: number;
}

export interface PortfolioData {
  totalValue: number;
  dayChange: number;
  dayChangePercent: number;
  totalGainLoss: number;
  totalGainLossPercent: number;
  cash: number;
  lastUpdated: number;
}

class MarketDataService {
  private static instance: MarketDataService;
  private liveDataService: LiveMarketDataService;
  private cache = new Map<string, { data: any; timestamp: number }>();
  private readonly cacheDuration = 30000; // 30 seconds

  private constructor() {
    this.liveDataService = LiveMarketDataService.getInstance();
  }

  static getInstance(): MarketDataService {
    if (!MarketDataService.instance) {
      MarketDataService.instance = new MarketDataService();
    }
    return MarketDataService.instance;
  }

  private async fetchWithCache<T>(key: string, fetchFn: () => Promise<T>): Promise<T> {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheDuration) {
      return cached.data;
    }

    const data = await fetchFn();
    this.cache.set(key, { data, timestamp: Date.now() });
    return data;
  }

  async getFuturesData(): Promise<FuturesData[]> {
    return this.fetchWithCache('futures', async () => {
      const symbols = [
        { symbol: 'ES', name: 'S&P 500 E-mini', tick: 0.25 },
        { symbol: 'NQ', name: 'NASDAQ-100 E-mini', tick: 0.25 },
        { symbol: 'YM', name: 'Dow Jones E-mini', tick: 1.0 },
        { symbol: 'RTY', name: 'Russell 2000 E-mini', tick: 0.1 }
      ];

      const quotes = await this.liveDataService.getMultipleQuotes(symbols.map(s => s.symbol));
      
      return symbols.map((symbolInfo, index) => {
        const quote = quotes[index];
        return {
          symbol: symbolInfo.symbol,
          name: symbolInfo.name,
          price: quote.price,
          change: quote.change,
          changePercent: quote.changePercent,
          volume: quote.volume,
          high: quote.high,
          low: quote.low,
          lastUpdated: quote.timestamp,
          tick: symbolInfo.tick,
          openInterest: Math.floor(Math.random() * 1000000) + 500000,
          impliedVolatility: 15 + Math.random() * 20
        };
      });
    });
  }

  async getVIXData(): Promise<VIXData> {
    return this.fetchWithCache('vix', async () => {
      // VIX is typically fetched as ^VIX
      const quote = await this.liveDataService.getQuote('^VIX');
      
      return {
        current: quote.price || 20 + Math.random() * 10,
        change: quote.change || (Math.random() - 0.5) * 2,
        changePercent: quote.changePercent || (Math.random() - 0.5) * 10,
        high: quote.high || 25 + Math.random() * 5,
        low: quote.low || 15 + Math.random() * 5,
        timestamp: quote.timestamp,
        trend: quote.change > 0 ? 'up' : quote.change < 0 ? 'down' : 'stable',
        fearGreedIndex: Math.floor(Math.random() * 100)
      };
    });
  }

  async getMarketConditions(): Promise<MarketCondition[]> {
    return this.fetchWithCache('marketConditions', async () => {
      const futuresData = await this.getFuturesData();
      const vixData = await this.getVIXData();
      
      const avgChange = futuresData.reduce((sum, future) => sum + future.changePercent, 0) / futuresData.length;
      const marketSentiment = this.getMarketSentiment(vixData.current, avgChange);
      
      return [
        {
          name: 'Market Trend',
          value: avgChange > 0.5 ? 'Bullish' : avgChange < -0.5 ? 'Bearish' : 'Neutral',
          status: avgChange > 0.5 ? 'bullish' : avgChange < -0.5 ? 'bearish' : 'neutral',
          description: `Average futures change: ${avgChange.toFixed(2)}%`,
          lastUpdated: Date.now(),
          confidence: Math.min(Math.abs(avgChange) * 20, 100)
        },
        {
          name: 'Volatility',
          value: vixData.current.toFixed(2),
          status: vixData.current > 25 ? 'bearish' : vixData.current < 15 ? 'bullish' : 'neutral',
          description: vixData.current > 25 ? 'High volatility' : vixData.current < 15 ? 'Low volatility' : 'Normal volatility',
          lastUpdated: vixData.timestamp,
          confidence: 85
        },
        {
          name: 'Overall Sentiment',
          value: marketSentiment,
          status: marketSentiment === 'Bullish' ? 'bullish' : marketSentiment === 'Bearish' ? 'bearish' : 'neutral',
          description: `Based on VIX level (${vixData.current.toFixed(1)}) and market performance`,
          lastUpdated: Date.now(),
          confidence: 75
        },
        {
          name: 'Volume Trend',
          value: 'Above Average',
          status: 'bullish',
          description: 'Trading volume is above historical average',
          lastUpdated: Date.now(),
          confidence: 70
        }
      ];
    });
  }

  async getTradingSignals(): Promise<TradingSignal[]> {
    return this.fetchWithCache('tradingSignals', async () => {
      const futuresData = await this.getFuturesData();
      
      return futuresData.map((future, index) => {
        const signal = future.changePercent > 1 ? 'buy' : future.changePercent < -1 ? 'sell' : 'hold';
        const strength = Math.min(Math.abs(future.changePercent) * 10, 100);
        
        return {
          id: `signal_${future.symbol}_${Date.now()}_${index}`,
          symbol: future.symbol,
          signal,
          strength,
          entryPrice: future.price,
          targetPrice: signal === 'buy' ? future.price * 1.02 : signal === 'sell' ? future.price * 0.98 : future.price,
          stopLoss: signal === 'buy' ? future.price * 0.99 : signal === 'sell' ? future.price * 1.01 : undefined,
          confidence: Math.floor(strength),
          timestamp: future.lastUpdated,
          reason: `Based on ${Math.abs(future.changePercent).toFixed(2)}% price movement`,
          timeframe: '1H',
          riskReward: 2.0
        };
      });
    });
  }

  async getKeyLevels(symbol: string): Promise<{ resistance: number[]; support: number[] }> {
    return this.fetchWithCache(`keyLevels_${symbol}`, async () => {
      const quote = await this.liveDataService.getQuote(symbol);
      const price = quote.price;
      
      // Calculate dynamic support and resistance levels
      const resistance = [
        price * 1.01,
        price * 1.02,
        price * 1.03
      ];
      
      const support = [
        price * 0.99,
        price * 0.98,
        price * 0.97
      ];
      
      return { resistance, support };
    });
  }

  async getCandlestickData(symbol: string, timeframe: string = '1h'): Promise<CandlestickData[]> {
    return this.fetchWithCache(`candlestick_${symbol}_${timeframe}`, async () => {
      const historicalData = await this.liveDataService.getHistoricalData(symbol, timeframe);
      return historicalData.data;
    });
  }

  async getStockData(): Promise<StockData[]> {
    return this.fetchWithCache('stockData', async () => {
      const symbols = ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'AMZN', 'META', 'NVDA', 'SPY', 'QQQ'];
      const quotes = await this.liveDataService.getMultipleQuotes(symbols);
      
      const stockNames: { [key: string]: string } = {
        'AAPL': 'Apple Inc.',
        'GOOGL': 'Alphabet Inc.',
        'MSFT': 'Microsoft Corporation',
        'TSLA': 'Tesla, Inc.',
        'AMZN': 'Amazon.com Inc.',
        'META': 'Meta Platforms Inc.',
        'NVDA': 'NVIDIA Corporation',
        'SPY': 'SPDR S&P 500 ETF',
        'QQQ': 'Invesco QQQ Trust'
      };
      
      return quotes.map(quote => {
        // Generate mock float data for demonstration
        const sharesOutstanding = this.getMockSharesOutstanding(quote.symbol);
        const floatShares = this.getMockFloatShares(quote.symbol, sharesOutstanding);
        const floatPercent = sharesOutstanding ? (floatShares / sharesOutstanding) * 100 : undefined;
        
        return {
          symbol: quote.symbol,
          name: stockNames[quote.symbol] || quote.symbol,
          price: quote.price,
          change: quote.change,
          changePercent: quote.changePercent,
          volume: quote.volume,
          marketCap: quote.marketCap,
          pe: quote.pe,
          dividendYield: quote.dividendYield,
          sector: this.getSectorForSymbol(quote.symbol),
          lastUpdated: quote.timestamp,
          marketValue: quote.price * 10, // Assume 10 shares
          position: 10,
          exchange: 'NASDAQ',
          sharesOutstanding,
          floatShares,
          floatPercent
        };
      });
    });
  }

  async getPortfolioData(): Promise<PortfolioData> {
    return this.fetchWithCache('portfolioData', async () => {
      const stockData = await this.getStockData();
      
      // Calculate portfolio metrics from live stock data
      const totalValue = stockData.reduce((sum, stock) => sum + (stock.price * 10), 0); // Assume 10 shares each
      const dayChange = stockData.reduce((sum, stock) => sum + (stock.change * 10), 0);
      const dayChangePercent = (dayChange / (totalValue - dayChange)) * 100;
      
      return {
        totalValue,
        dayChange,
        dayChangePercent,
        totalGainLoss: totalValue * 0.15, // Assume 15% total gain
        totalGainLossPercent: 15,
        cash: 25000,
        lastUpdated: Date.now()
      };
    });
  }

  async getStockDataBySymbol(symbol: string, exchange: string = 'NASDAQ'): Promise<StockData> {
    const quote = await this.liveDataService.getQuote(symbol);
    const sharesOutstanding = this.getMockSharesOutstanding(symbol);
    const floatShares = this.getMockFloatShares(symbol, sharesOutstanding);
    const floatPercent = sharesOutstanding ? (floatShares / sharesOutstanding) * 100 : undefined;
    
    return {
      symbol: quote.symbol,
      name: `${symbol} Corporation`,
      price: quote.price,
      change: quote.change,
      changePercent: quote.changePercent,
      volume: quote.volume,
      marketCap: quote.marketCap,
      pe: quote.pe,
      dividendYield: quote.dividendYield,
      sector: this.getSectorForSymbol(symbol),
      lastUpdated: quote.timestamp,
      marketValue: quote.price * 10,
      position: 10,
      exchange,
      sharesOutstanding,
      floatShares,
      floatPercent
    };
  }

  getMarketSentiment(vixLevel: number, avgChange: number): string {
    if (vixLevel > 25 || avgChange < -1) return 'Bearish';
    if (vixLevel < 15 && avgChange > 1) return 'Bullish';
    return 'Neutral';
  }

  private getSectorForSymbol(symbol: string): string {
    const sectors: { [key: string]: string } = {
      'AAPL': 'Technology',
      'GOOGL': 'Technology',
      'MSFT': 'Technology',
      'TSLA': 'Automotive',
      'AMZN': 'Consumer Services',
      'META': 'Technology',
      'NVDA': 'Technology',
      'SPY': 'ETF',
      'QQQ': 'ETF'
    };
    
    return sectors[symbol] || 'Technology';
  }

  private getMockSharesOutstanding(symbol: string): number {
    // Mock shares outstanding data (in millions)
    const sharesData: { [key: string]: number } = {
      'AAPL': 15400, // 15.4B shares
      'GOOGL': 12900, // 12.9B shares
      'MSFT': 7430, // 7.43B shares
      'TSLA': 3160, // 3.16B shares
      'AMZN': 10700, // 10.7B shares
      'META': 2540, // 2.54B shares
      'NVDA': 2470, // 2.47B shares
      'SPY': 890, // 890M shares
      'QQQ': 740 // 740M shares
    };
    
    return sharesData[symbol] || (Math.random() * 1000 + 100); // Random 100M-1.1B if not found
  }

  private getMockFloatShares(symbol: string, sharesOutstanding: number): number {
    // Mock float shares data - typically 70-95% of outstanding for large caps
    const floatPercentages: { [key: string]: number } = {
      'AAPL': 0.99,
      'GOOGL': 0.87,
      'MSFT': 0.99,
      'TSLA': 0.91,
      'AMZN': 0.88,
      'META': 0.72,
      'NVDA': 0.79,
      'SPY': 1.0,
      'QQQ': 1.0
    };
    
    const floatPercent = floatPercentages[symbol] || (0.3 + Math.random() * 0.6); // 30-90% if not found
    return Math.floor(sharesOutstanding * floatPercent);
  }

  // Real-time subscription methods
  subscribeToSymbol(symbol: string, callback: (data: QuoteData) => void): () => void {
    return this.liveDataService.subscribeToQuotes([symbol], callback);
  }

  subscribeToMultipleSymbols(symbols: string[], callback: (data: QuoteData) => void): () => void {
    return this.liveDataService.subscribeToQuotes(symbols, callback);
  }

  // Connection status
  getConnectionStatus() {
    return this.liveDataService.getConnectionStatus();
  }

  // Market status
  getMarketStatus() {
    return this.liveDataService.getMarketStatus();
  }
}

export default MarketDataService;