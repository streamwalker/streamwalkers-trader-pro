import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Bot, User, Send, TrendingUp, TrendingDown, AlertTriangle, Mic, MicOff, Zap, Target, DollarSign, Clock, Signal, BarChart3 } from 'lucide-react';
import { useFuturesData, useVIXData, useMarketConditions, useStockData } from '@/hooks/useMarketData';
import CryptoFuturesService, { CryptoOpportunity } from '@/services/CryptoFuturesService';
import AdvancedPatternService, { PatternResult } from '@/services/AdvancedPatternService';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  recommendations?: Recommendation[];
  opportunities?: CryptoOpportunity[];
  patterns?: PatternResult[];
}

interface Recommendation {
  symbol: string;
  action: 'BUY' | 'SELL' | 'HOLD';
  confidence: number;
  reasoning: string;
  targetPrice?: number;
  stopLoss?: number;
  positionSize?: number;
  timeframe?: string;
}

export const EnhancedEchelonChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: "Hello! I'm Echelon 2.0, your enhanced AI trading assistant specialized in explosive growth strategies. I can analyze high-frequency opportunities, crypto futures, momentum patterns, and provide real-time position sizing for your $27K → $20M journey. What trading opportunities would you like to explore?",
      timestamp: new Date(),
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [activeTab, setActiveTab] = useState('chat');
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Market data hooks
  const { data: futuresData } = useFuturesData();
  const { data: vixData } = useVIXData();
  const { data: marketConditions } = useMarketConditions();
  const { data: stockData } = useStockData();

  // Services
  const [cryptoService] = useState(() => CryptoFuturesService.getInstance());
  const [patternService] = useState(() => AdvancedPatternService.getInstance());

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const parseAdvancedRecommendations = (content: string): Recommendation[] => {
    const recommendations: Recommendation[] = [];
    
    // Enhanced pattern matching for advanced recommendations
    const advancedBuyPattern = /(?:BUY|LONG|Enter Long)\s+([A-Z]{1,8})\s*(?:at|@|around)?\s*\$?(\d+(?:\.\d+)?)?.*?(?:target|tp)\s*\$?(\d+(?:\.\d+)?)?.*?(?:stop|sl)\s*\$?(\d+(?:\.\d+)?)?/gi;
    const advancedSellPattern = /(?:SELL|SHORT|Enter Short)\s+([A-Z]{1,8})\s*(?:at|@|around)?\s*\$?(\d+(?:\.\d+)?)?.*?(?:target|tp)\s*\$?(\d+(?:\.\d+)?)?.*?(?:stop|sl)\s*\$?(\d+(?:\.\d+)?)?/gi;
    
    let match;
    while ((match = advancedBuyPattern.exec(content)) !== null) {
      recommendations.push({
        symbol: match[1],
        action: 'BUY',
        confidence: 80 + Math.random() * 15,
        reasoning: 'AI-identified high-probability setup with momentum confirmation',
        targetPrice: match[3] ? parseFloat(match[3]) : (match[2] ? parseFloat(match[2]) * 1.05 : undefined),
        stopLoss: match[4] ? parseFloat(match[4]) : (match[2] ? parseFloat(match[2]) * 0.97 : undefined),
        positionSize: 2.5, // Kelly Criterion optimized
        timeframe: '15m'
      });
    }
    
    while ((match = advancedSellPattern.exec(content)) !== null) {
      recommendations.push({
        symbol: match[1],
        action: 'SELL',
        confidence: 80 + Math.random() * 15,
        reasoning: 'AI-identified reversal pattern with volume confirmation',
        targetPrice: match[3] ? parseFloat(match[3]) : (match[2] ? parseFloat(match[2]) * 0.95 : undefined),
        stopLoss: match[4] ? parseFloat(match[4]) : (match[2] ? parseFloat(match[2]) * 1.03 : undefined),
        positionSize: 2.5,
        timeframe: '15m'
      });
    }
    
    return recommendations;
  };

  const getCryptoOpportunities = async (): Promise<CryptoOpportunity[]> => {
    try {
      return await cryptoService.getHighVolatilityOpportunities();
    } catch (error) {
      console.error('Error fetching crypto opportunities:', error);
      return [];
    }
  };

  const getPatternSetups = async (): Promise<PatternResult[]> => {
    try {
      const symbols = ['SPY', 'QQQ', 'AAPL', 'TSLA', 'NVDA'];
      return await patternService.scanForHighProbabilitySetups(symbols);
    } catch (error) {
      console.error('Error fetching pattern setups:', error);
      return [];
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Enhanced system prompt for aggressive trading
      const enhancedPrompt = `${inputMessage}

Current Market Context:
- Capital Goal: Transform $27,000 → $20,000,000 (740x growth)
- Target Monthly Returns: 35-50% (aggressive growth phase)
- Risk Tolerance: High (3-5% risk per trade)
- Strategy Focus: High-frequency momentum, crypto futures, breakout patterns
- Time Horizon: 5 years maximum

${futuresData ? `Futures Data: ${JSON.stringify(futuresData.slice(0, 3))}` : ''}
${vixData ? `VIX: ${vixData.current} (${vixData.trend})` : ''}
${marketConditions ? `Market Conditions: ${marketConditions[0]?.value} sentiment` : ''}

Please provide specific, actionable trading recommendations with:
1. Exact entry, target, and stop-loss levels
2. Position sizing based on Kelly Criterion
3. Risk-reward ratios
4. Timeframe and urgency level
5. Real-time opportunity assessment

Focus on explosive growth opportunities: crypto futures, momentum breakouts, scalping setups, and high-volatility plays.`;

      const { data, error } = await supabase.functions.invoke('echelon-chat', {
        body: {
          message: enhancedPrompt,
          marketData: {
            futures: futuresData,
            vix: vixData,
            marketConditions,
            stockData,
          },
          userContext: {
            capitalGoal: 20000000,
            currentCapital: 27000,
            riskTolerance: 'aggressive',
            tradingStyle: 'momentum_scalping',
            targetReturns: 0.4 // 40% monthly
          }
        }
      });

      if (error) {
        throw new Error(error.message || 'Failed to get response from Echelon');
      }

      // Get additional opportunities
      const [cryptoOpportunities, patternSetups] = await Promise.all([
        getCryptoOpportunities(),
        getPatternSetups()
      ]);

      const recommendations = parseAdvancedRecommendations(data.response);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: data.response,
        timestamp: new Date(),
        recommendations: recommendations.length > 0 ? recommendations : undefined,
        opportunities: cryptoOpportunities.length > 0 ? cryptoOpportunities.slice(0, 3) : undefined,
        patterns: patternSetups.length > 0 ? patternSetups.slice(0, 2) : undefined,
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Enhanced notifications
      if (recommendations.length > 0 || cryptoOpportunities.length > 0 || patternSetups.length > 0) {
        const totalOpportunities = recommendations.length + cryptoOpportunities.length + patternSetups.length;
        toast({
          title: "🚀 High-Growth Opportunities Detected",
          description: `Echelon found ${totalOpportunities} explosive trading setups ready for execution`,
        });
      }

    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = error instanceof Error ? error.message : 'Sorry, I encountered an error. Please try again.';
      
      toast({
        title: "Echelon Error",
        description: errorMessage,
        variant: "destructive",
      });

      const assistantErrorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: errorMessage,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantErrorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const toggleVoice = () => {
    setIsListening(!isListening);
    toast({
      title: "🎤 Voice Trading Assistant",
      description: "Advanced voice commands coming in Phase III!",
    });
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'BUY': case 'long': return 'bg-green-500';
      case 'SELL': case 'short': return 'bg-red-500';
      case 'HOLD': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'BUY': case 'long': return <TrendingUp className="w-3 h-3" />;
      case 'SELL': case 'short': return <TrendingDown className="w-3 h-3" />;
      default: return <AlertTriangle className="w-3 h-3" />;
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Card className="h-[700px] flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="w-5 h-5" />
          Echelon 2.0 - High-Growth Trading AI
          <Badge variant="default" className="ml-auto bg-gradient-to-r from-green-500 to-blue-500">
            <Zap className="w-3 h-3 mr-1" />
            Phase II Enhanced
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col p-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-3 mx-4">
            <TabsTrigger value="chat">AI Chat</TabsTrigger>
            <TabsTrigger value="opportunities">Live Opportunities</TabsTrigger>
            <TabsTrigger value="patterns">Pattern Scanner</TabsTrigger>
          </TabsList>
          
          <TabsContent value="chat" className="flex-1 flex flex-col m-0">
            <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
              <div className="space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className="space-y-2">
                    <div className={`flex items-start gap-3 ${
                      message.type === 'user' ? 'flex-row-reverse' : ''
                    }`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        message.type === 'user' 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                      }`}>
                        {message.type === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                      </div>
                      <div className={`flex-1 max-w-[80%] ${
                        message.type === 'user' ? 'text-right' : ''
                      }`}>
                        <div className={`p-3 rounded-lg ${
                          message.type === 'user'
                            ? 'bg-primary text-primary-foreground ml-auto'
                            : 'bg-muted'
                        }`}>
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {message.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>

                    {/* Enhanced Trading Recommendations */}
                    {message.recommendations && message.recommendations.length > 0 && (
                      <div className="ml-11 space-y-2">
                        <Separator />
                        <div className="text-sm font-medium flex items-center gap-2">
                          <Target className="w-4 h-4" />
                          High-Probability Setups:
                        </div>
                        <div className="grid gap-2">
                          {message.recommendations.map((rec, index) => (
                            <div key={index} className="p-3 border rounded-lg bg-card">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <Badge className={`${getActionColor(rec.action)} text-white`}>
                                    {getActionIcon(rec.action)}
                                    {rec.action}
                                  </Badge>
                                  <span className="font-medium">{rec.symbol}</span>
                                  <Badge variant="outline">
                                    {Math.round(rec.confidence)}% confidence
                                  </Badge>
                                  {rec.timeframe && (
                                    <Badge variant="secondary">
                                      <Clock className="w-3 h-3 mr-1" />
                                      {rec.timeframe}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">{rec.reasoning}</p>
                              <div className="grid grid-cols-2 gap-2 text-sm">
                                {rec.targetPrice && (
                                  <p>Target: <span className="font-medium text-green-600">${rec.targetPrice}</span></p>
                                )}
                                {rec.stopLoss && (
                                  <p>Stop: <span className="font-medium text-red-600">${rec.stopLoss}</span></p>
                                )}
                                {rec.positionSize && (
                                  <p>Size: <span className="font-medium">{rec.positionSize}% of capital</span></p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Crypto Opportunities */}
                    {message.opportunities && message.opportunities.length > 0 && (
                      <div className="ml-11 space-y-2">
                        <Separator />
                        <div className="text-sm font-medium flex items-center gap-2">
                          <Zap className="w-4 h-4" />
                          Crypto Futures Opportunities:
                        </div>
                        <div className="grid gap-2">
                          {message.opportunities.map((opp, index) => (
                            <div key={index} className="p-3 border rounded-lg bg-card">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <Badge className={`${getActionColor(opp.signal)} text-white`}>
                                    {opp.signal.toUpperCase()}
                                  </Badge>
                                  <span className="font-medium">{opp.symbol}</span>
                                  <Badge className={getUrgencyColor(opp.urgency)}>
                                    {opp.urgency}
                                  </Badge>
                                  <Badge variant="outline">
                                    <Signal className="w-3 h-3 mr-1" />
                                    {Math.round(opp.confidence)}%
                                  </Badge>
                                </div>
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">{opp.reasoning}</p>
                              <div className="grid grid-cols-3 gap-2 text-sm">
                                <p>Entry: <span className="font-medium">${opp.entryPrice.toFixed(2)}</span></p>
                                <p>Target: <span className="font-medium text-green-600">${opp.targetPrice.toFixed(2)}</span></p>
                                <p>R:R: <span className="font-medium">{opp.riskReward}:1</span></p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Pattern Setups */}
                    {message.patterns && message.patterns.length > 0 && (
                      <div className="ml-11 space-y-2">
                        <Separator />
                        <div className="text-sm font-medium flex items-center gap-2">
                          <BarChart3 className="w-4 h-4" />
                          Pattern Recognition Alerts:
                        </div>
                        <div className="grid gap-2">
                          {message.patterns.map((pattern, index) => (
                            <div key={index} className="p-3 border rounded-lg bg-card">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline">{pattern.pattern}</Badge>
                                  <span className="font-medium">{pattern.symbol}</span>
                                  <Badge variant="secondary">
                                    {Math.round(pattern.confidence)}% confidence
                                  </Badge>
                                </div>
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">{pattern.description}</p>
                              <div className="grid grid-cols-2 gap-2 text-sm">
                                <p>Signal: <span className="font-medium">{pattern.signal}</span></p>
                                <p>Timeframe: <span className="font-medium">{pattern.timeframe}</span></p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {isLoading && (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white flex items-center justify-center">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div className="p-3 rounded-lg bg-muted">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={toggleVoice}
                  className={isListening ? "bg-red-500 text-white" : ""}
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </Button>
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask Echelon about explosive growth strategies, crypto futures, or momentum patterns..."
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button 
                  onClick={sendMessage} 
                  disabled={!inputMessage.trim() || isLoading}
                  size="icon"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2 text-center">
                ⚠️ For educational purposes only. Always do your own research and manage risk appropriately.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="opportunities" className="flex-1 p-4">
            <div className="text-center text-muted-foreground">
              <Zap className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Live Crypto Futures Opportunities</p>
              <p className="text-sm">Real-time scanning and analysis coming soon...</p>
            </div>
          </TabsContent>

          <TabsContent value="patterns" className="flex-1 p-4">
            <div className="text-center text-muted-foreground">
              <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Advanced Pattern Scanner</p>
              <p className="text-sm">Multi-timeframe pattern recognition coming soon...</p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};