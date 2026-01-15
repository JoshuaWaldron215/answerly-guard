// Vapi Webhook Handler
// This receives webhooks from Vapi when calls are completed

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Parse webhook payload
    const payload = await req.json();
    console.log('Vapi webhook received:', payload);

    const { type, call } = payload;

    // Only process call-ended events
    if (type !== 'end-of-call-report') {
      return new Response(JSON.stringify({ message: 'Event ignored' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Extract call data
    const callData = {
      vapi_call_id: call.id,
      phone_number: call.customer?.number || 'unknown',
      caller_name: extractCallerName(call),
      duration: call.endedAt && call.startedAt
        ? Math.floor((new Date(call.endedAt).getTime() - new Date(call.startedAt).getTime()) / 1000)
        : null,
      status: 'ai_answered',
      intent: analyzeIntent(call),
      confidence: calculateConfidence(call),
      outcome: determineOutcome(call),
      vehicle_make: extractVehicleInfo(call, 'make'),
      vehicle_model: extractVehicleInfo(call, 'model'),
      vehicle_year: extractVehicleInfo(call, 'year'),
      service_requested: extractServiceRequested(call),
      preferred_date: extractPreferredDate(call),
      notes: call.summary || null,
      transcript: call.transcript || null,
      summary: call.summary || null,
      recording_url: call.recordingUrl || null,
      contacted_count: 0,
    };

    // Find user by phone number (assuming Vapi forwards to user's number)
    // You'll need to configure this based on your Vapi setup
    const userPhone = call.phoneNumberId; // This should be configured in Vapi
    const { data: user } = await supabase
      .from('users')
      .select('id, booking_link')
      .eq('vapi_phone_number', userPhone)
      .single();

    if (!user) {
      console.error('User not found for phone:', userPhone);
      return new Response(JSON.stringify({ error: 'User not found' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 404,
      });
    }

    // Save call to database
    const { data: savedCall, error: insertError } = await supabase
      .from('calls')
      .insert({ ...callData, user_id: user.id })
      .select()
      .single();

    if (insertError) {
      console.error('Error saving call:', insertError);
      throw insertError;
    }

    console.log('Call saved:', savedCall.id);

    // Send SMS follow-up (call the send-sms Edge Function)
    if (callData.phone_number && callData.phone_number !== 'unknown') {
      const bookingLink = user.booking_link || 'https://yourapp.com/book';
      const message = generateFollowUpMessage(callData.caller_name, callData.service_requested, bookingLink);

      // Call the send-sms Edge Function
      const smsResponse = await fetch(`${supabaseUrl}/functions/v1/send-sms`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseKey}`,
        },
        body: JSON.stringify({
          userId: user.id,
          callId: savedCall.id,
          toNumber: callData.phone_number,
          message,
          smsType: 'auto_followup',
        }),
      });

      if (!smsResponse.ok) {
        console.error('Failed to send SMS:', await smsResponse.text());
      } else {
        console.log('SMS follow-up sent to:', callData.phone_number);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        callId: savedCall.id
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Webhook error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});

// Helper functions to extract data from Vapi call

function extractCallerName(call: any): string | null {
  // Try to extract name from transcript or function calls
  const transcript = call.transcript || [];

  // Look for function calls that captured name
  if (call.messages) {
    for (const msg of call.messages) {
      if (msg.function_call?.name === 'captureLeadInfo') {
        const args = JSON.parse(msg.function_call.arguments || '{}');
        if (args.name) return args.name;
      }
    }
  }

  // Try to extract from transcript using simple pattern matching
  // This is basic - you might want to use GPT to extract this properly
  for (const turn of transcript) {
    if (turn.role === 'user' && turn.content) {
      const nameMatch = turn.content.match(/(?:my name is|i'm|im)\s+([a-z]+)/i);
      if (nameMatch) return nameMatch[1];
    }
  }

  return null;
}

function analyzeIntent(call: any): 'high' | 'medium' | 'low' {
  // Analyze call transcript to determine intent
  const transcript = JSON.stringify(call.transcript || []).toLowerCase();

  // High intent indicators
  const highIntentKeywords = ['book', 'schedule', 'appointment', 'when can', 'how much', 'price', 'cost', 'available'];
  const highIntentCount = highIntentKeywords.filter(kw => transcript.includes(kw)).length;

  if (highIntentCount >= 2) return 'high';
  if (highIntentCount >= 1) return 'medium';
  return 'low';
}

function calculateConfidence(call: any): number {
  // Calculate confidence based on call completeness
  let score = 0;

  if (call.transcript && call.transcript.length > 0) score += 0.3;
  if (call.duration && call.duration > 30) score += 0.3;
  if (extractCallerName(call)) score += 0.2;
  if (extractServiceRequested(call)) score += 0.2;

  return Math.min(score, 1.0);
}

function determineOutcome(call: any): 'booked' | 'waiting' | 'dropped' | 'spam' {
  const transcript = JSON.stringify(call.transcript || []).toLowerCase();

  if (transcript.includes('spam') || transcript.includes('wrong number')) {
    return 'spam';
  }

  if (transcript.includes('book') || transcript.includes('schedule')) {
    return 'booked';
  }

  if (call.duration && call.duration < 15) {
    return 'dropped';
  }

  return 'waiting';
}

function extractVehicleInfo(call: any, field: 'make' | 'model' | 'year'): string | number | null {
  // Try to extract vehicle info from function calls or transcript
  if (call.messages) {
    for (const msg of call.messages) {
      if (msg.function_call?.name === 'captureLeadInfo') {
        const args = JSON.parse(msg.function_call.arguments || '{}');
        if (args.vehicle && args.vehicle[field]) {
          return field === 'year' ? parseInt(args.vehicle[field]) : args.vehicle[field];
        }
      }
    }
  }

  // Basic pattern matching for common formats
  const transcript = JSON.stringify(call.transcript || []);

  if (field === 'year') {
    const yearMatch = transcript.match(/\b(20\d{2}|19\d{2})\b/);
    if (yearMatch) return parseInt(yearMatch[1]);
  }

  // For make/model, this would require more sophisticated NLP
  // For MVP, we'll rely on function calls from Vapi

  return null;
}

function extractServiceRequested(call: any): string | null {
  // Try to extract service from function calls
  if (call.messages) {
    for (const msg of call.messages) {
      if (msg.function_call?.name === 'captureLeadInfo') {
        const args = JSON.parse(msg.function_call.arguments || '{}');
        if (args.service) return args.service;
      }
    }
  }

  // Extract from transcript
  const transcript = JSON.stringify(call.transcript || []).toLowerCase();
  const services = ['full detail', 'interior detail', 'exterior detail', 'ceramic coating', 'paint correction'];

  for (const service of services) {
    if (transcript.includes(service)) return service;
  }

  return null;
}

function extractPreferredDate(call: any): string | null {
  // Try to extract preferred date from function calls
  if (call.messages) {
    for (const msg of call.messages) {
      if (msg.function_call?.name === 'captureLeadInfo') {
        const args = JSON.parse(msg.function_call.arguments || '{}');
        if (args.preferredDate) return args.preferredDate;
      }
    }
  }

  return null;
}

function generateFollowUpMessage(name: string | null, service: string | null, bookingLink: string): string {
  const greeting = name ? `Hi ${name}!` : 'Hi!';
  const serviceMention = service ? ` about ${service}` : '';

  return `${greeting} Thanks for calling${serviceMention}. Book your appointment here: ${bookingLink}`;
}
