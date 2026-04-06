import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQ: React.FC<{ q: string; a: string }> = ({ q, a }) => {
  const [open, setOpen] = useState(false);
  return (
    <div itemScope itemProp="mainEntity" itemType="https://schema.org/Question" className="border border-border rounded-xl overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-5 py-3.5 text-left bg-card hover:bg-muted/50 transition-colors">
        <span className="font-tech text-sm font-bold text-foreground pr-4" itemProp="name">{q}</span>
        {open ? <ChevronUp size={16} className="text-success shrink-0" /> : <ChevronDown size={16} className="text-t-muted shrink-0" />}
      </button>
      <div className={`${open ? '' : 'hidden'} px-5 py-3.5 bg-muted/30 border-t border-border`} itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
        <p className="text-sm text-t-body leading-relaxed" itemProp="text">{a}</p>
      </div>
    </div>
  );
};

const STEPS = [
  { n: '1', title: 'Copy the Code', text: 'Pick an active code from the list above and tap the copy button.' },
  { n: '2', title: 'Open Rewards Site', text: 'Go to reward.ff.garena.com — this is the only official redemption page.' },
  { n: '3', title: 'Log In', text: 'Sign in with Facebook, Google, Apple ID, Twitter, or VK. Guest accounts cannot redeem codes.' },
  { n: '4', title: 'Paste & Confirm', text: 'Enter the 12-character code and hit Confirm. A success message appears if the code is valid.' },
  { n: '5', title: 'Collect Rewards', text: 'Open Free Fire → go to Mail section. Rewards arrive within 30 minutes (up to 24 hours max).' },
];

const ERRORS: { msg: string; fix: string }[] = [
  { msg: 'Code is invalid or expired', fix: 'The code has passed its expiry window (usually 12–18 hours). Use a fresh code from our updated list.' },
  { msg: 'Redemption limit reached', fix: 'The code hit its global claim cap. Try another active code — we update hourly.' },
  { msg: 'Not available for your region', fix: 'This code is server-specific. Switch to your region using the filter at the top of this page.' },
  { msg: 'Failed to redeem, try again later', fix: 'Garena servers are overloaded. Wait 2–3 minutes and retry. Don\'t spam — it can lock you out temporarily.' },
  { msg: 'Already used this code', fix: 'Each code works once per account. Check back — we publish new codes every hour.' },
];

const FAQS = [
  { q: 'Are Free Fire redeem codes free?', a: 'Yes. Garena releases them during events, livestreams, and promotions. You never need to pay. Any site asking for payment or your password is a scam.' },
  { q: 'How many codes can I use per day?', a: 'No daily limit. You can redeem every valid code available. The only rule: each specific code works once per account.' },
  { q: 'Why does a code work for others but not me?', a: 'Either you\'re on a different server (e.g., India vs Brazil) or the code reached its global cap before you tried it.' },
  { q: 'Do codes work on guest accounts?', a: 'No. You must link your account to Facebook, Google, Apple ID, Twitter, or VK before redeeming.' },
  { q: 'How long do codes stay active?', a: 'Most expire within 12–18 hours. Some event codes last up to 48 hours. We show the estimated time remaining for each code.' },
  { q: 'What rewards do codes give?', a: 'Diamonds, gold, skins, bundles, weapon crates, emotes, pet skins, and surfboard skins. Rewards depend on the current event.' },
  { q: 'When do new codes release?', a: 'Garena typically drops new batches around midnight IST (UTC+5:30) during server resets. We sync and publish within minutes.' },
  { q: 'Is this site official?', a: 'No. We\'re independent. We monitor official Garena channels and community sources to find, verify, and publish codes for the community.' },
];

const currentDate = () => new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });

