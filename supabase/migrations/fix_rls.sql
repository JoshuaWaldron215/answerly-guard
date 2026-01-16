-- FIX RLS - Enable Row Level Security on all tables

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sms_log ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Users can view own data" ON public.users;
DROP POLICY IF EXISTS "Users can update own data" ON public.users;
DROP POLICY IF EXISTS "Users can insert own data" ON public.users;
DROP POLICY IF EXISTS "Users can view own calls" ON public.calls;
DROP POLICY IF EXISTS "Users can insert own calls" ON public.calls;
DROP POLICY IF EXISTS "Users can view own SMS logs" ON public.sms_log;
DROP POLICY IF EXISTS "Allow service role full access" ON public.users;
DROP POLICY IF EXISTS "Allow service role full access" ON public.calls;
DROP POLICY IF EXISTS "Allow service role full access" ON public.sms_log;

-- Users table policies
CREATE POLICY "Users can view own data" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON public.users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own data" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Allow service role (for Edge Functions) full access
CREATE POLICY "Allow service role full access" ON public.users
  FOR ALL USING (auth.role() = 'service_role');

-- Calls table policies
CREATE POLICY "Users can view own calls" ON public.calls
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own calls" ON public.calls
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow service role full access" ON public.calls
  FOR ALL USING (auth.role() = 'service_role');

-- SMS log policies
CREATE POLICY "Users can view own SMS logs" ON public.sms_log
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Allow service role full access" ON public.sms_log
  FOR ALL USING (auth.role() = 'service_role');

-- Verify RLS is enabled
SELECT schemaname, tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('users', 'calls', 'sms_log');
