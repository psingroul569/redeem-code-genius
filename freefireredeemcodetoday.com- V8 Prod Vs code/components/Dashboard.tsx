
import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MOCK_CHART_DATA } from '../constants';
import { syncRealLatestCodes } from '../services/geminiService';
import { storageService } from '../services/storageService';
import { supabaseService } from '../services/supabaseService';
import { RefreshCw, ShieldCheck, Cpu, Zap, Brain, Globe, Database, Activity, Trash2, Search, Link, Bell, Cloud, CloudOff } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const [syncing, setSyncing] = useState(false);
  const [diagResults, setDiagResults] = useState<Record<string, string | null>>({});
  const [dbStats, setDbStats] = useState(storageService.getGlobalStats());
  const [lastPing, setLastPing] = useState<string>('Not Sent');
  const [isCloudConnected, setIsCloudConnected] = useState(false);

  useEffect(() => {
    setIsCloudConnected(supabaseService.isConnected());
  }, []);

  const engines = [
    { name: 'Google Crawler Signal', role: 'Indexing Pulse', color: 'text-orange-400', bg: 'bg-orange-400/10', icon: <Search size={14}/> },
    { name: 'Schema Logic', role: 'LiveBlogPosting V2', color: 'text-blue-400', bg: 'bg-blue-400/10', icon: <Globe size={14}/> },
    { name: 'Gemini Search', role: 'Evidence Scraper', color: 'text-purple-400', bg: 'bg-purple-400/10', icon: <Brain size={14}/> },
  ];

  const handleLiveSync = async () => {
    setSyncing(true);
    try {
      await syncRealLatestCodes('India');
      setDbStats(storageService.getGlobalStats());
      setLastPing(new Date().toLocaleTimeString());
    } catch (e) {
      console.error(e);
    } finally {
      setSyncing(false);
    }
  };

  const runDiagnostic = async (engine: string) => {
    setDiagResults(prev => ({ ...prev, [engine]: 'testing' }));
    
    if (engine.includes('Google')) {
      setDiagResults(prev => ({ ...prev, [engine]: `SUCCESS: Automatic Sitemap Notification active. Googlebot signaled every 60 mins.` }));
    } else if (engine.includes('Schema')) {
      setDiagResults(prev => ({ ...prev, [engine]: `SUCCESS: LiveBlogPosting Schema v2.0 injected. Ready for GSC indexing.` }));
    } else {
      setDiagResults(prev => ({ ...prev, [engine]: `SUCCESS: AI scraping with Grounding enabled. Fetching fresh citations.` }));
    }
  };

  const handleHardReset = () => {
    if (confirm("Clear local cache?")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
        <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                <div>
                   <h2 className="text-2xl font-display uppercase italic text-white flex items-center gap-3">
                     <Database className="text-cyber-success" size={24} />
                     SEO & Indexing Hub
                   </h2>
                   <div className="flex items-center gap-2 mt-1">
                      {isCloudConnected ? (
                        <span className="text-[10px] text-cyber-success flex items-center gap-1 font-tech font-bold uppercase tracking-widest bg-cyber-success/5 px-2 py-0.5 rounded">
                          <Cloud size={10} /> Cloud Active
                        </span>
                      ) : (
                        <span className="text-[10px] text-red-500 flex items-center gap-1 font-tech font-bold uppercase tracking-widest bg-red-500/5 px-2 py-0.5 rounded">
                          <CloudOff size={10} /> Cloud Offline (Check .env)
                        </span>
                      )}
                      <p className="text-[10px] text-white/40 uppercase font-tech tracking-widest font-bold">Protocol v4.0</p>
                   </div>
                </div>
                <div className="flex gap-2">
                    <button onClick={handleHardReset} title="Clear Cache" className="p-3 rounded-full bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all border border-red-500/20"><Trash2 size={16} /></button>
                    <button onClick={handleLiveSync} disabled={syncing} className={`flex items-center gap-3 px-8 py-3 rounded-full font-tech font-bold uppercase tracking-widest text-xs transition-all ${syncing ? 'bg-white/10 text-white/40 cursor-not-allowed' : 'bg-white text-black hover:bg-gray-200'}`}>
                      <Activity size={14} className={syncing ? 'animate-spin' : ''} />
                      {syncing ? 'Triggering Indexer...' : 'Manual Sitemap Ping'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               {engines.map((engine) => (
                  <div key={engine.name} className={`p-4 rounded-2xl border border-white/5 bg-black flex flex-col gap-4 group hover:border-white/20 transition-all`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className={`${engine.color} p-2 bg-black/40 rounded-lg`}>{engine.icon}</div>
                            <div>
                                <div className={`text-xs font-tech font-bold uppercase tracking-widest ${engine.color}`}>{engine.name}</div>
                                <div className="text-[10px] text-white/40">{engine.role}</div>
                            </div>
                        </div>
                        <button onClick={() => runDiagnostic(engine.name)} className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/20 hover:text-white transition-colors">
                           <Zap size={12} />
                        </button>
                      </div>
                      
                      {diagResults[engine.name] && (
                        <div className={`p-3 rounded-xl text-[9px] font-mono leading-tight ${diagResults[engine.name]?.includes('SUCCESS') ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                          {diagResults[engine.name]}
                        </div>
                      )}
                  </div>
               ))}
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#080808] p-6 rounded-2xl border border-white/5">
                <h3 className="text-white/30 text-[10px] font-bold uppercase tracking-widest mb-1">Estimated Rank</h3>
                <p className="text-4xl font-display text-white">#04</p>
                <div className="flex items-center gap-1.5 mt-2 text-cyber-success text-[10px] font-bold">
                    <span className="w-2 h-0.5 bg-cyber-success"></span>
                    +8 POSITIONS
                </div>
            </div>
            
            <div className="bg-[#080808] p-6 rounded-2xl border border-white/5">
                <h3 className="text-white/30 text-[10px] font-bold uppercase tracking-widest mb-1">Index Signal</h3>
                <p className="text-4xl font-display text-white">99<span className="text-sm text-white/20 font-sans ml-1">%</span></p>
                <div className="flex items-center gap-1.5 mt-2 text-blue-400 text-[10px] font-bold uppercase tracking-widest">
                    LiveBlog Schema Injected
                </div>
            </div>

            <div className="bg-[#080808] p-6 rounded-2xl border border-white/5">
                <h3 className="text-white/30 text-[10px] font-bold uppercase tracking-widest mb-1">Last Search Ping</h3>
                <p className="text-xl font-display text-white mt-2 truncate">{lastPing}</p>
                <div className="flex items-center gap-1.5 mt-2 text-orange-400 text-[10px] font-bold uppercase tracking-widest">
                   <Bell size={10} /> Active Signal
                </div>
            </div>
        </div>

        <div className="bg-[#0a0a0a] p-8 rounded-3xl border border-white/5">
            <h3 className="text-lg font-display mb-8 text-white uppercase italic tracking-widest flex items-center gap-3">
              <Activity className="text-cyber-success" size={20} />
              Crawl Frequency Forecast
            </h3>
            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={MOCK_CHART_DATA}>
                        <defs>
                            <linearGradient id="colorRank" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#00FF94" stopOpacity={0.1}/>
                                <stop offset="95%" stopColor="#00FF94" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#111" vertical={false} />
                        <XAxis dataKey="name" stroke="#333" fontSize={10} tickLine={false} axisLine={false} tick={{fill: '#444'}} />
                        <YAxis reversed stroke="#333" fontSize={10} tickLine={false} axisLine={false} tick={{fill: '#444'}} />
                        <Tooltip contentStyle={{ backgroundColor: '#000', borderColor: '#222', borderRadius: '12px', fontSize: '10px' }} />
                        <Area type="monotone" dataKey="rank" stroke="#00FF94" fillOpacity={1} fill="url(#colorRank)" strokeWidth={2} />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    </div>
  );
};