export const OnPageContent: React.FC = () => (
  <section className="max-w-7xl mx-auto px-4 md:px-8 py-14 space-y-16" itemScope itemType="https://schema.org/Article">
    <meta itemProp="author" content="Jaxon Lee" />
    <meta itemProp="dateModified" content={new Date().toISOString().split('T')[0]} />
    <meta itemProp="datePublished" content="2024-01-15" />

    {/* What Are Free Fire Redeem Codes */}
    <div>
      <h2 className="text-2xl md:text-3xl font-display text-foreground uppercase italic tracking-tight mb-4">
        What Are Free Fire <span className="text-success">Redeem Codes</span>?
      </h2>
      <div className="bg-card border border-border rounded-2xl p-5 md:p-8 space-y-4 text-sm text-t-body leading-relaxed">
        <p>Free Fire redeem codes are <strong>12-character alphanumeric codes</strong> released by Garena. Each code unlocks free in-game rewards — diamonds, skins, bundles, weapon crates, emotes, and more.</p>
        <p>Codes are region-specific (Global, India, Brazil, Indonesia, Europe) and expire within <strong>12–18 hours</strong>. Each code has a global redemption cap — once enough players claim it, it stops working for everyone.</p>
        <p>We verify every code on a live account before publishing. Our system checks all five server regions every hour. When a new code goes live, it appears here within minutes with its region tag, reward details, and estimated expiry.</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
          {[
            { label: 'Codes Verified', value: '15,000+' },
            { label: 'Regions Covered', value: '5' },
            { label: 'Update Frequency', value: 'Hourly' },
            { label: 'Publish Speed', value: '<3 min' },
          ].map(s => (
            <div key={s.label} className="bg-muted/50 border border-border rounded-xl p-3 text-center">
              <div className="text-lg font-display font-black text-foreground">{s.value}</div>
              <div className="text-[10px] font-tech text-t-muted uppercase tracking-widest mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* How to Redeem */}
    <div>
      <h2 className="text-2xl md:text-3xl font-display text-foreground uppercase italic tracking-tight mb-4">
        How to Redeem <span className="text-success">Free Fire Codes</span>
      </h2>
      <div className="bg-card border border-border rounded-2xl p-5 md:p-8">
        <div className="space-y-3">
          {STEPS.map(s => (
            <div key={s.n} className="flex gap-3 items-start">
              <div className="w-8 h-8 shrink-0 rounded-lg bg-success/10 border border-success/20 flex items-center justify-center">
                <span className="text-success font-display font-black text-xs">{s.n}</span>
              </div>
              <div className="flex-1 bg-muted/30 border border-border rounded-xl px-4 py-3">
                <h3 className="font-tech font-bold text-foreground text-sm">{s.title}</h3>
                <p className="text-t-body text-sm leading-relaxed mt-0.5">{s.text}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 bg-success/5 border border-success/20 rounded-xl p-4">
          <p className="text-sm text-t-body leading-relaxed">
            <strong className="text-foreground">Important:</strong> The only official site is <strong>reward.ff.garena.com</strong>. Never enter your credentials on any other URL.
          </p>
        </div>
      </div>
    </div>

    {/* Error Troubleshooting */}
    <div>
      <h2 className="text-2xl md:text-3xl font-display text-foreground uppercase italic tracking-tight mb-4">
        Redemption <span className="text-secondary">Error Fixes</span>
      </h2>
      <div className="bg-card border border-border rounded-2xl p-5 md:p-8">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left font-tech font-bold text-foreground py-3 pr-4 uppercase text-xs tracking-wider">Error Message</th>
                <th className="text-left font-tech font-bold text-foreground py-3 uppercase text-xs tracking-wider">What To Do</th>
              </tr>
            </thead>
            <tbody>
              {ERRORS.map(e => (
                <tr key={e.msg} className="border-b border-border/50 last:border-0">
                  <td className="py-3 pr-4 text-foreground font-medium align-top whitespace-nowrap">"{e.msg}"</td>
                  <td className="py-3 text-t-body leading-relaxed">{e.fix}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>

    {/* FAQ */}
    <div>
      <h2 className="text-2xl md:text-3xl font-display text-foreground uppercase italic tracking-tight mb-4">
        Frequently Asked <span className="text-success">Questions</span>
      </h2>
      <div className="space-y-2">
        {FAQS.map(f => <FAQ key={f.q} q={f.q} a={f.a} />)}
      </div>
      <p className="text-[11px] text-t-muted mt-4 text-center font-tech">
        Written by <strong className="text-foreground">Jaxon Lee</strong> · Updated: {currentDate()}
      </p>
    </div>

    {/* JSON-LD schemas moved to static index.html for crawler visibility */}
  </section>
);

export default OnPageContent;
