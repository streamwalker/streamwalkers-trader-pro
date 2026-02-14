import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { usePaperAccount, usePaperPositions, useSignals, useStrategies } from '@/hooks/useQuantEngine';
import { Shield, AlertTriangle, CheckCircle, XCircle, Activity, TrendingDown, Target, BarChart3 } from 'lucide-react';

interface Props { strategyId?: string }

export default function QuantRiskMonitor({ strategyId }: Props) {
  const { data: account } = usePaperAccount(strategyId);
  const { data: positions } = usePaperPositions(strategyId);
  const { data: signals } = useSignals(strategyId);
  const { data: strategies } = useStrategies();
  const strategy = strategies?.find(s => s.id === strategyId);
  const riskControls = strategy?.risk_controls as any || {};

  if (!strategyId) return (
    <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
      <CardContent className="flex flex-col items-center justify-center p-12">
        <Shield className="h-12 w-12 text-muted-foreground/50 mb-4" />
        <p className="text-muted-foreground">Select a strategy to monitor risk</p>
      </CardContent>
    </Card>
  );

  const maxPosPct = riskControls.max_position_pct || 10;
  const maxDailyLossPct = riskControls.max_daily_loss_pct || 3;
  const maxDDPct = riskControls.max_drawdown_pct || 15;

  const currentDD = account?.max_drawdown_pct || 0;
  const ddUsage = Math.min(100, (currentDD / maxDDPct) * 100);
  const dailyLossUsage = account ? Math.min(100, (Math.abs(account.daily_pnl) / (account.starting_capital * maxDailyLossPct / 100)) * 100) : 0;

  // Position concentration
  const totalExposure = positions?.reduce((sum, p) => sum + Math.abs(p.quantity * p.current_price), 0) || 0;
  const equity = account?.current_equity || 100000;
  const exposurePct = (totalExposure / equity) * 100;

  // Signal accuracy (simple check)
  const buySignals = signals?.filter(s => s.signal_type === 'buy') || [];
  const sellSignals = signals?.filter(s => s.signal_type === 'sell') || [];
  const totalSignals = (signals?.length || 0);

  const riskChecks = [
    {
      label: 'Drawdown within limits',
      status: currentDD < maxDDPct ? 'ok' : 'danger',
      detail: `${currentDD.toFixed(1)}% / ${maxDDPct}% max`,
    },
    {
      label: 'Daily loss within limits',
      status: dailyLossUsage < 80 ? 'ok' : dailyLossUsage < 100 ? 'warn' : 'danger',
      detail: `${dailyLossUsage.toFixed(0)}% of daily limit used`,
    },
    {
      label: 'Kill switch',
      status: account?.kill_switch_triggered ? 'danger' : 'ok',
      detail: account?.kill_switch_triggered ? 'TRIGGERED' : 'Armed',
    },
    {
      label: 'Position sizing',
      status: exposurePct <= maxPosPct * (positions?.length || 1) ? 'ok' : 'warn',
      detail: `${exposurePct.toFixed(1)}% total exposure`,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Risk Status */}
      <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Risk Dashboard
            {account?.kill_switch_triggered && <Badge variant="destructive">KILL SWITCH ACTIVE</Badge>}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {riskChecks.map((check, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-border/30 bg-card/20">
              <div className="flex items-center gap-3">
                {check.status === 'ok' ? <CheckCircle className="h-5 w-5 text-emerald-500" /> :
                  check.status === 'warn' ? <AlertTriangle className="h-5 w-5 text-amber-500" /> :
                    <XCircle className="h-5 w-5 text-destructive" />}
                <span className="font-medium text-sm">{check.label}</span>
              </div>
              <span className="text-sm text-muted-foreground">{check.detail}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Drawdown Gauge */}
        <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2"><TrendingDown className="h-4 w-4" />Drawdown Usage</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Progress value={ddUsage} className="h-3" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Current: {currentDD.toFixed(1)}%</span>
              <span>Limit: {maxDDPct}%</span>
            </div>
            {ddUsage > 75 && <p className="text-xs text-amber-500 font-medium">⚠ Approaching drawdown limit</p>}
          </CardContent>
        </Card>

        {/* Signal Summary */}
        <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2"><Target className="h-4 w-4" />Signal Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-emerald-500">{buySignals.length}</p>
                <p className="text-xs text-muted-foreground">Buy Signals</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-destructive">{sellSignals.length}</p>
                <p className="text-xs text-muted-foreground">Sell Signals</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{totalSignals}</p>
                <p className="text-xs text-muted-foreground">Total</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Exposure */}
      <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2"><BarChart3 className="h-4 w-4" />Position Exposure</CardTitle>
        </CardHeader>
        <CardContent>
          {positions && positions.length > 0 ? (
            <div className="space-y-3">
              {positions.map(p => {
                const posPct = equity > 0 ? (Math.abs(p.quantity * p.current_price) / equity) * 100 : 0;
                return (
                  <div key={p.id} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{p.symbol}</span>
                      <span className="text-muted-foreground">{posPct.toFixed(1)}% of portfolio</span>
                    </div>
                    <Progress value={Math.min(100, (posPct / maxPosPct) * 100)} className="h-2" />
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">No open positions</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
