import { useState } from 'react';
import { Header } from '@/components/ff/Header';
import { Footer } from '@/components/ff/Footer';
import { Link } from 'react-router-dom';
import { ArrowLeft, Search, ChevronUp, ChevronDown, HelpCircle } from 'lucide-react';
import { DEFAULT_URL, SITE_NAME } from '@/constants';
import { useSEO } from '@/hooks/useSEO';




interface FAQItem {
  id: number;
  question: string;
  answer: string;
  category: string;
}

const faqData: FAQItem[] = [
  // --- Free Fire Codes ---
  {
    id: 1,
    question: "What are Free Fire redeem codes?",
    answer: "Redeem codes are 12-character codes (mix of letters and numbers) released by Garena. You enter them on the official rewards site - reward.ff.garena.com - and get free stuff like diamonds, skins, emotes, and more sent straight to your in-game mail. We track these codes daily on our site so you don't have to hunt for them.",
    category: "codes"
  },
  {
    id: 2,
    question: "How often do you update the codes on this site?",
    answer: "We refresh our code list every hour. Our team monitors official Garena channels, social media drops, and community reports round the clock. If a new code goes live, it usually shows up here within minutes.",
    category: "codes"
  },
  {
    id: 3,
    question: "Are the codes on freefireredeemcodetoday.com legit?",
    answer: "Yes - every code listed here comes from official Garena sources like their social media pages, in-game events, and partner promotions. We never post fake or fan-made codes. Each one is verified by our team before it goes live on the site.",
    category: "codes"
  },
  {
    id: 4,
    question: "How many codes can I use per day?",
    answer: "There's no hard daily limit on how many different codes you can redeem, but each individual code only works once per account. So if we list 10 codes today, you can try all 10 - just know that popular ones get claimed fast.",
    category: "codes"
  },
  {
    id: 5,
    question: "Why did a code stop working so quickly?",
    answer: "Most codes have a limited number of redemptions (say, 500 or 1,000 uses globally). Once that cap is hit, the code expires for everyone. That's why we always say: redeem as soon as you see it. We mark expired codes clearly so you don't waste time.",
    category: "codes"
  },
  {
    id: 6,
    question: "What's the difference between Free Fire and Free Fire MAX codes?",
    answer: "In most cases, the same codes work for both Free Fire and Free Fire MAX since both games share the same account system. Occasionally Garena releases MAX-exclusive codes during special events, and we label those separately on our site.",
    category: "codes"
  },
  {
    id: 7,
    question: "When is the best time to check for new codes?",
    answer: "Garena typically drops new codes between 6–9 AM IST (during server resets) and around major event launches. We recommend checking our site first thing in the morning or right after a game update. You can also bookmark our homepage - it auto-refreshes with the latest codes.",
    category: "codes"
  },
  {
    id: 8,
    question: "Can redeem codes give me free diamonds?",
    answer: "Absolutely. Diamond codes are among the most common rewards - they can range from 100 to 2,000 diamonds per code. We tag diamond codes clearly on our homepage so they're easy to spot.",
    category: "codes"
  },

  // --- Redemption Process ---
  {
    id: 9,
    question: "How do I redeem a Free Fire code step by step?",
    answer: "Here's the quick version: 1) Go to reward.ff.garena.com, 2) Log in with the same account you use in-game (Facebook, Google, VK, etc.), 3) Paste the 12-character code in the text box, 4) Hit Confirm, 5) Open Free Fire and check your in-game mailbox. Rewards usually arrive within 5–30 minutes. We also have a detailed how-to guide on our site if you need screenshots.",
    category: "redemption"
  },
  {
    id: 10,
    question: "Can I redeem codes from my phone browser?",
    answer: "Yes, the Garena rewards site works fine on mobile browsers - Chrome, Safari, whatever you use. Just make sure you're logged into the same account linked to your game. No need to open the game first.",
    category: "redemption"
  },
  {
    id: 11,
    question: "Do I need to be logged into Free Fire to redeem a code?",
    answer: "You don't need the game open, but you do need to log in on the rewards website (reward.ff.garena.com) using the same method you use in-game - Facebook, Google, Apple ID, etc. After redeeming, open the game later to collect rewards from your mailbox.",
    category: "redemption"
  },
  {
    id: 12,
    question: "How long does it take for rewards to show up?",
    answer: "Usually 5 to 30 minutes. During peak hours (like right after a big event launch), it might take up to 24 hours. If you still don't see anything after 24 hours, double-check that you used the right login method.",
    category: "redemption"
  },
  {
    id: 13,
    question: "Where do I find my redeemed rewards in the game?",
    answer: "Open Free Fire, tap the mail icon (top-right corner on the lobby screen), and look under the 'Claim' tab. Items like skins or characters go directly to your vault/inventory, while diamonds are added to your balance automatically.",
    category: "redemption"
  },
  {
    id: 14,
    question: "Can I redeem codes without a Garena account?",
    answer: "You need some form of linked account - Facebook, Google, Apple ID, VK, or Huawei. Guest accounts can't redeem codes because there's no way to verify your identity on the rewards site. If you're on a guest account, link it to one of these platforms first in your game settings.",
    category: "redemption"
  },

  // --- Troubleshooting ---
  {
    id: 15,
    question: "Why does it say 'This code is invalid or redeemed'?",
    answer: "This usually means the code has already hit its redemption limit or has expired. It can also happen if you've already used that exact code before. Try a different code from our updated list - we remove expired ones regularly.",
    category: "troubleshooting"
  },
  {
    id: 16,
    question: "The code says 'not available for your region' - what now?",
    answer: "Some codes are region-locked (India only, Brazil only, etc.). We label region-specific codes on our site. If a code doesn't work for your server, scroll through our list - we usually have codes for multiple regions including India, Indonesia, Brazil, and Global servers.",
    category: "troubleshooting"
  },
  {
    id: 17,
    question: "I redeemed successfully but didn't get my reward. What do I do?",
    answer: "First, wait up to 24 hours - delays happen during high traffic. Check your in-game mailbox AND your inventory/vault (some items skip the mailbox). If it's still missing after 24 hours, contact Garena support with your player ID and a screenshot of the successful redemption.",
    category: "troubleshooting"
  },
  {
    id: 18,
    question: "Why can't I log in on the rewards website?",
    answer: "Make sure you're using the exact same login method as your game - if you play via Facebook login, use Facebook on the website too. Also try clearing your browser cache or using incognito mode. VPN users should disconnect first, as it can cause login issues.",
    category: "troubleshooting"
  },
  {
    id: 19,
    question: "I accidentally entered a code wrong. Can I retry?",
    answer: "Yes, just re-enter it correctly. There's no penalty for typos. We recommend copying the code directly from our site (tap the copy button) instead of typing it manually to avoid mistakes.",
    category: "troubleshooting"
  },
  {
    id: 20,
    question: "Codes work for my friend but not for me. Why?",
    answer: "A few possible reasons: different server regions, your account might have already used a similar code, or you might be hitting a temporary server issue. Try waiting a few minutes and retry. Also confirm you're both on the same server (India, Indonesia, etc.).",
    category: "troubleshooting"
  },
  {
    id: 21,
    question: "What should I do if the redemption site is down?",
    answer: "Garena's reward site occasionally goes down during maintenance or heavy traffic (especially during big events). Bookmark the page and try again in 15–30 minutes. The codes don't expire that fast, so you won't miss out.",
    category: "troubleshooting"
  },

  // --- Safety & Security ---
  {
    id: 22,
    question: "Is it safe to use redeem codes from this website?",
    answer: "100% safe. We only list codes that go through the official Garena redemption system at reward.ff.garena.com. We never ask for your password, never use third-party tools, and never modify game files. Your account stays completely secure.",
    category: "safety"
  },
  {
    id: 23,
    question: "Can I get banned for using redeem codes?",
    answer: "No. Redeem codes are an official feature built by Garena themselves. Using them is completely within the game's terms of service. You'd only risk a ban by using hacks, mods, or unofficial third-party generators - which we have nothing to do with.",
    category: "safety"
  },
  {
    id: 24,
    question: "Do you ask for my Free Fire password?",
    answer: "Never. We will never ask for your password, player ID, or any personal login details. All you need to do is visit the official Garena rewards site and log in there yourself. If any site asks for your password to 'redeem codes,' it's a scam.",
    category: "safety"
  },
  {
    id: 25,
    question: "How do I spot fake redeem code websites?",
    answer: "Red flags include: asking for your password, requiring you to download apps, showing 'human verification' surveys, promising unlimited diamonds, or codes longer/shorter than 12 characters. Stick to our site and the official Garena rewards page - that's all you need.",
    category: "safety"
  },
  {
    id: 26,
    question: "Do I need to pay anything to get codes here?",
    answer: "Nope, everything on our site is completely free. We don't have premium tiers, paid memberships, or any hidden charges. If someone's asking you to pay for Free Fire codes, walk away - legit codes are always free.",
    category: "safety"
  },

  // --- Google Play Codes ---
  {
    id: 27,
    question: "What are Google Play redeem codes?",
    answer: "Google Play redeem codes add credit to your Play Store account balance. You can use that balance to buy Free Fire diamonds, elite passes, or any in-app purchase without needing a credit card. We share working codes when they're available from official promotions.",
    category: "gprc"
  },
  {
    id: 28,
    question: "How do I redeem a Google Play code?",
    answer: "Open the Google Play Store app on your phone, tap your profile icon, select 'Payments & subscriptions' → 'Redeem gift code,' paste the code, and tap Redeem. The balance shows up instantly and you can use it right away for Free Fire purchases.",
    category: "gprc"
  },
  {
    id: 29,
    question: "Can I use Google Play balance to buy Free Fire diamonds?",
    answer: "Yes! Once the balance is in your Play Store account, open Free Fire, go to the diamond top-up section, and select Google Play as your payment method. The balance will be applied automatically.",
    category: "gprc"
  },
  {
    id: 30,
    question: "Do Google Play codes work in every country?",
    answer: "Most Google Play codes are region-specific. A code generated for India might not work in Indonesia or Brazil. We label the region for each code when available. If one doesn't work, try another from the list.",
    category: "gprc"
  },
  {
    id: 31,
    question: "Why did my Google Play code say 'already redeemed'?",
    answer: "Google Play codes are single-use - once someone else claims it, it's gone for everyone. These codes go fast, so redeem them as soon as you see them on our site.",
    category: "gprc"
  },
  {
    id: 32,
    question: "Are the Google Play codes on your site safe?",
    answer: "Yes. We only share codes from legitimate sources like official Google promotions, brand partnerships, and giveaways. They're redeemed through the official Google Play Store - no third-party apps needed.",
    category: "gprc"
  },

  // --- Rewards ---
  {
    id: 33,
    question: "What kind of rewards can I get from redeem codes?",
    answer: "The rewards vary - you can get free diamonds, weapon skins (AK47, M1014, AWM), character unlocks (like Alok or Chrono), emotes, pets, bundles, vouchers, and event-exclusive items. We list the exact reward next to each code so you know what you're getting.",
    category: "rewards"
  },
  {
    id: 34,
    question: "Are there codes for specific characters like DJ Alok?",
    answer: "Character codes do show up, but they're rare and usually tied to special events or collaborations. When they drop, they get claimed very fast. Keep an eye on our homepage - we highlight character codes prominently.",
    category: "rewards"
  },
  {
    id: 35,
    question: "Can I get legendary weapon skins from codes?",
    answer: "Yes, Garena occasionally releases codes for weapon skins - sometimes even legendary-tier ones. These are usually event-specific and have very limited redemptions, so speed matters.",
    category: "rewards"
  },
  {
    id: 36,
    question: "Do codes ever give pets or pet skins?",
    answer: "They do, though it's less common. Pet-related codes usually appear during pet-themed events. We tag these clearly so pet collectors can grab them quickly.",
    category: "rewards"
  },
  {
    id: 37,
    question: "What's the most valuable reward you've seen from a code?",
    answer: "We've tracked codes giving out 2,000+ diamonds, exclusive collaboration bundles, and even legendary character skins. The best drops usually happen during anniversary events and major game updates.",
    category: "rewards"
  },

  // --- Region / Server ---
  {
    id: 38,
    question: "Do all codes work on the Indian server?",
    answer: "Not all of them. Some codes are Global, some are region-locked to specific servers. We label each code with its server region (India, Indonesia, Brazil, Europe, etc.) so you can quickly find the ones that work for you.",
    category: "regions"
  },
  {
    id: 39,
    question: "I play on the Indonesia server. Do you have codes for me?",
    answer: "Yes, we track codes for all major servers including Indonesia, India, Brazil, Europe, and MENA. Use the server filter on our homepage to see codes specific to your region.",
    category: "regions"
  },
  {
    id: 40,
    question: "Can I use a VPN to redeem region-locked codes?",
    answer: "We don't recommend it. Garena checks your account's registered region, not your IP address. Using a VPN can actually cause login problems on the rewards site. Stick to codes meant for your server.",
    category: "regions"
  },

  // --- General / About ---
  {
    id: 41,
    question: "Who runs freefireredeemcodetoday.com?",
    answer: "We're an independent team of Free Fire players and gaming enthusiasts who've been playing since 2017. We built this site because we were tired of hunting through dozens of sources for working codes. We're not affiliated with Garena - just fans making life easier for the community.",
    category: "general"
  },
  {
    id: 42,
    question: "Are you affiliated with Garena or Free Fire officially?",
    answer: "No, we're completely independent. We're not sponsored by or partnered with Garena. All codes we list come from publicly available official sources. We just organize and verify them in one place for the community.",
    category: "general"
  },
  {
    id: 43,
    question: "How can I contact your team?",
    answer: "Head over to our Contact page - you can reach us through the form there or email us at contact@todayesports.com. We usually respond within 24–48 hours. We love hearing feedback and suggestions from the community.",
    category: "general"
  },
  {
    id: 44,
    question: "Do you have a mobile app?",
    answer: "Not a standalone app, but our website works great on mobile browsers and you can add it to your home screen for quick access (works like a PWA). We designed it mobile-first since most Free Fire players are on their phones.",
    category: "general"
  },
  {
    id: 45,
    question: "Can I share codes from your site with friends?",
    answer: "Of course! Just keep in mind that most codes have limited redemptions, so share quickly. You can copy any code with one tap and send it to your squad. The sooner everyone redeems, the better.",
    category: "general"
  },
  {
    id: 46,
    question: "Do you cover other games besides Free Fire?",
    answer: "Right now we're focused entirely on Free Fire and Free Fire MAX. We want to do one thing really well rather than spread thin across multiple games. We may expand in the future based on community demand.",
    category: "general"
  },
  {
    id: 47,
    question: "How do I stay updated with the latest codes?",
    answer: "The easiest way is to bookmark our homepage - it auto-updates with fresh codes throughout the day. You can also check back during server reset times (early morning IST) for the newest drops.",
    category: "general"
  },
  {
    id: 48,
    question: "Can I submit a code I found to your site?",
    answer: "We don't accept user-submitted codes at the moment to keep our quality standards high. But if you've found a working code from an official source, feel free to share it with us through our contact page and we'll verify it.",
    category: "general"
  },
  {
    id: 49,
    question: "How do I redeem codes on iPhone/iOS?",
    answer: "The process is the same - open Safari or Chrome, go to reward.ff.garena.com, log in with your linked account, and paste the code. iOS doesn't change anything about how redemption works since it's all browser-based.",
    category: "devices"
  },
  {
    id: 50,
    question: "Do codes work on PC (emulator) players?",
    answer: "Yes. Since codes are tied to your account and not your device, they work whether you play on Android, iOS, or PC via an emulator. Just make sure you redeem using the same login method linked to your game account.",
    category: "devices"
  },
];

