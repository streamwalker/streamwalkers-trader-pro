import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Bot, User, Send, TrendingUp, TrendingDown, AlertTriangle, Mic, MicOff } from 'lucide-react';
import { useFuturesData, useVIXData, useMarketConditions, useStockData } from '@/hooks/useMarketData';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  recommendations?: Recommendation[];
}

interface Recommendation {
  symbol: string;
  action: 'BUY' | 'SELL' | 'HOLD';
  confidence: number;
  reasoning: string;
  targetPrice?: number;
  stopLoss?: number;
}

export const JarvisChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: "Hello! I'm Jarvis, your AI trading assistant. I can help you analyze markets, identify opportunities, and provide trading insights. What would you like to know about the markets today?",
      timestamp: new Date(),
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Market data hooks
  const { data: futuresData } = useFuturesData();
  const { data: vixData } = useVIXData();
  const { data: marketConditions } = useMarketConditions();
  const { data: stockData } = useStockData();

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const parseRecommendations = (content: string): Recommendation[] => {
    const recommendations: Recommendation[] = [];
    
    // Simple pattern matching for recommendations
    const buyPattern = /(?:BUY|Long)\s+([A-Z]{1,5})\s*(?:at|@|around)?\s*\$?(\d+(?:\.\d+)?)?/gi;
    const sellPattern = /(?:SELL|Short)\s+([A-Z]{1,5})\s*(?:at|@|around)?\s*\$?(\d+(?:\.\d+)?)?/gi;
    
    let match;
    while ((match = buyPattern.exec(content)) !== null) {
      recommendations.push({
        symbol: match[1],
        action: 'BUY',
        confidence: 0.75,
        reasoning: 'Based on technical analysis',
        targetPrice: match[2] ? parseFloat(match[2]) : undefined,
      });
    }
    
    while ((match = sellPattern.exec(content)) !== null) {
      recommendations.push({
        symbol: match[1],
        action: 'SELL',
        confidence: 0.75,
        reasoning: 'Based on technical analysis',
        targetPrice: match[2] ? parseFloat(match[2]) : undefined,
      });
    }
    
    return recommendations;
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
      console.log('Sending message to Jarvis:', {
        message: inputMessage,
        marketData: {
          futures: futuresData,
          vix: vixData,
          marketConditions,
          stockData,
        }
      });

      const { data, error } = await supabase.functions.invoke('jarvis-chat', {
        body: {
          message: inputMessage,
          marketData: {
            futures: futuresData,
            vix: vixData,
            marketConditions,
            stockData,
          },
          userContext: {
            // Add user preferences, portfolio info, etc.
          }
        }
      });

      if (error) {
        console.error('Jarvis error:', error);
        throw new Error(error.message || 'Failed to get response from Jarvis');
      }

      console.log('Jarvis response:', data);

      const recommendations = parseRecommendations(data.response);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: data.response,
        timestamp: new Date(),
        recommendations: recommendations.length > 0 ? recommendations : undefined,
      };

      setMessages(prev => [...prev, assistantMessage]);

      if (recommendations.length > 0) {
        toast({
          title: "New Trading Recommendations",
          description: `Jarvis has identified ${recommendations.length} trading opportunities`,
        });
      }

    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = error instanceof Error ? error.message : 'Sorry, I encountered an error. Please try again.';
      
      toast({
        title: "Jarvis Error",
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
    // Voice functionality to be implemented
    setIsListening(!isListening);
    toast({
      title: "Voice Feature",
      description: "Voice functionality coming soon!",
    });
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'BUY': return 'bg-green-500';
      case 'SELL': return 'bg-red-500';
      case 'HOLD': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'BUY': return <TrendingUp className="w-3 h-3" />;
      case 'SELL': return <TrendingDown className="w-3 h-3" />;
      default: return <AlertTriangle className="w-3 h-3" />;
    }
  };

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="w-5 h-5" />
          Jarvis Trading Assistant
          <Badge variant="outline" className="ml-auto">
            AI Powered
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col p-0">
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
                      : 'bg-secondary text-secondary-foreground'
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

                {/* Trading Recommendations */}
                {message.recommendations && message.recommendations.length > 0 && (
                  <div className="ml-11 space-y-2">
                    <Separator />
                    <div className="text-sm font-medium">Trading Recommendations:</div>
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
                                {Math.round(rec.confidence * 100)}% confidence
                              </Badge>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground">{rec.reasoning}</p>
                          {rec.targetPrice && (
                            <p className="text-sm mt-1">
                              Target: <span className="font-medium">${rec.targetPrice}</span>
                            </p>
                          )}
                          {rec.stopLoss && (
                            <p className="text-sm">
                              Stop Loss: <span className="font-medium">${rec.stopLoss}</span>
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center">
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
              placeholder="Ask Jarvis about market analysis, trading opportunities, or risk management..."
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
      </CardContent>
    </Card>
  );
};