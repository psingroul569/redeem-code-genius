import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Max-Age": "86400",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const body = req.method === "POST" ? await req.json().catch(() => ({})) : {};
    const region = String(url.searchParams.get("region") || body?.region || "GLOBAL").toUpperCase();

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data: latestLog, error: latestError } = await supabase
      .from("sync_log")
      .select("hour_key, synced_at")
      .eq("region", region)
      .order("synced_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (latestError) throw latestError;

    if (!latestLog?.hour_key) {
      return new Response(
        JSON.stringify({ region, hourKey: null, syncedAt: null, codes: [] }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { data: codeRows, error: rowsError } = await supabase
      .from("synced_codes")
      .select("code,reward,category,slug,status,probability,recent_claims,likes,citations,synced_at")
      .eq("region", region)
      .eq("hour_key", latestLog.hour_key)
      .order("synced_at", { ascending: false })
      .limit(50);

    if (rowsError) throw rowsError;

    return new Response(
      JSON.stringify({
        region,
        hourKey: latestLog.hour_key,
        syncedAt: latestLog.synced_at,
        codes: codeRows ?? [],
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "unknown_error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
