
import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-black border-t border-cyber-border pt-12 pb-10 relative z-10 font-tech">
      
      {/* Featured In Section */}
      <div className="max-w-7xl mx-auto px-4 mb-12">
        <p className="text-center text-cyber-muted text-xs uppercase tracking-[0.3em] mb-6">As Seen On</p>
        <div className="flex flex-wrap justify-center items-center gap-x-10 gap-y-6 md:gap-x-16 opacity-30 grayscale hover:grayscale-0 transition-all duration-500 px-4">
           {['GAMINGWEEK', 'ESPORTSDAILY', 'FF WIKIA', 'REDDIT', 'DISCORD PRO'].map((brand) => (
               <span key={brand} className="text-base md:text-xl font-display text-white tracking-tighter whitespace-nowrap">{brand}</span>
           ))}
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 mb-12 border-b border-white/5 pb-12">
        <div className="grid grid-cols-3 lg:grid-cols-4 gap-y-12 gap-x-6 md:gap-x-16">
          
          {/* Brand Column - Full width on mobile/tablet, single col on desktop */}
          <div className="col-span-3 lg:col-span-1 mb-4 lg:mb-0">
              <h3 className="font-display text-2xl md:text-3xl text-white mb-4 uppercase tracking-tight leading-none">FF REDEEM CODE TODAY</h3>
              <p className="text-cyber-muted text-sm md:text-base leading-relaxed mb-6 max-w-md">
                  Your trusted intelligence hub for Garena Free Fire rewards. We verify every code on live server nodes for maximum accuracy.
              </p>
              <div className="flex items-center gap-3">
                 <div className="w-2.5 h-2.5 rounded-full bg-cyber-success animate-pulse"></div>
                 <span className="text-xs text-cyber-success/80 font-bold uppercase tracking-widest">Global Sync Active</span>
              </div>
          </div>

          {/* Resources (Quick Links) */}
          <div className="col-span-1">
              <h4 className="text-white font-bold text-sm md:text-base mb-6 tracking-[0.15em] uppercase border-b border-white/10 pb-2 inline-block">Resources</h4>
              <ul className="space-y-4 text-sm md:text-base text-cyber-muted">
                  <li><a href="#" className="hover:text-white transition-colors block">Live Feed</a></li>
                  <li><a href="#guide" className="hover:text-white transition-colors block">Guide</a></li>
                  <li><a href="#" className="hover:text-white transition-colors block">Status</a></li>
                  <li><a href="#faq" className="hover:text-white transition-colors block">FAQ</a></li>
              </ul>
          </div>

          {/* Assistance (Support) */}
          <div className="col-span-1">
              <h4 className="text-white font-bold text-sm md:text-base mb-6 tracking-[0.15em] uppercase border-b border-white/10 pb-2 inline-block">Support</h4>
              <ul className="space-y-4 text-sm md:text-base text-cyber-muted">
                  <li className="flex items-center gap-3 group cursor-pointer">
                      <svg className="w-5 h-5 text-cyber-muted group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                      Help
                  </li>
                  <li className="flex items-center gap-3 group cursor-pointer">
                      <svg className="w-5 h-5 text-cyber-muted group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                      Email
                  </li>
                  <li className="text-[10px] md:text-xs text-cyber-muted/40 pt-1 tracking-widest uppercase">Verified Response: 24H</li>
              </ul>
          </div>

          {/* Compliance (Legal) */}
          <div className="col-span-1">
              <h4 className="text-white font-bold text-sm md:text-base mb-6 tracking-[0.15em] uppercase border-b border-white/10 pb-2 inline-block">Compliance</h4>
               <ul className="space-y-4 text-sm md:text-base text-cyber-muted">
                  <li className="flex items-center gap-3">
                       <svg className="w-4 h-4 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                       <a href="#" className="hover:text-white transition-colors">Privacy</a>
                  </li>
                  <li className="flex items-center gap-3">
                       <span className="text-white/20 text-xs font-bold">&gt;_</span>
                       <a href="#" className="hover:text-white transition-colors">Terms</a>
                  </li>
                  <li className="flex items-center gap-3">
                       <svg className="w-4 h-4 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                       <a href="#" className="hover:text-white transition-colors">DMCA</a>
                  </li>
              </ul>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="max-w-7xl mx-auto px-6 text-center">
        <p className="text-xs text-cyber-muted/40 leading-relaxed uppercase tracking-[0.25em] mb-6 max-w-3xl mx-auto px-4">
          This platform is an independent resource for gaming enthusiasts. We are not officially affiliated with Garena International. All trademarks belong to their respective owners.
        </p>
        <div className="text-xs md:text-sm text-white/20 uppercase tracking-[0.4em] font-bold">
          &copy; {new Date().getFullYear()} FF REDEEM CODE TODAY
        </div>
      </div>
    </footer>
  );
};
