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
    console.log('Vapi webhook received:', JSON.stringify(payload, null, 2));

    const { message } = payload;

    // Only process end-of-call-report events
    if (message?.type !== 'end-of-call-report') {
      console.log('Ignoring event type:', message?.type);
      return new Response(JSON.stringify({ message: 'Event ignored' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    }

    const call = message.call;
    if (!call) {
      throw new Error('No call data in webhook payload');
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Extract customer phone number from call
    const customerPhone = call.customer?.number || call.phoneNumber?.number || 'unknown';

    // Calculate duration
    const duration = call.endedAt && call.startedAt
      ? Math.floor((new Date(call.endedAt).getTime() - new Date(call.startedAt).getTime()) / 1000)
      : 0;

    // Extract call data with better structure handling
    const callData = {
      vapi_call_id: call.id,
      phone_number: customerPhone,
      caller_name: extractCallerName(call),
      duration: duration,
      status: 'ai_answered',
      intent: analyzeIntent(call),
      confidence: calculateConfidence(call),
      outcome: determineOutcome(call),
      vehicle_make: extractVehicleInfo(call, 'make'),
      vehicle_model: extractVehicleInfo(call, 'model'),
      vehicle_year: extractVehicleInfo(call, 'year'),
      service_requested: extractServiceRequested(call),
      preferred_date: extractPreferredDate(call),
      notes: call.analysis?.summary || call.summary || null,
      transcript: call.messages || call.transcript || null,
      summary: call.analysis?.summary || call.summary || null,
      recording_url: call.recordingUrl || null,
      contacted_count: 0,
    };

    console.log('Extracted call data:', callData);

    // Find user by Vapi phone number ID
    const vapiPhoneId = call.phoneNumberId || call.phoneNumber?.id;

    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, email, business_name, booking_link, auto_sms_enabled')
      .eq('vapi_phone_number', vapiPhoneId)
      .single();

    if (userError || !user) {
      console.error('User not found for Vapi phone ID:', vapiPhoneId, userError);

      // For MVP, let's try to find ANY user if no match (temporary fallback)
      const { data: fallbackUser } = await supabase
        .from('users')
        .select('id, email, business_name, booking_link, auto_sms_enabled')
        .limit(1)
        .single();

      if (!fallbackUser) {
        return new Response(JSON.stringify({ error: 'No users found' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 404,
        });
      }

      console.log('Using fallback user:', fallbackUser.id);
      Object.assign(user, fallbackUser);
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

    console.log('Call saved successfully:', savedCall.id);

    // Send email notification to business owner
    try {
      await sendEmailNotification(supabase, user, savedCall, callData);
    } catch (emailError) {
      console.error('Failed to send email notification:', emailError);
      // Don't fail the webhook if email fails
    }

    return new Response(
      JSON.stringify({
        success: true,
        callId: savedCall.id,
        userId: user.id
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

// Send email notification to business owner
async function sendEmailNotification(supabase: any, user: any, call: any, callData: any) {
  const emailSubject = `New Call: ${callData.caller_name || 'Unknown'} - ${callData.service_requested || 'No service specified'}`;

  const emailBody = `
    <h2>New Call Received</h2>
    <p>Hi ${user.business_name},</p>
    <p>You just received a new call from your AI receptionist!</p>

    <h3>Call Details:</h3>
    <ul>
      <li><strong>Caller:</strong> ${callData.caller_name || 'Unknown'}</li>
      <li><strong>Phone:</strong> ${callData.phone_number}</li>
      <li><strong>Service:</strong> ${callData.service_requested || 'Not specified'}</li>
      <li><strong>Vehicle:</strong> ${callData.vehicle_year || ''} ${callData.vehicle_make || ''} ${callData.vehicle_model || ''}</li>
      <li><strong>Preferred Date:</strong> ${callData.preferred_date || 'Not specified'}</li>
      <li><strong>Duration:</strong> ${callData.duration} seconds</li>
      <li><strong>Intent:</strong> ${callData.intent}</li>
      <li><strong>Outcome:</strong> ${callData.outcome}</li>
    </ul>

    ${callData.notes ? `<p><strong>Notes:</strong> ${callData.notes}</p>` : ''}

    <p><a href="https://app.detailpilot.ai/dashboard">View in Dashboard</a></p>

    <p>Best regards,<br>DetailPilot AI</p>
  `;

  // Use Supabase's built-in email sending (if configured)
  // For MVP, we'll log this - you can integrate with Resend or SendGrid later
  console.log('Email notification prepared for:', user.email);
  console.log('Subject:', emailSubject);
  console.log('Body preview:', emailBody.substring(0, 200));

  // TODO: Integrate with Resend API
  // const resendApiKey = Deno.env.get('RESEND_API_KEY');
  // if (resendApiKey) {
  //   await fetch('https://api.resend.com/emails', {
  //     method: 'POST',
  //     headers: {
  //       'Authorization': `Bearer ${resendApiKey}`,
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({
  //       from: 'DetailPilot AI <noreply@detailpilot.ai>',
  //       to: user.email,
  //       subject: emailSubject,
  //       html: emailBody,
  //     }),
  //   });
  // }
}

// Helper functions to extract data from Vapi call

function extractCallerName(call: any): string | null {
  // Try to extract name from analysis first (if Vapi has structured output)
  if (call.analysis?.structuredData?.name) {
    return call.analysis.structuredData.name;
  }

  // Look for function calls that captured name
  if (call.messages) {
    for (const msg of call.messages) {
      if (msg.functionCall?.name === 'captureLeadInfo' || msg.function_call?.name === 'captureLeadInfo') {
        try {
          const args = typeof msg.functionCall?.parameters === 'object'
            ? msg.functionCall.parameters
            : JSON.parse(msg.function_call?.arguments || '{}');
          if (args.name) return args.name;
        } catch (e) {
          console.error('Error parsing function call:', e);
        }
      }
    }
  }

  // Try to extract from transcript using pattern matching
  const messages = call.messages || call.transcript || [];
  for (const msg of messages) {
    const content = msg.content || msg.message || '';
    if ((msg.role === 'user' || msg.role === 'customer') && content) {
      // Look for common patterns: "my name is John", "I'm John", "this is John"
      const nameMatch = content.match(/(?:my name is|i'm|im|this is|i am)\s+([a-z]{2,20})(?:\s|$|\.)/i);
      if (nameMatch) {
        const name = nameMatch[1];
        // Filter out common false positives
        const excludeWords = ['calling', 'looking', 'interested', 'trying', 'asking', 'wondering'];
        if (!excludeWords.includes(name.toLowerCase())) {
          return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
        }
      }
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
