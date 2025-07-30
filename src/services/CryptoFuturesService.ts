import { LiveMarketDataService } from './LiveMarketDataService';

export interface CryptoFuturesData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  high: number;
  low: number;
  lastUpdated: number;
  openInterest: number;
  fundingRate: number;
  leverage: number;
  liquidationPrice?: number;
}

export interface CryptoOpportunity {
  id: string;
  symbol: string;
  type: 'momentum' | 'mean_reversion' | 'funding_arbitrage' | 'volatility_breakout';
  signal: 'long' | 'short';
  confidence: number;
  entryPrice: number;
  targetPrice: number;
  stopLoss: number;
  riskReward: number;
  reasoning: string;
  timeframe: string;
  urgency: 'low' | 'medium' | 'high';
  timestamp: number;
}

class CryptoFuturesService {
  private static instance: CryptoFuturesService;
  private liveDataService: LiveMarketDataService;
  private cache = new Map<string, { data: any; timestamp: number }>();
  private readonly cacheDuration = 15000; // 15 seconds for crypto

  private constructor() {
    this.liveDataService = LiveMarketDataService.getInstance();
  }

  static getInstance(): CryptoFuturesService {
    if (!CryptoFuturesService.instance) {
      CryptoFuturesService.instance = new CryptoFuturesService();
    }
    return CryptoFuturesService.instance;
  }

  async getCryptoFuturesData(): Promise<CryptoFuturesData[]> {
    const cached = this.cache.get('cryptoFutures');
    if (cached && Date.now() - cached.timestamp < this.cacheDuration) {
      return cached.data;
    }

    const cryptoSymbols = [
      { symbol: 'BTCUSDT', name: 'Bitcoin Futures', leverage: 100 },
      { symbol: 'ETHUSDT', name: 'Ethereum Futures', leverage: 75 },
      { symbol: 'ADAUSDT', name: 'Cardano Futures', leverage: 50 },
      { symbol: 'SOLUSDT', name: 'Solana Futures', leverage: 50 },
      { symbol: 'DOTUSDT', name: 'Polkadot Futures', leverage: 25 },
      { symbol: 'AVAXUSDT', name: 'Avalanche Futures', leverage: 50 }
    ];

    const cryptoData: CryptoFuturesData[] = [];

    for (const crypto of cryptoSymbols) {
      try {
        // Generate realistic crypto futures data
        const basePrice = this.getBasePriceForCrypto(crypto.symbol);
        const volatility = this.getVolatilityForCrypto(crypto.symbol);
        const changePercent = (Math.random() - 0.5) * volatility;
        const change = basePrice * (changePercent / 100);
        const price = basePrice + change;

        cryptoData.push({
          symbol: crypto.symbol,
          name: crypto.name,
          price,
          change,
          changePercent,
          volume: Math.floor(Math.random() * 10000000) + 1000000,
          high: price * (1 + Math.random() * 0.05),
          low: price * (1 - Math.random() * 0.05),
          lastUpdated: Date.now(),
          openInterest: Math.floor(Math.random() * 1000000) + 100000,
          fundingRate: (Math.random() - 0.5) * 0.01, // -0.5% to +0.5%
          leverage: crypto.leverage,
          liquidationPrice: price * (Math.random() < 0.5 ? 0.8 : 1.2)
        });
      } catch (error) {
        console.error(`Error fetching data for ${crypto.symbol}:`, error);
      }
    }

    this.cache.set('cryptoFutures', { data: cryptoData, timestamp: Date.now() });
    return cryptoData;
  }

  async getHighVolatilityOpportunities(): Promise<CryptoOpportunity[]> {
    const cryptoData = await this.getCryptoFuturesData();
    const opportunities: CryptoOpportunity[] = [];

    for (const crypto of cryptoData) {
      // Momentum opportunities
      if (Math.abs(crypto.changePercent) > 5) {
        opportunities.push({
          id: `momentum_${crypto.symbol}_${Date.now()}`,
          symbol: crypto.symbol,
          type: 'momentum',
          signal: crypto.changePercent > 0 ? 'long' : 'short',
          confidence: Math.min(Math.abs(crypto.changePercent) * 10, 95),
          entryPrice: crypto.price,
          targetPrice: crypto.changePercent > 0 ? crypto.price * 1.03 : crypto.price * 0.97,
          stopLoss: crypto.changePercent > 0 ? crypto.price * 0.98 : crypto.price * 1.02,
          riskReward: 1.5,
          reasoning: `Strong ${crypto.changePercent > 0 ? 'bullish' : 'bearish'} momentum with ${Math.abs(crypto.changePercent).toFixed(2)}% move`,
          timeframe: '15m',
          urgency: Math.abs(crypto.changePercent) > 8 ? 'high' : 'medium',
          timestamp: Date.now()
        });
      }

      // Volatility breakout opportunities
      if (crypto.high - crypto.low > crypto.price * 0.08) {
        opportunities.push({
          id: `breakout_${crypto.symbol}_${Date.now()}`,
          symbol: crypto.symbol,
          type: 'volatility_breakout',
          signal: crypto.price > (crypto.high + crypto.low) / 2 ? 'long' : 'short',
          confidence: 75,
          entryPrice: crypto.price,
          targetPrice: crypto.price > (crypto.high + crypto.low) / 2 ? crypto.high * 1.02 : crypto.low * 0.98,
          stopLoss: crypto.price > (crypto.high + crypto.low) / 2 ? crypto.low : crypto.high,
          riskReward: 2.0,
          reasoning: `High volatility breakout opportunity with ${((crypto.high - crypto.low) / crypto.price * 100).toFixed(2)}% range`,
          timeframe: '1h',
          urgency: 'medium',
          timestamp: Date.now()
        });
      }

      // Funding rate arbitrage
      if (Math.abs(crypto.fundingRate) > 0.005) {
        opportunities.push({
          id: `funding_${crypto.symbol}_${Date.now()}`,
          symbol: crypto.symbol,
          type: 'funding_arbitrage',
          signal: crypto.fundingRate > 0 ? 'short' : 'long',
          confidence: 85,
          entryPrice: crypto.price,
          targetPrice: crypto.price * (1 + crypto.fundingRate),
          stopLoss: crypto.price * (1 - Math.abs(crypto.fundingRate) * 2),
          riskReward: 3.0,
          reasoning: `Funding rate arbitrage opportunity with ${(crypto.fundingRate * 100).toFixed(3)}% rate`,
          timeframe: '8h',
          urgency: Math.abs(crypto.fundingRate) > 0.008 ? 'high' : 'low',
          timestamp: Date.now()
        });
      }
    }

    return opportunities.sort((a, b) => b.confidence - a.confidence).slice(0, 10);
  }

