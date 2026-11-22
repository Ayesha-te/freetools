export const site = {
  name: "FreeTools Hub",
  tagline: "Everything you need, all in one place.",
  description:
    "Free, fast and private online tools for images, PDFs, students, business, developers and writers. Most tools run entirely in your browser.",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, ""),
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "",
  apiUrl: (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, ""),
  gaId: process.env.NEXT_PUBLIC_GA_ID || "",
  gscVerification: process.env.NEXT_PUBLIC_GSC_VERIFICATION || "",
  lastUpdated: "2026-11-21",
};

export const ads = {
  enabled:
    process.env.NEXT_PUBLIC_ADSENSE_ENABLED === "true" && !!process.env.NEXT_PUBLIC_ADSENSE_CLIENT,
  client: process.env.NEXT_PUBLIC_ADSENSE_CLIENT || "",
  slots: {
    home: process.env.NEXT_PUBLIC_ADSENSE_SLOT_HOME || "",
    tool: process.env.NEXT_PUBLIC_ADSENSE_SLOT_TOOL || "",
    content: process.env.NEXT_PUBLIC_ADSENSE_SLOT_CONTENT || "",
  },
};

export function absUrl(path = "/") {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${site.url}${p.endsWith("/") ? p : `${p}/`}`.replace(/\/\/$/, "/");
}

export const ogImages = [{ url: "/og.png", width: 1200, height: 630, alt: "FreeTools Hub – Everything you need, all in one place" }];
