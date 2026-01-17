# Google Calendar OAuth Handler

Edge Function that handles OAuth 2.0 callback from Google Calendar integration.

## What it does

1. Receives authorization code from Google OAuth redirect
2. Exchanges code for access and refresh tokens
3. Fetches user info to get Google email
4. Stores tokens in database
5. Redirects user back to Settings page

## Environment Variables

Set these in Supabase Dashboard or via CLI:

```bash
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_REDIRECT_URI=https://your-project.supabase.co/functions/v1/google-calendar-oauth
FRONTEND_URL=https://your-frontend-url.com
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## Deployment

### Via CLI

```bash
supabase functions deploy google-calendar-oauth
```

### Via Dashboard

1. Go to Supabase Dashboard → Edge Functions
2. Create new function: `google-calendar-oauth`
3. Copy code from `index.ts`
4. Deploy

## Setting Secrets

```bash
supabase secrets set GOOGLE_CLIENT_ID=your-id
supabase secrets set GOOGLE_CLIENT_SECRET=your-secret
supabase secrets set GOOGLE_REDIRECT_URI=https://your-project.supabase.co/functions/v1/google-calendar-oauth
supabase secrets set FRONTEND_URL=https://your-frontend.com
```

## Flow

```
User clicks "Connect Google Calendar"
  ↓
Frontend redirects to Google OAuth
  ↓
User grants permissions
  ↓
Google redirects to this Edge Function
  ↓
Function exchanges code for tokens
  ↓
Tokens stored in database
  ↓
User redirected to Settings with success message
```

## API Endpoints

### GET /google-calendar-oauth

**Query Parameters**:
- `code` (required): Authorization code from Google
- `state` (required): User ID passed in OAuth flow
- `error` (optional): Error from Google if authorization failed

**Success Response**:
- HTTP 302 redirect to `${FRONTEND_URL}/settings?calendar_connected=true`

**Error Response**:
```json
{
  "error": "Error message"
}
```

## Database Updates

Updates `users` table with:
- `google_calendar_token`: Access token
- `google_calendar_refresh_token`: Refresh token
- `google_calendar_token_expires_at`: Expiration timestamp
- `google_calendar_connected_at`: Connection timestamp
- `google_calendar_email`: User's Google email

## Testing

### Local Testing

```bash
# Start Supabase functions locally
supabase functions serve google-calendar-oauth

# Test OAuth flow
# 1. Set up ngrok to tunnel to localhost
ngrok http 54321

# 2. Update Google Cloud Console redirect URI to ngrok URL
# 3. Test OAuth flow through frontend
```

### Production Testing

1. Deploy function
2. Update Google Cloud Console with production redirect URI
3. Test through frontend Settings page

## Troubleshooting

### "Missing Google OAuth configuration"

Check that all environment variables are set:
```bash
supabase secrets list
```

### "Failed to exchange authorization code"

- Verify Client ID and Secret are correct
- Check that redirect URI matches Google Cloud Console exactly
- Ensure authorization code hasn't expired (valid for ~10 minutes)

### "Failed to store calendar tokens"

- Check Supabase service role key is correct
- Verify database migration has been applied
- Check that user exists in database

## Security

- Uses service role key to bypass RLS
- Tokens are stored encrypted in database
- OAuth state parameter prevents CSRF attacks
- CORS configured to allow frontend domain only

## Dependencies

- `@supabase/supabase-js@2`: Database client
- Deno standard library

## Related Files

- Frontend: `src/lib/googleCalendar.ts`
- Settings UI: `src/pages/Settings.tsx`
- Database migration: `supabase/migrations/20260117_add_google_calendar.sql`
- Documentation: `docs/GOOGLE_CALENDAR_SETUP.md`
