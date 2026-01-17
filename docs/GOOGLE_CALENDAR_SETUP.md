# Google Calendar Integration Setup Guide

This guide walks you through setting up Google Calendar integration for DetailPilotAI.

## Overview

Google Calendar integration allows:
- AI to check real-time availability during calls
- Automatic booking directly to your Google Calendar
- Two-way sync between DetailPilot and Google Calendar
- View all appointments (AI-booked and manually added) in one place

## Prerequisites

- DetailPilotAI account
- Google Account
- Access to Google Cloud Console

## Setup Steps

### 1. Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Name: `DetailPilotAI Calendar` (or your preference)
4. Click "Create"

### 2. Enable Google Calendar API

1. In Google Cloud Console, select your project
2. Go to **APIs & Services** → **Library**
3. Search for "Google Calendar API"
4. Click on it and press **Enable**

### 3. Configure OAuth Consent Screen

1. Go to **APIs & Services** → **OAuth consent screen**
2. Select **External** user type → Click **Create**
3. Fill in required fields:
   - **App name**: DetailPilotAI
   - **User support email**: Your email
   - **Developer contact email**: Your email
4. Click **Save and Continue**
5. On "Scopes" page:
   - Click **Add or Remove Scopes**
   - Find and select:
     - `https://www.googleapis.com/auth/calendar`
     - `https://www.googleapis.com/auth/calendar.events`
   - Click **Update** → **Save and Continue**
6. Skip "Test users" for now → **Save and Continue**
7. Review and go back to dashboard

### 4. Create OAuth 2.0 Credentials

1. Go to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **OAuth client ID**
3. Application type: **Web application**
4. Name: `DetailPilotAI Web Client`
5. **Authorized redirect URIs**: Add these URLs:
   ```
   # For local development:
   http://localhost:5173/settings

   # For production (replace with your domain):
   https://your-domain.com/settings

   # Supabase Edge Function callback:
   https://gyqezbnqkkgskmhsnzgw.supabase.co/functions/v1/google-calendar-oauth
   ```
6. Click **Create**
7. **IMPORTANT**: Copy your **Client ID** and **Client Secret**

### 5. Set Environment Variables

#### Frontend (.env)

Create or update `.env` file in your project root:

```env
VITE_GOOGLE_CLIENT_ID=your-client-id-here.apps.googleusercontent.com
VITE_GOOGLE_CLIENT_SECRET=your-client-secret-here
VITE_GOOGLE_REDIRECT_URI=https://gyqezbnqkkgskmhsnzgw.supabase.co/functions/v1/google-calendar-oauth
```

#### Supabase Edge Function

Set environment variables in Supabase:

**Option A - Dashboard**:
1. Go to Supabase Dashboard → Project Settings → Edge Functions
2. Add these secrets:
   - `GOOGLE_CLIENT_ID`: Your Client ID
   - `GOOGLE_CLIENT_SECRET`: Your Client Secret
   - `GOOGLE_REDIRECT_URI`: `https://gyqezbnqkkgskmhsnzgw.supabase.co/functions/v1/google-calendar-oauth`
   - `FRONTEND_URL`: Your frontend URL (e.g., `http://localhost:5173` or `https://your-domain.com`)

**Option B - CLI**:
```bash
supabase secrets set GOOGLE_CLIENT_ID=your-client-id
supabase secrets set GOOGLE_CLIENT_SECRET=your-client-secret
supabase secrets set GOOGLE_REDIRECT_URI=https://gyqezbnqkkgskmhsnzgw.supabase.co/functions/v1/google-calendar-oauth
supabase secrets set FRONTEND_URL=http://localhost:5173
```

### 6. Deploy Database Migration

Run the migration to add Google Calendar fields:

```bash
# Apply migration locally
supabase db push

# Or apply directly to production
psql <your-database-url> < supabase/migrations/20260117_add_google_calendar.sql
```

### 7. Deploy Edge Function

Deploy the OAuth callback handler:

```bash
supabase functions deploy google-calendar-oauth
```

Or via Supabase Dashboard:
1. Go to Edge Functions → New Function
2. Name: `google-calendar-oauth`
3. Copy code from `supabase/functions/google-calendar-oauth/index.ts`
4. Deploy

