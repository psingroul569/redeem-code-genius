import React from 'react';
import { Link } from 'react-router-dom';

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
                  <li><Link to="/blogs" className="hover:text-white transition-colors block">Blogs</Link></li>
                  <li><Link to="/how-to-guide" className="hover:text-white transition-colors block">How to Guide</Link></li>
                  <li><Link to="/faq" className="hover:text-white transition-colors block">FAQ</Link></li>
              </ul>
          </div>
          <div className="col-span-1">
              <h4 className="text-white font-bold text-sm md:text-base mb-6 tracking-[0.15em] uppercase border-b border-white/10 pb-2 inline-block">Contact Us</h4>
              <ul className="space-y-4 text-sm md:text-base text-cyber-muted">
                  <li><Link to="/help" className="hover:text-white transition-colors block">Help</Link></li>
                  <li><Link to="/contact" className="hover:text-white transition-colors block">Email</Link></li>
              </ul>
          </div>
          <div className="col-span-1">
              <h4 className="text-white font-bold text-sm md:text-base mb-6 tracking-[0.15em] uppercase border-b border-white/10 pb-2 inline-block">Important Links</h4>
               <ul className="space-y-4 text-sm md:text-base text-cyber-muted">
                  <li><Link to="/about-us" className="hover:text-white transition-colors">About Us</Link></li>
                  <li><Link to="/disclaimer" className="hover:text-white transition-colors">Disclaimer</Link></li>
                  <li><Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                  <li><Link to="/terms" className="hover:text-white transition-colors">Terms</Link></li>
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
