-- DetailPilot Database Schema
-- Created: 2026-01-15

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users/Businesses table
CREATE TABLE public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  business_name TEXT NOT NULL,
  phone_number TEXT,
  timezone TEXT DEFAULT 'America/New_York',

  -- Business settings
  business_hours JSONB DEFAULT '{}',
  services JSONB DEFAULT '[]',
  booking_link TEXT,
  auto_sms_enabled BOOLEAN DEFAULT true,

  -- Vapi configuration
  vapi_phone_number TEXT,
  vapi_assistant_id TEXT,
  forward_after_rings INTEGER DEFAULT 3,

  -- Subscription (we'll add Stripe later)
  subscription_status TEXT DEFAULT 'trial',
  trial_ends_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '7 days'),

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Calls table (stores all call data from Vapi)
CREATE TABLE public.calls (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,

  -- Call metadata
  vapi_call_id TEXT UNIQUE,
  phone_number TEXT NOT NULL,
  caller_name TEXT,
  duration INTEGER, -- in seconds

  -- Call status
  status TEXT CHECK (status IN ('answered', 'missed', 'ai_answered', 'spam')),
  intent TEXT CHECK (intent IN ('high', 'medium', 'low')),
  confidence REAL, -- 0.0 to 1.0
  outcome TEXT CHECK (outcome IN ('booked', 'waiting', 'dropped', 'spam')),

  -- Lead information (extracted from call)
  vehicle_make TEXT,
  vehicle_model TEXT,
  vehicle_year INTEGER,
  service_requested TEXT,
  preferred_date TEXT,
  notes TEXT,

  -- Call data
  transcript JSONB,
  summary TEXT,
  recording_url TEXT,

  -- Tracking
  last_contacted_at TIMESTAMP WITH TIME ZONE,
  contacted_count INTEGER DEFAULT 0,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- SMS log table (track all SMS sent)
CREATE TABLE public.sms_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  call_id UUID REFERENCES public.calls(id) ON DELETE SET NULL,

  to_number TEXT NOT NULL,
  message TEXT NOT NULL,

  -- SMS metadata
  sms_type TEXT CHECK (sms_type IN ('auto_followup', 'manual', 'reminder')),
  twilio_sid TEXT,
  status TEXT DEFAULT 'sent',

  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_calls_user_id ON public.calls(user_id);
CREATE INDEX idx_calls_created_at ON public.calls(created_at DESC);
CREATE INDEX idx_calls_intent ON public.calls(intent);
CREATE INDEX idx_calls_status ON public.calls(status);
CREATE INDEX idx_sms_log_user_id ON public.sms_log(user_id);
CREATE INDEX idx_sms_log_call_id ON public.sms_log(call_id);

-- Row Level Security (RLS) policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sms_log ENABLE ROW LEVEL SECURITY;

-- Users can only see their own data
CREATE POLICY "Users can view own data" ON public.users
  FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update own data" ON public.users
  FOR UPDATE USING (auth.uid()::text = id::text);

-- Users can only see their own calls
CREATE POLICY "Users can view own calls" ON public.calls
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own calls" ON public.calls
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

-- Users can only see their own SMS logs
CREATE POLICY "Users can view own SMS logs" ON public.sms_log
  FOR SELECT USING (auth.uid()::text = user_id::text);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers to auto-update updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_calls_updated_at BEFORE UPDATE ON public.calls
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Sample data for development (optional - remove in production)
-- INSERT INTO public.users (id, email, business_name, phone_number)
-- VALUES (
--   'your-user-id-here',
--   'demo@detailpilot.ai',
--   'Pristine Auto Detailing',
--   '+15551234567'
-- );
