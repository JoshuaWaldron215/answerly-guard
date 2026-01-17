import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import AppLayout from "@/components/AppLayout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { connectGoogleCalendar, disconnectGoogleCalendar, isGoogleCalendarConnected } from "@/lib/googleCalendar";
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
  Lock,
  Phone,
  Mic,
  Save,
  Loader2,
  Calendar,
  CheckCircle2,
  XCircle
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

// Available Vapi voices
const VAPI_VOICES = [
  { id: 'alloy', name: 'Alloy', gender: 'neutral', description: 'Balanced and professional' },
  { id: 'echo', name: 'Echo', gender: 'male', description: 'Clear and confident' },
  { id: 'fable', name: 'Fable', gender: 'neutral', description: 'Warm and engaging' },
  { id: 'onyx', name: 'Onyx', gender: 'male', description: 'Deep and authoritative' },
  { id: 'nova', name: 'Nova', gender: 'female', description: 'Friendly and upbeat' },
  { id: 'shimmer', name: 'Shimmer', gender: 'female', description: 'Bright and energetic' },
];

export default function Settings() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [showCalendarSuccess, setShowCalendarSuccess] = useState(false);

  // Form state
  const [businessName, setBusinessName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [vapiPhoneNumber, setVapiPhoneNumber] = useState('');
  const [bookingLink, setBookingLink] = useState('');
  const [selectedVoice, setSelectedVoice] = useState('nova');
  const [forwardAfterRings, setForwardAfterRings] = useState(3);

  // Toggle states
  const [aiEnabled, setAiEnabled] = useState(true);
  const [autoSmsEnabled, setAutoSmsEnabled] = useState(true);
  const [afterHoursAi, setAfterHoursAi] = useState(true);
  const [busyModeAi, setBusyModeAi] = useState(false);

  // Load user settings on mount
  useEffect(() => {
    loadUserSettings();

    // Check if redirected back from Google OAuth
    const params = new URLSearchParams(window.location.search);
    if (params.get('calendar_connected') === 'true') {
      setShowCalendarSuccess(true);
      // Clear URL params
      window.history.replaceState({}, '', '/settings');
      // Hide success message after 5 seconds
      setTimeout(() => setShowCalendarSuccess(false), 5000);
    }
  }, [user]);

  const loadUserSettings = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      if (data) {
        setUserData(data);
        setBusinessName(data.business_name || '');
        setPhoneNumber(data.phone_number || '');
        setVapiPhoneNumber(data.vapi_phone_number || '');
        setBookingLink(data.booking_link || '');
        setForwardAfterRings(data.forward_after_rings || 3);
        setAutoSmsEnabled(data.auto_sms_enabled ?? true);
        // Voice selection would be stored in vapi_assistant_id or a separate field
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    if (!user) return;

    try {
      setSaving(true);
      const { error } = await supabase
        .from('users')
        .update({
          business_name: businessName,
          phone_number: phoneNumber,
          vapi_phone_number: vapiPhoneNumber,
          booking_link: bookingLink,
          forward_after_rings: forwardAfterRings,
          auto_sms_enabled: autoSmsEnabled,
        })
        .eq('id', user.id);

      if (error) throw error;

      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleConnectGoogleCalendar = () => {
    if (!user) return;
    connectGoogleCalendar(user.id);
  };

  const handleDisconnectGoogleCalendar = async () => {
    if (!user) return;
    if (!confirm('Are you sure you want to disconnect Google Calendar?')) return;

    try {
      await disconnectGoogleCalendar(user.id);
      await loadUserSettings(); // Reload user data
      alert('Google Calendar disconnected successfully');
    } catch (error) {
      console.error('Error disconnecting calendar:', error);
      alert('Failed to disconnect Google Calendar');
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-96">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </AppLayout>
    );
  }

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

        {/* Voice AI Configuration */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Mic className="w-5 h-5" />
            Voice AI Configuration
          </h2>
          <Card variant="premium" className="p-6 space-y-6">
            {/* Phone Number Display */}
            <div>
              <Label htmlFor="vapiPhone" className="text-sm font-medium">
                Your AI Phone Number
              </Label>
              <div className="mt-2 flex items-center gap-3">
                <div className="flex-1 relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="vapiPhone"
                    value={vapiPhoneNumber}
                    onChange={(e) => setVapiPhoneNumber(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="pl-10"
                  />
                </div>
                <Badge variant="success">Active</Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                This is the number customers will call. Forward your existing number here.
              </p>
            </div>

            {/* Voice Selection */}
            <div>
              <Label className="text-sm font-medium mb-3 block">
                AI Voice
              </Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {VAPI_VOICES.map((voice) => (
                  <button
                    key={voice.id}
                    onClick={() => setSelectedVoice(voice.id)}
                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                      selectedVoice === voice.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-1">
                      <span className="font-medium text-foreground">{voice.name}</span>
                      <Badge variant="secondary" className="text-xs">
                        {voice.gender}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {voice.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Forward After Rings */}
            <div>
              <Label htmlFor="forwardRings" className="text-sm font-medium">
                Forward to AI After
              </Label>
              <div className="mt-2 flex items-center gap-3">
                <Input
                  id="forwardRings"
                  type="number"
                  min="0"
                  max="10"
                  value={forwardAfterRings}
                  onChange={(e) => setForwardAfterRings(parseInt(e.target.value))}
                  className="w-24"
                />
                <span className="text-sm text-muted-foreground">rings</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                If you don't answer after this many rings, AI takes over. Set to 0 for immediate AI answering.
              </p>
            </div>
          </Card>
        </motion.div>

        {/* Business Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Business Information
          </h2>
          <Card variant="premium" className="p-6 space-y-4">
            <div>
              <Label htmlFor="businessName">Business Name</Label>
              <Input
                id="businessName"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="Pristine Auto Detailing"
              />
            </div>

            <div>
              <Label htmlFor="phoneNumber">Your Phone Number</Label>
              <Input
                id="phoneNumber"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+1 (555) 123-4567"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Used for notifications and forwarding
              </p>
            </div>

            <div>
              <Label htmlFor="bookingLink">Booking Link</Label>
              <div className="relative">
                <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="bookingLink"
                  value={bookingLink}
                  onChange={(e) => setBookingLink(e.target.value)}
                  placeholder="https://calendly.com/your-business"
                  className="pl-10"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                AI will share this link when customers want to book
              </p>
            </div>

            <div className="pt-4">
              <Button
                onClick={saveSettings}
                disabled={saving}
                className="w-full sm:w-auto"
              >
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* Google Calendar Integration */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-8"
        >
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Google Calendar Integration
          </h2>

          {showCalendarSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-4 rounded-xl bg-green-500/10 border border-green-500/20"
            >
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <p className="text-sm font-medium text-green-600">
                  Google Calendar connected successfully!
                </p>
              </div>
            </motion.div>
          )}

          <Card variant="premium" className="p-6">
            {userData && isGoogleCalendarConnected(userData) ? (
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-xl bg-green-500/10 text-green-600">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Connected</h3>
                      <p className="text-sm text-muted-foreground mb-1">
                        Your Google Calendar is connected and syncing
                      </p>
                      {userData.google_calendar_email && (
                        <p className="text-xs text-muted-foreground">
                          Account: {userData.google_calendar_email}
                        </p>
                      )}
                      {userData.google_calendar_connected_at && (
                        <p className="text-xs text-muted-foreground">
                          Connected: {new Date(userData.google_calendar_connected_at).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                  <Badge variant="success">Active</Badge>
                </div>

                <div className="p-4 rounded-xl bg-secondary/50">
                  <h4 className="text-sm font-medium text-foreground mb-2">What's syncing:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Appointments booked by AI are added to your calendar</li>
                    <li>• AI checks your availability in real-time during calls</li>
                    <li>• Calendar events appear on your Calendar page</li>
                  </ul>
                </div>

                <Button
                  variant="outline"
                  onClick={handleDisconnectGoogleCalendar}
                  className="w-full sm:w-auto"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Disconnect Google Calendar
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-xl bg-secondary text-muted-foreground">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-2">
                      Connect Your Google Calendar
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Allow DetailPilotAI to sync appointments with your Google Calendar. Your AI receptionist will be able to check your real-time availability and book appointments directly.
                    </p>

                    <div className="p-4 rounded-xl bg-secondary/50 mb-4">
                      <h4 className="text-sm font-medium text-foreground mb-2">Benefits:</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>✓ AI checks your real availability during calls</li>
                        <li>✓ Automatic appointment booking to your calendar</li>
                        <li>✓ Two-way sync: updates flow both directions</li>
                        <li>✓ View all bookings in one place</li>
                      </ul>
                    </div>

                    <Button
                      variant="accent"
                      onClick={handleConnectGoogleCalendar}
                      className="w-full sm:w-auto"
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      Connect Google Calendar
                    </Button>

                    <p className="text-xs text-muted-foreground mt-3">
                      Optional: You can use DetailPilotAI without connecting Google Calendar. Appointments will still be tracked internally.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </motion.div>

        {/* General Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-lg font-semibold text-foreground mb-4">Advanced Settings</h2>
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
          transition={{ delay: 0.3 }}
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
          transition={{ delay: 0.4 }}
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
          transition={{ delay: 0.5 }}
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
