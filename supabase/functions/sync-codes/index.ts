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

    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
    if (!GEMINI_API_KEY) throw new Error('GEMINI_API_KEY not configured');

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

    // Call Gemini with Google Search grounding
    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are a rewards verification bot.
TASK: Find 12 active Free Fire redeem codes ${loc.query} Date: ${today}.
CRITICAL: Codes MUST be for the ${region} server only.
FORMAT: Return ONLY a JSON array, no markdown.
SCHEMA: [{"code": "XXXX-XXXX-XXXX", "reward": "description", "category": "Diamond|Skin|Bundle|Voucher|Pet"}]`
            }]
          }],
          tools: [{ google_search: {} }]
        }),
      }
    );

    if (!geminiResponse.ok) {
      const errText = await geminiResponse.text();
      console.error('Gemini API error:', geminiResponse.status, errText);
      throw new Error(`Gemini API failed: ${geminiResponse.status}`);
    }

    const geminiData = await geminiResponse.json();
    const text = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || '';

    // Extract citations
    const citations = geminiData.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => ({
      uri: chunk.web?.uri || '',
      title: chunk.web?.title || ''
    })).filter((c: any) => c.uri) || [];

    // Parse codes
    let discovered: any[] = [];
    try {
      const jsonMatch = text.match(/\[\s*\{[\s\S]*\}\s*\]/);
      if (jsonMatch) {
        discovered = JSON.parse(jsonMatch[0]);
      } else {
        const clean = text.replace(/```json/g, '').replace(/```/g, '').trim();
        discovered = JSON.parse(clean);
      }
    } catch {
      console.error('Failed to parse Gemini response:', text.substring(0, 500));
      return new Response(JSON.stringify({ error: 'parse_failed', text: text.substring(0, 200) }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
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
      probability: citations.length > 0 ? 99 : 85,
      recent_claims: Math.floor(Math.random() * 1000) + 300,
      likes: Math.floor(Math.random() * 500) + 150,
      citations,
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
