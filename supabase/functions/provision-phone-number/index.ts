// Provision Phone Number Edge Function
// Automatically provisions a Vapi phone number and assistant for new users

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const VAPI_API_KEY = Deno.env.get('VAPI_PRIVATE_KEY');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Default assistant configuration for auto detailing businesses
const DEFAULT_ASSISTANT_CONFIG = {
  name: 'DetailPilot AI Receptionist',
  model: {
    provider: 'openai',
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `You are a friendly, professional AI receptionist for an auto detailing business. Your job is to:
1. Greet callers warmly
2. Ask about their vehicle (year, make, model)
3. Ask what service they're interested in (full detail, interior, exterior, ceramic coating, paint correction)
4. Ask for their preferred date/time
5. Collect their name and callback number
6. Let them know the owner will follow up to confirm

Be conversational but efficient. Keep responses brief. If they ask about pricing, say the owner will provide a custom quote based on their vehicle.

Always be helpful and friendly. If you're unsure about something, say you'll have the owner follow up with more details.`
      }
    ],
    temperature: 0.7,
    maxTokens: 150,
  },
  voice: {
    provider: 'openai',
    voiceId: 'nova', // Default voice, user can change later
  },
  firstMessage: "Hi, thanks for calling! This is DetailPilot, your AI assistant. I can help you schedule a detailing appointment. What kind of service are you looking for today?",
  endCallMessage: "Thanks for calling! We'll follow up shortly to confirm your appointment. Have a great day!",
  transcriber: {
    provider: 'deepgram',
    model: 'nova-2',
    language: 'en',
  },
  recordingEnabled: true,
  endCallFunctionEnabled: true,
};

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Get user ID from request
    const { userId, areaCode } = await req.json();

    if (!userId) {
      throw new Error('userId is required');
    }

    if (!VAPI_API_KEY) {
      throw new Error('VAPI_PRIVATE_KEY not configured');
    }

    console.log('Provisioning phone number for user:', userId);

    // Initialize Supabase client
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    // Get user data
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (userError || !user) {
      throw new Error(`User not found: ${userError?.message || 'Unknown error'}`);
    }

    // Check if already provisioned
    if (user.phone_number_status === 'active' && user.vapi_phone_number) {
      console.log('User already has an active phone number:', user.vapi_phone_number);
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Phone number already provisioned',
          phoneNumber: user.vapi_phone_number,
          assistantId: user.vapi_assistant_id,
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }

    // Update status to provisioning
    await supabase
      .from('users')
      .update({ phone_number_status: 'provisioning' })
      .eq('id', userId);

    try {
      // Step 1: Create Vapi Assistant
      console.log('Creating Vapi assistant...');

      const assistantConfig = {
        ...DEFAULT_ASSISTANT_CONFIG,
        name: `${user.business_name} AI Receptionist`,
        voice: {
          provider: 'openai',
          voiceId: user.vapi_voice || 'nova',
        },
      };

      // Update system prompt with business name
      assistantConfig.model.messages[0].content = assistantConfig.model.messages[0].content.replace(
        'an auto detailing business',
        user.business_name || 'an auto detailing business'
      );

      const assistantResponse = await fetch('https://api.vapi.ai/assistant', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${VAPI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(assistantConfig),
      });

      if (!assistantResponse.ok) {
        const errorText = await assistantResponse.text();
        throw new Error(`Failed to create assistant: ${errorText}`);
      }

      const assistant = await assistantResponse.json();
      console.log('Assistant created:', assistant.id);

      // Step 2: Purchase a phone number
      console.log('Purchasing phone number...');

      const phoneNumberPayload: Record<string, unknown> = {
        provider: 'twilio', // or 'vonage' depending on your Vapi setup
        assistantId: assistant.id,
        name: `${user.business_name} Line`,
      };

      // Add area code if provided
      if (areaCode) {
        phoneNumberPayload.numberDesiredAreaCode = areaCode;
      }

      const phoneResponse = await fetch('https://api.vapi.ai/phone-number', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${VAPI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(phoneNumberPayload),
      });

      if (!phoneResponse.ok) {
        const errorText = await phoneResponse.text();

        // Clean up: delete the assistant if phone provisioning fails
        await fetch(`https://api.vapi.ai/assistant/${assistant.id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${VAPI_API_KEY}` },
        });

        throw new Error(`Failed to purchase phone number: ${errorText}`);
      }

      const phoneNumber = await phoneResponse.json();
      console.log('Phone number purchased:', phoneNumber.number);

      // Step 3: Update user record with phone number and assistant ID
      const { error: updateError } = await supabase
        .from('users')
        .update({
          vapi_phone_number: phoneNumber.number,
          vapi_assistant_id: assistant.id,
          phone_number_status: 'active',
          phone_provisioned_at: new Date().toISOString(),
          phone_provisioning_error: null,
          onboarding_steps: {
            ...user.onboarding_steps,
            phone_assigned: true,
          },
        })
        .eq('id', userId);

      if (updateError) {
        throw new Error(`Failed to update user record: ${updateError.message}`);
      }

      console.log('User record updated successfully');

      return new Response(
        JSON.stringify({
          success: true,
          message: 'Phone number provisioned successfully',
          phoneNumber: phoneNumber.number,
          assistantId: assistant.id,
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );

    } catch (provisionError) {
      // Update user with error status
      await supabase
        .from('users')
        .update({
          phone_number_status: 'failed',
          phone_provisioning_error: provisionError.message,
        })
        .eq('id', userId);

      throw provisionError;
    }

  } catch (error) {
    console.error('Provisioning error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
