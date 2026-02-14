import { MarketInsights } from '@/components/MarketInsights';
import { TechnicalIndicators } from '@/components/TechnicalIndicators';
import { EnhancedEchelonChat } from '@/components/EnhancedEchelonChat';
import { OpportunityScanner } from '@/components/OpportunityScanner';
import { AdvancedRiskManager } from '@/components/AdvancedRiskManager';
import { SupplyDemandSimulator } from '@/components/SupplyDemandSimulator';
import { ProbabilityExpectedValue } from '@/components/ProbabilityExpectedValue';
import { ROIResidualIncome } from '@/components/ROIResidualIncome';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Analytics = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Advanced Market Analytics</h1>
        <p className="text-muted-foreground">
          Phase II: AI-powered growth acceleration with crypto futures, pattern recognition, and advanced risk management
        </p>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-7">
          <TabsTrigger value="overview">Market Overview</TabsTrigger>
          <TabsTrigger value="jarvis">Enhanced Echelon</TabsTrigger>
          <TabsTrigger value="opportunities">Live Scanner</TabsTrigger>
          <TabsTrigger value="risk">Risk Management</TabsTrigger>
          <TabsTrigger value="economics">Economics</TabsTrigger>
          <TabsTrigger value="probability">Probability & EV</TabsTrigger>
          <TabsTrigger value="roi">ROI Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <MarketInsights />
              <TechnicalIndicators />
            </div>
            
            <div className="space-y-6">
              <EnhancedEchelonChat />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="jarvis" className="space-y-6">
          <EnhancedEchelonChat />
        </TabsContent>

        <TabsContent value="opportunities" className="space-y-6">
          <OpportunityScanner />
        </TabsContent>

        <TabsContent value="risk" className="space-y-6">
          <AdvancedRiskManager />
          <ProbabilityExpectedValue />
        </TabsContent>

        <TabsContent value="economics" className="space-y-6">
          <SupplyDemandSimulator />
        </TabsContent>

        <TabsContent value="probability" className="space-y-6">
          <ProbabilityExpectedValue />
        </TabsContent>

        <TabsContent value="roi" className="space-y-6">
          <ROIResidualIncome />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analytics;