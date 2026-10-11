import React, { useEffect, useRef } from "react";
import { ADSENSE_CLIENT } from "@/lib/ads";

/** Responsive AdSense display unit. Renders nothing until a slot ID is configured. */
export const AdSlot: React.FC<{ slot: string; className?: string }> = ({ slot, className = "" }) => {
  const pushed = useRef(false);

  useEffect(() => {
    if (!slot || pushed.current) return;
    pushed.current = true;
    try {
      const w = window as unknown as { adsbygoogle?: unknown[] };
      (w.adsbygoogle = w.adsbygoogle || []).push({});
    } catch {
      /* ad blocked */
    }
  }, [slot]);

  if (!slot) return null;

  return (
    <div className={`my-6 ${className}`}>
      <div className="text-[10px] uppercase tracking-[0.2em] text-t-muted font-bold mb-1">Advertisement</div>
      <ins
        className="adsbygoogle block"
        style={{ display: "block" }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
};
