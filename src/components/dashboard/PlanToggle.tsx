import { motion } from "framer-motion";
import { Crown, Zap } from "lucide-react";

interface PlanToggleProps {
  plan: "starter" | "pro";
  onPlanChange: (plan: "starter" | "pro") => void;
}

export default function PlanToggle({ plan, onPlanChange }: PlanToggleProps) {
  return (
    <div className="flex items-center gap-1 p-1 bg-secondary/50 rounded-xl border border-border">
      <button
        onClick={() => onPlanChange("starter")}
        className={`relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
          plan === "starter" 
            ? "text-foreground" 
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        {plan === "starter" && (
          <motion.div
            layoutId="planIndicator"
            className="absolute inset-0 bg-card border border-border rounded-lg shadow-sm"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        )}
        <span className="relative flex items-center gap-2">
          <Zap className="w-4 h-4" />
          Starter
        </span>
      </button>
      
      <button
        onClick={() => onPlanChange("pro")}
        className={`relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
          plan === "pro" 
            ? "text-foreground" 
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        {plan === "pro" && (
          <motion.div
            layoutId="planIndicator"
            className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30 rounded-lg shadow-sm"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        )}
        <span className="relative flex items-center gap-2">
          <Crown className="w-4 h-4" />
          Pro
        </span>
      </button>
    </div>
  );
}
