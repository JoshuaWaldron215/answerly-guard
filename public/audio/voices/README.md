# Voice Preview Samples

This directory contains audio samples for the voice selection feature in Settings.

## Required Files

You need to add 6 audio files (one for each voice):

- `alloy.mp3` - Balanced and professional (neutral)
- `echo.mp3` - Clear and confident (male)
- `fable.mp3` - Warm and engaging (neutral)
- `onyx.mp3` - Deep and authoritative (male)
- `nova.mp3` - Friendly and upbeat (female)
- `shimmer.mp3` - Bright and energetic (female)

## How to Generate Voice Samples

### Option 1: Use OpenAI Text-to-Speech API (Recommended)

```bash
# Install OpenAI SDK
npm install openai

# Create a script to generate samples
node scripts/generate-voice-samples.js
```

Example script:
```javascript
import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const voices = ['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer'];
const sampleText = "Hi! Thanks for calling. I'm your AI assistant. I can help you schedule an appointment, answer questions about our services, or take a message for the owner. How can I help you today?";

async function generateVoiceSamples() {
  for (const voice of voices) {
    const mp3 = await openai.audio.speech.create({
      model: "tts-1",
      voice: voice,
      input: sampleText,
    });

    const buffer = Buffer.from(await mp3.arrayBuffer());
    const outputPath = path.join('public', 'audio', 'voices', `${voice}.mp3`);
    fs.writeFileSync(outputPath, buffer);
    console.log(`✅ Generated ${voice}.mp3`);
  }
}

generateVoiceSamples();
```

### Option 2: Use Vapi's Voice Samples

If you have a Vapi account, you can record test calls with each voice and extract the audio.

### Option 3: Use Pre-recorded Samples

Record your own 5-10 second samples saying:
> "Hi! Thanks for calling. I can help you schedule an appointment or answer questions. How can I help you today?"

## Sample Text Suggestions

Keep samples short (5-10 seconds). Good examples:

1. **Short greeting**: "Hi! Thanks for calling. How can I help you today?"
2. **Service intro**: "I can help you schedule an appointment, answer questions about our services, or take a message."
3. **Friendly prompt**: "This is your AI assistant. What brings you in today?"

## Cost Estimate (OpenAI TTS)

- Model: `tts-1` (faster, cheaper)
- Cost: ~$0.015 per 1,000 characters
- 6 voices × 100 characters = 600 characters
- Total: Less than $0.01 to generate all samples

## File Format

- Format: MP3
- Bitrate: 64-128 kbps recommended
- Duration: 5-10 seconds
- Sample rate: 24kHz or 48kHz

## Implementation

The Settings page will automatically detect and play these files when users click the play button next to each voice option.

If a file is missing, the app will show a helpful error message guiding the user to add samples.
