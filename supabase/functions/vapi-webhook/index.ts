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
      .select('id, email, business_name, booking_link, auto_sms_enabled, notification_preferences')
      .eq('vapi_phone_number', vapiPhoneId)
      .single();

    if (userError || !user) {
      console.error('User not found for Vapi phone ID:', vapiPhoneId, userError);

      // For MVP, let's try to find ANY user if no match (temporary fallback)
      const { data: fallbackUser } = await supabase
        .from('users')
        .select('id, email, business_name, booking_link, auto_sms_enabled, notification_preferences')
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
  // Check user's notification preferences
  const prefs = user.notification_preferences || {
    email_all_calls: true,
    email_hot_leads: true,
    email_missed_calls: true,
  };

  // Determine if we should send based on preferences
  const isHotLead = callData.intent === 'high';
  const isMissedCall = callData.status === 'missed';

  let shouldSend = false;
  let emailType = 'new_call';

  if (prefs.email_all_calls) {
    shouldSend = true;
  } else if (prefs.email_hot_leads && isHotLead) {
    shouldSend = true;
    emailType = 'hot_lead';
  } else if (prefs.email_missed_calls && isMissedCall) {
    shouldSend = true;
    emailType = 'missed_call';
  }

  if (!shouldSend) {
    console.log('Email notification skipped based on user preferences');
    return;
  }

  // Determine subject based on call type
  let emailSubject: string;
  if (isHotLead) {
    emailSubject = `🔥 Hot Lead: ${callData.caller_name || 'New Caller'} - ${callData.service_requested || 'Interested'}`;
  } else if (isMissedCall) {
    emailSubject = `📞 Missed Call from ${callData.caller_name || callData.phone_number}`;
  } else {
    emailSubject = `New Call: ${callData.caller_name || 'Unknown'} - ${callData.service_requested || 'AI Answered'}`;
  }

  const intentBadge = callData.intent === 'high'
    ? '<span style="background-color:#ef4444;color:white;padding:2px 8px;border-radius:4px;font-size:12px;">HIGH INTENT</span>'
    : callData.intent === 'medium'
    ? '<span style="background-color:#f59e0b;color:white;padding:2px 8px;border-radius:4px;font-size:12px;">MEDIUM INTENT</span>'
    : '<span style="background-color:#6b7280;color:white;padding:2px 8px;border-radius:4px;font-size:12px;">LOW INTENT</span>';

  const vehicleInfo = [callData.vehicle_year, callData.vehicle_make, callData.vehicle_model]
    .filter(Boolean)
    .join(' ') || 'Not specified';

  const emailBody = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #3b82f6, #1d4ed8); color: white; padding: 24px; border-radius: 12px 12px 0 0; }
        .content { background: #f8fafc; padding: 24px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 12px 12px; }
        .detail-row { display: flex; padding: 12px 0; border-bottom: 1px solid #e2e8f0; }
        .detail-label { font-weight: 600; color: #64748b; width: 120px; }
        .detail-value { color: #1e293b; }
        .cta-button { display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; margin-top: 16px; }
        .footer { text-align: center; padding: 16px; color: #64748b; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin:0;font-size:20px;">📞 ${isHotLead ? 'Hot Lead Alert!' : 'New Call Received'}</h1>
          <p style="margin:8px 0 0 0;opacity:0.9;">Your AI receptionist handled a call</p>
        </div>
        <div class="content">
          <div style="margin-bottom:16px;">${intentBadge}</div>

          <div class="detail-row">
            <span class="detail-label">Caller</span>
            <span class="detail-value"><strong>${callData.caller_name || 'Unknown'}</strong></span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Phone</span>
            <span class="detail-value">${callData.phone_number}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Service</span>
            <span class="detail-value">${callData.service_requested || 'Not specified'}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Vehicle</span>
            <span class="detail-value">${vehicleInfo}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Preferred Date</span>
            <span class="detail-value">${callData.preferred_date || 'Not specified'}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Duration</span>
            <span class="detail-value">${callData.duration} seconds</span>
          </div>
          <div class="detail-row" style="border-bottom:none;">
            <span class="detail-label">Outcome</span>
            <span class="detail-value">${callData.outcome}</span>
          </div>

          ${callData.notes ? `<div style="background:#fff;padding:16px;border-radius:8px;margin-top:16px;border:1px solid #e2e8f0;"><strong>Summary:</strong><br>${callData.notes}</div>` : ''}

          <a href="https://app.detailpilot.ai/dashboard" class="cta-button">View in Dashboard →</a>
        </div>
        <div class="footer">
          <p>Sent by DetailPilot AI • Your AI Receptionist</p>
          <p><a href="https://app.detailpilot.ai/settings" style="color:#3b82f6;">Manage notification preferences</a></p>
        </div>
      </div>
    </body>
    </html>
  `;

  // Send via Resend
  const resendApiKey = Deno.env.get('RESEND_API_KEY');

  if (resendApiKey) {
    console.log('Sending email via Resend to:', user.email);

    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'DetailPilot AI <notifications@detailpilot.ai>',
          to: user.email,
          subject: emailSubject,
          html: emailBody,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Resend API error:', errorText);
        throw new Error(`Resend API error: ${errorText}`);
      }

      const result = await response.json();
      console.log('Email sent successfully:', result.id);
    } catch (error) {
      console.error('Failed to send email via Resend:', error);
      throw error;
    }
  } else {
    // Log for debugging when Resend is not configured
    console.log('RESEND_API_KEY not configured. Email would be sent to:', user.email);
    console.log('Subject:', emailSubject);
    console.log('To enable emails, set RESEND_API_KEY in Supabase secrets');
  }
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
