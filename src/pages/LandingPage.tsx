import React, { useState, useEffect } from "react";
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

// Custom Logo Component
const Logo = ({ size = "md" }: { size?: "sm" | "md" }) => {
  const dimensions = size === "sm" ? { w: 32, h: 32 } : { w: 36, h: 36 };

  return (
    <svg width={dimensions.w} height={dimensions.h} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="8" fill="url(#gradient)" />
      <path d="M12 28V15C12 13.8954 12.8954 13 14 13H26C27.1046 13 28 13.8954 28 15V18" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
      <circle cx="24" cy="24" r="5" fill="white" fillOpacity="0.2"/>
      <path d="M26.5 22L24 24.5L21.5 22" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <defs>
        <linearGradient id="gradient" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0099CC"/>
          <stop offset="1" stopColor="#0077AA"/>
        </linearGradient>
      </defs>
    </svg>
  );
};
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

  // Force light mode on landing page
  useEffect(() => {
    const html = document.documentElement;
    const originalClass = html.className;
    html.classList.remove('dark');

    return () => {
      html.className = originalClass;
    };
  }, []);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass glass-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2.5">
              <Logo />
              <span className="text-xl font-bold text-foreground">DetailPilot<span className="text-primary">AI</span></span>
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
      <section className="relative pt-32 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: Hero Content */}
            <div className="text-center lg:text-left">
              {/* Social proof badge */}
              <div className="flex justify-center lg:justify-start mb-8">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-background">
                  <div className="flex -space-x-1">
                    {[1,2,3].map((i) => (
                      <div key={i} className="w-6 h-6 rounded-full bg-primary/10 border-2 border-background" />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">500+</span> detailing shops
                  </span>
                </div>
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-foreground leading-[1.1] mb-6">
                You're Waxing.
                <br />
                <span className="text-primary">We Book the Detail.</span>
              </h1>

              <p className="text-xl text-muted-foreground mb-8 leading-relaxed max-w-xl mx-auto lg:mx-0">
                AI receptionist that picks up your calls in 2 seconds, knows your services, and books jobs — while you're polishing.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-8">
                <Link to="/signup">
                  <Button size="xl" className="w-full sm:w-auto text-lg px-8 py-6 shadow-lg bg-primary hover:bg-primary/90">
                    Start Free Trial
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <div className="flex items-center gap-2 text-sm">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                    ))}
                  </div>
                  <span className="text-muted-foreground">4.9/5 from detailers</span>
                </div>
              </div>

              <div className="flex flex-wrap justify-center lg:justify-start gap-4 text-sm text-muted-foreground">
                <span>✓ No credit card</span>
                <span>✓ 2-min setup</span>
                <span>✓ Cancel anytime</span>
              </div>
            </div>

            {/* Right: Voice Demo */}
            <div className="hidden lg:block">
              <Card className="border-2 border-primary/20 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Try the AI</h3>
                    <p className="text-sm text-muted-foreground">Talk to our receptionist</p>
                  </div>
                </div>
                <VoiceDemo compact />
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-secondary/30">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-foreground mb-1">71%</div>
              <div className="text-sm text-muted-foreground">Leads captured</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-foreground mb-1">2 sec</div>
              <div className="text-sm text-muted-foreground">AI answers in</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-foreground mb-1">$680</div>
              <div className="text-sm text-muted-foreground">Avg/week recovered</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-foreground mb-1">24/7</div>
              <div className="text-sm text-muted-foreground">Never miss a call</div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
            The Detail Shop Dilemma
          </h2>
          <p className="text-xl text-muted-foreground mb-12">
            You're 3 hours into a paint correction. Phone rings. Do you strip off gloves and risk contamination, or let a $250 ceramic coating walk?
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-5xl font-bold text-destructive mb-2">5-8</div>
              <div className="font-semibold text-foreground mb-2">Missed calls/week</div>
              <p className="text-sm text-muted-foreground">Can't answer during a 6-hour detail job</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-destructive mb-2">$150-300</div>
              <div className="font-semibold text-foreground mb-2">Per missed detail</div>
              <p className="text-sm text-muted-foreground">That's a full interior walking to your competitor</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-destructive mb-2">80%</div>
              <div className="font-semibold text-foreground mb-2">Won't leave voicemail</div>
              <p className="text-sm text-muted-foreground">They Google and call the next shop in 30 seconds</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 px-4 sm:px-6 lg:px-8 bg-secondary/30">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            Keep Detailing. We'll Handle the Phone.
          </h2>
          <p className="text-lg text-muted-foreground mb-16 max-w-2xl mx-auto">
            Our AI understands detailing. Knows your services. Books the jobs.
          </p>

          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center text-xl font-bold mb-4 mx-auto">1</div>
              <h3 className="font-semibold text-foreground mb-2">Customer Calls</h3>
              <p className="text-sm text-muted-foreground">Phone rings during paint correction</p>
            </div>
            <div>
              <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center text-xl font-bold mb-4 mx-auto">2</div>
              <h3 className="font-semibold text-foreground mb-2">AI Answers</h3>
              <p className="text-sm text-muted-foreground">Picks up in 2 sec, knows your prices</p>
            </div>
            <div>
              <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center text-xl font-bold mb-4 mx-auto">3</div>
              <h3 className="font-semibold text-foreground mb-2">Collects Info</h3>
              <p className="text-sm text-muted-foreground">Name, car, service, preferred date</p>
            </div>
            <div>
              <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center text-xl font-bold mb-4 mx-auto">4</div>
              <h3 className="font-semibold text-foreground mb-2">Lead in Dashboard</h3>
              <p className="text-sm text-muted-foreground">Full details + recording waiting</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-16 text-center">
            What You Get
          </h2>

          <div className="grid md:grid-cols-2 gap-x-12 gap-y-8">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Bot className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Answers Like a Detailer</h3>
                <p className="text-sm text-muted-foreground">Knows ceramic coating from wax. Explains your packages clearly.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Books Appointments</h3>
                <p className="text-sm text-muted-foreground">Collects car type, service, date. Sends qualified leads instantly.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Handles Questions</h3>
                <p className="text-sm text-muted-foreground">"How much for SUV interior?" AI answers based on your pricing.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Dashboard</h3>
                <p className="text-sm text-muted-foreground">See every lead with car details, service, and call recording.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Smart Caller ID</h3>
                <p className="text-sm text-muted-foreground">Regular customers bypass AI. Only new leads get handled.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Bell className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Hot Lead Alerts</h3>
                <p className="text-sm text-muted-foreground">"G-Wagon wants ceramic coating" → Instant text to your phone.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-secondary/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-foreground mb-12 text-center">
            Before & After
          </h2>

          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-xl font-bold text-destructive mb-6">Without DetailPilotAI</h3>
              <ul className="space-y-3">
                <li className="flex gap-3 text-foreground">
                  <X className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                  <span>5-8 missed calls = $1,200-$2,400 lost/month</span>
                </li>
                <li className="flex gap-3 text-foreground">
                  <X className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                  <span>Customers call your competitor instead</span>
                </li>
                <li className="flex gap-3 text-foreground">
                  <X className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                  <span>Stress every time phone buzzes</span>
                </li>
                <li className="flex gap-3 text-foreground">
                  <X className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                  <span>No clue how many G-Wagons you're missing</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold text-success mb-6">With DetailPilotAI</h3>
              <ul className="space-y-3">
                <li className="flex gap-3 text-foreground">
                  <Check className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                  <span>AI picks up in 2 sec, books the job</span>
                </li>
                <li className="flex gap-3 text-foreground">
                  <Check className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                  <span>Every lead captured with full details</span>
                </li>
                <li className="flex gap-3 text-foreground">
                  <Check className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                  <span>Detail in peace, phone is handled</span>
                </li>
                <li className="flex gap-3 text-foreground">
                  <Check className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                  <span>Dashboard shows every opportunity</span>
                </li>
              </ul>
            </div>
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
          <div className="flex items-center gap-2.5">
            <Logo size="sm" />
            <span className="text-lg font-bold text-foreground">DetailPilot<span className="text-primary">AI</span></span>
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
