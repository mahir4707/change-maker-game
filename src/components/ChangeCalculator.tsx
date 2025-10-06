import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { calculateChange, formatCurrency, DENOMINATIONS } from "@/utils/makeChange";
import { CoinAnimation } from "./CoinAnimation";
import { toast } from "sonner";
import { Coins, RotateCcw, Calculator } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import cashierImage from "@/assets/cashier.png";

export const ChangeCalculator = () => {
  const [itemPrice, setItemPrice] = useState<string>("");
  const [amountPaid, setAmountPaid] = useState<string>("");
  const [changeBreakdown, setChangeBreakdown] = useState<any[]>([]);
  const [isCalculated, setIsCalculated] = useState(false);
  const [totalTransactions, setTotalTransactions] = useState(0);

  const handleCalculate = () => {
    const price = parseFloat(itemPrice);
    const paid = parseFloat(amountPaid);

    if (isNaN(price) || isNaN(paid)) {
      toast.error("Please enter valid amounts");
      return;
    }

    if (paid < price) {
      toast.error("Amount paid must be greater than or equal to item price!");
      return;
    }

    const changeNeeded = paid - price;

    if (changeNeeded === 0) {
      toast.success("Exact amount! No change needed.");
      setChangeBreakdown([]);
      setIsCalculated(true);
      setTotalTransactions(prev => prev + 1);
      return;
    }

    const change = calculateChange(changeNeeded);
    
    if (change.length === 0) {
      toast.error("Cannot make exact change with available denominations!");
      return;
    }

    setChangeBreakdown(change);
    setIsCalculated(true);
    setTotalTransactions(prev => prev + 1);

    toast.success(`Change calculated: ${formatCurrency(changeNeeded)}`);
  };

  const handleReset = () => {
    setItemPrice("");
    setAmountPaid("");
    setChangeBreakdown([]);
    setIsCalculated(false);
  };

  const changeAmount = amountPaid && itemPrice
    ? parseFloat(amountPaid) - parseFloat(itemPrice)
    : 0;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-gradient-header text-primary-foreground py-6 px-6 shadow-lg">
        <div className="container mx-auto flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gold rounded-full flex items-center justify-center shadow-coin">
              <Coins className="w-7 h-7 text-foreground" />
            </div>
            <h1 className="text-3xl font-bold">💰 Change Maker Pro</h1>
          </div>
          <div className="flex items-center gap-6">
            <div className="bg-primary-foreground/20 backdrop-blur-sm px-5 py-2 rounded-full">
              <span className="font-semibold text-sm">Available: {DENOMINATIONS.map(d => d.label).join(', ')}</span>
            </div>
            <div className="bg-gold/90 text-foreground px-5 py-2 rounded-full">
              <span className="font-bold text-sm">Transactions: {totalTransactions}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8 lg:py-12">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center max-w-7xl mx-auto">
          
          {/* Left Side - Illustration */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center justify-center order-2 lg:order-1"
          >
            <div className="relative">
              <motion.div
                animate={isCalculated ? { scale: [1, 1.05, 1] } : {}}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <img
                  src={cashierImage}
                  alt="Friendly Cashier"
                  className="w-full max-w-md drop-shadow-2xl"
                />
              </motion.div>
              
              {isCalculated && changeAmount > 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute -top-4 -right-4 bg-gold text-foreground px-6 py-3 rounded-2xl shadow-result font-bold text-lg pulse-glow"
                >
                  ✨ Change Ready!
                </motion.div>
              )}
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-8 text-center"
            >
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Master the Change Making Algorithm
              </h2>
              <p className="text-muted-foreground max-w-md">
                Using Dynamic Programming to find the optimal coin combination
              </p>
            </motion.div>
          </motion.div>

          {/* Right Side - Calculator */}
          <div className="space-y-6 order-1 lg:order-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="p-8 bg-gradient-card shadow-card border-2 border-border">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-mint rounded-lg flex items-center justify-center">
                    <Calculator className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <h3 className="text-2xl font-bold text-card-foreground">Calculate Change</h3>
                </div>

                <div className="space-y-5">
                  <div>
                    <Label htmlFor="itemPrice" className="text-base font-semibold mb-2 block">
                      Item Price (₹)
                    </Label>
                    <Input
                      id="itemPrice"
                      type="number"
                      step="1"
                      min="0"
                      placeholder="Enter price"
                      value={itemPrice}
                      onChange={(e) => setItemPrice(e.target.value)}
                      className="text-lg h-12 border-2 focus:border-mint"
                    />
                  </div>

                  <div>
                    <Label htmlFor="amountPaid" className="text-base font-semibold mb-2 block">
                      Amount Paid (₹)
                    </Label>
                    <Input
                      id="amountPaid"
                      type="number"
                      step="1"
                      min="0"
                      placeholder="Enter amount"
                      value={amountPaid}
                      onChange={(e) => setAmountPaid(e.target.value)}
                      className="text-lg h-12 border-2 focus:border-mint"
                    />
                  </div>

                  {changeAmount > 0 && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-5 bg-gradient-result rounded-xl border-2 border-mint"
                    >
                      <p className="text-sm font-semibold text-muted-foreground mb-1">
                        Total Change Due:
                      </p>
                      <p className="text-4xl font-bold text-mint">
                        {formatCurrency(changeAmount)}
                      </p>
                    </motion.div>
                  )}

                  <div className="flex gap-3 pt-2">
                    <Button
                      onClick={handleCalculate}
                      className="flex-1 h-12 text-base font-semibold bg-mint hover:bg-mint/90"
                      size="lg"
                    >
                      <Calculator className="w-5 h-5 mr-2" />
                      Calculate
                    </Button>
                    <Button
                      onClick={handleReset}
                      variant="outline"
                      className="h-12 px-6 border-2 hover:bg-cream"
                      size="lg"
                    >
                      <RotateCcw className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Results Display */}
            <AnimatePresence>
              {isCalculated && changeBreakdown.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                >
                  <Card className="p-8 bg-gradient-result shadow-result border-2 border-mint">
                    <h3 className="text-xl font-bold mb-6 text-card-foreground flex items-center gap-2">
                      <Coins className="w-6 h-6 text-gold" />
                      Optimal Change Breakdown
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {changeBreakdown.map((item, index) => (
                        <CoinAnimation
                          key={`${item.denomination}-${index}`}
                          denomination={item.denomination}
                          label={DENOMINATIONS.find(d => d.value === item.denomination)?.label || ''}
                          count={item.count}
                          delay={index * 0.15}
                        />
                      ))}
                    </div>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-muted/50 py-6 px-6 text-center">
        <p className="text-muted-foreground text-sm font-medium">
          🧮 Powered by Dynamic Programming Algorithm | Denominations: {DENOMINATIONS.map(d => d.label).join(', ')}
        </p>
      </footer>
    </div>
  );
};
