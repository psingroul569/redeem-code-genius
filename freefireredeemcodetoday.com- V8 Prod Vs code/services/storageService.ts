
import { Comment, RedeemCode } from "../types";
import { supabaseService } from "./supabaseService";

const STORAGE_KEYS = {
  CODES: 'ff_codes_v18',
  SYNC_LOG: 'ff_sync_log_v18', 
  SYNC_ATTEMPT: 'ff_sync_attempt_v18',
  SYNC_TIME: 'ff_sync_time_v18',
  COMMENTS_PREFIX: 'ff_comments_v18_'
};

export const storageService = {
  async getComments(codeSlug: string): Promise<Comment[]> {
    const key = `${STORAGE_KEYS.COMMENTS_PREFIX}${codeSlug}`;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  },

  async saveComment(codeSlug: string, comment: Comment): Promise<boolean> {
    try {
      const key = `${STORAGE_KEYS.COMMENTS_PREFIX}${codeSlug}`;
      const existing = await this.getComments(codeSlug);
      const updated = [comment, ...existing];
      localStorage.setItem(key, JSON.stringify(updated));
      return true;
    } catch (e) {
      return false;
    }
  },

  async shouldSyncRegion(region: string, hourKey: string, force = false): Promise<boolean> {
    const logData = localStorage.getItem(STORAGE_KEYS.SYNC_LOG);
    const logs = logData ? JSON.parse(logData) : {};
    
    // 1. If we have fresh codes for THIS hour locally, don't sync
    if (logs[region] === hourKey) return false;

    // 2. Try to pull from Cloud (if Supabase is set up)
    const globalCodes = await supabaseService.getGlobalCodes(region, hourKey);
    if (globalCodes && globalCodes.length > 0) {
      await this.saveSyncedData(region, hourKey, globalCodes, false);
      return false; 
    }

    // 3. Rate limiting for sync attempts
    const attemptData = localStorage.getItem(STORAGE_KEYS.SYNC_ATTEMPT);
    const attempts = attemptData ? JSON.parse(attemptData) : {};
    const lastAttempt = attempts[region] || 0;
    
    // Only allow retry every 10 minutes if not already synced
    const cooldown = 10 * 60 * 1000;
    if (Date.now() - lastAttempt < cooldown && !force) {
        return false;
    }

    return true;
  },

  markAttempt(region: string) {
    const attemptData = localStorage.getItem(STORAGE_KEYS.SYNC_ATTEMPT);
    const attempts = attemptData ? JSON.parse(attemptData) : {};
    attempts[region] = Date.now();
    localStorage.setItem(STORAGE_KEYS.SYNC_ATTEMPT, JSON.stringify(attempts));
  },

  async saveSyncedData(region: string, hourKey: string, codes: RedeemCode[], broadcast = true) {
    if (!codes || codes.length === 0) return false;

    try {
      const codesData = localStorage.getItem(STORAGE_KEYS.CODES);
      const allCodes = codesData ? JSON.parse(codesData) : {};
      allCodes[region] = codes;
      localStorage.setItem(STORAGE_KEYS.CODES, JSON.stringify(allCodes));

      const logData = localStorage.getItem(STORAGE_KEYS.SYNC_LOG);
      const logs = logData ? JSON.parse(logData) : {};
      logs[region] = hourKey;
      localStorage.setItem(STORAGE_KEYS.SYNC_LOG, JSON.stringify(logs));

      const timeData = localStorage.getItem(STORAGE_KEYS.SYNC_TIME);
      const times = timeData ? JSON.parse(timeData) : {};
      times[region] = Date.now();
      localStorage.setItem(STORAGE_KEYS.SYNC_TIME, JSON.stringify(times));
      
      if (broadcast) {
        await supabaseService.broadcastCodes(region, hourKey, codes);
      }
      return true;
    } catch (e) {
      return false;
    }
  },

  async getCodesByRegion(region: string): Promise<RedeemCode[]> {
    const codesData = localStorage.getItem(STORAGE_KEYS.CODES);
    let allCodes = codesData ? JSON.parse(codesData) : {};
    
    // Return local cache if available
    if (allCodes[region] && allCodes[region].length > 0) {
      return allCodes[region];
    }

    // Try cloud historical as second priority
    const latestFromCloud = await supabaseService.getLatestAvailableCodes(region);
    if (latestFromCloud && latestFromCloud.length > 0) {
      allCodes[region] = latestFromCloud;
      localStorage.setItem(STORAGE_KEYS.CODES, JSON.stringify(allCodes));
      return latestFromCloud;
    }

    return [];
  },

  async getLastSyncTime(region: string): Promise<string> {
    const timeData = localStorage.getItem(STORAGE_KEYS.SYNC_TIME);
    const times = timeData ? JSON.parse(timeData) : {};
    const ts = times[region];
    if (!ts) return 'NEVER';
    return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  },

  getGlobalStats() {
    return {
      totalStored: 12, 
      activeNodes: 5,
      latency: supabaseService.isConnected() ? "Supabase Active" : "Local Cache Mode",
      status: "Operational"
    };
  }
};
