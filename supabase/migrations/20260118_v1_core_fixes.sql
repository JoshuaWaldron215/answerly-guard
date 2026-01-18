-- V1 Core Fixes Migration
-- 1. Auto-create user record on auth signup
-- 2. Add phone number provisioning status
-- 3. Add notification preferences
-- 4. Add onboarding tracking

-- ============================================
-- 1. AUTO-CREATE USER RECORD ON AUTH SIGNUP
-- ============================================
-- This trigger fires when a new user signs up via Supabase Auth
-- and automatically creates a row in the public.users table

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (
    id,
    email,
    business_name,
    phone_number_status,
    notification_preferences,
    onboarding_completed
  ) VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'business_name', 'My Business'),
    'pending',
    '{"email_all_calls": true, "email_hot_leads": true, "email_missed_calls": true, "email_daily_summary": false}'::jsonb,
    false
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- ============================================
-- 2. ADD PHONE NUMBER PROVISIONING STATUS
-- ============================================
-- Track the state of Vapi phone number provisioning

-- Add phone_number_status column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'users'
    AND column_name = 'phone_number_status'
  ) THEN
    ALTER TABLE public.users
    ADD COLUMN phone_number_status TEXT DEFAULT 'pending'
    CHECK (phone_number_status IN ('pending', 'provisioning', 'active', 'failed'));
  END IF;
END $$;

-- Add provisioning error message column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'users'
    AND column_name = 'phone_provisioning_error'
  ) THEN
    ALTER TABLE public.users
    ADD COLUMN phone_provisioning_error TEXT;
  END IF;
END $$;

-- Add provisioning timestamp
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'users'
    AND column_name = 'phone_provisioned_at'
  ) THEN
    ALTER TABLE public.users
    ADD COLUMN phone_provisioned_at TIMESTAMP WITH TIME ZONE;
  END IF;
END $$;


-- ============================================
-- 3. ADD NOTIFICATION PREFERENCES
-- ============================================
-- Store user's email notification preferences

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'users'
    AND column_name = 'notification_preferences'
  ) THEN
    ALTER TABLE public.users
    ADD COLUMN notification_preferences JSONB DEFAULT '{
      "email_all_calls": true,
      "email_hot_leads": true,
      "email_missed_calls": true,
      "email_daily_summary": false
    }'::jsonb;
  END IF;
END $$;


-- ============================================
-- 4. ADD ONBOARDING TRACKING
-- ============================================
-- Track whether user has completed onboarding steps

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'users'
    AND column_name = 'onboarding_completed'
  ) THEN
    ALTER TABLE public.users
    ADD COLUMN onboarding_completed BOOLEAN DEFAULT false;
  END IF;
END $$;

-- Track individual onboarding steps
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'users'
    AND column_name = 'onboarding_steps'
  ) THEN
    ALTER TABLE public.users
    ADD COLUMN onboarding_steps JSONB DEFAULT '{
      "phone_assigned": false,
      "voice_selected": false,
      "business_info_completed": false,
      "test_call_completed": false
    }'::jsonb;
  END IF;
END $$;


-- ============================================
-- 5. UPDATE EXISTING USERS
-- ============================================
-- Set defaults for any existing users missing these columns

UPDATE public.users
SET phone_number_status = 'pending'
WHERE phone_number_status IS NULL;

UPDATE public.users
SET notification_preferences = '{
  "email_all_calls": true,
  "email_hot_leads": true,
  "email_missed_calls": true,
  "email_daily_summary": false
}'::jsonb
WHERE notification_preferences IS NULL;

UPDATE public.users
SET onboarding_completed = false
WHERE onboarding_completed IS NULL;

UPDATE public.users
SET onboarding_steps = '{
  "phone_assigned": false,
  "voice_selected": false,
  "business_info_completed": false,
  "test_call_completed": false
}'::jsonb
WHERE onboarding_steps IS NULL;

-- Mark existing users with vapi_phone_number as having phone assigned
UPDATE public.users
SET
  phone_number_status = 'active',
  onboarding_steps = onboarding_steps || '{"phone_assigned": true}'::jsonb
WHERE vapi_phone_number IS NOT NULL AND vapi_phone_number != '';


-- ============================================
-- 6. CREATE INDEX FOR FASTER QUERIES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_users_phone_status
ON public.users(phone_number_status);

CREATE INDEX IF NOT EXISTS idx_users_onboarding
ON public.users(onboarding_completed);
