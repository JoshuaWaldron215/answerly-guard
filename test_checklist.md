# DetailPilot Testing Checklist

Before deploying to production, test these:

## ✅ Database Setup
- [ ] Open Supabase SQL Editor: https://supabase.com/dashboard/project/gyqezbnqkkgskmhsnzgw/sql/new
- [ ] Copy all of `supabase/migrations/20260115_initial_schema.sql`
- [ ] Paste and click "Run"
- [ ] See: "Success. No rows returned"
- [ ] Check Table Editor - see `users`, `calls`, `sms_log` tables

## ✅ Frontend Tests (http://localhost:8080)

### Landing Page
- [ ] Open http://localhost:8080
- [ ] See beautiful landing page
- [ ] Click theme toggle (dark/light mode works)
- [ ] Scroll to pricing section
- [ ] Click "Start Free Trial" → goes to /signup

### Signup Flow
- [ ] Fill out signup form
  - Business Name: Test Detailing Co
  - Email: youremail@gmail.com
  - Password: test123456
- [ ] Click "Start Free Trial"
- [ ] See success message
- [ ] Check email for verification link
- [ ] Click verification link
- [ ] Redirected to /onboarding

### Onboarding
- [ ] Step 1: Fill business basics
- [ ] Step 2: Set business hours
- [ ] Step 3: Select services
- [ ] Step 4: Add booking link
- [ ] Step 5: Review
- [ ] Complete onboarding
- [ ] Redirected to /dashboard

### Dashboard
- [ ] Dashboard loads without errors
- [ ] Stats show: 0, 0, 0, 0 (correct - no calls yet)
- [ ] Activity feed is empty
- [ ] No console errors (press F12)
- [ ] Refresh page - still logged in

### Auth Test
- [ ] Try to access /dashboard in incognito window
- [ ] Should redirect to /login (protected route works!)
- [ ] Login with credentials
- [ ] Dashboard loads

## ✅ Database Tests

### Check Data Saved
- [ ] Go to Supabase Dashboard → Table Editor
- [ ] Click "users" table
- [ ] See your user record
- [ ] Verify business_name is correct

### Optional: Add Test Call
- [ ] Get your user ID: Run `SELECT auth.uid();` in SQL editor
- [ ] Copy the UUID
- [ ] Edit `test_data.sql` - replace YOUR_USER_ID with your UUID
- [ ] Run `test_data.sql` in SQL Editor
- [ ] Refresh dashboard
- [ ] Should now see: Total Calls: 1, Hot Leads: 1
- [ ] Activity feed shows 1 item

## ✅ Console Check (F12 → Console)
- [ ] No red errors
- [ ] No CORS errors
- [ ] No authentication errors
- [ ] Supabase connected successfully

## ✅ Network Check (F12 → Network)
- [ ] API calls to supabase.co succeed (200 status)
- [ ] Auth requests succeed
- [ ] No 401/403 errors

---

## 🎉 If All Above Pass:

Your SaaS is ready for:
1. **Edge Functions deployment** (Vapi, SMS, AI webhooks)
2. **Production deployment** (Vercel)
3. **Vapi configuration** (AI call answering)
4. **Twilio setup** (SMS automation)

---

## 🐛 Troubleshooting

### "Can't reach localhost"
```bash
# Check if dev server is running
ps aux | grep vite

# Restart dev server
npm run dev
```

### "Unauthorized" errors
```bash
# Check .env file has correct keys
cat .env

# Should have:
# VITE_SUPABASE_URL=https://gyqezbnqkkgskmhsnzgw.supabase.co
# VITE_SUPABASE_ANON_KEY=eyJhbGc...
```

### Dashboard shows errors
```bash
# Check browser console (F12)
# Check Supabase tables exist
# Run migration again if needed
```

### Can't sign up
```bash
# Check Supabase Auth settings
# Confirm email verification is enabled
# Check spam folder for verification email
```

---

## ✅ Ready to Move On When:

- [ ] All frontend tests pass
- [ ] All database tests pass
- [ ] No console errors
- [ ] Can signup, login, see dashboard
- [ ] Data persists (refresh works)

**Then proceed to:** Deploy Edge Functions & Vapi setup
