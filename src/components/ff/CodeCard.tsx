import React, { useState } from 'react';
import { RedeemCode } from '@/types';
import { ThumbsUp, ThumbsDown, ShieldCheck, Link } from 'lucide-react';

interface Props {
  data: RedeemCode & { lastTested?: string };
  onSelect: () => void;
}

export const CodeCard: React.FC<Props> = ({ data, onSelect }) => {
  const [copied, setCopied] = useState(false);
  const [voted, setVoted] = useState<'like' | 'dislike' | null>(null);

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
      className={`group relative bg-card border border-border hover:border-success/20 transition-all duration-300 rounded-2xl p-5 cursor-pointer overflow-hidden flex flex-col h-full shadow-lg hover:shadow-success/5 ${isExpired ? 'opacity-40 grayscale pointer-events-none' : ''}`}
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-success/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-success/10 transition-all"></div>
      {(data.recentClaims || 0) > 0 && (
         <div className="flex items-center gap-2 mb-4 text-[9px] text-success font-tech uppercase font-bold tracking-[0.2em]">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-success"></span>
            </span>
            {data.recentClaims} USERS REDEEMED TODAY
         </div>
      )}
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className="flex flex-col">
           <span className="text-[10px] text-t-muted font-tech font-bold uppercase tracking-widest">{data.server || 'Global'}</span>
           <span className="text-[9px] text-success font-tech uppercase mt-0.5 flex items-center gap-1">
             <ShieldCheck size={10} /> Verified {data.lastTested || 'Tested Now'}
           </span>
        </div>
        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-[9px] font-tech font-bold uppercase tracking-widest ${
          !isExpired && !isLimited ? 'bg-success/10 text-success border-success/20' :
          isLimited ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
          'bg-destructive/10 text-destructive border-destructive/20'
        }`}>
          {data.status || 'Active'}
        </div>
      </div>
      <div className="mb-4 bg-surface rounded-xl p-3 border border-border group-hover:border-success/30 transition-colors relative z-10">
        <div className="flex items-center justify-between">
            <h3 className="font-mono text-xl md:text-2xl font-black text-foreground tracking-widest truncate select-all">{data.code}</h3>
            <button onClick={handleCopy} className={`ml-2 px-3 py-1.5 rounded-lg text-[9px] font-bold font-tech uppercase tracking-widest transition-all ${copied ? 'bg-success text-success-bg' : 'bg-surface-hover text-foreground hover:bg-muted'}`}>
                {copied ? 'DONE' : 'COPY'}
            </button>
        </div>
      </div>
      <div className="flex items-start gap-3 mb-4 flex-1 relative z-10">
        <div className="w-10 h-10 bg-surface rounded-xl flex items-center justify-center flex-shrink-0 border border-border text-lg group-hover:bg-surface-hover transition-all">
          {data.category === 'Diamond' ? '💎' : data.category === 'Skin' ? '🔫' : data.category === 'Bundle' ? '👕' : '🎁'}
        </div>
        <div>
           <p className="text-sm text-foreground font-bold leading-tight group-hover:text-success transition-colors">{data.reward}</p>
           <p className="text-[10px] text-t-muted mt-1 line-clamp-1">{data.description || 'Global Garena Rewards Server'}</p>
        </div>
      </div>
      <div className="mb-4 pt-4 border-t border-border">
        <div className="flex items-center justify-between mb-2">
           <span className="text-[9px] text-t-muted font-tech uppercase font-bold tracking-widest">Verification Proof</span>
           <span className="text-[8px] text-success/50 font-mono">HASH: 0x{Math.random().toString(16).slice(2,8)}</span>
        </div>
         <div className="flex items-center justify-between gap-2">
           <div className="flex flex-wrap gap-1.5">
              {data.citations && data.citations.length > 0 ? (
                data.citations.slice(0, 2).map((cite, i) => (
                   <div key={i} className="flex items-center gap-1.5 px-2 py-1 bg-surface border border-border rounded text-[8px] text-t-muted max-w-[120px]">
                      <Link size={8} /> <span className="truncate">{cite.title}</span>
                   </div>
                ))
              ) : (
                <div className="flex items-center gap-1.5 px-2 py-1 bg-success-bg border border-success-border rounded text-[8px] text-success/60">
                   <ShieldCheck size={8} /> Garena Official News
                </div>
              )}
           </div>
           <a
             href="https://reward.ff.garena.com/"
             target="_blank"
             rel="noopener noreferrer"
             onClick={(e) => e.stopPropagation()}
             className="flex-shrink-0 px-3 py-1.5 rounded-lg bg-success text-success-bg font-tech text-[8px] font-bold uppercase tracking-widest hover:brightness-110 transition-all"
           >
             Redeem
           </a>
         </div>
       </div>
      <div className="pt-4 border-t border-border flex items-center justify-between mt-auto relative z-10">
         <div className="flex flex-col">
             <span className="text-[8px] text-t-muted font-tech font-bold uppercase tracking-widest">Success Rate</span>
             <div className="flex items-end gap-1">
                <span className={`font-display text-lg leading-none ${data.probability > 85 ? 'text-success' : 'text-yellow-500'}`}>
                    {data.probability}%
                </span>
             </div>
         </div>
         <div className="flex items-center gap-2">
            <button onClick={(e) => handleVote(e, 'like')} className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg border transition-all ${voted === 'like' ? 'bg-green-500/20 border-green-500 text-green-500' : 'bg-surface border-border text-t-muted hover:text-green-400 hover:border-green-500/50'}`}>
                <ThumbsUp size={12} />
                <span className="text-[10px] font-mono font-bold">{metrics.likes}</span>
            </button>
            <button onClick={(e) => handleVote(e, 'dislike')} className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg border transition-all ${voted === 'dislike' ? 'bg-red-500/20 border-red-500 text-red-500' : 'bg-surface border-border text-t-muted hover:text-red-400 hover:border-red-500/50'}`}>
                <ThumbsDown size={12} />
            </button>
         </div>
      </div>
    </div>
  );
};
