import { motion } from "framer-motion";
import { getDenominationLabel } from "@/utils/makeChange";

interface CurrencyItemProps {
  denomination: number;
  count: number;
  type: 'coin' | 'bill';
  index: number;
  isAnimating?: boolean;
}

export const CurrencyItem = ({ denomination, count, type, index, isAnimating = false }: CurrencyItemProps) => {
  const isCoin = type === 'coin';
  const label = getDenominationLabel(denomination);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        delay: isAnimating ? index * 0.15 : 0,
        type: "spring",
        stiffness: 200,
        damping: 15
      }}
      className="flex flex-col items-center gap-2"
    >
      <div className="relative">
        {Array.from({ length: Math.min(count, 5) }).map((_, i) => (
          <motion.div
            key={i}
            initial={isAnimating ? { scale: 0, rotate: 0 } : false}
            animate={{ scale: 1, rotate: i * 3 }}
            transition={{ 
              delay: isAnimating ? index * 0.15 + i * 0.05 : 0,
              type: "spring",
              stiffness: 300
            }}
            className={`
              ${isCoin 
                ? "w-16 h-16 rounded-full bg-gradient-coin shadow-coin" 
                : "w-24 h-12 rounded-lg bg-gradient-bill shadow-counter"
              }
              flex items-center justify-center
              font-bold text-foreground border-2 border-foreground/10
              ${i > 0 ? 'absolute top-0 left-0' : ''}
            `}
            style={{
              transform: `translateY(${i * -2}px) translateX(${i * 2}px)`,
              zIndex: 5 - i,
            }}
          >
            <span className={isCoin ? "text-sm" : "text-base"}>{label}</span>
          </motion.div>
        ))}
      </div>
      
      <div className="flex items-center gap-2 bg-card px-3 py-1 rounded-full shadow-sm">
        <span className="text-sm font-semibold text-card-foreground">×{count}</span>
      </div>
    </motion.div>
  );
};
