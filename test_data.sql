-- Insert a test call to see dashboard with data
-- Replace 'YOUR_USER_ID' with your actual user ID from Supabase Auth

-- First, get your user ID:
-- SELECT auth.uid();

-- Then insert test call:
INSERT INTO public.calls (
  user_id,
  phone_number,
  caller_name,
  status,
  intent,
  confidence,
  outcome,
  vehicle_make,
  vehicle_model,
  vehicle_year,
  service_requested,
  summary,
  duration
) VALUES (
  'YOUR_USER_ID_HERE'::uuid,  -- Replace with your actual user ID
  '+15551234567',
  'John Smith',
  'ai_answered',
  'high',
  0.95,
  'waiting',
  'Tesla',
  'Model 3',
  2020,
  'Full Detail',
  'Customer interested in full detail for Tesla Model 3. Asking about pricing.',
  120
);

-- Refresh dashboard - you should now see:
-- Total Calls: 1
-- Hot Leads: 1
-- Activity feed: 1 item
