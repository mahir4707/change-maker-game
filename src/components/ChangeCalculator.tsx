import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { calculateChange, formatCurrency, type CoinCount } from "@/utils/makeChange";
import { CurrencyItem } from "./CurrencyItem";
import { Customer } from "./Customer";
import { toast } from "sonner";
import { Coins } from "lucide-react";

export const ChangeCalculator = () => {
  const [itemPrice, setItemPrice] = useState<string>("");
  const [amountPaid, setAmountPaid] = useState<string>("");
  const [changeBreakdown, setChangeBreakdown] = useState<CoinCount[]>([]);
  const [isCalculated, setIsCalculated] = useState(false);
  const [score, setScore] = useState(0);

  const handleCalculate = () => {
    const price = parseFloat(itemPrice) * 100; // Convert to cents
    const paid = parseFloat(amountPaid) * 100;

    if (isNaN(price) || isNaN(paid)) {
      toast.error("Please enter valid amounts");
      return;
    }

    if (paid < price) {
      toast.error("Amount paid must be greater than item price!");
      return;
    }

    const changeNeeded = Math.round(paid - price);
    
    if (changeNeeded === 0) {
      toast.success("Exact amount! No change needed.");
      setChangeBreakdown([]);
      setIsCalculated(true);
      return;
    }

    const change = calculateChange(changeNeeded);
    setChangeBreakdown(change);
    setIsCalculated(true);
    setScore(prev => prev + 1);
    
    toast.success(`Change calculated: ${formatCurrency(changeNeeded)}`);
  };

  const handleReset = () => {
    setItemPrice("");
    setAmountPaid("");
    setChangeBreakdown([]);
    setIsCalculated(false);
  };

  const changeAmount = amountPaid && itemPrice 
    ? Math.round((parseFloat(amountPaid) - parseFloat(itemPrice)) * 100)
    : 0;

  const customerMessage = !isCalculated 
    ? "Can I get my change, please?"
    : changeAmount === 0
    ? "Thank you! Perfect amount!"
    : "Thank you for the exact change!";

  return (
    <div className="min-h-screen bg-gradient-shop flex flex-col">
      {/* Header */}
      <header className="bg-primary text-primary-foreground py-4 px-6 shadow-lg">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Coins className="w-8 h-8" />
            <h1 className="text-2xl font-bold">Change Maker Pro</h1>
          </div>
          <div className="bg-primary-foreground/20 px-4 py-2 rounded-full">
            <span className="font-semibold">Transactions: {score}</span>
          </div>
        </div>
      </header>

      {/* Main Game Area */}
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8 items-start max-w-6xl mx-auto">
          {/* Customer Side */}
          <div className="flex flex-col items-center justify-center">
            <Customer isHappy={isCalculated} message={customerMessage} />
          </div>

          {/* Counter/Calculator Side */}
          <div className="space-y-6">
            <Card className="p-6 bg-card shadow-counter">
              <h2 className="text-xl font-bold mb-6 text-card-foreground">Enter Transaction Details</h2>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="itemPrice">Item Price ($)</Label>
                  <Input
                    id="itemPrice"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={itemPrice}
                    onChange={(e) => setItemPrice(e.target.value)}
                    className="text-lg"
                  />
                </div>

                <div>
                  <Label htmlFor="amountPaid">Amount Paid ($)</Label>
                  <Input
                    id="amountPaid"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={amountPaid}
                    onChange={(e) => setAmountPaid(e.target.value)}
                    className="text-lg"
                  />
                </div>

                {changeAmount > 0 && (
                  <div className="p-4 bg-accent/20 rounded-lg border-2 border-accent">
                    <p className="text-sm font-medium text-muted-foreground">Change Due:</p>
                    <p className="text-3xl font-bold text-accent-foreground">
                      {formatCurrency(changeAmount)}
                    </p>
                  </div>
                )}

                <div className="flex gap-3 pt-2">
                  <Button 
                    onClick={handleCalculate} 
                    className="flex-1"
                    size="lg"
                  >
                    Calculate Change
                  </Button>
                  <Button 
                    onClick={handleReset} 
                    variant="outline"
                    size="lg"
                  >
                    Reset
                  </Button>
                </div>
              </div>
            </Card>

            {/* Change Display */}
            {isCalculated && changeBreakdown.length > 0 && (
              <Card className="p-6 bg-card shadow-counter">
                <h3 className="text-lg font-bold mb-4 text-card-foreground">
                  Optimal Change Breakdown
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {changeBreakdown.map((item, index) => (
                    <CurrencyItem
                      key={`${item.denomination}-${index}`}
                      denomination={item.denomination}
                      count={item.count}
                      type={item.type}
                      index={index}
                      isAnimating={true}
                    />
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-muted py-4 px-6 text-center text-muted-foreground text-sm">
        <p>Using Dynamic Programming to find the optimal coin change solution</p>
      </footer>
    </div>
  );
};
