import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const REGIONS: Record<string, { query: string; server: string }> = {
  'GLOBAL': { query: 'Working Free Fire redeem codes today for all regions. Prioritize Garena\'s official Free Fire social accounts (X/Twitter, Facebook, Instagram, YouTube) and reward.ff.garena.com announcements.', server: 'GLOBAL' },
  'INDIA': { query: 'Free Fire India (IND) server redeem codes today. Search in Hindi and English. Prioritize Garena Free Fire India\'s official social accounts and reputable outlets like Sportskeeda, Times of India Gaming. Exclude Global/BR.', server: 'INDIA (IND)' },
  'BRAZIL': { query: 'Códigos de resgate Free Fire Brasil (BR) hoje. Prioritize official Free Fire Brasil social accounts and sites like ffmania.com.br. Exclude Global/India.', server: 'BRAZIL (BR)' },
  'INDONESIA': { query: 'Kode redeem Free Fire Indonesia (ID) terbaru. Prioritize official Free Fire Indonesia social accounts and sites like Booyah News, Dunia Games. Exclude Global codes.', server: 'INDONESIA (ID)' },
  'EUROPE': { query: 'Free Fire Europe (EU) server redeem codes. Prioritize official Free Fire Europe social accounts. Exclude other regions.', server: 'EUROPE (EU)' },
};

const MODELS = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-2.5-flash-lite'];

