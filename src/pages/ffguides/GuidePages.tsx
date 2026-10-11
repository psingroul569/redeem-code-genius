import React, { useState } from "react";
import { Link, Navigate, useParams, useSearchParams } from "react-router-dom";
import {
  ChevronRight, ArrowRight, BookOpen, ShieldCheck, Gift,
  ListChecks, Lightbulb, AlertTriangle, Info, Share2, Star, X, Download, Gamepad2, Gem,
} from "lucide-react";
import { useSEO } from "@/hooks/useSEO";
import { FF_CATEGORIES, GRADE_STYLES, GRADE_COLORS, findCategory, findItem, GuideItem } from "@/data/ffGuides";
import { GuideShell, SectionTitle, CATEGORY_ICONS, BottomNav, useGuidePageView } from "./GuideShell";
import { AdSlot } from "@/components/ff/AdSlot";
import { AD_SLOTS, ADS_CONVERSIONS, adsConversion, track, showRewardedAd } from "@/lib/ads";
import { SERVERS, RANKS, personalTips } from "./GuideSteps";

const card = "bg-surface border border-border rounded-2xl";

const CATEGORY_ACCENTS: Record<string, string> = {
  "gun-skins": "#f5b942",
  "evo-guns": "#f97316",
  bundles: "#8b5cf6",
  emotes: "#d946ef",
  pets: "#3b82f6",
  characters: "#38bdf8",
  "gloo-walls": "#14b8a6",
  "account-safety": "#f43f5e",
};

const GradeBadge: React.FC<{ grade: GuideItem["grade"] }> = ({ grade }) => (
  <span className={`inline-block px-2 py-0.5 rounded-md border text-[10px] font-bold uppercase tracking-wider ${GRADE_STYLES[grade]}`}>
    {grade}
  </span>
);

const share = async () => {
  const data = { title: document.title, url: window.location.href };
  try {
    if (navigator.share) await navigator.share(data);
    else await navigator.clipboard.writeText(data.url);
  } catch {
    /* user cancelled */
  }
};

/* ---------- /ff-guides : splash ---------- */
const SPLASH_TILES = [
  { key: "rate", label: "Rate Our App", icon: Star, tone: "border-amber-500/40 text-amber-400 bg-amber-500/10" },
  { key: "share", label: "Share Our App", icon: Share2, tone: "border-cyan-400/40 text-cyan-300 bg-cyan-400/10" },
  { key: "privacy", label: "Privacy Policy", icon: ShieldCheck, tone: "border-violet-500/40 text-violet-300 bg-violet-500/10", to: "/ff-guides/privacy-policy" },
  { key: "disclaimer", label: "Disclaimer", icon: Info, tone: "border-rose-500/40 text-rose-300 bg-rose-500/10", to: "/ff-guides/disclaimer" },
] as const;

const RATED_KEY = "ffg_rating";

