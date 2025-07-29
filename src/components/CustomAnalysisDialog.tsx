import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { BarChart3, TrendingUp, Target, Activity, BookOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AnalysisSettings {
  symbol: string;
  timeframe: string;
  indicators: {
    rsi: boolean;
    macd: boolean;
    sma: boolean;
    bollinger: boolean;
  };
  analysisType: string;
}

interface CustomAnalysisDialogProps {
  children: React.ReactNode;
}

export const CustomAnalysisDialog = ({ children }: CustomAnalysisDialogProps) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState<AnalysisSettings>({
    symbol: "ES",
    timeframe: "5min",
    indicators: {
      rsi: true,
      macd: true,
      sma: false,
      bollinger: false,
    },
    analysisType: "trend"
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<any>(null);

  const symbols = [
    { value: "ES", label: "ES - S&P 500 E-mini" },
    { value: "NQ", label: "NQ - Nasdaq E-mini" },
    { value: "YM", label: "YM - Dow E-mini" },
    { value: "RTY", label: "RTY - Russell 2000 E-mini" },
  ];

  const timeframes = [
    { value: "1min", label: "1 Minute" },
    { value: "5min", label: "5 Minutes" },
    { value: "15min", label: "15 Minutes" },
    { value: "1hr", label: "1 Hour" },
    { value: "daily", label: "Daily" },
  ];

  const analysisTypes = [
    { value: "trend", label: "Trend Analysis" },
    { value: "momentum", label: "Momentum Analysis" },
    { value: "volatility", label: "Volatility Analysis" },
    { value: "support_resistance", label: "Support/Resistance" },
  ];

  const handleIndicatorChange = (indicator: keyof typeof settings.indicators) => {
    setSettings(prev => ({
      ...prev,
      indicators: {
        ...prev.indicators,
        [indicator]: !prev.indicators[indicator]
      }
    }));
  };

  const runAnalysis = async () => {
    setIsAnalyzing(true);
    
    // Simulate analysis
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate mock results based on settings
    const mockResults = {
      symbol: settings.symbol,
      timeframe: settings.timeframe,
      signals: [
        {
          type: "RSI Signal",
          value: settings.indicators.rsi ? "Oversold (32)" : null,
          strength: "Strong",
          confidence: 85
        },
        {
          type: "MACD Signal", 
          value: settings.indicators.macd ? "Bullish Crossover" : null,
          strength: "Moderate",
          confidence: 72
        },
        {
          type: "Price Action",
          value: "Breaking resistance",
          strength: "Strong",
          confidence: 91
        }
      ].filter(signal => signal.value),
      summary: `${settings.symbol} showing ${settings.analysisType === 'trend' ? 'bullish momentum' : 'mixed signals'} on ${settings.timeframe} timeframe`,
      recommendation: settings.analysisType === 'trend' ? "Consider long position" : "Wait for confirmation"
    };

    setResults(mockResults);
    setIsAnalyzing(false);
    
    toast({
      title: "Analysis Complete",
      description: `Custom analysis for ${settings.symbol} has been generated.`,
    });
  };

  const savePreset = () => {
    toast({
      title: "Preset Saved",
      description: "Your analysis configuration has been saved.",
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Custom Market Analysis
          </DialogTitle>
          <DialogDescription>
            Configure custom technical analysis parameters and generate detailed market insights.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Configuration Panel */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Analysis Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Symbol</Label>
                  <Select value={settings.symbol} onValueChange={(value) => setSettings(prev => ({ ...prev, symbol: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {symbols.map(symbol => (
                        <SelectItem key={symbol.value} value={symbol.value}>
                          {symbol.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Timeframe</Label>
                  <Select value={settings.timeframe} onValueChange={(value) => setSettings(prev => ({ ...prev, timeframe: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {timeframes.map(tf => (
                        <SelectItem key={tf.value} value={tf.value}>
                          {tf.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Analysis Type</Label>
                  <Select value={settings.analysisType} onValueChange={(value) => setSettings(prev => ({ ...prev, analysisType: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {analysisTypes.map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label>Technical Indicators</Label>
                  <div className="space-y-3">
                    {Object.entries(settings.indicators).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between">
                        <Label htmlFor={key} className="text-sm capitalize">
                          {key === 'sma' ? 'SMA (20, 50)' : key === 'bollinger' ? 'Bollinger Bands' : key.toUpperCase()}
                        </Label>
                        <Switch
                          id={key}
                          checked={value}
                          onCheckedChange={() => handleIndicatorChange(key as keyof typeof settings.indicators)}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button onClick={runAnalysis} disabled={isAnalyzing} className="flex-1">
                    {isAnalyzing ? "Analyzing..." : "Run Analysis"}
                  </Button>
                  <Button variant="outline" onClick={savePreset}>
                    Save Preset
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results Panel */}
          <div className="space-y-4">
            {results ? (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Activity className="h-5 w-5" />
                      Analysis Results
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Symbol</span>
                      <Badge variant="outline">{results.symbol}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Timeframe</span>
                      <Badge variant="outline">{results.timeframe}</Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      Signals Generated
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {results.signals.map((signal: any, index: number) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium text-sm">{signal.type}</div>
                            <div className="text-sm text-muted-foreground">{signal.value}</div>
                          </div>
                          <div className="text-right">
                            <Badge variant={signal.strength === "Strong" ? "default" : "secondary"} className="mb-1">
                              {signal.strength}
                            </Badge>
                            <div className="text-xs text-muted-foreground">{signal.confidence}%</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <BookOpen className="h-5 w-5" />
                      Summary & Recommendation
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Analysis Summary</div>
                      <p className="text-sm">{results.summary}</p>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Recommendation</div>
                      <Badge variant="default">{results.recommendation}</Badge>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card>
                <CardContent className="flex items-center justify-center h-64 text-muted-foreground">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Configure your analysis settings and click "Run Analysis" to generate insights.</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};