  async getMomentumScalping(): Promise<CryptoOpportunity[]> {
    const cryptoData = await this.getCryptoFuturesData();
    const scalping: CryptoOpportunity[] = [];

    for (const crypto of cryptoData) {
      // High-frequency scalping opportunities
      if (crypto.volume > 5000000 && Math.abs(crypto.changePercent) > 2) {
        scalping.push({
          id: `scalp_${crypto.symbol}_${Date.now()}`,
          symbol: crypto.symbol,
          type: 'momentum',
          signal: crypto.changePercent > 0 ? 'long' : 'short',
          confidence: Math.min(crypto.volume / 100000, 90),
          entryPrice: crypto.price,
          targetPrice: crypto.changePercent > 0 ? crypto.price * 1.005 : crypto.price * 0.995,
          stopLoss: crypto.changePercent > 0 ? crypto.price * 0.998 : crypto.price * 1.002,
          riskReward: 1.5,
          reasoning: `High volume scalping opportunity with ${crypto.volume.toLocaleString()} volume`,
          timeframe: '1m',
          urgency: 'high',
          timestamp: Date.now()
        });
      }
    }

    return scalping.sort((a, b) => b.urgency === 'high' ? 1 : -1);
  }

  private getBasePriceForCrypto(symbol: string): number {
    const basePrices: { [key: string]: number } = {
      'BTCUSDT': 45000,
      'ETHUSDT': 2800,
      'ADAUSDT': 0.45,
      'SOLUSDT': 95,
      'DOTUSDT': 6.5,
      'AVAXUSDT': 35
    };
    return basePrices[symbol] || 100;
  }

  private getVolatilityForCrypto(symbol: string): number {
    const volatilities: { [key: string]: number } = {
      'BTCUSDT': 8,
      'ETHUSDT': 10,
      'ADAUSDT': 15,
      'SOLUSDT': 12,
      'DOTUSDT': 14,
      'AVAXUSDT': 16
    };
    return volatilities[symbol] || 12;
  }

  async getMarketRegime(): Promise<{
    regime: 'trending' | 'ranging' | 'volatile' | 'calm';
    confidence: number;
    description: string;
    tradingRecommendation: string;
  }> {
    const cryptoData = await this.getCryptoFuturesData();
    
    const avgVolatility = cryptoData.reduce((sum, crypto) => sum + Math.abs(crypto.changePercent), 0) / cryptoData.length;
    const avgVolume = cryptoData.reduce((sum, crypto) => sum + crypto.volume, 0) / cryptoData.length;
    
    let regime: 'trending' | 'ranging' | 'volatile' | 'calm';
    let description: string;
    let tradingRecommendation: string;
    
    if (avgVolatility > 6) {
      regime = 'volatile';
      description = `High volatility market with average ${avgVolatility.toFixed(2)}% moves`;
      tradingRecommendation = 'Focus on breakout strategies and tight risk management';
    } else if (avgVolatility > 3) {
      regime = 'trending';
      description = `Trending market with consistent directional moves`;
      tradingRecommendation = 'Use momentum strategies and trend following';
    } else if (avgVolatility < 1.5) {
      regime = 'calm';
      description = `Low volatility market with minimal price action`;
      tradingRecommendation = 'Consider range trading and funding rate strategies';
    } else {
      regime = 'ranging';
      description = `Range-bound market with sideways price action`;
      tradingRecommendation = 'Use mean reversion and support/resistance trading';
    }
    
    return {
      regime,
      confidence: Math.min(avgVolatility * 15, 95),
      description,
      tradingRecommendation
    };
  }
}

export default CryptoFuturesService;