import { supabase } from "@/integrations/supabase/client";
import { RedeemCode } from "@/types";

export const codesSyncService = {
  /**
   * Get codes for a region. Tries current hour first, falls back to latest available hour.
   * NO API calls — purely reads from the database.
   */
  async getCodesByRegion(region: string): Promise<{ codes: RedeemCode[]; syncedAt: string | null; hourKey: string | null }> {
    const now = new Date();
    const currentHourKey = `${now.getUTCFullYear()}-${now.getUTCMonth()}-${now.getUTCDate()}-${now.getUTCHours()}`;

    // Try current hour first
    let result = await this.fetchCodesForHour(region, currentHourKey);
    if (result.codes.length > 0) return result;

    // Fallback: get the latest synced hour for this region
    const { data: latestLog } = await supabase
      .from('sync_log')
      .select('hour_key, synced_at')
      .eq('region', region)
      .order('synced_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (latestLog) {
      return await this.fetchCodesForHour(region, latestLog.hour_key);
    }

    return { codes: [], syncedAt: null, hourKey: null };
  },

  async fetchCodesForHour(region: string, hourKey: string): Promise<{ codes: RedeemCode[]; syncedAt: string | null; hourKey: string | null }> {
    const { data, error } = await supabase
      .from('synced_codes')
      .select('*')
      .eq('region', region)
      .eq('hour_key', hourKey)
      .order('synced_at', { ascending: false });

    if (error || !data || data.length === 0) {
      return { codes: [], syncedAt: null, hourKey: null };
    }

    const codes: RedeemCode[] = data.map((d: any) => ({
      code: d.code,
      reward: d.reward,
      category: d.category || 'Bundle',
      slug: d.slug,
      server: region,
      status: (d.status as 'Working' | 'Limited' | 'Expired') || 'Working',
      probability: d.probability || 85,
      lastTested: 'Cloud Verified',
      likes: d.likes || 0,
      recentClaims: d.recent_claims || 0,
      releaseDate: new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'long', year: 'numeric' }),
      citations: Array.isArray(d.citations) ? d.citations : [],
    }));

    return { codes, syncedAt: data[0].synced_at, hourKey };
  },

  /**
   * Get last sync time label for display
   */
  async getLastSyncTime(region: string): Promise<string> {
    const { data } = await supabase
      .from('sync_log')
      .select('synced_at')
      .eq('region', region)
      .order('synced_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!data) return 'WAITING';
    return new Date(data.synced_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  },
};
