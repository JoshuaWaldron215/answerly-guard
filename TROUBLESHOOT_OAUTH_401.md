# Troubleshooting: OAuth 401 "Missing authorization header" Error

## The Error

After selecting your Google account during OAuth, you get redirected to a page showing:
```json
{"code":401,"message":"Missing authorization header"}
```

## Root Cause

The Edge Function (`google-calendar-oauth`) either:
1. Wasn't deployed properly
2. Can't access Supabase environment variables
3. Needs to be redeployed with the latest code

## Solution: Redeploy the Edge Function

### Step 1: Copy the Updated Edge Function Code

The code is in your repo: `supabase/functions/google-calendar-oauth/index.ts`

I just updated it with better error handling. You need to deploy this updated version.

### Step 2: Deploy via Supabase Dashboard

1. Go to [Supabase Edge Functions](https://supabase.com/dashboard/project/gyqezbnqkkgskmhsnzgw/functions)

2. **If the function exists**:
   - Click on `google-calendar-oauth`
   - Click **Edit function**
   - Replace ALL the code with the contents of `supabase/functions/google-calendar-oauth/index.ts` from your repo
   - Click **Deploy**

3. **If the function doesn't exist**:
   - Click **Create a new function**
   - Name: `google-calendar-oauth`
   - Copy the entire code from `supabase/functions/google-calendar-oauth/index.ts`
   - Click **Deploy**

### Step 3: Verify the 4 Secrets Are Set

Go to [Edge Function Settings](https://supabase.com/dashboard/project/gyqezbnqkkgskmhsnzgw/settings/functions)

Make sure these **4 secrets** exist:
- ✅ `GOOGLE_CLIENT_ID`
- ✅ `GOOGLE_CLIENT_SECRET`
- ✅ `GOOGLE_REDIRECT_URI`
- ✅ `FRONTEND_URL`

If any are missing, add them from `PRODUCTION_SETUP.md`.

### Step 4: Test Again

1. Go to Settings → Google Calendar Integration
2. Click "Connect Google Calendar"
3. Select your Google account
4. Grant permissions
5. Should redirect successfully! ✅

### Step 5: Check Logs (If Still Failing)

If it still doesn't work:

1. Go to [Edge Functions](https://supabase.com/dashboard/project/gyqezbnqkkgskmhsnzgw/functions)
2. Click on `google-calendar-oauth`
3. Click **Logs** tab
4. Try connecting Google Calendar again
5. Check the logs for errors

You should see a log entry like:
```
Environment check: { hasUrl: true, hasServiceKey: true, urlValue: "https://..." }
```

If you see `hasUrl: false` or `hasServiceKey: false`, that means Supabase isn't providing the environment variables automatically, which is unusual.

## Alternative: Deploy via Supabase CLI

If you have Supabase CLI installed:

```bash
# Make sure you're in the project directory
cd /home/user/answerly-guard

# Link to your project
supabase link --project-ref gyqezbnqkkgskmhsnzgw

# Deploy the function
supabase functions deploy google-calendar-oauth

# Set the 4 secrets (if not already set)
supabase secrets set GOOGLE_CLIENT_ID=810153537787-ndchbqqmfhmlcb7eiaqlemv4lqp8rpjc.apps.googleusercontent.com
supabase secrets set GOOGLE_CLIENT_SECRET=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
supabase secrets set GOOGLE_REDIRECT_URI=https://gyqezbnqkkgskmhsnzgw.supabase.co/functions/v1/google-calendar-oauth
supabase secrets set FRONTEND_URL=https://detailpulse.io
```

## What Changed in the Code?

The updated Edge Function now:
- ✅ Checks if Supabase environment variables exist
- ✅ Logs whether they're available (visible in Edge Function logs)
- ✅ Provides clear error message if missing
- ✅ Helps diagnose the issue

## Expected Result

After redeploying:
- OAuth flow completes successfully
- Redirects back to Settings with success message
- Calendar page shows Google Calendar events
- No more 401 errors! 🎉

---

**TL;DR**: The Edge Function needs to be deployed (or redeployed) with the latest code that has better error handling. Deploy it from the Supabase Dashboard using the code from your repo.
