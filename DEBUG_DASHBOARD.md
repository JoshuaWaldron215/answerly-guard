# Dashboard Not Updating - Debug Guide

## Issue
After saving business name in Settings, the Dashboard still shows "Dashboard" instead of the business name.

## Root Causes

### 1. Code Not Deployed to Vercel Yet
The fix I just pushed is in your git repository, but Vercel hasn't deployed it yet.

**Check deployment status:**
1. Go to https://vercel.com/joshua-waldrons-projects/answerly-guard
2. Look for latest deployment with commit message "Fix Settings page UX issues"
3. Wait for it to finish deploying (usually 1-2 minutes)

### 2. Missing Business Name in Database
If you signed up BEFORE the business name feature was added, your database record might not have this field set.

**How to check (Chrome DevTools):**
1. Open your app: https://detailpilotai-git-claude-detail-a10d79-joshua-waldrons-projects.vercel.app
2. Open Chrome DevTools (F12)
3. Go to Console tab
4. Paste this code:
```javascript
// Check what's in your user record
const checkUserData = async () => {
  const { data: { user } } = await window.supabase.auth.getUser();
  const { data } = await window.supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single();
  console.log('User data:', data);
  console.log('Business name:', data.business_name);
};
checkUserData();
```

### 3. React Query Cache Not Invalidating
The query invalidation code I added should work, but only AFTER Vercel deploys the new code.

## Quick Fix (For Testing Now)

### Option A: Manual Database Update
1. Go to Supabase: https://supabase.com/dashboard/project/gyqezbnqkkgskmhsnzgw/editor
2. Click on `users` table
3. Find your row (by email)
4. Edit the `business_name` field
5. Save
6. Refresh your app

### Option B: Use Settings Page (After Deployment)
1. Wait for Vercel deployment to complete
2. Go to Settings
3. Enter your business name
4. Click "Save Changes"
5. Go back to Dashboard
6. Should now show business name

## Long-term Solution: Onboarding Flow

You mentioned that business name, phone, and email should be collected during onboarding. Currently:

**What's collected during signup:**
- ✅ Email (required by Supabase auth)
- ✅ Password (required by Supabase auth)
- ✅ Business Name (saved to `users` table)

**What's NOT collected:**
- ❌ Phone number

**To add phone to signup:**
1. Update `src/pages/Signup.tsx` to include phone input
2. Update `AuthContext.tsx` signUp function to save phone
3. This way new users have all data from the start

Would you like me to add a phone number field to the signup form?

## Expected Behavior After Fix

1. **New users**: Business name auto-populates from signup → Shows on Dashboard immediately
2. **Existing users**: Enter business name in Settings → Saves → Dashboard updates immediately
3. **Voice previews**: Work after running `npm run generate-voices`

## Verification Checklist

After Vercel deploys the new code:

- [ ] Go to Settings
- [ ] Enter business name: "Pristine Auto Detailing" (or your business name)
- [ ] Click "Save Changes"
- [ ] See success message
- [ ] Go to Dashboard (without refresh)
- [ ] Business name should appear in header
- [ ] If not, hard refresh (Ctrl+Shift+R)