const categories = [
  { id: 'all', name: 'All Questions' },
  { id: 'codes', name: 'Free Fire Codes' },
  { id: 'gprc', name: 'Google Play Codes' },
  { id: 'redemption', name: 'How to Redeem' },
  { id: 'troubleshooting', name: 'Troubleshooting' },
  { id: 'safety', name: 'Safety & Security' },
  { id: 'rewards', name: 'Rewards' },
  { id: 'regions', name: 'Regions & Servers' },
  { id: 'devices', name: 'Devices' },
  { id: 'general', name: 'General' },
];

const FAQ = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [openItems, setOpenItems] = useState<number[]>([1]);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useSEO({
    title: `Free Fire Redeem Code FAQ - 50+ Answers | ${SITE_NAME}`,
    description: 'Get answers to 50+ common questions about Free Fire redeem codes, how to redeem them, troubleshooting tips, and more. Updated daily.',
    path: '/faq',
  });


  const filteredFAQs = faqData.filter(item => {
    const matchesSearch = item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleItem = (id: number) => {
    setOpenItems(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const getCategoryCount = (catId: string) =>
    catId === 'all' ? faqData.length : faqData.filter(i => i.category === catId).length;

  // FAQ Schema for SEO - all questions included for Google rich results
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqData.map(item => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer
      }
    }))
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": DEFAULT_URL },
      { "@type": "ListItem", "position": 2, "name": "FAQ", "item": `${DEFAULT_URL}/faq` }
    ]
  };

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Free Fire Redeem Code FAQ",
    "description": "Get answers to 50+ common questions about Free Fire redeem codes, how to redeem them, troubleshooting tips, and more.",
    "url": `${DEFAULT_URL}/faq`,
    "isPartOf": { "@type": "WebSite", "name": SITE_NAME, "url": DEFAULT_URL },
    "breadcrumb": breadcrumbSchema
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-tech">
      {/* JSON-LD Schema for SEO */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />

      <Header />
      <main className="max-w-4xl mx-auto px-4 md:px-8 py-16">
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 text-sm uppercase tracking-widest transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-display uppercase tracking-tight text-foreground mb-4">
            Free Fire Redeem Code FAQ
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            50+ real answers from experienced Free Fire players. No fluff - just what you need to know about redeem codes, rewards, and troubleshooting.
          </p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
            <input
              type="text"
              placeholder="Search questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-accent focus:border-transparent"
              aria-label="Search FAQ questions"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="mb-8 flex flex-wrap gap-2 justify-center">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-accent text-accent-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {cat.name} ({getCategoryCount(cat.id)})
            </button>
          ))}
        </div>

        {/* FAQ Items */}
        <div className="space-y-3" itemScope itemType="https://schema.org/FAQPage">
          {filteredFAQs.length === 0 ? (
            <div className="text-center py-12">
              <HelpCircle className="mx-auto text-muted-foreground mb-4" size={48} />
              <h3 className="text-xl font-semibold text-foreground mb-2">No questions found</h3>
              <p className="text-muted-foreground">Try adjusting your search terms or category filter.</p>
            </div>
          ) : (
            filteredFAQs.map(item => (
              <div
                key={item.id}
                className="bg-card rounded-lg border border-border overflow-hidden"
                itemScope
                itemProp="mainEntity"
                itemType="https://schema.org/Question"
              >
                <button
                  onClick={() => toggleItem(item.id)}
                  className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-muted/50 transition-colors"
                  aria-expanded={openItems.includes(item.id)}
                >
                  <h3 className="font-semibold text-foreground pr-4" itemProp="name">{item.question}</h3>
                  {openItems.includes(item.id) ? (
                    <ChevronUp className="text-accent flex-shrink-0" size={20} />
                  ) : (
                    <ChevronDown className="text-muted-foreground flex-shrink-0" size={20} />
                  )}
                </button>
                <div
                  className={`${openItems.includes(item.id) ? '' : 'hidden'} px-6 pb-4`}
                  itemScope
                  itemProp="acceptedAnswer"
                  itemType="https://schema.org/Answer"
                >
                  <div className="border-t border-border pt-4">
                    <p className="text-muted-foreground leading-relaxed" itemProp="text" dangerouslySetInnerHTML={{ __html: item.answer.replace(/reward\.ff\.garena\.com/g, '<a href="https://reward.ff.garena.com" target="_blank" rel="noopener noreferrer" class="text-accent font-semibold underline hover:no-underline">reward.ff.garena.com</a>') }} />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Contact CTA */}
        <div className="mt-12 bg-accent/10 border border-accent/20 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-3">Still have questions?</h2>
          <p className="mb-6 text-muted-foreground">
            Can't find what you're looking for? Drop us a message and our team will get back to you.
          </p>
          <Link
            to="/contact"
            className="inline-block bg-accent text-accent-foreground px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            Contact Us
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FAQ;
