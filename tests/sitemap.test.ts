import { describe, it, expect } from "vitest";
import { existsSync, readdirSync } from "node:fs";
import path from "node:path";
import sitemap from "@/app/sitemap";
import { categories, tools } from "@/lib/tools/registry";

const app = path.join(__dirname, "..", "src", "app");
const urls = sitemap().map((e) => e.url);
const paths = urls.map((u) => u.replace(/^https:\/\/[^/]+/, ""));

describe("sitemap.xml", () => {
  it("lists 61 unique URLs on the canonical root domain", () => {
    expect(urls.length).toBe(61);
    expect(new Set(urls).size).toBe(urls.length);
    for (const u of urls) expect(u).toMatch(/^https:\/\/toolsprint\.xyz\/([a-z0-9-]+\/)*$/);
  });

  it("includes exactly the six real category routes", () => {
    const cats = paths.filter((p) => p.startsWith("/categories/"));
    expect(cats.sort()).toEqual(categories.map((c) => `/categories/${c.slug}/`).sort());
    expect(cats.sort()).toEqual(
      ["/categories/business/", "/categories/developer/", "/categories/image/", "/categories/pdf/", "/categories/student/", "/categories/text-seo/"],
    );
    // the dynamic route that serves them really exists
    expect(existsSync(path.join(app, "categories", "[slug]", "page.tsx"))).toBe(true);
    expect(paths.some((p) => p.startsWith("/category/"))).toBe(false);
  });

  it("includes all 47 tool pages", () => {
    const t = paths.filter((p) => p.startsWith("/tools/") && p !== "/tools/");
    expect(t.length).toBe(47);
    expect(t.sort()).toEqual(tools.map((x) => `/tools/${x.slug}/`).sort());
  });

  it("includes every static page that has a route, and nothing else", () => {
    const statics = paths.filter((p) => !p.startsWith("/categories/") && !(p.startsWith("/tools/") && p !== "/tools/"));
    expect(statics.sort()).toEqual(["/", "/about/", "/contact/", "/disclaimer/", "/faq/", "/privacy-policy/", "/terms/", "/tools/"]);
    for (const p of statics) {
      const file = p === "/" ? path.join(app, "page.tsx") : path.join(app, p.slice(1, -1), "page.tsx");
      expect(existsSync(file), `route for ${p}`).toBe(true);
    }
    // every top-level static route is in the sitemap (except dynamic/special folders)
    const routeDirs = readdirSync(app, { withFileTypes: true })
      .filter((d) => d.isDirectory() && !d.name.startsWith("[") && existsSync(path.join(app, d.name, "page.tsx")))
      .map((d) => `/${d.name}/`);
    for (const r of routeDirs) expect(paths, `sitemap includes ${r}`).toContain(r);
  });
});