function extractJsonArray(text: string): any[] | null {
  // Clean control characters
  const clean = text.replace(/[\x00-\x09\x0B\x0C\x0E-\x1F\x7F]/g, ' ');
  
  // Try direct parse — an empty array is a legitimate "no codes found" result,
  // not a parse failure, so it's accepted here too.
  try {
    const parsed = JSON.parse(clean.trim());
    if (Array.isArray(parsed)) return parsed;
  } catch {}

  // Find all JSON array candidates and return the longest valid one
  const regex = /\[[\s\S]*?\}\s*\]/g;
  let best: any[] | null = null;
  let match;
  
  while ((match = regex.exec(clean)) !== null) {
    try {
      const arr = JSON.parse(match[0]);
      if (Array.isArray(arr) && arr.length > 0) {
        if (!best || arr.length > best.length) best = arr;
      }
    } catch {}
  }
  
  if (best) return best;

  // Try after stripping markdown
  const stripped = clean.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
  try {
    const parsed = JSON.parse(stripped);
    if (Array.isArray(parsed)) return parsed;
  } catch {}

  return null;
}

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
    const hourKey = `${now.getUTCFullYear()}-${now.getUTCMonth() + 1}-${now.getUTCDate()}-${now.getUTCHours()}`;

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

    const prompt = `You are a rewards verification bot. Date: ${today}.
Find up to 12 active Free Fire redeem codes. ${loc.query} Codes MUST be for the ${region} server only. Each code is typically 12-16 alphanumeric characters, sometimes with hyphens.

Strict rules:
- Only include a code if you can name the SPECIFIC reward it gives (e.g. "500 Diamonds", "M4A1 Wild Beast Weapon Skin"). Never write "Unknown", "Reward", "Garena Reward", or any other placeholder — if you don't know the specific reward, OMIT that code entirely rather than guessing.
- Only include codes you found via an actual web search result, not from memory or inference.
- It is fine to return fewer than 12 codes, or an empty array, if that's all you can verify with a real source.

You MUST respond with ONLY a JSON array. No explanations. No markdown code blocks. Just the raw JSON array.
Example: [{"code":"FF12-ABCD-5678","reward":"500 Diamonds","category":"Diamond"}]
Categories allowed: Diamond, Skin, Bundle, Voucher, Pet`;

    let aiData: any = null;
    let lastError = '';

    for (const model of MODELS) {
      console.log(`Trying model: ${model}`);
      try {
        const aiResponse = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              tools: [{ google_search: {} }],
              generationConfig: {
                temperature: 0.2,
                maxOutputTokens: 4096,
              },
            }),
          }
        );

        if (aiResponse.status === 429 || aiResponse.status === 404) {
          lastError = `${model}: ${aiResponse.status}`;
          await aiResponse.text(); // consume body
          console.log(`${model} returned ${aiResponse.status}, trying next...`);
          continue;
        }

        if (!aiResponse.ok) {
          lastError = `${model}: ${aiResponse.status}`;
          await aiResponse.text();
          continue;
        }

        aiData = await aiResponse.json();
        console.log(`Success with model: ${model}`);
        break;
      } catch (fetchErr) {
        lastError = `${model}: ${fetchErr}`;
        continue;
      }
    }

    if (!aiData) {
      return new Response(JSON.stringify({ error: `All models failed. Last: ${lastError}` }), {
        status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Extract text - handle each part separately to avoid fragment concatenation issues
    const parts = aiData.candidates?.[0]?.content?.parts || [];
    const textParts = parts.filter((p: any) => !p.thought && p.text);
    
    let discovered: any[] | null = null;

    // Try each text part individually first (find the one with the best JSON)
    for (const part of textParts) {
      const result = extractJsonArray(part.text);
      if (result && (!discovered || result.length > discovered.length)) {
        discovered = result;
      }
    }

    // If no single part worked, try concatenated text
    if (!discovered) {
      const allText = textParts.map((p: any) => p.text).join('');
      console.log('Concatenated text length:', allText.length, 'Preview:', allText.substring(0, 300));
      discovered = extractJsonArray(allText);
    }

    if (!discovered) {
      console.error('Could not parse codes from response');
      return new Response(JSON.stringify({ error: 'parse_failed' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`Parsed ${discovered.length} codes`);

    if (discovered.length === 0) {
      // The model searched and genuinely found nothing verifiable this hour —
      // a legitimate outcome (especially with strict rules against guessing),
      // not an error. Log the sync attempt so shouldSyncRegion doesn't retry
      // needlessly within the same hour, and return cleanly.
      await supabase.from('sync_log').upsert({ region, hour_key: hourKey, code_count: 0 }, { onConflict: 'region,hour_key' });
      return new Response(JSON.stringify({ status: 'no_codes_found', region, hour_key: hourKey }), {
        status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const citations = aiData.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => ({
      uri: chunk.web?.uri || '',
      title: chunk.web?.title || ''
    })).filter((c: any) => c.uri) || [];

    // Zero grounding chunks means Google Search found nothing backing this
    // response — in testing, that case reliably correlated with the model
    // recalling old/hallucinated codes from training data instead of live
    // results (confirmed: it reproduced exact codes from a stale May 2026
    // export, with generic rewards like "Free skins, diamonds, and more").
    // Refuse to publish anything from an ungrounded response at all.
    if (citations.length === 0) {
      console.log('Zero grounding citations — refusing to publish (likely hallucinated, not live-searched)');
      return new Response(JSON.stringify({ status: 'ungrounded_response_rejected', region, hour_key: hourKey }), {
        status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Defense in depth: drop anything the model produced without a real code or a
    // specific reward, even though the prompt already tells it not to guess.
    const VAGUE_REWARDS = new Set(['unknown', 'reward', 'garena reward', 'n/a', 'tbd', '']);
    const validDiscovered = discovered.filter((item: any) => {
      const code = String(item.code || '').trim();
      const reward = String(item.reward || '').trim();
      return code.length >= 8 && reward.length >= 3 && !VAGUE_REWARDS.has(reward.toLowerCase());
    });
    console.log(`${discovered.length - validDiscovered.length} codes dropped for missing code/reward`);

    if (validDiscovered.length === 0) {
      return new Response(JSON.stringify({ status: 'no_verifiable_codes', region, hour_key: hourKey }), {
        status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const rows = validDiscovered.map((item: any) => ({
      region,
      hour_key: hourKey,
      code: item.code,
      reward: item.reward,
      category: item.category || 'Bundle',
      slug: `${region.toLowerCase()}-${hourKey}-${(item.code || '').toLowerCase().replace(/[^a-z0-9]/g, '')}`,
      status: 'Working',
      probability: 90,
      recent_claims: 0,
      likes: 0,
      citations: citations,
      source: 'ai',
    }));

    // Work out which of these codes are genuinely new for this region (not
    // just re-synced) before upserting, so push notifications only fire for
    // codes subscribers haven't already been told about.
    const { data: existingCodes } = await supabase
      .from('synced_codes')
      .select('code')
      .eq('region', region)
      .in('code', rows.map((r: any) => r.code));
    const existingSet = new Set((existingCodes || []).map((r: any) => r.code));
    const newRows = rows.filter((r: any) => !existingSet.has(r.code));

    const { error: insertError } = await supabase
      .from('synced_codes')
      .upsert(rows, { onConflict: 'region,hour_key,code' });

    if (insertError) {
      console.error('Insert error:', insertError);
      throw new Error(`DB insert failed: ${insertError.message}`);
    }

    // Fire push notifications for genuinely new codes only (best-effort, never blocks the sync).
    if (newRows.length > 0) {
      try {
        const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
        await fetch(`${supabaseUrl}/functions/v1/send-push`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
          },
          body: JSON.stringify({ region, code: newRows[0].code, reward: newRows[0].reward }),
        });
      } catch (pushErr) {
        console.log('Push notify failed (non-critical):', pushErr);
      }
    }

    await supabase.from('sync_log').upsert({
      region,
      hour_key: hourKey,
      code_count: rows.length,
    }, { onConflict: 'region,hour_key' });

    // Ping IndexNow to notify search engines of new code pages
    try {
      const codeUrls = rows.map((r: any) => `https://freefireredeemcodetoday.com/code/${r.slug}`);
      // Also include homepage since codes updated
      const allUrls = ['https://freefireredeemcodetoday.com/', ...codeUrls];
      await fetch('https://api.indexnow.org/indexnow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          host: 'freefireredeemcodetoday.com',
          key: 'ff-indexnow-key-2025',
          keyLocation: 'https://freefireredeemcodetoday.com/ff-indexnow-key-2025.txt',
          urlList: allUrls,
        }),
      });
      console.log(`IndexNow pinged with ${allUrls.length} URLs`);
    } catch (indexErr) {
      console.log('IndexNow ping failed (non-critical):', indexErr);
    }

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
