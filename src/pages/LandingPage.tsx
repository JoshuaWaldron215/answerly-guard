import React, { useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
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
  Bell,
  TrendingUp,
  Users,
  DollarSign,
  X,
  Check,
  Sparkles,
  PhoneOff,
  PhoneIncoming,
  Timer,
  Target,
  Award,
  ChevronDown
} from "lucide-react";
// Dashboard preview - will use placeholder until image is added
const dashboardPreview = "/placeholder.svg";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

export default function LandingPage() {
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.15], [1, 0.95]);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass glass-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent to-orange-500 flex items-center justify-center shadow-lg">
                <Phone className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold text-foreground">Answerly</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">How It Works</a>
              <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
              <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
              <a href="#faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">FAQ</a>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" className="hidden sm:flex">Log In</Button>
              <Link to="/onboarding">
                <Button variant="accent" size="sm">
                  Start Free
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-28 pb-8 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Animated background gradients */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-1/4 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute top-40 right-1/4 w-[400px] h-[400px] bg-accent/15 rounded-full blur-[100px] animate-pulse animation-delay-500" />
        </div>
        
        <motion.div 
          className="max-w-7xl mx-auto relative"
          style={{ opacity: heroOpacity, scale: heroScale }}
        >
          <motion.div 
            className="text-center max-w-4xl mx-auto"
            initial="initial"
            animate="animate"
            variants={staggerContainer}
          >
            {/* Social proof badge */}
            <motion.div variants={fadeInUp} className="flex justify-center mb-6">
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-card border border-border">
                <div className="flex -space-x-2">
                  {[1,2,3,4].map((i) => (
                    <div key={i} className="w-7 h-7 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 border-2 border-background flex items-center justify-center">
                      <span className="text-[10px] font-medium text-foreground">{['MJ', 'DR', 'SK', 'TC'][i-1]}</span>
                    </div>
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  <span className="text-foreground font-semibold">500+</span> detailers recovering missed calls
                </span>
              </div>
            </motion.div>
            
            <motion.h1 
              className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-foreground leading-[1.1] mb-6 tracking-tight"
              variants={fadeInUp}
            >
              Stop Losing{" "}
              <span className="relative inline-block">
                <span className="text-gradient-primary">$2,400/month</span>
                <motion.div 
                  className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-primary to-accent rounded-full"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                />
              </span>
              <br />
              <span className="text-muted-foreground font-medium text-3xl sm:text-4xl lg:text-5xl">to Missed Calls</span>
            </motion.h1>
            
            <motion.p 
              className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8"
              variants={fadeInUp}
            >
              Every missed call costs you <span className="text-foreground font-medium">$150-300</span>. 
              Answerly texts back instantly, answers questions with AI, and books the job — 
              <span className="text-foreground font-medium"> while you're under the hood</span>.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8"
              variants={fadeInUp}
            >
              <Link to="/onboarding">
                <Button variant="hero" size="xl" className="w-full sm:w-auto text-base group">
                  Start 7-Day Free Trial
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Button variant="outline" size="xl" className="w-full sm:w-auto text-base">
                <Play className="w-4 h-4 mr-2" />
                Watch 2-min Demo
              </Button>
            </motion.div>

            {/* Trust badges */}
            <motion.div 
              className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground"
              variants={fadeInUp}
            >
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-success" />
                No credit card required
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-success" />
                Setup in 2 minutes
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-success" />
                Cancel anytime
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* Dashboard Preview - Full Width Showcase */}
      <section className="relative px-4 sm:px-6 lg:px-8 pb-20">
        <motion.div 
          className="max-w-6xl mx-auto"
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="relative">
            {/* Glow behind dashboard */}
            <div className="absolute -inset-4 bg-gradient-to-b from-primary/20 via-accent/10 to-transparent rounded-3xl blur-2xl" />
            
            {/* Browser chrome */}
            <div className="relative bg-card border border-border rounded-2xl overflow-hidden shadow-2xl">
              {/* Browser header */}
              <div className="flex items-center gap-2 px-4 py-3 bg-secondary/50 border-b border-border">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-destructive/50" />
                  <div className="w-3 h-3 rounded-full bg-warning/50" />
                  <div className="w-3 h-3 rounded-full bg-success/50" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="px-4 py-1 rounded-lg bg-background/80 text-xs text-muted-foreground">
                    app.answerly.io/dashboard
                  </div>
                </div>
              </div>
              
              {/* Dashboard screenshot */}
              <img 
                src={dashboardPreview} 
                alt="Answerly Command Center Dashboard" 
                className="w-full"
              />
              
              {/* Video placeholder overlay - for future video */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer bg-background/50 backdrop-blur-sm">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-20 h-20 rounded-full bg-accent flex items-center justify-center shadow-lg shadow-accent/30">
                    <Play className="w-8 h-8 text-white ml-1" />
                  </div>
                  <span className="text-foreground font-medium">Watch Demo Video</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Stats Bar */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 border-y border-border bg-card/50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatItem value="71%" label="Average recovery rate" icon={<TrendingUp className="w-5 h-5" />} />
            <StatItem value="< 5s" label="Response time" icon={<Timer className="w-5 h-5" />} />
            <StatItem value="$540" label="Avg revenue recovered/week" icon={<DollarSign className="w-5 h-5" />} />
            <StatItem value="24/7" label="Always-on coverage" icon={<Clock className="w-5 h-5" />} />
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Badge variant="outline" className="mb-4 px-4 py-1.5">
              <PhoneOff className="w-3 h-3 mr-1.5" />
              The Problem
            </Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Right Now, You're Losing Jobs
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Every time your phone rings while you're detailing, you face an impossible choice.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            <ProblemCard
              icon={<PhoneOff className="w-6 h-6" />}
              stat="5-8"
              label="Missed calls per week"
              description="You can't answer while you're waxing a hood or cleaning an interior."
              delay={0}
            />
            <ProblemCard
              icon={<DollarSign className="w-6 h-6" />}
              stat="$150-300"
              label="Lost per missed call"
              description="That's a detail job walking to your competitor down the street."
              delay={0.1}
            />
            <ProblemCard
              icon={<Users className="w-6 h-6" />}
              stat="80%"
              label="Won't leave a voicemail"
              description="They'll just call the next detailer on Google instead."
              delay={0.2}
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent via-card/50 to-transparent">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Badge variant="outline" className="mb-4 px-4 py-1.5">
              <Sparkles className="w-3 h-3 mr-1.5" />
              How It Works
            </Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Never Miss Another Job
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Answerly works in the background while you focus on what you do best.
            </p>
          </motion.div>

          <div className="relative">
            {/* Connection line */}
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-border to-transparent -translate-y-1/2" />
            
            <div className="grid md:grid-cols-4 gap-8">
              <StepCard
                number="1"
                icon={<PhoneIncoming className="w-6 h-6" />}
                title="Call Comes In"
                description="You're busy detailing. The call goes to voicemail."
                delay={0}
              />
              <StepCard
                number="2"
                icon={<MessageSquare className="w-6 h-6" />}
                title="Instant Text"
                description="Within 5 seconds, they get your custom message."
                delay={0.1}
                highlighted
              />
              <StepCard
                number="3"
                icon={<Bot className="w-6 h-6" />}
                title="AI Answers"
                description="Questions about pricing? Hours? AI handles it."
                delay={0.2}
                badge="Pro"
              />
              <StepCard
                number="4"
                icon={<Calendar className="w-6 h-6" />}
                title="Job Booked"
                description="They book directly. You see it in your dashboard."
                delay={0.3}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Badge variant="outline" className="mb-4 px-4 py-1.5">
              <Target className="w-3 h-3 mr-1.5" />
              Features
            </Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Everything You Need to Capture Every Lead
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={<Zap className="w-6 h-6" />}
              title="Instant SMS Follow-up"
              description="Custom text message sent within seconds of a missed call."
              delay={0}
            />
            <FeatureCard
              icon={<Calendar className="w-6 h-6" />}
              title="Booking Link Included"
              description="Your calendar link goes with every message. Easy self-booking."
              delay={0.1}
            />
            <FeatureCard
              icon={<Bot className="w-6 h-6" />}
              title="AI FAQ Answering"
              description="Handle pricing questions, hours, and service area automatically."
              badge="Pro"
              delay={0.2}
            />
            <FeatureCard
              icon={<BarChart3 className="w-6 h-6" />}
              title="Command Center"
              description="See every lead, every conversation, every booking in one place."
              delay={0.3}
            />
            <FeatureCard
              icon={<Bell className="w-6 h-6" />}
              title="Smart Notifications"
              description="Know when high-intent leads need your attention."
              delay={0.4}
            />
            <FeatureCard
              icon={<Shield className="w-6 h-6" />}
              title="Known Caller Filter"
              description="Family and vendors? Never auto-texted. You're in control."
              delay={0.5}
            />
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent via-card/50 to-transparent">
        <div className="max-w-5xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Without Answerly vs. With Answerly
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            <ComparisonCard
              title="Without Answerly"
              isNegative
              items={[
                "Missed calls go to voicemail (80% don't leave one)",
                "Leads call your competitors instead",
                "You stress about missing calls while working",
                "No idea how many jobs you're losing",
                "Manually texting back hours later"
              ]}
            />
            <ComparisonCard
              title="With Answerly"
              items={[
                "Every missed call gets an instant text back",
                "Leads book directly from your message",
                "Work stress-free knowing leads are handled",
                "Dashboard shows exactly what's happening",
                "AI handles common questions for you"
              ]}
            />
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Badge variant="outline" className="mb-4 px-4 py-1.5">
              <Award className="w-3 h-3 mr-1.5" />
              Simple Pricing
            </Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Pay Less Than One Lost Job
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Answerly pays for itself after recovering just one job per month.
            </p>
          </motion.div>

          {/* Single Pro Plan */}
          <motion.div
            className="max-w-lg mx-auto mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card className="relative p-8 bg-card border-2 border-primary/50 overflow-hidden">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5" />
              
              <div className="relative">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-foreground mb-1">PRO</h3>
                  <p className="text-muted-foreground">Everything Included</p>
                </div>

                <div className="text-center mb-8">
                  <span className="text-5xl font-bold text-foreground">$149</span>
                  <span className="text-muted-foreground">/mo</span>
                </div>

                <div className="space-y-4 mb-8">
                  <PricingFeature 
                    title="AI answers every call 24/7" 
                    description="Sounds natural, picks up in 2 seconds" 
                  />
                  <PricingFeature 
                    title="Collects booking information" 
                    description="Name, phone, vehicle, service, preferred date" 
                  />
                  <PricingFeature 
                    title="Instant lead notifications" 
                    description="Text + email with details within seconds" 
                  />
                  <PricingFeature 
                    title="Call recordings & transcripts" 
                    description="Listen to every call, read transcripts" 
                  />
                  <PricingFeature 
                    title="Lead dashboard" 
                    description="Track leads, mark contacted/booked" 
                  />
                  <PricingFeature 
                    title="Known caller filter" 
                    description="Family/friends bypass AI (optional)" 
                  />
                  <PricingFeature 
                    title="Unlimited calls" 
                    description="No per-call fees, no hidden costs" 
                  />
                  <PricingFeature 
                    title="Cancel anytime" 
                    description="No contract, no commitments" 
                  />
                </div>

                <Link to="/onboarding" className="block">
                  <Button variant="hero" size="lg" className="w-full text-base group">
                    Start 7-Day Free Trial
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>

                <div className="flex flex-wrap items-center justify-center gap-4 mt-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-success" />
                    No credit card required
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-success" />
                    Setup in 2 minutes
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-success" />
                    Cancel anytime
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Founding Member Offer */}
          <motion.div
            className="max-w-lg mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <Card className="relative p-8 bg-gradient-to-br from-accent/10 via-card to-orange-500/10 border-2 border-accent/50 overflow-hidden">
              {/* Fire decorations */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl">🔥</div>
              
              <div className="relative text-center">
                <div className="inline-flex items-center gap-2 mb-2">
                  <span className="text-xl">🔥</span>
                  <span className="text-lg font-bold text-foreground">Founding Member Offer</span>
                  <span className="text-xl">🔥</span>
                </div>
                <p className="text-sm text-muted-foreground mb-6">Limited Time</p>

                <p className="text-foreground mb-4">
                  First 20 customers get lifetime founding member pricing
                </p>

                <div className="mb-4">
                  <span className="text-4xl font-bold text-accent">$99</span>
                  <span className="text-foreground font-semibold">/month forever</span>
                </div>

                <p className="text-success font-medium mb-2">(Save $50 every month)</p>
                <p className="text-sm text-muted-foreground mb-6">
                  Regular price: <span className="line-through">$149/month</span>
                </p>

                <div className="bg-background/50 rounded-lg p-3 mb-6">
                  <p className="text-foreground font-semibold">Spots remaining: <span className="text-accent">15/20</span></p>
                </div>

                <Link to="/onboarding" className="block">
                  <Button variant="accent" size="lg" className="w-full text-base group">
                    Lock In $99/mo Rate
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>

                <p className="text-sm text-muted-foreground mt-4 flex items-center justify-center gap-1">
                  <Clock className="w-4 h-4" />
                  Offer expires when all 20 spots are filled
                </p>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent via-card/50 to-transparent">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Badge variant="outline" className="mb-4 px-4 py-1.5">
              <Star className="w-3 h-3 mr-1.5 fill-current" />
              Testimonials
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Detailers Love Answerly
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            <TestimonialCard
              quote="Recovered 3 jobs in my first week. That's over $400 that would've walked. The ROI is insane."
              author="Marcus J."
              business="Pristine Auto Detailing"
              stat="3 jobs recovered"
              delay={0}
            />
            <TestimonialCard
              quote="The AI answering is a game-changer. It handles all those 'how much for an SUV?' texts while I work."
              author="David R."
              business="Shine Mobile Detail"
              stat="71% recovery rate"
              delay={0.1}
            />
            <TestimonialCard
              quote="Setup took literally 5 minutes. Now I don't stress about my phone while detailing. Life-changing."
              author="Sarah K."
              business="Fresh Start Detailing"
              stat="$540/week recovered"
              delay={0.2}
            />
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 px-4 sm:px-6 lg:px-8">
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
              answer="Within 5 seconds. The moment a call goes to voicemail, Answerly sends your custom message."
            />
            <FAQItem 
              question="What if I want to cancel?"
              answer="Cancel anytime with one click. No contracts, no hidden fees, no hassle. Your data is yours."
            />
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-card to-accent/10 border border-border p-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
            
            <div className="relative">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
                Stop Losing Jobs Today
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
                Every day without Answerly is another 5-8 potential jobs walking to your competition. 
                Start your free trial now.
              </p>
              <Link to="/onboarding">
                <Button variant="hero" size="xl" className="text-base group">
                  Start 7-Day Free Trial
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <p className="text-sm text-muted-foreground mt-4">
                No credit card required • Setup in 2 minutes
              </p>
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
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms</a>
            <a href="#" className="hover:text-foreground transition-colors">Contact</a>
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
function StatItem({ value, label, icon }: { value: string; label: string; icon: React.ReactNode }) {
  return (
    <motion.div 
      className="text-center"
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <div className="flex justify-center mb-2 text-primary">{icon}</div>
      <div className="text-2xl sm:text-3xl font-bold text-foreground mb-1">{value}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </motion.div>
  );
}

function ProblemCard({ icon, stat, label, description, delay }: {
  icon: React.ReactNode;
  stat: string;
  label: string;
  description: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
    >
      <Card className="p-6 bg-destructive/5 border-destructive/20 h-full">
        <div className="p-2 rounded-lg bg-destructive/10 text-destructive w-fit mb-4">
          {icon}
        </div>
        <div className="text-3xl font-bold text-foreground mb-1">{stat}</div>
        <div className="text-sm text-muted-foreground mb-3">{label}</div>
        <p className="text-foreground">{description}</p>
      </Card>
    </motion.div>
  );
}

function StepCard({ number, icon, title, description, delay, highlighted, badge }: {
  number: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
  highlighted?: boolean;
  badge?: string;
}) {
  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
    >
      <Card className={`p-6 h-full text-center relative ${highlighted ? 'border-primary/50 bg-primary/5' : ''}`}>
        {badge && (
          <Badge variant="warning" className="absolute -top-2 -right-2 text-xs">
            {badge}
          </Badge>
        )}
        <div className="w-8 h-8 rounded-full bg-secondary text-foreground text-sm font-bold flex items-center justify-center mx-auto mb-4">
          {number}
        </div>
        <div className={`p-3 rounded-xl mx-auto w-fit mb-4 ${highlighted ? 'bg-primary/20 text-primary' : 'bg-secondary text-muted-foreground'}`}>
          {icon}
        </div>
        <h3 className="font-semibold text-foreground mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </Card>
    </motion.div>
  );
}

function FeatureCard({ icon, title, description, badge, delay }: {
  icon: React.ReactNode;
  title: string;
  description: string;
  badge?: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
    >
      <Card className="p-6 h-full card-hover group">
        <div className="flex items-start justify-between mb-4">
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
            {icon}
          </div>
          {badge && <Badge variant="warning" className="text-xs">{badge}</Badge>}
        </div>
        <h3 className="font-semibold text-foreground mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </Card>
    </motion.div>
  );
}

function ComparisonCard({ title, items, isNegative }: {
  title: string;
  items: string[];
  isNegative?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <Card className={`p-8 h-full ${isNegative ? 'bg-destructive/5 border-destructive/20' : 'bg-success/5 border-success/20'}`}>
        <h3 className={`text-xl font-semibold mb-6 ${isNegative ? 'text-destructive' : 'text-success'}`}>
          {title}
        </h3>
        <ul className="space-y-4">
          {items.map((item, i) => (
            <li key={i} className="flex items-start gap-3">
              {isNegative ? (
                <X className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
              ) : (
                <Check className="w-5 h-5 text-success shrink-0 mt-0.5" />
              )}
              <span className="text-foreground">{item}</span>
            </li>
          ))}
        </ul>
      </Card>
    </motion.div>
  );
}

function PricingFeature({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex items-start gap-3">
      <CheckCircle2 className="w-5 h-5 text-success shrink-0 mt-0.5" />
      <div>
        <p className="text-foreground font-medium">{title}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
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
        className={`p-8 relative h-full ${popular ? 'border-primary/50 shadow-lg shadow-primary/10' : ''}`}
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
          <span className="text-5xl font-bold text-foreground">${price}</span>
          <span className="text-muted-foreground">/mo</span>
        </div>
        <ul className="space-y-3 mb-8">
          {features.map((feature, i) => (
            <li key={i} className="flex items-start gap-3 text-sm">
              <CheckCircle2 className="w-4 h-4 text-success mt-0.5 shrink-0" />
              <span className="text-foreground">{feature}</span>
            </li>
          ))}
        </ul>
        <Link to="/onboarding">
          <Button 
            variant={popular ? "accent" : "secondary"} 
            className="w-full"
            size="lg"
          >
            Start Free Trial
          </Button>
        </Link>
      </Card>
    </motion.div>
  );
}

function TestimonialCard({ quote, author, business, stat, delay }: {
  quote: string;
  author: string;
  business: string;
  stat: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
    >
      <Card className="p-6 h-full flex flex-col">
        <div className="flex gap-1 mb-4">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-4 h-4 fill-accent text-accent" />
          ))}
        </div>
        <p className="text-foreground mb-6 flex-1">"{quote}"</p>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-foreground">{author}</p>
            <p className="text-sm text-muted-foreground">{business}</p>
          </div>
          <Badge variant="success" className="text-xs">{stat}</Badge>
        </div>
      </Card>
    </motion.div>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <Card className="overflow-hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full p-6 text-left flex items-center justify-between hover:bg-secondary/50 transition-colors"
        >
          <span className="font-semibold text-foreground pr-4">{question}</span>
          <motion.span
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="text-muted-foreground shrink-0"
          >
            <ChevronDown className="w-5 h-5" />
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
