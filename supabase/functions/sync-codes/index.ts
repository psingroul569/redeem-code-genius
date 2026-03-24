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

    // Use gemini-2.0-flash with JSON response mode for reliable structured output
    const aiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `You are a rewards verification bot. Date: ${today}.
Find 12 active Free Fire redeem codes. ${loc.query} Codes MUST be for the ${region} server only. Each code is typically 12-16 alphanumeric characters, sometimes with hyphens.

Return a JSON array with objects having keys: code, reward, category (one of Diamond, Skin, Bundle, Voucher, Pet).`
          }]
        }],
        tools: [{ google_search: {} }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2048,
          responseMimeType: "application/json",
        }
      }),
    });

    if (!aiResponse.ok) {
      const errText = await aiResponse.text();
      console.error('Gemini API error:', aiResponse.status, errText);
      
      // If 2.0-flash fails (e.g. JSON mode not supported with grounding), retry without responseMimeType
      if (aiResponse.status === 400) {
        console.log('Retrying without responseMimeType...');
        const retryResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `You are a rewards verification bot. Date: ${today}.
Find 12 active Free Fire redeem codes. ${loc.query} Codes MUST be for the ${region} server only. Each code is typically 12-16 alphanumeric characters.

CRITICAL: Your ENTIRE response must be ONLY a valid JSON array. No explanation, no markdown, no text before or after.
Format: [{"code":"XXXX-XXXX-XXXX","reward":"description","category":"Diamond|Skin|Bundle|Voucher|Pet"}]`
              }]
            }],
            tools: [{ google_search: {} }],
            generationConfig: {
              temperature: 0.5,
              maxOutputTokens: 2048,
            }
          }),
        });
        
        if (!retryResponse.ok) {
          const retryErr = await retryResponse.text();
          console.error('Retry also failed:', retryResponse.status, retryErr);
          if (retryResponse.status === 429) {
            return new Response(JSON.stringify({ error: 'Rate limited, will retry next cycle' }), {
              status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
          }
          throw new Error(`Gemini API failed: ${retryResponse.status}`);
        }
        
        return await processGeminiResponse(retryResponse, region, hourKey, supabase, corsHeaders);
      }
      
      if (aiResponse.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limited, will retry next cycle' }), {
          status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      throw new Error(`Gemini API failed: ${aiResponse.status}`);
    }

    return await processGeminiResponse(aiResponse, region, hourKey, supabase, corsHeaders);

  } catch (e) {
    console.error('sync-codes error:', e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : 'Unknown error' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function processGeminiResponse(
  aiResponse: Response,
  region: string,
  hourKey: string,
  supabase: any,
  corsHeaders: Record<string, string>
) {
  const aiData = await aiResponse.json();

  // Extract text from all parts
  let discovered: any[] = [];
  try {
    const parts = aiData.candidates?.[0]?.content?.parts || [];
    const allText = parts.map((p: any) => p.text || '').join('');

    if (allText) {
      // Try direct parse first (works when responseMimeType is set)
      try {
        const parsed = JSON.parse(allText);
        discovered = Array.isArray(parsed) ? parsed : [];
      } catch {
        // Extract JSON array from mixed text
        const jsonMatch = allText.match(/\[\s*\{[\s\S]*?\}\s*\]/);
        if (jsonMatch) {
          discovered = JSON.parse(jsonMatch[0]);
        } else {
          const cleanText = allText.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
          discovered = JSON.parse(cleanText);
        }
      }
    }
  } catch (parseErr) {
    console.error('Parse error:', parseErr);
    return new Response(JSON.stringify({ error: 'parse_failed' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  if (!Array.isArray(discovered) || discovered.length === 0) {
    return new Response(JSON.stringify({ error: 'no_codes_found' }), {
      status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // Extract citations from grounding metadata
  const citations = aiData.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => ({
    uri: chunk.web?.uri || '',
    title: chunk.web?.title || ''
  })).filter((c: any) => c.uri) || [];

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
    citations: citations,
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
}
