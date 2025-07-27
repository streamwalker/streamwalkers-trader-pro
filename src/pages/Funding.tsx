import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DollarSign, CreditCard, TrendingUp, Clock, CheckCircle } from "lucide-react";

const Funding = () => {
  const fundingOptions = [
    {
      name: "Instant Funding",
      minAmount: 1000,
      maxAmount: 50000,
      fee: "2.5%",
      processingTime: "Instant",
      status: "Available"
    },
    {
      name: "Wire Transfer",
      minAmount: 5000,
      maxAmount: 500000,
      fee: "$25",
      processingTime: "1-2 business days",
      status: "Available"
    },
    {
      name: "ACH Transfer",
      minAmount: 100,
      maxAmount: 100000,
      fee: "Free",
      processingTime: "3-5 business days",
      status: "Available"
    }
  ];

  const recentTransactions = [
    { id: 1, type: "Deposit", method: "Wire Transfer", amount: 25000, status: "Completed", date: "2024-01-30" },
    { id: 2, type: "Withdrawal", method: "ACH", amount: 5000, status: "Processing", date: "2024-01-29" },
    { id: 3, type: "Deposit", method: "Instant", amount: 2500, status: "Completed", date: "2024-01-28" },
    { id: 4, type: "Withdrawal", method: "Wire", amount: 10000, status: "Completed", date: "2024-01-25" },
  ];

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Account Funding</h1>
          <p className="text-muted-foreground">
            Manage your trading account deposits and withdrawals.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <TrendingUp className="mr-2 h-4 w-4" />
            Withdrawal
          </Button>
          <Button>
            <DollarSign className="mr-2 h-4 w-4" />
            Add Funds
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Account Balance</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$127,450</div>
            <p className="text-xs text-muted-foreground">
              +$2,340 from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Funds</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$98,230</div>
            <p className="text-xs text-muted-foreground">
              Ready for trading
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$5,000</div>
            <p className="text-xs text-muted-foreground">
              1 withdrawal processing
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Deposits</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$27,500</div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Deposit</CardTitle>
            <CardDescription>Add funds to your trading account</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="amount">Amount ($)</Label>
              <Input
                type="number"
                id="amount"
                placeholder="Enter amount"
                className="text-lg"
              />
            </div>
            
            <div className="space-y-3">
              <Label>Funding Method</Label>
              {fundingOptions.map((option, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                  <div>
                    <div className="font-medium">{option.name}</div>
                    <div className="text-sm text-muted-foreground">
                      ${option.minAmount.toLocaleString()} - ${option.maxAmount.toLocaleString()} | Fee: {option.fee}
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="secondary">{option.processingTime}</Badge>
                  </div>
                </div>
              ))}
            </div>

            <Button className="w-full" size="lg">
              <DollarSign className="mr-2 h-4 w-4" />
              Process Deposit
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Your funding history and pending transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{transaction.type}</span>
                      <Badge variant="outline">{transaction.method}</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">{transaction.date}</div>
                  </div>
                  <div className="text-right">
                    <div className={`font-medium ${transaction.type === "Deposit" ? "text-green-500" : "text-red-500"}`}>
                      {transaction.type === "Deposit" ? "+" : "-"}${transaction.amount.toLocaleString()}
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      {transaction.status === "Completed" ? (
                        <CheckCircle className="h-3 w-3 text-green-500" />
                      ) : (
                        <Clock className="h-3 w-3 text-yellow-500" />
                      )}
                      <span className={transaction.status === "Completed" ? "text-green-500" : "text-yellow-500"}>
                        {transaction.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Funding;