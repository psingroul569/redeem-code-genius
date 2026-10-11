// Ads + conversion tracking for the /ff-guides web-app.
// Events go to the GTM dataLayer (GTM-PNGQVHGJ); Google Ads conversion tags
// (AW-18225438366) are attached to these events inside GTM, not in code.

export const ADSENSE_CLIENT = "ca-pub-4839187196632541";

// AdSense display ad unit slot IDs (AdSense → Ads → By ad unit → Display ads).
// Empty = slot renders nothing.
// One unit ("ffrewardsflow") for now; split per page later for per-page reporting.
const FFG_DISPLAY_SLOT = "6406114832";

export const AD_SLOTS = {
  splash: FFG_DISPLAY_SLOT,
  list: FFG_DISPLAY_SLOT,
  step: FFG_DISPLAY_SLOT,
  item: FFG_DISPLAY_SLOT,
  page: FFG_DISPLAY_SLOT,
};

// Google Ad Manager rewarded ad unit path, e.g. "/1234567/ffg_rewarded".
// AdSense alone has no rewarded format for websites; rewarded needs Ad Manager.
// Empty = the claim popup opens directly without a rewarded ad.
export const REWARDED_AD_UNIT = "";

export type TrackEvent =
  | "ffg_page_view"
  | "ffg_server_selected"
  | "ffg_level_selected"
  | "ffg_rank_selected"
  | "ffg_claim_open"
  | "tapzo_install_click"
  | "rewarded_ad_ready"
  | "rewarded_ad_shown"
  | "rewarded_ad_granted"
  | "rewarded_ad_closed"
  | `ffg_view_${string}`;

type DL = Record<string, unknown>[];

export function track(event: TrackEvent, params: Record<string, string | number | undefined> = {}) {
  const w = window as unknown as { dataLayer?: DL };
  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push({ event, ...params });
}

/* ---------- rewarded (Google Publisher Tag) ---------- */

type Googletag = {
  cmd: (() => void)[];
  pubads: () => {
    addEventListener: (name: string, cb: (e: { slot: unknown; makeRewardedVisible?: () => void }) => void) => void;
  };
  defineOutOfPageSlot: (path: string, format: unknown) => { addService: (s: unknown) => void } | null;
  enums: { OutOfPageFormat: { REWARDED: unknown } };
  enableServices: () => void;
  display: (slot: unknown) => void;
  destroySlots: (slots: unknown[]) => void;
};

let gptLoading: Promise<Googletag> | null = null;

function loadGpt(): Promise<Googletag> {
  if (gptLoading) return gptLoading;
  gptLoading = new Promise((resolve, reject) => {
    const w = window as unknown as { googletag?: Googletag };
    w.googletag = w.googletag || ({ cmd: [] } as unknown as Googletag);
    const s = document.createElement("script");
    s.async = true;
    s.src = "https://securepubads.g.doubleclick.net/tag/js/gpt.js";
    s.crossOrigin = "anonymous";
    s.onload = () => resolve(w.googletag as Googletag);
    s.onerror = reject;
    document.head.appendChild(s);
  });
  return gptLoading;
}

/**
 * Requests a rewarded ad. Resolves "granted" when the viewer earns the reward,
 * "closed" if they close early, or "unavailable" when there is no ad unit / no fill.
 */
export function showRewardedAd(context: Record<string, string>): Promise<"granted" | "closed" | "unavailable"> {
  if (!REWARDED_AD_UNIT) return Promise.resolve("unavailable");

  return new Promise((resolve) => {
    let settled = false;
    const done = (r: "granted" | "closed" | "unavailable") => {
      if (!settled) {
        settled = true;
        resolve(r);
      }
    };
    // No fill or blocked script: don't leave the user waiting.
    const timeout = window.setTimeout(() => done("unavailable"), 5000);

    loadGpt()
      .then((googletag) => {
        googletag.cmd.push(() => {
          const slot = googletag.defineOutOfPageSlot(REWARDED_AD_UNIT, googletag.enums.OutOfPageFormat.REWARDED);
          if (!slot) {
            window.clearTimeout(timeout);
            return done("unavailable");
          }
          slot.addService(googletag.pubads());
          const pubads = googletag.pubads();

          pubads.addEventListener("rewardedSlotReady", (e) => {
            if (e.slot !== slot) return;
            window.clearTimeout(timeout);
            track("rewarded_ad_ready", context);
            e.makeRewardedVisible?.();
            track("rewarded_ad_shown", context);
          });
          pubads.addEventListener("rewardedSlotGranted", (e) => {
            if (e.slot !== slot) return;
            track("rewarded_ad_granted", context);
            done("granted");
          });
          pubads.addEventListener("rewardedSlotClosed", (e) => {
            if (e.slot !== slot) return;
            track("rewarded_ad_closed", context);
            googletag.destroySlots([slot]);
            done("closed");
          });
          pubads.addEventListener("slotRenderEnded", (e) => {
            const ev = e as unknown as { slot: unknown; isEmpty: boolean };
            if (ev.slot === slot && ev.isEmpty) {
              window.clearTimeout(timeout);
              done("unavailable");
            }
          });

          googletag.enableServices();
          googletag.display(slot);
        });
      })
      .catch(() => {
        window.clearTimeout(timeout);
        done("unavailable");
      });
  });
}

/** Page type for a /ff-guides path, used as the per-page event suffix. */
export function guidePageType(pathname: string): string {
  const parts = pathname.replace(/\/+$/, "").split("/").slice(2); // after "ff-guides"
  if (parts.length === 0) return "home";
  if (parts.length === 1) return ["categories", "how-to", "privacy-policy", "disclaimer"].includes(parts[0]) ? parts[0].replace(/-/g, "_") : "category";
  if (parts.length === 2) return "item";
  return `step_${parts[2]}`;
}
