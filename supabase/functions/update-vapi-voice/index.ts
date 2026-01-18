import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const VAPI_API_KEY = Deno.env.get('VAPI_PRIVATE_KEY');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_KEY = Deno.env.get('SERVICE_ROLE_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface UpdateVoiceRequest {
  voiceId: string; // alloy, echo, fable, onyx, nova, shimmer
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Get user from auth header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);

    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    // Parse request body
    const { voiceId }: UpdateVoiceRequest = await req.json();

    // Validate voice ID
    const validVoices = ['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer'];
    if (!validVoices.includes(voiceId)) {
      throw new Error(`Invalid voice ID: ${voiceId}`);
    }

    // Get user's Vapi assistant ID
    const { data: userData, error: dbError } = await supabase
      .from('users')
      .select('vapi_assistant_id')
      .eq('id', user.id)
      .single();

    if (dbError || !userData) {
      throw new Error('User not found');
    }

    // If no assistant ID, return success (will be configured during onboarding)
    if (!userData.vapi_assistant_id) {
      console.log('No Vapi assistant configured for user', user.id);
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Voice preference saved. Assistant will be configured during onboarding.',
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }

    // Update Vapi assistant voice
    if (!VAPI_API_KEY) {
      throw new Error('VAPI_PRIVATE_KEY not configured');
    }

    const vapiResponse = await fetch(
      `https://api.vapi.ai/assistant/${userData.vapi_assistant_id}`,
      {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${VAPI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          voice: {
            provider: 'openai',
            voiceId: voiceId,
          },
        }),
      }
    );

    if (!vapiResponse.ok) {
      const errorText = await vapiResponse.text();
      console.error('Vapi API error:', errorText);
      throw new Error(`Failed to update Vapi assistant: ${errorText}`);
    }

    const vapiData = await vapiResponse.json();
    console.log('Updated Vapi assistant voice:', voiceId);

    return new Response(
      JSON.stringify({
        success: true,
        message: `Voice updated to ${voiceId}`,
        assistant: vapiData,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in update-vapi-voice:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
