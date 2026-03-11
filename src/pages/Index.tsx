import { useEffect, useState, useCallback, Suspense } from 'react';
import React from 'react';
import { Header } from '@/components/ff/Header';
const Footer = React.lazy(() => import('@/components/ff/Footer').then((m) => ({ default: m.Footer })));
import { CodeCard } from '@/components/ff/CodeCard';
import { Schema } from '@/components/ff/Schema';
const AuthorityHub = React.lazy(() => import('@/components/ff/AuthorityHub').then((m) => ({ default: m.AuthorityHub })));
import { AppView, RedeemCode } from '@/types';
import { Clock, Loader2, Timer, RefreshCcw, MapPin, Globe, AlertCircle } from 'lucide-react';
import { codesSyncService } from '@/services/codesSyncService';
import { supabase } from '@/integrations/supabase/client';
import { useTheme } from '@/hooks/useTheme';


const ContentView = React.lazy(() => import('@/components/ff/ContentView').then((m) => ({ default: m.ContentView })));
const CodeDetailView = React.lazy(() => import('@/components/ff/CodeDetailView').then((m) => ({ default: m.CodeDetailView })));

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

const readCachedRegion = (region: string): {codes: RedeemCode[];lastSyncTime: string;cachedAt: number;} | null => {
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
      cachedAt: Date.now()
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

const PLACEHOLDER_REWARDS = [
  'Diamond Royale Voucher', 'Exclusive Bundle', 'Weapon Royale Voucher', 'Legendary Skin',
  'Pet Skin', 'Custom Room Card', 'Gold Royale Voucher', 'Backpack Skin',
  'Emote Pack', 'Surfboard Skin', 'Gloo Wall Skin', 'Loot Crate'
];
const PLACEHOLDER_CATEGORIES: Array<'Voucher'|'Bundle'|'Skin'|'Pet'> = ['Voucher','Bundle','Skin','Pet','Voucher','Voucher','Voucher','Bundle','Skin','Voucher','Bundle','Voucher'];

const generatePlaceholderCodes = (region: string): RedeemCode[] => {
  return PLACEHOLDER_REWARDS.map((reward, i) => ({
    code: '????????????',
    reward,
    category: PLACEHOLDER_CATEGORIES[i] || 'Bundle',
    slug: `placeholder-${region}-${i}`,
    server: region,
    status: 'Working' as const,
    probability: 85,
    lastTested: 'Loading...',
    likes: 0,
    recentClaims: 0,
    releaseDate: new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'long', year: 'numeric' }),
    citations: [],
  }));
};

