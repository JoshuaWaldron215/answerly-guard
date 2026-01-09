import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AppLayout from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  Sparkles
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

const leadsData: Lead[] = [
  {
    id: "1",
    phone: "(305) 555-0123",
    name: "Mike Thompson",
    time: "10:34 AM",
    date: "Today",
    status: "missed",
    intent: "high",
    outcome: "booked",
    service: "Full Detail",
    location: "Miami Beach",
    preferredDate: "Saturday 9am",
    confidence: 95,
    summary: "Customer booked full detail for Tesla Model 3. High intent, responded to SMS within 2 minutes. Estimated value: $180.",
    conversation: [
      { from: "answerly", message: "Hi! Thanks for calling Pristine Auto Detailing. Sorry we missed you — we're probably detailing a car right now! 🚗 Book your appointment anytime: calendly.com/pristine-auto", time: "10:34 AM" },
      { from: "customer", message: "Hey! I need a full detail for my Tesla Model 3. Saturday morning work?", time: "10:36 AM" },
      { from: "answerly", message: "Saturday morning works great! I've got 9am available. Does that work for you? Here's the link to book: calendly.com/pristine-auto/full-detail", time: "10:36 AM" },
      { from: "customer", message: "Perfect, just booked for 9am. Thanks!", time: "10:38 AM" },
    ]
  },
  {
    id: "2",
    phone: "(786) 555-0456",
    time: "9:45 AM",
    date: "Today",
    status: "missed",
    intent: "medium",
    outcome: "waiting",
    service: "Interior Cleaning",
    location: "Coral Gables",
    confidence: 65,
    summary: "Customer asked about SUV interior pricing. SMS sent, awaiting response. Follow-up recommended if no reply by EOD.",
    conversation: [
      { from: "answerly", message: "Hi! Thanks for calling Pristine Auto Detailing. Sorry we missed you — we're probably detailing a car right now! 🚗 Book your appointment anytime: calendly.com/pristine-auto", time: "9:45 AM" },
      { from: "customer", message: "How much for interior cleaning on an SUV?", time: "9:48 AM" },
    ]
  },
  {
    id: "3",
    phone: "(954) 555-0789",
    name: "Sarah Chen",
    time: "8:22 AM",
    date: "Today",
    status: "ai_answered",
    intent: "high",
    outcome: "waiting",
    service: "Ceramic Coating",
    location: "Fort Lauderdale",
    preferredDate: "Next week",
    confidence: 82,
    summary: "AI handled after-hours call. Answered service area and hours questions. Sent booking link. Customer browsed 3 pages.",
    conversation: [
      { from: "answerly", message: "Hi, thanks for calling Pristine Auto Detailing! I'm the AI assistant. How can I help you today?", time: "8:22 AM" },
      { from: "customer", message: "Do you guys do ceramic coating? And do you come to Fort Lauderdale?", time: "8:22 AM" },
      { from: "answerly", message: "Yes! We offer ceramic coating services, and we definitely serve Fort Lauderdale. It's one of our main service areas. Would you like to book an appointment? I can send you our booking link.", time: "8:22 AM" },
      { from: "customer", message: "Yes please, send it over", time: "8:23 AM" },
      { from: "answerly", message: "Here you go: calendly.com/pristine-auto/ceramic. You can pick a time that works for you. Ceramic coating typically takes 4-6 hours. Any questions?", time: "8:23 AM" },
    ]
  },
  {
    id: "4",
    phone: "(305) 555-0321",
    name: "James Wilson",
    time: "4:15 PM",
    date: "Yesterday",
    status: "missed",
    intent: "high",
    outcome: "booked",
    service: "Ceramic Coating",
    location: "Downtown Miami",
    preferredDate: "Tuesday 10am",
    confidence: 98,
    summary: "Booked ceramic coating for BMW. High-value customer ($450 est). Returning customer from 6 months ago.",
    conversation: [
      { from: "answerly", message: "Hi! Thanks for calling Pristine Auto Detailing. Sorry we missed you — we're probably detailing a car right now! 🚗 Book your appointment anytime: calendly.com/pristine-auto", time: "4:15 PM" },
      { from: "customer", message: "Hey it's James, I got my BMW detailed there 6 months ago. Ready for ceramic coating now. Tuesday work?", time: "4:18 PM" },
      { from: "answerly", message: "Hi James! Great to hear from you again. Tuesday works perfectly. I have 10am and 2pm available. Which works better?", time: "4:18 PM" },
      { from: "customer", message: "10am, booked it", time: "4:20 PM" },
    ]
  },
  {
    id: "5",
    phone: "(305) 555-0999",
    time: "2:30 PM",
    date: "Yesterday",
    status: "missed",
    intent: "low",
    outcome: "dropped",
    confidence: 25,
    summary: "SMS sent, no reply after 24 hours. Low intent - short call duration (3 seconds). Possibly wrong number.",
    conversation: [
      { from: "answerly", message: "Hi! Thanks for calling Pristine Auto Detailing. Sorry we missed you — we're probably detailing a car right now! 🚗 Book your appointment anytime: calendly.com/pristine-auto", time: "2:30 PM" },
    ]
  },
];

export default function Calls() {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredLeads = leadsData.filter(lead => 
    lead.phone.includes(searchQuery) || 
    lead.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            All your interactions in one place
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

        {/* Leads Table/List */}
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

                  {/* Actions */}
                  <div className="space-y-3">
                    <Button variant="accent" className="w-full">
                      <PhoneCall className="w-4 h-4 mr-2" />
                      Call Back
                    </Button>
                    <Button variant="secondary" className="w-full">
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
