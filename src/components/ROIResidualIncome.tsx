import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface InvestmentCenter {
  name: string;
  sales: number;
  noi: number;
  avgOperatingAssets: number;
}

export const ROIResidualIncome = () => {
  const [minReturn, setMinReturn] = useState(12);
  const [centers, setCenters] = useState<InvestmentCenter[]>([
    { name: 'Division A', sales: 500000, noi: 80000, avgOperatingAssets: 400000 },
    { name: 'Division B', sales: 800000, noi: 60000, avgOperatingAssets: 300000 },
    { name: 'Division C', sales: 1200000, noi: 180000, avgOperatingAssets: 1000000 },
  ]);

  // MCE inputs
  const [processTime, setProcessTime] = useState(4);
  const [inspectionTime, setInspectionTime] = useState(1);
  const [moveTime, setMoveTime] = useState(2);
  const [queueTime, setQueueTime] = useState(5);
  const [waitTime, setWaitTime] = useState(3);

  const throughputTime = processTime + inspectionTime + moveTime + queueTime + waitTime;
  const mce = throughputTime > 0 ? processTime / throughputTime : 0;

  const updateCenter = (idx: number, field: string, val: string) => {
    const n = [...centers];
    (n[idx] as any)[field] = field === 'name' ? val : parseFloat(val) || 0;
    setCenters(n);
  };

  const analysis = centers.map(c => {
    const margin = c.sales > 0 ? c.noi / c.sales : 0;
    const turnover = c.avgOperatingAssets > 0 ? c.sales / c.avgOperatingAssets : 0;
    const roi = margin * turnover * 100;
    const residualIncome = c.noi - c.avgOperatingAssets * (minReturn / 100);
    return { ...c, margin, turnover, roi, residualIncome };
  });

  const chartData = analysis.map(a => ({ name: a.name, ROI: +a.roi.toFixed(1), 'Residual Income': +a.residualIncome.toFixed(0) }));

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>ROI & Residual Income Dashboard</CardTitle>
          <CardDescription>DuPont decomposition with multi-center comparison and manufacturing efficiency</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <Label className="text-xs whitespace-nowrap">Minimum Required Return (%):</Label>
            <Input type="number" value={minReturn} onChange={e => setMinReturn(+e.target.value || 0)} className="h-8 w-24 text-sm" />
          </div>

          <div className="space-y-3">
            {centers.map((c, idx) => (
              <div key={idx} className="grid grid-cols-4 gap-3 items-end">
                <div><Label className="text-xs">Name</Label><Input value={c.name} onChange={e => updateCenter(idx, 'name', e.target.value)} className="h-7 text-sm" /></div>
                <div><Label className="text-xs">Sales ($)</Label><Input type="number" value={c.sales} onChange={e => updateCenter(idx, 'sales', e.target.value)} className="h-7 text-sm" /></div>
                <div><Label className="text-xs">NOI ($)</Label><Input type="number" value={c.noi} onChange={e => updateCenter(idx, 'noi', e.target.value)} className="h-7 text-sm" /></div>
                <div><Label className="text-xs">Avg Operating Assets ($)</Label><Input type="number" value={c.avgOperatingAssets} onChange={e => updateCenter(idx, 'avgOperatingAssets', e.target.value)} className="h-7 text-sm" /></div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {analysis.map((a, idx) => (
              <Card key={idx} className="border-primary/20">
                <CardHeader className="pb-2"><CardTitle className="text-sm">{a.name}</CardTitle></CardHeader>
                <CardContent className="space-y-2">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div><span className="text-muted-foreground">Margin:</span> <span className="font-medium">{(a.margin * 100).toFixed(1)}%</span></div>
                    <div><span className="text-muted-foreground">Turnover:</span> <span className="font-medium">{a.turnover.toFixed(2)}x</span></div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">ROI:</span>
                    <span className={`text-lg font-bold ${a.roi >= minReturn ? 'text-green-500' : 'text-red-500'}`}>{a.roi.toFixed(1)}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Residual Income:</span>
                    <div className="text-right">
                      <span className={`text-lg font-bold ${a.residualIncome >= 0 ? 'text-green-500' : 'text-red-500'}`}>${a.residualIncome.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                      <Badge variant={a.residualIncome >= 0 ? 'default' : 'destructive'} className="ml-2 text-xs">{a.residualIncome >= 0 ? 'Value Creating' : 'Value Destroying'}</Badge>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">ROI = {(a.margin * 100).toFixed(1)}% × {a.turnover.toFixed(2)} = {a.roi.toFixed(1)}%</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" fontSize={12} stroke="hsl(var(--muted-foreground))" />
                <YAxis fontSize={12} stroke="hsl(var(--muted-foreground))" />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
                <Bar dataKey="ROI" fill="hsl(var(--primary))" name="ROI %" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* MCE Section */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Manufacturing Cycle Efficiency (MCE)</CardTitle>
              <CardDescription>MCE = Process Time / Throughput Time — higher is better</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-5 gap-3 mb-4">
                <div><Label className="text-xs">Process (hrs)</Label><Input type="number" value={processTime} onChange={e => setProcessTime(+e.target.value || 0)} className="h-7 text-sm" /></div>
                <div><Label className="text-xs">Inspection (hrs)</Label><Input type="number" value={inspectionTime} onChange={e => setInspectionTime(+e.target.value || 0)} className="h-7 text-sm" /></div>
                <div><Label className="text-xs">Move (hrs)</Label><Input type="number" value={moveTime} onChange={e => setMoveTime(+e.target.value || 0)} className="h-7 text-sm" /></div>
                <div><Label className="text-xs">Queue (hrs)</Label><Input type="number" value={queueTime} onChange={e => setQueueTime(+e.target.value || 0)} className="h-7 text-sm" /></div>
                <div><Label className="text-xs">Wait (hrs)</Label><Input type="number" value={waitTime} onChange={e => setWaitTime(+e.target.value || 0)} className="h-7 text-sm" /></div>
              </div>
              <div className="flex items-center gap-6">
                <div>
                  <p className="text-sm text-muted-foreground">Throughput Time: <span className="font-medium text-foreground">{throughputTime} hrs</span></p>
                  <p className="text-sm text-muted-foreground">MCE: <span className={`text-lg font-bold ${mce > 0.5 ? 'text-green-500' : mce > 0.25 ? 'text-yellow-500' : 'text-red-500'}`}>{(mce * 100).toFixed(1)}%</span></p>
                </div>
                <div className="flex-1">
                  <div className="w-full bg-muted rounded-full h-3">
                    <div className={`h-3 rounded-full ${mce > 0.5 ? 'bg-green-500' : mce > 0.25 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${mce * 100}%` }} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};
