import { motion } from "framer-motion";
import AppLayout from "@/components/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Phone, 
  MessageSquare, 
  Calendar, 
  AlertCircle,
  TrendingUp,
  Clock,
  Bot,
  X,
  Flame,
  AlertTriangle,
  Filter
} from "lucide-react";
import { useState } from "react";

const stats = [
  { 
    label: "Missed Calls Today", 
    value: "7", 
    change: "+3 vs yesterday",
    icon: Phone,
    color: "text-muted-foreground"
  },
  { 
    label: "Leads Recovered", 
    value: "5", 
    change: "71% recovery rate",
    icon: TrendingUp,
    color: "text-success"
  },
  { 
    label: "Bookings Created", 
    value: "3", 
    change: "$540 estimated",
    icon: Calendar,
    color: "text-primary"
  },
  { 
    label: "Needs Follow-Up", 
    value: "2", 
    change: "Action required",
    icon: AlertCircle,
    color: "text-warning"
  },
];

const activityFeed = [
  {
    id: 1,
    type: "booked",
    icon: Flame,
    time: "10:34 AM",
    caller: "(305) 555-0123",
    status: "Missed call → booked",
    summary: "Full detail for Tesla Model 3, Saturday 9am. Est. $180",
    intent: "high"
  },
  {
    id: 2,
    type: "waiting",
    icon: AlertTriangle,
    time: "9:45 AM",
    caller: "(786) 555-0456",
    status: "Missed call → replied",
    summary: "Asked about price for SUV interior cleaning. Waiting for response.",
    intent: "medium"
  },
  {
    id: 3,
    type: "ai",
    icon: Bot,
    time: "8:22 AM",
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
      <div className="p-6 lg:p-8 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
            Good morning ☀️
          </h1>
          <p className="text-muted-foreground">
            Here's what happened while you were busy.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card variant="stat" className="h-full">
                <div className="flex items-start justify-between mb-3">
                  <div className={`p-2 rounded-lg bg-secondary ${stat.color}`}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-foreground mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground mb-1">
                  {stat.label}
                </div>
                <div className={`text-xs ${stat.color}`}>
                  {stat.change}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Activity Feed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card variant="premium" className="overflow-hidden">
            <div className="p-6 border-b border-border">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-foreground">Activity</h2>
                  <p className="text-sm text-muted-foreground">Recent calls and interactions</p>
                </div>
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-muted-foreground" />
                  {filterOptions.map((filter) => (
                    <Button
                      key={filter}
                      variant={activeFilter === filter ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setActiveFilter(filter)}
                    >
                      {filter}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="divide-y divide-border">
              {activityFeed.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.05 }}
                  className="p-4 lg:p-6 hover:bg-secondary/30 transition-colors cursor-pointer"
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-2 rounded-xl shrink-0 ${
                      activity.type === "booked" ? "bg-success/20 text-success" :
                      activity.type === "waiting" ? "bg-warning/20 text-warning" :
                      activity.type === "ai" ? "bg-primary/20 text-primary" :
                      "bg-destructive/20 text-destructive"
                    }`}>
                      <activity.icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium text-foreground">
                            {activity.caller}
                          </span>
                          <Badge variant={
                            activity.intent === "high" ? "high" :
                            activity.intent === "medium" ? "medium" :
                            "low"
                          }>
                            {activity.intent} intent
                          </Badge>
                        </div>
                        <span className="text-sm text-muted-foreground shrink-0 ml-2">
                          {activity.time}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">
                        {activity.status}
                      </p>
                      <p className="text-sm text-foreground">
                        {activity.summary}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="p-4 border-t border-border">
              <Button variant="ghost" className="w-full">
                View All Activity
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </AppLayout>
  );
}
