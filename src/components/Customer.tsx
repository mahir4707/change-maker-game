import { motion } from "framer-motion";
import customerImage from "@/assets/customer.png";

interface CustomerProps {
  isHappy?: boolean;
  message?: string;
}

export const Customer = ({ isHappy = true, message }: CustomerProps) => {
  return (
    <div className="flex flex-col items-center gap-4">
      <motion.div
        animate={isHappy ? { scale: [1, 1.05, 1] } : {}}
        transition={{ duration: 2, repeat: Infinity }}
        className="relative"
      >
        <img 
          src={customerImage} 
          alt="Customer" 
          className="w-48 h-48 object-contain drop-shadow-lg"
        />
      </motion.div>
      
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative bg-card px-6 py-3 rounded-2xl shadow-counter max-w-xs"
        >
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-card rotate-45" />
          <p className="text-card-foreground text-center font-medium relative z-10">
            {message}
          </p>
        </motion.div>
      )}
    </div>
  );
};
