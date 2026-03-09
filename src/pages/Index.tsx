import { useEffect, useState, useCallback, Suspense } from 'react';
import React from 'react';
import { Header } from '@/components/ff/Header';
import { Footer } from '@/components/ff/Footer';
import { CodeCard } from '@/components/ff/CodeCard';
import { Schema } from '@/components/ff/Schema';
const AuthorityHub = React.lazy(() => import('@/components/ff/AuthorityHub').then(m => ({ default: m.AuthorityHub })));
import { AppView, RedeemCode } from '@/types';
import { Clock, Loader2, Timer, RefreshCcw, MapPin, Globe, AlertCircle } from 'lucide-react';
import { codesSyncService } from '@/services/codesSyncService';
import { supabase } from '@/integrations/supabase/client';


const ContentView = React.lazy(() => import('@/components/ff/ContentView').then(m => ({ default: m.ContentView })));
const CodeDetailView = React.lazy(() => import('@/components/ff/CodeDetailView').then(m => ({ default: m.CodeDetailView })));

const REGIONS = ['GLOBAL', 'INDIA', 'BRAZIL', 'INDONESIA', 'EUROPE'];
const REGION_OFFSETS: Record<string, number> = {
  'GLOBAL': 3, 'INDIA': 8, 'BRAZIL': 13, 'INDONESIA': 18, 'EUROPE': 23
};

const CACHE_TTL_MS = 75 * 60 * 1000;

const detectRegionFromTimezone = (): string => {
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  if (tz.includes('Calcutta') || tz.includes('Asia/Kolkata')) return 'INDIA';
  if (tz.includes('Sao_Paulo') || tz.includes('Brazil')) return 'BRAZIL';
  if (tz.includes('Jakarta')) return 'INDONESIA';
  if (tz.includes('Europe')) return 'EUROPE';
  return 'GLOBAL';
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
    localStorage.setItem(getRegionCacheKey(region), JSON.stringify({
      codes,
      lastSyncTime,
      cachedAt: Date.now(),
    }));
  } catch {
    // ignore cache errors
  }
};

