import { useEffect, useState, useCallback, Suspense, useRef } from "react";
import React from "react";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { CodeCard } from "./components/CodeCard";
import { Schema } from "./components/Schema";
import { AuthorityHub } from "./components/AuthorityHub";
import { AppView, RedeemCode } from "./types";
import { Clock, Loader2, Timer, Award, RefreshCcw, WifiOff, MapPin, Globe, AlertCircle, History } from "lucide-react";
import { syncRealLatestCodes } from "./services/geminiService";
import { storageService } from "./services/storageService";
import { LIVE_CODES } from "./constants";

const ContentView = React.lazy(() => import("./components/ContentView").then((m) => ({ default: m.ContentView })));
const CodeDetailView = React.lazy(() =>
  import("./components/CodeDetailView").then((m) => ({ default: m.CodeDetailView })),
);

const REGIONS = ["GLOBAL", "INDIA", "BRAZIL", "INDONESIA", "EUROPE"];
const REGION_OFFSETS: Record<string, number> = {
  GLOBAL: 0,
  INDIA: 3,
  BRAZIL: 6,
  INDONESIA: 9,
  EUROPE: 12,
};

function App() {
  const [currentView, setCurrentView] = useState<AppView>("home");
  const [selectedCode, setSelectedCode] = useState<RedeemCode | null>(null);
  const [activeRegion, setActiveRegion] = useState("GLOBAL");
  const [displayCodes, setDisplayCodes] = useState<RedeemCode[]>([]);
  const [lastSyncTime, setLastSyncTime] = useState<string>("--:--");
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncingRegion, setSyncingRegion] = useState<string | null>(null);
  const [nextUpdateText, setNextUpdateText] = useState("--:--");
  const [isOverdue, setIsOverdue] = useState(false);
  const [dateStr, setDateStr] = useState("");
  const [autoDetected, setAutoDetected] = useState(false);

  const syncLock = useRef(false);

  /**
   * Loads region-specific data. If empty, filters local hardcoded codes
   * BUT strictly only those matching the region or 'Global' if in Global mode.
   */
  const loadRegionData = useCallback(async (region: string) => {
    const data = await storageService.getCodesByRegion(region);
    const timeLabel = await storageService.getLastSyncTime(region);
    setLastSyncTime(timeLabel);

    if (data && data.length > 0) {
      setDisplayCodes(data);
    } else {
      // STRICT FALLBACK: Only show if region matches or we are in GLOBAL
      // This prevents Brazil from showing India codes
      const fallbacks = LIVE_CODES.filter((c) => {
        const s = c.server.toLowerCase();
        const r = region.toLowerCase();
        if (region === "GLOBAL") return true;
        return s.includes(r);
      }).slice(0, 12);
      setDisplayCodes(fallbacks);
    }
  }, []);

  const performAtomicSync = useCallback(
    async (region: string, force = false) => {
      if (syncLock.current) return;

      const now = new Date();
      const hourKey = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}-${now.getHours()}`;
      const needsSync = await storageService.shouldSyncRegion(region, hourKey, force);

      if (!needsSync) {
        await loadRegionData(region);
        return;
      }

      syncLock.current = true;
      setIsSyncing(true);
      setSyncingRegion(region);

      try {
        storageService.markAttempt(region);
        const discovered = await syncRealLatestCodes(region);

        if (discovered && discovered.length > 0) {
          await storageService.saveSyncedData(region, hourKey, discovered, true);
        }
        await loadRegionData(region);
      } catch (e) {
        await loadRegionData(region);
      } finally {
        setIsSyncing(false);
        setSyncingRegion(null);
        syncLock.current = false;
      }
    },
    [loadRegionData],
  );

  // Initial Detection
  useEffect(() => {
    if (!autoDetected) {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (tz.includes("Calcutta") || tz.includes("Asia/Kolkata")) setActiveRegion("INDIA");
      else if (tz.includes("Sao_Paulo") || tz.includes("Brazil")) setActiveRegion("BRAZIL");
      else if (tz.includes("Jakarta")) setActiveRegion("INDONESIA");
      else if (tz.includes("Europe")) setActiveRegion("EUROPE");
      setAutoDetected(true);
    }
  }, [autoDetected]);

  // Handle Region Switching
  useEffect(() => {
    loadRegionData(activeRegion);
    // If we have NO data for this region, force a sync immediately
    storageService.getCodesByRegion(activeRegion).then((data) => {
      if (!data || data.length === 0) {
        performAtomicSync(activeRegion, true);
      }
    });
  }, [activeRegion, loadRegionData, performAtomicSync]);

  // Global Ticker & Scheduled Sync
  useEffect(() => {
    const ticker = setInterval(() => {
      const now = new Date();
      setDateStr(now.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" }).toUpperCase());

      const offset = REGION_OFFSETS[activeRegion] || 0;
      let next = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), offset, 0);

      const isPast = now.getTime() >= next.getTime();
      setIsOverdue(isPast && (lastSyncTime === "--:--" || lastSyncTime === "NEVER"));

      if (isPast) next.setHours(next.getHours() + 1);

      const diffMs = next.getTime() - now.getTime();
      const totalSecs = Math.max(0, Math.floor(diffMs / 1000));
      setNextUpdateText(
        `${Math.floor(totalSecs / 60)
          .toString()
          .padStart(2, "0")}M ${(totalSecs % 60).toString().padStart(2, "0")}S`,
      );

      // Auto-sync if overdue or at scheduled time
      if (isPast && !isSyncing && !syncLock.current) {
        performAtomicSync(activeRegion, false);
      }
    }, 1000);
    return () => clearInterval(ticker);
  }, [activeRegion, lastSyncTime, isSyncing, performAtomicSync]);

  const handleSetView = (view: AppView) => {
    setCurrentView(view);
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-cyber-success selection:text-black">
      <Schema currentView={currentView} selectedCode={selectedCode} />
      <Header currentView={currentView} setView={handleSetView} isSyncing={isSyncing} syncingRegion={syncingRegion} />

      <main className="w-full">
        {currentView === "home" ? (
          <>
            <section className="relative w-full pt-8 pb-2 px-4 flex flex-col items-center">
              <div className="max-w-7xl mx-auto text-center">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/5 border border-white/10 rounded-full mb-8">
                  <Globe size={14} className="text-cyber-success" />
                  <span className="text-[10px] font-tech font-bold text-white/60 uppercase tracking-widest">
                    Global Cloud Consensus Engine Active
                  </span>
                </div>
                <h1 className="font-display text-[clamp(2.5rem,10vw,6rem)] text-white uppercase tracking-tighter leading-[0.85] text-glow mb-6">
                  FREE FIRE REDEEM <br /> <span className="text-cyber-success italic">CODE TODAY</span>
                </h1>
                <div className="flex flex-col items-center gap-2">
                  <span className="text-2xl font-display text-cyber-secondary date-glow">{dateStr}</span>
                  <div className="flex items-center gap-2 text-[10px] text-white/40 font-tech uppercase tracking-widest mt-2">
                    <MapPin size={10} className="text-cyber-success" />
                    Active Node: <span className="text-white font-bold">{activeRegion}</span>
                  </div>
                </div>
              </div>

              <div className="w-full max-w-7xl mx-auto mt-12 px-4 md:px-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="flex w-full md:w-auto bg-[#0a0a0a] p-1 rounded-2xl border border-white/5 overflow-x-auto no-scrollbar">
                    {REGIONS.map((region) => (
                      <button
                        key={region}
                        onClick={() => setActiveRegion(region)}
                        className={`px-5 py-2.5 rounded-xl text-[11px] font-tech font-bold uppercase tracking-[0.15em] transition-all whitespace-nowrap ${activeRegion === region ? "bg-white text-black" : "text-[#444] hover:text-white/60"}`}
                      >
                        {region}
                      </button>
                    ))}
                  </div>

                  <div className="flex flex-row items-center gap-3 w-full md:w-auto">
                    <div className="flex-1 md:flex-initial bg-[#0a0a0a] px-5 py-3 rounded-2xl border border-white/5 flex items-center justify-center gap-4">
                      <Clock size={16} className="text-white/20" />
                      <div className="flex flex-col justify-center">
                        <span className="text-[10px] text-white/40 font-tech uppercase tracking-widest flex items-center gap-2">
                          <RefreshCcw size={10} className={`text-cyber-success ${isSyncing ? "animate-spin" : ""}`} />
                          DATABASE SYNC: <span className="text-white font-mono font-bold">{lastSyncTime}</span>
                        </span>
                      </div>
                    </div>
                    <div
                      className={`flex-1 md:flex-initial px-6 py-3 rounded-2xl border transition-all flex items-center justify-center gap-5 ${isOverdue ? "bg-red-500/10 border-red-500/20" : "bg-[#081510] border-cyber-success/10"}`}
                    >
                      {isOverdue ? (
                        <AlertCircle size={18} className="text-red-500 animate-pulse" />
                      ) : (
                        <Timer size={18} className="text-cyber-success" />
                      )}
                      <div className="flex flex-col">
                        <span className="text-[8px] text-white/30 font-tech uppercase tracking-widest">
                          {isOverdue ? "Syncing Missing Block" : "Next Update"}
                        </span>
                        <span
                          className={`font-mono text-sm font-black ${isOverdue ? "text-red-500" : "text-cyber-success"}`}
                        >
                          {nextUpdateText}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section id="codes" className="max-w-7xl mx-auto px-4 md:px-8 py-12 min-h-[400px]">
              {isSyncing && displayCodes.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                  <Loader2 className="animate-spin text-cyber-success mb-4" size={40} />
                  <p className="font-tech text-white/40 uppercase tracking-widest text-xs">
                    Authenticating with {activeRegion} Cloud Nodes...
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                  {displayCodes.map((code, idx) => (
                    <CodeCard
                      key={`${activeRegion}-${idx}`}
                      data={code}
                      onSelect={() => {
                        setSelectedCode(code);
                        handleSetView("code-detail");
                      }}
                    />
                  ))}
                </div>
              )}
              {!isSyncing && displayCodes.length === 0 && (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                  <WifiOff className="text-white/10 mb-4" size={48} />
                  <p className="font-tech text-white/40 uppercase tracking-widest text-xs">
                    No unique codes found for this region yet.
                  </p>
                  <button
                    onClick={() => performAtomicSync(activeRegion, true)}
                    className="mt-4 px-6 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-all"
                  >
                    Retry Regional Sync
                  </button>
                </div>
              )}
            </section>
            <AuthorityHub />
          </>
        ) : (
          <Suspense
            fallback={
              <div className="flex items-center justify-center min-h-[50vh]">
                <Loader2 className="animate-spin text-white" />
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
      <Footer />
    </div>
  );
}

export default App;
