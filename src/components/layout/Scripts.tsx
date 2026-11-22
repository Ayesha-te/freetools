"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ads, site } from "@/lib/site";
import { CONSENT_KEY, CONSENT_RESET_EVENT, getConsent } from "@/lib/analytics";

/**
 * Loads Google Analytics and AdSense only when configured via environment variables.
 * Nothing loads before the visitor makes a choice. Analytics loads only after "Accept".
 * AdSense (when enabled) loads after a choice: personalised after "Accept",
 * non-personalised after "Reject non-essential". For EEA/UK/CH traffic, Google requires a
 * certified consent management platform — see ADSENSE-CHECKLIST.md.
 */
export default function Scripts() {
  const needsConsent = !!site.gaId || ads.enabled;
  const [consent, setConsent] = useState<"granted" | "denied" | null | "unknown">("unknown");

  useEffect(() => {
    setConsent(getConsent());
    const reopen = () => setConsent(null);
    window.addEventListener(CONSENT_RESET_EVENT, reopen);
    return () => window.removeEventListener(CONSENT_RESET_EVENT, reopen);
  }, []);

  function choose(v: "granted" | "denied") {
    try {
      localStorage.setItem(CONSENT_KEY, v);
    } catch {}
    setConsent(v);
  }

  if (!needsConsent) return null;

  return (
    <>
      {site.gaId && consent === "granted" && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(site.gaId)}`} strategy="afterInteractive" />
          <Script id="ga-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());gtag('config',${JSON.stringify(site.gaId)},{anonymize_ip:true});`}
          </Script>
        </>
      )}
      {ads.enabled && (consent === "granted" || consent === "denied") && (
        <>
          {consent !== "granted" && (
            <Script id="ads-npa" strategy="afterInteractive">{`(window.adsbygoogle=window.adsbygoogle||[]).requestNonPersonalizedAds=1;`}</Script>
          )}
          <Script
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(ads.client)}`}
            strategy="afterInteractive"
            crossOrigin="anonymous"
          />
        </>
      )}
      {consent === null && (
        <div role="dialog" aria-label="Cookie preferences" className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-2xl rounded-xl border border-border bg-surface p-4 shadow-lg sm:inset-x-6">
          <p className="text-sm text-ink-2">
            We use cookies for {site.gaId ? "anonymous usage statistics" : ""}
            {site.gaId && ads.enabled ? " and " : ""}
            {ads.enabled ? "advertising" : ""}. Your files and text are processed in your browser and are never included. See our{" "}
            <Link href="/privacy-policy/" className="text-primary underline">
              Privacy Policy
            </Link>
            .
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button onClick={() => choose("granted")} className="min-h-10 rounded-lg bg-primary px-4 text-sm font-medium text-white hover:bg-primary-hover">
              Accept
            </button>
            <button onClick={() => choose("denied")} className="min-h-10 rounded-lg border border-border-strong px-4 text-sm font-medium text-ink hover:bg-surface-2">
              Reject non-essential
            </button>
          </div>
        </div>
      )}
    </>
  );
}
