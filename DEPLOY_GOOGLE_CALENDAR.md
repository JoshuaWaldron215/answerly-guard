# Google Calendar Integration - Deployment Guide

Your Google OAuth credentials are configured! Follow these steps to get everything live.

## Your Google OAuth Credentials

```
Client ID: 810153537787-ndchbqqmfhmlcb7eiaqlemv4lqp8rpjc.apps.googleusercontent.com
Client Secret: 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
```

## Step 1: Configure Google Cloud Console Redirect URIs

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Go to **APIs & Services** → **Credentials**
4. Click on your OAuth 2.0 Client ID: `810153537787-ndchbqqmfhmlcb7eiaqlemv4lqp8rpjc`

5. **Add these Authorized Redirect URIs**:
   ```
   # Supabase Edge Function (REQUIRED)
   https://gyqezbnqkkgskmhsnzgw.supabase.co/functions/v1/google-calendar-oauth

   # Local development
   http://localhost:5173/settings

   # After deploying to Vercel, add:
   https://your-vercel-url.vercel.app/settings
   ```

6. Click **Save**

## Step 2: Deploy Database Migration

### Option A: Supabase Dashboard (Easiest)

1. Go to [Supabase Dashboard](https://supabase.com/dashboard/project/gyqezbnqkkgskmhsnzgw/editor)
2. Click **SQL Editor** (left sidebar)
3. Click **New Query**
4. Copy and paste this SQL:

```sql
-- Add Google Calendar integration fields
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS google_calendar_token TEXT,
ADD COLUMN IF NOT EXISTS google_calendar_refresh_token TEXT,
ADD COLUMN IF NOT EXISTS google_calendar_token_expires_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS google_calendar_connected_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS google_calendar_email TEXT;

-- Add comments for documentation
COMMENT ON COLUMN public.users.google_calendar_token IS 'Google OAuth access token for Calendar API';
COMMENT ON COLUMN public.users.google_calendar_refresh_token IS 'Google OAuth refresh token for Calendar API';
COMMENT ON COLUMN public.users.google_calendar_token_expires_at IS 'When the access token expires';
COMMENT ON COLUMN public.users.google_calendar_connected_at IS 'When the user connected their Google Calendar';
COMMENT ON COLUMN public.users.google_calendar_email IS 'Google account email used for calendar sync';
```

5. Click **Run** (or press F5)
6. You should see "Success. No rows returned"

### Option B: Supabase CLI (If installed)

```bash
supabase db push
```

## Step 3: Deploy Edge Function

### Option A: Supabase Dashboard (Recommended)

1. Go to [Supabase Dashboard](https://supabase.com/dashboard/project/gyqezbnqkkgskmhsnzgw)
2. Click **Edge Functions** (left sidebar)
3. Click **Deploy a new function**
4. **Function name**: `google-calendar-oauth`
5. Copy the code from `supabase/functions/google-calendar-oauth/index.ts`
6. Paste it into the editor
7. Click **Deploy function**

### Option B: Using Supabase CLI

```bash
# Install Supabase CLI (if not installed)
npm install -g supabase

# Login
supabase login

# Link project
supabase link --project-ref gyqezbnqkkgskmhsnzgw

# Deploy function
supabase functions deploy google-calendar-oauth
```

## Step 4: Set Edge Function Environment Variables

### Via Supabase Dashboard (Easiest)

1. Go to [Project Settings](https://supabase.com/dashboard/project/gyqezbnqkkgskmhsnzgw/settings/functions)
2. Click **Edge Functions** tab
3. Scroll to **Secrets**
4. Add these secrets one by one:

```
GOOGLE_CLIENT_ID = 810153537787-ndchbqqmfhmlcb7eiaqlemv4lqp8rpjc.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET = 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
GOOGLE_REDIRECT_URI = https://gyqezbnqkkgskmhsnzgw.supabase.co/functions/v1/google-calendar-oauth
FRONTEND_URL = http://localhost:5173
```

5. Click **Save** after adding each one

### Via Supabase CLI

```bash
supabase secrets set GOOGLE_CLIENT_ID=810153537787-ndchbqqmfhmlcb7eiaqlemv4lqp8rpjc.apps.googleusercontent.com
supabase secrets set GOOGLE_CLIENT_SECRET=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
supabase secrets set GOOGLE_REDIRECT_URI=https://gyqezbnqkkgskmhsnzgw.supabase.co/functions/v1/google-calendar-oauth
supabase secrets set FRONTEND_URL=http://localhost:5173
```

## Step 5: Test Locally

1. **Start your dev server**:
   ```bash
   npm run dev
   ```

2. **Open app**: http://localhost:5173

3. **Login** to your account

4. **Go to Settings** → Scroll to "Google Calendar Integration"

5. **Click "Connect Google Calendar"**

6. **You'll be redirected to Google**:
   - Select your Google account
   - Review permissions
   - Click "Allow"

7. **You'll be redirected back** to Settings with a success message

8. **Verify connection**:
   - Should show "Connected" status
   - Your Google email should appear
   - Connection date should be shown

9. **Go to Calendar page**:
   - Create a test event in Google Calendar
   - Refresh DetailPilot Calendar page
   - Your Google event should appear with "Google Calendar" badge!

## Step 6: Deploy to Vercel

Once local testing works:

### Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

Or via [Vercel Dashboard](https://vercel.com/):
1. Import your GitHub repo
2. Add environment variables:
   ```
   VITE_SUPABASE_URL=https://gyqezbnqkkgskmhsnzgw.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   VITE_GOOGLE_CLIENT_ID=810153537787-ndchbqqmfhmlcb7eiaqlemv4lqp8rpjc.apps.googleusercontent.com
   VITE_GOOGLE_CLIENT_SECRET=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
   VITE_GOOGLE_REDIRECT_URI=https://gyqezbnqkkgskmhsnzgw.supabase.co/functions/v1/google-calendar-oauth
   ```
3. Deploy

### After Vercel Deployment

1. **Get your Vercel URL** (e.g., `https://answerly-guard.vercel.app`)

2. **Add to Google Cloud Console**:
   - Go back to OAuth credentials
   - Add new redirect URI: `https://your-vercel-url.vercel.app/settings`
   - Save

3. **Update Supabase Edge Function secret**:
   ```bash
   supabase secrets set FRONTEND_URL=https://your-vercel-url.vercel.app
   ```

## Troubleshooting

### "redirect_uri_mismatch" error

**Problem**: Google redirect URI doesn't match

**Solution**:
1. Check Google Cloud Console redirect URIs
2. Make sure Edge Function URL is EXACTLY:
   `https://gyqezbnqkkgskmhsnzgw.supabase.co/functions/v1/google-calendar-oauth`
3. No trailing slash!

### "Missing Google OAuth configuration"

**Problem**: Edge Function environment variables not set

**Solution**:
1. Check Supabase Dashboard → Settings → Edge Functions → Secrets
2. Make sure all 4 secrets are set
3. Redeploy Edge Function after adding secrets

### Edge Function not found (404)

**Problem**: Function not deployed

**Solution**:
1. Go to Supabase Dashboard → Edge Functions
2. Check if `google-calendar-oauth` exists
3. If not, deploy it using Step 3 above

### Calendar events not showing

**Problem**: Token expired or API not enabled

**Solution**:
1. Make sure Google Calendar API is enabled in Google Cloud Console
2. Disconnect and reconnect Google Calendar
3. Check browser console for errors

## Quick Checklist

Before testing, make sure you have:

- [ ] Added redirect URIs in Google Cloud Console
- [ ] Applied database migration (users table has google_calendar_* columns)
- [ ] Deployed Edge Function `google-calendar-oauth`
- [ ] Set all 4 Edge Function secrets (GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI, FRONTEND_URL)
- [ ] Updated `.env` file with Google credentials
- [ ] Google Calendar API is enabled in Google Cloud Console
- [ ] OAuth consent screen is configured

## Expected Result

Once everything is set up:

✅ Settings page shows "Connect Google Calendar" button
✅ Click button → Redirect to Google consent screen
✅ Grant permissions → Redirect back with success message
✅ Settings shows "Connected" status with your Google email
✅ Calendar page shows both DetailPilot and Google Calendar events
✅ Events have source badges (DetailPilot vs Google Calendar)
✅ Can disconnect anytime from Settings

## Support

If you get stuck:
1. Check Supabase Edge Function logs (Dashboard → Edge Functions → Logs)
2. Check browser console for errors
3. Verify all environment variables are set
4. Test OAuth flow in incognito mode

---

**You're all set!** The Google Calendar integration is ready to go. 🎉
