import React, { useState, useEffect } from 'react';
import { analyzeCompetitorGap } from '../services/geminiService';
import { CompetitorData } from '../types';
import { DEFAULT_KEYWORD } from '../constants';

export const CompetitorView: React.FC = () => {
  const [keyword, setKeyword] = useState(DEFAULT_KEYWORD);
  const [loading, setLoading] = useState(false);
  const [competitors, setCompetitors] = useState<CompetitorData[]>([]);

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const data = await analyzeCompetitorGap(keyword);
      setCompetitors(data);
    } catch (e) {
      alert("Analysis failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-seo-card p-6 rounded-xl border border-slate-700">
        <h2 className="text-2xl font-bold mb-4 text-white flex items-center">
            <span className="mr-3">⚔️</span> Competitive Landscape Analysis
        </h2>
        <div className="flex gap-4">
            <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="flex-1 bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-seo-accent outline-none"
            />
            <button
                onClick={handleAnalyze}
                disabled={loading}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-bold transition-all disabled:opacity-50"
            >
                {loading ? 'Scanning SERPs...' : 'Identify Gaps'}
            </button>
        </div>
      </div>

      {competitors.length > 0 && (
        <div className="overflow-x-auto bg-seo-card rounded-xl border border-slate-700">
            <table className="w-full text-left text-sm text-slate-400">
                <thead className="bg-slate-900 text-xs uppercase font-medium text-slate-300">
                    <tr>
                        <th className="px-6 py-4">Rank</th>
                        <th className="px-6 py-4">Competitor Domain</th>
                        <th className="px-6 py-4">Auth (DA)</th>
                        <th className="px-6 py-4">Content Depth</th>
                        <th className="px-6 py-4">Backlinks</th>
                        <th className="px-6 py-4">Identified Gap (Opportunity)</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                    {competitors.map((comp, idx) => (
                        <tr key={idx} className="hover:bg-slate-800/50 transition-colors">
                            <td className="px-6 py-4 font-mono text-white">#{comp.rank}</td>
                            <td className="px-6 py-4">
                                <div className="font-bold text-white mb-1">{comp.domain}</div>
                                <div className="flex gap-1">
                                    {comp.schemaUsed.map(s => (
                                        <span key={s} className="px-1.5 py-0.5 bg-slate-800 text-[10px] rounded border border-slate-700">{s}</span>
                                    ))}
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                    <span className={`font-bold ${comp.da > 50 ? 'text-red-400' : 'text-green-400'}`}>{comp.da}</span>
                                    <div className="w-12 h-1 bg-slate-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-slate-500" style={{ width: `${comp.da}%` }}></div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4">{comp.wordCount} words</td>
                            <td className="px-6 py-4 text-blue-300">{comp.backlinks}</td>
                            <td className="px-6 py-4">
                                <span className="text-yellow-400 bg-yellow-900/10 border border-yellow-900/30 px-2 py-1 rounded text-xs">
                                    {comp.primaryGap}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      )}

      {competitors.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-seo-card p-6 rounded-xl border border-slate-700">
                  <h3 className="font-bold text-white mb-4">Backlink Acquisition Strategy</h3>
                  <p className="text-slate-400 text-sm mb-2">Based on the profiles above, target these sources:</p>
                  <ul className="list-disc list-inside text-sm text-slate-300 space-y-1">
                      <li>Gaming Forums (Reddit, Discord communities)</li>
                      <li>Tech News Aggregators (high overlap with top 3)</li>
                      <li>Localized gaming blogs (Indonesian/Brazilian servers)</li>
                  </ul>
              </div>
              <div className="bg-seo-card p-6 rounded-xl border border-slate-700">
                  <h3 className="font-bold text-white mb-4">Content Differentiation</h3>
                  <p className="text-slate-400 text-sm mb-2">Most competitors lack:</p>
                  <ul className="list-disc list-inside text-sm text-slate-300 space-y-1">
                      <li>Real-time "Code Verified" timestamps</li>
                      <li>Visual troubleshooting guides</li>
                      <li>Direct deep-links to the Garena redemption page</li>
                  </ul>
              </div>
          </div>
      )}
    </div>
  );
};