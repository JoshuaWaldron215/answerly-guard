import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Building2, 
  Phone, 
  Clock, 
  Wrench, 
  Link as LinkIcon,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  MapPin,
  Send,
  Sparkles
} from "lucide-react";

const steps = [
  { id: 1, title: "Business Basics", icon: Building2 },
  { id: 2, title: "Business Hours", icon: Clock },
  { id: 3, title: "Services & Area", icon: Wrench },
  { id: 4, title: "Booking Link", icon: LinkIcon },
  { id: 5, title: "Review & Test", icon: CheckCircle2 },
];

const services = [
  { id: "interior", label: "Interior Detail", description: "Vacuum, shampoo, leather care" },
  { id: "exterior", label: "Exterior Detail", description: "Wash, clay, polish, wax" },
  { id: "full", label: "Full Detail", description: "Complete interior + exterior" },
  { id: "ceramic", label: "Ceramic Coating", description: "Long-lasting protection" },
  { id: "ppf", label: "Paint Protection", description: "Film installation" },
];

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function Onboarding() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    businessName: "",
    phoneNumber: "",
    timezone: "America/New_York",
    hours: Object.fromEntries(days.map(day => [day, { enabled: day !== "Sunday", start: "09:00", end: "17:00" }])),
    afterHoursEnabled: true,
    selectedServices: ["exterior", "interior", "full"],
    serviceArea: "",
    bookingLink: "",
  });
  const [testSent, setTestSent] = useState(false);

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 5));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const handleComplete = () => {
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border px-4 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-orange-500 flex items-center justify-center">
              <Phone className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold text-foreground">Answerly</span>
          </div>
          <Badge variant="secondary" className="text-xs">
            ~2 minutes left
          </Badge>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="border-b border-border">
        <div className="max-w-3xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            {steps.map((step, idx) => (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                      currentStep >= step.id
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-muted-foreground"
                    }`}
                  >
                    {currentStep > step.id ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <step.icon className="w-5 h-5" />
                    )}
                  </div>
                  <span className={`text-xs mt-2 hidden sm:block ${
                    currentStep >= step.id ? "text-foreground" : "text-muted-foreground"
                  }`}>
                    {step.title}
                  </span>
                </div>
                {idx < steps.length - 1 && (
                  <div className={`w-12 sm:w-20 h-0.5 mx-2 transition-all duration-300 ${
                    currentStep > step.id ? "bg-primary" : "bg-border"
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <StepContent key="step1" title="Let's set up your business">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Business Name
                    </label>
                    <input
                      type="text"
                      value={formData.businessName}
                      onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                      placeholder="Pristine Auto Detailing"
                      className="w-full px-4 py-3 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Business Phone Number
                    </label>
                    <input
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                      placeholder="(555) 123-4567"
                      className="w-full px-4 py-3 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      This is the number Answerly will monitor for missed calls
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Timezone
                    </label>
                    <select
                      value={formData.timezone}
                      onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-card border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                    >
                      <option value="America/New_York">Eastern Time</option>
                      <option value="America/Chicago">Central Time</option>
                      <option value="America/Denver">Mountain Time</option>
                      <option value="America/Los_Angeles">Pacific Time</option>
                    </select>
                  </div>
                </div>
              </StepContent>
            )}

            {currentStep === 2 && (
              <StepContent key="step2" title="When are you available?">
                <div className="space-y-4">
                  {days.map((day) => (
                    <div 
                      key={day}
                      className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                        formData.hours[day].enabled 
                          ? "bg-card border-border" 
                          : "bg-secondary/30 border-transparent"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => setFormData({
                            ...formData,
                            hours: {
                              ...formData.hours,
                              [day]: { ...formData.hours[day], enabled: !formData.hours[day].enabled }
                            }
                          })}
                          className={`w-12 h-6 rounded-full transition-all relative ${
                            formData.hours[day].enabled ? "bg-primary" : "bg-muted"
                          }`}
                        >
                          <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${
                            formData.hours[day].enabled ? "left-7" : "left-1"
                          }`} />
                        </button>
                        <span className={`font-medium ${
                          formData.hours[day].enabled ? "text-foreground" : "text-muted-foreground"
                        }`}>
                          {day}
                        </span>
                      </div>
                      {formData.hours[day].enabled && (
                        <div className="flex items-center gap-2">
                          <input
                            type="time"
                            value={formData.hours[day].start}
                            onChange={(e) => setFormData({
                              ...formData,
                              hours: {
                                ...formData.hours,
                                [day]: { ...formData.hours[day], start: e.target.value }
                              }
                            })}
                            className="px-3 py-1.5 rounded-lg bg-background border border-border text-foreground text-sm"
                          />
                          <span className="text-muted-foreground">to</span>
                          <input
                            type="time"
                            value={formData.hours[day].end}
                            onChange={(e) => setFormData({
                              ...formData,
                              hours: {
                                ...formData.hours,
                                [day]: { ...formData.hours[day], end: e.target.value }
                              }
                            })}
                            className="px-3 py-1.5 rounded-lg bg-background border border-border text-foreground text-sm"
                          />
                        </div>
                      )}
                    </div>
                  ))}

                  <div className="mt-8 p-4 rounded-xl bg-primary/10 border border-primary/20">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-foreground">After-hours auto-response</h4>
                        <p className="text-sm text-muted-foreground">
                          Automatically respond to calls outside business hours
                        </p>
                      </div>
                      <button
                        onClick={() => setFormData({ ...formData, afterHoursEnabled: !formData.afterHoursEnabled })}
                        className={`w-12 h-6 rounded-full transition-all relative ${
                          formData.afterHoursEnabled ? "bg-primary" : "bg-muted"
                        }`}
                      >
                        <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${
                          formData.afterHoursEnabled ? "left-7" : "left-1"
                        }`} />
                      </button>
                    </div>
                  </div>
                </div>
              </StepContent>
            )}

            {currentStep === 3 && (
              <StepContent key="step3" title="What services do you offer?">
                <div className="space-y-6">
                  <div className="grid gap-3">
                    {services.map((service) => (
                      <button
                        key={service.id}
                        onClick={() => {
                          const selected = formData.selectedServices.includes(service.id)
                            ? formData.selectedServices.filter(s => s !== service.id)
                            : [...formData.selectedServices, service.id];
                          setFormData({ ...formData, selectedServices: selected });
                        }}
                        className={`p-4 rounded-xl border text-left transition-all ${
                          formData.selectedServices.includes(service.id)
                            ? "bg-primary/10 border-primary/30"
                            : "bg-card border-border hover:border-white/20"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-foreground">{service.label}</h4>
                            <p className="text-sm text-muted-foreground">{service.description}</p>
                          </div>
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                            formData.selectedServices.includes(service.id)
                              ? "border-primary bg-primary"
                              : "border-muted-foreground"
                          }`}>
                            {formData.selectedServices.includes(service.id) && (
                              <CheckCircle2 className="w-3 h-3 text-white" />
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      <MapPin className="w-4 h-4 inline mr-1" />
                      Service Area
                    </label>
                    <input
                      type="text"
                      value={formData.serviceArea}
                      onChange={(e) => setFormData({ ...formData, serviceArea: e.target.value })}
                      placeholder="Miami, Fort Lauderdale, Palm Beach"
                      className="w-full px-4 py-3 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      Cities or zip codes you serve. AI will reference this for inquiries.
                    </p>
                  </div>
                </div>
              </StepContent>
            )}

            {currentStep === 4 && (
              <StepContent key="step4" title="Add your booking link">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Booking URL (optional)
                    </label>
                    <input
                      type="url"
                      value={formData.bookingLink}
                      onChange={(e) => setFormData({ ...formData, bookingLink: e.target.value })}
                      placeholder="https://calendly.com/your-business"
                      className="w-full px-4 py-3 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      Calendly, Acuity, Square, or any booking page. We'll include this in auto-texts.
                    </p>
                  </div>

                  <Card variant="glass" className="p-6">
                    <h4 className="font-medium text-foreground mb-2">Preview</h4>
                    <div className="bg-background p-4 rounded-xl border border-border">
                      <p className="text-sm text-foreground">
                        Hi! Thanks for calling {formData.businessName || "Your Business"}. 
                        We missed your call but want to help! 
                        {formData.bookingLink && (
                          <> Book anytime: <span className="text-primary">{formData.bookingLink}</span></>
                        )}
                      </p>
                    </div>
                  </Card>

                  <button
                    onClick={() => nextStep()}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Skip for now →
                  </button>
                </div>
              </StepContent>
            )}

            {currentStep === 5 && (
              <StepContent key="step5" title="You're all set!">
                <div className="space-y-6">
                  <Card variant="premium" className="p-6">
                    <h4 className="font-medium text-foreground mb-4">Your auto-SMS preview</h4>
                    <div className="bg-background p-4 rounded-xl border border-border">
                      <p className="text-sm text-foreground leading-relaxed">
                        Hi! Thanks for calling {formData.businessName || "Your Business"}. 
                        Sorry we missed you — we're probably detailing a car right now! 🚗
                        {formData.bookingLink && (
                          <>
                            <br /><br />
                            Book your appointment anytime: <span className="text-primary break-all">{formData.bookingLink}</span>
                          </>
                        )}
                        <br /><br />
                        We'll get back to you ASAP!
                      </p>
                    </div>
                  </Card>

                  <Card variant="glass" className="p-6">
                    <h4 className="font-medium text-foreground mb-2">Test it out</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Send a test text to your phone to see exactly what callers receive.
                    </p>
                    <Button 
                      variant={testSent ? "secondary" : "accent"}
                      className="w-full"
                      onClick={() => setTestSent(true)}
                    >
                      {testSent ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          Test Sent!
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Send Test Text to My Phone
                        </>
                      )}
                    </Button>
                  </Card>

                  <div className="p-6 rounded-2xl bg-gradient-to-r from-success/10 to-primary/10 border border-success/20">
                    <div className="flex items-start gap-4">
                      <div className="p-2 rounded-xl bg-success/20">
                        <Sparkles className="w-6 h-6 text-success" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground mb-1">You're protected</h4>
                        <p className="text-sm text-muted-foreground">
                          Answerly will catch missed calls and follow up automatically. 
                          No more lost jobs.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </StepContent>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Footer Navigation */}
      <footer className="border-t border-border px-4 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={prevStep}
            disabled={currentStep === 1}
            className={currentStep === 1 ? "invisible" : ""}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          
          {currentStep < 5 ? (
            <Button variant="accent" onClick={nextStep}>
              Continue
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button variant="accent" onClick={handleComplete}>
              Go to Dashboard
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </footer>
    </div>
  );
}

function StepContent({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-2xl font-bold text-foreground mb-6">{title}</h2>
      {children}
    </motion.div>
  );
}
