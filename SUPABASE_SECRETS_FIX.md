# Supabase Edge Function Secrets - Quick Fix

## ❌ The Error You're Seeing

When trying to add `SUPABASE_URL` or `SUPABASE_SERVICE_ROLE_KEY`, you get:
```
Name must not start with the SUPABASE_ prefix
```

## ✅ The Solution: You Don't Need To Add Them!

Supabase **automatically provides** these environment variables to all Edge Functions. You can't (and shouldn't) add them manually.

## What You Actually Need To Add

Only add these **4 secrets**:

1. `GOOGLE_CLIENT_ID` = `810153537787-ndchbqqmfhmlcb7eiaqlemv4lqp8rpjc.apps.googleusercontent.com`
2. `GOOGLE_CLIENT_SECRET` = `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`
3. `GOOGLE_REDIRECT_URI` = `https://gyqezbnqkkgskmhsnzgw.supabase.co/functions/v1/google-calendar-oauth`
4. `FRONTEND_URL` = `https://detailpulse.io` (or `http://localhost:5173` for local testing)

That's it! **Do NOT add** `SUPABASE_URL` or `SUPABASE_SERVICE_ROLE_KEY` - they're already there automatically.

## How To Add The 4 Secrets

1. Go to [Supabase Edge Function Settings](https://supabase.com/dashboard/project/gyqezbnqkkgskmhsnzgw/settings/functions)
2. Scroll to **Secrets** section
3. Click **Add another**
4. Add each of the 4 secrets above
5. Click **Bulk save**

## Why This Works

Supabase Edge Functions have access to these variables automatically:
- `SUPABASE_URL` - Your project URL
- `SUPABASE_SERVICE_ROLE_KEY` - Service role key for database access
- `SUPABASE_ANON_KEY` - Anonymous key

They're injected at runtime, so your code can use them without you adding them manually.

## Test After Adding The 4 Secrets

1. Make sure you added the 4 Google secrets (and ONLY those 4)
2. Go to Settings → Google Calendar Integration
3. Click "Connect Google Calendar"
4. Should work now! ✅

---

If you still get the 401 error after adding only the 4 secrets, the issue might be with the Edge Function deployment. Try redeploying it from the Supabase dashboard.
