import { useState } from 'react';
import { Search, Plus, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useWatchlistActions, useSymbolSearch } from '@/hooks/useWatchlist';
import { SUPPORTED_EXCHANGES } from '@/types/watchlist';

interface AddSymbolDialogProps {
  onSymbolAdded?: () => void;
}

export function AddSymbolDialog({ onSymbolAdded }: AddSymbolDialogProps) {
  const [open, setOpen] = useState(false);
  const [symbol, setSymbol] = useState('');
  const [exchange, setExchange] = useState('NASDAQ');
  const [position, setPosition] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  const { addSymbol } = useWatchlistActions();
  const { data: searchResults, isLoading } = useSymbolSearch(searchQuery);

  const handleAddSymbol = () => {
    if (!symbol.trim()) return;
    
    const success = addSymbol(
      symbol.toUpperCase(),
      exchange,
      position ? parseFloat(position) : undefined
    );
    
    if (success) {
      setSymbol('');
      setPosition('');
      setSearchQuery('');
      setOpen(false);
      onSymbolAdded?.();
    }
  };

  const handleSelectFromSearch = (selectedSymbol: string, selectedExchange: string, companyName: string) => {
    setSymbol(selectedSymbol);
    setExchange(selectedExchange);
    setSearchQuery('');
  };

  const resetForm = () => {
    setSymbol('');
    setPosition('');
    setSearchQuery('');
    setExchange('NASDAQ');
  };

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      setOpen(newOpen);
      if (!newOpen) resetForm();
    }}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          Add Symbol
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Stock Symbol</DialogTitle>
          <DialogDescription>
            Add a new stock symbol to your watchlist for live tracking.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Symbol Search */}
          <div className="space-y-2">
            <Label htmlFor="search">Search Symbols</Label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                placeholder="Search by symbol or company name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            {/* Search Results */}
            {searchQuery && (
              <div className="max-h-32 overflow-y-auto border rounded-md">
                {isLoading ? (
                  <div className="p-3 text-sm text-muted-foreground">Searching...</div>
                ) : searchResults?.length ? (
                  searchResults.map((result) => (
                    <button
                      key={`${result.symbol}-${result.exchange}`}
                      className="w-full text-left p-3 hover:bg-muted/50 border-b last:border-b-0 flex items-center justify-between"
                      onClick={() => handleSelectFromSearch(result.symbol, result.exchange, result.companyName)}
                    >
                      <div>
                        <div className="font-medium">{result.symbol}</div>
                        <div className="text-sm text-muted-foreground">{result.companyName}</div>
                      </div>
                      <Badge variant="outline">{result.exchange}</Badge>
                    </button>
                  ))
                ) : (
                  <div className="p-3 text-sm text-muted-foreground">No symbols found</div>
                )}
              </div>
            )}
          </div>

          {/* Manual Entry */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="symbol">Symbol</Label>
              <Input
                id="symbol"
                placeholder="e.g., AAPL"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                maxLength={5}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="exchange">Exchange</Label>
              <Select value={exchange} onValueChange={setExchange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SUPPORTED_EXCHANGES.map((ex) => (
                    <SelectItem key={ex.code} value={ex.code}>
                      {ex.name} ({ex.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="position">Position (Optional)</Label>
            <Input
              id="position"
              type="number"
              placeholder="Number of shares"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              min="0"
              step="0.01"
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddSymbol} disabled={!symbol.trim()}>
              Add Symbol
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}