import React, { useState } from 'react';
import { generateDailyContent } from '../services/geminiService';
import { ContentStrategy } from '../types';
import { DEFAULT_KEYWORD } from '../constants';

export const StrategyView: React.FC = () => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [keyword, setKeyword] = useState(DEFAULT_KEYWORD);
  const [loading, setLoading] = useState(false);
  const [strategy, setStrategy] = useState<ContentStrategy | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const data = await generateDailyContent(date, keyword);
      setStrategy(data);
    } catch (e) {
      alert("Generation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-8 rounded-xl border border-slate-700">
        <div className="max-w-2xl">
            <h2 className="text-3xl font-bold mb-4 text-white">Daily Content Generator</h2>
            <p className="text-slate-400 mb-6">
            For "Free Fire Redeem Code", freshness is the #1 ranking factor. Use this tool every morning to generate the perfect blog post structure that satisfies the QDF algorithm.
            </p>
            
            <div className="flex flex-col md:flex-row gap-4 mb-6">
            <input 
                type="date" 
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="bg-black/30 border border-slate-600 rounded-lg p-3 text-white focus:border-seo-accent outline-none"
            />
            <input 
                type="text" 
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="flex-1 bg-black/30 border border-slate-600 rounded-lg p-3 text-white focus:border-seo-accent outline-none"
            />
            <button
                onClick={handleGenerate}
                disabled={loading}
                className="bg-seo-success hover:bg-emerald-600 text-white px-6 py-3 rounded-lg font-bold shadow-lg shadow-emerald-900/50 transition-all disabled:opacity-50"
            >
                {loading ? 'Generating...' : 'Generate Strategy'}
            </button>
            </div>
        </div>
      </div>

      {strategy && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
          <div className="bg-seo-card p-6 rounded-xl border border-slate-700">
            <h3 className="text-sm uppercase tracking-wider text-seo-muted mb-2">Target Title Tag</h3>
            <div className="bg-black/40 p-4 rounded border border-slate-600 mb-4">
              <p className="text-xl font-bold text-blue-400">{strategy.title}</p>
            </div>
            
            <h3 className="text-sm uppercase tracking-wider text-seo-muted mb-2">Meta Description</h3>
            <div className="bg-black/40 p-4 rounded border border-slate-600">
              <p className="text-slate-300">{strategy.metaDescription}</p>
            </div>
          </div>

          <div className="bg-seo-card p-6 rounded-xl border border-slate-700">
            <h3 className="text-sm uppercase tracking-wider text-seo-muted mb-2">The "Hook" (First 100 Words)</h3>
            <div className="bg-black/40 p-4 rounded border border-slate-600 h-full">
              <p className="text-slate-300 italic">"{strategy.hook}"</p>
            </div>
          </div>

          <div className="lg:col-span-2 bg-seo-card p-6 rounded-xl border border-slate-700">
            <h3 className="text-xl font-bold mb-4 border-b border-slate-700 pb-2">Content Structure (H-Tags)</h3>
            <div className="space-y-4">
                <div className="flex items-center">
                    <span className="w-12 text-sm font-mono text-seo-accent">H1</span>
                    <span className="font-bold text-lg">{strategy.h1}</span>
                </div>
                {strategy.h2s.map((h2, idx) => (
                    <div key={idx} className="flex items-center ml-4">
                        <span className="w-12 text-sm font-mono text-slate-500">H2</span>
                        <span className="text-slate-200">{h2}</span>
                    </div>
                ))}
            </div>
          </div>
          
           <div className="lg:col-span-2 bg-seo-card p-6 rounded-xl border border-slate-700">
            <h3 className="text-xl font-bold mb-4">LSI Keywords to Include</h3>
            <div className="flex flex-wrap gap-2">
                {strategy.keyPhrases.map((phrase, idx) => (
                    <span key={idx} className="px-3 py-1 bg-slate-800 rounded-full text-sm text-slate-300 border border-slate-600">
                        {phrase}
                    </span>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
