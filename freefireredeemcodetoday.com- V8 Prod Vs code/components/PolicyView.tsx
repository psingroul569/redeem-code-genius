
import React from 'react';
import { PolicyCheck, CompetitorDeepDive } from '../types';
import { CheckCircle, AlertTriangle, XCircle, ShieldCheck, Target, Zap } from 'lucide-react';

export const PolicyView: React.FC = () => {
  const policyChecks: PolicyCheck[] = [
    {
      id: 'e-e-a-t',
      name: 'EEAT Verification (Experience)',
      status: 'Pass',
      description: 'Site shows actual testing of codes with probability scores.',
      remedy: 'Already implemented via "Verified X mins ago" badge.'
    },
    {
      id: 'helpful-content',
      name: 'Helpful Content Intent',
      status: 'Pass',
      description: 'Primary intent (the code) is above the fold with region filters.',
      remedy: 'Keep ad-clutter low compared to Sportskeeda.'
    },
    {
      id: 'qdf-freshness',
      name: 'Freshness Signal (QDF)',
      status: 'Warning',
      description: 'Google needs to see hourly modification headers.',
      remedy: 'Implement dynamic dateModified in schema (Done).'
    }
  ];

  const competitors: CompetitorDeepDive[] = [
    {
      domain: 'sportskeeda.com',
      strengths: ['Massive Authority', 'High Backlinks'],
      weaknesses: ['Bad UX', 'Delayed Updates', 'Thin Content'],
      rankingStrategy: 'Use better UX and faster timestamps to win on Freshness.'
    },
    {
      domain: 'jagranjosh.com',
      strengths: ['Google News indexing'],
      weaknesses: ['Not Gaming Focused', 'Static Articles'],
      rankingStrategy: 'Out-rank by niche-relevance (Gaming utility vs News).'
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-white/5 border border-white/10 p-8 rounded-3xl">
        <h2 className="text-3xl font-display text-white uppercase italic mb-6 flex items-center gap-3">
          <ShieldCheck className="text-cyber-success" />
          GOOGLE POLICY COMPLIANCE
        </h2>
        <div className="grid gap-4">
          {policyChecks.map((check) => (
            <div key={check.id} className="bg-black/40 border border-white/5 p-6 rounded-2xl flex items-start gap-5">
              <div className="mt-1">
                {check.status === 'Pass' ? <CheckCircle className="text-cyber-success" size={24} /> : 
                 check.status === 'Warning' ? <AlertTriangle className="text-yellow-500" size={24} /> : 
                 <XCircle className="text-red-500" size={24} />}
              </div>
              <div className="flex-1">
                <h3 className="font-tech font-bold text-white uppercase tracking-wider">{check.name}</h3>
                <p className="text-sm text-white/40 mt-1">{check.description}</p>
                <div className="mt-3 text-[10px] font-tech text-cyber-success/70 uppercase tracking-widest bg-cyber-success/5 px-2 py-1 rounded-md inline-block">
                  FIX: {check.remedy}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white/5 border border-white/10 p-8 rounded-3xl">
          <h2 className="text-2xl font-display text-white uppercase italic mb-6 flex items-center gap-3">
            <Target className="text-red-500" />
            TOP 3 ELIMINATION PLAN
          </h2>
          <div className="space-y-6">
            {competitors.map((comp) => (
              <div key={comp.domain} className="border-b border-white/5 pb-6 last:border-0">
                <h3 className="text-xl font-display text-white/80 lowercase">{comp.domain}</h3>
                <div className="mt-3 grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[9px] font-tech text-white/20 uppercase font-bold tracking-widest">Weakness</span>
                    <ul className="text-xs text-red-400 mt-1">
                      {comp.weaknesses.map(w => <li key={w}>• {w}</li>)}
                    </ul>
                  </div>
                  <div>
                    <span className="text-[9px] font-tech text-white/20 uppercase font-bold tracking-widest">Our Attack</span>
                    <p className="text-[10px] text-white/50 mt-1 leading-relaxed">{comp.rankingStrategy}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 p-8 rounded-3xl flex flex-col">
          <h2 className="text-2xl font-display text-white uppercase italic mb-6 flex items-center gap-3">
            <Zap className="text-yellow-500" />
            WHY GOOGLE WILL RANK US
          </h2>
          <div className="flex-1 space-y-4">
             <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                <h4 className="text-white text-sm font-bold uppercase tracking-widest font-tech">1. Freshness Signal (QDF)</h4>
                <p className="text-[11px] text-white/40 mt-2">Our "Hourly Engine" sends a stronger freshness signal than competitors' daily static posts.</p>
             </div>
             <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                <h4 className="text-white text-sm font-bold uppercase tracking-widest font-tech">2. Transactional UX</h4>
                <p className="text-[11px] text-white/40 mt-2">Zero scroll-to-content. Google prioritizes pages that solve the user's problem instantly.</p>
             </div>
             <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                <h4 className="text-white text-sm font-bold uppercase tracking-widest font-tech">3. Niche Authority</h4>
                <p className="text-[11px] text-white/40 mt-2">Unlike general news sites, our entire domain footprint is dedicated to FF Rewards.</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};