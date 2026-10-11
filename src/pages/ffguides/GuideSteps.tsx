import React from "react";
import { Link, Navigate, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ChevronRight, Info } from "lucide-react";
import { useSEO } from "@/hooks/useSEO";
import { findCategory, findItem } from "@/data/ffGuides";
import { GuideShell } from "./GuideShell";
import { AdSlot } from "@/components/ff/AdSlot";
import { AD_SLOTS, track, TrackEvent } from "@/lib/ads";

export const SERVERS = [
  { id: "in", name: "India", flag: "🇮🇳" },
  { id: "bd", name: "Bangladesh", flag: "🇧🇩" },
  { id: "pk", name: "Pakistan", flag: "🇵🇰" },
  { id: "id", name: "Indonesia", flag: "🇮🇩" },
  { id: "th", name: "Thailand", flag: "🇹🇭" },
  { id: "vn", name: "Vietnam", flag: "🇻🇳" },
  { id: "sg", name: "Singapore", flag: "🇸🇬" },
  { id: "tw", name: "Taiwan", flag: "🇹🇼" },
  { id: "me", name: "Middle East", flag: "🇦🇪" },
  { id: "br", name: "Brazil", flag: "🇧🇷" },
  { id: "latam", name: "Latin America", flag: "🇲🇽" },
  { id: "na", name: "North America", flag: "🇺🇸" },
  { id: "eu", name: "Europe", flag: "🇪🇺" },
  { id: "cis", name: "CIS / Russia", flag: "🇷🇺" },
];

// 20 level brackets: 5+, 10+ … 100.
export const LEVELS = Array.from({ length: 20 }, (_, i) => (i + 1) * 5);

export const RANKS = [
  { id: "bronze", name: "Bronze", color: "#cd7f32" },
  { id: "silver", name: "Silver", color: "#c0c7d2" },
  { id: "gold", name: "Gold", color: "#f5b942" },
  { id: "platinum", name: "Platinum", color: "#5eead4" },
  { id: "diamond", name: "Diamond", color: "#60a5fa" },
  { id: "heroic", name: "Heroic", color: "#f43f5e" },
  { id: "grandmaster", name: "Grandmaster", color: "#a855f7" },
];

const levelLabel = (lv: number) => (lv === 100 ? "100" : `${lv}+`);
const levelColor = (lv: number) => (lv >= 70 ? "#ef4444" : lv >= 40 ? "#f5b942" : lv >= 20 ? "#8b5cf6" : "#38bdf8");

/** Tips tailored to the player's chosen server, level and rank. */
export function personalTips(serverId: string | null, level: number, rankId: string | null): string[] {
  const tips: string[] = [];
  const server = SERVERS.find((s) => s.id === serverId);
  if (server) {
    tips.push(
      `Events and Luck Royale rotations on the ${server.name} server can differ from other regions. Check your own Events tab for current availability.`,
    );
  }
  if (level) {
    if (level < 20) tips.push("New account: finish daily missions and the free Booyah Pass track first, and save diamonds instead of spinning royales early.");
    else if (level < 50) tips.push("Mid-level account: focus diamonds on one item you really want instead of spreading them across many events.");
    else tips.push("High-level account: watch for anniversary and rerun events. They're the best chance at older rare items.");
  }
  const rank = RANKS.findIndex((r) => r.id === rankId);
  if (rank >= 0) {
    if (rank <= 2) tips.push(`At ${RANKS[rank].name}, master gloo walls and safe rotations before chasing cosmetics. Skins never change skill.`);
    else if (rank <= 4) tips.push(`At ${RANKS[rank].name}, pick skins whose stat bonuses match your role (rusher vs. sniper).`);
    else tips.push(`At ${RANKS[rank].name}, small attribute bonuses like reload speed matter; compare stats in Vault before equipping.`);
  }
  return tips;
}

const StepFrame: React.FC<{
  title: string;
  subtitle: string;
  count: number;
  accent: string;
  backTo: string;
  children: React.ReactNode;
}> = ({ title, subtitle, count, accent, backTo, children }) => (
  <GuideShell title={title} backTo={backTo} dark>
    <div className="flex items-center gap-3 mb-1">
      <span className="w-1.5 h-7 rounded-full flex-shrink-0" style={{ background: accent }} />
      <h2 className="flex-1 min-w-0 font-bold text-lg md:text-xl uppercase tracking-[0.12em] text-white truncate">{title}</h2>
      <span className="flex-shrink-0 px-3 md:px-4 py-1.5 rounded-full border border-white/15 bg-white/[0.04] font-mono text-xs md:text-sm text-white/70">
        {count} options
      </span>
    </div>
    <p className="text-white/55 mb-5">{subtitle}</p>
    <div className="space-y-3">{children}</div>
    <AdSlot slot={AD_SLOTS.step} />
    <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-white/55 flex gap-3">
      <Info size={18} className="flex-shrink-0 mt-0.5" />
      <p>
        We use this only to tailor the tips in your guide. FF Guides is not affiliated with Garena and cannot add items to any
        account. We never ask for your UID or login.{" "}
        <Link to="/ff-guides/disclaimer" className="underline text-white/80">Disclaimer</Link>
      </p>
    </div>
  </GuideShell>
);

