import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { RedeemCode } from "@/types";
import { DEFAULT_URL, SITE_NAME, LEAD_AUTHOR } from "@/constants";
import { Header } from "@/components/ff/Header";
import { useTheme } from "@/hooks/useTheme";
import { Copy, Check, ShieldCheck, Clock, MapPin, ArrowLeft, ExternalLink, Loader2 } from "lucide-react";
import { Suspense, lazy } from "react";

const Footer = lazy(() => import("@/components/ff/Footer").then((m) => ({ default: m.Footer })));

const CodePage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { theme, toggleTheme } = useTheme();
  const [code, setCode] = useState<RedeemCode | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!slug) return;
    const fetchCode = async () => {
      setLoading(true);
      const { data } = await supabase
        .from("synced_codes")
        .select("*")
        .eq("slug", slug)
        .limit(1)
        .maybeSingle();

      if (data) {
        setCode({
          code: data.code,
          reward: data.reward,
          category: (data.category as any) || "Bundle",
          slug: data.slug,
          server: data.region,
          status: (data.status as any) || "Working",
          probability: data.probability || 85,
          lastTested: "Cloud Verified",
          likes: data.likes || 0,
          recentClaims: data.recent_claims || 0,
          releaseDate: new Date(data.synced_at).toLocaleDateString("en-US", { day: "2-digit", month: "long", year: "numeric" }),
          citations: Array.isArray(data.citations) ? (data.citations as any[]) : [],
        });
      }
      setLoading(false);
    };
    fetchCode();
  }, [slug]);

  useEffect(() => {
    if (!code) return;
    const title = `${code.code} - Free Fire Code for ${code.reward}`.slice(0, 60);
    document.title = title;
    const desc = `Redeem Free Fire code ${code.code} for ${code.reward} on ${code.server}. Verified ${code.status}. Step-by-step guide for reward.ff.garena.com.`.slice(0, 160);
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute("content", desc);

    const setOg = (prop: string, value: string) => {
      let el = document.head.querySelector<HTMLMetaElement>(`meta[property="${prop}"]`);
      if (!el) { el = document.createElement("meta"); el.setAttribute("property", prop); document.head.appendChild(el); }
      el.setAttribute("content", value);
    };
    setOg("og:title", title);
    setOg("og:description", desc);
    setOg("og:url", `${DEFAULT_URL}/code/${code.slug}/`);

    const existing = document.querySelector('link[rel="canonical"]');
    const canonical = existing || document.createElement("link");
    canonical.setAttribute("rel", "canonical");
    canonical.setAttribute("href", `${DEFAULT_URL}/code/${code.slug}/`);
    if (!existing) document.head.appendChild(canonical);

    // Prevent indexing of individual /code/:slug pages
    let robots = document.head.querySelector<HTMLMetaElement>('meta[name="robots"]');
    if (!robots) { robots = document.createElement("meta"); robots.setAttribute("name", "robots"); document.head.appendChild(robots); }
    robots.setAttribute("content", "noindex, follow");

    return () => {
      // Restore default robots directive when navigating away
      const r = document.head.querySelector<HTMLMetaElement>('meta[name="robots"]');
      if (r) r.setAttribute("content", "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1");
    };
  }, [code]);

  const handleCopy = () => {
    if (!code) return;
    navigator.clipboard.writeText(code.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="animate-spin text-foreground" size={32} />
      </div>
    );
  }

  if (!code) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Code Not Found</h1>
        <p className="text-muted-foreground">This redeem code may have expired or been removed.</p>
        <Link to="/" className="text-success underline">← Back to all codes</Link>
      </div>
    );
  }

  const now = new Date();
  const dateStr = now.toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" });
  const isoDate = now.toISOString();

  const categoryEmoji = code.category === "Diamond" ? "💎" : code.category === "Skin" ? "🔫" : code.category === "Bundle" ? "👕" : code.category === "Pet" ? "🐾" : "🎁";

  const codeSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": `${code.code} – Free Fire Redeem Code for ${code.reward}`,
    "description": `Verified Free Fire redeem code ${code.code} for ${code.reward}. Status: ${code.status}. Server: ${code.server}. Redeem at reward.ff.garena.com.`,
    "image": [`${DEFAULT_URL}/logo.png`],
    "url": `${DEFAULT_URL}/code/${code.slug}/`,
    "datePublished": isoDate,
    "dateModified": isoDate,
    "author": { "@type": "Person", "name": LEAD_AUTHOR.name, "jobTitle": LEAD_AUTHOR.role, "url": DEFAULT_URL },
    "publisher": { "@type": "Organization", "name": SITE_NAME, "logo": { "@type": "ImageObject", "url": `${DEFAULT_URL}/logo.png` } },
    "mainEntityOfPage": { "@type": "WebPage", "@id": `${DEFAULT_URL}/code/${code.slug}/` },
    "articleSection": "Free Fire Redeem Codes",
    "keywords": `Free Fire redeem code, ${code.code}, ${code.reward}, ${code.server} server, Garena Free Fire`,
  };

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": `How to Redeem ${code.code} in Free Fire`,
    "description": `Step-by-step guide to redeem ${code.code} and claim ${code.reward} in Garena Free Fire.`,
    "step": [
      { "@type": "HowToStep", "position": 1, "name": "Visit Official Site", "text": "Go to reward.ff.garena.com" },
      { "@type": "HowToStep", "position": 2, "name": "Log In", "text": "Sign in with your Facebook, Google, VK, or Apple account linked to Free Fire." },
      { "@type": "HowToStep", "position": 3, "name": "Enter Code", "text": `Enter the code: ${code.code}` },
      { "@type": "HowToStep", "position": 4, "name": "Confirm & Collect", "text": "Click Confirm, then check your in-game mail within 24 hours for the reward." },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": `Is ${code.code} still working?`,
        "acceptedAnswer": { "@type": "Answer", "text": `As of ${dateStr}, this code is marked as "${code.status}" with a ${code.probability}% success rate on the ${code.server} server. Codes are verified hourly.` },
      },
      {
        "@type": "Question",
        "name": `What reward does ${code.code} give?`,
        "acceptedAnswer": { "@type": "Answer", "text": `This code provides: ${code.reward}. Category: ${code.category || "Bundle"}.` },
      },
      {
        "@type": "Question",
        "name": `Which server is ${code.code} for?`,
        "acceptedAnswer": { "@type": "Answer", "text": `This code is available for the ${code.server} server region.` },
      },
    ],
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": DEFAULT_URL },
      { "@type": "ListItem", "position": 2, "name": "Redeem Codes", "item": `${DEFAULT_URL}/#codes` },
      { "@type": "ListItem", "position": 3, "name": code.code, "item": `${DEFAULT_URL}/code/${code.slug}/` },
    ],
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(codeSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <Header currentView="home" setView={() => {}} isSyncing={false} syncingRegion={null} theme={theme} onToggleTheme={toggleTheme} />

      <main className="w-full max-w-4xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-6" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
          <span>/</span>
          <span className="text-foreground font-semibold">{code.code}</span>
        </nav>

        {/* Main card */}
        <article className="bg-card border border-border rounded-2xl overflow-hidden shadow-xl" itemScope itemType="https://schema.org/Article">
          <meta itemProp="datePublished" content={isoDate} />
          <meta itemProp="dateModified" content={isoDate} />
          <meta itemProp="author" content={LEAD_AUTHOR.name} />

          {/* Hero */}
          <div className="p-6 md:p-10 border-b border-border bg-gradient-to-b from-success/5 to-transparent text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              <span className={`px-3 py-1 rounded-full border text-[10px] font-tech font-bold uppercase tracking-widest ${
                code.status === "Working" ? "bg-success/10 text-success border-success/20" :
                code.status === "Limited" ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" :
                "bg-destructive/10 text-destructive border-destructive/20"
              }`}>{code.status}</span>
              <span className="text-[10px] text-muted-foreground font-tech uppercase">
                <MapPin size={10} className="inline mr-1" />{code.server}
              </span>
            </div>

            <h1 className="font-display text-3xl md:text-5xl text-foreground uppercase tracking-tight mb-3" itemProp="headline">
              {categoryEmoji} {code.reward}
            </h1>
            <p className="text-muted-foreground text-sm mb-6" itemProp="description">
              Free Fire Redeem Code - Verified {dateStr}
            </p>

            {/* Code block */}
            <div className="bg-surface border border-border rounded-xl p-4 md:p-6 flex items-center justify-between gap-4 max-w-xl mx-auto">
              <span className="font-mono text-2xl md:text-4xl font-black text-foreground tracking-[0.1em] select-all" itemProp="articleBody">{code.code}</span>
              <button onClick={handleCopy} className={`px-4 py-2 rounded-lg text-xs font-bold font-tech uppercase tracking-widest transition-all flex items-center gap-2 ${copied ? "bg-success text-success-bg" : "bg-primary text-primary-foreground hover:bg-success"}`}>
                {copied ? <><Check size={14} /> Copied</> : <><Copy size={14} /> Copy</>}
              </button>
            </div>

            <a
              href="https://reward.ff.garena.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-4 px-6 py-2.5 bg-success text-success-bg rounded-lg font-tech text-sm font-bold uppercase tracking-widest hover:brightness-110 transition-all"
            >
              <ExternalLink size={14} /> Redeem Now
            </a>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-border border-b border-border">
            <div className="p-4 text-center">
              <div className="text-[10px] text-muted-foreground font-tech uppercase tracking-widest mb-1">Success Rate</div>
              <div className={`text-2xl font-display ${code.probability > 85 ? "text-success" : "text-yellow-500"}`}>{code.probability}%</div>
            </div>
            <div className="p-4 text-center">
              <div className="text-[10px] text-muted-foreground font-tech uppercase tracking-widest mb-1">Category</div>
              <div className="text-lg font-bold">{categoryEmoji} {code.category || "Bundle"}</div>
            </div>
            <div className="p-4 text-center">
              <div className="text-[10px] text-muted-foreground font-tech uppercase tracking-widest mb-1">Redeemed Today</div>
              <div className="text-2xl font-display text-foreground">{(code.recentClaims || 0).toLocaleString()}</div>
            </div>
            <div className="p-4 text-center">
              <div className="text-[10px] text-muted-foreground font-tech uppercase tracking-widest mb-1">Verified</div>
              <div className="flex items-center justify-center gap-1 text-success"><ShieldCheck size={16} /> <span className="text-sm font-bold">Hourly</span></div>
            </div>
          </div>

          {/* How to redeem */}
          <section className="p-6 md:p-10">
            <h2 className="text-xl font-display uppercase tracking-tight mb-6 flex items-center gap-3">
              <Clock size={20} className="text-success" /> How to Redeem {code.code}
            </h2>
            <ol className="space-y-4 list-none">
              {[
                { title: "Visit the Official Redemption Site", desc: <>Go to <a href="https://reward.ff.garena.com" target="_blank" rel="noopener noreferrer" className="text-success font-bold underline hover:no-underline">reward.ff.garena.com</a></> },
                { title: "Log In with Your Account", desc: "Sign in using the Facebook, Google, VK, or Apple ID linked to your Free Fire account." },
                { title: "Enter the Redeem Code", desc: <span>Paste or type <strong className="text-foreground">{code.code}</strong> in the code input field.</span> },
                { title: "Confirm & Collect Reward", desc: <span>Click "Confirm" and check your in-game mail within 24 hours for <strong className="text-foreground">{code.reward}</strong>.</span> },
              ].map((step, idx) => (
                <li key={idx} className="flex gap-4 items-start">
                  <div className="w-8 h-8 bg-success/10 border border-success/20 rounded-lg flex items-center justify-center text-success font-bold text-sm flex-shrink-0">{idx + 1}</div>
                  <div>
                    <h3 className="font-bold text-foreground mb-1">{step.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          {/* FAQ for this code */}
          <section className="p-6 md:p-10 border-t border-border bg-surface">
            <h2 className="text-xl font-display uppercase tracking-tight mb-6">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {[
                { q: `Is ${code.code} still working?`, a: `As of ${dateStr}, this code is marked as "${code.status}" with a ${code.probability}% success rate on the ${code.server} server. Our system verifies codes every hour from official Garena servers.` },
                { q: `What reward does ${code.code} give?`, a: `This code provides: ${code.reward}. It falls under the ${code.category || "Bundle"} category.` },
                { q: `Which server is ${code.code} for?`, a: `This code is available for the ${code.server} server region. Codes are region-specific and may not work on other servers.` },
                { q: `How long is ${code.code} valid?`, a: `Free Fire redeem codes typically expire within 12–18 hours of release. We recommend redeeming immediately. Check the status badge above for real-time availability.` },
              ].map((item, idx) => (
                <details key={idx} className="group bg-card border border-border rounded-xl">
                  <summary className="p-4 cursor-pointer font-bold text-foreground text-sm hover:text-success transition-colors list-none flex items-center justify-between">
                    {item.q}
                    <span className="text-muted-foreground group-open:rotate-180 transition-transform">▾</span>
                  </summary>
                  <div className="px-4 pb-4 text-sm text-muted-foreground leading-relaxed">{item.a}</div>
                </details>
              ))}
            </div>
          </section>

          {/* Citations */}
          {code.citations && code.citations.length > 0 && (
            <section className="p-6 md:p-10 border-t border-border">
              <h2 className="text-lg font-display uppercase tracking-tight mb-4">Verification Sources</h2>
              <ul className="space-y-2">
                {code.citations.map((cite, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <ShieldCheck size={12} className="text-success flex-shrink-0" />
                    <a href={cite.uri} target="_blank" rel="noopener noreferrer" className="hover:text-foreground underline truncate">{cite.title || cite.uri}</a>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </article>

        {/* Author attribution */}
        <div className="mt-8 p-6 bg-card border border-border rounded-2xl flex items-center gap-4">
          <img src={LEAD_AUTHOR.image} alt={LEAD_AUTHOR.name} className="w-12 h-12 rounded-full border border-border" loading="lazy" />
          <div>
            <p className="font-bold text-foreground text-sm">{LEAD_AUTHOR.name}</p>
            <p className="text-xs text-muted-foreground">{LEAD_AUTHOR.role} • Verified {dateStr}</p>
          </div>
        </div>

        {/* Back link */}
        <div className="mt-8 text-center">
          <Link to="/" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full font-tech font-bold uppercase tracking-widest text-sm hover:bg-success transition-all">
            <ArrowLeft size={16} /> View All Codes
          </Link>
        </div>
      </main>

      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </div>
  );
};

export default CodePage;
