import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { usePaperAccount, usePaperPositions, usePaperOrders, usePaperTradeAction, useSignals, useGenerateSignals } from '@/hooks/useQuantEngine';
import { Play, Square, AlertOctagon, RefreshCw, Zap, DollarSign, TrendingUp, TrendingDown, Activity } from 'lucide-react';

interface Props { strategyId?: string }

export default function QuantPaperTrading({ strategyId }: Props) {
  const { data: account, isLoading: accLoading } = usePaperAccount(strategyId);
  const { data: positions } = usePaperPositions(strategyId);
  const { data: orders } = usePaperOrders(strategyId);
  const { data: signals } = useSignals(strategyId);
  const paperAction = usePaperTradeAction();
  const generateSignals = useGenerateSignals();

  if (!strategyId) return (
    <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
      <CardContent className="flex flex-col items-center justify-center p-12">
        <Activity className="h-12 w-12 text-muted-foreground/50 mb-4" />
        <p className="text-muted-foreground">Select a strategy to start paper trading</p>
      </CardContent>
    </Card>
  );

  const isActive = account?.is_active;
  const isKilled = account?.kill_switch_triggered;

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3">
        {!isActive ? (
          <Button onClick={() => paperAction.mutate({ action: 'start', strategy_id: strategyId })} disabled={paperAction.isPending}>
            <Play className="h-4 w-4 mr-2" />Start Paper Trading
          </Button>
        ) : (
          <Button variant="secondary" onClick={() => paperAction.mutate({ action: 'stop', strategy_id: strategyId })} disabled={paperAction.isPending}>
            <Square className="h-4 w-4 mr-2" />Stop
          </Button>
        )}
        <Button variant="destructive" onClick={() => paperAction.mutate({ action: 'kill', strategy_id: strategyId })} disabled={paperAction.isPending || !isActive}>
          <AlertOctagon className="h-4 w-4 mr-2" />Kill Switch
        </Button>
        <Button variant="outline" onClick={() => paperAction.mutate({ action: 'update_prices', strategy_id: strategyId })} disabled={paperAction.isPending || !isActive}>
          <RefreshCw className="h-4 w-4 mr-2" />Update Prices
        </Button>
        <Button variant="outline" onClick={() => generateSignals.mutate({ strategy_id: strategyId })} disabled={generateSignals.isPending}>
          <Zap className="h-4 w-4 mr-2" />{generateSignals.isPending ? 'Generating...' : 'Generate Signals'}
        </Button>
        {isKilled && <Badge variant="destructive">KILL SWITCH TRIGGERED</Badge>}
      </div>

      {/* Account Summary */}
      {account && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            { label: 'Equity', value: `$${account.current_equity.toLocaleString()}`, icon: DollarSign },
            { label: 'Cash', value: `$${account.cash_balance.toLocaleString()}`, icon: DollarSign },
            { label: 'Total P&L', value: `$${account.total_pnl.toLocaleString()}`, icon: account.total_pnl >= 0 ? TrendingUp : TrendingDown, color: account.total_pnl >= 0 ? 'text-emerald-500' : 'text-destructive' },
            { label: 'Max DD', value: `${account.max_drawdown_pct}%`, icon: TrendingDown, color: 'text-destructive' },
            { label: 'Status', value: isActive ? 'Active' : isKilled ? 'Killed' : 'Stopped', icon: Activity, color: isActive ? 'text-emerald-500' : 'text-muted-foreground' },
          ].map((item, i) => (
            <Card key={i} className="border-border/40 bg-card/30 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-1">
                  <item.icon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">{item.label}</span>
                </div>
                <p className={`text-lg font-bold ${(item as any).color || 'text-foreground'}`}>{item.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Positions */}
        <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Open Positions ({positions?.length || 0})</CardTitle>
          </CardHeader>
          <CardContent>
            {positions && positions.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Symbol</TableHead>
                    <TableHead className="text-right">Qty</TableHead>
                    <TableHead className="text-right">Avg Entry</TableHead>
                    <TableHead className="text-right">Current</TableHead>
                    <TableHead className="text-right">P&L</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {positions.map(p => (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium">{p.symbol}</TableCell>
                      <TableCell className="text-right">{p.quantity}</TableCell>
                      <TableCell className="text-right">${p.avg_entry_price}</TableCell>
                      <TableCell className="text-right">${p.current_price}</TableCell>
                      <TableCell className={`text-right font-medium ${p.unrealized_pnl >= 0 ? 'text-emerald-500' : 'text-destructive'}`}>
                        ${p.unrealized_pnl?.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-6">No open positions</p>
            )}
          </CardContent>
        </Card>

        {/* Signals */}
        <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Latest Signals ({signals?.length || 0})</CardTitle>
          </CardHeader>
          <CardContent>
            {signals && signals.length > 0 ? (
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {signals.slice(0, 10).map(s => (
                  <div key={s.id} className="flex items-center justify-between p-3 rounded-lg border border-border/30 bg-card/20">
                    <div className="flex items-center gap-3">
                      <Badge variant={s.signal_type === 'buy' ? 'default' : s.signal_type === 'sell' ? 'destructive' : 'secondary'}>
                        {s.signal_type.toUpperCase()}
                      </Badge>
                      <div>
                        <p className="font-medium text-sm">{s.symbol}</p>
                        <p className="text-xs text-muted-foreground">{s.reasoning?.slice(0, 60)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{s.confidence}%</p>
                      <p className="text-xs text-muted-foreground">R:R {s.risk_reward}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-6">No signals generated</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Orders */}
      {orders && orders.length > 0 && (
        <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Order History</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Symbol</TableHead>
                  <TableHead>Side</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Qty</TableHead>
                  <TableHead className="text-right">Fill Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.slice(0, 15).map(o => (
                  <TableRow key={o.id}>
                    <TableCell className="font-medium">{o.symbol}</TableCell>
                    <TableCell><Badge variant={o.side === 'buy' ? 'default' : 'destructive'} className="text-xs">{o.side}</Badge></TableCell>
                    <TableCell className="text-xs">{o.order_type}</TableCell>
                    <TableCell className="text-right">{o.quantity}</TableCell>
                    <TableCell className="text-right">${o.filled_price || o.price}</TableCell>
                    <TableCell><Badge variant="outline" className="text-xs">{o.status}</Badge></TableCell>
                    <TableCell className="text-right text-xs">{new Date(o.created_at).toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