const Index = () => {
  const { theme, toggleTheme } = useTheme();
  const initialRegion = detectRegionFromTimezone();
  const initialCache = readCachedRegion(initialRegion);

  const [currentView, setCurrentView] = useState<AppView>('home');
  const [selectedCode, setSelectedCode] = useState<RedeemCode | null>(null);
  const [activeRegion, setActiveRegion] = useState(initialRegion);
  const [displayCodes, setDisplayCodes] = useState<RedeemCode[]>(initialCache?.codes ?? generatePlaceholderCodes(initialRegion));
  const [isPlaceholder, setIsPlaceholder] = useState(!initialCache?.codes?.length);
  const [lastSyncTime, setLastSyncTime] = useState<string>(initialCache?.lastSyncTime || 'WAITING');
  const [nextUpdateText, setNextUpdateText] = useState('--:--');
  const [isOverdue, setIsOverdue] = useState(false);
  const [dateStr, setDateStr] = useState('');

  useEffect(() => {
    const now = new Date();
    const dayMonthYear = now.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
    document.title = `Free Fire Redeem Code Today ${dayMonthYear} - 12+ Active Working Codes`;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', `Get 12+ working Free Fire redeem codes today ${dayMonthYear}. Instant free diamonds, legendary skins & bundles. Hourly verified from official Garena servers. 100% Working.`);
  }, []);

  const loadRegionData = useCallback(async (region: string, updateUi = true) => {
    const tryLoadCodes = async (attempt = 1): Promise<{codes: RedeemCode[];syncedAt: string | null;} | null> => {
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
      // Keep derived label
    }
    writeCachedRegion(region, loaded.codes, timeLabel);
    if (updateUi) {
      setDisplayCodes(loaded.codes);
      setIsPlaceholder(false);
      setLastSyncTime(timeLabel);
    }
  }, []);

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

  useEffect(() => {
    if (displayCodes.length > 0) return;
    const retry = setInterval(() => {
      loadRegionData(activeRegion, true);
    }, 15000);
    return () => clearInterval(retry);
  }, [activeRegion, displayCodes.length, loadRegionData]);

  useEffect(() => {
    const channel = supabase.
    channel('synced-codes-realtime').
    on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'synced_codes', filter: `region=eq.${activeRegion}` },
      () => {
        loadRegionData(activeRegion, true);
      }
    ).
    subscribe();
    return () => {supabase.removeChannel(channel);};
  }, [activeRegion, loadRegionData]);

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

  const handleSetView = (view: AppView) => {setCurrentView(view);window.scrollTo(0, 0);};

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-success selection:text-primary-foreground">
      <Schema currentView={currentView} selectedCode={selectedCode} />
      <Header currentView={currentView} setView={handleSetView} isSyncing={false} syncingRegion={null} theme={theme} onToggleTheme={toggleTheme} />

      <main className="w-full">
        {currentView === 'home' ?
        <>
            <section className="relative w-full pt-8 pb-2 px-4 flex flex-col items-center">
              <div className="max-w-7xl mx-auto text-center">
                <h1 className="font-display text-[clamp(2.5rem,10vw,6rem)] text-foreground uppercase tracking-tighter leading-[0.85] text-glow mb-6">
                  FREE FIRE REDEEM <br /> <span className="text-success italic">CODE TODAY</span>
                </h1>
                <div className="flex flex-col items-center gap-2">
                  <span className="text-2xl font-display text-secondary date-glow">{dateStr}</span>
                  <div className="flex items-center gap-2 text-[10px] text-t-muted font-tech uppercase tracking-widest mt-2">
                    <MapPin size={10} className="text-success" />
                    Active Node: <span className="text-foreground font-bold">{activeRegion}</span>
                  </div>
                </div>
              </div>
              <div className="w-full max-w-7xl mx-auto mt-12 px-4 md:px-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="flex w-full md:w-auto bg-surface p-1 rounded-2xl border border-border overflow-x-auto no-scrollbar">
                    {REGIONS.map((region) =>
                  <button key={region} onClick={() => setActiveRegion(region)} className={`px-5 py-2.5 rounded-xl text-[11px] font-tech font-bold uppercase tracking-[0.15em] transition-all whitespace-nowrap ${activeRegion === region ? 'bg-primary text-primary-foreground' : 'text-t-muted hover:text-foreground'}`}>
                        {region}
                      </button>
                  )}
                  </div>
                  <div className="flex flex-row items-center gap-3 w-full md:w-auto">
                    <div className="flex-1 md:flex-initial bg-surface px-5 py-3 rounded-2xl border border-border flex items-center justify-center gap-4">
                      <Clock size={16} className="text-t-muted" />
                      <div className="flex flex-col justify-center">
                        <span className="text-[10px] text-t-muted font-tech uppercase tracking-widest flex items-center gap-2">
                          <RefreshCcw size={10} className="text-success" />
                          LAST SYNC: <span className="text-foreground font-mono font-bold">{lastSyncTime}</span>
                        </span>
                      </div>
                    </div>
                    <div className={`flex-1 md:flex-initial px-6 py-3 rounded-2xl border transition-all flex items-center justify-center gap-5 ${isOverdue ? 'bg-destructive/10 border-destructive/20' : 'bg-success-bg border-success-border'}`}>
                      {isOverdue ? <AlertCircle size={18} className="text-destructive animate-pulse" /> : <Timer size={18} className="text-success" />}
                      <div className="flex flex-col">
                        <span className="text-[8px] text-t-muted font-tech uppercase tracking-widest">{isOverdue ? 'Sync Pending' : 'Next Broadcast'}</span>
                        <span className={`font-mono text-sm font-black ${isOverdue ? 'text-destructive' : 'text-success'}`}>{nextUpdateText}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            <section id="codes" className="max-w-7xl mx-auto px-4 md:px-8 py-12 min-h-[1200px] lg:min-h-[1600px]">
              {displayCodes.length > 0 ?
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                  {displayCodes.map((code, idx) =>
              <CodeCard key={`${activeRegion}-${idx}`} data={code} onSelect={() => {setSelectedCode(code);handleSetView('code-detail');}} />
              )}
                </div> :
            <div className="text-center py-24">
                  <p className="font-tech text-t-muted uppercase tracking-widest text-xs">Live codes are temporarily unavailable for {activeRegion}. Please disable ad blocker/VPN and refresh.</p>
                </div>
            }
            </section>
            <Suspense fallback={<div className="min-h-[400px]" />}>
              <AuthorityHub />
            </Suspense>
          </> :
        <Suspense fallback={<div className="flex items-center justify-center min-h-[50vh]"><Loader2 className="animate-spin text-foreground" /></div>}>
            {currentView === 'code-detail' && selectedCode ?
          <CodeDetailView code={selectedCode} setView={handleSetView} lastSyncTime={Date.now()} /> :
          <ContentView currentView={currentView} setView={handleSetView} selectedArticleId={null} setSelectedArticleId={() => {}} />
          }
          </Suspense>
        }
      </main>
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </div>
  );
};

export default Index;
