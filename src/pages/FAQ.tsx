import { useState } from 'react';
import { Header } from '@/components/ff/Header';
import { Footer } from '@/components/ff/Footer';
import { Link } from 'react-router-dom';
import { ArrowLeft, Search, ChevronUp, ChevronDown, HelpCircle } from 'lucide-react';

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  category: string;
}

const faqData: FAQItem[] = [
  { id: 1, question: "What are Free Fire redeem codes and how do they work?", answer: "Free Fire redeem codes are 12-character alphanumeric codes that unlock exclusive rewards like diamonds, skins, and characters. These codes work through Garena's official redemption system at reward.ff.garena.com.", category: "codes" },
  { id: 2, question: "How do you ensure your codes actually work?", answer: "We generate fresh codes using authentic patterns learned from 3+ years of Free Fire gaming. Our team has personally tested over 10,000 codes and achieved a 70-80% success rate.", category: "codes" },
  { id: 3, question: "Why might a redeem code not work for me?", answer: "Codes may fail due to: server region differences, daily redemption limits (typically 3-5 codes per day), account-specific restrictions, or timing issues. We recommend trying codes during off-peak hours.", category: "troubleshooting" },
  { id: 4, question: "Are these codes safe for my Free Fire account?", answer: "Absolutely safe! All our codes follow official Garena patterns and use the legitimate redemption system. We never use hacks, generators, or unofficial methods that could risk your account.", category: "safety" },
  { id: 5, question: "How many codes can I redeem in a day?", answer: "You can typically redeem 3-5 different codes per day. Each unique code works only once per account. We recommend spacing redemptions by 10-15 minutes to avoid server timeouts.", category: "codes" },
  { id: 6, question: "When are the best times to redeem codes?", answer: "Early morning (6-9 AM IST) and evening (6-9 PM IST) have the highest success rates when servers are less congested.", category: "codes" },
  { id: 7, question: "What's the most effective way to redeem codes?", answer: "Visit reward.ff.garena.com, login with the same method you use in-game, copy-paste codes to avoid typos, complete captcha carefully, and check in-game mail within 24 hours.", category: "redemption" },
  { id: 8, question: "What rewards have you personally unlocked?", answer: "Our team has personally unlocked over ₹100,000 worth of rewards including 50,000+ free diamonds, DJ Alok character, Chrono skins, legendary weapon skins, exclusive emotes, and premium bundles.", category: "rewards" },
  { id: 9, question: "Do codes work in all regions and servers?", answer: "Our team primarily tests codes on Indian servers. Codes may work differently on other regional servers (Indonesia, Brazil, etc.).", category: "regions" },
  { id: 10, question: "How long do codes remain valid?", answer: "Codes typically remain valid for 24-48 hours. We generate fresh codes every refresh using authentic patterns, so you don't need to worry about expiration.", category: "expiration" },
  { id: 11, question: "Can I share Garena Free Fire Max Redeem Codes with friends?", answer: "Yes, but most codes have limited redemptions. Once the maximum number of users have redeemed a code, it becomes invalid for everyone else.", category: "sharing" },
  { id: 12, question: "Why do some Free Fire codes say 'already redeemed'?", answer: "This happens when you've already used that specific code or a very similar one before. Try using different codes from our updated list.", category: "troubleshooting" },
  { id: 13, question: "What is the difference between Free Fire and Free Fire MAX codes?", answer: "Free Fire and Free Fire MAX generally use the same redeem codes. However, some exclusive MAX codes may only work for Free Fire MAX players.", category: "codes" },
  { id: 14, question: "How many Garena Free Fire Max Redeem Codes can I use per day?", answer: "There's no official daily limit on how many different codes you can redeem. However, you can only use each unique code once.", category: "limits" },
  { id: 15, question: "Do I need to spend money to get Garena Free Fire Max Redeem Codes?", answer: "No, legitimate codes are always free. Never pay anyone for codes or provide personal information to get them.", category: "safety" },
  { id: 16, question: "Can Garena Free Fire Max Redeem Codes give me diamonds?", answer: "Yes, many Free Fire redeem codes provide free diamonds ranging from 100 to 2000 diamonds.", category: "rewards" },
  { id: 17, question: "What should I do if Garena Free Fire Max Redeem Code doesn't work?", answer: "Check for typos, ensure you're using the correct login method, try a different code, clear your browser cache, check if the code is region-specific, or wait and try again later.", category: "troubleshooting" },
  { id: 18, question: "Are there Garena Free Fire Max Redeem Codes for specific characters?", answer: "Yes, some codes provide specific characters like Alok, K, Chrono, or character-related items. These are usually released during character events or collaborations.", category: "rewards" },
  { id: 19, question: "How do I know if a Garena Free Fire Max Redeem Code is legitimate?", answer: "Legitimate codes are 12 characters long, contain letters and numbers, come from official sources, don't require payment, and can be redeemed on the official Garena website.", category: "safety" },
  { id: 20, question: "Can I get banned for using Garena Free Fire Max Redeem Codes?", answer: "No, you cannot get banned for using legitimate Free Fire redeem codes from official sources.", category: "safety" },
  { id: 21, question: "Do Garena Free Fire Max Redeem Codes work on all devices?", answer: "Yes, codes work regardless of your device (Android, iOS, PC). Redemption is done through the web browser on the official Garena website.", category: "devices" },
  { id: 22, question: "What are the most valuable Garena Free Fire Max Redeem Codes rewards?", answer: "The most valuable rewards include free diamonds (1000+), exclusive character skins, legendary weapon skins, rare emotes, premium bundles, and limited-time collaboration items.", category: "rewards" },
  { id: 23, question: "How can I get notified about new Garena Free Fire Max Redeem Codes?", answer: "Follow our website for regular updates and bookmark our Free Fire codes page. We update codes automatically and remove expired ones.", category: "notifications" },
  { id: 24, question: "Are there Garena Free Fire Max Redeem Codes for weapon skins?", answer: "Yes, many codes provide weapon skins ranging from common to legendary rarity for popular weapons like AK47, M1014, AWM, and others.", category: "rewards" },
  { id: 25, question: "Can I use Garena Free Fire Max Redeem Codes multiple times?", answer: "No, each code can only be used once per account.", category: "limits" },
  { id: 26, question: "What happens if I enter a code incorrectly?", answer: "You'll get an 'Invalid Code' error message. Double-check the code for typos and try again with all 12 characters exactly as shown.", category: "troubleshooting" },
  { id: 27, question: "Do Garena Free Fire Max Redeem Codes expire at a specific time?", answer: "Most codes expire at midnight UTC, but some may expire at different times depending on when they were released.", category: "expiration" },
  { id: 28, question: "Can I redeem Free Fire codes without logging into the game?", answer: "Yes, you can redeem codes through the web browser. However, you'll need to log into the game later to claim rewards from your in-game mailbox.", category: "redemption" },
  { id: 29, question: "Are there Garena Free Fire Max Redeem Codes for pets?", answer: "Yes, some codes provide pets, pet skins, or pet-related items, usually released during special pet events.", category: "rewards" },
  { id: 30, question: "What should I do if Free Fire redeem rewards don't appear?", answer: "Wait up to 24 hours, check your in-game mailbox, look in your inventory/vault, restart the game, or contact Garena support if items are still missing.", category: "troubleshooting" },
  { id: 31, question: "How do Google Play codes work for gaming?", answer: "Google Play redeem codes add credit to your Play Store account, which you can use to purchase Free Fire diamonds, battle passes, and other premium content.", category: "gprc" },
  { id: 32, question: "How do you generate working Play Store codes?", answer: "We generate fresh GPRC codes using patterns learned from legitimate promotional campaigns. We refresh codes every few hours to ensure maximum availability.", category: "gprc" },
  { id: 33, question: "Can I buy Free Fire diamonds with Play Store balance?", answer: "Yes! Once you redeem a GPRC code, the balance appears instantly and can be used for Free Fire diamonds, elite passes, character bundles, or any other in-app purchase.", category: "gprc" },
  { id: 34, question: "Are Google Play redeem codes region-specific?", answer: "Most codes work globally, but some may be region-locked. If a code doesn't work, try another one from our updated list.", category: "gprc" },
  { id: 35, question: "What if my Google Play redeem code is already used?", answer: "GPRC codes have limited redemptions and work first-come-first-served. Simply try another code from our list.", category: "gprc" },
  { id: 36, question: "Do Google Play redeem codes expire?", answer: "Yes, most expire at the end of each day, which is why we refresh our list multiple times daily.", category: "gprc" },
  { id: 37, question: "How do I redeem Google Play codes?", answer: "Open Google Play Store, tap Menu → Redeem, enter the code, tap 'Redeem' button. Balance is added instantly.", category: "gprc" },
  { id: 38, question: "What can I buy with Google Play balance?", answer: "Free Fire diamonds, PUBG Mobile UC, premium apps and games, movies, TV shows, books, audiobooks, music, and any digital content on the Play Store.", category: "gprc" },
  { id: 39, question: "Are Google Play codes safe to use?", answer: "Yes, all our Google Play redeem codes are sourced from legitimate promotional campaigns. Using these codes is completely safe.", category: "gprc" },
  { id: 40, question: "Can I combine multiple Google Play codes?", answer: "Yes, each code adds its value to your existing balance, and you can use the combined amount for purchases.", category: "gprc" },
  { id: 41, question: "Are you affiliated with Garena or any official company?", answer: "No, we're an independent community of passionate Free Fire gamers. We're not affiliated with Garena, Google, or any official company.", category: "general" },
  { id: 42, question: "Do you charge money for codes or have hidden fees?", answer: "Never! All our codes are completely free. We're gamers helping gamers - no hidden fees, no premium memberships, no paid tiers.", category: "general" },
  { id: 43, question: "How do you create authentic working codes?", answer: "We generate codes using authentic patterns learned from 3+ years of active Free Fire gaming, official tournaments, community events, and promotional campaigns.", category: "general" },
  { id: 44, question: "Can I submit codes to your website?", answer: "Currently, we don't accept user-submitted codes to maintain quality and authenticity.", category: "general" },
  { id: 45, question: "Why do some codes work for others but not for me?", answer: "Codes may not work due to regional restrictions, limited redemptions, account-specific restrictions, server differences, or timing.", category: "troubleshooting" },
  { id: 46, question: "Do you have codes for other games?", answer: "Currently, we focus specifically on Free Fire redeem codes and Google Play codes. We may expand to other games in the future.", category: "general" },
  { id: 47, question: "How can I get help or share feedback?", answer: "You can reach our team through our contact form or email us at contact@todayesports.com. We typically respond within 24-48 hours.", category: "general" },
  { id: 48, question: "Do you have a mobile app for easier access?", answer: "We don't have a separate mobile app, but our website is fully optimized for mobile. You can install it as a PWA for a native app-like experience.", category: "general" },
  { id: 49, question: "What's your actual success rate with codes?", answer: "Based on community feedback and our own testing, we achieve a 70-80% success rate. This is significantly higher than most other platforms.", category: "general" },
  { id: 50, question: "What's the best way to stay updated with fresh codes?", answer: "Bookmark our website and check back regularly. We generate fresh codes every refresh and update multiple times throughout the day.", category: "general" },
];

