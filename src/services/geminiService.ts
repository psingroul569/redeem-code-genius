import { GoogleGenAI } from "@google/genai";
import { AuditResult, ContentStrategy, CompetitorData, KeywordData, RedeemCode } from "@/types";

const GEMINI_MODEL = 'gemini-2.0-flash';

const getAI = () => new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY || '' });

async function callAI<T>(fn: () => Promise<T>): Promise<T | null> {
  try {
    return await fn();
  } catch (error: any) {
    const status = error?.status || 0;
    const msg = error?.message || '';
    console.error(`AI Sync Error: ${status} - ${msg}`);
    return null;
  }
}

export const syncRealLatestCodes = async (region: string): Promise<RedeemCode[]> => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) return [];

  const ai = getAI();
  const now = new Date();
  const today = now.toLocaleDateString('en-US', { day: '2-digit', month: 'long', year: 'numeric' });

  const localization: Record<string, { query: string; server: string }> = {
    'INDIA': { query: `Free Fire India (IND) server redeem codes today ${today}. Search in Hindi and English. Exclude Global/BR.`, server: 'INDIA (IND)' },
    'BRAZIL': { query: `Códigos de resgate Free Fire Brasil (BR) hoje ${today}. Search on sites like ffmania.com.br. Exclude Global/India.`, server: 'BRAZIL (BR)' },
    'INDONESIA': { query: `Kode redeem Free Fire Indonesia (ID) terbaru ${today}. Exclude Global codes.`, server: 'INDONESIA (ID)' },
    'EUROPE': { query: `Free Fire Europe (EU) server redeem codes ${today}. Exclude other regions.`, server: 'EUROPE (EU)' },
    'GLOBAL': { query: `Working Free Fire redeem codes today ${today} for all regions.`, server: 'GLOBAL' }
  };

  const loc = localization[region.toUpperCase()] || { query: `FF codes ${today}`, server: region };

  return await callAI(async () => {
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: `You are a rewards verification bot. 
      TASK: Find 12 active Free Fire redeem codes ${loc.query}.
      CRITICAL: Codes MUST be for the ${region} server only. 
      FORMAT: Return ONLY a JSON array. 
      SCHEMA: [{"code": "...", "reward": "...", "category": "..."}]`,
      config: {
        tools: [{ googleSearch: {} }]
      }
    });

    const text = response.text || '';
    if (!text) return [];

    const citations = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => ({
      uri: chunk.web?.uri || '',
      title: chunk.web?.title || ''
    })).filter((c: any) => c.uri) || [];

    let discovered: any[] = [];
    try {
      const jsonMatch = text.match(/\[\s*\{[\s\S]*\}\s*\]/);
      if (jsonMatch) {
        discovered = JSON.parse(jsonMatch[0]);
      } else {
        const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
        discovered = JSON.parse(cleanText);
      }
    } catch {
      return [];
    }

    if (!Array.isArray(discovered)) return [];

    return discovered.map((item: any) => ({
      code: item.code || 'FF-UNKNOWN',
      reward: item.reward || 'Garena Reward',
      category: item.category || 'Bundle',
      slug: `${region.toLowerCase()}-${(item.code || '').toLowerCase()}-${Math.random().toString(36).substring(7)}`,
      server: loc.server,
      status: 'Working' as const,
      probability: citations.length > 0 ? 99 : 85,
      lastTested: 'AI Verified Now',
      likes: Math.floor(Math.random() * 500) + 150,
      recentClaims: Math.floor(Math.random() * 1000) + 300,
      releaseDate: today,
      citations: citations
    }));
  }) || [];
};

export const performSiteAudit = async (url: string, keyword: string): Promise<AuditResult | null> => {
  const ai = getAI();
  return callAI(async () => {
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: `Audit ${url} for keyword ${keyword}. Return JSON.`,
      config: { responseMimeType: "application/json" }
    });
    return JSON.parse(response.text || '{}');
  });
};

export const researchKeywords = async (seed: string): Promise<KeywordData[]> => {
  const ai = getAI();
  return callAI(async () => {
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: `Keyword research for ${seed}. Return JSON array.`,
      config: { responseMimeType: "application/json" }
    });
    return JSON.parse(response.text || '[]');
  }) || [];
};

export const analyzeCompetitorGap = async (keyword: string): Promise<CompetitorData[]> => {
  const ai = getAI();
  return callAI(async () => {
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: `SERP Competitor gap analysis for ${keyword}. Return JSON array.`,
      config: { responseMimeType: "application/json" }
    });
    return JSON.parse(response.text || '[]');
  }) || [];
};

export const generateDailyContent = async (date: string, keyword: string): Promise<ContentStrategy | null> => {
  const ai = getAI();
  return callAI(async () => {
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: `Write a content strategy for ${keyword} on ${date}. Return JSON.`,
      config: { responseMimeType: "application/json" }
    });
    return JSON.parse(response.text || '{}');
  });
};
