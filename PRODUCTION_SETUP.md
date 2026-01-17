# DetailPulse.io - Production Setup Checklist

Your domain: **https://detailpulse.io**

Complete these steps to get Google Calendar integration working in production.

---

## ✅ Step 1: Google Cloud Console - Add Redirect URIs

**Link**: [Google Cloud Console Credentials](https://console.cloud.google.com/apis/credentials)

1. Click on OAuth Client ID: `810153537787-ndchbqqmfhmlcb7eiaqlemv4lqp8rpjc`
2. Under **Authorized redirect URIs**, add these **3 URIs**:

```
https://gyqezbnqkkgskmhsnzgw.supabase.co/functions/v1/google-calendar-oauth
https://detailpulse.io/settings
http://localhost:5173/settings
```

3. Click **SAVE**

**Why?** Google OAuth will redirect users back to these URLs after authorization.

---

## ✅ Step 2: Deploy Database Migration

**Link**: [Supabase SQL Editor](https://supabase.com/dashboard/project/gyqezbnqkkgskmhsnzgw/sql/new)

Copy and paste this SQL, then click **RUN**:

```sql
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS google_calendar_token TEXT,
ADD COLUMN IF NOT EXISTS google_calendar_refresh_token TEXT,
ADD COLUMN IF NOT EXISTS google_calendar_token_expires_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS google_calendar_connected_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS google_calendar_email TEXT;
```

Expected output: `Success. No rows returned`

**Why?** Adds fields to store Google Calendar tokens and connection info.

---

## ✅ Step 3: Deploy Edge Function

**Link**: [Supabase Edge Functions](https://supabase.com/dashboard/project/gyqezbnqkkgskmhsnzgw/functions)

1. Click **Deploy a new function**
2. Function name: `google-calendar-oauth`
3. Copy the entire code from your repo: `supabase/functions/google-calendar-oauth/index.ts`
4. Paste it in the editor
5. Click **Deploy function**

**Why?** This function handles the OAuth callback from Google.

---

## ✅ Step 4: Set Edge Function Environment Variables

**Link**: [Supabase Edge Function Settings](https://supabase.com/dashboard/project/gyqezbnqkkgskmhsnzgw/settings/functions)

Scroll to **Secrets** section and add these **6 secrets**:

| Secret Name | Secret Value |
|------------|--------------|
| `GOOGLE_CLIENT_ID` | `810153537787-ndchbqqmfhmlcb7eiaqlemv4lqp8rpjc.apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | `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` |
| `GOOGLE_REDIRECT_URI` | `https://gyqezbnqkkgskmhsnzgw.supabase.co/functions/v1/google-calendar-oauth` |
| `FRONTEND_URL` | `https://detailpulse.io` |
| `SUPABASE_URL` | `https://gyqezbnqkkgskmhsnzgw.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | Get from [Project Settings → API](https://supabase.com/dashboard/project/gyqezbnqkkgskmhsnzgw/settings/api) - click "Reveal" under "service_role secret" |

Click **Save** after adding each secret.

**To get service_role key**: Go to Project Settings → API, scroll to "Project API keys", find `service_role`, click "Reveal", and copy the entire key.

**Why?** Edge Function needs these to authenticate with Google, access the database, and redirect back to your domain.

---

## ✅ Step 5: Deploy to Vercel

**Link**: [Vercel Dashboard](https://vercel.com)

### If Already Deployed:

1. Go to your project in Vercel
2. Click **Settings** → **Domains**
3. Verify `detailpulse.io` is set as your domain
4. Go to **Settings** → **Environment Variables**
5. Add/update these variables:

```
VITE_SUPABASE_URL=https://gyqezbnqkkgskmhsnzgw.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd5cWV6Ym5xa2tnc2ttaHNuemd3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg0NTI5MTcsImV4cCI6MjA4NDAyODkxN30.dbKN1qXHGnvEE7nG20J8YHZWczpk1cGgZdPPaq8HhN4
VITE_GOOGLE_CLIENT_ID=810153537787-ndchbqqmfhmlcb7eiaqlemv4lqp8rpjc.apps.googleusercontent.com
VITE_GOOGLE_CLIENT_SECRET=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
VITE_GOOGLE_REDIRECT_URI=https://gyqezbnqkkgskmhsnzgw.supabase.co/functions/v1/google-calendar-oauth
```

6. Click **Save**
7. Go to **Deployments** → **Redeploy** (select latest deployment)

### If Not Yet Deployed:

```bash
# Via CLI
vercel --prod

# Or use Vercel Dashboard to import your GitHub repo
# Then add environment variables above
```

**Why?** Your frontend needs these credentials to initiate Google OAuth flow.

---

## ✅ Step 6: Test on Production

1. Go to **https://detailpulse.io**
2. Login to your account
3. Navigate to **Settings**
4. Scroll to **Google Calendar Integration**
5. Click **"Connect Google Calendar"**
6. You'll be redirected to Google
7. Select your Google account and authorize
8. You'll be redirected back to https://detailpulse.io/settings
9. Success message should appear!
10. Go to **Calendar** page
11. Create a test event in Google Calendar
12. Refresh DetailPulse Calendar page
13. Your Google event should appear with "Google Calendar" badge! 🎉

---

## 🎯 Quick Copy-Paste Values

**Google Redirect URIs** (paste all 3):
```
https://gyqezbnqkkgskmhsnzgw.supabase.co/functions/v1/google-calendar-oauth
https://detailpulse.io/settings
http://localhost:5173/settings
```

**Supabase Edge Function Secrets** (6 secrets):
```
GOOGLE_CLIENT_ID=810153537787-ndchbqqmfhmlcb7eiaqlemv4lqp8rpjc.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
GOOGLE_REDIRECT_URI=https://gyqezbnqkkgskmhsnzgw.supabase.co/functions/v1/google-calendar-oauth
FRONTEND_URL=https://detailpulse.io
SUPABASE_URL=https://gyqezbnqkkgskmhsnzgw.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<get from Supabase Project Settings → API>
```

**Vercel Environment Variables** (5 variables):
```
VITE_SUPABASE_URL=https://gyqezbnqkkgskmhsnzgw.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd5cWV6Ym5xa2tnc2ttaHNuemd3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg0NTI5MTcsImV4cCI6MjA4NDAyODkxN30.dbKN1qXHGnvEE7nG20J8YHZWczpk1cGgZdPPaq8HhN4
VITE_GOOGLE_CLIENT_ID=810153537787-ndchbqqmfhmlcb7eiaqlemv4lqp8rpjc.apps.googleusercontent.com
VITE_GOOGLE_CLIENT_SECRET=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
VITE_GOOGLE_REDIRECT_URI=https://gyqezbnqkkgskmhsnzgw.supabase.co/functions/v1/google-calendar-oauth
```

---

## 🔴 Common Issues

### "redirect_uri_mismatch" error

**Problem**: Google redirect URI doesn't match

**Fix**: Double-check Google Cloud Console has all 3 redirect URIs exactly as shown above (no typos, no trailing slashes)

### "Missing Google OAuth configuration" error

**Problem**: Edge Function secrets not set

**Fix**: Go to Supabase Dashboard → Settings → Edge Functions → Secrets and verify all 6 secrets are set

### "Missing authorization header" (401) error

**Problem**: Edge Function can't access database to store tokens

**Fix**: Make sure you added `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` to Edge Function secrets. See `FIX_OAUTH_401.md` for detailed instructions.

### Calendar events not showing

**Problem**: Token expired or API not enabled

**Fix**:
1. Make sure Google Calendar API is enabled in Google Cloud Console
2. Disconnect and reconnect Google Calendar in Settings
3. Check browser console for errors

### Can't connect on detailpulse.io

**Problem**: Frontend environment variables not set in Vercel

**Fix**: Go to Vercel → Settings → Environment Variables and verify all 5 variables are set, then redeploy

---

## ✨ You're Done!

Once all steps are complete, users can:
- ✅ Connect their Google Calendar from Settings
- ✅ See Google Calendar events in DetailPulse Calendar page
- ✅ AI can check real availability during calls
- ✅ Appointments sync both ways

Your DetailPulse.io platform is now production-ready with full Google Calendar integration! 🚀
