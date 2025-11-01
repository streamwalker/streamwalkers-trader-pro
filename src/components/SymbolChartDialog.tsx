import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CandlestickChart } from "./CandlestickChart";

interface SymbolChartDialogProps {
  symbol: string;
  companyName?: string;
  isOpen: boolean;
  onClose: () => void;
}

export function SymbolChartDialog({ 
  symbol, 
  companyName, 
  isOpen, 
  onClose 
}: SymbolChartDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl h-[95vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <span className="font-mono text-2xl">{symbol}</span>
            {companyName && (
              <span className="text-lg text-muted-foreground font-normal">
                {companyName}
              </span>
            )}
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-auto">
          <CandlestickChart 
            symbol={symbol}
            supportLevels={[]}
            resistanceLevels={[]}
            mode="stock"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
