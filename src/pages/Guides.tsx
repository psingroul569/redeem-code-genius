import React, { useState, Suspense } from 'react';
import { Header } from '@/components/ff/Header';
import { Footer } from '@/components/ff/Footer';
import { useTheme } from '@/hooks/useTheme';
import { AppView } from '@/types';
import { Loader2 } from 'lucide-react';

const ContentView = React.lazy(() => import('@/components/ff/ContentView').then((m) => ({ default: m.ContentView })));
const CodeDetailView = React.lazy(() => import('@/components/ff/CodeDetailView').then((m) => ({ default: m.CodeDetailView })));

const Guides = () => {
  const { theme, toggleTheme } = useTheme();
  const [currentView, setCurrentView] = useState<AppView>('content');
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background text-foreground font-tech">
      <Header theme={theme} onToggleTheme={toggleTheme} />
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        <Suspense fallback={<div className="flex items-center justify-center min-h-[50vh]"><Loader2 className="animate-spin text-foreground" /></div>}>
          <ContentView
            currentView={currentView}
            setView={setCurrentView}
            selectedArticleId={selectedArticleId}
            setSelectedArticleId={setSelectedArticleId}
          />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
};

export default Guides;
