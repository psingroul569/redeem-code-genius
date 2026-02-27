export interface PolicyCheck {
  id: string;
  name: string;
  status: 'Pass' | 'Warning' | 'Fail';
  description: string;
  remedy: string;
}

export interface CompetitorDeepDive {
  domain: string;
  strengths: string[];
  weaknesses: string[];
  rankingStrategy: string;
}

export interface VerificationLog {
  timestamp: string;
  status: string;
  node: string;
}

export interface RedeemCode {
  code: string;
  slug: string;
  reward: string;
  server: string;
  status: 'Working' | 'Limited' | 'Expired';
  probability: number;
  lastTested: string;
  description?: string;
  releaseDate?: string;
  sourceUrl?: string;
  verificationLogs?: VerificationLog[];
  recentClaims?: number;
  likes?: number;
  dislikes?: number;
  category?: 'Diamond' | 'Skin' | 'Bundle' | 'Voucher' | 'Pet';
  citations?: { uri: string; title: string }[];
}

export interface Comment {
  id: string;
  user: string;
  avatar: string;
  text: string;
  timeAgo: string;
  verified: boolean;
  timestamp?: number;
  isAi?: boolean;
  likes?: number;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface SeoMeta {
  currentDate: string;
  currentTime: string;
}

export type AppView = 'home' | 'content' | 'article' | 'dashboard' | 'audit' | 'strategy' | 'schema' | 'competitors' | 'keywords' | 'code-detail' | 'policy';

export interface AuditAction {
  priority: 'High' | 'Medium' | 'Low';
  task: string;
  impact: string;
}

export interface AuditResult {
  score: number;
  summary: string;
  technicalIssues: string[];
  contentGaps: string[];
  actionPlan: AuditAction[];
}

export interface ContentStrategy {
  title: string;
  metaDescription: string;
  hook: string;
  h1: string;
  h2s: string[];
  keyPhrases: string[];
}

export interface CompetitorData {
  rank: number;
  domain: string;
  da: number;
  backlinks: string;
  wordCount: number;
  primaryGap: string;
  schemaUsed: string[];
}

export interface KeywordData {
  keyword: string;
  volume: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  intent: 'Transactional' | 'Informational';
  serpFeature: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  readTime: string;
  icon: string;
}

export interface AuthorProfile {
  name: string;
  role: string;
  experience: string;
  bio: string;
  badges: string[];
  image: string;
  socialHandle: string;
}

export interface Testimonial {
  user: string;
  rank: string;
  comment: string;
  date: string;
  platform: 'Discord' | 'Twitter' | 'Reddit';
}

export interface TrustMetric {
  label: string;
  value: string;
  icon: string;
  description: string;
}
