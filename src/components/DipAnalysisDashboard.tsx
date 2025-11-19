import { useState } from 'react';
import { useDipAnalysis, DipAnalysisResult } from '@/hooks/useDipAnalysis';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RefreshCw, TrendingUp, TrendingDown, Minus, ChevronRight } from 'lucide-react';
import { DipAnalysisDetailDialog } from './DipAnalysisDetailDialog';
import { Skeleton } from '@/components/ui/skeleton';

export function DipAnalysisDashboard() {
  const { dipResults, isLoading, analyzeNow } = useDipAnalysis();
  const [selectedSymbol, setSelectedSymbol] = useState<DipAnalysisResult | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterRec, setFilterRec] = useState<string>('all');

  const filteredResults = dipResults?.filter(result => {
    if (filterType !== 'all' && result.dip_type !== filterType) return false;
    if (filterRec !== 'all' && result.recommendation !== filterRec) return false;
    return true;
  });

  const strongBuys = dipResults?.filter(r => r.dip_quality_score >= 8.0).length || 0;
  const buys = dipResults?.filter(r => r.dip_quality_score >= 6.0 && r.dip_quality_score < 8.0).length || 0;
  const waits = dipResults?.filter(r => r.dip_quality_score >= 4.0 && r.dip_quality_score < 6.0).length || 0;
  const avoids = dipResults?.filter(r => r.dip_quality_score < 4.0).length || 0;

  const getScoreColor = (score: number) => {
    if (score >= 8.0) return 'text-green-600 dark:text-green-400';
    if (score >= 6.0) return 'text-blue-600 dark:text-blue-400';
    if (score >= 4.0) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getRecommendationBadge = (rec: string) => {
    switch (rec) {
      case 'buy_dip':
        return <Badge className="bg-green-500/10 text-green-700 dark:text-green-400 hover:bg-green-500/20">BUY</Badge>;
      case 'wait':
        return <Badge className="bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 hover:bg-yellow-500/20">WAIT</Badge>;
      case 'sell_avoid':
        return <Badge className="bg-red-500/10 text-red-700 dark:text-red-400 hover:bg-red-500/20">AVOID</Badge>;
      default:
        return <Badge variant="outline">{rec}</Badge>;
    }
  };

  const getDipTypeIcon = (type: string) => {
    switch (type) {
      case 'type_a_buyable':
        return <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />;
      case 'type_b_trouble':
        return <TrendingDown className="h-4 w-4 text-red-600 dark:text-red-400" />;
      default:
        return <Minus className="h-4 w-4 text-muted-foreground" />;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dip Quality Analysis</h2>
          <p className="text-muted-foreground mt-1">
            AI-powered classification of buyable dips vs trouble dips
          </p>
        </div>
        <Button
          onClick={() => analyzeNow.mutate(undefined)}
          disabled={analyzeNow.isPending}
          size="sm"
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${analyzeNow.isPending ? 'animate-spin' : ''}`} />
          Refresh Analysis
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Strong Buy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">{strongBuys}</div>
            <p className="text-xs text-muted-foreground mt-1">Score 8.0+</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Buy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{buys}</div>
            <p className="text-xs text-muted-foreground mt-1">Score 6.0-7.9</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Wait
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">{waits}</div>
            <p className="text-xs text-muted-foreground mt-1">Score 4.0-5.9</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avoid
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600 dark:text-red-400">{avoids}</div>
            <p className="text-xs text-muted-foreground mt-1">Score &lt; 4.0</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Current Analysis</CardTitle>
              <CardDescription>Latest dip quality scores for your watchlist</CardDescription>
            </div>
            <div className="flex gap-2">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="type_a_buyable">Type A - Buyable</SelectItem>
                  <SelectItem value="type_b_trouble">Type B - Trouble</SelectItem>
                  <SelectItem value="neutral">Neutral</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterRec} onValueChange={setFilterRec}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by recommendation" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Recommendations</SelectItem>
                  <SelectItem value="buy_dip">Buy Dip</SelectItem>
                  <SelectItem value="wait">Wait</SelectItem>
                  <SelectItem value="sell_avoid">Avoid/Sell</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Symbol</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Recommendation</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">Change</TableHead>
                <TableHead className="text-right">Confidence</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredResults?.map((result) => (
                <TableRow
                  key={result.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => setSelectedSymbol(result)}
                >
                  <TableCell className="font-bold">{result.symbol}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className={`text-2xl font-bold ${getScoreColor(result.dip_quality_score)}`}>
                        {result.dip_quality_score.toFixed(1)}
                      </span>
                      <span className="text-xs text-muted-foreground">/10</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getDipTypeIcon(result.dip_type)}
                      <span className="text-sm capitalize">
                        {result.dip_type.replace('type_', '').replace('_', ' ')}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getRecommendationBadge(result.recommendation)}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    ${result.current_price.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right">
                    <span className={result.price_change_percent >= 0 ? 'text-green-600' : 'text-red-600'}>
                      {result.price_change_percent >= 0 ? '+' : ''}
                      {result.price_change_percent.toFixed(2)}%
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant="outline">{result.confidence_level}%</Badge>
                  </TableCell>
                  <TableCell>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <DipAnalysisDetailDialog
        result={selectedSymbol}
        open={!!selectedSymbol}
        onOpenChange={(open) => !open && setSelectedSymbol(null)}
      />
    </div>
  );
}
