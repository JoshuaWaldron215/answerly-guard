// AI Assistant Edge Function
// Powers the AI chatbot on the dashboard

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
    const { userId, message, conversationHistory = [] } = await req.json();

    if (!userId || !message) {
      return new Response(
        JSON.stringify({ error: 'Missing userId or message' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }

    // Initialize Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get user's business context
    const { data: user } = await supabase
      .from('users')
      .select('business_name, services')
      .eq('id', userId)
      .single();

    // Get recent calls for context
    const { data: recentCalls } = await supabase
      .from('calls')
      .select('caller_name, phone_number, service_requested, intent, outcome, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(10);

    // Get hot leads
    const hotLeads = recentCalls?.filter(c => c.intent === 'high' && c.outcome !== 'booked') || [];

    // Get today's stats
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todaysCalls = recentCalls?.filter(c =>
      new Date(c.created_at) >= today
    ) || [];

    // Build context for AI
    const businessContext = `
Business: ${user?.business_name || 'Auto Detailing Business'}
Services: ${user?.services?.join(', ') || 'Full Detail, Ceramic Coating, etc.'}

Today's Stats:
- Total Calls: ${todaysCalls.length}
- Hot Leads: ${hotLeads.length}
- Booked: ${todaysCalls.filter(c => c.outcome === 'booked').length}

Recent Hot Leads:
${hotLeads.slice(0, 3).map((lead, i) => `
${i + 1}. ${lead.caller_name || 'Unknown'} (${lead.phone_number})
   - Service: ${lead.service_requested || 'Not specified'}
   - Intent: ${lead.intent}
   - Status: ${lead.outcome}
   - Called: ${new Date(lead.created_at).toLocaleString()}
`).join('\n')}
`.trim();

    // Call OpenAI
    const openaiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const systemPrompt = `You are an AI business assistant for DetailPilot, helping auto detailing shop owners manage their leads and business.

Your role:
- Help prioritize leads (focus on high-intent leads first)
- Suggest follow-up actions
- Provide insights about call patterns
- Give practical advice for converting leads to bookings
- Be concise, actionable, and friendly

Business Context:
${businessContext}

Guidelines:
- Always recommend calling high-intent leads within 2 hours
- Suggest specific talking points based on what the customer asked
- If a lead is waiting for more than 24 hours, mark as urgent
- Be encouraging but honest
- Keep responses under 100 words`;

    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory,
      { role: 'user', content: message }
    ];

    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages,
        temperature: 0.7,
        max_tokens: 300,
      }),
    });

    if (!openaiResponse.ok) {
      const errorData = await openaiResponse.json();
      console.error('OpenAI error:', errorData);
      throw new Error(`OpenAI error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await openaiResponse.json();
    const aiResponse = data.choices[0].message.content;

    return new Response(
      JSON.stringify({
        success: true,
        message: aiResponse,
        context: {
          totalCalls: todaysCalls.length,
          hotLeads: hotLeads.length,
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('AI Assistant error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
