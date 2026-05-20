import { useEffect, useState, useCallback, Suspense, lazy, useRef } from "react";
import React from "react";
import { AppView, RedeemCode } from "@/types";
import { useTheme } from "@/hooks/useTheme";
import { Header } from "@/components/ff/Header";

const CodeCard = lazy(() => import("@/components/ff/CodeCard").then((m) => ({ default: m.CodeCard })));

const Schema = lazy(() => import("@/components/ff/Schema").then((m) => ({ default: m.Schema })));
const Footer = lazy(() => import("@/components/ff/Footer").then((m) => ({ default: m.Footer })));
const AuthorityHub = lazy(() => import("@/components/ff/AuthorityHub").then((m) => ({ default: m.AuthorityHub })));
const OnPageContent = lazy(() => import("@/components/ff/OnPageContent"));
const ContentView = lazy(() => import("@/components/ff/ContentView").then((m) => ({ default: m.ContentView })));
const CodeDetailView = lazy(() =>
  import("@/components/ff/CodeDetailView").then((m) => ({ default: m.CodeDetailView })),
);

const REGIONS = ["GLOBAL", "INDIA", "BRAZIL", "INDONESIA", "EUROPE"];
const REGION_OFFSETS: Record<string, number> = {
  GLOBAL: 3,
  INDIA: 8,
  BRAZIL: 13,
  INDONESIA: 18,
  EUROPE: 23,
};

const CACHE_TTL_MS = 75 * 60 * 1000;

const detectRegionFromTimezone = (): string => {
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  if (tz.includes("Calcutta") || tz.includes("Asia/Kolkata")) return "INDIA";
  if (tz.includes("Sao_Paulo") || tz.includes("Brazil")) return "BRAZIL";
  if (tz.includes("Jakarta")) return "INDONESIA";
  if (tz.includes("Europe")) return "EUROPE";
  return "GLOBAL";
};

const getRegionCacheKey = (region: string) => `region-codes-cache:${region}`;

const readCachedRegion = (region: string): { codes: RedeemCode[]; lastSyncTime: string; cachedAt: number } | null => {
  try {
    const raw = localStorage.getItem(getRegionCacheKey(region));
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed?.codes?.length || !parsed?.cachedAt) return null;
    if (Date.now() - parsed.cachedAt > CACHE_TTL_MS) return null;
    return parsed;
  } catch {
    return null;
  }
};

const writeCachedRegion = (region: string, codes: RedeemCode[], lastSyncTime: string) => {
  try {
    localStorage.setItem(
      getRegionCacheKey(region),
      JSON.stringify({
        codes,
        lastSyncTime,
        cachedAt: Date.now(),
      }),
    );
  } catch {
    // ignore cache errors
  }
};

const formatDateLabel = () =>
  new Date().toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" }).toUpperCase();

