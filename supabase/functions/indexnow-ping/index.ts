import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Notifies IndexNow-participating search engines (Bing, Yandex, Seznam, and
// others — not Google, which doesn't take part in this protocol) the moment
// a page is published or updated, instead of waiting for the next crawl.
const DOMAIN = "freefireredeemcodetoday.com";
const INDEXNOW_KEY = "ff-indexnow-key-2025";
const KEY_LOCATION = `https://${DOMAIN}/${INDEXNOW_KEY}.txt`;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  try {
    const { urls } = await req.json();
    if (!Array.isArray(urls) || urls.length === 0) {
      return new Response(JSON.stringify({ error: "urls array required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Only ever ping our own domain's URLs — never let caller-supplied hosts through.
    const urlList = urls
      .filter((u: unknown): u is string => typeof u === "string" && u.startsWith(`https://${DOMAIN}/`))
      .slice(0, 10000);

    if (urlList.length === 0) {
      return new Response(JSON.stringify({ error: "no valid urls for this domain" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const res = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host: DOMAIN,
        key: INDEXNOW_KEY,
        keyLocation: KEY_LOCATION,
        urlList,
      }),
    });

    return new Response(JSON.stringify({ submitted: urlList.length, indexNowStatus: res.status }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
