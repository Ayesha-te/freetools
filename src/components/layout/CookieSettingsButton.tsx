"use client";

import { ads, site } from "@/lib/site";
import { CONSENT_KEY, CONSENT_RESET_EVENT } from "@/lib/analytics";

/** Lets visitors change their cookie choice at any time. Hidden when no cookie-using service is enabled. */
export default function CookieSettingsButton() {
  if (!site.gaId && !ads.enabled) return null;
  return (
    <li>
      <button
        type="button"
        className="text-muted hover:text-primary"
        onClick={() => {
          try {
            localStorage.removeItem(CONSENT_KEY);
          } catch {}
          window.dispatchEvent(new Event(CONSENT_RESET_EVENT));
        }}
      >
        Cookie settings
      </button>
    </li>
  );
}
