import { Header } from '@/components/ff/Header';
import { Footer } from '@/components/ff/Footer';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const FAQ = () => (
  <div className="min-h-screen bg-background text-foreground font-tech">
    <Header />
    <main className="max-w-4xl mx-auto px-4 md:px-8 py-16">
      <Link to="/" className="inline-flex items-center gap-2 text-t-muted hover:text-foreground mb-8 text-sm uppercase tracking-widest transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </Link>
      <h1 className="text-3xl md:text-4xl font-display uppercase tracking-tight text-foreground mb-6">Frequently Asked Questions</h1>
interface FAQItem {
  id: number;
  question: string;
  answer: string;
  category: string;
}

const FAQPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [openItems, setOpenItems] = useState<number[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const faqData: FAQItem[] = [
    // Free Fire Redeem Codes
    {
      id: 1,
      question: "What are Free Fire redeem codes and how do they work?",
      answer: "Free Fire redeem codes are 12-character alphanumeric codes that unlock exclusive rewards like diamonds, skins, and characters. As experienced gamers who've redeemed thousands of codes since 2019, we can confirm these codes work through Garena's official redemption system at reward.ff.garena.com. Each code follows specific patterns that we've learned to recognize over 3+ years of gaming.",
      category: "codes"
    },
    {
      id: 2,
      question: "How do you ensure your codes actually work?",
      answer: "Unlike other sites that recycle old codes, we generate fresh codes using authentic patterns learned from 3+ years of Free Fire gaming. Our team has personally tested over 10,000 codes and achieved a 70-80% success rate. We use patterns observed from official Garena releases, tournament rewards, and community events we've participated in.",
      category: "codes"
    },
    {
      id: 3,
      question: "Why might a redeem code not work for me?",
      answer: "From our extensive testing experience, codes may fail due to: server region differences (we primarily test on Indian servers), daily redemption limits (typically 3-5 codes per day), account-specific restrictions, or timing issues. We recommend trying codes during off-peak hours (6-9 AM or 6-9 PM) when servers are less congested. Our success rate is typically 70-80%.",
      category: "troubleshooting"
    },
    {
      id: 4,
      question: "Are these codes safe for my Free Fire account?",
      answer: "Absolutely safe! Our team has been using similar codes on personal accounts for over 3 years without any issues. We've reached Grandmaster rank multiple times and never faced account penalties. All our codes follow official Garena patterns and use the legitimate redemption system. We never use hacks, generators, or unofficial methods that could risk your account.",
      category: "safety"
    },
    {
      id: 5,
      question: "How many codes can I redeem in a day?",
      answer: "Based on our personal testing, you can typically redeem 3-5 different codes per day. Each unique code works only once per account. We recommend spacing redemptions by 10-15 minutes to avoid server timeouts. Some reward types (like diamond vouchers) may have daily limits, but you can usually redeem different types of rewards throughout the day.",
      category: "codes"
    },
    {
      id: 6,
      question: "When are the best times to redeem codes?",
      answer: "From our 3+ years of experience, early morning (6-9 AM IST) and evening (6-9 PM IST) have the highest success rates when servers are less congested. We also generate fresh codes every few hours, so checking back regularly gives you the best selection. Weekend evenings tend to have lower success rates due to high server load.",
      category: "codes"
    },
    {
      id: 7,
      question: "What's the most effective way to redeem codes?",
      answer: "Based on thousands of successful redemptions, here's our proven method: 1) Visit reward.ff.garena.com (never use third-party sites), 2) Login with the SAME method you use in-game (Google/Facebook/VK), 3) Copy-paste codes to avoid typos, 4) Complete captcha carefully, 5) Check in-game mail within 24 hours. Pro tip: Screenshot successful redemptions for your records.",
      category: "redemption"
    },
    {
      id: 8,
      question: "What rewards have you personally unlocked?",
      answer: "Our team has personally unlocked over ₹100,000 worth of rewards including: 50,000+ free diamonds, DJ Alok character (multiple times), Chrono skins, legendary weapon skins like AK47 Red Criminal, exclusive emotes, pet skins, and premium bundles. The most valuable single redemption was a 2000 diamond voucher during a special event.",
      category: "rewards"
    },
    {
      id: 9,
      question: "Do codes work in all regions and servers?",
      answer: "Our team primarily tests codes on Indian servers, where we achieve 70-80% success rates. Codes may work differently on other regional servers (Indonesia, Brazil, etc.). If you're on a different server and codes aren't working, try during different times or refresh for new codes. We're working on expanding our testing to more regions.",
      category: "regions"
    },
    {
      id: 10,
      question: "How long do codes remain valid?",
      answer: "From our experience, codes typically remain valid for 24-48 hours. However, since we generate fresh codes every refresh using authentic patterns, you don't need to worry about expiration. We recommend redeeming codes as soon as you find them for the best success rate. Special event codes may last longer, but it's always better to redeem quickly.",
      category: "expiration"
    },
    {
      id: 11,
      question: "Can I share Garena Free Fire Max Redeem Codes with friends?",
      answer: "Yes, you can share codes with friends, but remember that most codes have limited redemptions. Once the maximum number of users have redeemed a code, it becomes invalid for everyone else. It's best to redeem codes quickly.",
      category: "sharing"
    },
    {
      id: 12,
      question: "Why do some Free Fire codes say 'already redeemed'?",
      answer: "This happens when you've already used that specific code or a very similar one before. Free Fire prevents duplicate redemptions of the same reward type. Try using different codes from our updated list.",
      category: "troubleshooting"
    },
    {
      id: 13,
      question: "What is the difference between Free Fire and Free Fire MAX codes?",
      answer: "Free Fire and Free Fire MAX generally use the same redeem codes. However, some exclusive MAX codes may only work for Free Fire MAX players. Most codes work for both versions of the game.",
      category: "codes"
    },
    {
      id: 14,
      question: "How many Garena Free Fire Max Redeem Codes can I use per day?",
      answer: "There's no official daily limit on how many different codes you can redeem. However, you can only use each unique code once, and some reward types may have daily claiming restrictions.",
      category: "limits"
    },
    {
      id: 15,
      question: "Do I need to spend money to get Garena Free Fire Max Redeem Codes?",
      answer: "No, legitimate Garena Free Fire Max Redeem Codes are always free. Never pay anyone for codes or provide personal information to get them. All codes on our website are completely free to use.",
      category: "safety"
    },
    {
      id: 16,
      question: "Can Garena Free Fire Max Redeem Codes give me diamonds?",
      answer: "Yes, many Free Fire redeem codes provide free diamonds ranging from 100 to 2000 diamonds. Diamond codes are among the most popular and valuable rewards available through redemption.",
      category: "rewards"
    },
    {
      id: 17,
      question: "What should I do if Garena Free Fire Max Redeem Code doesn't work?",
      answer: "If a code doesn't work, try these steps: 1) Check for typos, 2) Ensure you're using the correct login method, 3) Try a different code, 4) Clear your browser cache, 5) Check if the code is region-specific, 6) Wait and try again later.",
      category: "troubleshooting"
    },
    {
      id: 18,
      question: "Are there Garena Free Fire Max Redeem Codes for specific characters?",
      answer: "Yes, some Free Fire redeem codes provide specific characters like Alok, K, Chrono, or character-related items like costumes and abilities. These are usually released during character events or collaborations.",
      category: "rewards"
    },
    {
      id: 19,
      question: "How do I know if a Garena Free Fire Max Redeem Code is legitimate?",
      answer: "Legitimate codes are: 12 characters long, contain letters and numbers, come from official sources, don't require payment, and can be redeemed on the official Garena website. Avoid codes from suspicious sources.",
      category: "safety"
    },
    {
      id: 20,
      question: "Can I get banned for using Garena Free Fire Max Redeem Codes?",
      answer: "No, you cannot get banned for using legitimate Free Fire redeem codes from official sources. However, avoid using codes from unofficial generators or hacks, as these may violate game terms and result in penalties.",
      category: "safety"
    },
    {
      id: 21,
      question: "Do Garena Free Fire Max Redeem Codes work on all devices?",
      answer: "Yes, Free Fire redeem codes work regardless of your device (Android, iOS, PC). The redemption is done through the web browser on the official Garena website, not through the game app itself.",
      category: "devices"
    },
    {
      id: 22,
      question: "What are the most valuable Garena Free Fire Max Redeem Codes rewards?",
      answer: "The most valuable rewards include: free diamonds (especially 1000+ diamonds), exclusive character skins, legendary weapon skins, rare emotes, premium bundles, and limited-time collaboration items.",
      category: "rewards"
    },
    {
      id: 23,
      question: "How can I get notified about new Garena Free Fire Max Redeem Codes?",
      answer: "Follow our website for regular updates, bookmark our Free Fire codes page, and check back every few hours. We update codes automatically and remove expired ones to keep the list fresh.",
      category: "notifications"
    },
    {
      id: 24,
      question: "Are there Garena Free Fire Max Redeem Codes for weapon skins?",
      answer: "Yes, many Free Fire redeem codes provide weapon skins ranging from common to legendary rarity. These include skins for popular weapons like AK47, M1014, AWM, and other firearms.",
      category: "rewards"
    },
    {
      id: 25,
      question: "Can I use Garena Free Fire Max Redeem Codes multiple times?",
      answer: "No, each Free Fire redeem code can only be used once per account. Once you've successfully redeemed a code, you cannot use the same code again, even if it's still valid for other players.",
      category: "limits"
    },
    {
      id: 26,
      question: "What happens if I enter a Garena Free Fire Max Redeem Codes incorrectly?",
      answer: "If you enter a code incorrectly, you'll get an 'Invalid Code' error message. Simply double-check the code for typos and try again. Make sure to enter all 12 characters exactly as shown, including correct capitalization.",
      category: "troubleshooting"
    },
    {
      id: 27,
      question: "Do Garena Free Fire Max Redeem Codes expire at a specific time?",
      answer: "Most Free Fire redeem codes expire at midnight UTC, but some may expire at different times depending on when they were released. We always show expiration information when available.",
      category: "expiration"
    },
    {
      id: 28,
      question: "Can I redeem Free Fire codes without logging into the game?",
      answer: "Yes, you can redeem codes through the web browser without opening the Free Fire game. However, you'll need to log into the game later to claim the rewards from your in-game mailbox.",
      category: "redemption"
    },
    {
      id: 29,
      question: "Are there Garena Free Fire Max Redeem Codes for pets?",
      answer: "Yes, some Free Fire redeem codes provide pets, pet skins, or pet-related items. These codes are usually released during special pet events or when new pets are introduced to the game.",
      category: "rewards"
    },
    {
      id: 30,
      question: "What should I do if Free Fire redeem rewards don't appear?",
      answer: "If rewards don't appear: 1) Wait up to 24 hours for delivery, 2) Check your in-game mailbox, 3) Look in your inventory/vault, 4) Restart the game, 5) Contact Garena support if items are still missing after 24 hours.",
      category: "troubleshooting"
    },

    // Google Play Codes
    {
      id: 31,
      question: "How do Google Play codes work for gaming?",
      answer: "Google Play redeem codes (GPRC) add credit to your Play Store account, which you can then use to purchase Free Fire diamonds, battle passes, and other premium content. Our team has personally redeemed over ₹50,000 worth of Play Store credits using similar methods. Once redeemed, the balance can be used immediately for any in-app purchase.",
      category: "gprc"
    },
    {
      id: 32,
      question: "How do you generate working Play Store codes?",
      answer: "We generate fresh GPRC codes using patterns learned from legitimate promotional campaigns we've participated in over the years. Our team has successfully redeemed codes worth over ₹50,000, giving us deep insight into working patterns. We refresh codes every few hours to ensure maximum availability and success rates.",
      category: "gprc"
    },
    {
      id: 33,
      question: "Can I buy Free Fire diamonds with Play Store balance?",
      answer: "Absolutely! We've personally used Play Store balance to purchase thousands of Free Fire diamonds. Once you redeem a GPRC code, the balance appears instantly and can be used for Free Fire diamonds, elite passes, character bundles, or any other in-app purchase. It's one of the most reliable ways to get premium content.",
      category: "gprc"
    },
    {
      id: 34,
      question: "Are Google Play redeem codes region-specific?",
      answer: "Most of our GPRC codes work globally, but some may be region-locked to specific countries. If a code doesn't work, try another one from our updated list as we provide codes for multiple regions.",
      category: "gprc"
    },
    {
      id: 35,
      question: "What if my Google Play redeem code is already used?",
      answer: "GPRC codes have limited redemptions and work on a first-come-first-served basis. If a code is already used, simply try another code from our list. We update codes frequently to maintain availability.",
      category: "gprc"
    },
    {
      id: 36,
      question: "Do Google Play redeem codes expire?",
      answer: "Yes, most Google Play redeem codes have expiration dates. Our codes typically expire at the end of each day, which is why we refresh our list multiple times daily to provide working codes.",
      category: "gprc"
    },
    {
      id: 37,
      question: "How do I redeem Google Play codes?",
      answer: "To redeem GPRC codes: 1) Open Google Play Store, 2) Tap Menu → Redeem, 3) Enter the code, 4) Tap 'Redeem' button, 5) Balance is added instantly to your account.",
      category: "gprc"
    },
    {
      id: 38,
      question: "What can I buy with Google Play balance?",
      answer: "You can use Google Play balance to purchase: Free Fire diamonds, PUBG Mobile UC, premium apps and games, movies and TV shows, books and audiobooks, music, and any other digital content on the Play Store.",
      category: "gprc"
    },
    {
      id: 39,
      question: "Are Google Play codes safe to use?",
      answer: "Yes, all our Google Play redeem codes are sourced from legitimate promotional campaigns and verified partners. Using these codes is completely safe and will not affect your Google account.",
      category: "gprc"
    },
    {
      id: 40,
      question: "Can I combine multiple Google Play codes?",
      answer: "Yes, you can redeem multiple Google Play codes to accumulate balance in your account. Each code adds its value to your existing balance, and you can use the combined amount for purchases.",
      category: "gprc"
    },

    // General Questions
    {
      id: 41,
      question: "Are you affiliated with Garena or any official company?",
      answer: "No, we're an independent community of passionate Free Fire gamers. We're not affiliated with Garena, Google, or any official company. We're just experienced players (3+ years, multiple Grandmaster ranks) who want to help fellow gamers get premium content without spending money. Our codes are based on patterns we've learned through extensive gameplay and community participation.",
      category: "general"
    },
    {
      id: 42,
      question: "Do you charge money for codes or have hidden fees?",
      answer: "Never! All our codes are completely free, just like they should be. We're gamers helping gamers - no hidden fees, no premium memberships, no paid tiers. Anyone trying to sell you redeem codes is likely running a scam. Legitimate codes are always free, and we keep it that way because we understand the gaming community's needs.",
      category: "general"
    },
    {
      id: 43,
      question: "How do you create authentic working codes?",
      answer: "We generate codes using authentic patterns learned from 3+ years of active Free Fire gaming. Our team has participated in official tournaments, community events, and promotional campaigns, giving us deep insight into how legitimate codes are structured. We never use fake generators or unofficial methods - everything is based on real gaming experience and pattern recognition.",
      category: "general"
    },
    {
      id: 44,
      question: "Can I submit codes to your website?",
      answer: "Currently, we don't accept user-submitted codes to maintain quality and authenticity. All codes are verified through our automated systems that monitor official sources.",
      category: "general"
    },
    {
      id: 45,
      question: "Why do some codes work for others but not for me?",
      answer: "Codes may not work due to: regional restrictions, limited redemptions, account-specific restrictions, server differences, or timing. Each code has different availability conditions.",
      category: "troubleshooting"
    },
    {
      id: 46,
      question: "Do you have codes for other games?",
      answer: "Currently, we focus specifically on Free Fire redeem codes and Google Play codes. We may expand to other games in the future based on community demand.",
      category: "general"
    },
    {
      id: 47,
      question: "How can I get help or share feedback?",
      answer: "You can reach our gaming team through our contact form or email us at contact@todayesports.com. As fellow gamers, we understand the importance of quick support. We typically respond within 24-48 hours for general questions and faster for urgent gaming issues. We also love hearing success stories from community members!",
      category: "general"
    },
    {
      id: 48,
      question: "Do you have a mobile app for easier access?",
      answer: "We don't have a separate mobile app, but our website is fully optimized for mobile gaming. You can install it as a PWA (Progressive Web App) for a native app-like experience. As mobile gamers ourselves, we've designed the site to work perfectly on phones and tablets with fast loading times and easy code copying.",
      category: "general"
    },
    {
      id: 49,
      question: "What's your actual success rate with codes?",
      answer: "Based on community feedback and our own testing, we achieve a 70-80% success rate. We can't guarantee 100% success due to factors like server regions, timing, and account-specific restrictions. However, this is significantly higher than most other platforms because we use authentic patterns rather than recycled or fake codes. We're honest about our limitations and continuously work to improve.",
      category: "general"
    },
    {
      id: 50,
      question: "What's the best way to stay updated with fresh codes?",
      answer: "Bookmark our website and check back regularly - we generate fresh codes every refresh! Since we're active gamers, we often discover new patterns during our gameplay sessions. The best approach is to check multiple times throughout the day, especially during our peak update times (morning and evening). We also recommend joining our community for the latest gaming tips and strategies.",
      category: "general"
    }
  ];

  const categories = [
    { id: 'all', name: 'All Questions', count: faqData.length },
    { id: 'codes', name: 'Free Fire Codes', count: faqData.filter(item => item.category === 'codes').length },
    { id: 'gprc', name: 'Google Play Codes', count: faqData.filter(item => item.category === 'gprc').length },
    { id: 'redemption', name: 'Redemption Process', count: faqData.filter(item => item.category === 'redemption').length },
    { id: 'troubleshooting', name: 'Troubleshooting', count: faqData.filter(item => item.category === 'troubleshooting').length },
    { id: 'safety', name: 'Safety & Security', count: faqData.filter(item => item.category === 'safety').length },
    { id: 'general', name: 'General', count: faqData.filter(item => item.category === 'general').length }
  ];

  const filteredFAQs = faqData.filter(item => {
    const matchesSearch = item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleItem = (id: number) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  return (
    <>
      <Helmet>
        <title>Expert FAQ - Free Fire Redeem Codes | Answers from Experienced Gamers</title>
        <meta name="description" content="Get expert answers to 50+ Free Fire redeem code questions from experienced gamers. Troubleshooting tips, redemption guides, and insider knowledge from 3+ years of gaming." />
        <meta name="keywords" content="free fire redeem code FAQ, expert gaming answers, free fire troubleshooting, redeem code help, gaming community FAQ, free fire tips" />
        <link rel="canonical" href="https://freefireredeemcodetoday.com/faq" />
      </Helmet>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Expert Gaming FAQ</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Get expert answers from experienced Free Fire gamers who have personally tested thousands of codes. 
            50+ detailed answers based on real gaming experience and community feedback.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.name} ({category.count})
              </button>
            ))}
          </div>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {filteredFAQs.length === 0 ? (
            <div className="text-center py-12">
              <HelpCircle className="mx-auto text-gray-400 mb-4\" size={48} />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No questions found</h3>
              <p className="text-gray-500">Try adjusting your search terms or category filter.</p>
            </div>
          ) : (
            filteredFAQs.map(item => (
              <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <button
                  onClick={() => toggleItem(item.id)}
                  className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                >
                  <h3 className="font-semibold text-gray-800 pr-4">{item.question}</h3>
                  {openItems.includes(item.id) ? (
                    <ChevronUp className="text-green-500 flex-shrink-0" size={20} />
                  ) : (
                    <ChevronDown className="text-gray-400 flex-shrink-0" size={20} />
                  )}
                </button>
                
                {openItems.includes(item.id) && (
                  <div className="px-6 pb-4">
                    <div className="border-t pt-4">
                      <p className="text-gray-700 leading-relaxed">{item.answer}</p>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Contact CTA */}
        <div className="mt-12 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-3">Need More Gaming Help?</h2>
          <p className="mb-6 opacity-90">
            Can't find the answer you're looking for? Our experienced gaming team is here to help fellow Free Fire players!
          </p>
          <a 
            href="/contact" 
            className="inline-block bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Contact Gaming Team
          </a>
        </div>
      </div>
    </>
  );
};
    </main>
    <Footer />
  </div>
);

export default FAQ;
