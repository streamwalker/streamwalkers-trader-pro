import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { HelpCircle } from 'lucide-react';

const InfoTip = ({ text }: { text: string }) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger><HelpCircle className="h-3.5 w-3.5 text-muted-foreground" /></TooltipTrigger>
      <TooltipContent className="max-w-xs"><p className="text-xs">{text}</p></TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

const RatioDisplay = ({ label, value, suffix = '', tip, health }: { label: string; value: number | null; suffix?: string; tip: string; health?: 'good' | 'warn' | 'bad' | null }) => {
  const color = health === 'good' ? 'text-green-500' : health === 'warn' ? 'text-yellow-500' : health === 'bad' ? 'text-red-500' : 'text-foreground';
  return (
    <div className="flex items-center justify-between p-3 border rounded-lg">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">{label}</span>
        <InfoTip text={tip} />
      </div>
      <span className={`text-sm font-bold ${color}`}>
        {value !== null && !isNaN(value) && isFinite(value) ? `${value.toFixed(2)}${suffix}` : '—'}
      </span>
    </div>
  );
};

export const FinancialRatiosCalculator = () => {
  const [data, setData] = useState({
    currentAssets: 500000, currentLiabilities: 250000, inventory: 100000,
    accountsReceivable: 80000, netCreditSales: 960000, cogs: 600000,
    avgInventory: 95000, totalAssets: 1200000, netIncome: 150000,
    sales: 1000000, totalEquity: 500000, sharesOutstanding: 100000,
    marketPrice: 25, dividendsPerShare: 0.80, interestExpense: 30000,
    ebit: 200000, totalDebt: 700000,
  });

  const update = (key: string, val: string) => setData(prev => ({ ...prev, [key]: parseFloat(val) || 0 }));

  const ratios = {
    currentRatio: data.currentAssets / data.currentLiabilities,
    acidTest: (data.currentAssets - data.inventory) / data.currentLiabilities,
    arTurnover: data.netCreditSales / data.accountsReceivable,
    invTurnover: data.cogs / data.avgInventory,
    avgCollectionPeriod: 365 / (data.netCreditSales / data.accountsReceivable),
    avgSalePeriod: 365 / (data.cogs / data.avgInventory),
    totalAssetTurnover: data.sales / data.totalAssets,
    eps: data.netIncome / data.sharesOutstanding,
    pe: data.marketPrice / (data.netIncome / data.sharesOutstanding),
    roa: (data.netIncome / data.totalAssets) * 100,
    roe: (data.netIncome / data.totalEquity) * 100,
    netProfitMargin: (data.netIncome / data.sales) * 100,
    debtToEquity: data.totalDebt / data.totalEquity,
    timesInterest: data.ebit / data.interestExpense,
    dividendPayout: (data.dividendsPerShare * data.sharesOutstanding) / data.netIncome * 100,
    dividendYield: (data.dividendsPerShare / data.marketPrice) * 100,
    bookValuePerShare: data.totalEquity / data.sharesOutstanding,
    dupontMargin: data.netIncome / data.sales,
    dupontTurnover: data.sales / data.totalAssets,
    dupontLeverage: data.totalAssets / data.totalEquity,
  };

  const operatingCycle = ratios.avgCollectionPeriod + ratios.avgSalePeriod;
  const dupontROE = ratios.dupontMargin * ratios.dupontTurnover * ratios.dupontLeverage * 100;

  const InputField = ({ label, field }: { label: string; field: string }) => (
    <div className="space-y-1">
      <Label className="text-xs">{label}</Label>
      <Input type="number" value={data[field as keyof typeof data]} onChange={e => update(field, e.target.value)} className="h-8 text-sm" />
    </div>
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Financial Ratios Calculator</CardTitle>
          <CardDescription>Enter financial data to compute all key ratios with DuPont decomposition</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="input">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="input">Input Data</TabsTrigger>
              <TabsTrigger value="ratios">Ratios</TabsTrigger>
              <TabsTrigger value="dupont">DuPont Analysis</TabsTrigger>
            </TabsList>

            <TabsContent value="input" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                <InputField label="Current Assets" field="currentAssets" />
                <InputField label="Current Liabilities" field="currentLiabilities" />
                <InputField label="Inventory" field="inventory" />
                <InputField label="Accounts Receivable" field="accountsReceivable" />
                <InputField label="Net Credit Sales" field="netCreditSales" />
                <InputField label="COGS" field="cogs" />
                <InputField label="Avg Inventory" field="avgInventory" />
                <InputField label="Total Assets" field="totalAssets" />
                <InputField label="Net Income" field="netIncome" />
                <InputField label="Sales (Revenue)" field="sales" />
                <InputField label="Total Equity" field="totalEquity" />
                <InputField label="Shares Outstanding" field="sharesOutstanding" />
                <InputField label="Market Price/Share" field="marketPrice" />
                <InputField label="Dividends/Share" field="dividendsPerShare" />
                <InputField label="EBIT" field="ebit" />
                <InputField label="Interest Expense" field="interestExpense" />
                <InputField label="Total Debt" field="totalDebt" />
              </div>
            </TabsContent>

            <TabsContent value="ratios" className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2"><CardTitle className="text-base">Liquidity</CardTitle></CardHeader>
                  <CardContent className="space-y-2">
                    <RatioDisplay label="Current Ratio" value={ratios.currentRatio} tip="Current Assets / Current Liabilities. Above 2.0 is strong." health={ratios.currentRatio > 2 ? 'good' : ratios.currentRatio > 1 ? 'warn' : 'bad'} />
                    <RatioDisplay label="Acid-Test (Quick)" value={ratios.acidTest} tip="(Current Assets - Inventory) / Current Liabilities. Above 1.0 is healthy." health={ratios.acidTest > 1 ? 'good' : ratios.acidTest > 0.5 ? 'warn' : 'bad'} />
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2"><CardTitle className="text-base">Activity</CardTitle></CardHeader>
                  <CardContent className="space-y-2">
                    <RatioDisplay label="AR Turnover" value={ratios.arTurnover} suffix="x" tip="Net Credit Sales / AR. Higher = faster collection." health={ratios.arTurnover > 10 ? 'good' : ratios.arTurnover > 5 ? 'warn' : 'bad'} />
                    <RatioDisplay label="Inventory Turnover" value={ratios.invTurnover} suffix="x" tip="COGS / Average Inventory. Higher = efficient." health={ratios.invTurnover > 6 ? 'good' : ratios.invTurnover > 3 ? 'warn' : 'bad'} />
                    <RatioDisplay label="Avg Collection Period" value={ratios.avgCollectionPeriod} suffix=" days" tip="365 / AR Turnover." health={ratios.avgCollectionPeriod < 45 ? 'good' : ratios.avgCollectionPeriod < 90 ? 'warn' : 'bad'} />
                    <RatioDisplay label="Operating Cycle" value={operatingCycle} suffix=" days" tip="Avg Collection Period + Avg Sale Period." health={operatingCycle < 120 ? 'good' : operatingCycle < 200 ? 'warn' : 'bad'} />
                    <RatioDisplay label="Total Asset Turnover" value={ratios.totalAssetTurnover} suffix="x" tip="Sales / Total Assets." health={null} />
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2"><CardTitle className="text-base">Profitability</CardTitle></CardHeader>
                  <CardContent className="space-y-2">
                    <RatioDisplay label="EPS" value={ratios.eps} suffix="" tip="Net Income / Shares Outstanding." health={null} />
                    <RatioDisplay label="P/E Ratio" value={ratios.pe} suffix="x" tip="Market Price / EPS. Lower may indicate value." health={ratios.pe < 15 ? 'good' : ratios.pe < 30 ? 'warn' : 'bad'} />
                    <RatioDisplay label="Net Profit Margin" value={ratios.netProfitMargin} suffix="%" tip="Net Income / Sales × 100." health={ratios.netProfitMargin > 15 ? 'good' : ratios.netProfitMargin > 5 ? 'warn' : 'bad'} />
                    <RatioDisplay label="ROA" value={ratios.roa} suffix="%" tip="Net Income / Total Assets × 100." health={ratios.roa > 10 ? 'good' : ratios.roa > 5 ? 'warn' : 'bad'} />
                    <RatioDisplay label="ROE" value={ratios.roe} suffix="%" tip="Net Income / Equity × 100." health={ratios.roe > 15 ? 'good' : ratios.roe > 8 ? 'warn' : 'bad'} />
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2"><CardTitle className="text-base">Leverage & Investor</CardTitle></CardHeader>
                  <CardContent className="space-y-2">
                    <RatioDisplay label="Debt-to-Equity" value={ratios.debtToEquity} suffix="x" tip="Total Debt / Equity. Lower = less risk." health={ratios.debtToEquity < 1 ? 'good' : ratios.debtToEquity < 2 ? 'warn' : 'bad'} />
                    <RatioDisplay label="Times Interest Earned" value={ratios.timesInterest} suffix="x" tip="EBIT / Interest Expense. Higher = safer." health={ratios.timesInterest > 5 ? 'good' : ratios.timesInterest > 2 ? 'warn' : 'bad'} />
                    <RatioDisplay label="Dividend Payout" value={ratios.dividendPayout} suffix="%" tip="Total Dividends / Net Income × 100." health={null} />
                    <RatioDisplay label="Dividend Yield" value={ratios.dividendYield} suffix="%" tip="Dividends Per Share / Market Price × 100." health={null} />
                    <RatioDisplay label="Book Value/Share" value={ratios.bookValuePerShare} suffix="" tip="Total Equity / Shares Outstanding." health={null} />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="dupont" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">DuPont Decomposition of ROE</CardTitle>
                  <CardDescription>ROE = Net Profit Margin × Asset Turnover × Equity Multiplier</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card className="border-primary/30">
                      <CardContent className="pt-4 text-center">
                        <p className="text-xs text-muted-foreground mb-1">Net Profit Margin</p>
                        <p className="text-2xl font-bold">{(ratios.dupontMargin * 100).toFixed(2)}%</p>
                        <p className="text-xs text-muted-foreground">NI / Sales</p>
                      </CardContent>
                    </Card>
                    <Card className="border-primary/30">
                      <CardContent className="pt-4 text-center">
                        <p className="text-xs text-muted-foreground mb-1">Asset Turnover</p>
                        <p className="text-2xl font-bold">{ratios.dupontTurnover.toFixed(2)}x</p>
                        <p className="text-xs text-muted-foreground">Sales / Total Assets</p>
                      </CardContent>
                    </Card>
                    <Card className="border-primary/30">
                      <CardContent className="pt-4 text-center">
                        <p className="text-xs text-muted-foreground mb-1">Equity Multiplier</p>
                        <p className="text-2xl font-bold">{ratios.dupontLeverage.toFixed(2)}x</p>
                        <p className="text-xs text-muted-foreground">Total Assets / Equity</p>
                      </CardContent>
                    </Card>
                    <Card className="border-accent/50 bg-accent/5">
                      <CardContent className="pt-4 text-center">
                        <p className="text-xs text-muted-foreground mb-1">= ROE</p>
                        <p className="text-2xl font-bold text-accent">{dupontROE.toFixed(2)}%</p>
                        <p className="text-xs text-muted-foreground">Margin × Turnover × Leverage</p>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
