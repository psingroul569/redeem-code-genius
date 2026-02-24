import React from 'react';
import { AppView } from '@/types';
import { Zap } from 'lucide-react';

interface HeaderProps {
  currentView: AppView;
  setView: (view: AppView) => void;
  isSyncing: boolean;
  syncingRegion: string | null;
}

export const Header: React.FC<HeaderProps> = ({ currentView, setView, isSyncing, syncingRegion }) => {
  return (
    <header className="sticky top-0 bg-black/90 backdrop-blur-xl pt-4 pb-4 z-50 border-b border-white/5 transition-all shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 md:gap-5 group cursor-pointer min-w-0" onClick={() => setView('home')}>
          <div className="relative flex-shrink-0">
            <div className="absolute -inset-1 bg-cyber-success/20 blur-md rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-[#111] to-black border border-white/10 rounded-xl flex items-center justify-center group-hover:border-cyber-success/50 transition-all duration-300 shadow-inner">
               <Zap size={22} className="text-cyber-success fill-cyber-success/10 md:w-6 md:h-6" />
               <div className="absolute -top-1 -right-1 w-3 h-3 bg-cyber-success rounded-full border-2 border-black flex items-center justify-center">
                  <div className="w-1 h-1 bg-black rounded-full animate-ping"></div>
               </div>
            </div>
          </div>
          <div className="hidden md:flex flex-col min-w-0">
              <div className="flex items-baseline gap-0.5">
                <span className="font-display text-lg sm:text-2xl tracking-tighter text-white/40 leading-none font-black italic">FF</span>
                <span className="font-display text-lg sm:text-2xl tracking-tighter text-white leading-none font-black italic uppercase">REDEEMCODE</span>
                <span className="font-display text-lg sm:text-2xl tracking-tighter text-cyber-success leading-none font-black italic uppercase drop-shadow-[0_0_10px_rgba(0,255,148,0.3)]">TODAY</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[9px] text-cyber-muted tracking-[0.25em] font-tech uppercase font-bold truncate">HOURLY VERIFICATION ENGINE</span>
                <div className="h-px w-8 bg-white/10"></div>
                <span className="text-[8px] text-cyber-success font-tech font-bold uppercase tracking-widest animate-pulse">V4.0 LIVE</span>
              </div>
          </div>
        </div>
        <div className="flex items-center gap-3 md:gap-6 flex-shrink-0">
           <nav className="flex items-center space-x-2 md:space-x-4">
              <button onClick={() => setView('home')} className={`px-4 md:px-6 py-2.5 rounded-xl text-[10px] md:text-xs font-tech font-bold tracking-widest transition-all border shadow-sm ${currentView === 'home' ? 'bg-white text-black border-white shadow-white/10' : 'text-gray-400 hover:text-white border-white/5 hover:bg-white/5'}`}>HOME</button>
              <button onClick={() => setView('content')} className={`px-4 md:px-6 py-2.5 rounded-xl text-[10px] md:text-xs font-tech font-bold tracking-widest transition-all border shadow-sm ${['content', 'article'].includes(currentView) ? 'bg-white text-black border-white shadow-white/10' : 'text-gray-400 hover:text-white border-white/5 hover:bg-white/5'}`}>GUIDES</button>
           </nav>
        </div>
      </div>
    </header>
  );
};
