/**
 * Minimal, privacy-conscious Google Analytics 4 wrapper (direct gtag.js, no Tag Manager).
 * - Does nothing unless a valid NEXT_PUBLIC_GA_MEASUREMENT_ID is configured AND the visitor accepted cookies.
 * - Page views (initial load AND Next.js client-side navigations) are sent by GA4 itself through the
 *   web stream's Enhanced Measurement ("page changes based on browser history events"). We do NOT send
 *   page_view manually: testing showed GA4 sends its own on load even with send_page_view:false, so a
 *   manual one would double-count every page.
 * - Custom events carry only allow-listed, non-personal parameters (event name, tool slug, counts).
 *   Never file contents, text input, form fields, e-mail addresses or results.
 */
type Params = { tool?: string; category?: string; query_length?: number; result_count?: number };

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
    [key: `ga-disable-${string}`]: boolean | undefined;
  }
}

export const CONSENT_KEY = "fth-consent";
/** Window event that re-opens the cookie banner so visitors can change their choice. */
export const CONSENT_RESET_EVENT = "toolsprint:consent-reset";

/** Returns the GA4 Measurement ID if it is well-formed (G-XXXXXXX), otherwise "". */
export function resolveMeasurementId(...candidates: (string | undefined)[]): string {
  for (const c of candidates) {
    const v = (c || "").trim().toUpperCase();
    if (/^G-[A-Z0-9]{4,20}$/.test(v)) return v;
  }
  return "";
}

export function getConsent(): "granted" | "denied" | null {
  try {
    const v = localStorage.getItem(CONSENT_KEY);
    return v === "granted" || v === "denied" ? v : null;
  } catch {
    return null;
  }
}

let initialisedId = "";

/**
 * Creates the gtag queue and configures GA4. Idempotent: calling it again (e.g. after the visitor
 * re-confirms consent) never adds a second `config`, so no duplicate tags or page views.
 * Google signals and ad-personalisation signals are disabled for analytics data.
 * Must only be called after the visitor accepted analytics.
 */
export function initAnalytics(id: string) {
  if (typeof window === "undefined" || !id) return;
  window[`ga-disable-${id}`] = false;
  if (initialisedId === id) {
    window.gtag?.("consent", "update", { analytics_storage: "granted" });
    return;
  }
  window.dataLayer = window.dataLayer || [];
  // gtag.js requires the `arguments` object itself to be queued.
  window.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer!.push(arguments);
  };
  window.gtag("consent", "default", {
    analytics_storage: "granted",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
  // The Tag Manager snippet in <head> already set a "denied" default; this update grants analytics for it too.
  window.gtag("consent", "update", { analytics_storage: "granted" });
  window.gtag("js", new Date());
  window.gtag("config", id, {
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
  });
  initialisedId = id;
}

/** Stops all GA4 collection immediately (used when consent is withdrawn or rejected). */
export function disableAnalytics(id: string) {
  if (typeof window === "undefined" || !id) return;
  window[`ga-disable-${id}`] = true;
  window.gtag?.("consent", "update", { analytics_storage: "denied" });
}

function canSend(): boolean {
  return typeof window !== "undefined" && !!window.gtag && !!initialisedId && getConsent() === "granted" && !window[`ga-disable-${initialisedId}`];
}

export function track(event: "tool_view" | "tool_start" | "tool_complete" | "tool_download" | "tool_copy" | "search", params: Params = {}) {
  if (!canSend()) return;
  // Explicit allow-list of parameters so nothing sensitive leaks in.
  const safe: Params = {};
  if (params.tool) safe.tool = params.tool.slice(0, 60);
  if (params.category) safe.category = params.category.slice(0, 30);
  if (typeof params.query_length === "number") safe.query_length = params.query_length;
  if (typeof params.result_count === "number") safe.result_count = params.result_count;
  window.gtag!("event", event, safe);
}

/** Test helper: resets module state between tests. */
export function __resetAnalyticsForTests() {
  initialisedId = "";
}
