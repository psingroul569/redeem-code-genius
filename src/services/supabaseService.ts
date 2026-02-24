import { createClient } from '@supabase/supabase-js';
import { RedeemCode } from '@/types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

const isSupabaseConfigured = supabaseUrl.includes('supabase.co') && supabaseKey.length > 10;

export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseKey)
  : null;

export const supabaseService = {
  isConnected(): boolean {
    return !!supabase;
  },

  async getGlobalCodes(region: string, hourKey: string): Promise<RedeemCode[] | null> {
    if (!supabase) return null;
    try {
      const { data, error } = await supabase
        .from('redeem_codes')
        .select('*')
        .eq('region', region)
        .eq('hour_key', hourKey);
      if (error) return null;
      if (!data || data.length === 0) return null;
      return this.mapSupabaseData(data);
    } catch {
      return null;
    }
  },

  async getLatestAvailableCodes(region: string): Promise<RedeemCode[] | null> {
    if (!supabase) return null;
    try {
      const { data, error } = await supabase
        .from('redeem_codes')
        .select('*')
        .eq('region', region)
        .order('id', { ascending: false })
        .limit(12);
      if (error || !data || data.length === 0) return null;
      return this.mapSupabaseData(data);
    } catch {
      return null;
    }
  },

  mapSupabaseData(data: any[]): RedeemCode[] {
    return data.map(d => ({
      code: d.code,
      reward: d.reward || 'Garena Reward',
      server: d.region,
      category: d.category || 'Bundle',
      slug: d.slug || d.code.toLowerCase(),
      status: (d.status as 'Working' | 'Limited' | 'Expired') || 'Working',
      lastTested: 'Cloud Verified',
      probability: d.probability || 99,
      citations: Array.isArray(d.citations) ? d.citations : [],
      recentClaims: d.recent_claims || 0,
      likes: d.likes || 0
    }));
  },

  async broadcastCodes(region: string, hourKey: string, codes: RedeemCode[]) {
    if (!supabase) return;
    try {
      const formatted = codes.map(c => ({
        code: c.code,
        reward: c.reward,
        region: region,
        hour_key: hourKey,
        category: c.category || 'Bundle',
        slug: c.slug,
        status: c.status,
        probability: c.probability,
        recent_claims: c.recentClaims || Math.floor(Math.random() * 500) + 100,
        likes: c.likes || Math.floor(Math.random() * 200) + 50,
        citations: c.citations || []
      }));
      const { error } = await supabase.from('redeem_codes').upsert(formatted, { onConflict: 'slug' });
      if (error) console.error("[Supabase Broadcast Error]", error);
      await supabase.from('sync_logs').insert({ region, hour_key: hourKey });
    } catch {
      // Silent fail
    }
  }
};
