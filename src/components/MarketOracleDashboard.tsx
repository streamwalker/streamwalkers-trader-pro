import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useMarketOracle } from "@/hooks/useMarketOracle";
import { Brain, TrendingUp, Activity, AlertTriangle, Clock, Target } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export function MarketOracleDashboard() {
  const { events, activeEvents, cycles, predictions, fetchData, predictImpact, isLoading } = useMarketOracle();

  const handleFetchNews = () => {
    fetchData.mutate('news');
  };

  const handleFetchMacro = () => {
    fetchData.mutate('macro_indicators');
  };

  const handlePredict = () => {
    predictImpact.mutate({ symbols: ['SPY', 'QQQ', 'AAPL', 'TSLA'], timeframe: 'medium' });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Brain className="w-12 h-12 animate-pulse mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading Market Oracle...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-2">
            <Brain className="w-8 h-8 text-primary" />
            Market Oracle
          </h2>
          <p className="text-muted-foreground mt-1">
            AI-powered predictive market analysis with multi-order effect tracking
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleFetchMacro} variant="outline" size="sm" disabled={fetchData.isPending}>
            {fetchData.isPending ? (
              <>
                <Brain className="w-4 h-4 mr-2 animate-pulse" />
                Analyzing...
              </>
            ) : (
              <>
                <Activity className="w-4 h-4 mr-2" />
                Update Macro
              </>
            )}
          </Button>
          <Button onClick={handleFetchNews} variant="outline" size="sm" disabled={fetchData.isPending}>
            <TrendingUp className="w-4 h-4 mr-2" />
            Fetch News
          </Button>
          <Button onClick={handlePredict} size="sm" disabled={predictImpact.isPending}>
            {predictImpact.isPending ? (
              <>
                <Brain className="w-4 h-4 mr-2 animate-pulse" />
                Analyzing...
              </>
            ) : (
              <>
                <Target className="w-4 h-4 mr-2" />
                Generate Predictions
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Active Events Alert */}
      {activeEvents.data && activeEvents.data.length > 0 && (
        <Alert className="border-orange-500/50 bg-orange-500/10">
          <AlertTriangle className="w-4 h-4 text-orange-500" />
          <AlertDescription>
            <span className="font-semibold">{activeEvents.data.length} Active Event(s)</span> currently impacting markets
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="events" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="cycles">Economic Cycles</TabsTrigger>
          <TabsTrigger value="predictions">Predictions</TabsTrigger>
          <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
        </TabsList>

        {/* Events Tab */}
        <TabsContent value="events" className="space-y-4">
          {events.data?.map((event) => (
            <Card key={event.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant={event.severity >= 7 ? "destructive" : event.severity >= 4 ? "default" : "secondary"}>
                      Severity: {event.severity}/10
                    </Badge>
                    <Badge variant="outline">{event.event_type.replace(/_/g, ' ')}</Badge>
                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDistanceToNow(new Date(event.start_date), { addSuffix: true })}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{event.description}</h3>
                  {event.confidence_score && (
                    <p className="text-sm text-muted-foreground">
                      Confidence: {(event.confidence_score * 100).toFixed(0)}%
                    </p>
                  )}
                </div>
              </div>

              {/* Affected Sectors */}
              {event.affected_sectors && event.affected_sectors.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-semibold mb-2">Affected Sectors:</h4>
                  <div className="flex flex-wrap gap-2">
                    {event.affected_sectors.map((sector, idx) => (
                      <Badge key={idx} variant="secondary">{sector}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Impact Timeline */}
              {event.impact_timeline && (
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold">Multi-Order Impact Analysis:</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(event.impact_timeline).map(([order, data]: [string, any]) => (
                      <div key={order} className="border rounded-lg p-3 bg-card">
                        <div className="font-medium text-sm mb-1 capitalize">{order.replace('_', ' ')}</div>
                        <div className="text-xs text-muted-foreground">
                          {data.timeline && <div className="mb-1">⏱️ {data.timeline}</div>}
                          {data.effects && (
                            <ul className="list-disc list-inside space-y-1">
                              {data.effects.map((effect: string, idx: number) => (
                                <li key={idx}>{effect}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          ))}

          {(!events.data || events.data.length === 0) && (
            <Card className="p-12 text-center">
              <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No economic events detected yet</p>
              <Button onClick={handleFetchNews} className="mt-4" variant="outline">
                Fetch Latest News
              </Button>
            </Card>
          )}
        </TabsContent>

        {/* Cycles Tab */}
        <TabsContent value="cycles" className="space-y-4">
          {cycles.data?.map((cycle) => (
            <Card key={cycle.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <Badge className="mb-2">{cycle.cycle_type.replace(/_/g, ' ')}</Badge>
                  <h3 className="text-xl font-semibold">{cycle.current_phase}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Phase started: {new Date(cycle.phase_start_date).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {cycle.indicator_values && Object.keys(cycle.indicator_values).length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold">Current Indicators:</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(cycle.indicator_values).map(([key, value]) => (
                      <div key={key} className="flex justify-between p-2 bg-muted rounded">
                        <span className="text-sm capitalize">{key.replace(/_/g, ' ')}:</span>
                        <span className="text-sm font-semibold">{JSON.stringify(value)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          ))}

          {(!cycles.data || cycles.data.length === 0) && (
            <Card className="p-12 text-center">
              <Activity className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No cycle data available</p>
              <Button onClick={handleFetchMacro} className="mt-4" variant="outline">
                Fetch Economic Data
              </Button>
            </Card>
          )}
        </TabsContent>

        {/* Predictions Tab */}
        <TabsContent value="predictions" className="space-y-4">
          {predictions.data?.map((prediction: any) => (
            <Card key={prediction.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline">
                      {formatDistanceToNow(new Date(prediction.prediction_date), { addSuffix: true })}
                    </Badge>
                    {prediction.accuracy_score && (
                      <Badge variant={prediction.accuracy_score > 0.7 ? "default" : "secondary"}>
                        Accuracy: {(prediction.accuracy_score * 100).toFixed(0)}%
                      </Badge>
                    )}
                  </div>
                  {prediction.economic_events && (
                    <h3 className="text-lg font-semibold mb-2">
                      Related to: {prediction.economic_events.description}
                    </h3>
                  )}
                </div>
              </div>

              {/* Trade Recommendations */}
              {prediction.trade_recommendations && prediction.trade_recommendations.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold">Trade Recommendations:</h4>
                  {prediction.trade_recommendations.map((trade: any, idx: number) => (
                    <div key={idx} className="border rounded-lg p-4 bg-card">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant={trade.action === 'LONG' ? 'default' : 'destructive'}>
                          {trade.action}
                        </Badge>
                        {trade.symbols && (
                          <span className="font-semibold">{trade.symbols.join(', ')}</span>
                        )}
                        {trade.confidence && (
                          <Badge variant="outline">
                            {(trade.confidence * 100).toFixed(0)}% confidence
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm mb-2">{trade.reasoning}</p>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        {trade.entry && <div>Entry: {trade.entry}</div>}
                        {trade.target && <div>Target: {trade.target}</div>}
                        {trade.stop && <div>Stop: {trade.stop}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Predicted Impact */}
              {prediction.predicted_impact && (
                <div className="mt-4 space-y-2">
                  <h4 className="text-sm font-semibold">Impact Prediction:</h4>
                  <div className="grid gap-2">
                    {Object.entries(prediction.predicted_impact).map(([key, value]) => (
                      <div key={key} className="p-2 bg-muted rounded text-sm">
                        <span className="font-medium capitalize">{key.replace(/_/g, ' ')}: </span>
                        <span>{JSON.stringify(value)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          ))}

          {(!predictions.data || predictions.data.length === 0) && (
            <Card className="p-12 text-center">
              <Target className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No predictions available</p>
              <Button onClick={handlePredict} className="mt-4" variant="outline">
                Generate Predictions
              </Button>
            </Card>
          )}
        </TabsContent>

        {/* Opportunities Tab */}
        <TabsContent value="opportunities" className="space-y-4">
          <Card className="p-12 text-center">
            <TrendingUp className="w-12 h-12 mx-auto mb-4 text-primary" />
            <h3 className="text-lg font-semibold mb-2">Real-Time Opportunity Scanner</h3>
            <p className="text-muted-foreground mb-4">
              Scanning for high-probability setups based on current events and cycle positions
            </p>
            <Button onClick={handlePredict} disabled={predictImpact.isPending} className="min-w-[200px]">
              {predictImpact.isPending ? (
                <>
                  <Brain className="w-4 h-4 mr-2 animate-pulse" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Target className="w-4 h-4 mr-2" />
                  Scan for Opportunities
                </>
              )}
            </Button>
          </Card>

          {/* Display prediction results if available */}
          {predictImpact.data && (
            <>
              <div className="flex items-center gap-2 my-4">
                <div className="flex-1 h-px bg-border" />
                <Badge className="bg-green-500/90 hover:bg-green-500 text-white">
                  ✓ New Predictions Available
                </Badge>
                <div className="flex-1 h-px bg-border" />
              </div>
              <Card className="p-6 border-green-500/50">
              <h3 className="text-xl font-semibold mb-4">Latest Market Predictions</h3>
              
              {predictImpact.data.market_regime && (
                <div className="mb-4">
                  <Badge className="mb-2">Market Regime: {predictImpact.data.market_regime}</Badge>
                  <p className="text-sm text-muted-foreground">
                    Overall Sentiment: {predictImpact.data.overall_sentiment}
                  </p>
                </div>
              )}

              {predictImpact.data.predictions && (
                <div className="space-y-3">
                  {predictImpact.data.predictions.map((pred: any, idx: number) => (
                    <div key={idx} className="border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold">{pred.symbol}</span>
                        <Badge variant={pred.direction === 'bullish' ? 'default' : pred.direction === 'bearish' ? 'destructive' : 'secondary'}>
                          {pred.direction}
                        </Badge>
                        <Badge variant="outline">{(pred.confidence * 100).toFixed(0)}% confidence</Badge>
                      </div>
                      <div className="text-sm space-y-1">
                        <div>Expected Move: {pred.predicted_move_percent}%</div>
                        <div>Risk Level: {pred.risk_level}</div>
                        {pred.key_factors && (
                          <div className="mt-2">
                            <span className="font-medium">Key Factors:</span>
                            <ul className="list-disc list-inside ml-2">
                              {pred.key_factors.map((factor: string, i: number) => (
                                <li key={i}>{factor}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
