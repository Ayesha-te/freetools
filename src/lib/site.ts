const DEFAULT_SITE_URL = "https://toolsprint.xyz";

/**
 * Canonical site origin. Set NEXT_PUBLIC_SITE_URL to change domains.
 * Temporary *.vercel.app hosts are ignored so canonicals, sitemap and Open Graph URLs
 * never point at a preview/deployment domain.
 */
export function resolveSiteUrl(raw: string | undefined): string {
  const v = (raw || "").trim().replace(/\/+$/, "");
  if (!/^https?:\/\/[^/]+$/.test(v) || /\.vercel\.app$/i.test(v)) return DEFAULT_SITE_URL;
  return v;
}

export const site = {
  name: "ToolSprint",
  tagline: "Free Online Tools. Fast, Simple, Secure.",
  description:
    "Free, fast and private online tools for images, PDFs, students, business, developers and writers. Most tools run entirely in your browser.",
  url: resolveSiteUrl(process.env.NEXT_PUBLIC_SITE_URL),
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "",
  apiUrl: (process.env.NEXT_PUBLIC_API_URL || "https://free.stride-events.net").replace(/\/$/, ""),
  gaId: process.env.NEXT_PUBLIC_GA_ID || "",
  gscVerification: process.env.NEXT_PUBLIC_GSC_VERIFICATION || "",
  lastUpdated: "2026-11-22",
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

export const ogImages = [{ url: "/og.png", width: 1200, height: 630, alt: "ToolSprint – free online tools for files and figures: images, PDFs, calculators, developer and SEO tools" }];

/**
 * Builds consistent page metadata: title, description, canonical URL, Open Graph and Twitter/X card.
 * `absolute` skips the "| ToolSprint" suffix (use when the title already contains the brand).
 */
export function pageMeta(opts: { title: string; description: string; path: string; absolute?: boolean }) {
  const full = opts.absolute ? opts.title : `${opts.title} | ${site.name}`;
  return {
    title: opts.absolute ? { absolute: opts.title } : opts.title,
    description: opts.description,
    alternates: { canonical: opts.path },
    openGraph: {
      type: "website" as const,
      siteName: site.name,
      locale: "en_US",
      title: full,
      description: opts.description,
      url: opts.path,
      images: ogImages,
    },
    twitter: { card: "summary_large_image" as const, title: full, description: opts.description, images: ogImages.map((i) => i.url) },
  };
}
