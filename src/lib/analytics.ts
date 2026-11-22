/**
 * Minimal, privacy-conscious analytics wrapper.
 * - Does nothing unless NEXT_PUBLIC_GA_ID is configured AND the visitor accepted cookies.
 * - Only aggregate event names and the tool slug are sent. Never file contents, text input or results.
 */
type Params = { tool?: string; category?: string; query_length?: number; result_count?: number };

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export const CONSENT_KEY = "fth-consent";
/** Window event that re-opens the cookie banner so visitors can change their choice. */
export const CONSENT_RESET_EVENT = "toolsprint:consent-reset";

export function getConsent(): "granted" | "denied" | null {
  try {
    const v = localStorage.getItem(CONSENT_KEY);
    return v === "granted" || v === "denied" ? v : null;
  } catch {
    return null;
  }
}

export function track(event: "tool_view" | "tool_start" | "tool_complete" | "tool_download" | "tool_copy" | "search", params: Params = {}) {
  if (typeof window === "undefined" || !window.gtag) return;
  if (getConsent() !== "granted") return;
  // Explicit allow-list of parameters so nothing sensitive leaks in.
  const safe: Params = {};
  if (params.tool) safe.tool = params.tool.slice(0, 60);
  if (params.category) safe.category = params.category.slice(0, 30);
  if (typeof params.query_length === "number") safe.query_length = params.query_length;
  if (typeof params.result_count === "number") safe.result_count = params.result_count;
  window.gtag("event", event, safe);
}
