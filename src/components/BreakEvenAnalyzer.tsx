import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';

export const BreakEvenAnalyzer = () => {
  const [sellingPrice, setSellingPrice] = useState(50);
  const [variableCost, setVariableCost] = useState(30);
  const [fixedExpenses, setFixedExpenses] = useState(100000);
  const [targetIncome, setTargetIncome] = useState(50000);

  const cmPerUnit = sellingPrice - variableCost;
  const cmRatio = sellingPrice > 0 ? cmPerUnit / sellingPrice : 0;
  const breakEvenUnits = cmPerUnit > 0 ? Math.ceil(fixedExpenses / cmPerUnit) : 0;
  const breakEvenSales = cmRatio > 0 ? fixedExpenses / cmRatio : 0;
  const targetUnits = cmPerUnit > 0 ? Math.ceil((fixedExpenses + targetIncome) / cmPerUnit) : 0;
  const targetSales = cmRatio > 0 ? (fixedExpenses + targetIncome) / cmRatio : 0;

  const maxUnits = Math.max(breakEvenUnits * 2, targetUnits * 1.3, 100);
  const chartData = Array.from({ length: 20 }, (_, i) => {
    const units = Math.round((maxUnits / 19) * i);
    return {
      units,
      revenue: units * sellingPrice,
      totalCost: fixedExpenses + units * variableCost,
      fixedCost: fixedExpenses,
    };
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Break-Even & Contribution Margin Analyzer</CardTitle>
          <CardDescription>Compute break-even point, contribution margin, and target income units</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <Label className="text-xs">Selling Price/Unit ($)</Label>
              <Input type="number" value={sellingPrice} onChange={e => setSellingPrice(parseFloat(e.target.value) || 0)} className="h-8 text-sm" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Variable Cost/Unit ($)</Label>
              <Input type="number" value={variableCost} onChange={e => setVariableCost(parseFloat(e.target.value) || 0)} className="h-8 text-sm" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Fixed Expenses ($)</Label>
              <Input type="number" value={fixedExpenses} onChange={e => setFixedExpenses(parseFloat(e.target.value) || 0)} className="h-8 text-sm" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Target Income ($)</Label>
              <Input type="number" value={targetIncome} onChange={e => setTargetIncome(parseFloat(e.target.value) || 0)} className="h-8 text-sm" />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="border-primary/30">
              <CardContent className="pt-4 text-center">
                <p className="text-xs text-muted-foreground">CM/Unit</p>
                <p className="text-xl font-bold">${cmPerUnit.toFixed(2)}</p>
              </CardContent>
            </Card>
            <Card className="border-primary/30">
              <CardContent className="pt-4 text-center">
                <p className="text-xs text-muted-foreground">CM Ratio</p>
                <p className="text-xl font-bold">{(cmRatio * 100).toFixed(1)}%</p>
              </CardContent>
            </Card>
            <Card className="border-accent/50 bg-accent/5">
              <CardContent className="pt-4 text-center">
                <p className="text-xs text-muted-foreground">Break-Even Units</p>
                <p className="text-xl font-bold text-accent">{breakEvenUnits.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">${breakEvenSales.toLocaleString(undefined, { maximumFractionDigits: 0 })} sales</p>
              </CardContent>
            </Card>
            <Card className="border-primary/50 bg-primary/5">
              <CardContent className="pt-4 text-center">
                <p className="text-xs text-muted-foreground">Target Income Units</p>
                <p className="text-xl font-bold text-primary">{targetUnits.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">${targetSales.toLocaleString(undefined, { maximumFractionDigits: 0 })} sales</p>
              </CardContent>
            </Card>
          </div>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="units" label={{ value: 'Units', position: 'insideBottom', offset: -5 }} stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(v: number) => `$${v.toLocaleString()}`} contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" name="Revenue" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="totalCost" stroke="hsl(var(--destructive))" name="Total Cost" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="fixedCost" stroke="hsl(var(--muted-foreground))" name="Fixed Cost" strokeDasharray="5 5" dot={false} />
                {breakEvenUnits > 0 && <ReferenceLine x={breakEvenUnits} stroke="hsl(var(--accent))" strokeDasharray="3 3" label={{ value: 'Break-Even', fill: 'hsl(var(--accent))', fontSize: 11 }} />}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
