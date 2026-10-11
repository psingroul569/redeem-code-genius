import React, { useState } from 'react';
import { RedeemCode } from '@/types';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { getVisitorId } from '@/lib/visitor';

interface Props {
  data: RedeemCode & { lastTested?: string };
  onSelect: () => void;
}

export const CodeCard: React.FC<Props> = ({ data, onSelect }) => {
  const [copied, setCopied] = useState(false);
  const [voted, setVoted] = useState<'like' | 'dislike' | null>(
    () => (data.id ? (localStorage.getItem(`ff-vote:${data.id}`) as 'like' | 'dislike' | null) : null),
  );

  const [metrics, setMetrics] = useState(() => ({
    likes: data.likes ?? 0,
    dislikes: data.dislikes ?? 0
  }));

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (data.status === 'Expired') return;
    navigator.clipboard.writeText(data.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleVote = async (e: React.MouseEvent, type: 'like' | 'dislike') => {
    e.stopPropagation();
    if (!data.id) return; // placeholder/mock code with no DB row — nothing to vote on

    const previous = voted;
    const previousMetrics = metrics;
    const nextVoted = previous === type ? null : type;

    // Optimistic UI update
    setMetrics(prev => {
      const updates = { ...prev };
      if (previous) updates[previous === 'like' ? 'likes' : 'dislikes'] = Math.max(0, updates[previous === 'like' ? 'likes' : 'dislikes'] - 1);
      if (nextVoted) updates[nextVoted === 'like' ? 'likes' : 'dislikes'] += 1;
      return updates;
    });
    setVoted(nextVoted);
    if (nextVoted) localStorage.setItem(`ff-vote:${data.id}`, nextVoted);
    else localStorage.removeItem(`ff-vote:${data.id}`);

    const { data: result, error } = await supabase.rpc('cast_code_vote' as never, {
      p_code_id: data.id,
      p_visitor_id: getVisitorId(),
      p_reaction: type,
    } as never);

    if (error) {
      // Roll back — RPC not deployed yet, or the request failed.
      setMetrics(previousMetrics);
      setVoted(previous);
      if (previous) localStorage.setItem(`ff-vote:${data.id}`, previous);
      else localStorage.removeItem(`ff-vote:${data.id}`);
      return;
    }

    const row = Array.isArray(result) ? result[0] : result;
    if (row) setMetrics({ likes: row.likes, dislikes: row.dislikes });
  };

  const isExpired = data.status === 'Expired';
  const isLimited = data.status === 'Limited';

  const codeUrl = `/code/${data.slug}`;

  const handleOpen = (e: React.MouseEvent) => {
    if (isExpired) {
      e.preventDefault();
      return;
    }
    onSelect();
  };

  return (
    <article
      className={`group relative bg-card border border-border hover:border-success/20 transition-all duration-300 rounded-2xl p-5 overflow-hidden flex flex-col h-full shadow-lg hover:shadow-success/5 ${isExpired ? 'opacity-40 grayscale pointer-events-none' : ''}`}
    >
      {/* Stretched link: makes the whole card a real, crawlable <a href>, while
          the interactive controls below (copy, vote, external Redeem link) sit
          above it at z-10 and intercept their own clicks — avoids nesting an
          <a> inside an <a>, which is invalid HTML and breaks link behavior. */}
      <Link
        to={codeUrl}
        onClick={handleOpen}
        aria-disabled={isExpired}
        tabIndex={isExpired ? -1 : 0}
        aria-label={`View details for ${data.code} — ${data.reward}`}
        className="absolute inset-0 z-0 rounded-2xl cursor-pointer"
      />
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
              <span aria-hidden="true">✓</span> Verified {data.lastTested || 'Tested Now'}
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
            <button onClick={handleCopy} aria-label="Copy code" className={`ml-2 min-h-[44px] px-3 py-1.5 rounded-lg text-[9px] font-bold font-tech uppercase tracking-widest transition-all ${copied ? 'bg-success text-success-bg' : 'bg-surface-hover text-foreground hover:bg-muted'}`}>
                {copied ? 'DONE' : 'COPY'}
            </button>
        </div>
      </div>
      <div className="flex items-start gap-3 mb-4 flex-1 relative z-10">
        <div className="w-10 h-10 bg-surface rounded-xl flex items-center justify-center flex-shrink-0 border border-border text-lg group-hover:bg-surface-hover transition-all" aria-hidden="true">
          {data.category === 'Diamond' ? '💎' : data.category === 'Skin' ? '🔫' : data.category === 'Bundle' ? '👕' : data.category === 'Pet' ? '🐾' : '🎁'}
        </div>
        <div>
           <span className="text-[9px] text-success font-tech font-bold uppercase tracking-widest">{data.category || 'Voucher'}</span>
           <p className="text-sm text-foreground font-bold leading-tight group-hover:text-success transition-colors">{data.reward}</p>
           <p className="text-[10px] text-t-muted mt-1 line-clamp-1">{data.description || 'Global Garena Rewards Server'}</p>
        </div>
      </div>
      <div className="mb-4 pt-4 border-t border-border relative z-10">
        <div className="flex items-center justify-between mb-2">
           <span className="text-[9px] text-t-muted font-tech uppercase font-bold tracking-widest">Verification Source</span>
           <span className="text-[8px] text-success/50 font-mono">{data.lastTested || 'Checked hourly'}</span>
        </div>
         <div className="flex items-center justify-between gap-2">
           <div className="flex flex-wrap gap-1.5">
              {data.citations && data.citations.length > 0 ? (
                data.citations.slice(0, 2).map((cite, i) => (
                   <div key={i} className="flex items-center gap-1.5 px-2 py-1 bg-surface border border-border rounded text-[8px] text-t-muted max-w-[120px]">
                       <span aria-hidden="true">↗</span> <span className="truncate">{cite.title}</span>
                   </div>
                ))
              ) : (
                <div className="flex items-center gap-1.5 px-2 py-1 bg-success-bg border border-success-border rounded text-[8px] text-success/60">
                    <span aria-hidden="true">✓</span> Garena Official News
                </div>
              )}
           </div>
           <a
             href="https://reward.ff.garena.com/"
             target="_blank"
             rel="noopener noreferrer"
             aria-label={`Redeem ${data.code} on the official Garena rewards site`}
             onClick={(e) => e.stopPropagation()}
             className="flex-shrink-0 min-h-[44px] flex items-center px-3 py-1.5 rounded-lg bg-success text-success-bg font-tech text-[8px] font-bold uppercase tracking-widest hover:brightness-110 transition-all"
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
             <button type="button" aria-label="Like this code" aria-pressed={voted === 'like'} onClick={(e) => handleVote(e, 'like')} className={`flex items-center justify-center gap-1.5 min-h-[44px] min-w-[44px] px-2 py-1.5 rounded-lg border transition-all ${voted === 'like' ? 'bg-green-500/20 border-green-500 text-green-500' : 'bg-surface border-border text-t-muted hover:text-green-400 hover:border-green-500/50'}`}>
                  <span aria-hidden="true">👍</span>
                 <span className="text-[10px] font-mono font-bold">{metrics.likes}</span>
             </button>
             <button type="button" aria-label="Dislike this code" aria-pressed={voted === 'dislike'} onClick={(e) => handleVote(e, 'dislike')} className={`flex items-center justify-center min-h-[44px] min-w-[44px] px-2 py-1.5 rounded-lg border transition-all ${voted === 'dislike' ? 'bg-red-500/20 border-red-500 text-red-500' : 'bg-surface border-border text-t-muted hover:text-red-400 hover:border-red-500/50'}`}>
                  <span aria-hidden="true">👎</span>
             </button>
         </div>
      </div>
    </article>
  );
};
