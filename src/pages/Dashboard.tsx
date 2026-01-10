import { motion } from "framer-motion";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { 
  Phone, 
  TrendingUp,
  Calendar, 
  AlertCircle,
  Bot,
  X,
  Flame,
  AlertTriangle,
  Activity,
  Zap,
  ArrowRight
} from "lucide-react";
import { useState } from "react";
import StatCard from "@/components/dashboard/StatCard";
import ActivityItem from "@/components/dashboard/ActivityItem";

const stats = [
  { 
    label: "Missed Calls", 
    value: "7", 
    change: "+3 vs yesterday",
    icon: Phone,
    color: "text-muted-foreground"
  },
  { 
    label: "Recovered", 
    value: "5", 
    change: "71% recovery rate",
    icon: TrendingUp,
    color: "text-success"
  },
  { 
    label: "Booked", 
    value: "3", 
    change: "$540 revenue",
    icon: Calendar,
    color: "text-primary"
  },
  { 
    label: "Follow-Up", 
    value: "2", 
    change: "Action needed",
    icon: AlertCircle,
    color: "text-warning"
  },
];

const activityFeed = [
  {
    id: 1,
    type: "booked",
    icon: Flame,
    time: "10:34",
    caller: "(305) 555-0123",
    status: "Missed call → booked",
    summary: "Full detail for Tesla Model 3, Saturday 9am. Est. $180",
    intent: "high"
  },
  {
    id: 2,
    type: "waiting",
    icon: AlertTriangle,
    time: "09:45",
    caller: "(786) 555-0456",
    status: "Missed call → replied",
    summary: "Asked about price for SUV interior cleaning. Waiting for response.",
    intent: "medium"
  },
  {
    id: 3,
    type: "ai",
    icon: Bot,
    time: "08:22",
    caller: "(954) 555-0789",
    status: "AI answered after-hours",
    summary: "Answered hours question, sent booking link. Customer browsed 3 pages.",
    intent: "high"
  },
  {
    id: 4,
    type: "booked",
    icon: Flame,
    time: "Yesterday",
    caller: "(305) 555-0321",
    status: "Missed call → booked",
    summary: "Ceramic coating appointment, next Tuesday. Est. $450",
    intent: "high"
  },
  {
    id: 5,
    type: "dropped",
    icon: X,
    time: "Yesterday",
    caller: "(305) 555-0999",
    status: "Missed call → no response",
    summary: "SMS sent, no reply after 24h. May need follow-up call.",
    intent: "low"
  },
];

const filterOptions = ["Today", "This Week", "High Intent"];

export default function Dashboard() {
  const [activeFilter, setActiveFilter] = useState("Today");

  return (
    <AppLayout>
      <div className="p-5 lg:p-8 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center">
                <Activity className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-success"></span>
              </span>
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-foreground tracking-tight">
                Command Center
              </h1>
              <p className="text-sm text-muted-foreground font-mono">
                <span className="text-success">●</span> System active • Last sync 2s ago
              </p>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <StatCard key={stat.label} {...stat} index={index} />
          ))}
        </div>

        {/* AI Insight Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="mb-8"
        >
          <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/10 via-card to-card p-5">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_left,hsl(var(--primary)/0.15),transparent_70%)]" />
            <div className="relative flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-primary/20 text-primary ring-1 ring-primary/30">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground mb-0.5">
                    AI Insight
                  </p>
                  <p className="text-sm text-muted-foreground">
                    2 high-intent leads waiting — respond within 10 min to boost conversion by 3x
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="shrink-0 gap-2 text-primary hover:text-primary hover:bg-primary/10">
                View leads
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Activity Feed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="rounded-2xl border border-border bg-card/50 backdrop-blur-sm overflow-hidden">
            {/* Header */}
            <div className="p-5 border-b border-border bg-card/80">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-secondary">
                    <Activity className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">Live Activity</h2>
                    <p className="text-xs text-muted-foreground font-mono">Real-time interaction stream</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 p-1 bg-secondary/50 rounded-xl">
                  {filterOptions.map((filter) => (
                    <Button
                      key={filter}
                      variant={activeFilter === filter ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setActiveFilter(filter)}
                      className={`text-xs ${activeFilter === filter ? '' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                      {filter}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Activity List */}
            <div className="divide-y divide-border/50">
              {activityFeed.map((activity, index) => (
                <ActivityItem key={activity.id} activity={activity} index={index} />
              ))}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-border bg-card/30">
              <Button variant="ghost" className="w-full text-muted-foreground hover:text-foreground gap-2">
                View all activity
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </AppLayout>
  );
}
