#!/usr/bin/env node

/**
 * Generate Voice Preview Samples
 *
 * This script uses OpenAI's Text-to-Speech API to generate audio samples
 * for all 6 Vapi voices used in the Settings page.
 *
 * Usage:
 *   OPENAI_API_KEY=your_key node scripts/generate-voice-samples.js
 *
 * Or create a .env file with:
 *   OPENAI_API_KEY=your_key
 */

import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Check for OpenAI API key
if (!process.env.OPENAI_API_KEY) {
  console.error('❌ Error: OPENAI_API_KEY environment variable is not set');
  console.error('\nUsage:');
  console.error('  OPENAI_API_KEY=your_key node scripts/generate-voice-samples.js');
  console.error('\nOr create a .env file with:');
  console.error('  OPENAI_API_KEY=your_key');
  process.exit(1);
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Voices to generate
const voices = [
  { id: 'alloy', name: 'Alloy', description: 'Balanced and professional' },
  { id: 'echo', name: 'Echo', description: 'Clear and confident' },
  { id: 'fable', name: 'Fable', description: 'Warm and engaging' },
  { id: 'onyx', name: 'Onyx', description: 'Deep and authoritative' },
  { id: 'nova', name: 'Nova', description: 'Friendly and upbeat' },
  { id: 'shimmer', name: 'Shimmer', description: 'Bright and energetic' }
];

// Sample text to speak
const sampleText = "Hi! Thanks for calling. I'm your AI assistant. I can help you schedule an appointment, answer questions about our services, or take a message for the owner. How can I help you today?";

async function generateVoiceSamples() {
  console.log('🎙️  Generating voice preview samples...\n');

  const outputDir = path.join(__dirname, '..', 'public', 'audio', 'voices');

  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
    console.log(`✅ Created directory: ${outputDir}\n`);
  }

  let successCount = 0;
  let failureCount = 0;

  for (const voice of voices) {
    try {
      console.log(`📝 Generating ${voice.name} (${voice.description})...`);

      const mp3 = await openai.audio.speech.create({
        model: "tts-1", // Use tts-1 for speed and cost
        voice: voice.id,
        input: sampleText,
      });

      const buffer = Buffer.from(await mp3.arrayBuffer());
      const outputPath = path.join(outputDir, `${voice.id}.mp3`);
      fs.writeFileSync(outputPath, buffer);

      const sizeKB = (buffer.length / 1024).toFixed(2);
      console.log(`   ✅ Saved ${voice.id}.mp3 (${sizeKB} KB)\n`);
      successCount++;

    } catch (error) {
      console.error(`   ❌ Failed to generate ${voice.id}.mp3:`);
      console.error(`   ${error.message}\n`);
      failureCount++;
    }
  }

  console.log('─'.repeat(50));
  console.log(`\n✨ Done! Generated ${successCount}/${voices.length} voice samples`);

  if (failureCount > 0) {
    console.log(`⚠️  ${failureCount} samples failed to generate`);
  }

  if (successCount === voices.length) {
    console.log('\n🎉 All voice previews are ready!');
    console.log('Voice selection in Settings now has working audio previews.');
  }

  console.log('\n💰 Estimated cost: ~$0.01 USD');
}

// Run the script
generateVoiceSamples().catch((error) => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
