# Fix: "Missing authorization header" Error (401)

## Problem
When connecting Google Calendar, you get:
```json
{"code":401,"message":"Missing authorization header"}
```

This means the Edge Function can't access the Supabase database to store tokens.

## Solution: Add Supabase Environment Variables

### Step 1: Get Your Service Role Key

1. Go to [Supabase Project Settings - API](https://supabase.com/dashboard/project/gyqezbnqkkgskmhsnzgw/settings/api)
2. Scroll to **Project API keys**
3. Find **`service_role` secret**
4. Click "Reveal" and copy the key (starts with `eyJhbGc...`)

### Step 2: Add to Edge Function Secrets

1. Go to [Edge Function Settings](https://supabase.com/dashboard/project/gyqezbnqkkgskmhsnzgw/settings/functions)
2. Scroll to **Secrets** section
3. Add these **2 additional secrets**:

| Secret Name | Secret Value |
|------------|--------------|
| `SUPABASE_URL` | `https://gyqezbnqkkgskmhsnzgw.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | `<paste your service_role key from Step 1>` |

4. Click **Save** after adding each one

### Step 3: Redeploy Edge Function (Optional)

Supabase should pick up the new environment variables automatically, but if it doesn't work:

1. Go to [Edge Functions](https://supabase.com/dashboard/project/gyqezbnqkkgskmhsnzgw/functions)
2. Find `google-calendar-oauth`
3. Click **Redeploy**

### Step 4: Test Again

1. Go to Settings → Google Calendar Integration
2. Click "Connect Google Calendar"
3. Grant permissions
4. Should now redirect back successfully! ✅

---

## All Edge Function Secrets (Complete List)

You should have **6 secrets** total:

```
GOOGLE_CLIENT_ID=810153537787-ndchbqqmfhmlcb7eiaqlemv4lqp8rpjc.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
GOOGLE_REDIRECT_URI=https://gyqezbnqkkgskmhsnzgw.supabase.co/functions/v1/google-calendar-oauth
FRONTEND_URL=https://detailpulse.io
SUPABASE_URL=https://gyqezbnqkkgskmhsnzgw.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<your service role key>
```

---

## Why This Happens

Supabase _should_ automatically inject `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` into Edge Functions, but sometimes they need to be set explicitly.

The service role key allows the Edge Function to bypass Row Level Security (RLS) and write to the database on behalf of any user.

---

Once you add these 2 secrets, the OAuth flow should work perfectly! 🎉
