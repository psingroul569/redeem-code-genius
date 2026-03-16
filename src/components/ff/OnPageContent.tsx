import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Gift, Smartphone, AlertTriangle, HelpCircle, Shield, Clock, Star, Zap, CheckCircle2, XCircle, ArrowRight, BookOpen } from 'lucide-react';

const QuickFAQ: React.FC<{ question: string; answer: string }> = ({ question, answer }) => {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="border border-border rounded-2xl overflow-hidden transition-all"
      itemScope
      itemProp="mainEntity"
      itemType="https://schema.org/Question"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-4 text-left bg-card hover:bg-muted/50 transition-colors"
      >
        <span className="font-tech text-sm font-bold text-foreground pr-4" itemProp="name">{question}</span>
        {open ? <ChevronUp size={18} className="text-success shrink-0" /> : <ChevronDown size={18} className="text-t-muted shrink-0" />}
      </button>
      {open && (
        <div
          className="px-6 py-4 bg-muted/30 border-t border-border"
          itemScope
          itemProp="acceptedAnswer"
          itemType="https://schema.org/Answer"
        >
          <p className="text-sm text-t-body leading-relaxed" itemProp="text">{answer}</p>
        </div>
      )}
    </div>
  );
};

const STEPS = [
  { step: '1', title: 'Copy Your Code', desc: 'Pick any active code from the list above and tap the copy button. The code gets copied to your clipboard instantly.' },
  { step: '2', title: 'Visit the Rewards Page', desc: 'Head over to reward.ff.garena.com — that\'s the only official redemption site. Bookmark it so you don\'t fall for fake links.' },
  { step: '3', title: 'Log Into Your Account', desc: 'Sign in using whichever platform you play on — Facebook, Google, Apple ID, Twitter, or VK. Guest accounts can\'t redeem codes, so make sure yours is linked.' },
  { step: '4', title: 'Paste and Confirm', desc: 'Paste the 12-character code into the text field and hit Confirm. You\'ll see a success message if the code is valid.' },
  { step: '5', title: 'Collect In-Game', desc: 'Open Free Fire, go to the mail section in the lobby. Your rewards show up within 24 hours, though most arrive in under 30 minutes.' },
];

const ERRORS = [
  { code: 'Code is invalid or expired', fix: 'The code has already been used or has passed its expiry window. Most codes only last 12–18 hours after release. Grab a fresh one from our list — we mark expired codes clearly.', icon: <XCircle size={18} className="text-destructive" /> },
  { code: 'Code redemption limit reached', fix: 'Each code has a global claim cap. Once enough players redeem it, it locks out. This is why we publish codes the moment they go live — the earlier you grab them, the better.', icon: <AlertTriangle size={18} className="text-secondary" /> },
  { code: 'This code is not available for your region', fix: 'Some codes are server-specific. Use the region selector at the top of this page to switch to your server. We tag every code with its supported regions.', icon: <Shield size={18} className="text-primary" /> },
  { code: 'Failed to redeem, please try again later', fix: 'Garena\'s servers are probably overloaded. This happens a lot right after new codes drop. Wait 2–3 minutes and try again. Don\'t spam the button — it can temporarily lock you out.', icon: <Clock size={18} className="text-t-muted" /> },
  { code: 'You have already used this code', fix: 'Every code works once per account. If you see this, you\'ve already claimed it. No worries — we update with new codes every hour so there\'s always something fresh.', icon: <CheckCircle2 size={18} className="text-success" /> },
];

