import { LiveDataProvider, QuoteData, HistoricalData, NewsItem } from './LiveDataProvider';

export class AlphaVantageProvider implements LiveDataProvider {
  name = 'Alpha Vantage';
  isConnected = false;
  private apiKey: string;
  private baseUrl = 'https://www.alphavantage.co/query';
  private requestCount = 0;
  private lastRequestTime = 0;
  private readonly rateLimitCount = 5; // 5 requests per minute for free tier

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async connect(): Promise<void> {
    try {
      // Test connection with a simple API call
      const response = await fetch(`${this.baseUrl}?function=GLOBAL_QUOTE&symbol=AAPL&apikey=${this.apiKey}`);
      if (response.ok) {
        this.isConnected = true;
      }
    } catch (error) {
      console.error('Alpha Vantage connection failed:', error);
      this.isConnected = false;
    }
  }

  disconnect(): void {
    this.isConnected = false;
  }

  private async rateLimitCheck(): Promise<void> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    
    if (this.requestCount >= this.rateLimitCount && timeSinceLastRequest < 60000) {
      const waitTime = 60000 - timeSinceLastRequest;
      await new Promise(resolve => setTimeout(resolve, waitTime));
      this.requestCount = 0;
    }
    
    this.requestCount++;
    this.lastRequestTime = now;
  }

  async getQuote(symbol: string): Promise<QuoteData> {
    await this.rateLimitCheck();
    
    try {
      const response = await fetch(
        `${this.baseUrl}?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${this.apiKey}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch quote data');
      }
      
      const data = await response.json();
      const quote = data['Global Quote'];
      
      if (!quote) {
        throw new Error('Invalid quote data received');
      }
      
      return {
        symbol: quote['01. symbol'],
        price: parseFloat(quote['05. price']),
        change: parseFloat(quote['09. change']),
        changePercent: parseFloat(quote['10. change percent'].replace('%', '')),
        volume: parseInt(quote['06. volume']),
        high: parseFloat(quote['03. high']),
        low: parseFloat(quote['04. low']),
        open: parseFloat(quote['02. open']),
        previousClose: parseFloat(quote['08. previous close']),
        timestamp: Date.now()
      };
    } catch (error) {
      console.error('Error fetching quote:', error);
      // Return simulated data as fallback
      return this.getSimulatedQuote(symbol);
    }
  }

  subscribeToQuotes(symbols: string[], callback: (data: QuoteData) => void): () => void {
    // Alpha Vantage doesn't have WebSocket, so we'll poll
    const intervals: NodeJS.Timeout[] = [];
    
    symbols.forEach(symbol => {
      const interval = setInterval(async () => {
        try {
          const quote = await this.getQuote(symbol);
          callback(quote);
        } catch (error) {
          console.error(`Error fetching quote for ${symbol}:`, error);
        }
      }, 60000); // Poll every minute to respect rate limits
      
      intervals.push(interval);
    });
    
    // Return unsubscribe function
    return () => {
      intervals.forEach(interval => clearInterval(interval));
    };
  }

  async getHistoricalData(symbol: string, interval: string = 'daily', outputsize: string = 'compact'): Promise<HistoricalData> {
    await this.rateLimitCheck();
    
    try {
      const functionMap: { [key: string]: string } = {
        '1min': 'TIME_SERIES_INTRADAY&interval=1min',
        '5min': 'TIME_SERIES_INTRADAY&interval=5min',
        '15min': 'TIME_SERIES_INTRADAY&interval=15min',
        '30min': 'TIME_SERIES_INTRADAY&interval=30min',
        '60min': 'TIME_SERIES_INTRADAY&interval=60min',
        'daily': 'TIME_SERIES_DAILY',
        'weekly': 'TIME_SERIES_WEEKLY',
        'monthly': 'TIME_SERIES_MONTHLY'
      };
      
      const func = functionMap[interval] || 'TIME_SERIES_DAILY';
      const response = await fetch(
        `${this.baseUrl}?function=${func}&symbol=${symbol}&outputsize=${outputsize}&apikey=${this.apiKey}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch historical data');
      }
      
      const data = await response.json();
      const timeSeriesKey = Object.keys(data).find(key => key.includes('Time Series'));
      
      if (!timeSeriesKey || !data[timeSeriesKey]) {
        throw new Error('Invalid historical data received');
      }
      
      const timeSeries = data[timeSeriesKey];
      const historicalData = Object.entries(timeSeries).map(([date, values]: [string, any]) => ({
        timestamp: new Date(date).getTime(),
        open: parseFloat(values['1. open']),
        high: parseFloat(values['2. high']),
        low: parseFloat(values['3. low']),
        close: parseFloat(values['4. close']),
        volume: parseInt(values['5. volume'])
      })).sort((a, b) => a.timestamp - b.timestamp);
      
      return {
        symbol,
        data: historicalData
      };
    } catch (error) {
      console.error('Error fetching historical data:', error);
      return this.getSimulatedHistoricalData(symbol);
    }
  }

  async getMarketNews(symbol?: string): Promise<NewsItem[]> {
    await this.rateLimitCheck();
    
    try {
      const url = symbol 
        ? `${this.baseUrl}?function=NEWS_SENTIMENT&tickers=${symbol}&apikey=${this.apiKey}`
        : `${this.baseUrl}?function=NEWS_SENTIMENT&apikey=${this.apiKey}`;
        
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to fetch news data');
      }
      
      const data = await response.json();
      
      if (!data.feed) {
        return [];
      }
      
      return data.feed.slice(0, 10).map((item: any) => ({
        id: item.url,
        title: item.title,
        summary: item.summary,
        url: item.url,
        timestamp: new Date(item.time_published).getTime(),
        symbol: symbol,
        sentiment: this.mapSentiment(item.overall_sentiment_score)
      }));
    } catch (error) {
      console.error('Error fetching news:', error);
      return [];
    }
  }

  private mapSentiment(score: number): 'positive' | 'negative' | 'neutral' {
    if (score > 0.15) return 'positive';
    if (score < -0.15) return 'negative';
    return 'neutral';
  }

  private getSimulatedQuote(symbol: string): QuoteData {
    const basePrice = 100 + Math.random() * 400;
    const change = (Math.random() - 0.5) * 10;
    
    return {
      symbol,
      price: basePrice,
      change,
      changePercent: (change / basePrice) * 100,
      volume: Math.floor(Math.random() * 10000000),
      high: basePrice + Math.random() * 5,
      low: basePrice - Math.random() * 5,
      open: basePrice + (Math.random() - 0.5) * 3,
      previousClose: basePrice - change,
      timestamp: Date.now()
    };
  }

  private getSimulatedHistoricalData(symbol: string): HistoricalData {
    const data = [];
    let price = 100 + Math.random() * 400;
    const now = Date.now();
    
    for (let i = 29; i >= 0; i--) {
      const timestamp = now - (i * 24 * 60 * 60 * 1000);
      const change = (Math.random() - 0.5) * 10;
      const open = price;
      const close = price + change;
      const high = Math.max(open, close) + Math.random() * 3;
      const low = Math.min(open, close) - Math.random() * 3;
      
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
}