-- Add voice selection column to users table
-- Created: 2026-01-18

ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS vapi_voice TEXT DEFAULT 'nova';

-- Add comment
COMMENT ON COLUMN public.users.vapi_voice IS 'Selected Vapi voice ID (alloy, echo, fable, onyx, nova, shimmer)';

-- Update existing users to have default voice
UPDATE public.users
SET vapi_voice = 'nova'
WHERE vapi_voice IS NULL;
