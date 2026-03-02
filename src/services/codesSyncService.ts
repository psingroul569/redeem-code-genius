import { supabase } from "@/integrations/supabase/client";
import { RedeemCode } from "@/types";

type CodesPayload = { codes: RedeemCode[]; syncedAt: string | null; hourKey: string | null };

export const codesSyncService = {
  mapRowsToCodes(data: any[], region: string): RedeemCode[] {
    return data.map((d: any) => ({
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
  },

  /**
   * Fallback path for environments where direct /rest/v1 calls are blocked.
   */
  async fetchCodesViaFunction(region: string): Promise<CodesPayload | null> {
    try {
      const { data, error } = await supabase.functions.invoke('public-codes', { body: { region } });
      if (error || !data?.hourKey || !Array.isArray(data?.codes) || data.codes.length === 0) return null;

      return {
        codes: this.mapRowsToCodes(data.codes, region),
        syncedAt: data.syncedAt || null,
        hourKey: data.hourKey || null,
      };
    } catch {
      return null;
    }
  },

  /**
   * Get codes for a region. Tries current hour first, falls back to latest available hour.
   * If direct reads fail in browser network, falls back to backend function response.
   */
  async getCodesByRegion(region: string): Promise<CodesPayload> {
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
      result = await this.fetchCodesForHour(region, latestLog.hour_key);
      if (result.codes.length > 0) return result;
    }

    // Final fallback: read through backend function (avoids direct /rest path issues)
    const functionData = await this.fetchCodesViaFunction(region);
    if (functionData) return functionData;

    return { codes: [], syncedAt: null, hourKey: null };
  },

  async fetchCodesForHour(region: string, hourKey: string): Promise<CodesPayload> {
    const { data, error } = await supabase
      .from('synced_codes')
      .select('*')
      .eq('region', region)
      .eq('hour_key', hourKey)
      .order('synced_at', { ascending: false });

    if (error || !data || data.length === 0) {
      return { codes: [], syncedAt: null, hourKey: null };
    }

    return { codes: this.mapRowsToCodes(data, region), syncedAt: data[0].synced_at, hourKey };
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

    if (data?.synced_at) {
      return new Date(data.synced_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    const fallback = await this.fetchCodesViaFunction(region);
    if (fallback?.syncedAt) {
      return new Date(fallback.syncedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    return 'WAITING';
  },
};
