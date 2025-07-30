import { CandlestickData } from './MarketDataService';

export interface PatternResult {
  id: string;
  symbol: string;
  pattern: PatternType;
  signal: 'bullish' | 'bearish' | 'neutral';
  confidence: number;
  entryPrice: number;
  targetPrice: number;
  stopLoss: number;
  riskReward: number;
  description: string;
  timeframe: string;
  timestamp: number;
  urgency: 'low' | 'medium' | 'high';
}

export type PatternType = 
  | 'breakout_flag'
  | 'momentum_continuation'
  | 'volume_surge'
  | 'gap_fill'
  | 'squeeze_breakout'
  | 'reversal_hammer'
  | 'engulfing_pattern'
  | 'triangle_breakout'
  | 'support_resistance_break'
  | 'earnings_reaction';

export interface MarketMicrostructure {
  bidAskSpread: number;
  orderBookImbalance: number;
  institutionalFlow: 'buying' | 'selling' | 'neutral';
  retailSentiment: number; // -100 to 100
  optionsFlow: 'bullish' | 'bearish' | 'neutral';
  volumeProfile: 'accumulation' | 'distribution' | 'neutral';
  timestamp: number;
}

class AdvancedPatternService {
  private static instance: AdvancedPatternService;
  
  static getInstance(): AdvancedPatternService {
    if (!AdvancedPatternService.instance) {
      AdvancedPatternService.instance = new AdvancedPatternService();
    }
    return AdvancedPatternService.instance;
  }

