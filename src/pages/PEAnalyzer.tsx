import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  LineChart,
  Line
} from 'recharts';
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  Building2, 
  Target, 
  AlertTriangle,
  CheckCircle2,
  Calculator,
  ChartLine,
  Info
} from 'lucide-react';

interface CompanyMetrics {
  // Financial Metrics
  currentRevenue: number;
  revenueGrowth1Y: number;
  revenueGrowth3Y: number;
  ebitdaMargin: number;
  debtToEquity: number;
  cashFlow: number;
  
  // Market Metrics
  marketCap: number;
  marketShare: number;
  tamSize: number;
  competitorCount: number;
  
  // Operational Metrics
  employeeCount: number;
  employeeGrowth: number;
  techScore: number;
  processAutomation: number;
  managementDepth: number;
  
  // Risk Factors
  customerConcentration: number;
  regulatoryRisk: number;
  cyclicalSensitivity: number;
}

const PEAnalyzer = () => {
  const [metrics, setMetrics] = useState<CompanyMetrics>({
    currentRevenue: 0,
    revenueGrowth1Y: 0,
    revenueGrowth3Y: 0,
    ebitdaMargin: 0,
    debtToEquity: 0,
    cashFlow: 0,
    marketCap: 0,
    marketShare: 0,
    tamSize: 0,
    competitorCount: 0,
    employeeCount: 0,
    employeeGrowth: 0,
    techScore: 0,
    processAutomation: 0,
    managementDepth: 0,
    customerConcentration: 0,
    regulatoryRisk: 0,
    cyclicalSensitivity: 0
  });

  const scalabilityAnalysis = useMemo(() => {
    // Financial Scalability (40% weight)
    const financialScore = Math.min(100, (
      (Math.min(metrics.revenueGrowth1Y, 50) * 0.3) +
      (Math.min(metrics.revenueGrowth3Y, 30) * 0.3) +
      (Math.min(metrics.ebitdaMargin, 40) * 0.25) +
      (Math.max(0, 100 - metrics.debtToEquity * 10) * 0.15)
    ));

    // Market Scalability (30% weight)
    const marketPenetration = metrics.tamSize > 0 ? (metrics.currentRevenue / metrics.tamSize) * 100 : 0;
    const marketScore = Math.min(100, (
      (Math.min(100, 100 - marketPenetration) * 0.4) +
      (Math.min(metrics.marketShare * 5, 100) * 0.3) +
      (Math.max(0, 100 - metrics.competitorCount * 5) * 0.3)
    ));

    // Operational Scalability (20% weight)
    const operationalScore = Math.min(100, (
      (Math.min(metrics.techScore, 100) * 0.3) +
      (Math.min(metrics.processAutomation, 100) * 0.3) +
      (Math.min(metrics.managementDepth, 100) * 0.25) +
      (Math.min(metrics.employeeGrowth * 2, 100) * 0.15)
    ));

    // Risk Factors (10% weight - inverted)
    const riskScore = Math.min(100, 100 - (
      (metrics.customerConcentration * 0.4) +
      (metrics.regulatoryRisk * 0.3) +
      (metrics.cyclicalSensitivity * 0.3)
    ));

    const overallScore = (
      financialScore * 0.4 +
      marketScore * 0.3 +
      operationalScore * 0.2 +
      riskScore * 0.1
    );

    return {
      overallScore: Math.round(overallScore),
      financialScore: Math.round(financialScore),
      marketScore: Math.round(marketScore),
      operationalScore: Math.round(operationalScore),
      riskScore: Math.round(riskScore),
      marketPenetration
    };
  }, [metrics]);

  const expansionRequirements = useMemo(() => {
    const currentRevenue = metrics.currentRevenue;
    const targetRevenue = currentRevenue * 3; // 3x growth target
    
    const capitalRequired = (targetRevenue - currentRevenue) * 1.5; // 1.5x revenue as capital requirement
    const headcountIncrease = Math.ceil((targetRevenue / currentRevenue - 1) * metrics.employeeCount);
    const techInvestment = capitalRequired * 0.15; // 15% for technology
    const marketingSpend = capitalRequired * 0.2; // 20% for market expansion

    return {
      targetRevenue,
      capitalRequired,
      headcountIncrease,
      techInvestment,
      marketingSpend,
      timeline: Math.ceil(36 - (scalabilityAnalysis.overallScore * 0.24)) // 12-36 months based on score
    };
  }, [metrics, scalabilityAnalysis.overallScore]);

  const radarData = [
    { subject: 'Financial', score: scalabilityAnalysis.financialScore, fullMark: 100 },
    { subject: 'Market', score: scalabilityAnalysis.marketScore, fullMark: 100 },
    { subject: 'Operational', score: scalabilityAnalysis.operationalScore, fullMark: 100 },
    { subject: 'Risk Mgmt', score: scalabilityAnalysis.riskScore, fullMark: 100 }
  ];

  const handleInputChange = (field: keyof CompanyMetrics, value: string) => {
    setMetrics(prev => ({
      ...prev,
      [field]: parseFloat(value) || 0
    }));
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-profit';
    if (score >= 60) return 'text-warning';
    return 'text-destructive';
  };

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 80) return 'default';
    if (score >= 60) return 'secondary';
    return 'destructive';
  };

  // InfoTooltip component for reusable tooltips
  const InfoTooltip = ({ content }: { content: string }) => (
    <Tooltip delayDuration={300}>
      <TooltipTrigger asChild>
        <Info className="w-4 h-4 text-muted-foreground hover:text-foreground cursor-help" />
      </TooltipTrigger>
      <TooltipContent className="max-w-xs z-50" side="top">
        <p className="text-sm">{content}</p>
      </TooltipContent>
    </Tooltip>
  );

  return (
    <TooltipProvider>
      <div className="container mx-auto p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center">
            Private Equity Expansion Analyzer
            <InfoTooltip content="This tool analyzes a company's potential for growth and expansion from a private equity perspective. It evaluates financial health, market opportunity, operational efficiency, and risks to determine scalability and calculate expansion requirements." />
          </h1>
          <p className="text-muted-foreground">
            Evaluate company scalability potential and expansion requirements for private equity investment
          </p>
        </div>

      <Tabs defaultValue="input" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="input">Company Metrics</TabsTrigger>
          <TabsTrigger value="analysis">Scalability Analysis</TabsTrigger>
          <TabsTrigger value="requirements">Expansion Plan</TabsTrigger>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
        </TabsList>

        <TabsContent value="input" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Financial Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Financial Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center gap-1 mb-2">
                    <Label htmlFor="currentRevenue">Current Revenue ($M)</Label>
                    <InfoTooltip content="The company's total annual revenue in millions of dollars. This is the starting point for measuring growth potential. Higher revenue indicates a more established business, but growth rate matters more for PE investment." />
                  </div>
                  <Input
                    id="currentRevenue"
                    type="number"
                    value={metrics.currentRevenue}
                    onChange={(e) => handleInputChange('currentRevenue', e.target.value)}
                    placeholder="e.g., 50"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-1 mb-2">
                    <Label htmlFor="revenueGrowth1Y">Revenue Growth 1Y (%)</Label>
                    <InfoTooltip content="How much the company's revenue increased in the last year as a percentage. Shows recent momentum. PE firms love consistent growth above 20% annually. This indicates strong market demand and execution capability." />
                  </div>
                  <Input
                    id="revenueGrowth1Y"
                    type="number"
                    value={metrics.revenueGrowth1Y}
                    onChange={(e) => handleInputChange('revenueGrowth1Y', e.target.value)}
                    placeholder="e.g., 25"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-1 mb-2">
                    <Label htmlFor="revenueGrowth3Y">Revenue Growth 3Y (%)</Label>
                    <InfoTooltip content="Average annual revenue growth over the last 3 years. Shows sustained growth patterns rather than one-time spikes. Consistent 15%+ growth indicates a scalable business model that can weather market changes." />
                  </div>
                  <Input
                    id="revenueGrowth3Y"
                    type="number"
                    value={metrics.revenueGrowth3Y}
                    onChange={(e) => handleInputChange('revenueGrowth3Y', e.target.value)}
                    placeholder="e.g., 15"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-1 mb-2">
                    <Label htmlFor="ebitdaMargin">EBITDA Margin (%)</Label>
                    <InfoTooltip content="Earnings Before Interest, Taxes, Depreciation, and Amortization as a percentage of revenue. Measures operational profitability. Higher margins (20%+) show efficient operations and pricing power, which allows for reinvestment and debt servicing." />
                  </div>
                  <Input
                    id="ebitdaMargin"
                    type="number"
                    value={metrics.ebitdaMargin}
                    onChange={(e) => handleInputChange('ebitdaMargin', e.target.value)}
                    placeholder="e.g., 20"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-1 mb-2">
                    <Label htmlFor="debtToEquity">Debt to Equity Ratio</Label>
                    <InfoTooltip content="Total debt divided by total equity. Shows financial leverage. Lower ratios (under 1.0) indicate financial stability and capacity for PE firms to add strategic debt for growth without over-leveraging the business." />
                  </div>
                  <Input
                    id="debtToEquity"
                    type="number"
                    step="0.1"
                    value={metrics.debtToEquity}
                    onChange={(e) => handleInputChange('debtToEquity', e.target.value)}
                    placeholder="e.g., 0.5"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Market Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Market Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center gap-1 mb-2">
                    <Label htmlFor="marketCap">Market Cap ($M)</Label>
                    <InfoTooltip content="Total market value of the company (shares outstanding × share price). Indicates current market valuation. PE firms look for companies trading below their growth potential, offering room for value creation through operational improvements." />
                  </div>
                  <Input
                    id="marketCap"
                    type="number"
                    value={metrics.marketCap}
                    onChange={(e) => handleInputChange('marketCap', e.target.value)}
                    placeholder="e.g., 200"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-1 mb-2">
                    <Label htmlFor="tamSize">Total Addressable Market ($B)</Label>
                    <InfoTooltip content="The total revenue opportunity if the company captured 100% of its target market. Larger TAMs ($10B+) provide more room for growth. PE firms prefer markets big enough to support significant expansion without market saturation." />
                  </div>
                  <Input
                    id="tamSize"
                    type="number"
                    value={metrics.tamSize}
                    onChange={(e) => handleInputChange('tamSize', e.target.value)}
                    placeholder="e.g., 10"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-1 mb-2">
                    <Label htmlFor="marketShare">Market Share (%)</Label>
                    <InfoTooltip content="Company's revenue as a percentage of the total market. Shows competitive position. Companies with 5-15% market share often have the best expansion potential - large enough to have proven the model, small enough to grow significantly." />
                  </div>
                  <Input
                    id="marketShare"
                    type="number"
                    step="0.1"
                    value={metrics.marketShare}
                    onChange={(e) => handleInputChange('marketShare', e.target.value)}
                    placeholder="e.g., 5"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-1 mb-2">
                    <Label htmlFor="competitorCount">Number of Major Competitors</Label>
                    <InfoTooltip content="Count of significant competitors in the same market. Fewer competitors (under 10) often indicate less saturated markets with more growth opportunity. Too many competitors can limit pricing power and market share growth." />
                  </div>
                  <Input
                    id="competitorCount"
                    type="number"
                    value={metrics.competitorCount}
                    onChange={(e) => handleInputChange('competitorCount', e.target.value)}
                    placeholder="e.g., 8"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Operational Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  Operational Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center gap-1 mb-2">
                    <Label htmlFor="employeeCount">Employee Count</Label>
                    <InfoTooltip content="Total number of full-time employees. Helps assess operational scale and efficiency. Revenue per employee ratios indicate productivity levels. Companies with 50-500 employees often have the best balance of operational efficiency and growth potential." />
                  </div>
                  <Input
                    id="employeeCount"
                    type="number"
                    value={metrics.employeeCount}
                    onChange={(e) => handleInputChange('employeeCount', e.target.value)}
                    placeholder="e.g., 150"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-1 mb-2">
                    <Label htmlFor="employeeGrowth">Employee Growth (%/year)</Label>
                    <InfoTooltip content="Annual rate of employee count increase. Shows hiring pace and organizational scaling. Healthy growth of 20-30% indicates strong demand requiring more staff, but too rapid growth can indicate inefficiency or management challenges." />
                  </div>
                  <Input
                    id="employeeGrowth"
                    type="number"
                    value={metrics.employeeGrowth}
                    onChange={(e) => handleInputChange('employeeGrowth', e.target.value)}
                    placeholder="e.g., 20"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-1 mb-2">
                    <Label htmlFor="techScore">Technology Score (1-100)</Label>
                    <InfoTooltip content="Assessment of the company's technology infrastructure, digital capabilities, and innovation level. Higher scores (70+) indicate better scalability potential through automation, data analytics, and operational efficiency. Modern tech enables faster growth with fewer resources." />
                  </div>
                  <Input
                    id="techScore"
                    type="number"
                    min="1"
                    max="100"
                    value={metrics.techScore}
                    onChange={(e) => handleInputChange('techScore', e.target.value)}
                    placeholder="e.g., 75"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-1 mb-2">
                    <Label htmlFor="processAutomation">Process Automation (1-100)</Label>
                    <InfoTooltip content="Degree to which business processes are automated rather than manual. Higher automation (60+) means the company can scale revenue without proportionally scaling headcount. This improves margins and reduces operational risk during rapid growth." />
                  </div>
                  <Input
                    id="processAutomation"
                    type="number"
                    min="1"
                    max="100"
                    value={metrics.processAutomation}
                    onChange={(e) => handleInputChange('processAutomation', e.target.value)}
                    placeholder="e.g., 60"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-1 mb-2">
                    <Label htmlFor="managementDepth">Management Depth (1-100)</Label>
                    <InfoTooltip content="Quality and depth of the management team beyond the founder/CEO. Strong management (70+) with specialized expertise in key functions reduces founder dependency and enables scalable decision-making as the company grows rapidly." />
                  </div>
                  <Input
                    id="managementDepth"
                    type="number"
                    min="1"
                    max="100"
                    value={metrics.managementDepth}
                    onChange={(e) => handleInputChange('managementDepth', e.target.value)}
                    placeholder="e.g., 80"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Risk Factors */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Risk Factors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <div className="flex items-center gap-1 mb-2">
                    <Label htmlFor="customerConcentration">Customer Concentration Risk (1-100)</Label>
                    <InfoTooltip content="Risk level from depending too heavily on a few major customers. High scores (50+) mean losing one big customer could severely hurt revenue. Lower scores indicate a diversified customer base, reducing business risk and making growth more predictable." />
                  </div>
                  <Input
                    id="customerConcentration"
                    type="number"
                    min="1"
                    max="100"
                    value={metrics.customerConcentration}
                    onChange={(e) => handleInputChange('customerConcentration', e.target.value)}
                    placeholder="e.g., 30"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-1 mb-2">
                    <Label htmlFor="regulatoryRisk">Regulatory Risk (1-100)</Label>
                    <InfoTooltip content="Exposure to government regulation changes that could impact the business model. High scores (50+) indicate heavy regulation like finance or healthcare. Lower scores suggest more stable regulatory environments allowing predictable growth planning." />
                  </div>
                  <Input
                    id="regulatoryRisk"
                    type="number"
                    min="1"
                    max="100"
                    value={metrics.regulatoryRisk}
                    onChange={(e) => handleInputChange('regulatoryRisk', e.target.value)}
                    placeholder="e.g., 25"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-1 mb-2">
                    <Label htmlFor="cyclicalSensitivity">Cyclical Sensitivity (1-100)</Label>
                    <InfoTooltip content="How much the business performance varies with economic cycles. High scores (50+) mean revenue drops significantly in recessions. Lower scores indicate recession-resistant businesses with more predictable cash flows throughout economic cycles." />
                  </div>
                  <Input
                    id="cyclicalSensitivity"
                    type="number"
                    min="1"
                    max="100"
                    value={metrics.cyclicalSensitivity}
                    onChange={(e) => handleInputChange('cyclicalSensitivity', e.target.value)}
                    placeholder="e.g., 40"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  Scalability Score
                  <InfoTooltip content="Overall assessment of how easily this company can grow. Combines financial strength (40%), market opportunity (30%), operational efficiency (20%), and risk factors (10%). Scores above 80 indicate highly scalable businesses perfect for PE investment." />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-4">
                  <div className={`text-6xl font-bold ${getScoreColor(scalabilityAnalysis.overallScore)}`}>
                    {scalabilityAnalysis.overallScore}
                  </div>
                  <Badge variant={getScoreBadgeVariant(scalabilityAnalysis.overallScore)} className="text-lg px-4 py-2">
                    {scalabilityAnalysis.overallScore >= 80 ? 'Highly Scalable' :
                     scalabilityAnalysis.overallScore >= 60 ? 'Moderately Scalable' : 'Limited Scalability'}
                  </Badge>
                  <Progress value={scalabilityAnalysis.overallScore} className="w-full" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  Score Breakdown
                  <InfoTooltip content="Individual component scores that make up the overall scalability rating. Each area is weighted differently: Financial health matters most (40%), followed by market opportunity (30%), operational capabilities (20%), and risk management (10%)." />
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="flex items-center">
                    Financial (40%)
                    <InfoTooltip content="Measures financial health through revenue growth, profitability margins, and debt levels. This has the highest weight because strong financials provide the foundation for all other growth initiatives." />
                  </span>
                  <div className="flex items-center gap-2">
                    <Progress value={scalabilityAnalysis.financialScore} className="w-20" />
                    <span className={`font-semibold ${getScoreColor(scalabilityAnalysis.financialScore)}`}>
                      {scalabilityAnalysis.financialScore}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center">
                    Market (30%)
                    <InfoTooltip content="Evaluates market opportunity through total addressable market size, current penetration, and competitive landscape. Large untapped markets with manageable competition offer the best growth potential." />
                  </span>
                  <div className="flex items-center gap-2">
                    <Progress value={scalabilityAnalysis.marketScore} className="w-20" />
                    <span className={`font-semibold ${getScoreColor(scalabilityAnalysis.marketScore)}`}>
                      {scalabilityAnalysis.marketScore}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center">
                    Operational (20%)
                    <InfoTooltip content="Assesses operational efficiency through technology adoption, process automation, and management capabilities. Strong operations enable profitable scaling by doing more with fewer resources." />
                  </span>
                  <div className="flex items-center gap-2">
                    <Progress value={scalabilityAnalysis.operationalScore} className="w-20" />
                    <span className={`font-semibold ${getScoreColor(scalabilityAnalysis.operationalScore)}`}>
                      {scalabilityAnalysis.operationalScore}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center">
                    Risk Management (10%)
                    <InfoTooltip content="Evaluates risk factors including customer concentration, regulatory exposure, and economic sensitivity. Lower risk scores indicate more stable, predictable business performance." />
                  </span>
                  <div className="flex items-center gap-2">
                    <Progress value={scalabilityAnalysis.riskScore} className="w-20" />
                    <span className={`font-semibold ${getScoreColor(scalabilityAnalysis.riskScore)}`}>
                      {scalabilityAnalysis.riskScore}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  Scalability Radar Analysis
                  <InfoTooltip content="Visual representation of the company's strengths and weaknesses across key scalability dimensions. The larger the area, the more scalable the business. Look for balanced scores across all areas." />
                </CardTitle>
              </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" />
                  <PolarRadiusAxis domain={[0, 100]} />
                  <Radar
                    name="Scalability"
                    dataKey="score"
                    stroke="hsl(var(--primary))"
                    fill="hsl(var(--primary))"
                    fillOpacity={0.3}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="requirements" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="w-5 h-5" />
                  Capital Requirements
                  <InfoTooltip content="Estimated funding needed to achieve 3x revenue growth. Calculations include technology upgrades, marketing expansion, and operational scaling. Based on industry benchmarks and the company's current efficiency ratios." />
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Current Revenue:</span>
                  <span className="font-semibold">${metrics.currentRevenue}M</span>
                </div>
                <div className="flex justify-between">
                  <span>Target Revenue (3x):</span>
                  <span className="font-semibold">${expansionRequirements.targetRevenue}M</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg">
                  <span>Total Capital Required:</span>
                  <span className="font-bold text-primary">${expansionRequirements.capitalRequired.toFixed(1)}M</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>• Technology Investment:</span>
                    <span>${expansionRequirements.techInvestment.toFixed(1)}M</span>
                  </div>
                  <div className="flex justify-between">
                    <span>• Marketing & Sales:</span>
                    <span>${expansionRequirements.marketingSpend.toFixed(1)}M</span>
                  </div>
                  <div className="flex justify-between">
                    <span>• Operations & Other:</span>
                    <span>${(expansionRequirements.capitalRequired - expansionRequirements.techInvestment - expansionRequirements.marketingSpend).toFixed(1)}M</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Human Resources
                  <InfoTooltip content="Staffing requirements to support expansion goals. Timeline estimates are based on the company's scalability score - higher scores enable faster, more efficient growth with fewer resource constraints." />
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Current Headcount:</span>
                  <span className="font-semibold">{metrics.employeeCount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Additional Hires Needed:</span>
                  <span className="font-semibold">{expansionRequirements.headcountIncrease}</span>
                </div>
                <div className="flex justify-between">
                  <span>Target Headcount:</span>
                  <span className="font-semibold">{metrics.employeeCount + expansionRequirements.headcountIncrease}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg">
                  <span>Estimated Timeline:</span>
                  <span className="font-bold text-primary">{expansionRequirements.timeline} months</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  Expansion Roadmap
                  <InfoTooltip content="Phased approach to scaling the business based on the scalability analysis. Each phase builds upon the previous one, with timeline adjusted based on the company's readiness score. Higher scores enable more aggressive timelines." />
                </CardTitle>
              </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {scalabilityAnalysis.overallScore >= 80 && (
                  <Alert>
                    <CheckCircle2 className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Ready for Expansion:</strong> High scalability score indicates this company is well-positioned for rapid growth with proper capital injection.
                    </AlertDescription>
                  </Alert>
                )}
                
                {scalabilityAnalysis.overallScore >= 60 && scalabilityAnalysis.overallScore < 80 && (
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Moderate Risk:</strong> Company shows promise but requires operational improvements before major expansion.
                    </AlertDescription>
                  </Alert>
                )}
                
                {scalabilityAnalysis.overallScore < 60 && (
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>High Risk:</strong> Significant structural changes needed before considering major expansion. Focus on improving core metrics first.
                    </AlertDescription>
                  </Alert>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">Phase 1 (Months 1-{Math.ceil(expansionRequirements.timeline/3)})</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Secure funding</li>
                      <li>• Key leadership hires</li>
                      <li>• Technology infrastructure</li>
                    </ul>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">Phase 2 (Months {Math.ceil(expansionRequirements.timeline/3)+1}-{Math.ceil(expansionRequirements.timeline*2/3)})</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Market expansion</li>
                      <li>• Sales team scaling</li>
                      <li>• Process optimization</li>
                    </ul>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">Phase 3 (Months {Math.ceil(expansionRequirements.timeline*2/3)+1}-{expansionRequirements.timeline})</h4>
                    <ul className="text-sm space-y-1">
                      <li>• International expansion</li>
                      <li>• Product development</li>
                      <li>• Exit preparation</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  Financial Metrics Overview
                  <InfoTooltip content="Key financial performance indicators that drive scalability assessment. Strong growth rates and healthy margins indicate a business model that can support rapid expansion with proper capital allocation." />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={[
                    { name: 'Revenue Growth 1Y', value: metrics.revenueGrowth1Y },
                    { name: 'Revenue Growth 3Y', value: metrics.revenueGrowth3Y },
                    { name: 'EBITDA Margin', value: metrics.ebitdaMargin },
                    { name: 'Market Share', value: metrics.marketShare }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="hsl(var(--primary))" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  Market Opportunity
                  <InfoTooltip content="Analysis of remaining market potential and competitive environment. Low market penetration in large markets with manageable competition represents the ideal expansion opportunity for PE investment." />
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {scalabilityAnalysis.marketPenetration.toFixed(2)}%
                  </div>
                  <div className="text-muted-foreground">Market Penetration</div>
                  <Progress value={scalabilityAnalysis.marketPenetration} className="mt-2" />
                </div>
                <Separator />
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>TAM Size:</span>
                    <span className="font-semibold">${metrics.tamSize}B</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Addressable Market:</span>
                    <span className="font-semibold">${(metrics.tamSize * 1000 * (100 - scalabilityAnalysis.marketPenetration) / 100).toFixed(0)}M</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Competition Level:</span>
                    <Badge variant={metrics.competitorCount > 15 ? "destructive" : metrics.competitorCount > 8 ? "secondary" : "default"}>
                      {metrics.competitorCount > 15 ? "High" : metrics.competitorCount > 8 ? "Medium" : "Low"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  Investment Summary
                  <InfoTooltip content="Key investment metrics at a glance. These numbers represent the core investment thesis: required capital, expected timeline, resource needs, and overall scalability assessment for decision-making." />
                </CardTitle>
              </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-primary">${expansionRequirements.capitalRequired.toFixed(1)}M</div>
                  <div className="text-sm text-muted-foreground">Capital Required</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-profit">{expansionRequirements.timeline}mo</div>
                  <div className="text-sm text-muted-foreground">Timeline</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-warning">{expansionRequirements.headcountIncrease}</div>
                  <div className="text-sm text-muted-foreground">New Hires</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className={`text-2xl font-bold ${getScoreColor(scalabilityAnalysis.overallScore)}`}>
                    {scalabilityAnalysis.overallScore}
                  </div>
                  <div className="text-sm text-muted-foreground">Scalability Score</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      </div>
    </TooltipProvider>
  );
};

export default PEAnalyzer;