-- Quick Test: Run this in Supabase SQL Editor
-- This will create the tables AND insert a test user

-- First, run the full migration (copy from supabase/migrations/20260115_initial_schema.sql)
-- OR run this condensed version:

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  business_name TEXT NOT NULL,
  phone_number TEXT,
  timezone TEXT DEFAULT 'America/New_York',
  business_hours JSONB DEFAULT '{}',
  services JSONB DEFAULT '[]',
  booking_link TEXT,
  auto_sms_enabled BOOLEAN DEFAULT true,
  vapi_phone_number TEXT,
  vapi_assistant_id TEXT,
  forward_after_rings INTEGER DEFAULT 3,
  subscription_status TEXT DEFAULT 'trial',
  trial_ends_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '7 days'),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.calls (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  vapi_call_id TEXT UNIQUE,
  phone_number TEXT NOT NULL,
  caller_name TEXT,
  duration INTEGER,
  status TEXT CHECK (status IN ('answered', 'missed', 'ai_answered', 'spam')),
  intent TEXT CHECK (intent IN ('high', 'medium', 'low')),
  confidence REAL,
  outcome TEXT CHECK (outcome IN ('booked', 'waiting', 'dropped', 'spam')),
  vehicle_make TEXT,
  vehicle_model TEXT,
  vehicle_year INTEGER,
  service_requested TEXT,
  preferred_date TEXT,
  notes TEXT,
  transcript JSONB,
  summary TEXT,
  recording_url TEXT,
  last_contacted_at TIMESTAMP WITH TIME ZONE,
  contacted_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.sms_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  call_id UUID REFERENCES public.calls(id) ON DELETE SET NULL,
  to_number TEXT NOT NULL,
  message TEXT NOT NULL,
  sms_type TEXT CHECK (sms_type IN ('auto_followup', 'manual', 'reminder')),
  twilio_sid TEXT,
  status TEXT DEFAULT 'sent',
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sms_log ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own data" ON public.users
  FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update own data" ON public.users
  FOR UPDATE USING (auth.uid()::text = id::text);

CREATE POLICY "Users can view own calls" ON public.calls
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own calls" ON public.calls
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can view own SMS logs" ON public.sms_log
  FOR SELECT USING (auth.uid()::text = user_id::text);

-- Done! Tables created with security enabled.
