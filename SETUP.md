# DetailPilot Setup Guide

Complete setup instructions to get DetailPilot running with Supabase.

---

## 🚀 Quick Overview

DetailPilot is now built with:
- **Frontend**: React + TypeScript + Vite (existing)
- **Backend**: Supabase (PostgreSQL + Auth + Edge Functions)
- **Integrations**: Vapi AI, Twilio SMS, OpenAI

**Total setup time**: ~30-45 minutes

---

## 📋 Prerequisites

Before starting, create accounts on:

1. **Supabase** - https://supabase.com (FREE)
2. **Vapi AI** - https://vapi.ai (starts at $0.05/min)
3. **Twilio** - https://twilio.com ($15 credit, then ~$2/mo)
4. **OpenAI** - https://platform.openai.com (pay-as-you-go)

---

## Step 1: Supabase Setup (10 mins)

### 1.1 Create Supabase Project

1. Go to https://supabase.com/dashboard
2. Click "New Project"
3. Name: `detailpilot`
4. Database Password: (save this somewhere secure)
5. Region: Choose closest to your users
6. Click "Create new project"
7. Wait 2-3 minutes for project to be ready

### 1.2 Run Database Migration

1. In Supabase Dashboard, go to **SQL Editor**
2. Click "New Query"
3. Copy the entire contents of `supabase/migrations/20260115_initial_schema.sql`
4. Paste into the SQL editor
5. Click "Run"
6. You should see: "Success. No rows returned"

### 1.3 Get Supabase Keys

1. Go to **Project Settings** (gear icon in sidebar)
2. Go to **API** section
3. Copy these values:

```
Project URL: https://xxxxx.supabase.co
anon/public key: eyJhbGc...
```

### 1.4 Configure Environment Variables

Create a `.env` file in the project root:

```bash
# Copy from .env.example
cp .env.example .env
```

Add your Supabase credentials:

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
```

---

## Step 2: Deploy Supabase Edge Functions (15 mins)

Edge Functions are serverless functions that handle webhooks from Vapi, Twilio, etc.

### 2.1 Install Supabase CLI

**Mac/Linux:**
```bash
brew install supabase/tap/supabase
```

**Windows:**
```bash
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase
```

Or download from: https://github.com/supabase/cli/releases

### 2.2 Login to Supabase

```bash
supabase login
```

This will open a browser window. Authorize the CLI.

### 2.3 Link Your Project

```bash
supabase link --project-ref YOUR_PROJECT_REF
```

Find your project ref in the URL: `https://supabase.com/dashboard/project/YOUR_PROJECT_REF`

### 2.4 Set Edge Function Secrets

```bash
# Twilio credentials
supabase secrets set TWILIO_ACCOUNT_SID=your_twilio_sid
supabase secrets set TWILIO_AUTH_TOKEN=your_twilio_token
supabase secrets set TWILIO_PHONE_NUMBER=+15551234567

# OpenAI key
supabase secrets set OPENAI_API_KEY=your_openai_key

# Vapi key (optional, for advanced features)
supabase secrets set VAPI_API_KEY=your_vapi_key
```

### 2.5 Deploy Edge Functions

```bash
# Deploy all functions at once
supabase functions deploy vapi-webhook
supabase functions deploy send-sms
supabase functions deploy ai-assistant
```

You should see:
```
✓ vapi-webhook deployed successfully
✓ send-sms deployed successfully
✓ ai-assistant deployed successfully
```

### 2.6 Get Edge Function URLs

Your Edge Functions are now live at:

```
https://xxxxx.supabase.co/functions/v1/vapi-webhook
https://xxxxx.supabase.co/functions/v1/send-sms
https://xxxxx.supabase.co/functions/v1/ai-assistant
```

Save these URLs - you'll need them for Vapi configuration.

---

## Step 3: Vapi AI Configuration (10 mins)

### 3.1 Create Vapi Assistant

1. Go to https://vapi.ai/dashboard
2. Click "Create Assistant"
3. Configure:

**Basic Settings:**
- Name: `DetailPilot Receptionist`
- Voice: Select "Alloy" or "Coral" (natural voices)
- First Message: `"Thanks for calling! How can I help you today?"`

**System Prompt:**
```
You are a friendly receptionist for an auto detailing business.

Your job:
1. Greet the caller warmly
2. Ask what service they need (full detail, interior, exterior, ceramic coating, etc.)
3. Ask about their vehicle (year, make, model)
4. Ask when they'd like to come in
5. Get their name and phone number
6. Thank them and let them know they'll receive a booking link via text

Be conversational, friendly, and professional. Keep responses concise.
```

**Function Calling** - Add this function:
```json
{
  "name": "captureLeadInfo",
  "description": "Capture lead information from the call",
  "parameters": {
    "type": "object",
    "properties": {
      "name": {
        "type": "string",
        "description": "Caller's name"
      },
      "phone": {
        "type": "string",
        "description": "Caller's phone number"
      },
      "vehicle": {
        "type": "object",
        "properties": {
          "make": { "type": "string" },
          "model": { "type": "string" },
          "year": { "type": "integer" }
        }
      },
      "service": {
        "type": "string",
        "description": "Requested service"
      },
      "preferredDate": {
        "type": "string",
        "description": "When they want to come in"
      }
    },
    "required": ["name", "phone", "service"]
  }
}
```

**Webhook URL:**
```
https://xxxxx.supabase.co/functions/v1/vapi-webhook
```

