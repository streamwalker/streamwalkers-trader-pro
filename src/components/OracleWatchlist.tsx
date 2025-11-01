import { useState } from "react";
import { useOracleWatchlist } from "@/hooks/useWatchlist";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AddSymbolDialog } from "./AddSymbolDialog";
import { 
  TrendingUp, 
  TrendingDown, 
  Plus, 
  X, 
  AlertCircle,
  Loader2 
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface OracleWatchlistProps {
  predictions?: any[];
}

export function OracleWatchlist({ predictions }: OracleWatchlistProps) {
  const { 
    enhancedWatchlistData, 
    isLoading, 
    predictionSymbols,
    removeSymbol 
  } = useOracleWatchlist(predictions);

  const [showAddDialog, setShowAddDialog] = useState(false);

  if (isLoading) {
    return (
      <Card className="p-8">
        <div className="flex items-center justify-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
          <span className="text-muted-foreground">Loading watchlist data...</span>
        </div>
      </Card>
    );
  }

  if (!enhancedWatchlistData || enhancedWatchlistData.length === 0) {
    return (
      <Card className="p-8">
        <div className="text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto" />
          <div>
            <h3 className="font-semibold text-lg mb-2">No Symbols in Watchlist</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Add symbols manually or run predictions to auto-populate
            </p>
            <Button onClick={() => setShowAddDialog(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Symbol
            </Button>
          </div>
        </div>
        <AddSymbolDialog 
          open={showAddDialog}
          onOpenChange={setShowAddDialog}
        />
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold mb-1">Oracle Watchlist</h2>
            <p className="text-sm text-muted-foreground">
              Live market data for AI-predicted symbols • Updates every 30s
            </p>
          </div>
          <div className="flex items-center gap-3">
            {predictionSymbols > 0 && (
              <Badge variant="outline" className="gap-1">
                <TrendingUp className="w-3 h-3" />
                {predictionSymbols} from predictions
              </Badge>
            )}
            <Button onClick={() => setShowAddDialog(true)} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Symbol
            </Button>
          </div>
        </div>
      </Card>

      {/* Watchlist Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50 border-b">
              <tr className="text-xs font-semibold">
                <th className="text-left p-3 min-w-[100px]">Symbol</th>
                <th className="text-center p-3 min-w-[80px]">Action</th>
                <th className="text-right p-3 min-w-[100px]">Last</th>
                <th className="text-right p-3 min-w-[90px]">Change</th>
                <th className="text-right p-3 min-w-[90px]">% Change</th>
                <th className="text-right p-3 min-w-[110px]">Volume</th>
                <th className="text-right p-3 min-w-[120px]">Bid/Ask</th>
                <th className="text-right p-3 min-w-[120px]">Entry → Target</th>
                <th className="text-center p-3 min-w-[100px]">Confidence</th>
                <th className="text-center p-3 min-w-[60px]"></th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {enhancedWatchlistData.map((item, index) => {
                // Add null checks for all numeric values
                const price = item.price ?? 0;
                const change = item.change ?? 0;
                const changePercent = item.changePercent ?? 0;
                const volume = item.volume ?? 0;
                
                const isPositive = changePercent >= 0;
                const bid = price * 0.9998;
                const ask = price * 1.0002;
                
                return (
                  <tr 
                    key={`${item.symbol}-${item.exchange}-${index}`}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    {/* Symbol */}
                    <td className="p-3">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="cursor-help">
                              <div className="font-mono font-bold text-sm">
                                {item.symbol}
                              </div>
                              {item.sector && (
                                <div className="text-xs text-muted-foreground">
                                  {item.sector}
                                </div>
                              )}
                            </div>
                          </TooltipTrigger>
                          <TooltipContent side="right" className="max-w-xs">
                            <div className="space-y-1">
                              <div className="font-semibold">{item.name}</div>
                              {item.reasoning && (
                                <div className="text-xs text-muted-foreground">
                                  {item.reasoning}
                                </div>
                              )}
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </td>

                    {/* Action */}
                    <td className="p-3 text-center">
                      {item.action ? (
                        <Badge 
                          variant={
                            item.action === 'BUY' || item.action === 'LONG' 
                              ? 'default' 
                              : 'destructive'
                          }
                          className="font-mono text-xs"
                        >
                          {item.action}
                        </Badge>
                      ) : (
                        <span className="text-xs text-muted-foreground">-</span>
                      )}
                    </td>

                    {/* Last Price */}
                    <td className="p-3 text-right font-mono font-semibold">
                      ${price.toFixed(2)}
                    </td>

                    {/* Change */}
                    <td className={cn(
                      "p-3 text-right font-mono text-sm",
                      isPositive ? "text-green-600" : "text-red-600"
                    )}>
                      {isPositive ? '+' : ''}${change.toFixed(2)}
                    </td>

                    {/* % Change */}
                    <td className={cn(
                      "p-3 text-right font-mono font-semibold",
                      isPositive ? "text-green-600" : "text-red-600"
                    )}>
                      <div className="flex items-center justify-end gap-1">
                        {isPositive ? (
                          <TrendingUp className="w-3 h-3" />
                        ) : (
                          <TrendingDown className="w-3 h-3" />
                        )}
                        {isPositive ? '+' : ''}{changePercent.toFixed(2)}%
                      </div>
                    </td>

                    {/* Volume */}
                    <td className="p-3 text-right font-mono text-sm text-muted-foreground">
                      {(volume / 1000000).toFixed(2)}M
                    </td>

                    {/* Bid/Ask */}
                    <td className="p-3 text-right font-mono text-xs">
                      <div className="text-muted-foreground">
                        {bid.toFixed(2)} / {ask.toFixed(2)}
                      </div>
                    </td>

                    {/* Entry → Target */}
                    <td className="p-3 text-right">
                      {item.entry && item.target ? (
                        <div className="font-mono text-xs">
                          <div className="text-muted-foreground">{item.entry}</div>
                          <div className="text-green-600">→ {item.target}</div>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">-</span>
                      )}
                    </td>

                    {/* Confidence */}
                    <td className="p-3 text-center">
                      {item.confidence !== undefined ? (
                        <Badge variant="outline" className="text-xs">
                          {Math.round(item.confidence * 100)}%
                        </Badge>
                      ) : (
                        <span className="text-xs text-muted-foreground">-</span>
                      )}
                    </td>

                    {/* Remove */}
                    <td className="p-3 text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSymbol(item.symbol, item.exchange)}
                        className="h-7 w-7 p-0 hover:bg-destructive/10 hover:text-destructive"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <AddSymbolDialog 
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
      />
    </div>
  );
}
