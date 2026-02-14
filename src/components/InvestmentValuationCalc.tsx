import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2 } from 'lucide-react';

export const InvestmentValuationCalc = () => {
  const [principal, setPrincipal] = useState(10000);
  const [rate, setRate] = useState(8);
  const [time, setTime] = useState(10);
  const [compFreq, setCompFreq] = useState(12);
  const [pmt, setPmt] = useState(500);
  const [discountRate, setDiscountRate] = useState(10);
  const [initialInvestment, setInitialInvestment] = useState(50000);
  const [cashFlows, setCashFlows] = useState([15000, 18000, 20000, 22000, 25000]);

  const r = rate / 100;
  const simpleInterest = principal * (1 + r * time);
  const compoundInterest = principal * Math.pow(1 + r / compFreq, compFreq * time);
  const continuousComp = principal * Math.exp(r * time);
  const apy = (Math.pow(1 + r / compFreq, compFreq) - 1) * 100;
  const rule72 = rate > 0 ? 72 / rate : 0;
  const i = r / compFreq;
  const n = compFreq * time;
  const fvAnnuity = i > 0 ? pmt * ((Math.pow(1 + i, n) - 1) / i) : pmt * n;
  const pvAnnuity = i > 0 ? pmt * ((1 - Math.pow(1 + i, -n)) / i) : pmt * n;

  const dr = discountRate / 100;
  const npv = cashFlows.reduce((sum, cf, idx) => sum + cf / Math.pow(1 + dr, idx + 1), 0) - initialInvestment;

  // IRR via bisection
  const calcIRR = () => {
    let low = -0.5, high = 5;
    for (let iter = 0; iter < 100; iter++) {
      const mid = (low + high) / 2;
      const val = cashFlows.reduce((s, cf, idx) => s + cf / Math.pow(1 + mid, idx + 1), 0) - initialInvestment;
      if (Math.abs(val) < 0.01) return mid * 100;
      if (val > 0) low = mid; else high = mid;
    }
    return ((low + high) / 2) * 100;
  };
  const irr = calcIRR();

  let cumCF = 0;
  let paybackPeriod = cashFlows.length;
  for (let idx = 0; idx < cashFlows.length; idx++) {
    cumCF += cashFlows[idx];
    if (cumCF >= initialInvestment) {
      paybackPeriod = idx + 1 - (cumCF - initialInvestment) / cashFlows[idx];
      break;
    }
  }

  const ResultCard = ({ label, value, sub }: { label: string; value: string; sub?: string }) => (
    <Card className="border-primary/20">
      <CardContent className="pt-4 text-center">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-lg font-bold">{value}</p>
        {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Investment Valuation Calculator</CardTitle>
          <CardDescription>Time value of money: interest, annuities, NPV, IRR, and payback period</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="interest">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="interest">Interest & TVM</TabsTrigger>
              <TabsTrigger value="annuity">Annuities</TabsTrigger>
              <TabsTrigger value="npv">NPV / IRR</TabsTrigger>
            </TabsList>

            <TabsContent value="interest" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="space-y-1"><Label className="text-xs">Principal ($)</Label><Input type="number" value={principal} onChange={e => setPrincipal(+e.target.value || 0)} className="h-8 text-sm" /></div>
                <div className="space-y-1"><Label className="text-xs">Annual Rate (%)</Label><Input type="number" value={rate} onChange={e => setRate(+e.target.value || 0)} className="h-8 text-sm" /></div>
                <div className="space-y-1"><Label className="text-xs">Time (years)</Label><Input type="number" value={time} onChange={e => setTime(+e.target.value || 0)} className="h-8 text-sm" /></div>
                <div className="space-y-1"><Label className="text-xs">Comp. Frequency (m)</Label><Input type="number" value={compFreq} onChange={e => setCompFreq(+e.target.value || 1)} className="h-8 text-sm" /></div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                <ResultCard label="Simple Interest" value={`$${simpleInterest.toLocaleString(undefined, { maximumFractionDigits: 2 })}`} sub="A = P(1 + rt)" />
                <ResultCard label="Compound Interest" value={`$${compoundInterest.toLocaleString(undefined, { maximumFractionDigits: 2 })}`} sub={`A = P(1+r/m)^(mt)`} />
                <ResultCard label="Continuous" value={`$${continuousComp.toLocaleString(undefined, { maximumFractionDigits: 2 })}`} sub="A = Pe^(rt)" />
                <ResultCard label="APY" value={`${apy.toFixed(3)}%`} sub="(1+r/m)^m - 1" />
                <ResultCard label="Rule of 72" value={`${rule72.toFixed(1)} years`} sub="Doubling time ≈ 72/r" />
              </div>
            </TabsContent>

            <TabsContent value="annuity" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="space-y-1"><Label className="text-xs">Payment (PMT)</Label><Input type="number" value={pmt} onChange={e => setPmt(+e.target.value || 0)} className="h-8 text-sm" /></div>
                <div className="space-y-1"><Label className="text-xs">Rate (%)</Label><Input type="number" value={rate} onChange={e => setRate(+e.target.value || 0)} className="h-8 text-sm" /></div>
                <div className="space-y-1"><Label className="text-xs">Years</Label><Input type="number" value={time} onChange={e => setTime(+e.target.value || 0)} className="h-8 text-sm" /></div>
                <div className="space-y-1"><Label className="text-xs">Periods/Year</Label><Input type="number" value={compFreq} onChange={e => setCompFreq(+e.target.value || 1)} className="h-8 text-sm" /></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ResultCard label="Future Value of Annuity" value={`$${fvAnnuity.toLocaleString(undefined, { maximumFractionDigits: 2 })}`} sub="FV = PMT × [(1+i)^n - 1] / i" />
                <ResultCard label="Present Value of Annuity" value={`$${pvAnnuity.toLocaleString(undefined, { maximumFractionDigits: 2 })}`} sub="PV = PMT × [1 - (1+i)^(-n)] / i" />
              </div>
            </TabsContent>

            <TabsContent value="npv" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1"><Label className="text-xs">Initial Investment ($)</Label><Input type="number" value={initialInvestment} onChange={e => setInitialInvestment(+e.target.value || 0)} className="h-8 text-sm" /></div>
                <div className="space-y-1"><Label className="text-xs">Discount Rate (%)</Label><Input type="number" value={discountRate} onChange={e => setDiscountRate(+e.target.value || 0)} className="h-8 text-sm" /></div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Annual Cash Flows</Label>
                <div className="flex flex-wrap gap-2">
                  {cashFlows.map((cf, idx) => (
                    <div key={idx} className="flex items-center gap-1">
                      <span className="text-xs text-muted-foreground">Y{idx + 1}:</span>
                      <Input type="number" value={cf} onChange={e => { const n = [...cashFlows]; n[idx] = +e.target.value || 0; setCashFlows(n); }} className="h-7 w-24 text-xs" />
                      {cashFlows.length > 1 && <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setCashFlows(cashFlows.filter((_, i) => i !== idx))}><Trash2 className="h-3 w-3" /></Button>}
                    </div>
                  ))}
                  <Button variant="outline" size="sm" className="h-7" onClick={() => setCashFlows([...cashFlows, 10000])}><Plus className="h-3 w-3 mr-1" /> Year</Button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className={`border-${npv >= 0 ? 'accent' : 'destructive'}/30`}>
                  <CardContent className="pt-4 text-center">
                    <p className="text-xs text-muted-foreground">NPV</p>
                    <p className={`text-xl font-bold ${npv >= 0 ? 'text-green-500' : 'text-red-500'}`}>${npv.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
                    <Badge variant={npv >= 0 ? 'default' : 'destructive'} className="mt-1">{npv >= 0 ? 'Accept' : 'Reject'}</Badge>
                  </CardContent>
                </Card>
                <ResultCard label="IRR" value={`${irr.toFixed(2)}%`} sub="Internal Rate of Return" />
                <ResultCard label="Payback Period" value={`${paybackPeriod.toFixed(1)} years`} sub="Time to recover investment" />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