4. Click "Save"
5. Copy the **Assistant ID** (you'll need this later)

### 3.2 Get a Vapi Phone Number

1. In Vapi Dashboard, go to **Phone Numbers**
2. Click "Buy Number"
3. Choose a local number (costs ~$2/mo)
4. Assign it to your assistant
5. This is the number customers will call!

### 3.3 Test Your AI

1. Call the Vapi number you just purchased
2. Have a conversation with the AI
3. Check Supabase Dashboard → **Table Editor** → **calls** table
4. You should see your test call appear!
5. Check your phone - you should get an SMS with a booking link

---

## Step 4: Twilio SMS Setup (5 mins)

### 4.1 Get Twilio Credentials

1. Go to https://console.twilio.com
2. Sign up (get $15 free credit)
3. From dashboard, copy:
   - Account SID
   - Auth Token
4. Go to **Phone Numbers** → **Buy a number**
5. Buy a local number (costs ~$2/mo)

### 4.2 Add to Environment

You already added these in Step 2.4, but verify:

```bash
supabase secrets list
```

Should show:
- TWILIO_ACCOUNT_SID
- TWILIO_AUTH_TOKEN
- TWILIO_PHONE_NUMBER

---

## Step 5: Frontend Deployment (5 mins)

### 5.1 Deploy to Vercel (Recommended)

**Option A: Via Vercel CLI**
```bash
npm install -g vercel
vercel
```

**Option B: Via GitHub**
1. Push code to GitHub
2. Go to https://vercel.com
3. Import your repository
4. Add environment variables:
   - VITE_SUPABASE_URL
   - VITE_SUPABASE_ANON_KEY
5. Deploy!

### 5.2 Update Supabase Auth Settings

1. Go to Supabase Dashboard → **Authentication** → **URL Configuration**
2. Add your Vercel URL to:
   - Site URL: `https://your-app.vercel.app`
   - Redirect URLs: `https://your-app.vercel.app/**`

---

## Step 6: Test Everything (5 mins)

### 6.1 End-to-End Test

1. **Call your Vapi number**
   - AI should answer
   - Have a full conversation
   - Provide name, phone, vehicle info

2. **Check SMS**
   - You should receive an SMS with booking link
   - Click the link (should open Calendly or your booking page)

3. **Check Dashboard**
   - Go to `https://your-app.vercel.app`
   - Sign up with your email
   - Complete onboarding
   - Go to Dashboard
   - You should see your test call!

4. **Test AI Assistant**
   - In Dashboard, click the AI assistant icon
   - Ask: "What should I focus on today?"
   - AI should analyze your calls and give advice

### 6.2 Troubleshooting

**AI not answering calls?**
- Check Vapi dashboard for call logs
- Verify webhook URL is correct
- Check Supabase Edge Functions logs

**SMS not sending?**
- Check Twilio console for errors
- Verify TWILIO_PHONE_NUMBER format (+15551234567)
- Check Supabase logs: `supabase functions logs send-sms`

**Dashboard not loading data?**
- Check browser console for errors
- Verify VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env
- Check Supabase Table Editor - is data there?

**Auth not working?**
- Check Supabase Auth settings (redirect URLs)
- Clear browser cookies and try again

---

## 📊 Usage & Costs

### Monthly Costs (estimated for 50 customers)

| Service | Cost | Usage |
|---------|------|-------|
| Supabase | FREE | Up to 500MB database |
| Vapi AI | $25-50/mo | ~500-1000 minutes of calls |
| Twilio SMS | $1-5/mo | ~100-500 SMS sent |
| Twilio Phone | $2/mo | Phone number rental |
| OpenAI | $2-5/mo | AI assistant chats |
| Vercel Hosting | FREE | Unlimited bandwidth |
| **TOTAL** | **$30-65/mo** | |

**Revenue per customer**: $99/mo
**Gross margin**: ~70% ($69 profit per customer)

---

## 🔐 Security Best Practices

1. **Never commit .env files** - Already in .gitignore
2. **Use Row Level Security** - Already enabled in schema
3. **Keep Supabase keys secret** - Use Vercel env vars, not hardcode
4. **Enable email verification** - In Supabase Auth settings
5. **Add rate limiting** - Prevent API abuse (add later)

---

## 🚀 Next Steps

Now that everything is working:

1. **Get Beta Users**
   - Post in auto detailing Facebook groups
   - Offer free 2 months for feedback

2. **Add Stripe** (for payments)
   - Create Stripe account
   - Add checkout flow
   - Connect webhooks

3. **Improve AI Prompt**
   - Listen to real call recordings
   - Refine Vapi system prompt
   - Add more function calls

4. **Build Booking System**
   - Integrate Google Calendar or Calendly
   - Allow real-time booking during calls

5. **Marketing**
   - Create video demo (record Vapi call)
   - Get testimonials from beta users
   - Launch on Product Hunt

---

## 📞 Support

**Issues?**
- Check Supabase logs: `supabase functions logs`
- Check Vapi logs: https://vapi.ai/dashboard/logs
- Check Twilio logs: https://console.twilio.com/monitor

**Need Help?**
- Supabase Discord: https://discord.supabase.com
- Vapi Discord: https://discord.gg/vapi

---

## ✅ Checklist

Before launching to customers:

- [ ] Database migrated successfully
- [ ] Edge Functions deployed
- [ ] Vapi assistant created and tested
- [ ] Twilio SMS working
- [ ] Frontend deployed to Vercel
- [ ] Auth working (signup/login)
- [ ] Test call → SMS → Dashboard flow working
- [ ] AI assistant responding correctly
- [ ] Booking link in SMS (even if just Calendly for now)
- [ ] Error handling tested
- [ ] Mobile responsive checked

---

## 🎉 You're Ready!

Your DetailPilot SaaS is now live and ready for beta users.

**First 10 customers?** Give them 2 months free in exchange for:
- Testimonial
- Screenshot/video of them using it
- Feedback on what to improve

Then launch publicly at $99/mo and scale! 🚀
