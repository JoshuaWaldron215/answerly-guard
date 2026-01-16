import React, { useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import VoiceDemo from "@/components/VoiceDemo";
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
              <span className="text-xl font-bold text-foreground">DetailPilotAI</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">How It Works</a>
              <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
              <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
              <a href="#faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">FAQ</a>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/login">
                <Button variant="ghost" size="sm" className="hidden sm:flex">Log In</Button>
              </Link>
              <Link to="/signup">
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
      <section className="relative pt-28 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Animated background gradients */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-1/4 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute top-40 right-1/4 w-[400px] h-[400px] bg-accent/15 rounded-full blur-[100px] animate-pulse animation-delay-500" />
        </div>

        <motion.div
          className="max-w-7xl mx-auto relative"
          style={{ opacity: heroOpacity, scale: heroScale }}
        >
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: Hero Content */}
            <motion.div
              className="text-center lg:text-left"
              initial="initial"
              animate="animate"
              variants={staggerContainer}
            >
              {/* Social proof badge */}
              <motion.div variants={fadeInUp} className="flex justify-center lg:justify-start mb-6">
                <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-accent/10 border border-accent/20">
                  <div className="flex -space-x-2">
                    {[1,2,3,4].map((i) => (
                      <div key={i} className="w-7 h-7 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 border-2 border-background flex items-center justify-center">
                        <span className="text-[10px] font-medium text-foreground">{['MJ', 'DR', 'SK', 'TC'][i-1]}</span>
                      </div>
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    <span className="text-foreground font-semibold">500+ detailing shops</span> never miss calls
                  </span>
                </div>
              </motion.div>

              <motion.h1
                className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-foreground leading-[1.1] mb-6 tracking-tight"
                variants={fadeInUp}
              >
                Your Phone Rings.{" "}
                <span className="relative inline-block">
                  <span className="text-gradient-primary">You're Waxing</span>
                  <motion.div
                    className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-primary to-accent rounded-full"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                  />
                </span>
                <br />
                <span className="text-muted-foreground font-semibold text-3xl sm:text-4xl lg:text-5xl">We Book the Detail.</span>
              </motion.h1>

              <motion.p
                className="text-lg sm:text-xl text-muted-foreground mb-8 leading-relaxed"
                variants={fadeInUp}
              >
                AI-powered receptionist built specifically for auto detailers. <span className="text-foreground font-semibold">Answers calls, qualifies leads, books appointments</span> — while you're polishing that G-Wagon.
              </motion.p>

              <motion.div
                className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-8"
                variants={fadeInUp}
              >
                <Link to="/signup">
                  <Button variant="hero" size="xl" className="w-full sm:w-auto text-base group shadow-2xl shadow-accent/20">
                    Start Free Trial
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="flex -space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                    ))}
                  </div>
                  <span className="font-medium">4.9/5 from 200+ detail shops</span>
                </div>
              </motion.div>

              {/* Trust badges */}
              <motion.div
                className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-sm text-muted-foreground"
                variants={fadeInUp}
              >
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-success" />
                  No credit card required
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-success" />
                  2-min setup
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-success" />
                  Cancel anytime
                </div>
              </motion.div>
            </motion.div>

            {/* Right: Compact Voice Demo */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="hidden lg:block"
            >
              <div className="relative">
                {/* Decorative glow */}
                <div className="absolute -inset-4 bg-gradient-to-tr from-primary/20 via-accent/20 to-transparent rounded-3xl blur-3xl" />

                {/* Compact demo card */}
                <Card className="relative border-2 border-primary/20 bg-card/95 backdrop-blur-xl p-6 shadow-2xl">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-primary/10">
                        <Phone className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">Try Our AI Now</h3>
                        <p className="text-sm text-muted-foreground">Talk to the AI receptionist</p>
                      </div>
                    </div>

                    {/* Mini voice demo */}
                    <VoiceDemo compact />
                  </div>
                </Card>
              </div>
            </motion.div>
          </div>
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
                alt="DetailPilotAI Command Center Dashboard" 
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
      <section className="py-12 px-4 sm:px-6 lg:px-8 border-y border-border bg-gradient-to-r from-card/50 via-accent/5 to-card/50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatItem value="71%" label="Leads captured" icon={<TrendingUp className="w-5 h-5" />} />
            <StatItem value="2 sec" label="AI answers in" icon={<Timer className="w-5 h-5" />} />
            <StatItem value="$680" label="Avg recovered/week" icon={<DollarSign className="w-5 h-5" />} />
            <StatItem value="24/7" label="Never miss a detail" icon={<Clock className="w-5 h-5" />} />
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent via-accent/5 to-transparent">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Badge variant="outline" className="mb-4 px-4 py-1.5">
              <PhoneOff className="w-3 h-3 mr-1.5" />
              Sound Familiar?
            </Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              The Detail Shop Dilemma
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              You're 3 hours into a paint correction. Phone rings. Do you strip off gloves and risk contamination, or let a $250 ceramic coating walk?
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            <ProblemCard
              icon={<PhoneOff className="w-6 h-6" />}
              stat="5-8"
              label="Missed calls per week"
              description="Hands covered in polish? Can't answer during a 6-hour detail job."
              delay={0}
            />
            <ProblemCard
              icon={<DollarSign className="w-6 h-6" />}
              stat="$150-300"
              label="Per missed detail"
              description="That was a full interior + ceramic coating. Now it's at Shine Pro down the street."
              delay={0.1}
            />
            <ProblemCard
              icon={<Users className="w-6 h-6" />}
              stat="80%"
              label="Won't leave voicemail"
              description="They Google 'car detailing near me' and call the next shop in 30 seconds."
              delay={0.2}
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 px-4 sm:px-6 lg:px-8">
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
              Keep Detailing. We'll Handle the Phone.
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our AI understands detailing. Knows your services. Books the jobs. You keep polishing.
            </p>
          </motion.div>

          <div className="relative">
            {/* Connection line */}
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-border to-transparent -translate-y-1/2" />

            <div className="grid md:grid-cols-4 gap-8">
              <StepCard
                number="1"
                icon={<PhoneIncoming className="w-6 h-6" />}
                title="Customer Calls"
                description="Phone rings while you're doing a stage 2 paint correction."
                delay={0}
              />
              <StepCard
                number="2"
                icon={<Bot className="w-6 h-6" />}
                title="AI Answers"
                description="Picks up in 2 seconds. Sounds human. Knows your services & pricing."
                delay={0.1}
                highlighted
                badge="Pro"
              />
              <StepCard
                number="3"
                icon={<MessageSquare className="w-6 h-6" />}
                title="Collects Info"
                description="Name, car type, service needed, when they want it done."
                delay={0.2}
              />
              <StepCard
                number="4"
                icon={<Calendar className="w-6 h-6" />}
                title="Lead in Dashboard"
                description="Full details + recording waiting for you. Book it when you're done."
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
              icon={<Bot className="w-6 h-6" />}
              title="Answers Like a Detailer"
              description="Trained on detailing lingo. Knows ceramic coating from wax. Explains packages clearly."
              badge="Pro"
              delay={0}
            />
            <FeatureCard
              icon={<Calendar className="w-6 h-6" />}
              title="Books Appointments"
              description="Collects car type, service needed, preferred date. Sends you qualified leads instantly."
              delay={0.1}
            />
            <FeatureCard
              icon={<MessageSquare className="w-6 h-6" />}
              title="Handles Common Questions"
              description="'How much for SUV interior?' 'Do you do paint correction?' AI answers based on your pricing."
              delay={0.2}
            />
            <FeatureCard
              icon={<BarChart3 className="w-6 h-6" />}
              title="Detailer Dashboard"
              description="See every lead with car details, service requested, and full call recording."
              delay={0.3}
            />
            <FeatureCard
              icon={<Shield className="w-6 h-6" />}
              title="Smart Caller ID"
              description="Regular customers and vendors bypass AI. New leads get the full treatment."
              delay={0.4}
            />
            <FeatureCard
              icon={<Bell className="w-6 h-6" />}
              title="Hot Lead Alerts"
              description="'G-Wagon wants full detail + ceramic coating ASAP' → Instant text to your phone."
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
              Without DetailPilotAI vs. With DetailPilotAI
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            <ComparisonCard
              title="Without DetailPilotAI"
              isNegative
              items={[
                "Phone rings during paint correction → you ignore it → they call Mobile Detail Pro instead",
                "Customer asks 'How much for ceramic coating?' → voicemail → no callback → lost $400",
                "5-8 missed calls per week = $1,200-$2,400 walking out the door monthly",
                "Stress every time your phone buzzes while you're waxing",
                "No clue how many G-Wagons you're missing"
              ]}
            />
            <ComparisonCard
              title="With DetailPilotAI"
              items={[
                "AI picks up in 2 seconds, sounds professional, knows your packages",
                "Answers pricing, availability, what services you offer while you work",
                "Collects name, car, service needed → sends you hot lead with recording",
                "Detail in peace knowing every call is captured",
                "Dashboard shows exactly which leads are ready to book"
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
              Costs Less Than One Ceramic Coating
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Recover one detail per month and DetailPilotAI pays for itself. Most shops book 3-5 extra details in week one.
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
                    description="Trained on detailing. Picks up in 2 seconds, sounds professional"
                  />
                  <PricingFeature
                    title="Knows your services & pricing"
                    description="Ceramic coating, paint correction, interior, packages - you customize it all"
                  />
                  <PricingFeature
                    title="Collects lead details automatically"
                    description="Name, phone, car type, service needed, when they want it"
                  />
                  <PricingFeature
                    title="Instant hot lead alerts"
                    description="'G-Wagon wants ceramic coating + PPF' → Text to your phone immediately"
                  />
                  <PricingFeature
                    title="Call recordings & transcripts"
                    description="Hear exactly what customer said, read full conversation"
                  />
                  <PricingFeature
                    title="Detailer dashboard"
                    description="See all leads with car details, service, contact info"
                  />
                  <PricingFeature
                    title="Smart caller filtering"
                    description="Regular customers & vendors bypass AI - only new leads handled"
                  />
                  <PricingFeature
                    title="Unlimited calls + cancel anytime"
                    description="No per-call fees. No contract. Cancel with 1 click."
                  />
                </div>

                <Link to="/signup" className="block">
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
                  First 20 detailing shops get lifetime founding member pricing
                </p>

                <div className="mb-4">
                  <span className="text-4xl font-bold text-accent">$99</span>
                  <span className="text-foreground font-semibold">/month locked in forever</span>
                </div>

                <p className="text-success font-medium mb-2">(Save $50/month = One free interior detail)</p>
                <p className="text-sm text-muted-foreground mb-6">
                  Regular price: <span className="line-through">$149/month</span> after founding spots fill
                </p>

                <div className="bg-background/50 rounded-lg p-3 mb-6">
                  <p className="text-foreground font-semibold">Detailing shops remaining: <span className="text-accent">15/20</span></p>
                </div>

                <Link to="/signup" className="block">
                  <Button variant="accent" size="lg" className="w-full text-base group shadow-2xl shadow-accent/30">
                    Lock In $99/mo Founding Rate
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>

                <p className="text-sm text-muted-foreground mt-4 flex items-center justify-center gap-1">
                  <Clock className="w-4 h-4" />
                  Price goes to $149/mo when all founding spots are gone
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
              Detailers Love DetailPilotAI
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            <TestimonialCard
              quote="First week: AI booked 2 ceramic coatings and a full interior while I was elbow-deep in a Tahoe. That's $680 I would've missed. Paid for itself 7x over already."
              author="Marcus J."
              business="Elite Auto Detail - Miami"
              stat="$680 week 1"
              delay={0}
            />
            <TestimonialCard
              quote="I do mobile detailing solo. Phone used to ring off the hook while I'm working. Now the AI handles it all. It even knows to say I'm booked 3 weeks out for paint corrections."
              author="David R."
              business="Shine Mobile Detail - Dallas"
              stat="71% recovery"
              delay={0.1}
            />
            <TestimonialCard
              quote="Setup was 5 minutes. Put in my packages and pricing. Now it books my $200+ details automatically. I just show up and detail. Game changer."
              author="Sarah K."
              business="Precision Detailing - Phoenix"
              stat="4-6 details/week"
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
              question="Does it know detailing terminology?"
              answer="Yes. The AI is trained on auto detailing. It knows ceramic coating, paint correction, clay bar, PPF, interior shampooing, etc. You customize your services and pricing during setup, and it answers based on that."
            />
            <FAQItem
              question="Will it call my regular customers or vendors?"
              answer="No. You can whitelist numbers (regular customers, product suppliers, family). They'll never get the AI. Only new leads who don't leave voicemail get handled."
            />
            <FAQItem
              question="What if someone asks for a custom quote?"
              answer="AI collects all the details (car type, condition, services wanted) and sends you a hot lead notification. You call them back with the custom quote. It doesn't give prices it's not trained on."
            />
            <FAQItem
              question="Does this work for mobile detailing?"
              answer="Absolutely. The AI explains you're mobile, asks for their location, and books the appointment. Works great for mobile-only, shop-only, or hybrid setups."
            />
            <FAQItem
              question="How fast is setup?"
              answer="2 minutes. Enter your shop name, services you offer, your pricing, and business hours. The AI trains on your info instantly. You're live immediately."
            />
            <FAQItem
              question="Can I cancel anytime?"
              answer="Yes. No contracts. Cancel with one click. If you're not booking more details, we don't deserve your money."
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
                Stop Losing Details to Your Competitors
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
                Every missed call is a $150-300 detail going to the shop down the street.
                Let AI handle your phone while you handle their cars.
              </p>
              <Link to="/signup">
                <Button variant="hero" size="xl" className="text-base group shadow-2xl shadow-accent/30">
                  Start Free Trial - Book More Details
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <p className="text-sm text-muted-foreground mt-4">
                No credit card • 2-min setup • Built for detailers
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
            <span className="text-lg font-bold text-foreground">DetailPilotAI</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms</a>
            <a href="#" className="hover:text-foreground transition-colors">Contact</a>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2025 DetailPilotAI.io. All rights reserved.
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
        <Link to="/signup">
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
