import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string;
  change: string;
  icon: LucideIcon;
  color: string;
  index: number;
}

export default function StatCard({ label, value, change, icon: Icon, color, index }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
      className="group relative"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent opacity-0 group-hover:opacity-100 rounded-2xl blur-xl transition-opacity duration-500" />
      <div className="relative h-full rounded-2xl border border-border bg-card/80 backdrop-blur-sm p-5 overflow-hidden transition-all duration-300 hover:border-primary/30 hover:shadow-glow">
        {/* Scan line effect */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[linear-gradient(transparent_0%,transparent_calc(50%-1px),hsl(var(--primary)/0.3)_50%,transparent_calc(50%+1px),transparent_100%)] bg-[length:100%_8px] animate-[scan_4s_linear_infinite]" />
        </div>
        
        {/* Corner accent */}
        <div className={`absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl ${color === 'text-success' ? 'from-success/20' : color === 'text-warning' ? 'from-warning/20' : color === 'text-primary' ? 'from-primary/20' : 'from-muted-foreground/10'} to-transparent rounded-bl-[3rem]`} />
        
        <div className="relative">
          <div className="flex items-start justify-between mb-4">
            <div className={`p-2.5 rounded-xl bg-secondary/80 ${color} ring-1 ring-white/5`}>
              <Icon className="w-5 h-5" />
            </div>
            <div className="flex items-center gap-1">
              <span className="relative flex h-2 w-2">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${color === 'text-success' ? 'bg-success' : color === 'text-warning' ? 'bg-warning' : color === 'text-primary' ? 'bg-primary' : 'bg-muted-foreground'}`}></span>
                <span className={`relative inline-flex rounded-full h-2 w-2 ${color === 'text-success' ? 'bg-success' : color === 'text-warning' ? 'bg-warning' : color === 'text-primary' ? 'bg-primary' : 'bg-muted-foreground'}`}></span>
              </span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Live</span>
            </div>
          </div>
          
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-4xl font-bold text-foreground tabular-nums tracking-tight">
              {value}
            </span>
          </div>
          
          <div className="text-sm text-muted-foreground mb-2 font-medium">
            {label}
          </div>
          
          <div className={`text-xs ${color} flex items-center gap-1 font-medium`}>
            <div className="w-1 h-1 rounded-full bg-current" />
            {change}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
