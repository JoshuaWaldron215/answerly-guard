import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AppLayout from "@/components/AppLayout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { db, type Call } from "@/lib/supabase";
import {
  Phone,
  MessageSquare,
  Calendar,
  X,
  Bot,
  AlertCircle,
  ChevronRight,
  Search,
  Filter,
  PhoneCall,
  PhoneOff,
  Ban,
  CheckCircle2,
  Clock,
  MapPin,
  User,
  Sparkles,
  Loader2
} from "lucide-react";

interface Lead {
  id: string;
  phone: string;
  name?: string;
  time: string;
  date: string;
  status: "answered" | "missed" | "ai_answered" | "spam";
  intent: "high" | "medium" | "low";
  outcome: "booked" | "waiting" | "dropped" | "spam";
  service?: string;
  location?: string;
  preferredDate?: string;
  confidence: number;
  summary: string;
  conversation: {
    from: "customer" | "answerly";
    message: string;
    time: string;
  }[];
}

export default function Calls() {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useAuth();

  // Fetch calls from Supabase
  const { data: calls, isLoading } = useQuery({
    queryKey: ['all-calls', user?.id],
    queryFn: () => db.getCalls(user!.id),
    enabled: !!user,
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Transform database calls to Lead format
  const transformCallToLead = (call: Call): Lead => {
    const formatTime = (dateStr: string) => {
      const date = new Date(dateStr);
      const now = new Date();
      const diffHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

      if (diffHours < 24) {
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      } else {
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      }
    };

    const formatDate = (dateStr: string) => {
      const date = new Date(dateStr);
      const now = new Date();
      const diffHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

      if (diffHours < 24) {
        return 'Today';
      } else if (diffHours < 48) {
        return 'Yesterday';
      } else {
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      }
    };

    // Parse transcript if it exists
    const conversation: Lead['conversation'] = [];
    if (call.transcript && Array.isArray(call.transcript)) {
      call.transcript.forEach((msg: any) => {
        conversation.push({
          from: msg.role === 'user' || msg.role === 'customer' ? 'customer' : 'answerly',
          message: msg.content || msg.message || '',
          time: formatTime(call.created_at)
        });
      });
    }

    return {
      id: call.id,
      phone: call.phone_number,
      name: call.caller_name || undefined,
      time: formatTime(call.created_at),
      date: formatDate(call.created_at),
      status: call.status,
      intent: call.intent,
      outcome: call.outcome,
      service: call.service_requested || undefined,
      location: undefined, // Not in database yet
      preferredDate: call.preferred_date || undefined,
      confidence: call.confidence ? Math.round(call.confidence * 100) : 0,
      summary: call.summary || call.notes || 'Call received, no summary available yet.',
      conversation: conversation
    };
  };

  const leadsData: Lead[] = calls?.map(transformCallToLead) || [];

  const filteredLeads = leadsData.filter(lead =>
    lead.phone.includes(searchQuery) ||
    lead.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
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
      <div className="p-6 lg:p-8 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
            Calls & Leads
          </h1>
          <p className="text-muted-foreground">
            All your interactions in one place{calls && ` • ${calls.length} total calls`}
          </p>
        </motion.div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by phone or name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
            />
          </div>
          <Button variant="secondary">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </div>

        {/* Empty State */}
        {filteredLeads.length === 0 && !searchQuery && (
          <Card variant="premium" className="p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="p-4 rounded-full bg-primary/10 text-primary w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                No calls yet
              </h3>
              <p className="text-muted-foreground mb-6">
                Once your AI receptionist answers calls, they'll appear here. Make sure you've completed the Vapi setup in Settings.
              </p>
              <Button variant="accent">
                Complete Setup in Settings
              </Button>
            </div>
          </Card>
        )}

        {/* Leads Table/List */}
        {filteredLeads.length > 0 && (
          <Card variant="premium" className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Caller</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground hidden sm:table-cell">Time</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground hidden md:table-cell">Status</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground hidden lg:table-cell">Intent</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Outcome</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredLeads.map((lead, index) => (
                    <motion.tr
                      key={lead.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => setSelectedLead(lead)}
                      className="hover:bg-secondary/30 cursor-pointer transition-colors"
                    >
                      <td className="p-4">
                        <div>
                          <p className="font-medium text-foreground">{lead.phone}</p>
                          {lead.name && (
                            <p className="text-sm text-muted-foreground">{lead.name}</p>
                          )}
                        </div>
                      </td>
                      <td className="p-4 hidden sm:table-cell">
                        <div>
                          <p className="text-foreground">{lead.time}</p>
                          <p className="text-sm text-muted-foreground">{lead.date}</p>
                        </div>
                      </td>
                      <td className="p-4 hidden md:table-cell">
                        <Badge variant={
                          lead.status === "answered" ? "success" :
                          lead.status === "ai_answered" ? "default" :
                          lead.status === "spam" ? "secondary" :
                          "warning"
                        }>
                          {lead.status === "ai_answered" ? "AI Answered" :
                           lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                        </Badge>
                      </td>
                      <td className="p-4 hidden lg:table-cell">
                        <Badge variant={lead.intent}>{lead.intent}</Badge>
                      </td>
                      <td className="p-4">
                        <Badge variant={lead.outcome}>{lead.outcome}</Badge>
                      </td>
                      <td className="p-4">
                        <ChevronRight className="w-5 h-5 text-muted-foreground" />
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* Lead Detail Drawer */}
        <AnimatePresence>
          {selectedLead && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedLead(null)}
                className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
              />
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 30, stiffness: 300 }}
                className="fixed right-0 top-0 bottom-0 w-full max-w-lg bg-card border-l border-border z-50 overflow-y-auto"
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-foreground">{selectedLead.phone}</h2>
                      {selectedLead.name && (
                        <p className="text-muted-foreground">{selectedLead.name}</p>
                      )}
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => setSelectedLead(null)}>
                      <X className="w-5 h-5" />
                    </Button>
                  </div>

                  {/* Lead Info */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    {selectedLead.service && (
                      <div className="p-3 rounded-xl bg-secondary/50">
                        <p className="text-xs text-muted-foreground mb-1">Service</p>
                        <p className="font-medium text-foreground">{selectedLead.service}</p>
                      </div>
                    )}
                    {selectedLead.location && (
                      <div className="p-3 rounded-xl bg-secondary/50">
                        <p className="text-xs text-muted-foreground mb-1">Location</p>
                        <p className="font-medium text-foreground">{selectedLead.location}</p>
                      </div>
                    )}
                    {selectedLead.preferredDate && (
                      <div className="p-3 rounded-xl bg-secondary/50">
                        <p className="text-xs text-muted-foreground mb-1">Preferred Date</p>
                        <p className="font-medium text-foreground">{selectedLead.preferredDate}</p>
                      </div>
                    )}
                    <div className="p-3 rounded-xl bg-secondary/50">
                      <p className="text-xs text-muted-foreground mb-1">Confidence</p>
                      <p className="font-medium text-foreground">{selectedLead.confidence}%</p>
                    </div>
                  </div>

                  {/* AI Summary */}
                  <div className="mb-6 p-4 rounded-xl bg-primary/10 border border-primary/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium text-foreground">AI Summary</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{selectedLead.summary}</p>
                  </div>

                  {/* Conversation */}
                  {selectedLead.conversation.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-foreground mb-4">Conversation</h3>
                      <div className="space-y-4">
                        {selectedLead.conversation.map((msg, idx) => (
                          <div
                            key={idx}
                            className={`flex ${msg.from === "answerly" ? "justify-start" : "justify-end"}`}
                          >
                            <div className={`max-w-[80%] p-3 rounded-2xl ${
                              msg.from === "answerly"
                                ? "bg-secondary text-foreground rounded-bl-md"
                                : "bg-primary text-primary-foreground rounded-br-md"
                            }`}>
                              <p className="text-sm">{msg.message}</p>
                              <p className={`text-xs mt-1 ${
                                msg.from === "answerly" ? "text-muted-foreground" : "text-primary-foreground/70"
                              }`}>
                                {msg.time}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="space-y-3">
                    <Button
                      variant="accent"
                      className="w-full"
                      onClick={() => window.open(`tel:${selectedLead.phone}`, '_self')}
                    >
                      <PhoneCall className="w-4 h-4 mr-2" />
                      Call Back
                    </Button>
                    <Button
                      variant="secondary"
                      className="w-full"
                      onClick={() => window.open(`sms:${selectedLead.phone}`, '_self')}
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Send Text
                    </Button>
                    <div className="grid grid-cols-2 gap-3">
                      <Button variant="outline">
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Mark Booked
                      </Button>
                      <Button variant="outline">
                        <X className="w-4 h-4 mr-2" />
                        Not a Lead
                      </Button>
                    </div>
                    <Button variant="ghost" className="w-full text-muted-foreground">
                      <Ban className="w-4 h-4 mr-2" />
                      Never auto-text this number
                    </Button>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </AppLayout>
  );
}
