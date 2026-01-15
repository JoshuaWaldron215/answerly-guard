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
  ArrowRight,
  Lock,
  Loader2
} from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/lib/supabase";
import StatCard from "@/components/dashboard/StatCard";
import ActivityItem from "@/components/dashboard/ActivityItem";
import AiAssistant from "@/components/dashboard/AiAssistant";
import PlanToggle from "@/components/dashboard/PlanToggle";

const filterOptions = ["Today", "This Week", "High Intent"];

export default function Dashboard() {
  const [activeFilter, setActiveFilter] = useState("Today");
  const [plan, setPlan] = useState<"starter" | "pro">("pro");
  const { user } = useAuth();

  // Fetch dashboard stats
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboard-stats', user?.id],
    queryFn: () => db.getDashboardStats(user!.id),
    enabled: !!user,
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Fetch recent calls for activity feed
  const { data: recentCalls, isLoading: callsLoading } = useQuery({
    queryKey: ['recent-calls', user?.id],
    queryFn: () => db.getCalls(user!.id, { limit: 10 }),
    enabled: !!user,
    refetchInterval: 30000,
  });

  // Transform stats data for StatCard component
  const statCards = [
    {
      label: "Total Calls",
      value: stats?.totalCalls?.toString() || "0",
      change: "Today",
      icon: Phone,
      color: "text-muted-foreground"
    },
    {
      label: "Hot Leads",
      value: stats?.hotLeads?.toString() || "0",
      change: "High intent",
      icon: Flame,
      color: "text-orange-500"
    },
    {
      label: "Booked",
      value: stats?.booked?.toString() || "0",
      change: "Confirmed",
      icon: Calendar,
      color: "text-primary"
    },
    {
      label: "Follow-Up",
      value: stats?.needsFollowup?.toString() || "0",
      change: "Waiting",
      icon: AlertCircle,
      color: "text-warning"
    },
  ];

  // Transform calls to activity feed items
  const activityFeed = recentCalls?.map((call) => {
    const getIcon = () => {
      if (call.outcome === 'booked') return Flame;
      if (call.outcome === 'waiting') return AlertTriangle;
      if (call.status === 'ai_answered') return Bot;
      if (call.outcome === 'dropped') return X;
      return Phone;
    };

    const getType = () => {
      if (call.outcome === 'booked') return 'booked';
      if (call.outcome === 'waiting') return 'waiting';
      if (call.outcome === 'dropped') return 'dropped';
      return 'ai';
    };

    const formatTime = (dateStr: string) => {
      const date = new Date(dateStr);
      const now = new Date();
      const diffHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

      if (diffHours < 24) {
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      } else if (diffHours < 48) {
        return 'Yesterday';
      } else {
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      }
    };

    const getStatus = () => {
      if (call.outcome === 'booked') return 'Booked appointment';
      if (call.status === 'ai_answered') return 'AI answered';
      if (call.status === 'missed') return 'Missed call';
      return 'Call received';
    };

    const getSummary = () => {
      if (call.summary) return call.summary;
      if (call.service_requested) {
        return `Interested in ${call.service_requested}${call.vehicle_make ? ` for ${call.vehicle_year || ''} ${call.vehicle_make} ${call.vehicle_model || ''}` : ''}`;
      }
      return 'Call received, awaiting follow-up';
    };

    return {
      id: call.id,
      type: getType(),
      icon: getIcon(),
      time: formatTime(call.created_at),
      caller: call.caller_name || call.phone_number,
      status: getStatus(),
      summary: getSummary(),
      intent: call.intent
    };
  }) || [];

  if (statsLoading || callsLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="p-5 lg:p-8 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
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
            
            {/* Plan Toggle */}
            <PlanToggle plan={plan} onPlanChange={setPlan} />
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((stat, index) => (
            <StatCard key={stat.label} {...stat} index={index} />
          ))}
        </div>

        {/* AI Insight Banner - Pro Only */}
        {plan === "pro" ? (
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
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="mb-8"
          >
            <div className="relative overflow-hidden rounded-2xl border border-border bg-card/50 p-5">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-secondary text-muted-foreground">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground mb-0.5">
                      Upgrade to Pro
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Unlock AI insights, smart recommendations, and the AI assistant
                    </p>
                  </div>
                </div>
                <Button size="sm" className="shrink-0 gap-2">
                  Upgrade
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}

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

        {/* AI Assistant - Pro Only */}
        {plan === "pro" && <AiAssistant />}
      </div>
    </AppLayout>
  );
}
