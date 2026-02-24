import React, { useState } from 'react';

export const SchemaBuilder: React.FC = () => {
  const [faqs, setFaqs] = useState<{ q: string; a: string }[]>([
    { q: "How to redeem Free Fire codes today?", a: "Visit the official reward redemption site, login via Facebook or Google, and enter the 12-digit alphanumeric code." },
    { q: "What is the redeem code for today?", a: "Today's active codes are often released at 12:00 PM IST. Check our daily updated table for the latest working codes." }
  ]);

  const addFaq = () => setFaqs([...faqs, { q: "", a: "" }]);
  
  const updateFaq = (index: number, field: 'q' | 'a', value: string) => {
    const newFaqs = [...faqs];
    newFaqs[index][field] = value;
    setFaqs(newFaqs);
  };

  const removeFaq = (index: number) => {
    setFaqs(faqs.filter((_, i) => i !== index));
  };

  const generateJsonLd = () => {
    const schema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqs.map(faq => ({
        "@type": "Question",
        "name": faq.q,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.a
        }
      }))
    };
    return JSON.stringify(schema, null, 2);
  };

  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(generateJsonLd());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
      <div className="bg-seo-card p-6 rounded-xl border border-slate-700 flex flex-col">
        <h2 className="text-xl font-bold mb-4 flex justify-between items-center">
            <span>FAQ Schema Generator</span>
            <button onClick={addFaq} className="text-xs bg-seo-accent px-3 py-1 rounded text-white hover:bg-blue-600">
                + Add Question
            </button>
        </h2>
        <div className="flex-1 overflow-y-auto space-y-4 pr-2 max-h-[600px]">
            {faqs.map((faq, idx) => (
                <div key={idx} className="bg-slate-900 p-4 rounded border border-slate-800 relative group">
                    <button 
                        onClick={() => removeFaq(idx)}
                        className="absolute top-2 right-2 text-slate-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        🗑️
                    </button>
                    <div className="mb-2">
                        <label className="text-xs text-slate-500 uppercase font-bold">Question</label>
                        <input 
                            value={faq.q}
                            onChange={(e) => updateFaq(idx, 'q', e.target.value)}
                            className="w-full bg-transparent border-b border-slate-700 focus:border-seo-accent outline-none py-1 text-white"
                            placeholder="e.g. Is Free Fire safe?"
                        />
                    </div>
                    <div>
                        <label className="text-xs text-slate-500 uppercase font-bold">Answer</label>
                        <textarea 
                            value={faq.a}
                            onChange={(e) => updateFaq(idx, 'a', e.target.value)}
                            className="w-full bg-transparent border-b border-slate-700 focus:border-seo-accent outline-none py-1 text-slate-300 min-h-[60px]"
                            placeholder="Brief answer..."
                        />
                    </div>
                </div>
            ))}
        </div>
      </div>

      <div className="bg-[#1e1e1e] p-6 rounded-xl border border-slate-700 flex flex-col font-mono text-sm">
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-slate-400 font-sans font-bold">JSON-LD Output</h3>
            <button 
                onClick={handleCopy}
                className={`px-4 py-2 rounded text-xs font-sans font-bold transition-all ${copied ? 'bg-green-500 text-white' : 'bg-slate-700 hover:bg-slate-600 text-white'}`}
            >
                {copied ? 'Copied!' : 'Copy Code'}
            </button>
        </div>
        <pre className="flex-1 overflow-auto text-green-400 bg-black/30 p-4 rounded-lg">
            {generateJsonLd()}
        </pre>
        <p className="mt-4 text-xs text-slate-500 font-sans">
            Paste this code into the <code className="bg-slate-800 px-1 rounded">&lt;head&gt;</code> or <code className="bg-slate-800 px-1 rounded">&lt;body&gt;</code> of your post. Google loves structured data for Q&A queries.
        </p>
      </div>
    </div>
  );
};
