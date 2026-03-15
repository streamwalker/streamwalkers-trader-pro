import { LiveDataProvider, QuoteData, HistoricalData, NewsItem } from './LiveDataProvider';

export class FinnhubProvider implements LiveDataProvider {
  name = 'Finnhub';
  isConnected = false;
  private apiKey: string;
  private baseUrl = 'https://finnhub.io/api/v1';
  private wsUrl = 'wss://ws.finnhub.io';
  private ws: WebSocket | null = null;
  private subscriptions = new Map<string, ((data: QuoteData) => void)[]>();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async connect(): Promise<void> {
    try {
      // Test REST API connection
      const response = await fetch(`${this.baseUrl}/quote?symbol=AAPL&token=${this.apiKey}`);
      if (response.ok) {
        this.isConnected = true;
        await this.connectWebSocket();
      }
    } catch (error) {
      console.error('Finnhub connection failed:', error);
      this.isConnected = false;
    }
  }

  private async connectWebSocket(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(`${this.wsUrl}?token=${this.apiKey}`);
      
      this.ws.onopen = () => {
        console.log('Finnhub WebSocket connected');
        this.reconnectAttempts = 0;
        resolve();
      };
      
      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'trade') {
            this.handleTradeData(data.data);
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };
      
      this.ws.onerror = (error) => {
        console.error('Finnhub WebSocket error:', error);
        reject(error);
      };
      
      this.ws.onclose = () => {
        console.log('Finnhub WebSocket disconnected');
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
          this.reconnectAttempts++;
          const delay = Math.min(5000 * Math.pow(2, this.reconnectAttempts - 1), 60000);
          console.log(`Reconnecting in ${delay / 1000}s (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
          setTimeout(() => this.connectWebSocket(), delay);
        } else {
          console.warn('Max WebSocket reconnect attempts reached. Stopping.');
        }
      };
    });
  }

  private handleTradeData(trades: any[]) {
    trades.forEach((trade) => {
      const callbacks = this.subscriptions.get(trade.s);
      if (callbacks) {
        const quoteData: QuoteData = {
          symbol: trade.s,
          price: trade.p,
          change: 0, // Will be calculated from previous price
          changePercent: 0,
          volume: trade.v,
          high: trade.p,
          low: trade.p,
          open: trade.p,
          previousClose: trade.p,
          timestamp: trade.t
        };
        
        callbacks.forEach(callback => callback(quoteData));
      }
    });
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.isConnected = false;
    this.subscriptions.clear();
  }

  async getQuote(symbol: string): Promise<QuoteData> {
    try {
      const response = await fetch(`${this.baseUrl}/quote?symbol=${symbol}&token=${this.apiKey}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch quote data');
      }
      
      const data = await response.json();
      
      return {
        symbol,
        price: data.c,
        change: data.d,
        changePercent: data.dp,
        volume: 0, // Volume not provided in this endpoint
        high: data.h,
        low: data.l,
        open: data.o,
        previousClose: data.pc,
        timestamp: data.t * 1000
      };
    } catch (error) {
      console.error('Error fetching quote:', error);
      return this.getSimulatedQuote(symbol);
    }
  }

  subscribeToQuotes(symbols: string[], callback: (data: QuoteData) => void): () => void {
    symbols.forEach(symbol => {
      if (!this.subscriptions.has(symbol)) {
        this.subscriptions.set(symbol, []);
        // Subscribe to WebSocket for this symbol
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
          this.ws.send(JSON.stringify({ type: 'subscribe', symbol }));
        }
      }
      this.subscriptions.get(symbol)!.push(callback);
    });

    // Return unsubscribe function
    return () => {
      symbols.forEach(symbol => {
        const callbacks = this.subscriptions.get(symbol);
        if (callbacks) {
          const index = callbacks.indexOf(callback);
          if (index > -1) {
            callbacks.splice(index, 1);
          }
          if (callbacks.length === 0) {
            this.subscriptions.delete(symbol);
            // Unsubscribe from WebSocket
            if (this.ws && this.ws.readyState === WebSocket.OPEN) {
              this.ws.send(JSON.stringify({ type: 'unsubscribe', symbol }));
            }
          }
        }
      });
    };
  }

  async getHistoricalData(symbol: string, interval: string = 'D'): Promise<HistoricalData> {
    try {
      const to = Math.floor(Date.now() / 1000);
      const from = to - (30 * 24 * 60 * 60); // 30 days ago
      
      const response = await fetch(
        `${this.baseUrl}/stock/candle?symbol=${symbol}&resolution=${interval}&from=${from}&to=${to}&token=${this.apiKey}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch historical data');
      }
      
      const data = await response.json();
      
      if (data.s !== 'ok' || !data.c) {
        throw new Error('Invalid historical data received');
      }
      
      const historicalData = data.t.map((timestamp: number, index: number) => ({
        timestamp: timestamp * 1000,
        open: data.o[index],
        high: data.h[index],
        low: data.l[index],
        close: data.c[index],
        volume: data.v[index]
      }));
      
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
    try {
      const endpoint = symbol 
        ? `${this.baseUrl}/company-news?symbol=${symbol}&from=${this.getDateString(-7)}&to=${this.getDateString(0)}&token=${this.apiKey}`
        : `${this.baseUrl}/news?category=general&token=${this.apiKey}`;
        
      const response = await fetch(endpoint);
      
      if (!response.ok) {
        throw new Error('Failed to fetch news data');
      }
      
      const data = await response.json();
      
      return data.slice(0, 10).map((item: any) => ({
        id: item.id?.toString() || item.url,
        title: item.headline,
        summary: item.summary,
        url: item.url,
        timestamp: item.datetime * 1000,
        symbol: symbol,
        sentiment: 'neutral' as const
      }));
    } catch (error) {
      console.error('Error fetching news:', error);
      return [];
    }
  }

  private getDateString(daysOffset: number): string {
    const date = new Date();
    date.setDate(date.getDate() + daysOffset);
    return date.toISOString().split('T')[0];
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