### 8. Test the Integration

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Log in to DetailPilotAI
3. Go to Settings page
4. Find "Google Calendar Integration" section
5. Click "Connect Google Calendar"
6. You'll be redirected to Google's consent screen
7. Grant permissions
8. You'll be redirected back to Settings with success message

### 9. Verify Connection

After connecting:
- Settings page should show "Connected" status
- Your Google account email should be displayed
- Go to Calendar page
- You should see both DetailPilot appointments AND Google Calendar events

## How It Works

### OAuth Flow

```
User clicks "Connect"
  → Redirect to Google with user ID in state
  → User grants permissions
  → Google redirects to Edge Function with code
  → Edge Function exchanges code for tokens
  → Tokens stored in database
  → User redirected back to Settings
```

### Token Management

- **Access Token**: Valid for 1 hour, used for API calls
- **Refresh Token**: Long-lived, used to get new access tokens
- Tokens are automatically refreshed when needed

### Data Sync

**AI Bookings → Google Calendar**:
- When AI books an appointment during a call
- Event is created in both DetailPilot DB and Google Calendar
- Includes customer name, service, vehicle, time

**Google Calendar → DetailPilot**:
- Calendar page fetches Google events every time it loads
- Shows events from next 30 days
- Displays with "Google Calendar" badge

## Security

- Tokens are encrypted in database
- OAuth uses PKCE flow for security
- Refresh tokens never expire (unless user revokes)
- Users can disconnect anytime from Settings

## Troubleshooting

### "Error: Missing Google OAuth configuration"

**Problem**: Environment variables not set in Edge Function

**Solution**:
```bash
supabase secrets set GOOGLE_CLIENT_ID=your-id
supabase secrets set GOOGLE_CLIENT_SECRET=your-secret
supabase secrets set GOOGLE_REDIRECT_URI=your-redirect-uri
```

### "Failed to fetch Google Calendar events"

**Problem**: Access token expired and refresh failed

**Solution**:
1. Disconnect and reconnect Google Calendar
2. Check that refresh token is stored in database
3. Verify Google API is enabled in Cloud Console

### Events not showing on Calendar page

**Problem**: Integration connected but events not displaying

**Solution**:
1. Check browser console for errors
2. Verify Google Calendar API is enabled
3. Ensure user has events in their Google Calendar
4. Check that token hasn't expired (check `google_calendar_token_expires_at`)

### OAuth redirect doesn't work

**Problem**: Getting "redirect_uri_mismatch" error

**Solution**:
1. Verify redirect URI in Google Cloud Console matches exactly
2. Make sure Edge Function is deployed
3. Check GOOGLE_REDIRECT_URI environment variable

## Testing Checklist

- [ ] Can click "Connect Google Calendar" in Settings
- [ ] Redirected to Google consent screen
- [ ] Can grant permissions
- [ ] Redirected back with success message
- [ ] Settings shows "Connected" status
- [ ] Google email is displayed
- [ ] Calendar page loads without errors
- [ ] Can see Google Calendar events (if any exist)
- [ ] Can create test event in Google Calendar and see it in DetailPilot
- [ ] Can disconnect Google Calendar
- [ ] After disconnect, Google events no longer show

## API Rate Limits

Google Calendar API has these quotas (free tier):
- **Queries per day**: 1,000,000
- **Queries per minute**: 60

For typical DetailPilot usage:
- ~100 users × 10 calendar loads/day = 1,000 requests/day
- Well within free tier limits

## Future Enhancements

Potential improvements for v2:
- [ ] Real-time calendar sync via webhooks
- [ ] Support for multiple calendars
- [ ] Conflict detection (double-booking prevention)
- [ ] Automatic reminder emails via Google Calendar
- [ ] Share calendar availability link with customers

## Support

If you run into issues:
1. Check Supabase Edge Function logs
2. Check browser console for errors
3. Verify all environment variables are set
4. Test OAuth flow in incognito mode
5. Review Google Cloud Console for API errors

## Cost

- **Google Calendar API**: Free up to 1M requests/day
- **Supabase Edge Functions**: Included in free tier (500K requests/month)
- **No additional cost for this feature**

---

**Status**: ✅ Google Calendar Integration Complete

**Time to Setup**: ~15-20 minutes

**Result**: Full two-way calendar sync with AI availability checking!
