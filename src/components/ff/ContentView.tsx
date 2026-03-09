import React from 'react';
import { ARTICLES } from '@/constants';
import { AppView } from '@/types';
import { Breadcrumbs } from './Breadcrumbs';
import { MasterGuide } from './MasterGuide';
import { BlogCluster } from './BlogCluster';

interface ContentViewProps {
  currentView: AppView;
  setView: (view: AppView) => void;
  selectedArticleId: string | null;
  setSelectedArticleId: (id: string | null) => void;
}

export const ContentView: React.FC<ContentViewProps> = ({ currentView, setView, selectedArticleId, setSelectedArticleId }) => {
  if (currentView === 'article' && selectedArticleId === 'master-guide') {
    return (
      <div className="py-12">
        <div className="max-w-5xl mx-auto px-4">
          <Breadcrumbs paths={[{ label: 'Content', onClick: () => setView('content') }, { label: 'Master Guide', active: true }]} />
          <MasterGuide />
        </div>
      </div>
    );
  }

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4">
        <Breadcrumbs paths={[{ label: 'Content', active: true }]} />
        <div className="mb-16">
          <div className="text-t-muted font-tech text-sm tracking-[0.2em] uppercase mb-2">Knowledge Base</div>
          <h2 className="text-4xl md:text-5xl font-display text-foreground uppercase italic">
            Educational <span className="text-t-muted">Resource Hub</span>
          </h2>
          <p className="text-t-muted mt-4 max-w-2xl">Access the world's most comprehensive library for Garena Free Fire reward systems, technical guides, and real-time data analysis.</p>
        </div>
        <div 
          onClick={() => { setSelectedArticleId('master-guide'); setView('article'); }}
          className="mb-12 bg-card border border-border p-8 rounded-xl cursor-pointer hover:border-foreground/50 transition-all group overflow-hidden relative"
        >
          <div className="absolute top-0 right-0 p-4 font-tech text-[10px] text-t-muted border-l border-b border-border">FEATURED_PILLAR</div>
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
              <svg className="w-10 h-10 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
            </div>
            <div>
              <h3 className="text-2xl md:text-3xl font-display text-foreground mb-2 group-hover:text-success transition-colors">THE ULTIMATE MASTER GUIDE (2025)</h3>
              <p className="text-t-muted mb-4">Deep dive into Garena's reward infrastructure, historical success rates, and advanced redemption techniques for all servers.</p>
              <span className="text-success font-tech uppercase tracking-widest text-xs border-b border-success">Begin Reading Archive →</span>
            </div>
          </div>
        </div>
        <BlogCluster />
      </div>
    </div>
  );
};
