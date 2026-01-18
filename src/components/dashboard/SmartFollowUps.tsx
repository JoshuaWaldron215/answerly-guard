import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Flame,
  Phone,
  Clock,
  MessageSquare,
  ArrowRight,
  Zap,
} from "lucide-react";
import type { Call } from "@/lib/supabase";

interface SmartFollowUpsProps {
  calls: Call[];
  hotLeads: Call[];
}

interface FollowUpCard {
  id: string;
  type: 'hot_lead' | 'missed_call' | 'stale_lead' | 'no_contact';
  priority: number;
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  bgColor: string;
  borderColor: string;
  title: string;
  subtitle: string;
  callerName: string;
  callerPhone: string;
  callId: string;
  service?: string | null;
  timeAgo: string;
  action: {
    label: string;
    type: 'call' | 'sms' | 'view';
  };
}

function getTimeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'Yesterday';
  return `${diffDays} days ago`;
}

function calculateFollowUps(calls: Call[], hotLeads: Call[]): FollowUpCard[] {
  const followUps: FollowUpCard[] = [];
  const now = new Date();

  // Priority 1: Hot leads with no contact in 24h
  hotLeads.forEach(call => {
    const lastContact = call.last_contacted_at ? new Date(call.last_contacted_at) : null;
    const createdAt = new Date(call.created_at);
    const hoursSinceContact = lastContact
      ? (now.getTime() - lastContact.getTime()) / (1000 * 60 * 60)
      : (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);

    if (!lastContact || hoursSinceContact > 24) {
      followUps.push({
        id: call.id,
        type: 'hot_lead',
        priority: 1,
        icon: Flame,
        iconColor: 'text-orange-600',
        bgColor: 'bg-orange-500/10',
        borderColor: 'border-orange-500/20',
        title: 'Hot lead waiting!',
        subtitle: 'High intent - respond ASAP for 3x conversion',
        callerName: call.caller_name || 'Unknown',
        callerPhone: call.phone_number,
        callId: call.id,
        service: call.service_requested,
        timeAgo: getTimeAgo(call.created_at),
        action: { label: 'Call Back', type: 'call' },
      });
    }
  });

  // Priority 2: Missed calls with no follow-up
  calls
    .filter(call => call.status === 'missed' && !call.last_contacted_at)
    .slice(0, 3)
    .forEach(call => {
      followUps.push({
        id: call.id,
        type: 'missed_call',
        priority: 2,
        icon: Phone,
        iconColor: 'text-red-600',
        bgColor: 'bg-red-500/10',
        borderColor: 'border-red-500/20',
        title: 'Missed call - no follow-up',
        subtitle: 'They tried to reach you',
        callerName: call.caller_name || 'Unknown',
        callerPhone: call.phone_number,
        callId: call.id,
        service: call.service_requested,
        timeAgo: getTimeAgo(call.created_at),
        action: { label: 'Follow Up', type: 'call' },
      });
    });

  // Priority 3: Leads going stale (48h+ without action)
  calls
    .filter(call => {
      const hoursSince = (now.getTime() - new Date(call.created_at).getTime()) / (1000 * 60 * 60);
      return (
        call.outcome === 'waiting' &&
        hoursSince > 48 &&
        !call.last_contacted_at
      );
    })
    .slice(0, 2)
    .forEach(call => {
      followUps.push({
        id: call.id,
        type: 'stale_lead',
        priority: 3,
        icon: Clock,
        iconColor: 'text-yellow-600',
        bgColor: 'bg-yellow-500/10',
        borderColor: 'border-yellow-500/20',
        title: 'Lead going cold',
        subtitle: 'Reach out before they book elsewhere',
        callerName: call.caller_name || 'Unknown',
        callerPhone: call.phone_number,
        callId: call.id,
        service: call.service_requested,
        timeAgo: getTimeAgo(call.created_at),
        action: { label: 'Send SMS', type: 'sms' },
      });
    });

  // Sort by priority and limit to 3
  return followUps.sort((a, b) => a.priority - b.priority).slice(0, 3);
}

export default function SmartFollowUps({ calls, hotLeads }: SmartFollowUpsProps) {
  const navigate = useNavigate();
  const followUps = calculateFollowUps(calls, hotLeads);

  // Don't render if no follow-ups needed
  if (followUps.length === 0) {
    return null;
  }

  const handleAction = (followUp: FollowUpCard) => {
    if (followUp.action.type === 'call') {
      window.location.href = `tel:${followUp.callerPhone}`;
    } else if (followUp.action.type === 'sms') {
      window.location.href = `sms:${followUp.callerPhone}`;
    } else {
      navigate(`/calls?id=${followUp.callId}`);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="mb-8"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">
            Action Required
          </h2>
          <Badge variant="secondary" className="text-xs">
            {followUps.length} items
          </Badge>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/calls')}
          className="text-muted-foreground hover:text-foreground"
        >
          View All Calls
          <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </div>

      {/* Follow-up Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {followUps.map((followUp, index) => (
          <motion.div
            key={followUp.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card
              className={`p-4 ${followUp.bgColor} border ${followUp.borderColor} hover:shadow-md transition-shadow cursor-pointer`}
              onClick={() => handleAction(followUp)}
            >
              <div className="flex items-start gap-3">
                {/* Icon */}
                <div className={`p-2 rounded-lg ${followUp.bgColor}`}>
                  <followUp.icon className={`w-5 h-5 ${followUp.iconColor}`} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-foreground truncate">
                      {followUp.callerName}
                    </p>
                    <span className="text-xs text-muted-foreground shrink-0">
                      {followUp.timeAgo}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-foreground mb-0.5">
                    {followUp.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {followUp.subtitle}
                  </p>
                  {followUp.service && (
                    <Badge variant="secondary" className="mt-2 text-xs">
                      {followUp.service}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Action */}
              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs text-muted-foreground font-mono">
                  {followUp.callerPhone}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  className={`text-xs ${followUp.iconColor} border-current hover:bg-current/10`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAction(followUp);
                  }}
                >
                  {followUp.action.type === 'call' && <Phone className="w-3 h-3 mr-1" />}
                  {followUp.action.type === 'sms' && <MessageSquare className="w-3 h-3 mr-1" />}
                  {followUp.action.label}
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
