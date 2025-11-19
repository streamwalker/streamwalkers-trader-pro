import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DipAnalysisResult, useDipAnalysisHistory } from '@/hooks/useDipAnalysis';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface DipAnalysisDetailDialogProps {
  result: DipAnalysisResult | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DipAnalysisDetailDialog({ result, open, onOpenChange }: DipAnalysisDetailDialogProps) {
  const { data: history } = useDipAnalysisHistory(result?.symbol || '', 30);

  if (!result) return null;

  const scoreBreakdown = [
    { name: 'Trend', score: result.trend_score, max: 2 },
    { name: 'Volume', score: result.volume_score, max: 2 },
    { name: 'Catalyst', score: result.catalyst_score, max: 2 },
    { name: 'RSI', score: result.rsi_score, max: 1 },
    { name: 'Support', score: result.support_score, max: 1 },
    { name: 'Insider', score: result.insider_score, max: 1 },
    { name: 'Options', score: result.options_flow_score, max: 1 },
  ];

  const chartData = history?.map(h => ({
    date: new Date(h.analysis_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    score: h.dip_quality_score,
    price: h.price
  })) || [];

  const getScoreColor = (score: number, max: number) => {
    const percent = (score / max) * 100;
    if (percent >= 80) return 'bg-green-500';
    if (percent >= 60) return 'bg-blue-500';
    if (percent >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl">{result.symbol} - Dip Analysis</DialogTitle>
              <DialogDescription>
                Detailed 7-point breakdown and historical trends
              </DialogDescription>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold text-primary">
                {result.dip_quality_score.toFixed(1)}
              </div>
              <p className="text-sm text-muted-foreground">Dip Quality Score</p>
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="breakdown" className="mt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="breakdown">7-Point Breakdown</TabsTrigger>
            <TabsTrigger value="details">Detailed Analysis</TabsTrigger>
            <TabsTrigger value="history">Historical Trend</TabsTrigger>
          </TabsList>

          <TabsContent value="breakdown" className="space-y-4">
            {/* Summary Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Analysis Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground mb-4">{result.analysis_summary}</p>
                <div className="flex items-center gap-4">
                  <Badge
                    variant={result.recommendation === 'buy_dip' ? 'default' : 'outline'}
                    className={
                      result.recommendation === 'buy_dip'
                        ? 'bg-green-500/10 text-green-700 dark:text-green-400'
                        : result.recommendation === 'wait'
                        ? 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400'
                        : 'bg-red-500/10 text-red-700 dark:text-red-400'
                    }
                  >
                    {result.recommendation.replace('_', ' ').toUpperCase()}
                  </Badge>
                  <Badge variant="outline">{result.confidence_level}% Confidence</Badge>
                  <Badge variant="outline">
                    {result.dip_type === 'type_a_buyable' ? 'Type A - Buyable' :
                     result.dip_type === 'type_b_trouble' ? 'Type B - Trouble' : 'Neutral'}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Score Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Score Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {scoreBreakdown.map((item) => (
                  <div key={item.name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{item.name}</span>
                      <span className="text-sm font-bold">
                        {item.score.toFixed(1)} / {item.max.toFixed(1)}
                      </span>
                    </div>
                    <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full ${getScoreColor(item.score, item.max)} transition-all`}
                        style={{ width: `${(item.score / item.max) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Opportunities & Risks */}
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    Opportunities
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {result.key_opportunities.length > 0 ? (
                    <ul className="space-y-2">
                      {result.key_opportunities.map((opp, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <TrendingUp className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>{opp}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground">No major opportunities identified</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-red-600" />
                    Risks
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {result.key_risks.length > 0 ? (
                    <ul className="space-y-2">
                      {result.key_risks.map((risk, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <TrendingDown className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                          <span>{risk}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground">No major risks identified</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="details" className="space-y-4">
            {/* Market Context */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Market Context</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Current Price</p>
                    <p className="text-2xl font-bold">${result.current_price.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Change</p>
                    <p className={`text-2xl font-bold ${result.price_change_percent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {result.price_change_percent >= 0 ? '+' : ''}{result.price_change_percent.toFixed(2)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Sector</p>
                    <p className="text-lg font-medium">{result.sector}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Volume</p>
                    <p className="text-lg font-medium">{(result.volume / 1000000).toFixed(2)}M</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Technical Data */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Technical Analysis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="font-medium mb-2">Trend Data</p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex justify-between p-2 bg-muted rounded">
                      <span>SMA 20:</span>
                      <span className="font-mono">${result.trend_data?.sma20?.toFixed(2) || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between p-2 bg-muted rounded">
                      <span>SMA 50:</span>
                      <span className="font-mono">${result.trend_data?.sma50?.toFixed(2) || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between p-2 bg-muted rounded">
                      <span>SMA 100:</span>
                      <span className="font-mono">${result.trend_data?.sma100?.toFixed(2) || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between p-2 bg-muted rounded">
                      <span>SMA 200:</span>
                      <span className="font-mono">${result.trend_data?.sma200?.toFixed(2) || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="font-medium mb-2">Volume Analysis</p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex justify-between p-2 bg-muted rounded">
                      <span>Panic Level:</span>
                      <Badge variant="outline">{result.volume_data?.panic_level || 'N/A'}</Badge>
                    </div>
                    <div className="flex justify-between p-2 bg-muted rounded">
                      <span>Red Day Ratio:</span>
                      <span className="font-mono">{result.volume_data?.red_day_ratio?.toFixed(2) || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="font-medium mb-2">RSI & Support</p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex justify-between p-2 bg-muted rounded">
                      <span>RSI (14):</span>
                      <span className="font-mono">{result.technical_data?.rsi?.rsi?.toFixed(2) || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between p-2 bg-muted rounded">
                      <span>Near Support:</span>
                      <Badge variant="outline">
                        {result.trend_data?.near_support ? 'Yes' : 'No'}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* News Sentiment */}
            {result.catalyst_data && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">News Sentiment</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Negative Articles:</span>
                      <Badge variant={result.catalyst_data.negative_news_count === 0 ? 'default' : 'destructive'}>
                        {result.catalyst_data.negative_news_count} / {result.catalyst_data.total_articles}
                      </Badge>
                    </div>
                    {result.catalyst_data.negative_articles?.length > 0 && (
                      <div className="mt-4">
                        <p className="text-sm font-medium mb-2">Recent Negative Headlines:</p>
                        <ul className="space-y-1">
                          {result.catalyst_data.negative_articles.map((article: string, i: number) => (
                            <li key={i} className="text-sm text-muted-foreground">• {article}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">30-Day Score History</CardTitle>
              </CardHeader>
              <CardContent>
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="date" className="text-xs" />
                      <YAxis domain={[0, 10]} className="text-xs" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--background))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '6px'
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="score"
                        stroke="hsl(var(--primary))"
                        strokeWidth={2}
                        dot={{ fill: 'hsl(var(--primary))' }}
                        name="Dip Quality Score"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    No historical data available yet
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
