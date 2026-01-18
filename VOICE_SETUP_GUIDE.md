# Voice Preview & Vapi Integration - Complete Setup Guide

## Part 1: Generate Voice Preview Samples

These samples let users hear what each voice sounds like before selecting.

### Step 1: Install OpenAI SDK

```bash
npm install openai
```

### Step 2: Get OpenAI API Key

1. Go to https://platform.openai.com/api-keys
2. Click "Create new secret key"
3. Copy the key (starts with `sk-...`)

### Step 3: Generate Voice Samples

```bash
# Replace sk-xxx with your actual OpenAI API key
OPENAI_API_KEY=sk-xxx npm run generate-voices
```

**Expected output:**
```
🎙️  Generating voice preview samples...

📝 Generating Alloy (Balanced and professional)...
   ✅ Saved alloy.mp3 (24.5 KB)

📝 Generating Echo (Clear and confident)...
   ✅ Saved echo.mp3 (25.1 KB)

... (continues for all 6 voices)

✨ Done! Generated 6/6 voice samples
🎉 All voice previews are ready!
💰 Estimated cost: ~$0.01 USD
```

**Result**: 6 audio files in `public/audio/voices/`:
- `alloy.mp3`
- `echo.mp3`
- `fable.mp3`
- `onyx.mp3`
- `nova.mp3`
- `shimmer.mp3`

Now users can click the play button in Settings to preview each voice!

---

## Part 2: Database Schema Update

We need to store which voice the user selected.

### Check if voice field exists:

1. Go to Supabase: https://supabase.com/dashboard/project/gyqezbnqkkgskmhsnzgw/editor
2. Click on `users` table
3. Look for column: `vapi_voice`

**If it doesn't exist**, add it:

```sql
-- Run this in SQL Editor
ALTER TABLE users
ADD COLUMN vapi_voice TEXT DEFAULT 'nova';
```

This stores the voice ID (alloy, echo, fable, onyx, nova, or shimmer).

---

## Part 3: Update Settings Page to Save Voice

Currently, Settings lets you SELECT a voice, but doesn't save it to the database.

**What needs to change:**
1. Load saved voice from database
2. Save selected voice when clicking "Save Changes"
3. Call Vapi API to update the assistant

I'll implement this for you in the next step.

---

## Part 4: Vapi Assistant Integration

When a user changes their voice in Settings, we need to update their Vapi assistant.

### How Vapi Assistants Work:

**Option A: Shared Assistant (Current Approach)**
- All users share ONE Vapi assistant
- Voice is configured at the assistant level
- Problem: All users would have the same voice

**Option B: Per-User Assistant (Recommended)**
- Each user gets their own Vapi assistant
- Voice can be customized per user
- Store `vapi_assistant_id` in database

**Which approach do you want to use?**

### For Option A (Shared Assistant):
Voice preview will work, but the actual Vapi calls will use whatever voice is configured in the Vapi dashboard. Users can preview voices but can't change the live assistant voice.

### For Option B (Per-User Assistant):
When user selects a voice in Settings:
1. Frontend calls Edge Function: `update-vapi-assistant`
2. Edge Function calls Vapi API: `PATCH /assistant/:id`
3. Updates the assistant's voice to the selected one
4. Saves `vapi_voice` to database

---

## Part 5: Implementation Checklist

### ✅ Already Done:
- [x] Voice preview UI with play buttons
- [x] 6 voice options (alloy, echo, fable, onyx, nova, shimmer)
- [x] Voice generation script
- [x] Voice selection state in Settings

### ⏳ Need to Do:

**If you want per-user assistants (recommended):**
- [ ] Add `vapi_voice` column to users table
- [ ] Update Settings to save `vapi_voice` to database
- [ ] Decide: Create Vapi assistants during onboarding OR on-demand
- [ ] Create Edge Function: `create-vapi-assistant`
- [ ] Create Edge Function: `update-vapi-assistant`
- [ ] Update Settings to call Edge Function when voice changes

**If you want shared assistant (simpler):**
- [ ] Add `vapi_voice` column to users table
- [ ] Update Settings to save `vapi_voice` preference
- [ ] Voice preview works, but doesn't affect actual calls
- [ ] Manual: Update voice in Vapi dashboard for all users

---

## Quick Decision Guide

**Choose "Per-User Assistants" if:**
- You want each user to customize their AI voice
- You're okay with higher Vapi costs (each user = separate assistant)
- You want full customization per user

**Choose "Shared Assistant" if:**
- All users will use the same voice
- Voice preview is just for demonstration
- Lower Vapi costs (one assistant for everyone)

**Which approach do you want? I'll implement the complete solution for you.**

---

## Current Status

**What works now:**
1. ✅ Voice preview samples can be generated
2. ✅ Users can click play to hear each voice
3. ✅ Users can select a voice (UI only)

**What doesn't work yet:**
1. ❌ Selected voice is not saved to database
2. ❌ Selected voice doesn't update Vapi assistant
3. ❌ Page refresh loses the selected voice

**Let me know which approach you want and I'll implement it!**
