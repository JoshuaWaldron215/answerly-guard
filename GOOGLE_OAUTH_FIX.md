# Fix: Google OAuth "Access Blocked" Error

## Problem
Error 403: "gyqezbnqkkgskmhsnzgw.supabase.co has not completed the Google verification process. The app is currently being tested, and can only be accessed by developer-approved testers."

## Solution: Add Test Users

### Step 1: Go to Google Cloud Console
[OAuth Consent Screen](https://console.cloud.google.com/apis/credentials/consent)

### Step 2: Add Test Users
1. Select your project
2. Click on **OAuth consent screen** (left sidebar)
3. Scroll down to **Test users** section
4. Click **+ ADD USERS**
5. Add your email: `jshawnwaldron@gmail.com`
6. Click **SAVE**

### Step 3: Try Again
Now go back to Settings → Connect Google Calendar and it should work!

## Alternative: Publish Your App (Optional - for production)

If you want anyone to be able to connect (not just test users):

1. Go to **OAuth consent screen**
2. Click **PUBLISH APP**
3. Confirm publishing

**Note**: Google may require verification if you request sensitive scopes, but for basic calendar access during testing, adding test users is sufficient.

---

After adding yourself as a test user, the OAuth flow should work! ✅
