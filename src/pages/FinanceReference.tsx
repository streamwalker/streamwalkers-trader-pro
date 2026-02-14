import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, Search, ArrowLeft, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

interface FormulaEntry {
  term: string;
  formula: string;
  explanation: string;
  tryLink?: string;
}

interface Section {
  category: string;
  color: string;
  entries: FormulaEntry[];
}

const sections: Section[] = [
  {
    category: 'Accounting & Financial Ratios',
    color: 'bg-blue-500/10 text-blue-400',
    entries: [
      { term: 'Current Ratio', formula: 'Current Assets / Current Liabilities', explanation: 'Measures short-term liquidity — ability to pay obligations due within one year. Above 2.0 is generally strong.', tryLink: '/account/performance' },
      { term: 'Acid-Test (Quick) Ratio', formula: '(Current Assets - Inventory) / Current Liabilities', explanation: 'Stricter liquidity test excluding inventory. Above 1.0 indicates healthy short-term position.', tryLink: '/account/performance' },
      { term: 'Accounts Receivable Turnover', formula: 'Net Credit Sales / Accounts Receivable', explanation: 'How many times AR is collected during a period. Higher = faster collection.', tryLink: '/account/performance' },
      { term: 'Inventory Turnover', formula: 'COGS / Average Inventory', explanation: 'How quickly inventory is sold. Higher turnover = more efficient inventory management.', tryLink: '/account/performance' },
      { term: 'Operating Cycle', formula: 'Avg Collection Period + Avg Sale Period', explanation: 'Total days from purchasing inventory to collecting cash from sales.', tryLink: '/account/performance' },
      { term: 'EPS (Earnings Per Share)', formula: 'Net Income / Shares Outstanding', explanation: 'Profit allocated to each share. Key metric for comparing company profitability.', tryLink: '/account/performance' },
      { term: 'P/E Ratio', formula: 'Market Price Per Share / EPS', explanation: 'How much investors pay per dollar of earnings. Lower may indicate value; higher suggests growth expectations.', tryLink: '/account/performance' },
      { term: 'Return on Equity (ROE)', formula: '(NI/Sales) × (Sales/Total Assets) × (Total Assets/Equity)', explanation: 'DuPont decomposition: Margin × Turnover × Leverage. Measures how effectively equity generates profit.', tryLink: '/account/performance' },
      { term: 'Debt-to-Equity', formula: 'Total Debt / Total Equity', explanation: 'Financial leverage indicator. Below 1.0 means more equity than debt financing.', tryLink: '/account/performance' },
      { term: 'Times Interest Earned', formula: 'EBIT / Interest Expense', explanation: 'Ability to cover interest payments. Above 5x is comfortable; below 2x is risky.', tryLink: '/account/performance' },
    ],
  },
  {
    category: 'Economics — Supply & Demand',
    color: 'bg-green-500/10 text-green-400',
    entries: [
      { term: 'Equilibrium', formula: 'Price where Qd = Qs', explanation: 'The market-clearing price where quantity demanded equals quantity supplied. No surplus or shortage exists.', tryLink: '/analytics' },
      { term: 'Price Elasticity of Demand', formula: 'Ed = (%ΔQ / %ΔP) using midpoint method', explanation: 'Measures responsiveness of quantity demanded to price changes. |Ed| > 1 = elastic, |Ed| < 1 = inelastic.', tryLink: '/analytics' },
      { term: 'Midpoint Formula', formula: '(%ΔQ) = (Q₂-Q₁)/((Q₂+Q₁)/2) × 100', explanation: 'Uses averages as base to avoid direction bias. Preferred method for calculating elasticity.', tryLink: '/analytics' },
      { term: 'Consumer Surplus', formula: 'Value to Buyers - Amount Paid', explanation: 'The area between the demand curve and the equilibrium price. Represents buyer benefit.', tryLink: '/analytics' },
      { term: 'Producer Surplus', formula: 'Amount Received - Cost to Sellers', explanation: 'Area between equilibrium price and supply curve. Represents seller benefit.', tryLink: '/analytics' },
      { term: 'Demand Shifters', formula: 'Income, Preferences, Expectations, # Buyers, Related Goods', explanation: 'Factors that shift the entire demand curve left or right (not movement along the curve).', tryLink: '/analytics' },
      { term: 'Supply Shifters', formula: 'Resource Prices, Technology, Taxes, # Sellers, Expectations', explanation: 'Factors that shift the entire supply curve. Lower costs → rightward shift → more supply at every price.', tryLink: '/analytics' },
    ],
  },
  {
    category: 'Finance — Time Value of Money',
    color: 'bg-purple-500/10 text-purple-400',
    entries: [
      { term: 'Simple Interest', formula: 'A = P + Prt = P(1 + rt)', explanation: 'Interest calculated only on the original principal. Used for short-term lending.', tryLink: '/account/performance' },
      { term: 'Compound Interest', formula: 'A = P(1 + r/m)^(mt)', explanation: 'Interest on interest. More compounding periods (m) = higher effective return.', tryLink: '/account/performance' },
      { term: 'Continuous Compounding', formula: 'A = Pe^(rt)', explanation: 'Theoretical maximum compounding where m → ∞. Uses Euler\'s number e ≈ 2.71828.', tryLink: '/account/performance' },
      { term: 'APY (Annual Percentage Yield)', formula: 'APY = (1 + r/m)^m - 1', explanation: 'True annual return accounting for compounding. Allows fair comparison across different compounding frequencies.', tryLink: '/account/performance' },
      { term: 'Rule of 72', formula: 'Doubling Time ≈ 72 / Annual Rate', explanation: 'Quick mental math: at 8% interest, money doubles in ~9 years (72/8). Useful for estimation.', tryLink: '/account/performance' },
      { term: 'Future Value of Annuity', formula: 'FV = PMT × [(1+i)^n - 1] / i', explanation: 'Total value of a series of equal payments compounded over time. Used for retirement planning.', tryLink: '/account/performance' },
      { term: 'Present Value of Annuity', formula: 'PV = PMT × [1 - (1+i)^(-n)] / i', explanation: 'Today\'s value of a series of future payments. Used to price bonds and evaluate income streams.', tryLink: '/account/performance' },
      { term: 'NPV (Net Present Value)', formula: 'NPV = Σ[CF_t / (1+r)^t] - Initial Investment', explanation: 'Sum of discounted future cash flows minus cost. Positive NPV = value-creating investment. The #1 capital budgeting tool.', tryLink: '/account/performance' },
      { term: 'IRR (Internal Rate of Return)', formula: 'Rate where NPV = 0', explanation: 'The discount rate that makes NPV zero. Accept if IRR > required return. Found via iteration.', tryLink: '/account/performance' },
    ],
  },
  {
    category: 'Risk & Probability',
    color: 'bg-orange-500/10 text-orange-400',
    entries: [
      { term: 'Expected Value', formula: 'E(X) = Σ[x_i × P(x_i)]', explanation: 'Weighted average of all possible outcomes. Positive EV = profitable trade setup over many repetitions.', tryLink: '/analytics' },
      { term: 'Probability Distribution', formula: 'All P(x) ≥ 0 and ΣP(x) = 1', explanation: 'A valid distribution must have non-negative probabilities summing to exactly 1.', tryLink: '/analytics' },
      { term: 'Standard Deviation', formula: 'σ = √[Σ P(x)(x - μ)²]', explanation: 'Measures spread/volatility of outcomes around the expected value. Higher = more risk.', tryLink: '/analytics' },
      { term: 'Kelly Criterion', formula: 'f* = (bp - q) / b', explanation: 'Optimal fraction of bankroll to bet. b = win/loss ratio, p = win probability, q = 1-p. Maximizes long-run growth.', tryLink: '/account/performance' },
    ],
  },
  {
    category: 'Management Accounting',
    color: 'bg-red-500/10 text-red-400',
    entries: [
      { term: 'Contribution Margin', formula: 'CM = Selling Price - Variable Cost per Unit', explanation: 'Amount each unit contributes to covering fixed costs and profit. Foundation of break-even analysis.', tryLink: '/account/performance' },
      { term: 'CM Ratio', formula: 'CM Ratio = CM per Unit / Selling Price', explanation: 'Percentage of each sales dollar available for fixed costs and profit. Higher = more profitable per dollar.', tryLink: '/account/performance' },
      { term: 'Break-Even Point (Units)', formula: 'BEP = Fixed Expenses / CM per Unit', explanation: 'Number of units needed to cover all costs. Below this = loss, above = profit.', tryLink: '/account/performance' },
      { term: 'Target Income Units', formula: 'Units = (Fixed Expenses + Target Income) / CM per Unit', explanation: 'Units needed to achieve a specific profit target. Essential for sales planning.', tryLink: '/account/performance' },
      { term: 'ROI (Return on Investment)', formula: 'ROI = NOI / Average Operating Assets', explanation: 'Or Margin × Turnover (DuPont). Measures how well assets generate profit. Used to evaluate divisions.', tryLink: '/analytics' },
      { term: 'Residual Income', formula: 'RI = NOI - (AOA × Minimum Required Return)', explanation: 'Dollar amount of value created above the minimum return. Avoids ROI\'s bias against large profitable investments.', tryLink: '/analytics' },
      { term: 'Manufacturing Cycle Efficiency', formula: 'MCE = Process Time / Throughput Time', explanation: 'Ratio of value-added time to total time. Ideal = 1.0 (100%). Non-value time = inspection, move, queue, wait.', tryLink: '/analytics' },
    ],
  },
];