export const GuideSplash = () => {
  useGuidePageView();
  const [rateOpen, setRateOpen] = useState(false);
  const [rating, setRating] = useState<number>(() => {
    try { return Number(localStorage.getItem(RATED_KEY)) || 0; } catch { return 0; }
  });

  useSEO({
    title: "FF Guides: Free Fire Skins, Pets & Characters Guide",
    description: "A free Free Fire guide web-app: how every bundle, gun skin, Evo gun, emote, pet and character is really unlocked, plus account safety tips.",
    path: "/ff-guides",
  });

  const rate = (n: number) => {
    setRating(n);
    try { localStorage.setItem(RATED_KEY, String(n)); } catch { /* storage unavailable */ }
  };

  return (
    <div className="min-h-screen bg-[#05070d] text-white font-tech flex flex-col items-center px-5 pt-12 pb-28 text-center relative overflow-hidden">
      <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[520px] h-[520px] rounded-full bg-indigo-600/25 blur-[120px]" />

      <div className="relative w-full max-w-md animate-in fade-in zoom-in-95 duration-500">
        <div className="w-44 h-44 mx-auto rounded-[2rem] bg-gradient-to-br from-indigo-500/30 via-fuchsia-500/20 to-cyan-400/20 border border-white/10 shadow-[0_0_60px_rgba(99,102,241,0.45)] flex items-center justify-center">
          <img src="/logo.png" alt="FF Guides" className="w-32 h-32 object-contain drop-shadow-[0_0_20px_rgba(56,189,248,0.5)]" />
        </div>

        <div className="mt-8 text-sm tracking-[0.35em] uppercase text-white/50 font-bold">Welcome to</div>
        <h1 className="mt-2 text-4xl md:text-5xl font-bold tracking-tight">FF Guides</h1>

        <Link
          to="/ff-guides/categories"
          className="mt-8 flex items-center justify-center gap-3 w-full py-5 rounded-3xl bg-gradient-to-r from-sky-300 to-blue-600 text-slate-900 text-xl font-bold uppercase tracking-[0.12em] shadow-[0_0_40px_rgba(56,189,248,0.45)] border border-sky-200/40 hover:brightness-110 active:scale-[0.98] transition"
        >
          Get Started <ArrowRight size={24} />
        </Link>

        <div className="mt-8 grid grid-cols-2 gap-4">
          {SPLASH_TILES.map((t) => {
            const Icon = t.icon;
            const inner = (
              <>
                <span className={`w-14 h-14 rounded-2xl border flex items-center justify-center ${t.tone}`}>
                  <Icon size={24} />
                </span>
                <span className="mt-4 font-bold uppercase tracking-wider text-[15px]">{t.label}</span>
              </>
            );
            const cls = `rounded-3xl border bg-white/[0.03] py-6 px-3 flex flex-col items-center hover:bg-white/[0.06] active:scale-[0.98] transition ${t.tone.split(" ")[0]}`;
            if ("to" in t) return <Link key={t.key} to={t.to} className={cls}>{inner}</Link>;
            return (
              <button key={t.key} onClick={t.key === "share" ? share : () => setRateOpen(true)} className={cls}>
                {inner}
              </button>
            );
          })}
        </div>

        <p className="mt-10 text-lg text-white/75 leading-relaxed">
          Every skin, pet, emote and character in Free Fire, explained in one guide. Free, in your browser.
        </p>
        <AdSlot slot={AD_SLOTS.splash} />
      </div>

      <BottomNav dark />

      {rateOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-5" onClick={() => setRateOpen(false)}>
          <div className="w-full max-w-sm rounded-3xl bg-[#0b0f1a] border border-white/10 p-6 animate-in fade-in zoom-in-95" onClick={(e) => e.stopPropagation()}>
            <div className="text-xl font-bold">{rating ? "Thanks for rating!" : "Enjoying FF Guides?"}</div>
            <p className="text-white/60 mt-1">Tap a star to rate.</p>
            <div className="flex justify-center gap-2 mt-5">
              {[1, 2, 3, 4, 5].map((n) => (
                <button key={n} onClick={() => rate(n)} aria-label={`${n} star`}>
                  <Star size={36} className={n <= rating ? "fill-amber-400 text-amber-400" : "text-white/30"} />
                </button>
              ))}
            </div>
            <button onClick={() => setRateOpen(false)} className="mt-6 w-full py-3 rounded-2xl bg-white/10 hover:bg-white/15 font-bold uppercase tracking-wider">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

/* ---------- /ff-guides/how-to ---------- */
const FEATURES = [
  { icon: BookOpen, title: "8 Categories", text: "Bundles, gun skins, Evo guns, emotes, pets, characters and more." },
  { icon: ListChecks, title: "Step-by-step", text: "Clear unlock steps for every item type." },
  { icon: ShieldCheck, title: "100% Safe", text: "No login, no UID, no downloads. Just guides." },
  { icon: Gift, title: "Free Codes", text: "Today's working redeem codes, one tap away." },
];

const HOW_TO = [
  "Tap Get Started on Home and pick a category.",
  "Open any item to see its grade, type and description.",
  "Tap \"How to Get It\" for official unlock steps.",
  "Tap Codes for today's free redeem codes.",
];

const TROUBLESHOOT = [
  { q: "A reward didn't arrive after redeeming a code", a: "Rewards can take up to 24 hours. Check Vault and in-game Mail. Guest accounts can't redeem codes." },
  { q: "An item isn't in my store", a: "Store and Luck Royale rotations differ by region and change often. Check back during the next event." },
  { q: "A site says it can add skins to my UID", a: "It's a scam. Only Garena can add items to your account. See the Account Safety category." },
];

export const GuideHowTo = () => {
  useSEO({
    title: "How To Use | FF Guides",
    description: "Top features, how to use FF Guides, troubleshooting and disclaimer.",
    path: "/ff-guides/how-to",
  });

  return (
    <GuideShell title="How To">
      <SectionTitle>Top Features</SectionTitle>
      <div className="grid grid-cols-2 gap-3">
        {FEATURES.map(({ icon: Icon, title, text }) => (
          <div key={title} className={`${card} p-4`}>
            <Icon size={22} className="text-success" />
            <div className="font-bold text-lg mt-2 leading-tight">{title}</div>
            <div className="text-t-muted text-sm mt-1 leading-snug">{text}</div>
          </div>
        ))}
      </div>

      <SectionTitle>How To Use</SectionTitle>
      <ol className={`${card} p-4 space-y-3`}>
        {HOW_TO.map((step, i) => (
          <li key={i} className="flex gap-3 items-start">
            <span className="w-7 h-7 rounded-full bg-success text-black font-bold flex items-center justify-center flex-shrink-0">{i + 1}</span>
            <span className="text-base pt-0.5">{step}</span>
          </li>
        ))}
      </ol>

      <SectionTitle>Troubleshooting</SectionTitle>
      <div className="space-y-2">
        {TROUBLESHOOT.map(({ q, a }) => (
          <details key={q} className={`${card} p-4 group`}>
            <summary className="font-bold cursor-pointer list-none flex justify-between items-center gap-2">
              {q} <ChevronRight size={16} className="group-open:rotate-90 transition-transform flex-shrink-0" />
            </summary>
            <p className="text-t-muted mt-2">{a}</p>
          </details>
        ))}
      </div>

      <AdSlot slot={AD_SLOTS.page} />

      <SectionTitle>Disclaimer</SectionTitle>
      <div className={`${card} p-4 text-sm text-t-muted flex gap-3`}>
        <Info size={18} className="flex-shrink-0 mt-0.5" />
        <p>
          FF Guides is an independent fan guide. It is not affiliated with, endorsed by, or sponsored by Garena. Free Fire and
          related trademarks belong to their respective owners. We cannot add items to any account. All rewards come only from
          Garena through the game, its events and the official rewards site.{" "}
          <Link to="/ff-guides/disclaimer" className="underline text-foreground">Full disclaimer</Link> ·{" "}
          <Link to="/ff-guides/privacy-policy" className="underline text-foreground">Privacy policy</Link>
        </p>
      </div>
    </GuideShell>
  );
};

/* ---------- /ff-guides/categories ---------- */
export const GuideCategories = () => {
  useSEO({
    title: "FF Guides | Free Fire Unlock Guides",
    description: "Browse Free Fire guides by category: bundles, gun skins, Evo guns, emotes, pets, characters, gloo walls and account safety.",
    path: "/ff-guides/categories",
  });

  return (
    <GuideShell title="Categories" backTo="/ff-guides" dark>
      <div className="flex items-center gap-3 mb-5">
        <span className="w-1.5 h-8 rounded-full bg-indigo-500" />
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Browse Categories</h2>
      </div>
      <div className="grid grid-cols-2 gap-3 md:gap-4">
        {FF_CATEGORIES.map((c) => {
          const Icon = CATEGORY_ICONS[c.icon];
          const accent = CATEGORY_ACCENTS[c.slug] ?? "#6366f1";
          return (
            <Link
              key={c.slug}
              to={`/ff-guides/${c.slug}`}
              className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0a0d16] p-4 md:p-6 min-h-[170px] md:min-h-[220px] flex flex-col hover:border-white/25 active:scale-[0.98] transition"
              style={{ borderTop: `3px solid ${accent}` }}
            >
              <span
                className="pointer-events-none absolute -top-16 -right-10 w-48 h-48 rounded-full blur-3xl opacity-30"
                style={{ background: accent }}
              />
              <span className="relative w-14 h-14 md:w-16 md:h-16 rounded-2xl border border-white/10 bg-white/[0.06] flex items-center justify-center" style={{ color: accent }}>
                <Icon size={30} strokeWidth={1.8} />
              </span>
              <span className="relative mt-5 font-bold text-lg md:text-2xl leading-tight text-white">{c.name}</span>
              <span className="relative mt-1.5 font-mono text-sm md:text-base text-white/60">{c.items.length} guides</span>
              <span
                className="relative mt-auto pt-4 self-start"
              >
                <span
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border text-xs md:text-sm font-bold uppercase tracking-wider"
                  style={{ color: accent, borderColor: `${accent}66`, background: `${accent}1a` }}
                >
                  Explore <ChevronRight size={14} />
                </span>
              </span>
            </Link>
          );
        })}
      </div>
      <AdSlot slot={AD_SLOTS.list} />
    </GuideShell>
  );
};

/* ---------- /ff-guides/:category ---------- */
const ItemRow: React.FC<{ categorySlug: string; item: GuideItem }> = ({ categorySlug, item }) => {
  const color = GRADE_COLORS[item.grade];
  const Icon = CATEGORY_ICONS[findCategory(categorySlug)?.icon ?? "package"];
  return (
    <Link
      to={`/ff-guides/${categorySlug}/${item.slug}/server`}
      className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#111827]/80 p-3 md:p-4 flex items-center gap-3 md:gap-4 hover:border-white/25 active:scale-[0.99] transition"
    >
      <span className="absolute left-0 top-5 bottom-5 w-1 rounded-r-full" style={{ background: color }} />
      <span
        className="ml-2 w-20 h-20 md:w-24 md:h-24 rounded-2xl flex items-center justify-center flex-shrink-0"
        style={{ background: `radial-gradient(circle at 50% 35%, ${color}40, #0b0f1a 75%)`, color }}
      >
        <Icon size={36} strokeWidth={1.6} />
      </span>
      <span className="flex-1 min-w-0">
        <span className="block text-xs uppercase tracking-[0.15em] text-white/50 font-bold">{item.type}</span>
        <span className="block font-bold text-lg md:text-xl text-white leading-tight mt-0.5">{item.name}</span>
        <span
          className="inline-block mt-1.5 px-2.5 py-0.5 border text-[11px] font-bold uppercase tracking-[0.15em]"
          style={{ color, borderColor: `${color}99`, background: `${color}1a` }}
        >
          {item.grade}
        </span>
      </span>
      <span className="flex-shrink-0 inline-flex items-center gap-1 px-4 py-2 md:px-5 md:py-2.5 rounded-full border border-cyan-400/40 bg-cyan-400/5 text-cyan-300 text-xs md:text-sm font-bold uppercase tracking-[0.15em]">
        View <ChevronRight size={16} />
      </span>
    </Link>
  );
};

export const GuideCategory = () => {
  const { category } = useParams();
  const cat = findCategory(category);

  useSEO({
    title: cat ? `${cat.name} Guide | FF Guides` : "FF Guides",
    description: cat?.intro.slice(0, 155) ?? "",
    path: `/ff-guides/${category}`,
  });

  if (!cat) return <Navigate to="/ff-guides/categories" replace />;
  const accent = CATEGORY_ACCENTS[cat.slug] ?? "#6366f1";

  return (
    <GuideShell title={cat.name} backTo="/ff-guides/categories" dark>
      <div className="flex items-center gap-3 mb-2">
        <span className="w-1.5 h-7 rounded-full" style={{ background: accent }} />
        <h2 className="flex-1 font-bold text-lg md:text-xl uppercase tracking-[0.12em] text-white">{cat.name}</h2>
        <span className="px-4 py-1.5 rounded-full border border-white/15 bg-white/[0.04] font-mono text-sm text-white/70">
          {cat.items.length} items
        </span>
      </div>
      <p className="text-white/55 mb-5 leading-snug">{cat.intro}</p>
      <div className="space-y-3 md:space-y-4">
        {cat.items.map((item, i) => (
          <React.Fragment key={item.slug}>
            <ItemRow categorySlug={cat.slug} item={item} />
            {i === 3 && <AdSlot slot={AD_SLOTS.list} />}
          </React.Fragment>
        ))}
      </div>
      <AdSlot slot={AD_SLOTS.list} />
    </GuideShell>
  );
};

/* ---------- claim popup (affiliate) ---------- */
const CLAIM_NOUN: Record<string, string> = { pets: "Pet", characters: "Character", emotes: "Emote", bundles: "Bundle" };

const TAPZO_URL = "https://play.google.com/store/apps/details?id=com.gettapzo.app&referrer=tapzo_ref_PUSHPE93";

const CLAIM_STEPS = [
  { icon: Download, title: "Install the app", text: "Download Tapzo free from Google Play." },
  { icon: Gamepad2, title: "Play some games", text: "Play games, quizzes and simple tasks to earn coins." },
  { icon: Gem, title: "Get your reward", text: "Redeem coins for Free Fire diamonds, then use them in-game for this item when it's available." },
];

const ClaimModal: React.FC<{ itemName: string; category: string; item: string; onClose: () => void }> = ({ itemName, category, item, onClose }) => (
  <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-5" onClick={onClose}>
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`How to claim ${itemName}`}
      className="w-full sm:max-w-md max-h-[90vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl bg-[#0b0f1a] border border-white/10 p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] text-white animate-in fade-in slide-in-from-bottom-4"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <div className="text-xs uppercase tracking-[0.2em] text-cyan-300 font-bold">How to claim</div>
          <h3 className="text-xl font-bold leading-tight mt-1">{itemName}</h3>
        </div>
        <button onClick={onClose} aria-label="Close" className="w-9 h-9 rounded-xl border border-white/10 flex items-center justify-center hover:bg-white/10">
          <X size={18} />
        </button>
      </div>

      <ol className="mt-5 space-y-3">
        {CLAIM_STEPS.map(({ icon: Icon, title, text }, i) => (
          <li key={title} className="flex gap-3 items-start rounded-2xl border border-white/10 bg-white/[0.03] p-3">
            <span className="w-10 h-10 rounded-xl bg-cyan-400/10 text-cyan-300 flex items-center justify-center flex-shrink-0">
              <Icon size={20} />
            </span>
            <span>
              <span className="block font-bold">{i + 1}. {title}</span>
              <span className="block text-sm text-white/60 mt-0.5">{text}</span>
            </span>
          </li>
        ))}
      </ol>

      <a
        href={TAPZO_URL}
        target="_blank"
        rel="sponsored nofollow noopener noreferrer"
        onClick={() => {
          track("tapzo_install_click", { category, item, value: 1 });
          adsConversion(ADS_CONVERSIONS.tapzoInstallClick);
        }}
        className="mt-5 flex items-center justify-center gap-2 w-full py-4 rounded-2xl bg-gradient-to-r from-sky-300 to-blue-600 text-slate-900 font-bold uppercase tracking-[0.12em] shadow-[0_0_30px_rgba(56,189,248,0.35)] hover:brightness-110 active:scale-[0.98] transition"
      >
        <Download size={18} /> Install Tapzo
      </a>
      <a href="#how-to-get" onClick={onClose} className="mt-3 block text-center text-sm text-white/60 underline">
        Or see the official in-game steps
      </a>
      <p className="mt-4 text-[11px] leading-snug text-white/40 text-center">
        Affiliate link: we may earn a commission if you install. Tapzo is a third-party app; rewards and availability are set by
        Tapzo. Not affiliated with Garena.
      </p>
    </div>
  </div>
);

/* ---------- /ff-guides/:category/:item ---------- */
export const GuideItemPage = () => {
  const { category, item: itemSlug } = useParams();
  const cat = findCategory(category);
  const item = findItem(category, itemSlug);
  const [params] = useSearchParams();
  const [claimOpen, setClaimOpen] = useState(false);
  const [adLoading, setAdLoading] = useState(false);

  // Rewarded ad first (when configured), then the claim popup either way.
  const openClaim = async () => {
    const ctx = { category: category ?? "", item: itemSlug ?? "" };
    track("ffg_claim_open", ctx);
    adsConversion(ADS_CONVERSIONS.claimPopupOpen);
    setAdLoading(true);
    await showRewardedAd(ctx);
    setAdLoading(false);
    setClaimOpen(true);
  };

  useSEO({
    title: item ? `${item.name}: How To Get It | FF Guides` : "FF Guides",
    description: item?.description.slice(0, 155) ?? "",
    path: `/ff-guides/${category}/${itemSlug}`,
  });

  if (!cat || !item) return <Navigate to={cat ? `/ff-guides/${cat.slug}` : "/ff-guides/categories"} replace />;

  const others = cat.items.filter((i) => i.slug !== item.slug);
  const server = SERVERS.find((x) => x.id === params.get("server"));
  const rank = RANKS.find((r) => r.id === params.get("rank"));
  const level = Number(params.get("level")) || 0;
  const myTips = personalTips(server?.id ?? null, level, rank?.id ?? null);

  return (
    <GuideShell title={item.name} backTo={`/ff-guides/${cat.slug}`} dark>
      <div className={`${card} p-5 bg-gradient-to-br from-success/10 to-transparent`}>
        <div className="flex items-center gap-2 flex-wrap">
          <GradeBadge grade={item.grade} />
          <span className="text-xs text-t-muted uppercase tracking-wider">{cat.name}</span>
        </div>
        <h2 className="font-display text-2xl uppercase italic mt-2 leading-tight">{item.name}</h2>
        <dl className="grid grid-cols-2 gap-3 mt-4 text-sm">
          <div className="bg-background/60 rounded-xl p-3 border border-border">
            <dt className="text-t-muted text-xs uppercase tracking-wider">Grade</dt>
            <dd className="font-bold text-base flex items-center gap-1"><Star size={14} className="text-success" />{item.grade}</dd>
          </div>
          <div className="bg-background/60 rounded-xl p-3 border border-border">
            <dt className="text-t-muted text-xs uppercase tracking-wider">Type</dt>
            <dd className="font-bold text-base">{item.type}</dd>
          </div>
        </dl>
        <p className="mt-4 leading-relaxed">{item.description}</p>
        <div className="flex gap-2 mt-5">
          {cat.slug === "account-safety" ? (
            <a href="#how-to-get" className="flex-1 text-center py-3 rounded-xl bg-success text-black font-display uppercase italic hover:opacity-90 active:scale-[0.98] transition">
              How to Stay Safe
            </a>
          ) : (
            <button onClick={openClaim} disabled={adLoading} className="flex-1 disabled:opacity-60 text-center py-3 rounded-xl bg-success text-black font-display uppercase italic hover:opacity-90 active:scale-[0.98] transition">
              How to Claim This {CLAIM_NOUN[cat.slug] ?? "Skin"}
            </button>
          )}
          <button onClick={share} aria-label="Share" className="w-12 rounded-xl border border-border flex items-center justify-center hover:bg-surface-hover transition">
            <Share2 size={20} />
          </button>
        </div>
      </div>

      <AdSlot slot={AD_SLOTS.item} />

      <div id="how-to-get" className="scroll-mt-20">
        <SectionTitle>How To Get It</SectionTitle>
        <ol className={`${card} p-4 space-y-3`}>
          {item.howToGet.map((step, i) => (
            <li key={i} className="flex gap-3 items-start">
              <span className="w-7 h-7 rounded-full bg-success text-black font-bold flex items-center justify-center flex-shrink-0">{i + 1}</span>
              <span className="pt-0.5">{step}</span>
            </li>
          ))}
        </ol>
      </div>

      {myTips.length > 0 && (
        <>
          <SectionTitle>Tips For You</SectionTitle>
          <div className={`${card} p-4`}>
            <div className="flex flex-wrap gap-2 mb-3 text-xs font-bold uppercase tracking-wider">
              {server && <span className="px-2.5 py-1 rounded-full border border-white/15 bg-white/[0.04]">{server.flag} {server.name}</span>}
              {level > 0 && <span className="px-2.5 py-1 rounded-full border border-white/15 bg-white/[0.04]">Level {level === 100 ? "100" : `${level}+`}</span>}
              {rank && <span className="px-2.5 py-1 rounded-full border" style={{ color: rank.color, borderColor: `${rank.color}66` }}>{rank.name}</span>}
              <Link to={`/ff-guides/${cat.slug}/${item.slug}/server`} className="px-2.5 py-1 rounded-full text-cyan-300 hover:underline">Change</Link>
            </div>
            <ul className="space-y-2">
              {myTips.map((tip) => (
                <li key={tip} className="flex gap-2 items-start"><Lightbulb size={16} className="text-cyan-300 mt-1 flex-shrink-0" />{tip}</li>
              ))}
            </ul>
          </div>
        </>
      )}

      <SectionTitle>Pro Tips</SectionTitle>
      <ul className={`${card} p-4 space-y-2`}>
        {item.tips.map((tip) => (
          <li key={tip} className="flex gap-2 items-start"><Lightbulb size={16} className="text-success mt-1 flex-shrink-0" />{tip}</li>
        ))}
      </ul>

      <div className={`${card} p-4 mt-4 text-sm text-t-muted flex gap-3 border-amber-500/30`}>
        <AlertTriangle size={18} className="text-amber-500 flex-shrink-0 mt-0.5" />
        <p>Items are only delivered by Garena through the game. Any site asking for your UID or login to "add" this item is a scam.</p>
      </div>

      <Link to="/" className={`${card} p-4 mt-4 flex items-center gap-3 hover:border-success/50 transition`}>
        <Gift className="text-success" size={22} />
        <div className="flex-1"><div className="font-bold">Today's Redeem Codes</div><div className="text-sm text-t-muted">Free rewards, verified hourly</div></div>
        <ChevronRight size={18} />
      </Link>

      {others.length > 0 && (
        <>
          <SectionTitle>More in {cat.name}</SectionTitle>
          <div className="space-y-3">
            {others.map((o) => <ItemRow key={o.slug} categorySlug={cat.slug} item={o} />)}
          </div>
        </>
      )}
      <AdSlot slot={AD_SLOTS.item} />
      {claimOpen && <ClaimModal itemName={item.name} category={cat.slug} item={item.slug} onClose={() => setClaimOpen(false)} />}
    </GuideShell>
  );
};

/* ---------- /ff-guides/privacy-policy & /ff-guides/disclaimer ---------- */
const LegalPage: React.FC<{ title: string; path: string; description: string; updated: string; sections: { h: string; p: string[] }[] }> = ({
  title, path, description, updated, sections,
}) => {
  useSEO({ title: `${title} | FF Guides`, description, path });
  return (
    <GuideShell title={title} backTo="/ff-guides" dark>
      <p className="text-sm text-t-muted mb-4">Last updated: {updated}</p>
      <div className="space-y-4">
        {sections.map(({ h, p }) => (
          <section key={h} className={`${card} p-5`}>
            <h2 className="font-bold text-lg">{h}</h2>
            {p.map((para) => <p key={para} className="text-t-muted mt-2 leading-relaxed">{para}</p>)}
          </section>
        ))}
      </div>
      <AdSlot slot={AD_SLOTS.page} />
    </GuideShell>
  );
};

const LEGAL_UPDATED = "October 11, 2026";

export const GuideDisclaimer = () => (
  <LegalPage
    title="Disclaimer"
    path="/ff-guides/disclaimer"
    updated={LEGAL_UPDATED}
    description="FF Guides is an independent fan guide, not affiliated with Garena, and does not give out any rewards or in-game items."
    sections={[
      { h: "Not affiliated with Garena", p: [
        "FF Guides is an independent, fan-made informational guide. It is not affiliated with, associated with, endorsed by, sponsored by, or approved by Garena, Garena Free Fire, or any of their partners.",
        "Free Fire, Garena, and all related names, logos, characters, and item names are trademarks or registered trademarks of their respective owners. They are used here only to identify the game being discussed.",
      ]},
      { h: "No rewards are given here", p: [
        "This website does not give, sell, generate, or deliver any rewards, diamonds, skins, bundles, emotes, pets, characters, or any other in-game items.",
        "We cannot access, modify, or add anything to any Free Fire account. Nothing you do on this site will change your game account in any way.",
        "In-game items can only be obtained from Garena through the game itself, official events, the official store, and the official rewards website.",
      ]},
      { h: "Information only", p: [
        "All content is for general information and educational purposes. Free Fire changes often: items, prices, events, skills, and availability vary by region and update. We do our best to keep guides accurate but cannot guarantee that every detail is current.",
        "Always check the in-game Store, Events tab, and official Garena announcements before spending diamonds or money.",
      ]},
      { h: "Beware of scams", p: [
        "Any website, app, or person that promises free diamonds or skins, asks for your UID, login, or password, or claims to \"inject\" items into your account is a scam. Using such tools can also get your account permanently banned.",
      ]},
      { h: "External links", p: [
        "Some pages link to other websites, including official Garena pages. We are not responsible for the content or practices of external sites.",
      ]},
      { h: "Contact", p: ["If you are a rights holder and have a concern about any content, please reach us through our Contact page and we will review it promptly."] },
    ]}
  />
);

export const GuidePrivacy = () => (
  <LegalPage
    title="Privacy Policy"
    path="/ff-guides/privacy-policy"
    updated={LEGAL_UPDATED}
    description="How FF Guides handles your data: no logins, no game IDs, no personal details collected."
    sections={[
      { h: "Overview", p: [
        "FF Guides is a free, read-only guide. You do not need an account to use it, and we never ask for your Free Fire UID, login details, password, phone number, or payment information.",
      ]},
      { h: "Information we do not collect", p: [
        "We do not collect game IDs, account credentials, or any information that could be used to access your Free Fire or social media accounts.",
        "We do not give out rewards, so we never need any of your details to \"deliver\" anything.",
      ]},
      { h: "Information stored on your device", p: [
        "Some preferences, such as light/dark theme and the star rating you choose, are saved only in your own browser's local storage. They are not sent to us, and you can clear them anytime from your browser settings.",
      ]},
      { h: "Analytics and cookies", p: [
        "Like most websites, we use third-party analytics tools to understand overall traffic, such as which pages are visited and from which kind of device. These tools may use cookies and collect anonymous technical data like browser type, approximate location, and pages viewed.",
        "You can block or delete cookies in your browser settings. The site will still work.",
      ]},
      { h: "Third-party links", p: [
        "Links to other websites, including official Garena pages, are governed by those sites' own privacy policies.",
      ]},
      { h: "Children's privacy", p: [
        "This site is not directed at children under 13, and we do not knowingly collect personal information from them.",
      ]},
      { h: "Changes", p: ["We may update this policy from time to time. The date at the top shows the latest version."] },
      { h: "Contact", p: ["Questions about this policy can be sent through our Contact page."] },
    ]}
  />
);
