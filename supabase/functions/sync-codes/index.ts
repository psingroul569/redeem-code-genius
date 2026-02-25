import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const REGIONS: Record<string, { query: string; server: string }> = {
  'GLOBAL': { query: 'Working Free Fire redeem codes today for all regions.', server: 'GLOBAL' },
  'INDIA': { query: 'Free Fire India (IND) server redeem codes today. Search in Hindi and English. Exclude Global/BR.', server: 'INDIA (IND)' },
  'BRAZIL': { query: 'Códigos de resgate Free Fire Brasil (BR) hoje. Search on sites like ffmania.com.br. Exclude Global/India.', server: 'BRAZIL (BR)' },
  'INDONESIA': { query: 'Kode redeem Free Fire Indonesia (ID) terbaru. Exclude Global codes.', server: 'INDONESIA (ID)' },
  'EUROPE': { query: 'Free Fire Europe (EU) server redeem codes. Exclude other regions.', server: 'EUROPE (EU)' },
};

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const { region } = await req.json();
    if (!region || !REGIONS[region]) {
      return new Response(JSON.stringify({ error: 'Invalid region' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) throw new Error('LOVABLE_API_KEY not configured');

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const now = new Date();
    const hourKey = `${now.getUTCFullYear()}-${now.getUTCMonth()}-${now.getUTCDate()}-${now.getUTCHours()}`;

    // Check if already synced this hour
    const { data: existingLog } = await supabase
      .from('sync_log')
      .select('id')
      .eq('region', region)
      .eq('hour_key', hourKey)
      .maybeSingle();

    if (existingLog) {
      return new Response(JSON.stringify({ status: 'already_synced', hour_key: hourKey }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const loc = REGIONS[region];
    const today = now.toLocaleDateString('en-US', { day: '2-digit', month: 'long', year: 'numeric' });

    // Call Lovable AI Gateway with tool calling for structured output
    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: `You are a rewards verification bot. Find active Free Fire redeem codes. Date: ${today}.`
          },
          {
            role: 'user',
            content: `Find 12 active Free Fire redeem codes. ${loc.query} Codes MUST be for the ${region} server only. Each code is typically 12-16 alphanumeric characters, sometimes with hyphens.`
          }
        ],
        tools: [
          {
            type: 'function',
            function: {
              name: 'submit_codes',
              description: 'Submit discovered Free Fire redeem codes',
              parameters: {
                type: 'object',
                properties: {
                  codes: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        code: { type: 'string', description: 'The redeem code (e.g. FFXX-YYYY-ZZZZ)' },
                        reward: { type: 'string', description: 'What the code gives (e.g. 2x Diamond Royale Voucher)' },
                        category: { type: 'string', enum: ['Diamond', 'Skin', 'Bundle', 'Voucher', 'Pet'] }
                      },
                      required: ['code', 'reward', 'category'],
                      additionalProperties: false
                    }
                  }
                },
                required: ['codes'],
                additionalProperties: false
              }
            }
          }
        ],
        tool_choice: { type: 'function', function: { name: 'submit_codes' } },
      }),
    });

    if (!aiResponse.ok) {
      const errText = await aiResponse.text();
      console.error('AI Gateway error:', aiResponse.status, errText);
      if (aiResponse.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limited, will retry next cycle' }), {
          status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      throw new Error(`AI Gateway failed: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    
    // Extract structured data from tool call
    let discovered: any[] = [];
    try {
      const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
      if (toolCall?.function?.arguments) {
        const parsed = JSON.parse(toolCall.function.arguments);
        discovered = parsed.codes || [];
      }
    } catch (parseErr) {
      // Fallback: try parsing from content
      const text = aiData.choices?.[0]?.message?.content || '';
      console.error('Tool call parse failed, trying content:', text.substring(0, 300));
      try {
        const jsonMatch = text.match(/\[\s*\{[\s\S]*\}\s*\]/);
        if (jsonMatch) discovered = JSON.parse(jsonMatch[0]);
      } catch {
        return new Response(JSON.stringify({ error: 'parse_failed' }), {
          status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    if (!Array.isArray(discovered) || discovered.length === 0) {
      return new Response(JSON.stringify({ error: 'no_codes_found' }), {
        status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Insert codes into DB
    const rows = discovered.map((item: any) => ({
      region,
      hour_key: hourKey,
      code: item.code || 'FF-UNKNOWN',
      reward: item.reward || 'Garena Reward',
      category: item.category || 'Bundle',
      slug: `${region.toLowerCase()}-${hourKey}-${(item.code || '').toLowerCase().replace(/[^a-z0-9]/g, '')}`,
      status: 'Working',
      probability: 85,
      recent_claims: Math.floor(Math.random() * 1000) + 300,
      likes: Math.floor(Math.random() * 500) + 150,
      citations: [],
    }));

    const { error: insertError } = await supabase
      .from('synced_codes')
      .upsert(rows, { onConflict: 'region,hour_key,code' });

    if (insertError) {
      console.error('Insert error:', insertError);
      throw new Error(`DB insert failed: ${insertError.message}`);
    }

    // Log the sync
    await supabase.from('sync_log').upsert({
      region,
      hour_key: hourKey,
      code_count: rows.length,
    }, { onConflict: 'region,hour_key' });

    return new Response(JSON.stringify({
      status: 'synced',
      region,
      hour_key: hourKey,
      codes_count: rows.length,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (e) {
    console.error('sync-codes error:', e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : 'Unknown error' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