/** One full-width option row, styled like the item list. */
const OptionRow: React.FC<{
  to: string;
  color: string;
  badge: React.ReactNode;
  hint: string;
  label: string;
  event: TrackEvent;
  value: string;
}> = ({ to, color, badge, hint, label, event, value }) => {
  const navigate = useNavigate();
  const { category, item } = useParams();
  return (
    <button
      onClick={() => {
        track(event, { category, item, value });
        navigate(to);
      }}
      className="relative w-full overflow-hidden rounded-3xl border border-white/10 bg-[#111827]/80 p-3 md:p-4 flex items-center gap-3 md:gap-4 text-left hover:border-white/25 active:scale-[0.99] transition"
    >
      <span className="absolute left-0 top-4 bottom-4 w-1 rounded-r-full" style={{ background: color }} />
      <span
        className="ml-2 w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center flex-shrink-0 font-bold text-xl md:text-2xl"
        style={{ background: `radial-gradient(circle at 50% 35%, ${color}40, #0b0f1a 75%)`, color }}
      >
        {badge}
      </span>
      <span className="flex-1 min-w-0">
        <span className="block text-[11px] md:text-xs uppercase tracking-[0.15em] text-white/50 font-bold truncate">{hint}</span>
        <span className="block font-bold text-base md:text-xl text-white leading-tight mt-0.5 truncate">{label}</span>
      </span>
      <span className="flex-shrink-0 inline-flex items-center gap-1 px-3 py-2 md:px-5 md:py-2.5 rounded-full border border-cyan-400/40 bg-cyan-400/5 text-cyan-300 text-[11px] md:text-sm font-bold uppercase tracking-[0.12em]">
        Select <ChevronRight size={14} />
      </span>
    </button>
  );
};

const useStepGuard = () => {
  const { category, item } = useParams();
  const it = findItem(category, item);
  const base = `/ff-guides/${category}/${item}`;
  return { it, base, cat: findCategory(category) };
};

/* ---------- step 1: server ---------- */
export const StepServer = () => {
  const { it, base, cat } = useStepGuard();
  useSEO({ title: `${it?.name ?? "Guide"}: Select Server | FF Guides`, description: "Choose your Free Fire server.", path: `${base}/server` });
  if (!it || !cat) return <Navigate to="/ff-guides/categories" replace />;

  return (
    <StepFrame title="Select Server" subtitle={`Which Free Fire server do you play on? (${it.name})`} count={SERVERS.length} accent="#38bdf8" backTo={`/ff-guides/${cat.slug}`}>
      {SERVERS.map((s) => (
        <OptionRow
          key={s.id}
          to={`${base}/level?server=${s.id}`}
          color="#38bdf8"
          badge={<span className="text-3xl leading-none">{s.flag}</span>}
          hint="Server"
          event="ffg_server_selected"
          value={s.id}
          label={s.name}
        />
      ))}
    </StepFrame>
  );
};

/* ---------- step 2: level ---------- */
export const StepLevel = () => {
  const { it, base } = useStepGuard();
  const [params] = useSearchParams();
  const server = params.get("server");
  useSEO({ title: `${it?.name ?? "Guide"}: Select Level | FF Guides`, description: "Choose your account level.", path: `${base}/level` });
  if (!it) return <Navigate to="/ff-guides/categories" replace />;
  if (!server) return <Navigate to={`${base}/server`} replace />;

  return (
    <StepFrame title="Select Level" subtitle="Pick the level bracket your ID is in." count={LEVELS.length} accent="#f5b942" backTo={`${base}/server`}>
      {LEVELS.map((lv) => (
        <OptionRow
          key={lv}
          to={`${base}/rank?server=${server}&level=${lv}`}
          color={levelColor(lv)}
          badge={<span className="font-mono text-lg md:text-xl">{lv}</span>}
          hint="Account Level"
          event="ffg_level_selected"
          value={String(lv)}
          label={`Level ${levelLabel(lv)}`}
        />
      ))}
    </StepFrame>
  );
};

/* ---------- step 3: rank ---------- */
export const StepRank = () => {
  const { it, base } = useStepGuard();
  const [params] = useSearchParams();
  const server = params.get("server");
  const level = params.get("level");
  useSEO({ title: `${it?.name ?? "Guide"}: Select Rank | FF Guides`, description: "Choose your current rank.", path: `${base}/rank` });
  if (!it) return <Navigate to="/ff-guides/categories" replace />;
  if (!server || !level) return <Navigate to={`${base}/server`} replace />;

  return (
    <StepFrame title="Select Rank" subtitle="Which rank are you in right now?" count={RANKS.length} accent="#a855f7" backTo={`${base}/level?server=${server}`}>
      {RANKS.map((r) => (
        <OptionRow
          key={r.id}
          to={`${base}?server=${server}&level=${level}&rank=${r.id}`}
          color={r.color}
          badge={<span className="font-display">{r.name[0]}</span>}
          hint="Current Rank"
          event="ffg_rank_selected"
          value={r.id}
          label={r.name}
        />
      ))}
    </StepFrame>
  );
};