const FinanceReference = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [openSections, setOpenSections] = useState<string[]>([sections[0].category]);

  const toggleSection = (cat: string) => {
    setOpenSections(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]);
  };

  const filtered = sections.map(s => ({
    ...s,
    entries: s.entries.filter(e =>
      searchQuery === '' ||
      e.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.formula.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.explanation.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter(s => s.entries.length > 0);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Link to="/education"><Button variant="ghost" size="sm"><ArrowLeft className="h-4 w-4 mr-1" /> Education</Button></Link>
          </div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2"><BookOpen className="h-8 w-8 text-primary" /> Financial Concepts Reference</h1>
          <p className="text-muted-foreground">Searchable formula guide with explanations — from accounting ratios to economics to probability</p>
        </div>
        <Badge variant="outline" className="text-xs">{sections.reduce((s, sec) => s + sec.entries.length, 0)} formulas</Badge>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search formulas, terms, or concepts..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10" />
      </div>

      <div className="space-y-4">
        {filtered.map(section => (
          <Collapsible key={section.category} open={openSections.includes(section.category)} onOpenChange={() => toggleSection(section.category)}>
            <Card>
              <CollapsibleTrigger className="w-full">
                <CardHeader className="flex flex-row items-center justify-between cursor-pointer hover:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <Badge className={section.color}>{section.entries.length}</Badge>
                    <CardTitle className="text-lg">{section.category}</CardTitle>
                  </div>
                  <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform ${openSections.includes(section.category) ? 'rotate-180' : ''}`} />
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="space-y-3 pt-0">
                  {section.entries.map((entry, idx) => (
                    <div key={idx} className="p-4 border rounded-lg space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold">{entry.term}</h4>
                        {entry.tryLink && <Link to={entry.tryLink}><Badge variant="outline" className="text-xs cursor-pointer hover:bg-primary/10">Try it →</Badge></Link>}
                      </div>
                      <p className="text-sm font-mono bg-muted/50 px-3 py-1.5 rounded">{entry.formula}</p>
                      <p className="text-sm text-muted-foreground">{entry.explanation}</p>
                    </div>
                  ))}
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>
        ))}
      </div>
    </div>
  );
};

export default FinanceReference;
