import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Max-Age": "86400",
};

const SELECT_COLUMNS = "id,code,reward,category,slug,status,probability,recent_claims,likes,dislikes,citations,synced_at";

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

    // Manual codes live outside the hourly AI bucketing — they stay visible
    // until they expire (or an admin marks them Expired), not just for one hour.
    const nowIso = new Date().toISOString();
    const { data: manualRows, error: manualError } = await supabase
      .from("synced_codes")
      .select(SELECT_COLUMNS)
      .eq("region", region)
      .eq("source", "manual")
      .eq("status", "Working")
      .or(`expires_at.is.null,expires_at.gt.${nowIso}`)
      .order("synced_at", { ascending: false });

    if (manualError) throw manualError;

    const { data: latestLog, error: latestError } = await supabase
      .from("sync_log")
      .select("hour_key, synced_at")
      .eq("region", region)
      .order("synced_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (latestError) throw latestError;

    let aiRows: any[] = [];
    if (latestLog?.hour_key) {
      const { data, error: rowsError } = await supabase
        .from("synced_codes")
        .select(SELECT_COLUMNS)
        .eq("region", region)
        .eq("hour_key", latestLog.hour_key)
        .eq("source", "ai")
        .order("synced_at", { ascending: false })
        .limit(50);
      if (rowsError) throw rowsError;
      aiRows = data ?? [];
    }

    const codes = [...(manualRows ?? []), ...aiRows];

    return new Response(
      JSON.stringify({
        region,
        hourKey: latestLog?.hour_key ?? null,
        syncedAt: latestLog?.synced_at ?? (manualRows?.[0]?.synced_at ?? null),
        codes,
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
