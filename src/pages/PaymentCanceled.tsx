import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { XCircle, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const PaymentCanceled = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-md w-full shadow-card">
        <CardContent className="p-8 text-center space-y-6">
          <div className="mx-auto w-16 h-16 bg-loss/10 rounded-full flex items-center justify-center">
            <XCircle className="w-10 h-10 text-loss" />
          </div>
          <h1 className="text-2xl font-bold">Payment Canceled</h1>
          <p className="text-muted-foreground">
            No worries — your payment was not processed. You can try again anytime.
          </p>
          <Button variant="hero" size="lg" className="w-full group" asChild>
            <Link to="/#pricing">
              View Challenge Plans
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentCanceled;
