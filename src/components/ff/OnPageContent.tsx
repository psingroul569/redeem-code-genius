import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Link } from 'react-router-dom';

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

const currentDate = () => new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });

export const OnPageContent: React.FC = () => (
  <section className="max-w-7xl mx-auto px-4 md:px-8 py-14 space-y-16" itemScope itemType="https://schema.org/Article">
    <meta itemProp="author" content="Jaxon Lee" />
    <meta itemProp="dateModified" content={new Date().toISOString().split('T')[0]} />
    <meta itemProp="datePublished" content="2024-01-15" />

    {/* What Are Free Fire Redeem Codes — detailed, unique explanation */}
    <div>
      <h2 className="text-2xl md:text-3xl font-display text-foreground uppercase italic tracking-tight mb-4">
        What Are Free Fire <span className="text-success">Redeem Codes</span>?
      </h2>
      <div className="bg-card border border-border rounded-2xl p-5 md:p-8 space-y-4 text-sm text-t-body leading-relaxed">
        <p>
          Free Fire redeem codes are <strong>12-character alphanumeric strings</strong> (like <code className="bg-muted px-1.5 py-0.5 rounded text-foreground text-xs">FF11-NJN5-YS3E</code>) that Garena distributes through official social media accounts, in-game event banners, partner livestreams, and esports tournament broadcasts.
        </p>
        <p>
          When you enter a valid code on the official rewards site (<a href="https://reward.ff.garena.com" target="_blank" rel="noopener noreferrer" className="text-success font-bold underline hover:no-underline">reward.ff.garena.com</a>), the corresponding item — diamonds, weapon skins, character bundles, emotes, or consumables — gets deposited directly into your in-game mailbox. You don't need to download anything or provide your password anywhere.
        </p>

        <h3 className="text-base font-display text-foreground uppercase tracking-tight pt-2">How Codes Work Technically</h3>
        <p>
          Each code is tied to a specific <strong>server region</strong> (India, Brazil, Indonesia, Europe, or Global) and has two expiry conditions: a <strong>time limit</strong> (typically 12–18 hours after release) and a <strong>global redemption cap</strong> (a fixed number of claims, usually between 500 and 5,000). Whichever limit is hit first kills the code for everyone.
        </p>
        <p>
          This is why speed matters. A code released at midnight IST might be fully claimed by 6 AM if it went viral on YouTube or Telegram. Our system picks up new codes within minutes of release so you have the best window to claim them.
        </p>

        <h3 className="text-base font-display text-foreground uppercase tracking-tight pt-2">Types of Rewards You Can Get</h3>
        <ul className="list-disc list-inside space-y-1.5 pl-1">
          <li><strong>Diamonds</strong> — Premium currency. Codes typically give 100–1,000 diamonds. Use them for spins, skins, or elite passes.</li>
          <li><strong>Weapon Skins</strong> — Cosmetics for guns like AK47, M1014, AWM. Some are legendary-tier and only available through codes.</li>
          <li><strong>Character Bundles</strong> — Full outfit sets. Rare codes can unlock characters like Alok or Chrono.</li>
          <li><strong>Royale Vouchers</strong> — Tickets for Gold Royale, Weapon Royale, or Diamond Royale spins.</li>
          <li><strong>Emotes & Surfboards</strong> — Cosmetic animations and board skins for visual flair.</li>
          <li><strong>Pet Food & Pet Skins</strong> — Resources to level up your pet companions.</li>
          <li><strong>Utility Items</strong> — Custom Room Cards, Name Change Cards, and Bonfire tokens.</li>
        </ul>

        <h3 className="text-base font-display text-foreground uppercase tracking-tight pt-2">Where Do Codes Come From?</h3>
        <p>
          Garena releases codes through these channels — you don't need to follow all of them because we aggregate everything here:
        </p>
        <ul className="list-disc list-inside space-y-1 pl-1">
          <li>Official Free Fire social media (Instagram, Facebook, X/Twitter) for each region</li>
          <li>In-game news banners during events like OB updates, anniversaries, and collaborations</li>
          <li>Esports tournament streams (FFWS, FFIC, regional leagues)</li>
          <li>YouTube and Twitch partner channels during sponsored streams</li>
          <li>Community events and Garena's official Discord servers</li>
        </ul>
      </div>
    </div>

    {/* How to Redeem — detailed with context */}
    <div>
      <h2 className="text-2xl md:text-3xl font-display text-foreground uppercase italic tracking-tight mb-4">
        How to Redeem <span className="text-success">Free Fire Codes</span>
      </h2>
      <div className="bg-card border border-border rounded-2xl p-5 md:p-8">
        <p className="text-sm text-t-body leading-relaxed mb-5">
          The entire process takes under 60 seconds. You don't need the game open — just a browser and your linked account credentials.
        </p>
        <div className="space-y-4">
          {[
            {
              n: '1',
              title: 'Copy a Code From This Page',
              text: 'Pick any code marked "Working" from the list above. Tap the copy button — it copies the exact 12-character string to your clipboard. Don\'t type codes manually, as even one wrong character will cause an error.'
            },
            {
              n: '2',
              title: 'Go to reward.ff.garena.com',
              text: 'This is the only legitimate redemption page. Bookmark it. Any other URL claiming to redeem codes is fake. The page works on both mobile browsers and desktop — Chrome, Safari, Firefox, anything.'
            },
            {
              n: '3',
              title: 'Log In With Your Linked Account',
              text: 'Sign in using the same method linked to your Free Fire account — Facebook, Google, Apple ID, VK, or Huawei. If you play as a guest, you must link your account first in Free Fire → Settings → Account → Link. Guest accounts cannot redeem codes.'
            },
            {
              n: '4',
              title: 'Paste the Code and Hit Confirm',
              text: 'A text box appears after login. Paste (long-press → Paste on mobile, Ctrl+V on desktop) and tap Confirm. If the code is valid, you\'ll see a green success message with the reward name. If it fails, check the error guide below.'
            },
            {
              n: '5',
              title: 'Collect From In-Game Mail',
              text: 'Open Free Fire → tap the mail/envelope icon on the lobby screen → look under "Claim" tab. Diamonds add to your balance automatically. Skins, bundles, and items appear in your Vault. Most rewards arrive within 5–30 minutes. During peak traffic (event launches, server resets), it can take up to 24 hours.'
            },
          ].map(s => (
            <div key={s.n} className="flex gap-3 items-start">
              <div className="w-8 h-8 shrink-0 rounded-lg bg-success/10 border border-success/20 flex items-center justify-center">
                <span className="text-success font-display font-black text-xs">{s.n}</span>
              </div>
              <div className="flex-1 bg-muted/30 border border-border rounded-xl px-4 py-3">
                <h3 className="font-tech font-bold text-foreground text-sm">{s.title}</h3>
                <p className="text-t-body text-sm leading-relaxed mt-1">{s.text}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 bg-success/5 border border-success/20 rounded-xl p-4">
          <p className="text-sm text-t-body leading-relaxed">
            <strong className="text-foreground">Security Reminder:</strong> The only official redemption URL is <a href="https://reward.ff.garena.com" target="_blank" rel="noopener noreferrer" className="text-success font-bold underline hover:no-underline">reward.ff.garena.com</a>. Garena will never ask for your password through a redeem code site. If a website asks for your password, player ID, or phone number to "verify" a code — close it immediately. It's a phishing attempt.
          </p>
        </div>
        <p className="text-sm text-t-body mt-4">
          Need more detail? Read our full <Link to="/how-to-guide" className="text-success underline hover:no-underline">step-by-step redemption guide with screenshots</Link>.
        </p>
      </div>
    </div>

    {/* Server Regions — new unique section */}
    <div>
      <h2 className="text-2xl md:text-3xl font-display text-foreground uppercase italic tracking-tight mb-4">
        Server Regions <span className="text-success">Explained</span>
      </h2>
      <div className="bg-card border border-border rounded-2xl p-5 md:p-8 space-y-4 text-sm text-t-body leading-relaxed">
        <p>
          Free Fire operates on separate servers for different parts of the world. Each server has its own event schedule, code drops, and reward pools. A code released for the India server will <strong>not work</strong> on the Brazil or Europe server — and vice versa.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left font-tech font-bold text-foreground py-3 pr-4 uppercase text-xs tracking-wider">Server</th>
                <th className="text-left font-tech font-bold text-foreground py-3 pr-4 uppercase text-xs tracking-wider">Countries</th>
                <th className="text-left font-tech font-bold text-foreground py-3 uppercase text-xs tracking-wider">Reset Time</th>
              </tr>
            </thead>
            <tbody className="text-t-body">
              <tr className="border-b border-border/50"><td className="py-2.5 pr-4 font-medium text-foreground">India (IND)</td><td className="py-2.5 pr-4">India, Nepal, Sri Lanka, Bangladesh</td><td className="py-2.5">12:00 AM IST (UTC+5:30)</td></tr>
              <tr className="border-b border-border/50"><td className="py-2.5 pr-4 font-medium text-foreground">Indonesia (ID)</td><td className="py-2.5 pr-4">Indonesia, Malaysia, Philippines</td><td className="py-2.5">12:00 AM WIB (UTC+7)</td></tr>
              <tr className="border-b border-border/50"><td className="py-2.5 pr-4 font-medium text-foreground">Brazil (BR)</td><td className="py-2.5 pr-4">Brazil, Latin America</td><td className="py-2.5">12:00 AM BRT (UTC-3)</td></tr>
              <tr className="border-b border-border/50"><td className="py-2.5 pr-4 font-medium text-foreground">Europe (EU)</td><td className="py-2.5 pr-4">Europe, Middle East, North Africa</td><td className="py-2.5">12:00 AM CET (UTC+1)</td></tr>
              <tr><td className="py-2.5 pr-4 font-medium text-foreground">Global</td><td className="py-2.5 pr-4">All regions (no restriction)</td><td className="py-2.5">Varies by event</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          <strong>How to check your server:</strong> Open Free Fire → tap your profile avatar → your server is shown below your player name (e.g., "IND" for India). You cannot change servers — it's assigned based on your location when you first created your account.
        </p>
        <p>
          We label every code on this site with its server region. Use the region tabs at the top of the page to filter codes for your specific server.
        </p>
      </div>
    </div>

    {/* Error Troubleshooting — expanded */}
    <div>
      <h2 className="text-2xl md:text-3xl font-display text-foreground uppercase italic tracking-tight mb-4">
        Redemption <span className="text-secondary">Error Fixes</span>
      </h2>
      <div className="bg-card border border-border rounded-2xl p-5 md:p-8">
        <p className="text-sm text-t-body leading-relaxed mb-4">
          Errors during redemption are common — most have simple fixes. Here's every error message you might see on the Garena rewards page and exactly what to do:
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left font-tech font-bold text-foreground py-3 pr-4 uppercase text-xs tracking-wider">Error Message</th>
                <th className="text-left font-tech font-bold text-foreground py-3 uppercase text-xs tracking-wider">Cause & Fix</th>
              </tr>
            </thead>
            <tbody>
              {[
                { msg: 'This code is invalid or redeemed', fix: 'The code has either expired (past its 12–18 hour window) or hit its global claim cap. There\'s nothing you can do with this specific code — grab a fresh one from our updated list.' },
                { msg: 'Redemption limit reached for this code', fix: 'Too many players claimed it before you. Popular codes (especially diamond codes) can exhaust their cap within 2–3 hours of release. Check back — we publish new codes throughout the day.' },
                { msg: 'This code cannot be used in your region', fix: 'The code was released for a different server. For example, an India-only code won\'t work if your account is registered on the Brazil server. Use our region filter to find codes for your server.' },
                { msg: 'Failed to redeem. Please try again later', fix: 'Garena\'s servers are under heavy load — this happens a lot right after new codes drop. Wait 2–3 minutes and retry. Don\'t spam the button repeatedly, as this can trigger a temporary cooldown on your account.' },
                { msg: 'You have already used this code', fix: 'Each code is one-time-use per account. Even if the code is still "Working" for others, you can\'t use it twice. Check back for new codes — we update throughout the day.' },
                { msg: 'Please log in to continue', fix: 'You\'re not signed in on the rewards site, or your session expired. Log in again using the exact same method (Facebook, Google, etc.) linked to your Free Fire account. Try clearing cookies if it keeps failing.' },
              ].map(e => (
                <tr key={e.msg} className="border-b border-border/50 last:border-0">
                  <td className="py-3 pr-4 text-foreground font-medium align-top">"{e.msg}"</td>
                  <td className="py-3 text-t-body leading-relaxed">{e.fix}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-5 bg-muted/50 border border-border rounded-xl p-4">
          <p className="text-sm text-t-body leading-relaxed">
            <strong className="text-foreground">Still stuck?</strong> If none of the above fixes your issue, the problem might be on Garena's end (server maintenance, regional outage). Wait 30 minutes and try again. You can also check our <Link to="/faq" className="text-success underline hover:no-underline">FAQ page</Link> for more troubleshooting help or <Link to="/contact" className="text-success underline hover:no-underline">contact us</Link> directly.
          </p>
        </div>
      </div>
    </div>

    {/* FAQ — focused on unique, high-search-volume questions */}
    <div>
      <h2 className="text-2xl md:text-3xl font-display text-foreground uppercase italic tracking-tight mb-4">
        Common <span className="text-success">Questions</span>
      </h2>
      <div className="space-y-2">
        {[
          {
            q: 'Are Free Fire redeem codes completely free?',
            a: 'Yes — 100% free. Garena releases them as part of promotions, events, and community rewards. You never need to pay, fill surveys, or download apps. Any website or YouTube video asking you to "complete verification" or pay money for codes is a scam. The only thing you need is a linked Free Fire account and the official Garena rewards site.'
          },
          {
            q: 'How many codes can I redeem per day?',
            a: 'There is no daily limit. If 15 working codes are available right now, you can redeem all 15 — as long as each individual code hasn\'t been used by your account before. The only restriction is that each specific code works once per account. New codes are released independently, so there\'s no cap on how many different codes you claim in a day.'
          },
          {
            q: 'Why does a code work for my friend but not for me?',
            a: 'Three possible reasons: (1) You\'re on different servers — a code for the India server won\'t work on Brazil. (2) The code reached its global redemption cap between when your friend used it and when you tried. (3) You\'ve already used this exact code before (you might have forgotten). Check the server label on the code and try another one from your region.'
          },
          {
            q: 'Do codes work on guest accounts?',
            a: 'No. Guest accounts are not linked to any identity that the rewards site can verify. You must link your Free Fire account to Facebook, Google, Apple ID, VK, or Huawei ID before you can redeem any code. To link: open Free Fire → Settings → Account → Link Account. This is a one-time setup.'
          },
          {
            q: 'How long do codes stay active after release?',
            a: 'Most codes expire within 12–18 hours of release. Some special event codes (anniversaries, collaborations) can last up to 48 hours. But the bigger threat is the redemption cap — popular codes often get fully claimed within 2–4 hours even if their time limit hasn\'t expired. That\'s why we recommend redeeming as soon as you see a code.'
          },
          {
            q: 'When does Garena release new codes?',
            a: 'New batches typically drop around server reset times — midnight IST for India, midnight WIB for Indonesia, midnight BRT for Brazil. Additional codes appear during live events, esports streams, and social media campaigns at unpredictable times. We check all sources every hour and publish new codes within minutes of detection.'
          },
          {
            q: 'Do Free Fire and Free Fire MAX use the same codes?',
            a: 'Yes, in most cases. Both games share the same account system, so a code that works for Free Fire also works for Free Fire MAX — and your rewards appear in both. Occasionally, Garena releases MAX-exclusive codes during special promotions, but these are rare and clearly labeled.'
          },
          {
            q: 'Can I use a VPN to redeem region-locked codes?',
            a: 'It won\'t help. Garena checks your account\'s registered server region, not your current IP address. If your account is on the India server, a VPN set to Brazil won\'t let you redeem Brazil-only codes. Using a VPN can actually cause login issues on the rewards site. Stick to codes tagged for your server.'
          },
        ].map(f => <FAQ key={f.q} q={f.q} a={f.a} />)}
      </div>
      <p className="text-sm text-t-body mt-4 text-center">
        Have more questions? Check our full <Link to="/faq" className="text-success underline hover:no-underline">FAQ page with 50+ answers</Link>.
      </p>
      <p className="text-[11px] text-t-muted mt-2 text-center font-tech">
        Written by <strong className="text-foreground">Jaxon Lee</strong> · Updated: {currentDate()}
      </p>
    </div>

    {/* JSON-LD FAQPage schema */}
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        { "@type": "Question", "name": "Are Free Fire redeem codes completely free?", "acceptedAnswer": { "@type": "Answer", "text": "Yes — 100% free. Garena releases them as part of promotions, events, and community rewards. You never need to pay, fill surveys, or download apps." } },
        { "@type": "Question", "name": "How many codes can I redeem per day?", "acceptedAnswer": { "@type": "Answer", "text": "There is no daily limit. Each specific code works once per account, but you can redeem as many different codes as are available." } },
        { "@type": "Question", "name": "Why does a code work for my friend but not for me?", "acceptedAnswer": { "@type": "Answer", "text": "You may be on different servers, the code may have hit its global cap, or you may have already used it before." } },
        { "@type": "Question", "name": "Do codes work on guest accounts?", "acceptedAnswer": { "@type": "Answer", "text": "No. You must link your account to Facebook, Google, Apple ID, VK, or Huawei ID before redeeming." } },
        { "@type": "Question", "name": "How long do codes stay active?", "acceptedAnswer": { "@type": "Answer", "text": "Most expire within 12–18 hours. Popular codes can be fully claimed within 2–4 hours due to redemption caps." } },
        { "@type": "Question", "name": "When does Garena release new codes?", "acceptedAnswer": { "@type": "Answer", "text": "New batches typically drop around server reset times. Additional codes appear during live events and social media campaigns." } },
        { "@type": "Question", "name": "Do Free Fire and Free Fire MAX use the same codes?", "acceptedAnswer": { "@type": "Answer", "text": "Yes, both games share the same account system so most codes work for both versions." } },
        { "@type": "Question", "name": "Can I use a VPN to redeem region-locked codes?", "acceptedAnswer": { "@type": "Answer", "text": "No. Garena checks your account's registered server region, not your IP. VPNs can cause login issues on the rewards site." } },
      ]
    }) }} />
  </section>
);

export default OnPageContent;
