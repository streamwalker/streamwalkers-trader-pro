export interface LiveDataProvider {
  name: string;
  isConnected: boolean;
  
  // Real-time quote data
  getQuote(symbol: string): Promise<QuoteData>;
  subscribeToQuotes(symbols: string[], callback: (data: QuoteData) => void): () => void;
  
  // Historical data
  getHistoricalData(symbol: string, interval: string, outputsize?: string): Promise<HistoricalData>;
  
  // Market news
  getMarketNews(symbol?: string): Promise<NewsItem[]>;
  
  // Connection management
  connect(): Promise<void>;
  disconnect(): void;
}

export interface QuoteData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  high: number;
  low: number;
  open: number;
  previousClose: number;
  timestamp: number;
  marketCap?: number;
  pe?: number;
  dividendYield?: number;
  sharesOutstanding?: number;
  floatShares?: number;
}

export interface HistoricalData {
  symbol: string;
  data: {
    timestamp: number;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
  }[];
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  url: string;
  timestamp: number;
  symbol?: string;
  sentiment: 'positive' | 'negative' | 'neutral';
}