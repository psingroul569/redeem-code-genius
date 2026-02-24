import React from 'react';
import { Clock, ShieldAlert, BarChart3, Zap, HelpCircle } from 'lucide-react';

interface ArticleCardProps {
  title: string;
  excerpt: string;
  readTime: string;
  category: string;
  icon: React.ReactNode;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ title, excerpt, readTime, category, icon }) => (
  <div className="bg-cyber-card border border-cyber-border hover:border-white/50 rounded-lg p-6 transition-all group cursor-pointer flex flex-col h-full">
    <div className="flex items-center justify-between mb-4">
      <div className="p-2 bg-cyber-border/50 rounded-lg text-white group-hover:text-white transition-colors">{icon}</div>
      <span className="text-[10px] font-tech uppercase tracking-widest text-cyber-muted border border-cyber-muted/30 px-2 py-1 rounded">{category}</span>
    </div>
    <h3 className="text-lg font-display text-white mb-3 group-hover:text-cyber-success transition-colors leading-tight">{title}</h3>
    <p className="text-sm text-gray-500 leading-relaxed mb-6 flex-1">{excerpt}</p>
    <div className="flex items-center text-xs text-cyber-muted font-mono mt-auto pt-4 border-t border-cyber-border/50">
      <span className="w-2 h-2 bg-cyber-success rounded-full mr-2"></span>{readTime} Read
    </div>
  </div>
);

export const BlogCluster: React.FC = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 py-20 border-t border-cyber-border">
      <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
        <div>
           <div className="text-white font-tech text-sm tracking-[0.2em] uppercase mb-2">Tactical Intelligence</div>
           <h2 className="text-3xl md:text-4xl font-display text-white">Field Reports & <span className="text-gray-500">Analysis</span></h2>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ArticleCard icon={<Zap size={20} />} category="Walkthrough" title="How to Redeem Free Fire Codes in 5 Minutes" readTime="3 min" excerpt="Speed is everything. Learn the exact keystrokes and browser caching tricks pro players use." />
        <ArticleCard icon={<Clock size={20} />} category="Education" title="Why Free Fire Codes Expire So Fast" readTime="5 min" excerpt="An in-depth look at Garena's tokenomics and artificial scarcity." />
        <ArticleCard icon={<BarChart3 size={20} />} category="Data Analysis" title="Free Fire Redeem Code Success Rate 2025" readTime="8 min" excerpt="We analyzed 10,000 code drops. Weekend drops have a 40% lower success rate." />
        <ArticleCard icon={<ShieldAlert size={20} />} category="Optimization" title="Best Time to Redeem Free Fire Codes Today" readTime="4 min" excerpt="12:05 PM IST and 4:00 AM BRT are the 'Golden Windows' for redemption." />
        <ArticleCard icon={<HelpCircle size={20} />} category="Troubleshooting" title="Free Fire Codes Not Working Today? Here's Why" readTime="6 min" excerpt="Debugging the 'Failed to Redeem' error and differentiating between soft-bans and timeouts." />
         <div className="bg-gradient-to-br from-white/20 to-black border border-white/30 rounded-lg p-6 flex flex-col justify-center items-center text-center group cursor-pointer hover:border-white transition-colors">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-4"><span className="text-black font-bold text-2xl">+</span></div>
            <h3 className="text-xl font-display text-white mb-2">Submit a Story</h3>
            <p className="text-sm text-gray-400">Got a success story or a tip? Join our network of contributors.</p>
         </div>
      </div>
    </section>
  );
};
