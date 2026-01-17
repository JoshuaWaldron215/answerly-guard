# Vapi Webhook Edge Function

This Edge Function receives webhooks from Vapi.ai when calls are completed and saves the call data to the database.

## Deployment

### Option 1: Deploy via Supabase Dashboard

1. Go to your Supabase project dashboard: https://supabase.com/dashboard/project/gyqezbnqkkgskmhsnzgw
2. Navigate to **Edge Functions**
3. Click **Deploy a new function**
4. Name it: `vapi-webhook`
5. Copy and paste the contents of `index.ts`
6. Deploy!

### Option 2: Deploy via Supabase CLI

```bash
# Install Supabase CLI (if not already installed)
brew install supabase/tap/supabase  # macOS
# OR for Linux/WSL
curl -fsSL https://raw.githubusercontent.com/supabase/cli/main/scripts/install | sh

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref gyqezbnqkkgskmhsnzgw

# Deploy the function
supabase functions deploy vapi-webhook
```

## Configuration

After deployment, you'll get a webhook URL that looks like:
```
https://gyqezbnqkkgskmhsnzgw.supabase.co/functions/v1/vapi-webhook
```

### Configure Vapi to Send Webhooks

1. Go to Vapi dashboard: https://vapi.ai
2. Navigate to your Assistant settings
3. Under "Server Events" or "Webhooks", add the webhook URL above
4. Select the `end-of-call-report` event
5. Save!

## Testing

You can test the webhook locally using curl:

```bash
curl -X POST https://gyqezbnqkkgskmhsnzgw.supabase.co/functions/v1/vapi-webhook \
  -H "Content-Type: application/json" \
  -d '{
    "message": {
      "type": "end-of-call-report",
      "call": {
        "id": "test-call-123",
        "phoneNumberId": "your-vapi-phone-number-id",
        "customer": {
          "number": "+15551234567"
        },
        "startedAt": "2024-01-01T00:00:00Z",
        "endedAt": "2024-01-01T00:05:00Z",
        "messages": [],
        "summary": "Test call",
        "analysis": {
          "summary": "Customer asked about pricing"
        }
      }
    }
  }'
```

## What This Function Does

1. Receives webhook from Vapi when a call ends
2. Extracts call data:
   - Caller name
   - Phone number
   - Vehicle information (make, model, year)
   - Service requested
   - Preferred date
   - Call duration, transcript, and summary
3. Finds the user based on their Vapi phone number
4. Saves the call to the `calls` table in Supabase
5. Sends an email notification to the business owner (when integrated)

## Environment Variables

The function uses these environment variables (automatically available in Supabase):
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` - Service role key (has admin access)

## Troubleshooting

### "User not found" error
- Make sure the `vapi_phone_number` field in the `users` table matches the phone number ID from Vapi
- Check the Vapi dashboard to find your phone number ID

### Calls not appearing in dashboard
- Check the Supabase Edge Function logs for errors
- Verify the webhook is configured correctly in Vapi
- Make sure RLS policies allow the service role to insert calls

### Testing locally
```bash
supabase functions serve vapi-webhook
```

Then use curl to send test webhooks to `http://localhost:54321/functions/v1/vapi-webhook`
