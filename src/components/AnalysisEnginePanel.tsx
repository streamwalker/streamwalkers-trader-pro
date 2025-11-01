import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAnalysisEngine } from "@/hooks/useAnalysisEngine";
import { useMarketOracle } from "@/hooks/useMarketOracle";
import { Brain, Network, Target, TrendingUp, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";

export function AnalysisEnginePanel() {
  const { parseEvents, calculateChains, mapSectors, isAnalyzing } = useAnalysisEngine();
  const { activeEvents, fetchData } = useMarketOracle();

  const handleFullAnalysis = async () => {
    // Step 1: Fetch latest news
    const newsResult = await fetchData.mutateAsync('news');
    
    // Step 2: Parse and classify events
    if (newsResult?.articles) {
      await parseEvents.mutateAsync({
        newsArticles: newsResult.articles
      });
    }
  };

  const handleAnalyzeEvent = async (eventId: string) => {
    // Calculate causal chains
    await calculateChains.mutateAsync(eventId);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Network className="w-7 h-7 text-primary" />
            Analysis Engine
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Multi-order causal analysis with AI-powered event classification
          </p>
        </div>
        <Button 
          onClick={handleFullAnalysis} 
          disabled={isAnalyzing}
          size="lg"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Brain className="w-4 h-4 mr-2" />
              Run Full Analysis
            </>
          )}
        </Button>
      </div>

      {/* Analysis Pipeline Visualization */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Analysis Pipeline</h3>
        <div className="space-y-4">
          {/* Step 1 */}
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <span className="font-bold text-primary">1</span>
            </div>
            <div className="flex-1">
              <h4 className="font-semibold mb-1">Event Detection & Classification</h4>
              <p className="text-sm text-muted-foreground mb-2">
                Parse news articles and economic data to identify significant events
              </p>
              <Button 
                onClick={() => handleFullAnalysis()} 
                variant="outline" 
                size="sm"
                disabled={parseEvents.isPending}
              >
                {parseEvents.isPending ? (
                  <>
                    <Loader2 className="w-3 h-3 mr-2 animate-spin" />
                    Parsing...
                  </>
                ) : (
                  'Parse & Classify Events'
                )}
              </Button>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <span className="font-bold text-primary">2</span>
            </div>
            <div className="flex-1">
              <h4 className="font-semibold mb-1">Causal Chain Mapping</h4>
              <p className="text-sm text-muted-foreground mb-2">
                Trace 1st through 4th order effects with timeline predictions
              </p>
              {activeEvents.data && activeEvents.data.length > 0 && (
                <div className="space-y-2">
                  {activeEvents.data.slice(0, 3).map((event) => (
                    <div key={event.id} className="flex items-center gap-2">
                      <Button
                        onClick={() => handleAnalyzeEvent(event.id)}
                        variant="outline"
                        size="sm"
                        disabled={calculateChains.isPending}
                      >
                        Analyze
                      </Button>
                      <span className="text-sm">{event.description.slice(0, 60)}...</span>
                      <Badge variant="outline" className="ml-auto">
                        Severity: {event.severity}/10
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <span className="font-bold text-primary">3</span>
            </div>
            <div className="flex-1">
              <h4 className="font-semibold mb-1">Sector Impact Mapping</h4>
              <p className="text-sm text-muted-foreground mb-2">
                Identify all affected sectors with correlation analysis
              </p>
              <Badge variant="secondary">Auto-triggered by causal analysis</Badge>
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <span className="font-bold text-primary">4</span>
            </div>
            <div className="flex-1">
              <h4 className="font-semibold mb-1">Trade Recommendation Generation</h4>
              <p className="text-sm text-muted-foreground mb-2">
                Generate specific trade ideas with entry/exit levels and confidence scores
              </p>
              <Badge variant="secondary">Auto-triggered by causal analysis</Badge>
            </div>
          </div>
        </div>
      </Card>

      {/* Engine Capabilities */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3 mb-2">
            <Brain className="w-8 h-8 text-primary" />
            <div>
              <h3 className="font-semibold">AI Classification</h3>
              <p className="text-xs text-muted-foreground">GPT-5 powered</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Automatically categorizes events into government actions, monetary policy, geopolitical events, and more
          </p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3 mb-2">
            <Network className="w-8 h-8 text-primary" />
            <div>
              <h3 className="font-semibold">Causal Chains</h3>
              <p className="text-xs text-muted-foreground">Multi-order analysis</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Maps how events ripple through the economy from immediate to systemic impacts over 1-3 months
          </p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3 mb-2">
            <Target className="w-8 h-8 text-primary" />
            <div>
              <h3 className="font-semibold">Accuracy Tracking</h3>
              <p className="text-xs text-muted-foreground">Self-improving</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Scores predictions against actual outcomes to improve future accuracy
          </p>
        </Card>
      </div>

      {/* Recent Analysis Results */}
      {(parseEvents.data || calculateChains.data) && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Latest Analysis Results
          </h3>
          
          {parseEvents.data && (
            <div className="mb-4">
              <h4 className="font-semibold text-sm mb-2">Event Classification</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Events Classified:</span>
                  <Badge>{parseEvents.data.classified_events?.length || 0}</Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Significant Events Stored:</span>
                  <Badge variant="default">{parseEvents.data.stored_events?.length || 0}</Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Market Regime:</span>
                  <Badge variant="outline">{parseEvents.data.market_regime}</Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Risk Level:</span>
                  <Badge variant={parseEvents.data.risk_level === 'elevated' ? 'destructive' : 'secondary'}>
                    {parseEvents.data.risk_level}
                  </Badge>
                </div>
              </div>
            </div>
          )}
          
          {calculateChains.data && (
            <div>
              <h4 className="font-semibold text-sm mb-2">Causal Chain Analysis</h4>
              <div className="space-y-2">
                {calculateChains.data.causal_chains?.trade_recommendations && (
                  <div className="flex justify-between text-sm">
                    <span>Trade Recommendations:</span>
                    <Badge variant="default">
                      {calculateChains.data.causal_chains.trade_recommendations.length}
                    </Badge>
                  </div>
                )}
                {calculateChains.data.causal_chains?.all_affected_sectors && (
                  <div className="flex justify-between text-sm">
                    <span>Affected Sectors:</span>
                    <Badge variant="secondary">
                      {calculateChains.data.causal_chains.all_affected_sectors.length}
                    </Badge>
                  </div>
                )}
              </div>
            </div>
          )}
        </Card>
      )}

      {/* Info Alert */}
      <Alert>
        <Brain className="w-4 h-4" />
        <AlertDescription>
          The Analysis Engine uses GPT-5 to perform sophisticated causal analysis. It learns from prediction accuracy over time to improve future forecasts.
        </AlertDescription>
      </Alert>
    </div>
  );
}
