# Pillar 1 (AI Voice Receptionist) - Complete Testing Guide

## 🎯 What We're Testing

The full flow: Vapi phone number → AI answers → Call data saved → Shows in dashboard

---

## ✅ Pre-Testing Checklist

Before you start, make sure:

- [ ] You have a Vapi.ai account (free trial works)
- [ ] You completed onboarding Step 5 (Vapi Setup)
- [ ] Database migration has been run
- [ ] Webhook handler (`vapi-webhook`) is deployed to Supabase

---

## 📞 Step 1: Get Your Test Phone Number

### Option A: Buy a Vapi Number (Recommended - $1/month)

1. Go to [Vapi Dashboard](https://vapi.ai/dashboard)
2. Click **Phone Numbers** → **Buy Number**
3. Select **United States** → Choose area code
4. Click **Purchase** (~$1-2/month)
5. Copy your new number (e.g., `+1 555-123-4567`)

### Option B: Use Vapi's Test Number (Free)

1. Go to Vapi Dashboard → **Assistants**
2. Click your assistant → **Test**
3. Use the test call feature
4. Note: This won't test the full webhook flow

**For real testing, use Option A.**

---

## 🤖 Step 2: Create Your AI Assistant

1. **Go to Vapi Dashboard** → **Assistants** → **Create Assistant**

2. **Basic Info:**
   - Name: `DetailPilotAI Receptionist`
   - Description: `24/7 AI receptionist for auto detailing business`

3. **Voice Settings:**
   - Provider: `OpenAI`
   - Voice: `nova` (or any voice you selected in Settings)
   - Speed: `1.0`

4. **Model:**
   - Provider: `OpenAI`
   - Model: `gpt-4o` (or `gpt-3.5-turbo` for cheaper testing)
   - Temperature: `0.7`

5. **System Prompt** (CRITICAL - Copy this exactly):

```
You are a friendly receptionist for [YOUR BUSINESS NAME], a professional auto detailing service.

Your job is to:
1. Greet callers warmly
2. Find out what service they need (basic wash, full detail, ceramic coating, etc.)
3. Ask about their vehicle (make, model, year)
4. Ask when they'd like to come in
5. Get their contact info (name and phone number)
6. Tell them you'll have the owner call them back to confirm

BE CONVERSATIONAL. Don't sound robotic. Be helpful and friendly.

IMPORTANT: Always extract:
- Caller's name
- Vehicle make, model, year
- Service they want
- Preferred date/time

At the end, say: "Perfect! I'll have [OWNER NAME] give you a call back within the hour to confirm your appointment. Thanks for calling!"
```

6. **First Message:**
```
Hi! Thanks for calling [YOUR BUSINESS NAME]. This is our AI assistant. How can I help you today?
```

7. **End Call Conditions:**
   - Enable: "End call if customer says goodbye"
   - Enable: "End call after 5 minutes of silence"

8. **Save Assistant**

---

## 🔗 Step 3: Connect Phone Number to Assistant

1. **Go to Phone Numbers** in Vapi dashboard
2. Click your purchased number
3. Under **Assistant**, select your `DetailPilotAI Receptionist`
4. Under **Webhook URL**, paste:
   ```
   https://gyqezbnqkkgskmhsnzgw.supabase.co/functions/v1/vapi-webhook
   ```
5. **Save Changes**

---

## 🔧 Step 4: Configure DetailPilotAI Settings

1. **Log into DetailPulse.io**
2. **Go to Settings** → **Voice AI Configuration**
3. **Paste your Vapi phone number:**
   ```
   +1 555-123-4567
   ```
4. **Select your voice** (should match Vapi assistant)
5. **Click Save**

---

## 📱 Step 5: Make a Test Call

### Test Script (Act Like a Customer)

Call your Vapi number and say:

```
[AI]: "Hi! Thanks for calling Pristine Auto Detailing..."

[YOU]: "Hey, yeah I'm looking to get my car detailed."

[AI]: "Great! What kind of vehicle do you have?"

[YOU]: "It's a 2018 Tesla Model 3"

[AI]: "Perfect! What service are you looking for?"

[YOU]: "I want a full interior and exterior detail"

[AI]: "Awesome! When would you like to come in?"

[YOU]: "This Friday afternoon if possible"

[AI]: "And can I get your name and phone number?"

[YOU]: "Sure, it's Mike Thompson, 555-867-5309"

[AI]: "Perfect! I'll have [owner] call you back..."

[YOU]: "Thanks, bye!"
```

### What Should Happen:

1. ✅ AI answers immediately
2. ✅ Conversation flows naturally
3. ✅ AI extracts all the info
4. ✅ Call ends smoothly
5. ✅ **Within 30 seconds, call appears in your dashboard!**

---

## 🔍 Step 6: Verify Data in DetailPulse

### Check Dashboard

1. **Go to Dashboard**
   - Should see call count increment
   - Should see Mike Thompson in recent activity

### Check Calls & Leads

1. **Go to Calls & Leads**
2. **Find your test call**
3. **Verify data:**
   - ✅ Name: Mike Thompson
   - ✅ Phone: 555-867-5309
   - ✅ Vehicle: 2018 Tesla Model 3
   - ✅ Service: Full interior and exterior detail
   - ✅ Preferred Date: This Friday afternoon
   - ✅ Intent: HIGH (because they want to book)
   - ✅ Transcript available

4. **Click on the call** → Review full conversation

### Check Calendar

1. **Go to Calendar**
2. If AI marked as "booked", should appear on calendar
3. Verify date is correct

---

## 🐛 Troubleshooting

### Issue: Call doesn't appear in dashboard

**Check:**
1. Webhook URL is correct in Vapi dashboard
2. Edge Function `vapi-webhook` is deployed
3. Check Supabase Edge Function logs:
   - Go to Supabase → Edge Functions → vapi-webhook → Logs
   - Look for errors

### Issue: AI doesn't answer

**Check:**
1. Phone number is assigned to the assistant
2. Assistant is saved and active
3. Vapi account has credits

### Issue: Data is incomplete (missing name, vehicle, etc.)

**Problem**: AI didn't extract the info properly

**Fix**:
1. Improve system prompt with more explicit instructions
2. Make conversation more structured
3. Test with clearer/slower speech

### Issue: AI sounds robotic

**Fix**:
1. Try different voices (nova, alloy, shimmer)
2. Adjust temperature (higher = more creative)
3. Improve system prompt to be more conversational

---

## 🎯 Success Criteria

After testing, you should have:

- ✅ Working Vapi phone number
- ✅ AI answers calls 24/7
- ✅ Call data appears in dashboard within 30 seconds
- ✅ All info extracted (name, vehicle, service, date)
- ✅ Can listen to call recording
- ✅ Can view full transcript

---

## 💰 Cost Estimate

**Monthly Costs:**
- Vapi phone number: $1-2/month
- Vapi usage: ~$0.05-0.10 per minute
- OpenAI (via Vapi): ~$0.01-0.02 per call

**Example:**
- 100 calls/month @ 3 min avg = $15-20/month total
- For a business, this is CHEAP (saves hours of work)

---

## 📊 What to Test Next

Once basic flow works:

1. **Test different scenarios:**
   - Customer wants pricing
   - Customer asks about hours
   - Customer is just browsing
   - Customer wants to reschedule

2. **Test edge cases:**
   - Hang up mid-conversation
   - Background noise
   - Multiple people on call
   - Non-English speaker

3. **Test forwarding:**
   - Set up call forwarding from your real business number
   - Test that real customers get AI

---

## 🚀 Going Live

When ready for production:

1. **Forward your real business number** to Vapi number
2. **Train your AI** with your actual services, pricing, hours
3. **Monitor calls daily** for first week
4. **Adjust prompts** based on real conversations
5. **Set up email notifications** for hot leads

---

**You're now testing Pillar 1!** 🎉

The beauty is: Once this works, you have a 24/7 AI receptionist that NEVER misses a call, captures ALL lead info, and frees up your time.

**Next:** After Pillar 1 works, move to Pillar 2 (AI Dashboard Co-Pilot) or Pillar 3 (Native SMS Closer).
