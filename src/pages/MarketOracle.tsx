import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MarketOracleDashboard } from "@/components/MarketOracleDashboard";
import { AnalysisEnginePanel } from "@/components/AnalysisEnginePanel";
import { OracleWatchlist } from "@/components/OracleWatchlist";
import { ScrapedNewsFeed } from "@/components/ScrapedNewsFeed";
import { CronMonitoringDashboard } from "@/components/CronMonitoringDashboard";
import { useMarketOracle } from "@/hooks/useMarketOracle";
import { Brain, Network, Activity, TrendingUp, Newspaper, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function MarketOracle() {
  const { predictions } = useMarketOracle();
  
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-4 mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Brain className="w-12 h-12 text-primary" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Market Oracle
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            AI-powered predictive market analysis with multi-order effect tracking. 
            Identify investment opportunities before they become obvious to the market.
          </p>
          
          <div className="flex items-center justify-center gap-4 mt-6">
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <Brain className="w-4 h-4 text-primary" />
                <span className="font-semibold text-sm">AI Classification</span>
              </div>
              <p className="text-xs text-muted-foreground">GPT-5 Event Parsing</p>
            </Card>
            
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <Network className="w-4 h-4 text-primary" />
                <span className="font-semibold text-sm">Causal Chains</span>
              </div>
              <p className="text-xs text-muted-foreground">4-Order Analysis</p>
            </Card>
            
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <Activity className="w-4 h-4 text-primary" />
                <span className="font-semibold text-sm">Real-Time Data</span>
              </div>
              <p className="text-xs text-muted-foreground">FRED, World Bank, News</p>
            </Card>
          </div>
        </div>

        {/* Key Features Banner */}
        <Card className="p-6 bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <span>🔮</span> Oracle Capabilities
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="font-semibold">Economic Cycles</span>
              <p className="text-muted-foreground text-xs">Track market, credit, employment, and business cycles</p>
            </div>
            <div>
              <span className="font-semibold">Event Detection</span>
              <p className="text-muted-foreground text-xs">Auto-classify government actions, monetary policy, crises</p>
            </div>
            <div>
              <span className="font-semibold">Multi-Order Effects</span>
              <p className="text-muted-foreground text-xs">Trace 1st through 4th order impacts over time</p>
            </div>
            <div>
              <span className="font-semibold">Trade Recommendations</span>
              <p className="text-muted-foreground text-xs">Specific symbols with entry/exit and confidence scores</p>
            </div>
          </div>
        </Card>

        {/* Main Content */}
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-6 mb-8">
            <TabsTrigger value="dashboard" className="text-base">
              <Brain className="w-4 h-4 mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="engine" className="text-base">
              <Network className="w-4 h-4 mr-2" />
              Analysis
            </TabsTrigger>
            <TabsTrigger value="watchlist" className="text-base">
              <TrendingUp className="w-4 h-4 mr-2" />
              Watchlist
            </TabsTrigger>
            <TabsTrigger value="news" className="text-base">
              <Newspaper className="w-4 h-4 mr-2" />
              News Feed
            </TabsTrigger>
            <TabsTrigger value="monitor" className="text-base">
              <Clock className="w-4 h-4 mr-2" />
              Monitor
            </TabsTrigger>
            <TabsTrigger value="examples" className="text-base">
              <Activity className="w-4 h-4 mr-2" />
              Examples
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <MarketOracleDashboard />
          </TabsContent>

          <TabsContent value="engine">
            <AnalysisEnginePanel />
          </TabsContent>

          <TabsContent value="watchlist">
            <OracleWatchlist predictions={predictions.data as any} />
          </TabsContent>

          <TabsContent value="news">
            <ScrapedNewsFeed />
          </TabsContent>

          <TabsContent value="monitor">
            <CronMonitoringDashboard />
          </TabsContent>

          <TabsContent value="examples" className="space-y-6">
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4">Example: Government Shutdown Analysis</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Badge>Day 1</Badge>
                    First Order Effects (Immediate)
                  </h3>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
                    <li>Federal workers and contractors not receiving paychecks</li>
                    <li>Government services immediately disrupted</li>
                    <li>National parks and museums close</li>
                  </ul>
                  <div className="mt-2 p-3 bg-muted rounded text-sm">
                    <span className="font-semibold">Oracle Alert:</span> Government shutdown detected. 
                    First-order impacts: Federal workers, contractors. Severity: 8/10
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Badge>Day 7-14</Badge>
                    Second Order Effects
                  </h3>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
                    <li>Consumer spending declines as workers conserve cash</li>
                    <li>Retail sales begin to weaken in affected areas</li>
                    <li>Local businesses near government facilities struggle</li>
                  </ul>
                  <div className="mt-2 p-3 bg-muted rounded text-sm">
                    <span className="font-semibold">Oracle Prediction:</span> Consumer spending likely to decline in next 7-14 days. 
                    Consider shorting retail (XRT). Confidence: 75%
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Badge variant="default">Day 15-28</Badge>
                    Third Order Effects
                  </h3>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
                    <li>TSA and ATC staffing shortages increase flight cancellations</li>
                    <li>Business travel disrupted, affecting airlines and hotels</li>
                    <li>Conference and event cancellations accelerate</li>
                  </ul>
                  <div className="mt-2 p-3 bg-orange-500/10 border border-orange-500/20 rounded text-sm">
                    <span className="font-semibold text-orange-600">Oracle Trade Idea:</span> SHORT Airlines (DAL, UAL, AAL) 
                    | Entry: Current price | Target: -8% | Stop: +3% | Confidence: 82% | Timeframe: 2-4 weeks
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Badge variant="destructive">Day 30-90</Badge>
                    Fourth Order Effects (Systemic)
                  </h3>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
                    <li>Supply chain disruptions from reduced business travel</li>
                    <li>Work-from-home tools see increased demand</li>
                    <li>Regional economic slowdown in government-heavy areas</li>
                    <li>Real estate market stress near federal facilities</li>
                  </ul>
                  <div className="mt-2 p-3 bg-blue-500/10 border border-blue-500/20 rounded text-sm">
                    <span className="font-semibold text-blue-600">Oracle Opportunity:</span> LONG Work-from-home tech (ZM, DOCU) 
                    as business travel substitution | LONG Rail/bus alternatives to airlines
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-green-500/10 border border-green-500/20 rounded">
                <h4 className="font-semibold mb-2 text-green-600">Outcome</h4>
                <p className="text-sm">
                  The Oracle identified the airline vulnerability <strong>25 days before</strong> it became obvious to the market, 
                  giving you time to position accordingly. Historical pattern: 2018-2019 shutdown showed similar cascading effects.
                </p>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4">How the Oracle Works</h2>
              
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="font-bold text-primary">1</span>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Data Ingestion</h3>
                    <p className="text-sm text-muted-foreground">
                      Continuously monitors FRED economic indicators, World Bank data, NewsData.io articles, 
                      and Finnhub market data for significant events
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="font-bold text-primary">2</span>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">AI Classification</h3>
                    <p className="text-sm text-muted-foreground">
                      GPT-5 analyzes content and classifies events into categories: government actions, monetary policy, 
                      geopolitical events, economic data, corporate events, crises, and more
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="font-bold text-primary">3</span>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Causal Chain Mapping</h3>
                    <p className="text-sm text-muted-foreground">
                      Advanced AI traces how events ripple through the economy, identifying 1st, 2nd, 3rd, and 4th order effects 
                      with specific timelines and affected sectors
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="font-bold text-primary">4</span>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Trade Generation</h3>
                    <p className="text-sm text-muted-foreground">
                      Based on causal analysis, generates specific trade recommendations with entry/exit levels, 
                      stop-losses, confidence scores, and position sizing
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="font-bold text-primary">5</span>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Continuous Learning</h3>
                    <p className="text-sm text-muted-foreground">
                      Tracks prediction accuracy against actual market outcomes and refines future predictions 
                      based on what worked and what didn't
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
