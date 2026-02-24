import React, { useState } from 'react';
import { researchKeywords } from '../services/geminiService';
import { KeywordData } from '../types';
import { DEFAULT_KEYWORD } from '../constants';

export const KeywordView: React.FC = () => {
  const [seed, setSeed] = useState(DEFAULT_KEYWORD);
  const [loading, setLoading] = useState(false);
  const [keywords, setKeywords] = useState<KeywordData[]>([]);

  const handleResearch = async () => {
    setLoading(true);
    try {
      const data = await researchKeywords(seed);
      setKeywords(data);
    } catch (e) {
      alert("Research failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-seo-card p-6 rounded-xl border border-slate-700">
        <h2 className="text-2xl font-bold mb-4 text-white flex items-center">
            <span className="mr-3">🔑</span> Long-Tail Keyword Researcher
        </h2>
        <div className="flex gap-4">
            <input
                type="text"
                value={seed}
                onChange={(e) => setSeed(e.target.value)}
                className="flex-1 bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-seo-accent outline-none"
            />
            <button
                onClick={handleResearch}
                disabled={loading}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-bold transition-all disabled:opacity-50"
            >
                {loading ? 'Mining Data...' : 'Find Opportunities'}
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {keywords.map((k, idx) => (
            <div key={idx} className="bg-seo-card p-5 rounded-lg border border-slate-700 hover:border-seo-accent transition-all group">
                <div className="flex justify-between items-start mb-2">
                    <span className={`text-xs font-bold px-2 py-1 rounded uppercase ${
                        k.difficulty === 'Easy' ? 'bg-green-900/30 text-green-400' : 
                        k.difficulty === 'Medium' ? 'bg-yellow-900/30 text-yellow-400' : 'bg-red-900/30 text-red-400'
                    }`}>
                        {k.difficulty}
                    </span>
                    <span className="text-xs text-slate-500">{k.volume} Vol</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-seo-accent truncate" title={k.keyword}>
                    {k.keyword}
                </h3>
                <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>{k.intent}</span>
                    <span className="flex items-center gap-1">
                        Using: <span className="text-blue-400">{k.serpFeature}</span>
                    </span>
                </div>
            </div>
        ))}
      </div>
      
      {keywords.length === 0 && !loading && (
          <div className="text-center py-20 text-slate-500 bg-slate-900/20 rounded-xl border border-dashed border-slate-800">
              <p>Enter a seed keyword to find low-competition, high-value ranking opportunities.</p>
          </div>
      )}
    </div>
  );
};