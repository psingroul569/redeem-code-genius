import { RedeemCode, FaqItem, Article, AuthorProfile, Testimonial, TrustMetric, Comment } from "./types";

export const SITE_NAME = "FF Redeem Codes Today";
export const DOMAIN = "freefireredeemcodetoday.com";

export const NAVIGATION_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: "📊" },
  { id: "competitors", label: "Competitor Gap", icon: "⚔️" },
  { id: "policy", label: "Google Policy", icon: "🛡️" },
  { id: "audit", label: "SEO Audit", icon: "🔍" },
  { id: "strategy", label: "Content Gen", icon: "✍️" },
  { id: "schema", label: "Schema Tool", icon: "🏗️" },
];

export const DEFAULT_KEYWORD = "Free Fire Redeem Code Today";
export const DEFAULT_URL = "https://freefireredeemcodetoday.com";

// --- NEW E-E-A-T DATA ---

export const LEAD_AUTHOR: AuthorProfile = {
  name: "Alex 'Falcon' Mercer",
  role: "Lead Game Economist & Rewards Analyst",
  experience: "7 Years (Since Beta 2017)",
  bio: "Alex is a Free Fire analyst and Community specialist with deep knowledge of Garena in-game event and update system. He specializes in analyzing event and new updates with patterns and predicting reward code drops 24 hours in advance. His Free Fire Redeem Code verification Process help gaming communities track accurate Free Fire updates and redeem codes.",
  badges: ["Ex-Garena Moderator", "Verified Wiki Contributor", "Esports Analyst"],
  image: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&q=80&w=200",
  socialHandle: "@FalconFF_Real",
};

export const TRUST_METRICS: TrustMetric[] = [
  { label: "Codes Verified", value: "42,800+", icon: "CheckCircle", description: "Since platform launch in 2023" },
  { label: "Community Trust", value: "98.5%", icon: "Shield", description: "Positive feedback on active codes" },
  { label: "Uptime", value: "99.9%", icon: "Zap", description: "Always ready for server resets" },
];

export const COMMUNITY_TESTIMONIALS: Testimonial[] = [
  {
    user: "DarkSlayer_99",
    rank: "Grandmaster",
    comment: "First site that actually updates HOURLY. Got the Titan Scar skin finally.",
    date: "2 hours ago",
    platform: "Discord",
  },
  {
    user: "Priya_Gaming",
    rank: "Heroic IV",
    comment: "The latency checker is a game changer. Stopped wasting time on EU codes.",
    date: "Yesterday",
    platform: "Twitter",
  },
  {
    user: "ProBooyahID",
    rank: "Elite",
    comment: "Accurate for Indonesia server. Terima kasih!",
    date: "12 hours ago",
    platform: "Reddit",
  },
];

export const MOCK_COMMENTS: Comment[] = [
  {
    id: "1",
    user: "KillerFrost",
    avatar: "https://i.pravatar.cc/150?u=a",
    text: "Confirmed working on IND server! Got the diamonds instantly.",
    timeAgo: "2m ago",
    verified: true,
  },
  {
    id: "2",
    user: "AlokMain_2025",
    avatar: "https://i.pravatar.cc/150?u=b",
    text: "Does not work for EU region, please fix.",
    timeAgo: "15m ago",
    verified: false,
  },
  {
    id: "3",
    user: "HeadshotKing",
    avatar: "https://i.pravatar.cc/150?u=c",
    text: "Finally a site that actually updates. Thanks admin!",
    timeAgo: "42m ago",
    verified: true,
  },
];

// ------------------------

export const ARTICLES: Article[] = [
  {
    id: "master-guide",
    title: "The Ultimate Free Fire Redeem Code Master Guide (2025 Edition)",
    slug: "master-guide-2025",
    category: "Pillar",
    excerpt: "A comprehensive technical analysis of Garena's reward infrastructure and redemption algorithms.",
    readTime: "12 min",
    icon: "Zap",
  },
  {
    id: "how-to-redeem",
    title: "How to Redeem Free Fire Codes in 5 Minutes",
    slug: "how-to-redeem-tutorial",
    category: "Walkthrough",
    excerpt: "Speed is everything. Learn the exact keystrokes and browser caching tricks pro players use.",
    readTime: "3 min",
    icon: "Clock",
  },
];

