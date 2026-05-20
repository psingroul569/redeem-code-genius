import { Header } from '@/components/ff/Header';
import { Footer } from '@/components/ff/Footer';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { DEFAULT_URL, SITE_NAME } from '@/constants';
import { useSEO } from '@/hooks/useSEO';

const HowToGuide = () => {
  useSEO({
    title: `How to Redeem Free Fire Codes - Step-by-Step Guide | ${SITE_NAME}`,
    description: 'Step-by-step guide to redeem Free Fire codes on reward.ff.garena.com. Works on Android, iPhone, and PC. Login, paste codes, and collect rewards.',
    path: '/how-to-guide',
  });


  // HowTo schema removed (Sept 2023): Google deprecated HowTo rich results.

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": DEFAULT_URL },
      { "@type": "ListItem", "position": 2, "name": "How to Redeem Free Fire Codes", "item": `${DEFAULT_URL}/how-to-guide` }
    ]
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-tech">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <Header />
      <main className="max-w-4xl mx-auto px-4 md:px-8 py-12 md:py-16">
        <Link to="/" className="inline-flex items-center gap-2 text-t-muted hover:text-foreground mb-8 text-sm uppercase tracking-widest transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        <h1 className="text-3xl md:text-4xl font-display uppercase tracking-tight text-foreground mb-3">
          How to Redeem Free Fire Codes
        </h1>
        <p className="text-t-muted text-sm mb-10 border-b border-border pb-6 leading-relaxed">
          A complete walkthrough for redeeming Garena Free Fire reward codes. Works on Android phones, iPhones, tablets, and desktop browsers. Takes about 60 seconds from start to finish.
        </p>

        {/* Prerequisites */}
        <section className="mb-12">
          <h2 className="text-xl md:text-2xl font-display uppercase tracking-tight text-foreground mb-4">
            Before You Start
          </h2>
          <div className="bg-card border border-border rounded-xl p-5 md:p-6 space-y-3 text-sm text-t-body leading-relaxed">
            <p>You need two things to redeem Free Fire codes:</p>
            <ul className="list-disc list-inside space-y-2 pl-1">
              <li>
                <strong className="text-foreground">A linked Free Fire account</strong> - Your game must be connected to Facebook, Google, Apple ID, VK, or Huawei ID. Guest accounts cannot redeem codes. To link your account: open Free Fire → Settings (gear icon) → Account → Link Account → choose a platform and follow the prompts. This is a one-time setup.
              </li>
              <li>
                <strong className="text-foreground">A web browser</strong> - Chrome, Safari, Firefox, or any modern browser. The process is entirely browser-based. You do not need the Free Fire app open during redemption.
              </li>
            </ul>
          </div>
        </section>

        {/* Step by Step */}
        <section className="mb-12">
          <h2 className="text-xl md:text-2xl font-display uppercase tracking-tight text-foreground mb-4">
            Step-by-Step Guide
          </h2>
          <div className="space-y-6">
            {[
              {
                step: 1,
                title: 'Find a Working Code',
                content: (
                  <>
                    <p>Go to our <Link to="/" className="text-success underline hover:no-underline">homepage</Link> and look at the code cards. Each card shows:</p>
                    <ul className="list-disc list-inside space-y-1 pl-1 mt-2">
                      <li>The 12-character code</li>
                      <li>The reward it gives (diamonds, skins, bundles, etc.)</li>
                      <li>The server region it works on (India, Brazil, Indonesia, Europe, or Global)</li>
                      <li>Its current status - <strong className="text-success">Working</strong>, <strong className="text-secondary">Limited</strong> (running out), or <strong className="text-destructive">Expired</strong></li>
                    </ul>
                    <p className="mt-2">Tap the <strong className="text-foreground">copy button</strong> on the card. The code is now in your clipboard - don't type it manually, as even one wrong character will cause an error.</p>
                  </>
                )
              },
              {
                step: 2,
                title: 'Open the Official Garena Rewards Site',
                content: (
                  <>
                    <p>Go to <a href="https://reward.ff.garena.com" target="_blank" rel="noopener noreferrer" className="text-success font-bold underline hover:no-underline">reward.ff.garena.com</a> in your browser.</p>
                    <p className="mt-2">This is the only official page where codes can be redeemed. Bookmark it for quick access. If you see any other URL claiming to redeem Free Fire codes, it's fake - close it immediately.</p>
                    <div className="mt-3 bg-destructive/5 border border-destructive/20 rounded-lg p-3">
                      <p className="text-sm"><strong className="text-destructive">Warning:</strong> Fake sites often look almost identical to the real one. Always check the URL bar. The legitimate page is <a href="https://reward.ff.garena.com" target="_blank" rel="noopener noreferrer" className="text-success font-bold underline hover:no-underline">reward.ff.garena.com</a> - nothing else.</p>
                    </div>
                  </>
                )
              },
              {
                step: 3,
                title: 'Log In',
                content: (
                  <>
                    <p>You'll see login buttons for Facebook, Google, Apple ID, VK, and Huawei. <strong className="text-foreground">Use the same platform</strong> that your Free Fire account is linked to.</p>
                    <p className="mt-2">For example, if you log into Free Fire using your Google account, tap the Google button on the rewards site and sign in with the same Google account.</p>
                    <p className="mt-2">If you use the wrong login method, the code might redeem to a different (possibly empty) Free Fire account, and you won't see the rewards on your main account.</p>
                    <div className="mt-3 bg-muted/50 border border-border rounded-lg p-3">
                      <p className="text-sm"><strong className="text-foreground">Tip:</strong> If you're having trouble logging in, try clearing your browser cache or using an incognito/private window. VPN connections can also cause login failures - disconnect your VPN first.</p>
                    </div>
                  </>
                )
              },
              {
                step: 4,
                title: 'Paste the Code and Confirm',
                content: (
                  <>
                    <p>After logging in, a text box appears. Paste the code you copied:</p>
                    <ul className="list-disc list-inside space-y-1 pl-1 mt-2">
                      <li><strong>On mobile:</strong> Long-press the text box → tap "Paste"</li>
                      <li><strong>On desktop:</strong> Click the text box → press Ctrl+V (or Cmd+V on Mac)</li>
                    </ul>
                    <p className="mt-2">Tap the <strong className="text-foreground">Confirm</strong> button. If successful, you'll see a green message showing the reward name (e.g., "You have redeemed: 500 Diamonds"). If you see an error, check our troubleshooting section below.</p>
                  </>
                )
              },
              {
                step: 5,
                title: 'Collect Your Rewards in Free Fire',
                content: (
                  <>
                    <p>Open the Free Fire app. On the lobby screen, tap the <strong className="text-foreground">mail/envelope icon</strong> (top-right corner). Your rewards appear under the "Claim" tab.</p>
                    <ul className="list-disc list-inside space-y-1 pl-1 mt-2">
                      <li><strong>Diamonds</strong> - Added to your balance automatically. Check the counter at the top of the screen.</li>
                      <li><strong>Skins, bundles, emotes</strong> - Appear in your Vault/Collection. Go to your character loadout to equip them.</li>
                      <li><strong>Vouchers</strong> - Found in your Luck Royale section. Use them for spins.</li>
                    </ul>
                    <p className="mt-2"><strong className="text-foreground">Delivery time:</strong> Most rewards arrive within 5–30 minutes. During high-traffic periods (new events, server resets, major updates), it can take up to 24 hours. If you still don't see your reward after 24 hours, contact Garena support with your Player ID and a screenshot of the successful redemption.</p>
                  </>
                )
              },
            ].map(s => (
              <div key={s.step} className="bg-card border border-border rounded-xl overflow-hidden">
                <div className="flex items-center gap-3 px-5 py-3 bg-muted/50 border-b border-border">
                  <div className="w-8 h-8 shrink-0 rounded-lg bg-success/10 border border-success/20 flex items-center justify-center">
                    <span className="text-success font-display font-black text-sm">{s.step}</span>
                  </div>
                  <h3 className="font-display text-foreground text-base uppercase tracking-tight">{s.title}</h3>
                </div>
                <div className="px-5 py-4 text-sm text-t-body leading-relaxed space-y-2">
                  {s.content}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Common Errors */}
        <section className="mb-12">
          <h2 className="text-xl md:text-2xl font-display uppercase tracking-tight text-foreground mb-4">
            Common Errors and Fixes
          </h2>
          <div className="bg-card border border-border rounded-xl p-5 md:p-6">
            <div className="space-y-4 text-sm text-t-body leading-relaxed">
              {[
                { error: '"This code is invalid or redeemed"', fix: 'The code has expired or reached its maximum number of claims. There\'s nothing you can do with it - head back to our homepage and grab a different code.' },
                { error: '"This code cannot be used in your region"', fix: 'The code is locked to a different server. Use the region filter on our homepage to find codes for your server (India, Brazil, Indonesia, Europe, or Global).' },
                { error: '"Failed to redeem. Please try again later"', fix: 'Garena\'s servers are overloaded. This usually happens right after new codes drop. Wait 2–3 minutes and try again. Avoid spamming the Confirm button - it can trigger a temporary cooldown.' },
                { error: '"You have already used this code"', fix: 'You\'ve redeemed this exact code before. Each code is one-time per account. Go back to our homepage for fresh codes.' },
                { error: 'Login keeps failing or redirecting', fix: 'Clear your browser cache, disable your VPN, and try in an incognito window. Make sure you\'re using the same login method linked to your Free Fire account.' },
              ].map(e => (
                <div key={e.error} className="border-b border-border/50 last:border-0 pb-3 last:pb-0">
                  <p className="font-medium text-foreground mb-1">{e.error}</p>
                  <p>{e.fix}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Tips */}
        <section className="mb-12">
          <h2 className="text-xl md:text-2xl font-display uppercase tracking-tight text-foreground mb-4">
            Tips to Get the Most Out of Codes
          </h2>
          <div className="bg-card border border-border rounded-xl p-5 md:p-6 space-y-3 text-sm text-t-body leading-relaxed">
            <ul className="list-disc list-inside space-y-2 pl-1">
              <li><strong className="text-foreground">Redeem immediately.</strong> Codes can expire within hours. The moment you see a working code, redeem it - don't save it for later.</li>
              <li><strong className="text-foreground">Always copy, never type.</strong> Manually typing a 12-character code is error-prone. Use the copy button on our site to avoid mistakes.</li>
              <li><strong className="text-foreground">Check during server resets.</strong> The best time to find new codes is right after server reset (midnight local time for your region). That's when Garena typically pushes new drops.</li>
              <li><strong className="text-foreground">Try all available codes.</strong> There's no daily limit on how many different codes you can redeem. If 10 codes are listed as Working, try all 10.</li>
              <li><strong className="text-foreground">Bookmark our site.</strong> We update codes throughout the day. Having quick access means you'll catch codes before they hit their cap.</li>
            </ul>
          </div>
        </section>

        {/* Device-specific notes */}
        <section className="mb-12">
          <h2 className="text-xl md:text-2xl font-display uppercase tracking-tight text-foreground mb-4">
            Device-Specific Notes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                device: 'Android',
                notes: 'Works on any Android browser. Chrome is recommended. You can add our site to your home screen for quick access - it works like a lightweight app.'
              },
              {
                device: 'iPhone / iPad',
                notes: 'Safari and Chrome both work. The redemption process is identical to Android. If Safari blocks pop-ups during login, go to Settings → Safari → Block Pop-ups → turn it off temporarily.'
              },
              {
                device: 'PC / Emulator',
                notes: 'If you play on PC via BlueStacks or similar emulators, you can still redeem codes in your desktop browser. Codes are tied to your account, not your device.'
              },
            ].map(d => (
              <div key={d.device} className="bg-card border border-border rounded-xl p-5">
                <h3 className="font-display text-foreground text-base uppercase tracking-tight mb-2">{d.device}</h3>
                <p className="text-sm text-t-body leading-relaxed">{d.notes}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-success/5 border border-success/20 rounded-xl p-6 text-center">
          <h2 className="text-xl font-display uppercase tracking-tight text-foreground mb-3">
            Ready to Redeem?
          </h2>
          <p className="text-sm text-t-body mb-4 max-w-lg mx-auto">
            Head back to our homepage to grab today's working codes. We update the list throughout the day across all server regions.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-success text-primary-foreground px-6 py-3 rounded-lg font-bold text-sm uppercase tracking-wider hover:opacity-90 transition-opacity"
          >
            View Today's Codes
          </Link>
        </section>

        <p className="text-[11px] text-t-muted mt-8 text-center font-tech">
          Written by <strong className="text-foreground">Jaxon Lee</strong>, Lead Rewards Analyst · Last updated: {new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </main>
      <Footer />
    </div>
  );
};

export default HowToGuide;
