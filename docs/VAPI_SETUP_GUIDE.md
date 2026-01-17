# Vapi AI Setup Guide - DetailPilot AI

This guide will walk you through setting up Vapi AI voice receptionist for DetailPilot.

## Prerequisites

- Vapi.ai account (sign up at https://vapi.ai)
- Supabase project (already configured)
- Phone number to receive calls (can be purchased through Vapi)

## Step 1: Create Vapi Account

1. Go to https://vapi.ai and sign up
2. Add payment method (Vapi charges per minute of call time)
3. Note your credentials:
   - Public Key: `602440a9-daf6-4dac-9501-f7e7311de665` (already in code)
   - Private API Key: (keep this secret!)

## Step 2: Purchase/Configure Phone Number

1. In Vapi dashboard, go to **Phone Numbers**
2. Either:
   - **Option A**: Buy a new number through Vapi ($1-2/month)
   - **Option B**: Port your existing business number to Vapi
   - **Option C**: Use Vapi's forwarding feature (call Vapi number, it forwards to you with AI answering when you don't pick up)

3. **Important**: Copy the Phone Number ID (not the actual number)
   - Example: `pn_abc123xyz`
   - You'll need this for the database

## Step 3: Create AI Assistant

1. Go to **Assistants** in Vapi dashboard
2. Click **Create Assistant**
3. Use these settings:

### Basic Settings
- **Name**: DetailPilot Auto Detailing Assistant
- **First Message**: "Thanks for calling! I'm the AI assistant. How can I help you today?"
- **Model**: `gpt-4o-mini` (fast and cheap)
- **Voice**: Choose from:
  - `nova` (friendly female - recommended for auto detailing)
  - `onyx` (professional male)
  - `alloy` (neutral)

### System Prompt
```
You are a friendly AI receptionist for an auto detailing business. Your job is to:

1. Greet callers warmly
2. Ask for their name and phone number
3. Ask about their vehicle (year, make, model)
4. Ask what service they're interested in:
   - Full Detail ($150-300)
   - Interior Detail ($75-150)
   - Exterior Detail ($75-150)
   - Ceramic Coating ($500-1500)
   - Paint Correction ($300-800)
5. Ask when they'd like to schedule
6. Collect any special requests or notes

Keep responses SHORT (1-2 sentences max). Be conversational but efficient. If asked about exact pricing, say "It depends on the vehicle size and condition, but I can have the owner call you back with a quote!"

If the caller wants to book immediately, share the booking link.

IMPORTANT: Always be friendly but professional. Never make up information about availability or exact prices.
```

### Function Calling (Advanced)
Add a function to capture lead info:

**Function Name**: `captureLeadInfo`

**Description**: "Captures customer information during the call"

**Parameters**:
```json
{
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "description": "Customer's name"
    },
    "phone": {
      "type": "string",
      "description": "Customer's phone number"
    },
    "vehicle": {
      "type": "object",
      "properties": {
        "year": { "type": "number" },
        "make": { "type": "string" },
        "model": { "type": "string" }
      }
    },
    "service": {
      "type": "string",
      "description": "Service they're interested in"
    },
    "preferredDate": {
      "type": "string",
      "description": "When they want to schedule"
    },
    "notes": {
      "type": "string",
      "description": "Any additional notes"
    }
  }
}
```

4. **Save** the assistant and copy the **Assistant ID**
   - Example: `asst_abc123xyz`

## Step 4: Configure Webhooks

1. In Vapi dashboard, go to **Server Events** or **Webhooks**
2. Click **Add Webhook**
3. Enter webhook URL:
   ```
   https://gyqezbnqkkgskmhsnzgw.supabase.co/functions/v1/vapi-webhook
   ```
4. Select events to listen for:
   - ✅ `end-of-call-report` (REQUIRED)
   - ✅ `status-update` (optional)
   - ✅ `transcript` (optional)

5. Save!

## Step 5: Deploy Edge Function

### Via Supabase Dashboard (Easiest)

1. Go to: https://supabase.com/dashboard/project/gyqezbnqkkgskmhsnzgw
2. Navigate to **Edge Functions**
3. Click **New Function**
4. Name: `vapi-webhook`
5. Copy the code from `supabase/functions/vapi-webhook/index.ts`
6. Click **Deploy**

### Via CLI (Advanced)

```bash
# Install Supabase CLI
brew install supabase/tap/supabase  # macOS
# OR
curl -fsSL https://raw.githubusercontent.com/supabase/cli/main/scripts/install | sh  # Linux/WSL

# Login and link project
supabase login
supabase link --project-ref gyqezbnqkkgskmhsnzgw

# Deploy
supabase functions deploy vapi-webhook
```

## Step 6: Update Database

Add your Vapi phone number ID to the database:

```sql
-- Go to Supabase SQL Editor and run:
UPDATE users
SET
  vapi_phone_number = 'pn_abc123xyz',  -- Your Vapi phone number ID
  vapi_assistant_id = 'asst_abc123xyz'  -- Your assistant ID
WHERE id = 'your-user-id';
```

Or use the Settings page in the app to update these values!

## Step 7: Test It!

1. Call your Vapi phone number
2. Have a conversation with the AI
3. Hang up
4. Check:
   - Supabase Edge Function logs (should show webhook received)
   - `calls` table in database (should have new row)
   - Your email (should receive notification - once email is configured)
   - Dashboard (should show the new call)

## Troubleshooting

### AI doesn't answer
- Check that the assistant is assigned to the phone number in Vapi
- Verify the phone number is active

### Calls not appearing in database
- Check Edge Function logs in Supabase
- Verify webhook URL is correct in Vapi
- Make sure `vapi_phone_number` in database matches your Vapi phone number ID

### Poor call quality
- Try different voices in Vapi
- Adjust the "responsiveness" setting (lower = AI waits longer before responding)
- Shorten the system prompt

### AI gives wrong information
- Update the system prompt to be more specific
- Add FAQ topics in the assistant settings
- Use function calling to capture structured data

## Costs

### Vapi Pricing (as of 2024)
- **Phone Number**: $1-2/month
- **Voice Calls**: ~$0.05-0.15/minute (depends on model and voice)
- **Example**: 100 calls/month × 3 min avg = $15-45/month

### Optimization Tips
- Use `gpt-4o-mini` instead of `gpt-4` (10x cheaper)
- Keep conversations short and focused
- Set max call duration (e.g., 10 minutes)

## Next Steps

1. ✅ Set up Vapi account
2. ✅ Configure phone number
3. ✅ Create AI assistant
4. ✅ Deploy webhook
5. ✅ Update database
6. ✅ Test end-to-end
7. 🔜 Configure email notifications (Resend integration)
8. 🔜 Set up SMS follow-ups (Pillar 3)
9. 🔜 Build AI Dashboard chat (Pillar 2)

## Support

- Vapi docs: https://docs.vapi.ai
- Vapi Discord: https://discord.gg/vapi
- DetailPilot support: (coming soon)