const formatSyncLabel = (syncedAt: string | null): string => {
  if (!syncedAt) return 'WAITING';
  try {
    return new Date(syncedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch {
    return 'WAITING';
  }
};

const Index = () => {
  const initialRegion = detectRegionFromTimezone();
  const initialCache = readCachedRegion(initialRegion);

  const [currentView, setCurrentView] = useState<AppView>('home');
  const [selectedCode, setSelectedCode] = useState<RedeemCode | null>(null);
  const [activeRegion, setActiveRegion] = useState(initialRegion);
  const [displayCodes, setDisplayCodes] = useState<RedeemCode[]>(initialCache?.codes ?? []);
  const [lastSyncTime, setLastSyncTime] = useState<string>(initialCache?.lastSyncTime || 'WAITING');
  const [nextUpdateText, setNextUpdateText] = useState('--:--');
  const [isOverdue, setIsOverdue] = useState(false);
  const [dateStr, setDateStr] = useState('');

  // Dynamic title with current date for SEO freshness
  useEffect(() => {
    const now = new Date();
    const dayMonthYear = now.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
    document.title = `Free Fire Redeem Code Today ${dayMonthYear} - 12+ Active Working Codes`;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', `Get 12+ working Free Fire redeem codes today ${dayMonthYear}. Instant free diamonds, legendary skins & bundles. Hourly verified from official Garena servers. 100% Working.`);
  }, []);

  const loadRegionData = useCallback(async (region: string, updateUi = true) => {
    const tryLoadCodes = async (attempt = 1): Promise<{ codes: RedeemCode[]; syncedAt: string | null } | null> => {
      try {
        const { codes, syncedAt } = await codesSyncService.getCodesByRegion(region);
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
      timeLabel = await codesSyncService.getLastSyncTime(region);
    } catch {
      // Keep derived label from synced_at if sync_log request fails
    }

    writeCachedRegion(region, loaded.codes, timeLabel);
    if (updateUi) {
      setDisplayCodes(loaded.codes);
      setLastSyncTime(timeLabel);
    }
  }, []);

  // Show cached snapshot instantly on region switch, then silently refresh from backend
  useEffect(() => {
    const cached = readCachedRegion(activeRegion);
    if (cached?.codes?.length) {
      setDisplayCodes(cached.codes);
      setLastSyncTime(cached.lastSyncTime || 'WAITING');
    } else {
      setDisplayCodes([]);
      setLastSyncTime('WAITING');
    }

    loadRegionData(activeRegion, true);
  }, [activeRegion, loadRegionData]);

  // Retry in background while empty so users get live data as soon as connectivity returns
  useEffect(() => {
    if (displayCodes.length > 0) return;
    const retry = setInterval(() => {
      loadRegionData(activeRegion, true);
    }, 15000);
    return () => clearInterval(retry);
  }, [activeRegion, displayCodes.length, loadRegionData]);

  // Realtime subscription — when cron syncs new codes, all users see them instantly
  useEffect(() => {
    const channel = supabase
      .channel('synced-codes-realtime')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'synced_codes', filter: `region=eq.${activeRegion}` },
        () => {
          // New codes inserted by cron — reload from DB
          loadRegionData(activeRegion, true);
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [activeRegion, loadRegionData]);

  // Countdown timer to next sync
  useEffect(() => {
    const ticker = setInterval(() => {
      const now = new Date();
      setDateStr(now.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }).toUpperCase());
      const offset = REGION_OFFSETS[activeRegion] || 3;
      let next = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), offset, 0);
      const isPast = now.getTime() >= next.getTime();
      setIsOverdue(isPast && (lastSyncTime === '--:--' || lastSyncTime === 'WAITING'));
      if (isPast) next.setHours(next.getHours() + 1);
      const diffMs = next.getTime() - now.getTime();
      const totalSecs = Math.max(0, Math.floor(diffMs / 1000));
      setNextUpdateText(`${Math.floor(totalSecs / 60).toString().padStart(2, '0')}M ${(totalSecs % 60).toString().padStart(2, '0')}S`);
    }, 1000);
    return () => clearInterval(ticker);
  }, [activeRegion, lastSyncTime]);

  const handleSetView = (view: AppView) => { setCurrentView(view); window.scrollTo(0, 0); };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-cyber-success selection:text-black">
      <Schema currentView={currentView} selectedCode={selectedCode} />
      <Header currentView={currentView} setView={handleSetView} isSyncing={false} syncingRegion={null} />

      <main className="w-full">
        {currentView === 'home' ? (
          <>
            <section className="relative w-full pt-8 pb-2 px-4 flex flex-col items-center">
              <div className="max-w-7xl mx-auto text-center">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/5 border border-white/10 rounded-full mb-8">
                  <Globe size={14} className="text-cyber-success" />
                  <span className="text-[10px] font-tech font-bold text-white/60 uppercase tracking-widest">Cron-Powered Cloud Sync • Zero Client API Calls</span>
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
                      <button key={region} onClick={() => setActiveRegion(region)} className={`px-5 py-2.5 rounded-xl text-[11px] font-tech font-bold uppercase tracking-[0.15em] transition-all whitespace-nowrap ${activeRegion === region ? 'bg-white text-black' : 'text-[#444] hover:text-white/60'}`}>
                        {region}
                      </button>
                    ))}
                  </div>
                  <div className="flex flex-row items-center gap-3 w-full md:w-auto">
                    <div className="flex-1 md:flex-initial bg-[#0a0a0a] px-5 py-3 rounded-2xl border border-white/5 flex items-center justify-center gap-4">
                      <Clock size={16} className="text-white/20" />
                      <div className="flex flex-col justify-center">
                        <span className="text-[10px] text-white/40 font-tech uppercase tracking-widest flex items-center gap-2">
                          <RefreshCcw size={10} className="text-cyber-success" />
                          LAST SYNC: <span className="text-white font-mono font-bold">{lastSyncTime}</span>
                        </span>
                      </div>
                    </div>
                    <div className={`flex-1 md:flex-initial px-6 py-3 rounded-2xl border transition-all flex items-center justify-center gap-5 ${isOverdue ? 'bg-red-500/10 border-red-500/20' : 'bg-[#081510] border-cyber-success/10'}`}>
                      {isOverdue ? <AlertCircle size={18} className="text-red-500 animate-pulse" /> : <Timer size={18} className="text-cyber-success" />}
                      <div className="flex flex-col">
                        <span className="text-[8px] text-white/30 font-tech uppercase tracking-widest">{isOverdue ? 'Sync Pending' : 'Next Broadcast'}</span>
                        <span className={`font-mono text-sm font-black ${isOverdue ? 'text-red-500' : 'text-cyber-success'}`}>{nextUpdateText}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            <section id="codes" className="max-w-7xl mx-auto px-4 md:px-8 py-12 min-h-[400px]">
              {displayCodes.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                  {displayCodes.map((code, idx) => (
                    <CodeCard key={`${activeRegion}-${idx}`} data={code} onSelect={() => { setSelectedCode(code); handleSetView('code-detail'); }} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-24">
                  <p className="font-tech text-white/40 uppercase tracking-widest text-xs">Live codes are temporarily unavailable for {activeRegion}. Please disable ad blocker/VPN and refresh.</p>
                </div>
              )}
            </section>
            <Suspense fallback={<div className="min-h-[400px]" />}>
              <AuthorityHub />
            </Suspense>
          </>
        ) : (
          <Suspense fallback={<div className="flex items-center justify-center min-h-[50vh]"><Loader2 className="animate-spin text-white" /></div>}>
            {currentView === 'code-detail' && selectedCode ? (
              <CodeDetailView code={selectedCode} setView={handleSetView} lastSyncTime={Date.now()} />
            ) : (
              <ContentView currentView={currentView} setView={handleSetView} selectedArticleId={null} setSelectedArticleId={() => {}} />
            )}
          </Suspense>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Index;
