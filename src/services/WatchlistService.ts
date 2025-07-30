import { UserWatchlistItem, SymbolSearchResult, SUPPORTED_EXCHANGES } from '@/types/watchlist';

export class WatchlistService {
  private static instance: WatchlistService;
  private readonly STORAGE_KEY = 'user_watchlist';

  static getInstance(): WatchlistService {
    if (!WatchlistService.instance) {
      WatchlistService.instance = new WatchlistService();
    }
    return WatchlistService.instance;
  }

  // Get user's watchlist from localStorage
  getUserWatchlist(): UserWatchlistItem[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading watchlist:', error);
      return [];
    }
  }

  // Add symbol to watchlist
  addSymbolToWatchlist(symbol: string, exchange: string = 'NASDAQ', position?: number): UserWatchlistItem {
    const watchlist = this.getUserWatchlist();
    const normalizedSymbol = symbol.toUpperCase();
    
    // Check if symbol already exists
    const existingIndex = watchlist.findIndex(item => 
      item.symbol === normalizedSymbol && item.exchange === exchange
    );
    
    const newItem: UserWatchlistItem = {
      symbol: normalizedSymbol,
      exchange,
      companyName: this.getCompanyName(normalizedSymbol),
      position,
      addedAt: new Date().toISOString(),
    };

    if (existingIndex >= 0) {
      // Update existing item
      watchlist[existingIndex] = { ...watchlist[existingIndex], ...newItem };
    } else {
      // Add new item
      watchlist.push(newItem);
    }

    this.saveWatchlist(watchlist);
    return newItem;
  }

  // Remove symbol from watchlist
  removeSymbolFromWatchlist(symbol: string, exchange: string): boolean {
    const watchlist = this.getUserWatchlist();
    const normalizedSymbol = symbol.toUpperCase();
    
    const newWatchlist = watchlist.filter(item => 
      !(item.symbol === normalizedSymbol && item.exchange === exchange)
    );
    
    if (newWatchlist.length !== watchlist.length) {
      this.saveWatchlist(newWatchlist);
      return true;
    }
    return false;
  }

  // Update position for a symbol
  updateSymbolPosition(symbol: string, exchange: string, position: number): boolean {
    const watchlist = this.getUserWatchlist();
    const normalizedSymbol = symbol.toUpperCase();
    
    const itemIndex = watchlist.findIndex(item => 
      item.symbol === normalizedSymbol && item.exchange === exchange
    );
    
    if (itemIndex >= 0) {
      watchlist[itemIndex].position = position;
      this.saveWatchlist(watchlist);
      return true;
    }
    return false;
  }

  // Search for symbols (simulated - in real app would use external API)
  async searchSymbols(query: string): Promise<SymbolSearchResult[]> {
    const normalizedQuery = query.toUpperCase();
    
    // Simulated symbol database - in real app, this would be an API call
    const symbolDatabase = [
      { symbol: 'AAPL', companyName: 'Apple Inc.', exchange: 'NASDAQ', currency: 'USD' },
      { symbol: 'GOOGL', companyName: 'Alphabet Inc.', exchange: 'NASDAQ', currency: 'USD' },
      { symbol: 'MSFT', companyName: 'Microsoft Corporation', exchange: 'NASDAQ', currency: 'USD' },
      { symbol: 'AMZN', companyName: 'Amazon.com Inc.', exchange: 'NASDAQ', currency: 'USD' },
      { symbol: 'TSLA', companyName: 'Tesla Inc.', exchange: 'NASDAQ', currency: 'USD' },
      { symbol: 'NVDA', companyName: 'NVIDIA Corporation', exchange: 'NASDAQ', currency: 'USD' },
      { symbol: 'META', companyName: 'Meta Platforms Inc.', exchange: 'NASDAQ', currency: 'USD' },
      { symbol: 'NFLX', companyName: 'Netflix Inc.', exchange: 'NASDAQ', currency: 'USD' },
      { symbol: 'SHOP', companyName: 'Shopify Inc.', exchange: 'TSX', currency: 'CAD' },
      { symbol: 'VOD', companyName: 'Vodafone Group Plc', exchange: 'LSE', currency: 'GBP' },
      // Add the existing portfolio symbols
      { symbol: 'CRCL', companyName: 'Circle Internet Financial', exchange: 'NYSE', currency: 'USD' },
      { symbol: 'CRWD', companyName: 'CrowdStrike Holdings Inc.', exchange: 'NASDAQ', currency: 'USD' },
      { symbol: 'MNTN', companyName: 'Everest Group Ltd.', exchange: 'NYSE', currency: 'USD' },
      { symbol: 'PLTR', companyName: 'Palantir Technologies Inc.', exchange: 'NYSE', currency: 'USD' },
      { symbol: 'QBTS', companyName: 'D-Wave Quantum Inc.', exchange: 'NYSE', currency: 'USD' },
      { symbol: 'QTUM', companyName: 'Qtum', exchange: 'NASDAQ', currency: 'USD' },
      { symbol: 'QUBT', companyName: 'Quantum Computing Inc.', exchange: 'NASDAQ', currency: 'USD' },
      { symbol: 'RGTI', companyName: 'Rigetti Computing Inc.', exchange: 'NASDAQ', currency: 'USD' },
    ];

    return symbolDatabase
      .filter(item => 
        item.symbol.includes(normalizedQuery) || 
        item.companyName.toUpperCase().includes(normalizedQuery)
      )
      .slice(0, 10); // Limit results
  }

  // Validate symbol format
  validateSymbol(symbol: string, exchange: string): boolean {
    const normalizedSymbol = symbol.toUpperCase();
    const exchangeInfo = SUPPORTED_EXCHANGES.find(ex => ex.code === exchange);
    
    if (!exchangeInfo) return false;
    
    // Basic validation - 1-5 characters, letters only
    return /^[A-Z]{1,5}$/.test(normalizedSymbol);
  }

  // Clear all watchlist data
  clearWatchlist(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  // Export watchlist as JSON
  exportWatchlist(): string {
    return JSON.stringify(this.getUserWatchlist(), null, 2);
  }

  // Import watchlist from JSON
  importWatchlist(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);
      if (Array.isArray(data)) {
        this.saveWatchlist(data);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error importing watchlist:', error);
      return false;
    }
  }

  private saveWatchlist(watchlist: UserWatchlistItem[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(watchlist));
    } catch (error) {
      console.error('Error saving watchlist:', error);
    }
  }

  private getCompanyName(symbol: string): string {
    // Simulated company name lookup - in real app would use external API
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
}

export default WatchlistService;