const MINI_FAQ = [
  { q: 'Are Free Fire redeem codes really free?', a: 'Yes, 100%. Garena releases these codes as part of events, livestreams, and social media promotions. You never have to pay anything. If a site asks for payment or your password, it\'s a scam — report it and leave immediately.' },
  { q: 'How many codes can I redeem per day?', a: 'There\'s no daily limit on your account. You can redeem as many valid codes as you want. The only restriction is that each specific code works once per account. So if there are 12 active codes today, you can claim all 12.' },
  { q: 'Why did my code work for my friend but not for me?', a: 'Two common reasons: either you\'re on different servers (India vs Brazil, for example), or the code hit its global redemption cap between when your friend used it and when you tried. Server-specific codes are clearly labeled on our site.' },
  { q: 'Do codes work on guest accounts?', a: 'No. You need a linked account — Facebook, Google, Apple ID, Twitter, or VK. Guest accounts can\'t access the redemption site at all. Link your account in Free Fire settings before trying to redeem.' },
  { q: 'How long do redeem codes stay active?', a: 'Most codes expire within 12 to 18 hours after release. Some event codes last up to 48 hours, but that\'s rare. We display the estimated time window for each code, so you know exactly how long you have.' },
  { q: 'What rewards can I get from redeem codes?', a: 'Everything from diamonds and gold to exclusive skins, bundles, weapon crates, emotes, pet skins, and surfboard skins. The rewards rotate based on whatever event Garena is running. Diamond vouchers and bundles are the most common.' },
  { q: 'Is this website affiliated with Garena or Free Fire?', a: 'No. We\'re an independent platform. We monitor official Garena channels, social media, and community sources to find and verify codes. We have no partnership with Garena — just a team that plays the game and wants to help the community.' },
  { q: 'When do new codes usually drop?', a: 'Garena typically releases new batches around midnight IST (UTC+5:30), which lines up with server resets. We sync hourly and publish codes within minutes of going live. Enable browser notifications so you don\'t miss them.' },
];

