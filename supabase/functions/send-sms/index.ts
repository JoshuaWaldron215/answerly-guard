// Send SMS Edge Function
// Handles sending SMS via Twilio

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
    const { userId, callId, toNumber, message, smsType = 'manual' } = await req.json();

    // Validate inputs
    if (!toNumber || !message) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: toNumber, message' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }

    // Get Twilio credentials from environment
    const twilioAccountSid = Deno.env.get('TWILIO_ACCOUNT_SID');
    const twilioAuthToken = Deno.env.get('TWILIO_AUTH_TOKEN');
    const twilioPhoneNumber = Deno.env.get('TWILIO_PHONE_NUMBER');

    if (!twilioAccountSid || !twilioAuthToken || !twilioPhoneNumber) {
      throw new Error('Twilio credentials not configured');
    }

    // Send SMS via Twilio
    const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${twilioAccountSid}/Messages.json`;

    const formData = new URLSearchParams({
      To: toNumber,
      From: twilioPhoneNumber,
      Body: message,
    });

    const twilioResponse = await fetch(twilioUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${btoa(`${twilioAccountSid}:${twilioAuthToken}`)}`,
      },
      body: formData.toString(),
    });

    const twilioData = await twilioResponse.json();

    if (!twilioResponse.ok) {
      console.error('Twilio error:', twilioData);
      throw new Error(`Twilio error: ${twilioData.message || 'Unknown error'}`);
    }

    console.log('SMS sent successfully:', twilioData.sid);

    // Log SMS to database
    if (userId) {
      const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
      const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
      const supabase = createClient(supabaseUrl, supabaseKey);

      const { error: logError } = await supabase
        .from('sms_log')
        .insert({
          user_id: userId,
          call_id: callId || null,
          to_number: toNumber,
          message,
          sms_type: smsType,
          twilio_sid: twilioData.sid,
          status: twilioData.status,
        });

      if (logError) {
        console.error('Error logging SMS:', logError);
        // Don't fail the request if logging fails
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        sid: twilioData.sid,
        status: twilioData.status
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Send SMS error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