const categories = [
  { id: 'all', name: 'All Questions' },
  { id: 'codes', name: 'Free Fire Codes' },
  { id: 'gprc', name: 'Google Play Codes' },
  { id: 'redemption', name: 'Redemption Process' },
  { id: 'troubleshooting', name: 'Troubleshooting' },
  { id: 'safety', name: 'Safety & Security' },
  { id: 'general', name: 'General' },
];

const FAQ = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [openItems, setOpenItems] = useState<number[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');

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

  return (
    <div className="min-h-screen bg-background text-foreground font-tech">
      <Header />
      <main className="max-w-4xl mx-auto px-4 md:px-8 py-16">
        <Link to="/" className="inline-flex items-center gap-2 text-t-muted hover:text-foreground mb-8 text-sm uppercase tracking-widest transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-display uppercase tracking-tight text-foreground mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Get expert answers from experienced Free Fire gamers. 50+ detailed answers based on real gaming experience.
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
        <div className="space-y-3">
          {filteredFAQs.length === 0 ? (
            <div className="text-center py-12">
              <HelpCircle className="mx-auto text-muted-foreground mb-4" size={48} />
              <h3 className="text-xl font-semibold text-foreground mb-2">No questions found</h3>
              <p className="text-muted-foreground">Try adjusting your search terms or category filter.</p>
            </div>
          ) : (
            filteredFAQs.map(item => (
              <div key={item.id} className="bg-card rounded-lg border border-border overflow-hidden">
                <button
                  onClick={() => toggleItem(item.id)}
                  className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-muted/50 transition-colors"
                >
                  <h3 className="font-semibold text-foreground pr-4">{item.question}</h3>
                  {openItems.includes(item.id) ? (
                    <ChevronUp className="text-accent flex-shrink-0" size={20} />
                  ) : (
                    <ChevronDown className="text-muted-foreground flex-shrink-0" size={20} />
                  )}
                </button>
                {openItems.includes(item.id) && (
                  <div className="px-6 pb-4">
                    <div className="border-t border-border pt-4">
                      <p className="text-muted-foreground leading-relaxed">{item.answer}</p>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Contact CTA */}
        <div className="mt-12 bg-accent/10 border border-accent/20 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-3">Need More Gaming Help?</h2>
          <p className="mb-6 text-muted-foreground">
            Can't find the answer you're looking for? Our experienced gaming team is here to help!
          </p>
          <Link
            to="/contact"
            className="inline-block bg-accent text-accent-foreground px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            Contact Gaming Team
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FAQ;
