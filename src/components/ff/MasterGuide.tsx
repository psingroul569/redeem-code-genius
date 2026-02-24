import React from 'react';
import { AlignLeft } from 'lucide-react';

export const MasterGuide: React.FC = () => {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <article className="max-w-5xl mx-auto px-4 py-16 text-gray-300 leading-relaxed space-y-16 border-t border-cyber-border/50">
      <div className="text-center space-y-4">
        <div className="inline-block px-3 py-1 bg-white/10 border border-white/30 rounded text-white text-xs font-tech tracking-[0.2em] uppercase">Pillar Content • Version 2.4</div>
        <h1 className="text-4xl md:text-5xl font-display text-white">
          The Ultimate Free Fire Redeem Code <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-yellow-500">Master Guide (2025 Edition)</span>
        </h1>
        <p className="max-w-3xl mx-auto text-lg text-cyber-muted">A comprehensive technical analysis of Garena's reward infrastructure, including historical success rates, redemption algorithms, and advanced troubleshooting for the modern survivor.</p>
      </div>
      <div className="bg-cyber-card border border-cyber-border rounded-xl p-6 md:p-8">
        <h3 className="text-white font-display text-lg mb-4 flex items-center gap-2"><AlignLeft size={20} className="text-white" /> Table of Contents</h3>
        <nav className="grid md:grid-cols-2 gap-4 text-sm font-tech uppercase tracking-wide">
          {['Mechanics & Historical Data', 'Success Rate Analysis', 'Expert Walkthrough', 'Troubleshooting Matrix', 'Asset Value Analysis'].map((title, i) => (
            <button key={i} onClick={() => scrollTo(`section-${i+1}`)} className="text-left text-cyber-muted hover:text-white transition-colors flex items-center gap-2 p-2 hover:bg-white/5 rounded-lg">
              <span className="text-white font-bold">{String(i+1).padStart(2, '0')}.</span> {title}
            </button>
          ))}
        </nav>
      </div>
      <section id="section-1" className="space-y-6 scroll-mt-32">
        <h2 className="text-2xl font-display text-white flex items-center gap-3"><span className="text-white">01 //</span> Redemption Mechanics & Historical Data</h2>
        <p>Understanding the backend mechanics of <strong>Free Fire redeem codes</strong> is crucial for maximizing your success rate. Unlike standard promotional coupons, Garena's codes operate on a <strong>distributed server node system</strong>.</p>
        <p>Our historical data analysis from 2024 to 2025 indicates a shift in code distribution patterns towards <strong>micro-validity windows</strong> (1-3 hours) but with higher value rewards.</p>
      </section>
      <section id="section-2" className="space-y-6 scroll-mt-32">
        <h2 className="text-2xl font-display text-white flex items-center gap-3"><span className="text-white">02 //</span> Global Success Rate Analysis (Q1 2025)</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-cyber-border text-sm text-left font-mono">
            <thead className="bg-cyber-card text-white">
              <tr>{['Region / Server', 'Avg. Code Lifespan', 'Success Rate', 'Reward Rarity'].map(h => <th key={h} className="border border-cyber-border px-4 py-3 uppercase tracking-wider">{h}</th>)}</tr>
            </thead>
            <tbody>
              {[['India (IND)', '45 Minutes', 'Low (High Traffic)', 'Legendary'], ['Indonesia (ID)', '2 Hours', 'Medium', 'Epic'], ['Europe (EU)', '12 Hours', 'Very High', 'Rare'], ['Brazil (BR)', '3 Hours', 'Medium', 'Legendary']].map(([region, lifespan, rate, rarity]) => (
                <tr key={region} className="bg-black hover:bg-cyber-card/50 transition-colors">
                  <td className="border border-cyber-border px-4 py-3 font-bold text-white">{region}</td>
                  <td className="border border-cyber-border px-4 py-3">{lifespan}</td>
                  <td className="border border-cyber-border px-4 py-3">{rate}</td>
                  <td className="border border-cyber-border px-4 py-3">{rarity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <section id="section-3" className="space-y-6 scroll-mt-32">
        <h2 className="text-2xl font-display text-white flex items-center gap-3"><span className="text-white">03 //</span> Expert Redemption Walkthrough</h2>
        <div className="bg-cyber-card border border-cyber-border p-8 rounded-lg space-y-8">
          {[{ title: 'Pre-Authentication Strategy', desc: 'Go to reward.ff.garena.com and ensure your session is active before the code drops.' }, { title: 'The "Clean Paste" Technique', desc: 'Our platform\'s "Click-to-Copy" strips hidden whitespace automatically.' }, { title: 'Post-Redemption Verification', desc: 'Enter the lobby, clear your cache, and check in-game mail.' }].map((step, idx) => (
            <div key={idx} className="flex gap-6">
               <div className="flex-shrink-0 w-12 h-12 bg-white/10 text-white font-display text-2xl flex items-center justify-center rounded">{idx + 1}</div>
               <div><h4 className="text-xl font-bold text-white mb-2">{step.title}</h4><p>{step.desc}</p></div>
            </div>
          ))}
        </div>
      </section>
      <section id="section-4" className="space-y-6 scroll-mt-32">
        <h2 className="text-2xl font-display text-white flex items-center gap-3"><span className="text-white">04 //</span> Advanced Troubleshooting Matrix</h2>
        <div className="grid md:grid-cols-2 gap-6">
           <div className="bg-red-900/10 border border-red-900/30 p-6 rounded"><h4 className="font-mono text-red-500 mb-2 font-bold">[ERROR: FAILED_TO_REDEEM]</h4><p className="text-sm">The batch limit has been exhausted. Wait for the next hourly drop.</p></div>
           <div className="bg-orange-900/10 border border-orange-900/30 p-6 rounded"><h4 className="font-mono text-orange-500 mb-2 font-bold">[ERROR: RESTRICTED_REGION]</h4><p className="text-sm">Geo-IP Mismatch. Disconnect VPNs and filter by your server region.</p></div>
        </div>
      </section>
      <section id="section-5" className="space-y-6 scroll-mt-32">
        <h2 className="text-2xl font-display text-white flex items-center gap-3"><span className="text-white">05 //</span> Asset Value Analysis: FF Codes vs Store</h2>
        <p>Redeem codes often drop items that are technically "Vaulted" and not available in the store.</p>
      </section>
    </article>
  );
};
