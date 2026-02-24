import React, { useState, useEffect } from 'react';
import { RedeemCode, AppView, Comment } from '@/types';
import { ArrowLeft, Copy, Check, Zap, Loader2, Send, History } from 'lucide-react';
import { Breadcrumbs } from './Breadcrumbs';
import { storageService } from '@/services/storageService';
import { MOCK_COMMENTS } from '@/constants';

export interface CodeDetailViewProps {
  code: RedeemCode;
  setView: (view: AppView) => void;
  lastSyncTime: number;
}

interface EnhancedComment extends Comment {
  isHelpful?: boolean;
  helpfulCount?: number;
  isVisitor?: boolean;
}

export const CodeDetailView: React.FC<CodeDetailViewProps> = ({ code, setView }) => {
  const [copied, setCopied] = useState(false);
  const [loadingComments, setLoadingComments] = useState(true);
  const [allComments, setAllComments] = useState<EnhancedComment[]>([]);
  const [userComment, setUserComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadComments = async () => {
      setLoadingComments(true);
      try {
        const visitorData = await storageService.getComments(code.code);
        const combined = [
          ...visitorData.map(v => ({ ...v, isVisitor: true })),
          ...MOCK_COMMENTS.map(m => ({ ...m, isVisitor: false }))
        ];
        setAllComments(combined);
      } catch (err) {
        console.error("Error loading comments:", err);
      } finally {
        setLoadingComments(false);
      }
    };
    loadComments();
  }, [code]);

  const handleCopy = () => {
    navigator.clipboard.writeText(code.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userComment.trim()) return;
    setIsSubmitting(true);
    const newEntry: Comment = {
      id: `user-${Date.now()}`,
      user: 'Elite_Survivor',
      avatar: `https://i.pravatar.cc/100?u=visitor-${Date.now()}`,
      text: userComment,
      timeAgo: "Just now",
      verified: true
    };
    if (await storageService.saveComment(code.code, newEntry)) {
      setAllComments(prev => [{ ...newEntry, isVisitor: true }, ...prev]);
      setUserComment("");
    }
    setIsSubmitting(false);
  };

  return (
    <div className="py-12">
      <div className="max-w-5xl mx-auto px-4">
        <Breadcrumbs paths={[{ label: 'Home', onClick: () => setView('home') }, { label: 'Redemption Engine', active: true }]} />
        <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl overflow-hidden shadow-2xl mb-12">
          <div className="p-6 md:p-14 text-center border-b border-white/5 bg-gradient-to-b from-cyber-success/5 to-transparent">
             <h2 className="font-display text-[clamp(1.5rem,5vw,3.5rem)] text-white uppercase italic tracking-tighter mb-8 leading-[1.1] text-glow">{code.reward}</h2>
             <div className="relative block w-full">
                <div onClick={handleCopy} className="relative flex flex-col md:flex-row items-center justify-between bg-black border border-white/10 p-4 md:p-8 rounded-2xl cursor-pointer hover:border-cyber-success/50 transition-all">
                   <div className="flex-1 w-full flex items-center justify-center overflow-hidden px-4">
                     <span className="font-mono text-[clamp(1.2rem,6vw,3.5rem)] font-black text-white tracking-[0.15em] uppercase break-all">{code.code}</span>
                   </div>
                   <button className={`flex items-center justify-center gap-3 font-tech font-bold uppercase tracking-widest text-xs md:text-sm px-8 py-4 rounded-xl transition-all ${copied ? 'bg-cyber-success text-black' : 'bg-white text-black'}`}>
                      {copied ? <Check size={20} /> : <Copy size={20} />}
                      {copied ? 'COPIED' : 'COPY CODE'}
                   </button>
                </div>
             </div>
          </div>
          <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/5">
              <div className="md:col-span-2 p-8 md:p-12 bg-black">
                <div className="flex items-center gap-4 mb-10 text-white">
                    <Zap size={24} className="text-cyber-success" />
                    <h3 className="text-2xl font-display uppercase italic tracking-tight">Redemption Protocol</h3>
                </div>
                <div className="space-y-12">
                    {[
                      { title: "Official Garena Site", desc: <>Visit <a href="https://reward.ff.garena.com" className="text-cyber-success font-bold" target="_blank" rel="noopener noreferrer">reward.ff.garena.com</a></> },
                      { title: "Identity Validation", desc: "Authenticate with your linked account (Google/FB/VK)." },
                      { title: "Code Injection", desc: `Inject code: ${code.code}` },
                      { title: "Reward Acquisition", desc: "Check in-game mail. Refresh node every 60m." }
                    ].map((step, idx) => (
                    <div key={idx} className="flex gap-8 group">
                        <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-white/10 font-display text-xl">{(idx + 1).toString().padStart(2, '0')}</div>
                        <div>
                            <h4 className="font-tech font-bold text-lg text-white mb-2 uppercase tracking-wide group-hover:text-cyber-success transition-colors">{step.title}</h4>
                            <p className="text-sm text-white/40 leading-relaxed">{step.desc}</p>
                        </div>
                    </div>
                    ))}
                </div>
              </div>
              <div className="p-8 bg-[#030303] flex flex-col h-[750px]">
                 <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2">
                        <History size={14} className="text-purple-400"/> Community Log (Node: {code.server})
                    </h3>
                 </div>
                 <div className="space-y-4 flex-1 overflow-y-auto pr-2 no-scrollbar">
                    {loadingComments ? (
                      <div className="flex flex-col items-center justify-center py-24 text-center opacity-30">
                         <Loader2 className="animate-spin mb-4 text-white" />
                         <span className="text-[10px] font-tech uppercase tracking-widest text-white">Loading Logs...</span>
                      </div>
                    ) : allComments.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-24 text-center opacity-30 text-white">
                           <History size={32} className="mb-4" />
                           <span className="text-[9px] font-tech uppercase tracking-widest">No reports available.</span>
                        </div>
                    ) : (
                      allComments.map((comment) => (
                          <div key={comment.id} className={`bg-white/5 p-5 rounded-2xl border transition-all animate-fade-in ${comment.isVisitor ? 'border-cyber-success/30' : 'border-white/5'}`}>
                              <div className="flex items-center justify-between mb-3">
                                  <div className="flex items-center gap-3">
                                      <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-[10px] text-white bg-white/5">{comment.user.charAt(0)}</div>
                                      <div><div className="text-xs font-bold text-white">{comment.user}</div><div className="text-[7px] text-white/20 uppercase tracking-widest">{comment.isVisitor ? 'Visitor' : 'Community User'}</div></div>
                                  </div>
                                  <span className="text-[9px] text-white/20 font-mono italic">{comment.timeAgo}</span>
                              </div>
                              <p className="text-xs text-white/70 italic leading-relaxed mb-4">"{comment.text}"</p>
                              <div className="flex items-center justify-between pt-3 border-t border-white/5">
                                  <div className="flex items-center gap-1.5 text-cyber-success text-[8px] font-bold uppercase">
                                      {comment.verified && <><Check size={8} /> Claimed</>}
                                  </div>
                              </div>
                          </div>
                      ))
                    )}
                 </div>
                 <form onSubmit={handlePostComment} className="mt-6 pt-6 border-t border-white/10 relative">
                    <input type="text" value={userComment} onChange={(e) => setUserComment(e.target.value)} placeholder="Report status..." className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-4 pr-12 text-xs text-white focus:border-cyber-success outline-none transition-all" />
                    <button type="submit" disabled={isSubmitting || !userComment.trim()} className="absolute right-2 top-8 p-2 text-cyber-success disabled:opacity-30">
                       {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                    </button>
                 </form>
              </div>
          </div>
        </div>
        <button onClick={() => setView('home')} className="mx-auto flex items-center gap-4 px-10 py-4 bg-white text-black rounded-full font-tech font-bold uppercase tracking-widest text-sm hover:bg-cyber-success transition-all shadow-2xl">
          <ArrowLeft size={18} /> BACK TO TERMINAL
        </button>
      </div>
    </div>
  );
};