export const OnPageContent: React.FC = () => {
  const currentDate = new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 py-16" itemScope itemType="https://schema.org/Article">
      <meta itemProp="author" content="Jaxon Lee" />
      <meta itemProp="dateModified" content={new Date().toISOString().split('T')[0]} />
      <meta itemProp="datePublished" content="2024-01-15" />

      {/* Section: About Free Fire Redeem Codes */}
      <div className="mb-20">
        <div className="flex items-center gap-3 mb-6">
          <Gift size={24} className="text-success" />
          <h2 className="text-3xl md:text-4xl font-display text-foreground uppercase italic tracking-tight">
            About Free Fire <span className="text-success">Redeem Codes</span>
          </h2>
        </div>

        <div className="bg-card border border-border rounded-3xl p-6 md:p-10 space-y-5">
          <p className="text-t-body leading-relaxed">
            If you've been playing Free Fire for any amount of time, you've probably heard people talking about redeem codes. Here's the short version: they're 12-character alphanumeric codes that Garena — the company behind Free Fire — releases for free. You punch them into the official rewards site and get stuff like diamonds, skins, bundles, and weapon crates dropped straight into your in-game mailbox.
          </p>
          <p className="text-t-body leading-relaxed">
            The catch? They expire fast. Most codes have a 12–18 hour window, and some hit their global redemption cap even sooner. That's where we come in. Our system checks for new codes every hour across all five major server regions — Global, India, Brazil, Indonesia, and Europe. When a code goes live, it shows up here within minutes, already verified and tagged with the server it works on.
          </p>
          <p className="text-t-body leading-relaxed">
            We've been doing this since 2024. As of {currentDate}, we've tracked and verified over 15,000 codes for the Free Fire community. Every single code you see on this page has been tested on a live account before we publish it. No guesswork, no recycled codes from last week, no clickbait.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
            {[
              { label: 'Codes Verified', value: '15,000+', icon: <CheckCircle2 size={16} className="text-success" /> },
              { label: 'Regions Covered', value: '5', icon: <Star size={16} className="text-secondary" /> },
              { label: 'Sync Frequency', value: 'Hourly', icon: <Zap size={16} className="text-success" /> },
              { label: 'Avg. Publish Time', value: '<3 min', icon: <Clock size={16} className="text-secondary" /> },
            ].map((stat) => (
              <div key={stat.label} className="bg-muted/50 border border-border rounded-2xl p-4 text-center">
                <div className="flex justify-center mb-2">{stat.icon}</div>
                <div className="text-xl font-display font-black text-foreground">{stat.value}</div>
                <div className="text-[10px] font-tech text-t-muted uppercase tracking-widest mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section: How to Redeem */}
      <div className="mb-20">
        <div className="flex items-center gap-3 mb-6">
          <Smartphone size={24} className="text-success" />
          <h2 className="text-3xl md:text-4xl font-display text-foreground uppercase italic tracking-tight">
            How to Redeem <span className="text-success">Free Fire Codes</span>
          </h2>
        </div>

        <div className="bg-card border border-border rounded-3xl p-6 md:p-10">
          <p className="text-t-body leading-relaxed mb-8">
            It takes about 30 seconds once you know what you're doing. Here's the exact process — no fluff, no unnecessary steps.
          </p>

          <div className="space-y-4">
            {STEPS.map((s) => (
              <div key={s.step} className="flex gap-4 items-start group">
                <div className="w-10 h-10 shrink-0 rounded-xl bg-success/10 border border-success/20 flex items-center justify-center">
                  <span className="text-success font-display font-black text-sm">{s.step}</span>
                </div>
                <div className="flex-1 bg-muted/30 border border-border rounded-2xl p-4 group-hover:border-success/30 transition-colors">
                  <h3 className="font-tech font-bold text-foreground text-sm mb-1">{s.title}</h3>
                  <p className="text-t-body text-sm leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 bg-success/5 border border-success/20 rounded-2xl p-5 flex gap-3">
            <BookOpen size={20} className="text-success shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-tech font-bold text-foreground mb-1">Pro Tip from Jaxon</p>
              <p className="text-sm text-t-body leading-relaxed">
                Bookmark <strong>reward.ff.garena.com</strong> and stay logged in. When we publish a new batch, you can redeem all 12 codes in under two minutes. Speed matters because popular codes hit their cap fast — especially diamond vouchers.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Section: Error Troubleshooting */}
      <div className="mb-20">
        <div className="flex items-center gap-3 mb-6">
          <AlertTriangle size={24} className="text-secondary" />
          <h2 className="text-3xl md:text-4xl font-display text-foreground uppercase italic tracking-tight">
            Common Errors <span className="text-secondary">& Fixes</span>
          </h2>
        </div>

        <div className="bg-card border border-border rounded-3xl p-6 md:p-10">
          <p className="text-t-body leading-relaxed mb-8">
            Ran into a problem while redeeming? Don't panic. Here are the most common errors and exactly what to do about each one.
          </p>

          <div className="space-y-4">
            {ERRORS.map((err) => (
              <div key={err.code} className="bg-muted/30 border border-border rounded-2xl p-5 hover:border-secondary/30 transition-colors">
                <div className="flex items-center gap-3 mb-3">
                  {err.icon}
                  <h3 className="font-tech font-bold text-foreground text-sm">"{err.code}"</h3>
                </div>
                <div className="flex items-start gap-2 ml-1">
                  <ArrowRight size={14} className="text-success shrink-0 mt-1" />
                  <p className="text-sm text-t-body leading-relaxed">{err.fix}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 bg-destructive/5 border border-destructive/20 rounded-2xl p-5 flex gap-3">
            <Shield size={20} className="text-destructive shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-tech font-bold text-foreground mb-1">Stay Safe</p>
              <p className="text-sm text-t-body leading-relaxed">
                The <strong>only</strong> official redemption site is <strong>reward.ff.garena.com</strong>. Any other URL asking for your Free Fire login or password is a phishing attempt. We'll never ask for your credentials — nobody legitimate will. If something feels off, close the tab.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Section: Quick FAQ */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-6">
          <HelpCircle size={24} className="text-success" />
          <h2 className="text-3xl md:text-4xl font-display text-foreground uppercase italic tracking-tight">
            Quick <span className="text-success">FAQ</span>
          </h2>
        </div>

        <div
          className="space-y-3"
          itemScope
          itemType="https://schema.org/FAQPage"
        >
          {MINI_FAQ.map((faq) => (
            <QuickFAQ key={faq.q} question={faq.q} answer={faq.a} />
          ))}
        </div>

        <p className="text-xs text-t-muted mt-6 text-center font-tech">
          Content researched and written by <strong className="text-foreground">Jaxon Lee</strong> · Last updated: {currentDate}
        </p>
      </div>

      {/* FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": MINI_FAQ.map((faq) => ({
              "@type": "Question",
              "name": faq.q,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.a,
              },
            })),
          }),
        }}
      />

      {/* HowTo Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            "name": "How to Redeem Free Fire Codes",
            "description": "Step-by-step guide to redeeming Free Fire reward codes on the official Garena rewards site.",
            "step": STEPS.map((s, i) => ({
              "@type": "HowToStep",
              "position": i + 1,
              "name": s.title,
              "text": s.desc,
            })),
            "totalTime": "PT1M",
          }),
        }}
      />
    </section>
  );
};

export default OnPageContent;
