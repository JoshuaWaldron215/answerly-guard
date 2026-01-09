import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Phone, 
  MessageSquare, 
  Calendar, 
  BarChart3, 
  Clock, 
  Shield, 
  Zap, 
  CheckCircle2,
  ArrowRight,
  Star,
  Play,
  Bot,
  Bell
} from "lucide-react";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass glass-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-orange-500 flex items-center justify-center">
                <Phone className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold text-foreground">Answerly</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</a>
              <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
              <a href="#faq" className="text-muted-foreground hover:text-foreground transition-colors">FAQ</a>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm">Log In</Button>
              <Link to="/onboarding">
                <Button variant="accent" size="sm">Start Free Trial</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-b from-primary/20 via-primary/5 to-transparent rounded-full blur-3xl" />
        
        <div className="max-w-7xl mx-auto relative">
          <motion.div 
            className="text-center max-w-4xl mx-auto"
            initial="initial"
            animate="animate"
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp}>
              <Badge variant="default" className="mb-6 px-4 py-1.5">
                <Zap className="w-3 h-3 mr-1" />
                AI-Powered Virtual Receptionist
              </Badge>
            </motion.div>
            
            <motion.h1 
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6"
              variants={fadeInUp}
            >
              Never Miss a Job Because{" "}
              <span className="text-gradient-primary">You Missed a Call</span>
            </motion.h1>
            
            <motion.p 
              className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
              variants={fadeInUp}
            >
              Answerly texts missed callers instantly, answers quick questions, 
              and sends a booking link — automatically.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
              variants={fadeInUp}
            >
              <Link to="/onboarding">
                <Button variant="hero" size="xl" className="w-full sm:w-auto">
                  Start Free Trial
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Button variant="outline" size="xl" className="w-full sm:w-auto">
                <Play className="w-4 h-4 mr-2" />
                See How It Works
              </Button>
            </motion.div>
          </motion.div>

          {/* Animated Flow Visual */}
          <motion.div 
            className="mt-20 relative"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
              <FlowStep 
                icon={<Phone className="w-6 h-6" />}
                title="Missed Call"
                subtitle="You're busy working"
                delay={0}
              />
              <FlowArrow />
              <FlowStep 
                icon={<MessageSquare className="w-6 h-6" />}
                title="Instant SMS"
                subtitle="Automatic response"
                delay={0.1}
                highlighted
              />
              <FlowArrow />
              <FlowStep 
                icon={<Calendar className="w-6 h-6" />}
                title="Booking Link"
                subtitle="Or AI answers FAQs"
                delay={0.2}
              />
              <FlowArrow />
              <FlowStep 
                icon={<BarChart3 className="w-6 h-6" />}
                title="Dashboard Log"
                subtitle="Track every lead"
                delay={0.3}
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Built for Busy Business Owners
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Stop losing jobs to missed calls. Answerly works 24/7 so you can focus on the work.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <BenefitCard
              icon={<Zap className="w-8 h-8" />}
              title="Recover Lost Jobs"
              description="Instant missed-call follow-up texts ensure no lead slips through. Send your booking link automatically."
              features={["Auto-text within seconds", "Custom booking link", "Lead capture"]}
              delay={0}
            />
            <BenefitCard
              icon={<Clock className="w-8 h-8" />}
              title="Save Time"
              description="AI handles common questions about your services, pricing ranges, and service area — so you don't have to."
              features={["AI-powered FAQs", "After-hours coverage", "Smart escalation"]}
              delay={0.1}
              badge="Pro"
            />
            <BenefitCard
              icon={<Shield className="w-8 h-8" />}
              title="Stay Organized"
              description="Every interaction logged and summarized. Know what happened and what to do next at a glance."
              features={["Conversation history", "AI summaries", "Follow-up reminders"]}
              delay={0.2}
            />
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent via-card/50 to-transparent">
        <div className="max-w-5xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-lg text-muted-foreground">
              No hidden fees. Cancel anytime.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <PricingCard
              name="Starter"
              price="99"
              description="Essential missed-call recovery"
              features={[
                "Missed-call SMS follow-up",
                "Booking link sent automatically",
                "Lead capture + conversation log",
                "Voicemail transcription + AI summary",
                "Simple recovered leads dashboard"
              ]}
              delay={0}
            />
            <PricingCard
              name="Pro"
              price="149"
              description="Full AI receptionist power"
              features={[
                "Everything in Starter",
                "Controlled AI call answering",
                "AI answers common FAQs",
                "Auto confirmations + reminders",
                "\"What should I do next?\" assistant"
              ]}
              popular
              delay={0.1}
            />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Loved by Mobile Detailers
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <TestimonialCard
              quote="I was losing 5-6 jobs a week from missed calls. Now I catch almost all of them. Paid for itself in the first week."
              author="Marcus J."
              role="Pristine Auto Detailing"
              delay={0}
            />
            <TestimonialCard
              quote="The AI answering is incredible. It handles all those 'how much for an SUV?' questions while I'm under the hood."
              author="David R."
              role="Shine Mobile Detail"
              delay={0.1}
            />
            <TestimonialCard
              quote="Finally, a tool that just works. Setup took 5 minutes and I haven't touched it since. Love the dashboard."
              author="Sarah K."
              role="Fresh Start Detailing"
              delay={0.2}
            />
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent via-card/30 to-transparent">
        <div className="max-w-3xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Frequently Asked Questions
            </h2>
          </motion.div>

          <div className="space-y-4">
            <FAQItem 
              question="Will it text my friends and family?"
              answer="No. Answerly only texts callers who you missed while busy. You can also add known numbers (family, vendors) to a 'never auto-text' list."
            />
            <FAQItem 
              question="Does it replace my phone?"
              answer="Not at all. Answerly works alongside your existing phone. When you miss a call, it steps in to follow up automatically."
            />
            <FAQItem 
              question="Can I turn AI off?"
              answer="Absolutely. AI call answering is a Pro feature you can toggle on/off anytime. Starter plan uses SMS only."
            />
            <FAQItem 
              question="How fast does it respond?"
              answer="Within seconds. The moment a call goes to voicemail, Answerly sends your custom message."
            />
            <FAQItem 
              question="Is pricing transparent?"
              answer="Yes. What you see is what you pay. No per-text fees, no surprise charges. Just a simple monthly subscription."
            />
          </div>
        </div>
      </section>

      {/* Contact / CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Ready to Stop Missing Jobs?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Set up in 2 minutes. Start catching missed calls today.
            </p>
            <Link to="/onboarding">
              <Button variant="hero" size="xl">
                Start Free Trial
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>

            <div className="mt-16 p-8 rounded-2xl border border-border bg-card/50">
              <h3 className="text-xl font-semibold text-foreground mb-4">Have Questions?</h3>
              <p className="text-muted-foreground mb-6">
                We'd love to hear from you. Drop us a line.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input 
                  type="email" 
                  placeholder="your@email.com"
                  className="flex-1 px-4 py-3 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <Button variant="secondary">Send Message</Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-border">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-orange-500 flex items-center justify-center">
              <Phone className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-foreground">Answerly</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2025 Answerly.io. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

// Component helpers
function FlowStep({ icon, title, subtitle, delay, highlighted }: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  delay: number;
  highlighted?: boolean;
}) {
  return (
    <motion.div
      className={`flex flex-col items-center p-6 rounded-2xl ${
        highlighted 
          ? 'bg-gradient-to-b from-primary/20 to-primary/5 border border-primary/30' 
          : 'bg-card border border-border'
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 + delay, duration: 0.4 }}
    >
      <div className={`p-3 rounded-xl mb-3 ${highlighted ? 'bg-primary/20 text-primary' : 'bg-secondary text-muted-foreground'}`}>
        {icon}
      </div>
      <h3 className="font-semibold text-foreground">{title}</h3>
      <p className="text-sm text-muted-foreground">{subtitle}</p>
    </motion.div>
  );
}

function FlowArrow() {
  return (
    <div className="hidden md:block text-muted-foreground">
      <ArrowRight className="w-6 h-6" />
    </div>
  );
}

function BenefitCard({ icon, title, description, features, delay, badge }: {
  icon: React.ReactNode;
  title: string;
  description: string;
  features: string[];
  delay: number;
  badge?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
    >
      <Card variant="premium" className="p-8 h-full card-hover">
        <div className="flex items-start justify-between mb-4">
          <div className="p-3 rounded-xl bg-primary/10 text-primary">
            {icon}
          </div>
          {badge && <Badge variant="warning">{badge}</Badge>}
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">{title}</h3>
        <p className="text-muted-foreground mb-6">{description}</p>
        <ul className="space-y-2">
          {features.map((feature, i) => (
            <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle2 className="w-4 h-4 text-success" />
              {feature}
            </li>
          ))}
        </ul>
      </Card>
    </motion.div>
  );
}

function PricingCard({ name, price, description, features, popular, delay }: {
  name: string;
  price: string;
  description: string;
  features: string[];
  popular?: boolean;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
    >
      <Card 
        variant="premium" 
        className={`p-8 relative ${popular ? 'border-primary/50 shadow-glow' : ''}`}
      >
        {popular && (
          <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-accent to-orange-500 text-white border-0">
            Most Popular
          </Badge>
        )}
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-foreground mb-1">{name}</h3>
          <p className="text-muted-foreground">{description}</p>
        </div>
        <div className="mb-6">
          <span className="text-4xl font-bold text-foreground">${price}</span>
          <span className="text-muted-foreground">/mo</span>
        </div>
        <ul className="space-y-3 mb-8">
          {features.map((feature, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
              <CheckCircle2 className="w-4 h-4 text-success mt-0.5 shrink-0" />
              {feature}
            </li>
          ))}
        </ul>
        <Link to="/onboarding">
          <Button 
            variant={popular ? "accent" : "secondary"} 
            className="w-full"
            size="lg"
          >
            Get Started
          </Button>
        </Link>
      </Card>
    </motion.div>
  );
}

function TestimonialCard({ quote, author, role, delay }: {
  quote: string;
  author: string;
  role: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
    >
      <Card variant="premium" className="p-6 h-full">
        <div className="flex gap-1 mb-4">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-4 h-4 fill-accent text-accent" />
          ))}
        </div>
        <p className="text-foreground mb-6">"{quote}"</p>
        <div>
          <p className="font-semibold text-foreground">{author}</p>
          <p className="text-sm text-muted-foreground">{role}</p>
        </div>
      </Card>
    </motion.div>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = React.useState(false);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <Card variant="premium" className="overflow-hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full p-6 text-left flex items-center justify-between"
        >
          <span className="font-semibold text-foreground">{question}</span>
          <motion.span
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="text-muted-foreground"
          >
            <ArrowRight className="w-4 h-4 rotate-90" />
          </motion.span>
        </button>
        <motion.div
          initial={false}
          animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
          transition={{ duration: 0.2 }}
          className="overflow-hidden"
        >
          <p className="px-6 pb-6 text-muted-foreground">{answer}</p>
        </motion.div>
      </Card>
    </motion.div>
  );
}
