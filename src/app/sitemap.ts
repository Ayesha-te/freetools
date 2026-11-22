import type { MetadataRoute } from "next";
import { categories, tools, toolHref, categoryHref } from "@/lib/tools/registry";
import { absUrl, site } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date(site.lastUpdated);
  const pages = ["/", "/tools/", "/about/", "/contact/", "/faq/", "/privacy-policy/", "/terms/", "/disclaimer/"];
  return [
    ...pages.map((p) => ({ url: absUrl(p), lastModified })),
    ...categories.map((c) => ({ url: absUrl(categoryHref(c.slug)), lastModified })),
    ...tools.map((t) => ({ url: absUrl(toolHref(t.slug)), lastModified })),
  ];
}
