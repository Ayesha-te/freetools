"use client";

import { useEffect, useRef } from "react";
import { ads } from "@/lib/site";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

/**
 * Reusable AdSense unit. Renders NOTHING unless ads are enabled via env vars and a slot ID
 * exists for this placement. When active it reserves a fixed min-height to prevent layout shift
 * and is clearly labelled "Advertisement" so it can't be confused with tool controls.
 */
export default function AdSlot({ placement, className = "" }: { placement: keyof typeof ads.slots; className?: string }) {
  const slot = ads.slots[placement];
  const ref = useRef<HTMLModElement>(null);
  const pushed = useRef(false);

  useEffect(() => {
    if (!ads.enabled || !slot || pushed.current) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch {
      /* ad blocked or script not loaded — fail silently */
    }
  }, [slot]);

  if (!ads.enabled || !slot) return null;

  return (
    <aside aria-label="Advertisement" className={`my-10 ${className}`}>
      <p className="mb-1 text-center text-[11px] uppercase tracking-wider text-muted">Advertisement</p>
      <div className="mx-auto flex min-h-[280px] w-full max-w-3xl items-center justify-center overflow-hidden rounded-lg border border-dashed border-border">
        <ins
          ref={ref}
          className="adsbygoogle block w-full"
          style={{ display: "block", minHeight: 250 }}
          data-ad-client={ads.client}
          data-ad-slot={slot}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    </aside>
  );
}
