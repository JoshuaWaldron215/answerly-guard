-- Add Google Calendar integration fields
-- Created: 2026-01-17

ALTER TABLE public.users
ADD COLUMN google_calendar_token TEXT,
ADD COLUMN google_calendar_refresh_token TEXT,
ADD COLUMN google_calendar_token_expires_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN google_calendar_connected_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN google_calendar_email TEXT;

-- Add comment for documentation
COMMENT ON COLUMN public.users.google_calendar_token IS 'Google OAuth access token for Calendar API';
COMMENT ON COLUMN public.users.google_calendar_refresh_token IS 'Google OAuth refresh token for Calendar API';
COMMENT ON COLUMN public.users.google_calendar_token_expires_at IS 'When the access token expires';
COMMENT ON COLUMN public.users.google_calendar_connected_at IS 'When the user connected their Google Calendar';
COMMENT ON COLUMN public.users.google_calendar_email IS 'Google account email used for calendar sync';
