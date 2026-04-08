import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const DOMAIN = "https://freefireredeemcodetoday.com";

const staticPages = [
  { loc: "/", changefreq: "hourly", priority: "1.0" },
  { loc: "/blogs", changefreq: "daily", priority: "0.9" },
  { loc: "/how-to-guide", changefreq: "weekly", priority: "0.8" },
  { loc: "/guides", changefreq: "weekly", priority: "0.8" },
  { loc: "/faq", changefreq: "weekly", priority: "0.7" },
  { loc: "/help", changefreq: "monthly", priority: "0.5" },
  { loc: "/contact", changefreq: "monthly", priority: "0.5" },
  { loc: "/about-us", changefreq: "monthly", priority: "0.5" },
  { loc: "/disclaimer", changefreq: "monthly", priority: "0.3" },
  { loc: "/privacy-policy", changefreq: "monthly", priority: "0.3" },
  { loc: "/terms", changefreq: "monthly", priority: "0.3" },
];

function escapeXml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function toW3CDate(d: string) {
  return new Date(d).toISOString().split("T")[0];
}

Deno.serve(async () => {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  // Fetch published posts, pages, and latest synced codes in parallel
  const [postsRes, pagesRes, codesRes] = await Promise.all([
    supabase
      .from("posts")
      .select("slug, updated_at, published_at")
      .eq("status", "published")
      .eq("visibility", "public")
      .order("published_at", { ascending: false }),
    supabase
      .from("pages")
      .select("slug, updated_at, published_at")
      .eq("status", "published"),
    supabase
      .from("synced_codes")
      .select("slug, synced_at, region")
      .eq("status", "Working")
      .order("synced_at", { ascending: false })
      .limit(100),
  ]);

  const posts = postsRes.data || [];
  const pages = pagesRes.data || [];
  const codes = codesRes.data || [];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  // Static pages
  for (const p of staticPages) {
    xml += `  <url>\n    <loc>${escapeXml(DOMAIN + p.loc)}</loc>\n    <changefreq>${p.changefreq}</changefreq>\n    <priority>${p.priority}</priority>\n  </url>\n`;
  }

  // Dynamic blog posts
  for (const post of posts) {
    const lastmod = toW3CDate(post.updated_at || post.published_at);
    xml += `  <url>\n    <loc>${escapeXml(DOMAIN + "/blogs/" + post.slug)}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.7</priority>\n  </url>\n`;
  }

  // Dynamic CMS pages
  const staticSlugs = new Set(staticPages.map((p) => p.loc.replace("/", "")));
  for (const page of pages) {
    if (staticSlugs.has(page.slug)) continue;
    const lastmod = toW3CDate(page.updated_at || page.published_at);
    xml += `  <url>\n    <loc>${escapeXml(DOMAIN + "/" + page.slug)}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.5</priority>\n  </url>\n`;
  }

  // Individual redeem code pages
  const seenSlugs = new Set<string>();
  for (const code of codes) {
    if (seenSlugs.has(code.slug)) continue;
    seenSlugs.add(code.slug);
    const lastmod = toW3CDate(code.synced_at);
    xml += `  <url>\n    <loc>${escapeXml(DOMAIN + "/code/" + code.slug)}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>hourly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
  }

  xml += `</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=1800",
    },
  });
});
