export interface UserWatchlistItem {
  symbol: string;
  exchange: string;
  companyName?: string;
  position?: number;
  addedAt: string;
}

export interface SymbolSearchResult {
  symbol: string;
  companyName: string;
  exchange: string;
  currency: string;
}

export interface ExchangeInfo {
  code: string;
  name: string;
  country: string;
  timezone: string;
  currency: string;
}

export const SUPPORTED_EXCHANGES: ExchangeInfo[] = [
  { code: 'NASDAQ', name: 'NASDAQ', country: 'US', timezone: 'America/New_York', currency: 'USD' },
  { code: 'NYSE', name: 'New York Stock Exchange', country: 'US', timezone: 'America/New_York', currency: 'USD' },
  { code: 'TSX', name: 'Toronto Stock Exchange', country: 'CA', timezone: 'America/Toronto', currency: 'CAD' },
  { code: 'LSE', name: 'London Stock Exchange', country: 'UK', timezone: 'Europe/London', currency: 'GBP' },
  { code: 'EURONEXT', name: 'Euronext', country: 'EU', timezone: 'Europe/Paris', currency: 'EUR' },
  { code: 'ASX', name: 'Australian Securities Exchange', country: 'AU', timezone: 'Australia/Sydney', currency: 'AUD' },
];