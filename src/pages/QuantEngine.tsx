import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Cpu, Settings2, BarChart3, Activity, Shield, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import QuantStrategyBuilder from '@/components/QuantStrategyBuilder';
import QuantBacktestResults from '@/components/QuantBacktestResults';
import QuantPaperTrading from '@/components/QuantPaperTrading';
import QuantRiskMonitor from '@/components/QuantRiskMonitor';

export default function QuantEngine() {
  const [selectedStrategyId, setSelectedStrategyId] = useState<string | undefined>();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Cpu className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-2xl font-bold">Quant Engine</h1>
          <p className="text-sm text-muted-foreground">Strategy backtesting, paper trading & risk monitoring</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Link to="/tools/quant-engine/guide">
            <Button variant="outline" size="sm" className="gap-2">
              <BookOpen className="h-4 w-4" />
              User Guide
            </Button>
          </Link>
          <Badge variant="secondary">Paper Trading</Badge>
        </div>
      </div>

      <Tabs defaultValue="builder" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="builder" className="gap-2"><Settings2 className="h-4 w-4" />Strategy Builder</TabsTrigger>
          <TabsTrigger value="backtest" className="gap-2"><BarChart3 className="h-4 w-4" />Backtest Results</TabsTrigger>
          <TabsTrigger value="paper" className="gap-2"><Activity className="h-4 w-4" />Paper Trading</TabsTrigger>
          <TabsTrigger value="risk" className="gap-2"><Shield className="h-4 w-4" />Monitor & Risk</TabsTrigger>
        </TabsList>

        <TabsContent value="builder">
          <QuantStrategyBuilder onStrategySelect={setSelectedStrategyId} selectedStrategyId={selectedStrategyId} />
        </TabsContent>
        <TabsContent value="backtest">
          <QuantBacktestResults strategyId={selectedStrategyId} />
        </TabsContent>
        <TabsContent value="paper">
          <QuantPaperTrading strategyId={selectedStrategyId} />
        </TabsContent>
        <TabsContent value="risk">
          <QuantRiskMonitor strategyId={selectedStrategyId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
