import React, { useState } from 'react';
import { performSiteAudit } from '../services/geminiService';
import { AuditResult } from '../types';
import { DEFAULT_KEYWORD, DEFAULT_URL } from '../constants';

export const AuditView: React.FC = () => {
  const [url, setUrl] = useState(DEFAULT_URL);
  const [keyword, setKeyword] = useState(DEFAULT_KEYWORD);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AuditResult | null>(null);

  const handleAudit = async () => {
    setLoading(true);
    try {
      const data = await performSiteAudit(url, keyword);
      setResult(data);
    } catch (e) {
      alert("Audit failed. Please check console or try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-seo-card p-6 rounded-xl border border-slate-700 shadow-xl">
        <h2 className="text-2xl font-bold mb-4 flex items-center">
            <span className="mr-2">🔍</span> Deep SEO Audit
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Target URL</label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-seo-accent focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Target Keyword</label>
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-seo-accent focus:outline-none"
            />
          </div>
        </div>
        <button
          onClick={handleAudit}
          disabled={loading}
          className={`w-full py-3 rounded-lg font-bold text-white transition-all ${
            loading
              ? 'bg-slate-700 cursor-not-allowed'
              : 'bg-seo-accent hover:bg-blue-600 shadow-lg shadow-blue-900/50'
          }`}
        >
          {loading ? 'Analyzing SERP & Technicals...' : 'Run Deep Analysis'}
        </button>
      </div>

      {result && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
          {/* Score Card */}
          <div className="lg:col-span-1 bg-seo-card p-6 rounded-xl border border-slate-700 flex flex-col items-center justify-center text-center">
            <div className="relative w-32 h-32 flex items-center justify-center mb-4">
              <svg className="transform -rotate-90 w-32 h-32">
                <circle cx="64" cy="64" r="60" stroke="#334155" strokeWidth="8" fill="transparent" />
                <circle
                  cx="64"
                  cy="64"
                  r="60"
                  stroke={result.score > 80 ? '#10b981' : result.score > 50 ? '#f59e0b' : '#ef4444'}
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={377}
                  strokeDashoffset={377 - (377 * result.score) / 100}
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <span className="absolute text-4xl font-bold">{result.score}</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">SEO Health Score</h3>
            <p className="text-sm text-slate-400">{result.summary}</p>
          </div>

          {/* Critical Issues */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-seo-card p-6 rounded-xl border border-slate-700">
              <h3 className="text-lg font-semibold text-seo-danger mb-4 flex items-center">
                Technical Blockers
              </h3>
              <ul className="space-y-2">
                {result.technicalIssues.map((issue, idx) => (
                  <li key={idx} className="flex items-start space-x-2 text-slate-300">
                    <span className="text-seo-danger mt-1">✖</span>
                    <span>{issue}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-seo-card p-6 rounded-xl border border-slate-700">
              <h3 className="text-lg font-semibold text-seo-warning mb-4 flex items-center">
                Content Gaps vs Top 3
              </h3>
              <ul className="space-y-2">
                {result.contentGaps.map((gap, idx) => (
                  <li key={idx} className="flex items-start space-x-2 text-slate-300">
                    <span className="text-seo-warning mt-1">⚠</span>
                    <span>{gap}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Action Plan */}
          <div className="lg:col-span-3 bg-slate-900 p-6 rounded-xl border border-slate-800">
            <h3 className="text-xl font-bold mb-6 text-white">🚀 Priority Action Plan</h3>
            <div className="space-y-4">
              {result.actionPlan.map((action, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-seo-card rounded-lg border border-slate-700 hover:border-seo-accent transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-1">
                      <span className={`px-2 py-0.5 text-xs font-bold rounded ${
                        action.priority === 'High' ? 'bg-red-900/50 text-red-400 border border-red-800' :
                        action.priority === 'Medium' ? 'bg-orange-900/50 text-orange-400 border border-orange-800' :
                        'bg-blue-900/50 text-blue-400 border border-blue-800'
                      }`}>
                        {action.priority}
                      </span>
                      <h4 className="font-semibold text-white">{action.task}</h4>
                    </div>
                    <p className="text-sm text-slate-400">Impact: {action.impact}</p>
                  </div>
                  <button className="text-sm bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded text-white border border-slate-600">
                    Fix Now
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
