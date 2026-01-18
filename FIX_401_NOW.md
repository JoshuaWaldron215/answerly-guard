# Fix OAuth 401 Error - Do These Steps RIGHT NOW

The 401 error happens because the Edge Function can't access the database. Follow these exact steps:

---

## ✅ Step 1: Get Your Service Role Key

1. Open this link: **https://supabase.com/dashboard/project/gyqezbnqkkgskmhsnzgw/settings/api**

2. Scroll down to **"Project API keys"**

3. Find the row that says **`service_role`** (marked as "secret")

4. Click the **eye icon** (👁️) to reveal the key

5. **Copy the entire key** - it's a long string starting with `eyJ...`

---

## ✅ Step 2: Add It as a Secret

1. Open this link: **https://supabase.com/dashboard/project/gyqezbnqkkgskmhsnzgw/settings/functions**

2. Scroll to the **"Secrets"** section

3. You should see your existing 4 secrets (GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, etc.)

4. Click **"Add another"**

5. In the **Name** field, type: `SERVICE_ROLE_KEY` (exactly like that, all caps)

6. In the **Value** field, paste the service role key you copied in Step 1

7. Click **"Bulk save"** button at the bottom

---

## ✅ Step 3: Redeploy the Edge Function

1. Open this link: **https://supabase.com/dashboard/project/gyqezbnqkkgskmhsnzgw/functions**

2. Click on **`google-calendar-oauth`** in the list

3. Click **"Edit function"** button

4. You'll see a code editor

5. **Delete ALL the code** in the editor

6. Open your repo file: `supabase/functions/google-calendar-oauth/index.ts`

7. **Copy ALL the code** from that file (all 140 lines)

8. **Paste it** into the Supabase editor

9. Click **"Deploy"** button

10. Wait for "Deployed successfully" message

---

## ✅ Step 4: Test Again

1. Go to your app: **http://localhost:5173**

2. Go to **Settings**

3. Scroll to **Google Calendar Integration**

4. Click **"Connect Google Calendar"**

5. Grant permissions

6. **Should redirect back successfully!** ✅

---

## 🔍 If It STILL Fails

If you still get a 401 error after doing ALL the steps above:

1. Go to: **https://supabase.com/dashboard/project/gyqezbnqkkgskmhsnzgw/functions**

2. Click on **`google-calendar-oauth`**

3. Click **"Logs"** tab

4. Try connecting Google Calendar ONE MORE TIME

5. Go back to the Logs tab immediately

6. You should see a log entry with `Environment check:`

7. Screenshot the logs and share them

---

## Checklist

Before testing, make sure:

- [ ] You copied the service_role key from Project Settings → API
- [ ] You added SERVICE_ROLE_KEY secret in Edge Functions → Secrets
- [ ] You clicked "Bulk save" after adding the secret
- [ ] You redeployed the function with the updated code from your repo
- [ ] The deployment showed "Deployed successfully"

If all 5 checkboxes are ✅, it WILL work!

---

**TL;DR**: Add SERVICE_ROLE_KEY secret (from API settings) → Redeploy function with latest code → Test
