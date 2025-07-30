import { StockScreener } from '@/components/StockScreener';

export default function Screener() {
  return (
    <div className="container mx-auto py-6">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Stock Screener</h1>
          <p className="text-muted-foreground">
            Discover stocks that match your trading criteria with our advanced screening tools.
          </p>
        </div>
        
        <StockScreener />
      </div>
    </div>
  );
}