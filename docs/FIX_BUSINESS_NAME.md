# Fix: Business Name Not Showing on Dashboard

## 🔍 Issue

After signup/login, Dashboard header shows "Dashboard" instead of your business name.

---

## ✅ Quick Check: Do You Have a Business Name in Database?

### Option 1: Check via Supabase Dashboard

1. Go to [Supabase Table Editor](https://supabase.com/dashboard/project/gyqezbnqkkgskmhsnzgw/editor)
2. Click **users** table
3. Find your user row (by email)
4. Check if **business_name** column has a value

### Option 2: Check via Settings Page

1. Go to **Settings** → **Business Information**
2. Check if **Business Name** field is populated
3. If empty, the database doesn't have it

---

## 🔧 Fix #1: Manual Update (Quickest)

If you already have an account without a business name:

1. **Go to Settings** → **Business Information**
2. **Fill in Business Name**: `Pristine Auto Detailing`
3. **Fill in Phone Number**: `+1 555-123-4567`
4. **Click Save**
5. **Refresh Dashboard** → Name should appear!

---

## 🔧 Fix #2: Database Direct Update (If Settings doesn't work)

### Via Supabase Dashboard:

1. Go to [Supabase Table Editor](https://supabase.com/dashboard/project/gyqezbnqkkgskmhsnzgw/editor)
2. Click **users** table
3. Find your row (search by email)
4. Click **Edit** (pencil icon)
5. Set **business_name** = `Your Business Name`
6. Click **Save**
7. Refresh your app

---

## 🔧 Fix #3: Create New Account (Clean Slate)

If you want to start fresh:

1. **Sign up with a NEW email**
2. **Enter Business Name** during signup
3. **Complete onboarding**
4. Business name will appear on Dashboard ✅

---

## 🐛 Why This Happens

**Scenario A**: You signed up before the business_name field was added to signup

**Scenario B**: There was a database error during signup that prevented the user row from being created

**Scenario C**: RLS (Row Level Security) policy prevented the insert

---

## ✅ Prevention (Already Fixed in Code)

The signup flow NOW correctly saves business_name:

```typescript
// In AuthContext.tsx (line 57-63)
if (data.user) {
  await supabase
    .from('users')
    .insert({
      id: data.user.id,
      email: data.user.email!,
      business_name: businessName, // ← Saves during signup
    });
}
```

**New signups will have business name automatically.**

---

## 🧪 Test It Works

1. **Create test account**:
   - Email: `test+detailpilot@gmail.com`
   - Business: `Test Auto Detailing`
   - Password: `test123`

2. **After signup**, go to Dashboard

3. **Header should say**: `Test Auto Detailing` ✅

---

## 🎯 Success Criteria

After fix:
- ✅ Dashboard header shows your business name
- ✅ Settings → Business Information is pre-filled
- ✅ New signups automatically get business name saved

---

**Current Status**: Dashboard code is CORRECT. Issue is just missing data for existing users. Use Fix #1 (manual update via Settings) to resolve immediately.