  async scanForHighProbabilitySetups(symbols: string[]): Promise<PatternResult[]> {
    const patterns: PatternResult[] = [];
    
    for (const symbol of symbols) {
      try {
        // Simulate pattern scanning for each symbol
        const candleData = await this.getMockCandlestickData(symbol);
        const microstructure = await this.getMarketMicrostructure(symbol);
        
        const detectedPatterns = await this.analyzePatterns(symbol, candleData, microstructure);
        patterns.push(...detectedPatterns);
      } catch (error) {
        console.error(`Error scanning patterns for ${symbol}:`, error);
      }
    }
    
    return patterns
      .filter(p => p.confidence > 70)
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 20);
  }

  private async analyzePatterns(
    symbol: string, 
    candleData: CandlestickData[], 
    microstructure: MarketMicrostructure
  ): Promise<PatternResult[]> {
    const patterns: PatternResult[] = [];
    const currentPrice = candleData[candleData.length - 1]?.close || 100;
    
    // Momentum Breakout Pattern
    if (this.detectMomentumBreakout(candleData)) {
      patterns.push({
        id: `momentum_${symbol}_${Date.now()}`,
        symbol,
        pattern: 'momentum_continuation',
        signal: 'bullish',
        confidence: 85 + (microstructure.institutionalFlow === 'buying' ? 10 : 0),
        entryPrice: currentPrice,
        targetPrice: currentPrice * 1.05,
        stopLoss: currentPrice * 0.98,
        riskReward: 2.5,
        description: 'Strong momentum breakout with volume confirmation',
        timeframe: '15m',
        timestamp: Date.now(),
        urgency: 'high'
      });
    }

    // Volume Surge Pattern
    if (this.detectVolumeSurge(candleData)) {
      patterns.push({
        id: `volume_${symbol}_${Date.now()}`,
        symbol,
        pattern: 'volume_surge',
        signal: microstructure.institutionalFlow === 'buying' ? 'bullish' : 'bearish',
        confidence: 78,
        entryPrice: currentPrice,
        targetPrice: microstructure.institutionalFlow === 'buying' ? currentPrice * 1.03 : currentPrice * 0.97,
        stopLoss: microstructure.institutionalFlow === 'buying' ? currentPrice * 0.99 : currentPrice * 1.01,
        riskReward: 3.0,
        description: 'Unusual volume surge indicating institutional activity',
        timeframe: '5m',
        timestamp: Date.now(),
        urgency: 'high'
      });
    }

    // Gap Fill Opportunity
    if (this.detectGapFillOpportunity(candleData)) {
      patterns.push({
        id: `gap_${symbol}_${Date.now()}`,
        symbol,
        pattern: 'gap_fill',
        signal: 'bullish',
        confidence: 72,
        entryPrice: currentPrice,
        targetPrice: currentPrice * 1.02,
        stopLoss: currentPrice * 0.985,
        riskReward: 2.0,
        description: 'Gap fill opportunity with mean reversion potential',
        timeframe: '30m',
        timestamp: Date.now(),
        urgency: 'medium'
      });
    }

    // Squeeze Breakout
    if (this.detectSqueezeBreakout(candleData, microstructure)) {
      patterns.push({
        id: `squeeze_${symbol}_${Date.now()}`,
        symbol,
        pattern: 'squeeze_breakout',
        signal: microstructure.orderBookImbalance > 0 ? 'bullish' : 'bearish',
        confidence: 88,
        entryPrice: currentPrice,
        targetPrice: microstructure.orderBookImbalance > 0 ? currentPrice * 1.08 : currentPrice * 0.92,
        stopLoss: microstructure.orderBookImbalance > 0 ? currentPrice * 0.96 : currentPrice * 1.04,
        riskReward: 2.0,
        description: 'Low volatility squeeze ready for explosive breakout',
        timeframe: '1h',
        timestamp: Date.now(),
        urgency: 'high'
      });
    }

    // Support/Resistance Break
    if (this.detectSupportResistanceBreak(candleData)) {
      patterns.push({
        id: `sr_break_${symbol}_${Date.now()}`,
        symbol,
        pattern: 'support_resistance_break',
        signal: 'bullish',
        confidence: 75,
        entryPrice: currentPrice,
        targetPrice: currentPrice * 1.04,
        stopLoss: currentPrice * 0.97,
        riskReward: 1.8,
        description: 'Clean break above key resistance level',
        timeframe: '1h',
        timestamp: Date.now(),
        urgency: 'medium'
      });
    }

    return patterns;
  }

  private detectMomentumBreakout(candleData: CandlestickData[]): boolean {
    if (candleData.length < 5) return false;
    
    const recent = candleData.slice(-5);
    const priceChange = (recent[4].close - recent[0].close) / recent[0].close;
    const volumeIncrease = recent[4].volume > recent.slice(-4, -1).reduce((sum, c) => sum + c.volume, 0) / 3;
    
    return priceChange > 0.02 && volumeIncrease;
  }

  private detectVolumeSurge(candleData: CandlestickData[]): boolean {
    if (candleData.length < 10) return false;
    
    const recent = candleData.slice(-1)[0];
    const avgVolume = candleData.slice(-10, -1).reduce((sum, c) => sum + c.volume, 0) / 9;
    
    return recent.volume > avgVolume * 2.5;
  }

  private detectGapFillOpportunity(candleData: CandlestickData[]): boolean {
    if (candleData.length < 3) return false;
    
    const [prev, current] = candleData.slice(-2);
    const gapSize = Math.abs(current.open - prev.close) / prev.close;
    
    return gapSize > 0.005 && gapSize < 0.02;
  }

  private detectSqueezeBreakout(candleData: CandlestickData[], microstructure: MarketMicrostructure): boolean {
    if (candleData.length < 20) return false;
    
    const recent = candleData.slice(-20);
    const avgRange = recent.reduce((sum, c) => sum + (c.high - c.low), 0) / 20;
    const currentRange = recent[19].high - recent[19].low;
    
    return currentRange < avgRange * 0.5 && Math.abs(microstructure.orderBookImbalance) > 0.3;
  }

  private detectSupportResistanceBreak(candleData: CandlestickData[]): boolean {
    if (candleData.length < 15) return false;
    
    const recent = candleData.slice(-15);
    const resistance = Math.max(...recent.slice(0, -1).map(c => c.high));
    const current = recent[14];
    
    return current.close > resistance * 1.005;
  }

  private async getMockCandlestickData(symbol: string): Promise<CandlestickData[]> {
    // Generate mock candlestick data for pattern analysis
    const data: CandlestickData[] = [];
    let price = 100 + Math.random() * 200;
    
    for (let i = 0; i < 50; i++) {
      const change = (Math.random() - 0.5) * 0.02;
      const open = price;
      const close = price * (1 + change);
      const high = Math.max(open, close) * (1 + Math.random() * 0.01);
      const low = Math.min(open, close) * (1 - Math.random() * 0.01);
      const volume = Math.floor(Math.random() * 1000000) + 100000;
      
      data.push({
        timestamp: Date.now() - (50 - i) * 60000,
        open,
        high,
        low,
        close,
        volume
      });
      
      price = close;
    }
    
    return data;
  }

  private async getMarketMicrostructure(symbol: string): Promise<MarketMicrostructure> {
    return {
      bidAskSpread: Math.random() * 0.01,
      orderBookImbalance: (Math.random() - 0.5) * 2,
      institutionalFlow: Math.random() > 0.5 ? 'buying' : Math.random() > 0.5 ? 'selling' : 'neutral',
      retailSentiment: (Math.random() - 0.5) * 200,
      optionsFlow: Math.random() > 0.5 ? 'bullish' : Math.random() > 0.5 ? 'bearish' : 'neutral',
      volumeProfile: Math.random() > 0.5 ? 'accumulation' : Math.random() > 0.5 ? 'distribution' : 'neutral',
      timestamp: Date.now()
    };
  }

  async getEarningsReactionSetups(): Promise<PatternResult[]> {
    const earningsSymbols = ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'AMZN'];
    const setups: PatternResult[] = [];
    
    for (const symbol of earningsSymbols) {
      if (Math.random() > 0.7) { // 30% chance of earnings setup
        const currentPrice = 100 + Math.random() * 200;
        const expectedMove = currentPrice * (0.03 + Math.random() * 0.07);
        
        setups.push({
          id: `earnings_${symbol}_${Date.now()}`,
          symbol,
          pattern: 'earnings_reaction',
          signal: Math.random() > 0.5 ? 'bullish' : 'bearish',
          confidence: 80,
          entryPrice: currentPrice,
          targetPrice: currentPrice + (Math.random() > 0.5 ? expectedMove : -expectedMove),
          stopLoss: currentPrice + (Math.random() > 0.5 ? -expectedMove * 0.5 : expectedMove * 0.5),
          riskReward: 2.0,
          description: `Earnings reaction setup with ${(expectedMove / currentPrice * 100).toFixed(1)}% expected move`,
          timeframe: '1d',
          timestamp: Date.now(),
          urgency: 'high'
        });
      }
    }
    
    return setups;
  }

  async getIntradayScalpingSetups(): Promise<PatternResult[]> {
    const scalpingSymbols = ['SPY', 'QQQ', 'ES', 'NQ'];
    const setups: PatternResult[] = [];
    
    for (const symbol of scalpingSymbols) {
      const currentPrice = 100 + Math.random() * 300;
      
      // Generate 1-3 scalping setups per symbol
      const numSetups = Math.floor(Math.random() * 3) + 1;
      
      for (let i = 0; i < numSetups; i++) {
        setups.push({
          id: `scalp_${symbol}_${Date.now()}_${i}`,
          symbol,
          pattern: 'momentum_continuation',
          signal: Math.random() > 0.5 ? 'bullish' : 'bearish',
          confidence: 70 + Math.random() * 20,
          entryPrice: currentPrice,
          targetPrice: currentPrice * (Math.random() > 0.5 ? 1.002 : 0.998),
          stopLoss: currentPrice * (Math.random() > 0.5 ? 0.999 : 1.001),
          riskReward: 1.5 + Math.random() * 1.5,
          description: 'High-frequency scalping opportunity with tight risk management',
          timeframe: '1m',
          timestamp: Date.now(),
          urgency: 'high'
        });
      }
    }
    
    return setups.sort((a, b) => b.confidence - a.confidence);
  }
}

export default AdvancedPatternService;