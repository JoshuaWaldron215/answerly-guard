# Complete Voice Preview & Vapi Integration Setup

## What I Just Implemented

✅ **Database migration**: Added `vapi_voice` column to users table
✅ **Settings UI**: Voice selection loads from and saves to database
✅ **Voice persistence**: Selected voice is saved across page refreshes
✅ **Edge Function**: Updates Vapi assistant when voice changes

---

## Step-by-Step Setup Instructions

### Step 1: Run Database Migration

This adds the `vapi_voice` column to your users table.

**Option A: Via Supabase Dashboard (Easiest)**
1. Go to https://supabase.com/dashboard/project/gyqezbnqkkgskmhsnzgw/sql
2. Copy and paste this:
```sql
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS vapi_voice TEXT DEFAULT 'nova';

UPDATE public.users
SET vapi_voice = 'nova'
WHERE vapi_voice IS NULL;
```
3. Click "Run"
4. Should see: "Success. No rows returned"

**Option B: Via Supabase CLI**
```bash
supabase db push
```

---

### Step 2: Generate Voice Preview Samples

This creates MP3 files so users can hear each voice.

**Install OpenAI SDK:**
```bash
npm install openai
```

**Generate samples:**
```bash
# Replace with your actual OpenAI API key from https://platform.openai.com/api-keys
OPENAI_API_KEY=sk-proj-your-actual-key npm run generate-voices
```

**Expected output:**
```
🎙️  Generating voice preview samples...
📝 Generating Alloy (Balanced and professional)...
   ✅ Saved alloy.mp3 (24.5 KB)
... (6 voices total)
✨ Done! Generated 6/6 voice samples
💰 Estimated cost: ~$0.01 USD
```

**Result:**
- Creates `public/audio/voices/alloy.mp3`
- Creates `public/audio/voices/echo.mp3`
- Creates `public/audio/voices/fable.mp3`
- Creates `public/audio/voices/onyx.mp3`
- Creates `public/audio/voices/nova.mp3`
- Creates `public/audio/voices/shimmer.mp3`

---

### Step 3: Deploy Edge Function

This allows the app to update Vapi assistants when users change their voice.

**Deploy the function:**
```bash
cd supabase
npx supabase functions deploy update-vapi-voice
```

**Add Vapi API key as secret:**
```bash
npx supabase secrets set VAPI_PRIVATE_KEY=your_vapi_private_key_here
```

To get your Vapi private key:
1. Go to https://vapi.ai/dashboard
2. Click Settings → API Keys
3. Copy your "Private Key" (starts with `sk-...` or similar)

---

### Step 4: Deploy Frontend Changes

**Commit and push:**
```bash
git add -A
git commit -m "Add voice selection with Vapi integration"
git push
```

Vercel will automatically deploy.

---

## How It Works Now

### User Flow:

1. **User goes to Settings page**
   - Voice selector loads their saved preference (default: Nova)
   - Can click play button to hear each voice preview

2. **User selects a different voice**
   - Clicks on voice card or voice name
   - Can preview it with play button

3. **User clicks "Save Changes"**
   - Voice preference saved to database
   - Edge Function calls Vapi API to update assistant
   - Success message shown

4. **Next call to Vapi number**
   - AI answers with the newly selected voice
   - Voice persists for future calls

### Technical Flow:

```
Settings UI
    ↓ (user selects voice)
Save to database (users.vapi_voice)
    ↓
Call Edge Function (update-vapi-voice)
    ↓
Edge Function calls Vapi API
    ↓
Vapi assistant voice updated
    ↓
Future calls use new voice
```

---

## Testing the Complete Flow

### 1. Test Voice Previews:
```bash
# After generating samples
npm run dev
# Go to http://localhost:5173/settings
# Click play button next to each voice
# Should hear audio samples
```

### 2. Test Voice Selection:
1. Go to Settings
2. Select "Echo" voice
3. Click play to preview
4. Click "Save Changes"
5. Refresh page
6. Should still show "Echo" selected

### 3. Test Vapi Integration:
1. Make sure you have a Vapi assistant configured
2. Go to Settings
3. Change voice to "Onyx"
4. Save
5. Make a test call to your Vapi number
6. AI should answer with Onyx voice (deep and authoritative)

---

## Environment Variables Needed

Make sure these are set in Supabase Edge Functions:

```bash
VAPI_PRIVATE_KEY=your_vapi_private_key
SERVICE_ROLE_KEY=your_supabase_service_role_key
SUPABASE_URL=https://gyqezbnqkkgskmhsnzgw.supabase.co
```

Check them:
```bash
npx supabase secrets list
```

---

## Troubleshooting

### Voice previews don't play:
**Problem**: Audio files not generated
**Fix**: Run `OPENAI_API_KEY=your_key npm run generate-voices`

### Voice selection doesn't save:
**Problem**: Database migration not run
**Fix**: Run the SQL migration in Supabase dashboard

### Voice doesn't change on Vapi calls:
**Problem**: Edge Function not deployed or Vapi key missing
**Fix**:
```bash
npx supabase functions deploy update-vapi-voice
npx supabase secrets set VAPI_PRIVATE_KEY=your_key
```

### "No Vapi assistant configured" message:
**Problem**: User doesn't have `vapi_assistant_id` set
**Fix**: This is normal for new users. Voice will be applied when they complete onboarding or when you manually create their Vapi assistant

---

## What's Saved Where

| Field | Location | Example Value |
|-------|----------|---------------|
| Selected voice | Database: `users.vapi_voice` | `"onyx"` |
| Vapi assistant ID | Database: `users.vapi_assistant_id` | `"abc123"` |
| Audio samples | Frontend: `public/audio/voices/` | `onyx.mp3` |
| Voice config | Vapi: Assistant settings | `{"provider": "openai", "voiceId": "onyx"}` |

---

## Next Steps (Optional Enhancements)

### 1. Auto-create Vapi Assistants During Onboarding:
Currently, users must manually configure Vapi. You could auto-create assistants:
- Create Edge Function: `create-vapi-assistant`
- Call during onboarding flow
- Store returned `assistant.id` in database

### 2. Voice Sample Recording Date:
Track when samples were last generated:
```sql
ALTER TABLE users ADD COLUMN voice_samples_generated_at TIMESTAMP;
```

### 3. Custom Voice Messages:
Let users record custom greetings:
- Add recording feature in Settings
- Upload to Supabase Storage
- Configure Vapi assistant with custom audio URL

---

## Summary

After completing the 4 steps above, your users will be able to:

✅ Preview all 6 OpenAI voices with real audio samples
✅ Select their preferred voice in Settings
✅ Have their choice persist across sessions
✅ Have their Vapi assistant automatically updated
✅ Receive calls with their selected voice

**Total cost to set up:** ~$0.01 USD (for generating voice samples)
