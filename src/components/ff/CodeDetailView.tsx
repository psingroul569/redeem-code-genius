import React, { useState } from 'react';
import { RedeemCode, AppView } from '@/types';
import { ArrowLeft, Copy, Check, Zap, Loader2, Send, History, ThumbsUp } from 'lucide-react';
import { Breadcrumbs } from './Breadcrumbs';
import { useComments, RealComment } from '@/hooks/useComments';
import { getDisplayName } from '@/lib/visitor';

export interface CodeDetailViewProps {
  code: RedeemCode;
  setView: (view: AppView) => void;
  lastSyncTime: number;
}

export const CodeDetailView: React.FC<CodeDetailViewProps> = ({ code, setView }) => {
  const [copied, setCopied] = useState(false);
  const [userComment, setUserComment] = useState("");
  const [userName, setUserName] = useState(() => getDisplayName() || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { comments, loading, addComment, toggleLike, likedIds, formatTimeAgo } = useComments(code);

  const handleCopy = () => {
    navigator.clipboard.writeText(code.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userComment.trim()) return;
    setIsSubmitting(true);
    await addComment(userComment.trim(), userName);
    setUserComment("");
    setIsSubmitting(false);
  };

  return (
    <div className="py-12">
      <div className="max-w-5xl mx-auto px-4">
        <Breadcrumbs paths={[{ label: 'Home', onClick: () => setView('home') }, { label: 'Redemption Engine', active: true }]} />
        <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-2xl mb-12">
          <div className="p-6 md:p-14 text-center border-b border-border bg-gradient-to-b from-success/5 to-transparent">
             <h2 className="font-display text-[clamp(1.5rem,5vw,3.5rem)] text-foreground uppercase italic tracking-tighter mb-8 leading-[1.1] text-glow">{code.reward}</h2>
             <div className="relative block w-full">
                <div onClick={handleCopy} className="relative flex flex-col md:flex-row items-center justify-between bg-surface border border-border p-4 md:p-8 rounded-2xl cursor-pointer hover:border-success/50 transition-all">
                   <div className="flex-1 w-full flex items-center justify-center overflow-hidden px-4">
                     <span className="font-mono text-[clamp(1.2rem,6vw,3.5rem)] font-black text-foreground tracking-[0.15em] uppercase break-all">{code.code}</span>
                   </div>
                   <button className={`flex items-center justify-center gap-3 font-tech font-bold uppercase tracking-widest text-xs md:text-sm px-8 py-4 rounded-xl transition-all ${copied ? 'bg-success text-success-foreground' : 'bg-primary text-primary-foreground'}`}>
                      {copied ? <Check size={20} /> : <Copy size={20} />}
                      {copied ? 'COPIED' : 'COPY CODE'}
                   </button>
                </div>
             </div>
          </div>
          <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border">
              <div className="md:col-span-2 p-8 md:p-12 bg-surface">
                <div className="flex items-center gap-4 mb-10 text-foreground">
                    <Zap size={24} className="text-success" />
                    <h3 className="text-2xl font-display uppercase italic tracking-tight">Redemption Protocol</h3>
                </div>
                <div className="space-y-12">
                    {[
                      { title: "Official Garena Site", desc: <>Visit <a href="https://reward.ff.garena.com" className="text-success font-bold" target="_blank" rel="noopener noreferrer">reward.ff.garena.com</a></> },
                      { title: "Identity Validation", desc: "Authenticate with your linked account (Google/FB/VK)." },
                      { title: "Code Injection", desc: `Inject code: ${code.code}` },
                      { title: "Reward Acquisition", desc: "Check in-game mail. Refresh node every 60m." }
                    ].map((step, idx) => (
                    <div key={idx} className="flex gap-8 group">
                        <div className="w-12 h-12 bg-muted border border-border rounded-2xl flex items-center justify-center text-muted-foreground font-display text-xl">{(idx + 1).toString().padStart(2, '0')}</div>
                        <div>
                            <h4 className="font-tech font-bold text-lg text-foreground mb-2 uppercase tracking-wide group-hover:text-success transition-colors">{step.title}</h4>
                            <p className="text-sm text-t-muted leading-relaxed">{step.desc}</p>
                        </div>
                    </div>
                    ))}
                </div>
              </div>
              <div className="p-8 bg-surface-elevated flex flex-col h-[750px]">
                 <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xs font-bold text-foreground uppercase tracking-widest flex items-center gap-2">
                        <History size={14} className="text-secondary"/> Community Log (Node: {code.server})
                    </h3>
                 </div>
                 <div className="space-y-4 flex-1 overflow-y-auto pr-2 no-scrollbar">
                    {loading ? (
                        <div className="flex items-center justify-center py-24">
                           <Loader2 size={20} className="animate-spin text-t-muted" />
                        </div>
                    ) : comments.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-24 text-center opacity-30 text-t-muted">
                           <History size={32} className="mb-4" />
                           <span className="text-[9px] font-tech uppercase tracking-widest">No reports yet — be the first.</span>
                        </div>
                    ) : (
                      comments.map((comment) => (
                          <CommentCard
                            key={comment.id}
                            comment={comment}
                            liked={likedIds.has(comment.id)}
                            onLike={() => toggleLike(comment.id)}
                            timeAgo={formatTimeAgo(comment.createdAt)}
                          />
                      ))
                    )}
                 </div>
                 <form onSubmit={handlePostComment} className="mt-6 pt-6 border-t border-border space-y-2">
                    <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} placeholder="Your name (optional)" maxLength={40} className="w-full bg-muted border border-border rounded-xl py-3 px-4 text-xs text-foreground focus:border-success outline-none transition-all" />
                    <div className="relative">
                      <input type="text" value={userComment} onChange={(e) => setUserComment(e.target.value)} placeholder="Did this code work for you?" maxLength={500} className="w-full bg-muted border border-border rounded-xl py-4 pl-4 pr-12 text-xs text-foreground focus:border-success outline-none transition-all" />
                      <button type="submit" disabled={isSubmitting || !userComment.trim()} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-success disabled:opacity-30">
                         {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                      </button>
                    </div>
                 </form>
              </div>
          </div>
        </div>
        <button onClick={() => setView('home')} className="mx-auto flex items-center gap-4 px-10 py-4 bg-primary text-primary-foreground rounded-full font-tech font-bold uppercase tracking-widest text-sm hover:bg-success transition-all shadow-2xl">
          <ArrowLeft size={18} /> BACK TO TERMINAL
        </button>
      </div>
    </div>
  );
};

const CommentCard: React.FC<{ comment: RealComment; liked: boolean; onLike: () => void; timeAgo: string }> = ({ comment, liked, onLike, timeAgo }) => {
  return (
    <div className={`bg-muted p-5 rounded-2xl border transition-all animate-fade-in ${comment.isOwn ? 'border-success/30' : 'border-border'}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-[10px] text-foreground bg-muted font-bold">{comment.displayName.charAt(0).toUpperCase()}</div>
          <div>
            <div className="text-xs font-bold text-foreground">{comment.displayName}</div>
            {comment.isOwn && <div className="text-[7px] text-t-muted uppercase tracking-widest">You</div>}
          </div>
        </div>
        <span className="text-[9px] text-t-muted font-mono italic">{timeAgo}</span>
      </div>
      <p className="text-xs text-t-body italic leading-relaxed mb-4">"{comment.text}"</p>
      <div className="flex items-center justify-end pt-3 border-t border-border">
        <button onClick={onLike} className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[9px] font-mono transition-all ${liked ? 'text-success bg-success-bg' : 'text-t-muted hover:text-foreground'}`}>
          <ThumbsUp size={10} />
          <span>{comment.likes}</span>
        </button>
      </div>
    </div>
  );
};
