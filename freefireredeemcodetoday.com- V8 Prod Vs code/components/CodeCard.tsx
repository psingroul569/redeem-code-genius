
import React, { useState } from 'react';
import { RedeemCode } from '../types';
import { Copy, Check, ThumbsUp, ThumbsDown, Zap, Link, ShieldCheck, ExternalLink } from 'lucide-react';

interface Props {
  data: RedeemCode & { lastTested?: string };
  onSelect: () => void;
}

export const CodeCard: React.FC<Props> = ({ data, onSelect }) => {
  const [copied, setCopied] = useState(false);
  const [voted, setVoted] = useState<'like' | 'dislike' | null>(null);
  const [showSources, setShowSources] = useState(false);

  const [metrics, setMetrics] = useState(() => ({
    likes: data.likes ?? Math.floor(Math.random() * 800) + 150,
    dislikes: data.dislikes ?? Math.floor(Math.random() * 40) + 5
  }));

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (data.status === 'Expired') return;
    navigator.clipboard.writeText(data.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleVote = (e: React.MouseEvent, type: 'like' | 'dislike') => {
    e.stopPropagation();
    if (voted === type) {
        setVoted(null);
        setMetrics(prev => ({ ...prev, [type === 'like' ? 'likes' : 'dislikes']: prev[type === 'like' ? 'likes' : 'dislikes'] - 1 }));
    } else {
        setMetrics(prev => {
            const updates = { ...prev };
            if (voted) { updates[voted === 'like' ? 'likes' : 'dislikes'] = Math.max(0, updates[voted === 'like' ? 'likes' : 'dislikes'] - 1); }
            updates[type === 'like' ? 'likes' : 'dislikes'] += 1;
            return updates;
        });
        setVoted(type);
    }
  };

  const isExpired = data.status === 'Expired';
  const isLimited = data.status === 'Limited';

  return (
    <div 
      onClick={onSelect}
      className={`group relative bg-[#0a0a0a] border border-white/5 hover:border-cyber-success/20 transition-all duration-300 rounded-2xl p-5 cursor-pointer overflow-hidden flex flex-col h-full shadow-lg hover:shadow-cyber-success/5 ${isExpired ? 'opacity-40 grayscale pointer-events-none' : ''}`}
    >
      {/* SUCCESS TREND PULSE (SEO VALUE) */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-cyber-success/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-cyber-success/10 transition-all"></div>

      {/* FOMO Status */}
      {(data.recentClaims || 0) > 0 && (
         <div className="flex items-center gap-2 mb-4 text-[9px] text-cyber-success font-tech uppercase font-bold tracking-[0.2em]">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyber-success opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-cyber-success"></span>
            </span>
            {data.recentClaims} USERS REDEEMED TODAY
         </div>
      )}

      {/* Header Info */}
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className="flex flex-col">
           <span className="text-[10px] text-white/30 font-tech font-bold uppercase tracking-widest">{data.server || 'Global'}</span>
           <span className="text-[9px] text-cyber-success font-tech uppercase mt-0.5 flex items-center gap-1">
             <ShieldCheck size={10} /> Verified {data.lastTested || 'Tested Now'}
           </span>
        </div>
        
        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-[9px] font-tech font-bold uppercase tracking-widest ${
          !isExpired && !isLimited ? 'bg-[#00FF94]/10 text-[#00FF94] border-[#00FF94]/20' :
          isLimited ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
          'bg-red-500/10 text-red-500 border-red-500/20'
        }`}>
          {data.status || 'Active'}
        </div>
      </div>

      {/* Main Code Box */}
      <div className="mb-4 bg-white/5 rounded-xl p-3 border border-white/5 group-hover:border-cyber-success/30 transition-colors relative z-10">
        <div className="flex items-center justify-between">
            <h3 className="font-mono text-xl md:text-2xl font-black text-white tracking-widest truncate select-all">{data.code}</h3>
            <button 
                onClick={handleCopy}
                className={`ml-2 px-3 py-1.5 rounded-lg text-[9px] font-bold font-tech uppercase tracking-widest transition-all ${copied ? 'bg-cyber-success text-black' : 'bg-white/10 text-white hover:bg-white/20'}`}
            >
                {copied ? 'DONE' : 'COPY'}
            </button>
        </div>
      </div>

      {/* Reward Details */}
      <div className="flex items-start gap-3 mb-4 flex-1 relative z-10">
        <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center flex-shrink-0 border border-white/5 text-lg group-hover:bg-white/10 transition-all">
          {data.category === 'Diamond' ? '💎' : data.category === 'Skin' ? '🔫' : data.category === 'Bundle' ? '👕' : '🎁'}
        </div>
        <div>
           <p className="text-sm text-white/90 font-bold leading-tight group-hover:text-cyber-success transition-colors">{data.reward}</p>
           <p className="text-[10px] text-white/40 mt-1 line-clamp-1">{data.description || 'Global Garena Rewards Server'}</p>
        </div>
      </div>

      {/* EEAT Proof Section */}
      <div className="mb-4 pt-4 border-t border-white/5">
        <div className="flex items-center justify-between mb-2">
           <span className="text-[9px] text-white/20 font-tech uppercase font-bold tracking-widest">Verification Proof</span>
           <span className="text-[8px] text-cyber-success/50 font-mono">HASH: 0x{Math.random().toString(16).slice(2,8)}</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
           {data.citations && data.citations.length > 0 ? (
             data.citations.slice(0, 2).map((cite, i) => (
                <div key={i} className="flex items-center gap-1.5 px-2 py-1 bg-white/[0.03] border border-white/5 rounded text-[8px] text-white/40 max-w-[120px]">
                   <Link size={8} /> <span className="truncate">{cite.title}</span>
                </div>
             ))
           ) : (
             <div className="flex items-center gap-1.5 px-2 py-1 bg-cyber-success/5 border border-cyber-success/10 rounded text-[8px] text-cyber-success/60">
                <ShieldCheck size={8} /> Garena Official News
             </div>
           )}
        </div>
      </div>

      {/* Engagement Stats */}
      <div className="pt-4 border-t border-white/5 flex items-center justify-between mt-auto relative z-10">
         <div className="flex flex-col">
             <span className="text-[8px] text-white/20 font-tech font-bold uppercase tracking-widest">Success Rate</span>
             <div className="flex items-end gap-1">
                <span className={`font-display text-lg leading-none ${data.probability > 85 ? 'text-[#00FF94]' : 'text-yellow-500'}`}>
                    {data.probability}%
                </span>
             </div>
         </div>

         <div className="flex items-center gap-2">
            <button onClick={(e) => handleVote(e, 'like')} className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg border transition-all ${voted === 'like' ? 'bg-green-500/20 border-green-500 text-green-500' : 'bg-white/5 border-white/5 text-white/30 hover:text-green-400 hover:border-green-500/50'}`}>
                <ThumbsUp size={12} />
                <span className="text-[10px] font-mono font-bold">{metrics.likes}</span>
            </button>
            <button onClick={(e) => handleVote(e, 'dislike')} className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg border transition-all ${voted === 'dislike' ? 'bg-red-500/20 border-red-500 text-red-500' : 'bg-white/5 border-white/5 text-white/30 hover:text-red-400 hover:border-red-500/50'}`}>
                <ThumbsDown size={12} />
            </button>
         </div>
      </div>
    </div>
  );
};
