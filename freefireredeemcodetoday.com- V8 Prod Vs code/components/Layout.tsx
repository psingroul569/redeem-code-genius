
import React from 'react';
import { NAVIGATION_ITEMS } from '../constants';
import { AppView } from '../types';

interface LayoutProps {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ currentView, setCurrentView, children }) => {
  return (
    <div className="min-h-screen bg-black flex text-white font-tech">
      {/* Sidebar */}
      <aside className="w-64 bg-black border-r border-white/10 hidden md:flex flex-col fixed h-full z-10">
        <div className="p-8 border-b border-white/10">
          <h1 className="text-xl font-display italic text-white tracking-tighter">
            FFREDEEM <span className="text-white/20">SEO</span>
          </h1>
          <p className="text-[9px] text-white/30 mt-1 uppercase tracking-widest font-bold">Protocol v4.0</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {NAVIGATION_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id as AppView)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 uppercase font-bold text-[10px] tracking-widest ${
                currentView === item.id
                  ? 'bg-white text-black shadow-lg shadow-white/5'
                  : 'hover:bg-white/5 text-white/40 hover:text-white'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="p-6 border-t border-white/10">
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 rounded-full bg-cyber-success animate-pulse"></div>
            <span className="text-[10px] text-white/40 uppercase font-bold tracking-widest">Engine Syncing...</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-4 md:p-12 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
            {children}
        </div>
      </main>
      
      {/* Mobile Nav (Bottom) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur border-t border-white/10 flex justify-around p-3 z-50">
           {NAVIGATION_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id as AppView)}
              className={`flex flex-col items-center p-2 rounded-lg transition-all ${
                currentView === item.id ? 'text-white scale-110' : 'text-white/30'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
            </button>
          ))}
      </div>
    </div>
  );
};