export const LIVE_CODES: RedeemCode[] = [
  {
    code: "FF11-NJN5-YS3E",
    slug: "ff11-njn5-ys3e-diamond-bundle",
    reward: "Season of Love Surfboard & 500 Diamonds",
    server: "Global / India",
    status: "Working",
    probability: 98,
    lastTested: "2 mins ago",
    releaseDate: "2025-05-28",
    description: "Verified diamond drop for the India server nodes.",
    recentClaims: 1243,
    likes: 850,
    dislikes: 12,
    category: "Diamond",
  },
  {
    code: "FF11-WFNP-P956",
    slug: "ff11-wfnp-p956-weapon-voucher",
    reward: "Killer Mind Surfboard & Weapon Royale Voucher",
    server: "Global / Indonesia",
    status: "Working",
    probability: 95,
    lastTested: "5 mins ago",
    releaseDate: "2025-05-28",
    description: "Exclusive Indonesian server weapon voucher.",
    recentClaims: 890,
    likes: 420,
    dislikes: 5,
    category: "Voucher",
  },
  {
    code: "FF11-644P-EP6H",
    slug: "ff11-644p-ep6h-vandal-revolt",
    reward: "Vandal Revolt Weapon Loot Crate",
    server: "India (IND)",
    status: "Working",
    probability: 92,
    lastTested: "12 mins ago",
    releaseDate: "2025-05-28",
    description: "Weapon loot crate containing Vandal Revolt skins.",
    recentClaims: 650,
    likes: 310,
    dislikes: 8,
    category: "Skin",
  },
  {
    code: "FF11-HHGC-GK3B",
    slug: "ff11-hhgc-gk3b-pumpkin-land",
    reward: "Pumpkin Land Surfboard & Moon Flip Emote",
    server: "Global / Brazil",
    status: "Working",
    probability: 89,
    lastTested: "15 mins ago",
    releaseDate: "2025-05-28",
    description: "Special event bundle for Brazil region survivors.",
    recentClaims: 432,
    likes: 210,
    dislikes: 20,
    category: "Bundle",
  },
  {
    code: "FF11-R1K3-7D2L",
    slug: "ff11-r1k3-7d2l-crystal-bundle",
    reward: "Crystal Soul Bundle (Top & Bottom)",
    server: "Global / Europe",
    status: "Working",
    probability: 94,
    lastTested: "8 mins ago",
    releaseDate: "2025-05-28",
    description: "High-rarity character cosmetic bundle.",
    recentClaims: 980,
    likes: 600,
    dislikes: 4,
    category: "Bundle",
  },
  {
    code: "FF11-DA7X-N2MK",
    slug: "ff11-da7x-n2mk-pet-food",
    reward: "10x Pet Food & Animal Royale Voucher",
    server: "Global / Mexico",
    status: "Working",
    probability: 97,
    lastTested: "22 mins ago",
    releaseDate: "2025-05-28",
    description: "Essential pet upgrade resources.",
    recentClaims: 230,
    likes: 120,
    dislikes: 1,
    category: "Pet",
  },
  {
    code: "FF11-9MB3-PFA5",
    slug: "ff11-9mb3-pfa5-custom-card",
    reward: "Custom Room Card & Name Change Card",
    server: "India (IND)",
    status: "Limited",
    probability: 65,
    lastTested: "45 mins ago",
    releaseDate: "2025-05-28",
    description: "Highly sought after utility cards. High traffic alert.",
    recentClaims: 2450,
    likes: 1200,
    dislikes: 400,
    category: "Voucher",
  },
  {
    code: "FF10-HXQB-1MNG",
    slug: "ff10-hxqb-1mng-magic-cube",
    reward: "1x Magic Cube Fragment & Gold Royale",
    server: "Global / Indonesia",
    status: "Working",
    probability: 91,
    lastTested: "1 hour ago",
    releaseDate: "2025-05-28",
    description: "Collect fragments for the Magic Cube store.",
    recentClaims: 560,
    likes: 280,
    dislikes: 10,
    category: "Voucher",
  },
  {
    code: "FF10-GCGX-RNHY",
    slug: "ff10-gcgx-rnhy-wasteland",
    reward: "Wasteland Roamer (Head) & 1000 Gold",
    server: "Global / India",
    status: "Working",
    probability: 88,
    lastTested: "1 hour ago",
    releaseDate: "2025-05-28",
    description: "Classic wasteland cosmetic for new players.",
    recentClaims: 340,
    likes: 150,
    dislikes: 15,
    category: "Skin",
  },
  {
    code: "FF10-617K-GUF9",
    slug: "ff10-617k-guf9-pink-guardian",
    reward: "Pink Guardian Top & Weapon Crate",
    server: "Global / Brazil",
    status: "Working",
    probability: 93,
    lastTested: "2 hours ago",
    releaseDate: "2025-05-28",
    description: "Rare Brazil exclusive guardian outfit.",
    recentClaims: 875,
    likes: 540,
    dislikes: 8,
    category: "Bundle",
  },
  {
    code: "FF11-K39B-ZX2Q",
    slug: "ff11-k39b-zx2q-justice-fighter",
    reward: "Justice Fighter Weapon Loot Crate",
    server: "Global / India",
    status: "Expired",
    probability: 0,
    lastTested: "3 hours ago",
    releaseDate: "2025-05-27",
    description: "Legacy code for historical tracking.",
    recentClaims: 0,
    likes: 12,
    dislikes: 580,
    category: "Skin",
  },
  {
    code: "FF11-MLP0-98WY",
    slug: "ff11-mlp0-98wy-titan-scar",
    reward: "Titan Scar Gun Skin (24h Trial)",
    server: "Global / Europe",
    status: "Working",
    probability: 96,
    lastTested: "5 mins ago",
    releaseDate: "2025-05-28",
    description: "Experience the legendary Titan Scar.",
    recentClaims: 3300,
    likes: 2100,
    dislikes: 5,
    category: "Skin",
  },
];

export const SEO_FAQS: FaqItem[] = [
  {
    question: "What is the Free Fire redeem code for today?",
    answer:
      "Today's top verified codes include FF11-NJN5-YS3E and FF11-WFNP-P956. These codes provide free Diamonds and legendary Surfboard skins.",
  },
  {
    question: "How do I redeem Free Fire codes?",
    answer:
      "1. Navigate to the official Garena Reward Site. 2. Authenticate using your linked account. 3. Input the 12-digit code. 4. Check in-game vault.",
  },
];

export const MOCK_CHART_DATA = [
  { name: "Mon", rank: 14 },
  { name: "Tue", rank: 12 },
  { name: "Wed", rank: 13 },
  { name: "Thu", rank: 10 },
  { name: "Fri", rank: 8 },
  { name: "Sat", rank: 9 },
  { name: "Sun", rank: 7 },
];
