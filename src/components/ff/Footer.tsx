import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-black border-t border-cyber-border pt-12 pb-10 relative z-10 font-tech">
      <div className="max-w-7xl mx-auto px-4 mb-12">
        <p className="text-center text-cyber-muted text-xs uppercase tracking-[0.3em] mb-6">As Seen On</p>
        <div className="flex flex-wrap justify-center items-center gap-x-10 gap-y-6 md:gap-x-16 opacity-30 grayscale hover:grayscale-0 transition-all duration-500 px-4">
           {['GAMINGWEEK', 'ESPORTSDAILY', 'FF WIKIA', 'REDDIT', 'DISCORD PRO'].map((brand) => (
               <span key={brand} className="text-base md:text-xl font-display text-white tracking-tighter whitespace-nowrap">{brand}</span>
           ))}
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 mb-12 border-b border-white/5 pb-12">
        <div className="grid grid-cols-3 lg:grid-cols-4 gap-y-12 gap-x-6 md:gap-x-16">
          <div className="col-span-3 lg:col-span-1 mb-4 lg:mb-0">
              <h3 className="font-display text-2xl md:text-3xl text-white mb-4 uppercase tracking-tight leading-none">FF REDEEM CODE TODAY</h3>
              <p className="text-cyber-muted text-sm md:text-base leading-relaxed mb-6 max-w-md">Your trusted intelligence hub for Garena Free Fire rewards. We verify every code on live server nodes for maximum accuracy.</p>
              <div className="flex items-center gap-3">
                 <div className="w-2.5 h-2.5 rounded-full bg-cyber-success animate-pulse"></div>
                 <span className="text-xs text-cyber-success/80 font-bold uppercase tracking-widest">Global Sync Active</span>
              </div>
          </div>
          <div className="col-span-1">
              <h4 className="text-white font-bold text-sm md:text-base mb-6 tracking-[0.15em] uppercase border-b border-white/10 pb-2 inline-block">Resources</h4>
              <ul className="space-y-4 text-sm md:text-base text-cyber-muted">
                  <li><a href="#" className="hover:text-white transition-colors block">Live Feed</a></li>
                  <li><a href="#guide" className="hover:text-white transition-colors block">Guide</a></li>
                  <li><a href="#" className="hover:text-white transition-colors block">Status</a></li>
                  <li><a href="#faq" className="hover:text-white transition-colors block">FAQ</a></li>
              </ul>
          </div>
          <div className="col-span-1">
              <h4 className="text-white font-bold text-sm md:text-base mb-6 tracking-[0.15em] uppercase border-b border-white/10 pb-2 inline-block">Support</h4>
              <ul className="space-y-4 text-sm md:text-base text-cyber-muted">
                  <li className="flex items-center gap-3 group cursor-pointer">Help</li>
                  <li className="flex items-center gap-3 group cursor-pointer">Email</li>
                  <li className="text-[10px] md:text-xs text-cyber-muted/40 pt-1 tracking-widest uppercase">Verified Response: 24H</li>
              </ul>
          </div>
          <div className="col-span-1">
              <h4 className="text-white font-bold text-sm md:text-base mb-6 tracking-[0.15em] uppercase border-b border-white/10 pb-2 inline-block">Compliance</h4>
               <ul className="space-y-4 text-sm md:text-base text-cyber-muted">
                  <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">DMCA</a></li>
              </ul>
          </div>
        </div>
      </div>
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
