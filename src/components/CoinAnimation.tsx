import { motion } from "framer-motion";
import { Coins } from "lucide-react";

interface CoinAnimationProps {
  denomination: number;
  label: string;
  count: number;
  delay: number;
}

export const CoinAnimation = ({ denomination, label, count, delay }: CoinAnimationProps) => {
  const getCoinColor = () => {
    switch (denomination) {
      case 10:
        return "bg-gradient-coin border-gold";
      case 5:
        return "bg-gold-light border-gold";
      case 2:
        return "bg-cream border-muted-foreground";
      case 1:
        return "bg-mint-light border-mint";
      default:
        return "bg-gradient-coin border-gold";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -100, rotate: 0 }}
      animate={{ opacity: 1, y: 0, rotate: 360 }}
      transition={{
        delay: delay,
        duration: 0.8,
        type: "spring",
        stiffness: 200,
        damping: 15,
      }}
      className="flex flex-col items-center gap-3 p-4 bg-card rounded-2xl shadow-card"
    >
      <div className="relative">
        {/* Coin Stack */}
        <div className="relative">
          {Array.from({ length: Math.min(count, 3) }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: delay + i * 0.1, type: "spring" }}
              className={`
                w-20 h-20 rounded-full flex items-center justify-center
                border-4 font-bold text-lg
                ${getCoinColor()}
                ${i > 0 ? 'absolute top-0 left-0' : 'relative'}
                shadow-coin
              `}
              style={{
                transform: `translateY(${-i * 4}px) translateX(${i * 2}px)`,
                zIndex: 3 - i,
              }}
            >
              <div className="flex flex-col items-center">
                <Coins className="w-6 h-6 mb-1" />
                <span className="text-sm font-bold">{label}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Count Badge */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: delay + 0.3, type: "spring" }}
        className="bg-mint text-primary-foreground px-4 py-1.5 rounded-full font-bold shadow-sm"
      >
        × {count}
      </motion.div>
    </motion.div>
  );
};
