import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { LucideIcon } from "lucide-react";

interface Activity {
  id: number;
  type: string;
  icon: LucideIcon;
  time: string;
  caller: string;
  status: string;
  summary: string;
  intent: string;
}

interface ActivityItemProps {
  activity: Activity;
  index: number;
}

export default function ActivityItem({ activity, index }: ActivityItemProps) {
  const getTypeStyles = (type: string) => {
    switch (type) {
      case "booked":
        return "bg-success/10 text-success ring-success/20";
      case "waiting":
        return "bg-warning/10 text-warning ring-warning/20";
      case "ai":
        return "bg-primary/10 text-primary ring-primary/20";
      default:
        return "bg-destructive/10 text-destructive ring-destructive/20";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5 + index * 0.05 }}
      className="group relative p-4 lg:p-5 transition-all cursor-pointer"
    >
      {/* Hover glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      
      {/* Left accent line */}
      <div className={`absolute left-0 top-4 bottom-4 w-0.5 rounded-full transition-all duration-300 ${
        activity.type === "booked" ? "bg-success" :
        activity.type === "waiting" ? "bg-warning" :
        activity.type === "ai" ? "bg-primary" :
        "bg-destructive"
      } opacity-0 group-hover:opacity-100`} />
      
      <div className="relative flex items-start gap-4">
        <div className={`p-2.5 rounded-xl shrink-0 ring-1 ${getTypeStyles(activity.type)}`}>
          <activity.icon className="w-5 h-5" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-foreground font-mono text-sm">
                {activity.caller}
              </span>
              <Badge variant={
                activity.intent === "high" ? "high" :
                activity.intent === "medium" ? "medium" :
                "low"
              } className="uppercase text-[10px] tracking-wider">
                {activity.intent}
              </Badge>
            </div>
            <div className="flex items-center gap-2 shrink-0 ml-2">
              <span className="text-xs text-muted-foreground font-mono">
                {activity.time}
              </span>
            </div>
          </div>
          
          <p className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
            <span className={`inline-block w-1.5 h-1.5 rounded-full ${
              activity.type === "booked" ? "bg-success" :
              activity.type === "waiting" ? "bg-warning" :
              activity.type === "ai" ? "bg-primary" :
              "bg-destructive"
            }`} />
            {activity.status}
          </p>
          
          <p className="text-sm text-foreground/80 leading-relaxed">
            {activity.summary}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