const formatSyncLabel = (syncedAt: string | null): string => {
  if (!syncedAt) return "WAITING";
  try {
    return new Date(syncedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch {
    return "WAITING";
  }
};

const PLACEHOLDER_REWARDS = [
  "Diamond Royale Voucher",
  "Exclusive Bundle",
  "Weapon Royale Voucher",
  "Legendary Skin",
  "Pet Skin",
  "Custom Room Card",
  "Gold Royale Voucher",
  "Backpack Skin",
  "Emote Pack",
  "Surfboard Skin",
  "Gloo Wall Skin",
  "Loot Crate",
];
const PLACEHOLDER_CATEGORIES: Array<"Voucher" | "Bundle" | "Skin" | "Pet"> = [
  "Voucher",
  "Bundle",
  "Skin",
  "Pet",
  "Voucher",
  "Voucher",
  "Voucher",
  "Bundle",
  "Skin",
  "Voucher",
  "Bundle",
  "Voucher",
];

const generatePlaceholderCodes = (region: string): RedeemCode[] => {
  return PLACEHOLDER_REWARDS.map((reward, i) => ({
    code: "????????????",
    reward,
    category: PLACEHOLDER_CATEGORIES[i] || "Bundle",
    slug: `placeholder-${region}-${i}`,
    server: region,
    status: "Working" as const,
    probability: 85,
    lastTested: "Loading...",
    likes: 0,
    recentClaims: 0,
    releaseDate: new Date().toLocaleDateString("en-US", { day: "2-digit", month: "long", year: "numeric" }),
    citations: [],
  }));
};

// Lazy-load the sync service to reduce initial JS parse on mobile
const getSyncService = (() => {
  let cached: typeof import("@/services/codesSyncService")["codesSyncService"] | null = null;
  return async () => {
    if (cached) return cached;
    const mod = await import("@/services/codesSyncService");
    cached = mod.codesSyncService;
    return cached;
  };
})();

const Index = () => {
  const { theme, toggleTheme } = useTheme();
  const initialRegion = detectRegionFromTimezone();
  const initialCache = readCachedRegion(initialRegion);

  const [currentView, setCurrentView] = useState<AppView>("home");
  const [selectedCode, setSelectedCode] = useState<RedeemCode | null>(null);
  const [activeRegion, setActiveRegion] = useState(initialRegion);
  const [displayCodes, setDisplayCodes] = useState<RedeemCode[]>(
    initialCache?.codes ?? generatePlaceholderCodes(initialRegion),
  );
  const [isPlaceholder, setIsPlaceholder] = useState(!initialCache?.codes?.length);
  const [lastSyncTime, setLastSyncTime] = useState<string>(initialCache?.lastSyncTime || "WAITING");
  const [lastSyncIso, setLastSyncIso] = useState<string | null>(null);
  const [nextUpdateText, setNextUpdateText] = useState("--:--");
  const [isOverdue, setIsOverdue] = useState(false);
  const [dateStr] = useState(formatDateLabel);

  useEffect(() => {
    const now = new Date();
    const dayMonth = now.toLocaleDateString("en-US", { day: "numeric", month: "short" });
    document.title = `Free Fire Redeem Codes Today (${dayMonth}) - Working`;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc)
      metaDesc.setAttribute(
        "content",
        `Today's working Free Fire redeem codes (${dayMonth}). Verified hourly from official Garena servers. Free diamonds, skins, and bundles across all regions.`,
      );
  }, []);

  const loadRegionData = useCallback(async (region: string, updateUi = true) => {
    const svc = await getSyncService();
    const tryLoadCodes = async (attempt = 1): Promise<{ codes: RedeemCode[]; syncedAt: string | null } | null> => {
      try {
        const { codes, syncedAt } = await svc.getCodesByRegion(region);
        if (codes.length > 0) return { codes, syncedAt };
        return null;
      } catch {
        if (attempt < 3) return tryLoadCodes(attempt + 1);
        return null;
      }
    };

    const loaded = await tryLoadCodes();
    if (!loaded) return;

    let timeLabel = formatSyncLabel(loaded.syncedAt);
    try {
      timeLabel = await svc.getLastSyncTime(region);
    } catch {
      // Keep derived label
    }
    writeCachedRegion(region, loaded.codes, timeLabel);
    if (updateUi) {
      setDisplayCodes(loaded.codes);
      setIsPlaceholder(false);
      setLastSyncTime(timeLabel);
      if (loaded.syncedAt) setLastSyncIso(loaded.syncedAt);
    }
  }, []);

  useEffect(() => {
    const cached = readCachedRegion(activeRegion);
    if (cached?.codes?.length) {
      setDisplayCodes(cached.codes);
      setIsPlaceholder(false);
      setLastSyncTime(cached.lastSyncTime || "WAITING");
    } else {
      setDisplayCodes(generatePlaceholderCodes(activeRegion));
      setIsPlaceholder(true);
      setLastSyncTime("WAITING");
    }
    loadRegionData(activeRegion, true);
  }, [activeRegion, loadRegionData]);

  useEffect(() => {
    if (!isPlaceholder) return;
    const retry = setInterval(() => {
      loadRegionData(activeRegion, true);
    }, 15000);
    return () => clearInterval(retry);
  }, [activeRegion, isPlaceholder, loadRegionData]);

  // Defer realtime subscription to reduce main-thread work at load
  const realtimeSetup = useRef(false);
  useEffect(() => {
    if (realtimeSetup.current) return;
    const timer = setTimeout(async () => {
      realtimeSetup.current = true;
      const { supabase } = await import("@/integrations/supabase/client");
      const channel = supabase
        .channel("synced-codes-realtime")
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "synced_codes", filter: `region=eq.${activeRegion}` },
          () => {
            loadRegionData(activeRegion, true);
          },
        )
        .subscribe();
      return () => {
        supabase.removeChannel(channel);
      };
    }, 3000); // delay 3s after mount
    return () => clearTimeout(timer);
  }, [activeRegion, loadRegionData]);

  // Start ticker after 2s delay to keep first paint light.
  useEffect(() => {
    const startTimer = setTimeout(() => {
      const ticker = setInterval(() => {
        const now = new Date();
        const offset = REGION_OFFSETS[activeRegion] || 3;
        let next = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), offset, 0);
        const isPast = now.getTime() >= next.getTime();
        setIsOverdue(isPast && (lastSyncTime === "--:--" || lastSyncTime === "WAITING"));
        if (isPast) next.setHours(next.getHours() + 1);
        const diffMs = next.getTime() - now.getTime();
        const totalSecs = Math.max(0, Math.floor(diffMs / 1000));
        setNextUpdateText(
          `${Math.floor(totalSecs / 60)
            .toString()
            .padStart(2, "0")}M ${(totalSecs % 60).toString().padStart(2, "0")}S`,
        );
      }, 1000);
      return () => clearInterval(ticker);
    }, 2000);
    return () => clearTimeout(startTimer);
  }, [activeRegion, lastSyncTime]);

  const handleSetView = (view: AppView) => {
    setCurrentView(view);
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-success selection:text-primary-foreground">
      <Suspense fallback={null}>
        <Schema currentView={currentView} selectedCode={selectedCode} codes={displayCodes} lastSyncIso={lastSyncIso} />
      </Suspense>
      <Header
        currentView={currentView}
        setView={handleSetView}
        isSyncing={false}
        syncingRegion={null}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      <main className="w-full">
        {currentView === "home" ? (
          <>
            <section className="relative w-full pt-8 pb-2 px-4 flex flex-col items-center">
              <div className="max-w-7xl mx-auto text-center">
                <h1 className="font-display text-[clamp(2.5rem,10vw,6rem)] text-foreground uppercase tracking-tighter leading-[0.85] text-glow mb-6">
                  FREE FIRE REDEEM <br /> <span className="text-success italic">CODE TODAY</span>
                </h1>
                <div className="flex flex-col items-center gap-2">
                  <span className="text-2xl font-display text-secondary date-glow">{dateStr}</span>
                  <div className="flex items-center gap-2 text-[10px] text-t-muted font-tech uppercase tracking-widest mt-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-success inline-block" aria-hidden="true" />
                    Active Node: <span className="text-foreground font-bold">{activeRegion}</span>
                  </div>
                </div>
              </div>
              <div className="w-full max-w-7xl mx-auto mt-12 px-4 md:px-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="flex w-full md:w-auto bg-surface p-1 rounded-2xl border border-border overflow-x-auto no-scrollbar">
                    {REGIONS.map((region) => (
                      <button
                        key={region}
                        onClick={() => setActiveRegion(region)}
                        className={`px-5 py-2.5 rounded-xl text-[11px] font-tech font-bold uppercase tracking-[0.15em] transition-all whitespace-nowrap ${activeRegion === region ? "bg-primary text-primary-foreground" : "text-t-muted hover:text-foreground"}`}
                      >
                        {region}
                      </button>
                    ))}
                  </div>
                  <div className="flex flex-row items-center gap-3 w-full md:w-auto">
                    <div className="flex-1 md:flex-initial bg-surface px-5 py-3 rounded-2xl border border-border flex items-center justify-center gap-4">
                      <span className="w-4 h-4 rounded bg-muted inline-block" aria-hidden="true" />
                      <div className="flex flex-col justify-center">
                        <span className="text-[10px] text-t-muted font-tech uppercase tracking-widest flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-success inline-block" aria-hidden="true" />
                          LAST UPDATE: <span className="text-foreground font-mono font-bold">{lastSyncTime}</span>
                        </span>
                      </div>
                    </div>
                    <div
                      className={`flex-1 md:flex-initial px-6 py-3 rounded-2xl border transition-all flex items-center justify-center gap-5 ${isOverdue ? "bg-destructive/10 border-destructive/20" : "bg-success-bg border-success-border"}`}
                    >
                      {isOverdue ? (
                        <span className="w-4.5 h-4.5 rounded-full bg-destructive inline-block animate-pulse" aria-hidden="true" />
                      ) : (
                        <span className="w-4.5 h-4.5 rounded-full bg-success inline-block" aria-hidden="true" />
                      )}
                      <div className="flex flex-col">
                        <span className="text-[8px] text-t-muted font-tech uppercase tracking-widest">
                          {isOverdue ? "Update Pending" : "Next Update"}
                        </span>
                        <span
                          className={`font-mono text-sm font-black ${isOverdue ? "text-destructive" : "text-success"}`}
                        >
                          {nextUpdateText}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            <section id="codes" className="max-w-7xl mx-auto px-4 md:px-8 py-12 min-h-[1200px] lg:min-h-[1600px]">
              <Suspense fallback={<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 animate-pulse opacity-60">{Array.from({length:12}).map((_,i)=><div key={i} className="bg-card border border-border rounded-2xl h-64" />)}</div>}>
                <div
                  className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 ${isPlaceholder ? "animate-pulse opacity-60" : ""}`}
                >
                  {displayCodes.map((code, idx) => (
                    <CodeCard
                      key={`${activeRegion}-${idx}`}
                      data={code}
                      onSelect={() => {
                        if (!isPlaceholder) {
                          setSelectedCode(code);
                          handleSetView("code-detail");
                        }
                      }}
                    />
                  ))}
                </div>
              </Suspense>
            </section>
            <section className="max-w-7xl mx-auto px-4 md:px-8 pb-8" aria-label="Freshness and sourcing">
              <p className="text-center text-xs md:text-sm text-t-muted font-tech uppercase tracking-widest">
                Codes last verified:{" "}
                <time
                  dateTime={lastSyncIso ?? new Date().toISOString()}
                  className="text-foreground font-bold"
                >
                  {lastSyncIso
                    ? new Date(lastSyncIso).toLocaleString("en-US", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        timeZoneName: "short",
                      })
                    : `${dateStr} - ${lastSyncTime}`}
                </time>
              </p>
              <div className="mt-6 grid md:grid-cols-2 gap-4">
                <div className="bg-card border border-border rounded-2xl p-5">
                  <h2 className="font-display uppercase tracking-tight text-foreground text-base mb-2">
                    About this site
                  </h2>
                  <p className="text-sm text-t-body leading-relaxed">
                    FF Redeem Codes Today has monitored Garena's official Free Fire code releases since 2023.
                    Our team tracks official social channels, in-game event banners, and partner streams across
                    the India, Brazil, Indonesia, Europe, and Global server regions. Every code is verified
                    before listing and removed within 60 minutes of expiration.
                  </p>
                </div>
                <div className="bg-card border border-border rounded-2xl p-5">
                  <h2 className="font-display uppercase tracking-tight text-foreground text-base mb-2">
                    How we source codes
                  </h2>
                  <ul className="text-sm text-t-body leading-relaxed list-disc list-inside space-y-1">
                    <li>Official Garena handles on X (Twitter), Instagram, Facebook, and YouTube.</li>
                    <li>In-game event banners and partner livestream drops on Booyah and YouTube.</li>
                    <li>Hourly automated checks against{" "}
                      <a
                        href="https://reward.ff.garena.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-success font-bold underline hover:no-underline"
                      >
                        reward.ff.garena.com
                      </a>{" "}
                      from each region.
                    </li>
                    <li>Expired or capped codes are pulled from the list automatically.</li>
                  </ul>
                </div>
              </div>
            </section>
            <Suspense fallback={<div className="min-h-[200px]" />}>
              <OnPageContent />
            </Suspense>
            <Suspense fallback={<div className="min-h-[400px]" />}>
              <AuthorityHub />
            </Suspense>
          </>
        ) : (
          <Suspense
            fallback={
              <div className="flex items-center justify-center min-h-[50vh]">
                <div className="w-6 h-6 border-2 border-foreground border-t-transparent rounded-full animate-spin" />
              </div>
            }
          >
            {currentView === "code-detail" && selectedCode ? (
              <CodeDetailView code={selectedCode} setView={handleSetView} lastSyncTime={Date.now()} />
            ) : (
              <ContentView
                currentView={currentView}
                setView={handleSetView}
                selectedArticleId={null}
                setSelectedArticleId={() => {}}
              />
            )}
          </Suspense>
        )}
      </main>
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </div>
  );
};

export default Index;
