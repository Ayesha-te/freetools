import { describe, it, expect, beforeEach } from "vitest";
import {
  CONSENT_KEY,
  resolveMeasurementId,
  initAnalytics,
  disableAnalytics,
  track,
  __resetAnalyticsForTests,
} from "@/lib/analytics";

const ID = "G-HX5YM8P22D";

// Minimal browser globals for the node test environment.
function setupWindow(consent: "granted" | "denied" | null) {
  const store = new Map<string, string>();
  if (consent) store.set(CONSENT_KEY, consent);
  (globalThis as Record<string, unknown>).localStorage = {
    getItem: (k: string) => store.get(k) ?? null,
    setItem: (k: string, v: string) => void store.set(k, v),
    removeItem: (k: string) => void store.delete(k),
  };
  const w = { location: { origin: "https://toolsprint.xyz" } } as unknown as Window;
  (globalThis as Record<string, unknown>).window = w;
  return { w, store };
}
/** All gtag commands queued so far, as plain arrays. */
const queue = (w: Window) => (w.dataLayer ?? []).map((a) => Array.from(a as ArrayLike<unknown>));
const events = (w: Window, name?: string) => queue(w).filter((c) => c[0] === "event" && (!name || c[1] === name));

beforeEach(() => __resetAnalyticsForTests());

describe("resolveMeasurementId", () => {
  it("accepts the configured GA4 ID and falls back to the legacy variable", () => {
    expect(resolveMeasurementId(ID)).toBe(ID);
    expect(resolveMeasurementId(undefined, " g-hx5ym8p22d ")).toBe(ID);
    expect(resolveMeasurementId(undefined, "")).toBe("");
  });
  it("rejects anything that is not a GA4 measurement ID (e.g. GTM or UA IDs)", () => {
    expect(resolveMeasurementId("GTM-ABC123")).toBe("");
    expect(resolveMeasurementId("UA-12345-1")).toBe("");
    expect(resolveMeasurementId("G-<script>")).toBe("");
  });
});

describe("consent", () => {
  it("sends nothing before the visitor has made a choice", () => {
    const { w } = setupWindow(null);
    track("tool_view", { tool: "word-counter" });
    expect(w.gtag).toBeUndefined();
    expect(w.dataLayer).toBeUndefined();
  });

  it("sends nothing when analytics is rejected", () => {
    const { w } = setupWindow("denied");
    disableAnalytics(ID);
    track("tool_complete", { tool: "pdf-merger" });
    expect(w.dataLayer ?? []).toHaveLength(0);
    expect(w[`ga-disable-${ID}`]).toBe(true);
  });

  it("initialises GA4 exactly once after acceptance, with ad signals disabled", () => {
    const { w } = setupWindow("granted");
    initAnalytics(ID);
    initAnalytics(ID); // re-accepting must not configure twice
    const configs = queue(w).filter((c) => c[0] === "config");
    expect(configs).toHaveLength(1);
    expect(configs[0]).toEqual(["config", ID, { allow_google_signals: false, allow_ad_personalization_signals: false }]);
    expect(queue(w).filter((c) => c[0] === "js")).toHaveLength(1);
    // page views come from GA4 Enhanced Measurement, never from our code (prevents double counting)
    expect(events(w, "page_view")).toHaveLength(0);
    const def = queue(w).find((c) => c[0] === "consent" && c[1] === "default");
    expect(def?.[2]).toMatchObject({ analytics_storage: "granted", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" });
    expect(w[`ga-disable-${ID}`]).toBe(false);
  });

  it("stops collection immediately when consent is withdrawn, and resumes on re-acceptance", () => {
    const { w, store } = setupWindow("granted");
    initAnalytics(ID);
    track("tool_view", { tool: "a" });

    store.set(CONSENT_KEY, "denied");
    disableAnalytics(ID);
    expect(w[`ga-disable-${ID}`]).toBe(true);
    expect(queue(w).at(-1)).toEqual(["consent", "update", { analytics_storage: "denied" }]);
    track("tool_view", { tool: "x" });
    expect(events(w)).toHaveLength(1); // only the event from before withdrawal

    store.set(CONSENT_KEY, "granted");
    initAnalytics(ID);
    expect(w[`ga-disable-${ID}`]).toBe(false);
    expect(queue(w).filter((c) => c[0] === "config")).toHaveLength(1);
    expect(queue(w).at(-1)).toEqual(["consent", "update", { analytics_storage: "granted" }]);
    track("tool_view", { tool: "b" });
    expect(events(w)).toHaveLength(2);
  });

  it("does not send if the stored choice is cleared (banner reopened) while GA is loaded", () => {
    const { store } = setupWindow("granted");
    const { w } = { w: window };
    initAnalytics(ID);
    store.delete(CONSENT_KEY);
    track("tool_view", { tool: "faq" });
    expect(events(w)).toHaveLength(0);
  });
});

describe("custom events", () => {
  it("only carry allow-listed, non-personal parameters", () => {
    const { w } = setupWindow("granted");
    initAnalytics(ID);
    track("search", { query_length: 5, result_count: 3, ...({ query: "my secret", email: "a@b.c" } as object) });
    const [ev] = events(w, "search");
    expect(ev[2]).toEqual({ query_length: 5, result_count: 3 });
  });
});
