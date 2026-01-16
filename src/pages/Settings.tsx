import { useState } from "react";
import { motion } from "framer-motion";
import AppLayout from "@/components/AppLayout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Building2,
  Clock,
  MessageSquare,
  Link as LinkIcon,
  Bot,
  Users,
  Shield,
  Bell,
  ChevronRight,
  Info,
  Lock
} from "lucide-react";

const settingsSections = [
  {
    id: "business",
    title: "Business Info",
    icon: Building2,
    description: "Name, phone number, timezone",
  },
  {
    id: "hours",
    title: "Business Hours",
    icon: Clock,
    description: "Set your availability",
  },
  {
    id: "sms",
    title: "Auto-SMS Settings",
    icon: MessageSquare,
    description: "Customize your auto-reply message",
  },
  {
    id: "booking",
    title: "Booking Link",
    icon: LinkIcon,
    description: "Your calendar/booking URL",
  },
  {
    id: "known",
    title: "Known Numbers",
    icon: Users,
    description: "Contacts, vendors, never auto-text list",
  },
];

const proSettings = [
  {
    id: "ai",
    title: "AI Call Answering",
    icon: Bot,
    description: "Let AI answer calls when you're busy",
    badge: "Pro",
  },
  {
    id: "faq",
    title: "AI FAQ Topics",
    icon: Info,
    description: "Control what AI can answer",
    badge: "Pro",
  },
  {
    id: "escalation",
    title: "Escalation Rules",
    icon: Shield,
    description: "When to hand off to owner",
    badge: "Pro",
  },
];

export default function Settings() {
  const [aiEnabled, setAiEnabled] = useState(true);
  const [autoSmsEnabled, setAutoSmsEnabled] = useState(true);
  const [afterHoursAi, setAfterHoursAi] = useState(true);
  const [busyModeAi, setBusyModeAi] = useState(false);

  return (
    <AppLayout>
      <div className="p-6 lg:p-8 max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
            Settings
          </h1>
          <p className="text-muted-foreground">
            Manage your DetailPilotAI configuration
          </p>
        </motion.div>

        {/* General Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-lg font-semibold text-foreground mb-4">General</h2>
          <Card variant="premium" className="divide-y divide-border overflow-hidden">
            {settingsSections.map((section) => (
              <button
                key={section.id}
                className="w-full p-4 lg:p-6 flex items-center justify-between hover:bg-secondary/30 transition-colors text-left"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-xl bg-secondary text-muted-foreground">
                    <section.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">{section.title}</h3>
                    <p className="text-sm text-muted-foreground">{section.description}</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </button>
            ))}
          </Card>
        </motion.div>

        {/* Auto-SMS Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card variant="premium" className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-xl bg-primary/10 text-primary">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Auto-SMS</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Automatically text missed callers with your custom message
                  </p>
                  <div className="p-3 rounded-xl bg-secondary/50 text-sm text-foreground">
                    "Hi! Thanks for calling Pristine Auto Detailing. Sorry we missed you — 
                    we're probably detailing a car right now! 🚗 Book anytime: calendly.com/pristine-auto"
                  </div>
                </div>
              </div>
              <button
                onClick={() => setAutoSmsEnabled(!autoSmsEnabled)}
                className={`w-14 h-7 rounded-full transition-all relative shrink-0 ${
                  autoSmsEnabled ? "bg-primary" : "bg-muted"
                }`}
              >
                <span className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-all ${
                  autoSmsEnabled ? "left-8" : "left-1"
                }`} />
              </button>
            </div>
          </Card>

          {/* Rate Limit Info */}
          <div className="mt-4 p-4 rounded-xl bg-secondary/30 border border-border">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-foreground font-medium">Spam Protection</p>
                <p className="text-sm text-muted-foreground">
                  Each number is texted once per day max. Repeated calls from the same number 
                  won't trigger multiple messages.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Pro Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-lg font-semibold text-foreground">Pro Features</h2>
            <Badge variant="warning">Pro Plan</Badge>
          </div>
          
          <Card variant="premium" className="overflow-hidden">
            {/* AI Call Answering Master Toggle */}
            <div className="p-6 border-b border-border">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-xl bg-primary/10 text-primary">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">AI Call Answering</h3>
                    <p className="text-sm text-muted-foreground">
                      Let AI answer calls when you're unavailable
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setAiEnabled(!aiEnabled)}
                  className={`w-14 h-7 rounded-full transition-all relative shrink-0 ${
                    aiEnabled ? "bg-primary" : "bg-muted"
                  }`}
                >
                  <span className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-all ${
                    aiEnabled ? "left-8" : "left-1"
                  }`} />
                </button>
              </div>

              {aiEnabled && (
                <div className="mt-6 pl-12 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">After-hours mode</p>
                      <p className="text-xs text-muted-foreground">AI answers outside business hours</p>
                    </div>
                    <button
                      onClick={() => setAfterHoursAi(!afterHoursAi)}
                      className={`w-12 h-6 rounded-full transition-all relative ${
                        afterHoursAi ? "bg-primary" : "bg-muted"
                      }`}
                    >
                      <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${
                        afterHoursAi ? "left-7" : "left-1"
                      }`} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">Busy mode</p>
                      <p className="text-xs text-muted-foreground">AI answers after 3 rings</p>
                    </div>
                    <button
                      onClick={() => setBusyModeAi(!busyModeAi)}
                      className={`w-12 h-6 rounded-full transition-all relative ${
                        busyModeAi ? "bg-primary" : "bg-muted"
                      }`}
                    >
                      <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${
                        busyModeAi ? "left-7" : "left-1"
                      }`} />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* AI FAQ Topics */}
            <div className="p-6 border-b border-border">
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-xl bg-secondary text-muted-foreground">
                  <Info className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-foreground mb-2">AI Can Answer Questions About</h3>
                  <div className="flex flex-wrap gap-2">
                    {["Services", "Service Area", "Hours", "Price Ranges"].map((topic) => (
                      <Badge key={topic} variant="secondary" className="px-3 py-1">
                        {topic}
                      </Badge>
                    ))}
                  </div>
                  <Button variant="ghost" size="sm" className="mt-3 -ml-2">
                    Edit Topics
                  </Button>
                </div>
              </div>
            </div>

            {/* Escalation */}
            <button className="w-full p-6 flex items-center justify-between hover:bg-secondary/30 transition-colors text-left">
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-xl bg-secondary text-muted-foreground">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground">Escalation Rules</h3>
                  <p className="text-sm text-muted-foreground">If unsure → hand off to owner</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
          </Card>
        </motion.div>

        {/* Danger Zone */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card variant="premium" className="p-6 border-destructive/30">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-2 rounded-xl bg-destructive/10 text-destructive">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Account</h3>
                <p className="text-sm text-muted-foreground">Manage your subscription and data</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline">Manage Subscription</Button>
              <Button variant="outline" className="text-destructive border-destructive/30 hover:bg-destructive/10">
                Delete Account
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </AppLayout>
  );
}
