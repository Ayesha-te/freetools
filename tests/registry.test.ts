import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";
import { tools, categories, toolMap, searchTools } from "@/lib/tools/registry";
import { content } from "@/content";

const renderer = readFileSync(path.resolve(__dirname, "../src/components/tools/ToolRenderer.tsx"), "utf8");

const words = (s: string) => s.split(/\s+/).filter(Boolean).length;

describe("tool registry & content integrity", () => {
  it("has exactly 47 tools with unique slugs", () => {
    expect(tools).toHaveLength(47);
    expect(new Set(tools.map((t) => t.slug)).size).toBe(47);
  });
  it("every tool belongs to a real category and every category has tools", () => {
    const cats = new Set(categories.map((c) => c.slug));
    for (const t of tools) expect(cats.has(t.category)).toBe(true);
    for (const c of categories) expect(tools.some((t) => t.category === c.slug)).toBe(true);
  });
  it("every tool has a UI component registered", () => {
    for (const t of tools) expect(renderer, t.slug).toContain(`"${t.slug}": dynamic(`);
  });
  it("titles and meta descriptions are unique and reasonably sized", () => {
    expect(new Set(tools.map((t) => t.title)).size).toBe(tools.length);
    expect(new Set(tools.map((t) => t.metaDescription)).size).toBe(tools.length);
    for (const t of tools) {
      expect(t.metaDescription.length, t.slug).toBeGreaterThanOrEqual(90);
      expect(t.metaDescription.length, t.slug).toBeLessThanOrEqual(170);
    }
  });
  it("every tool has complete, substantial, original content", () => {
    const intros = new Set<string>();
    for (const t of tools) {
      const c = content[t.slug];
      expect(c, t.slug).toBeDefined();
      expect(c.intro.length).toBeGreaterThan(0);
      expect(c.why.length).toBeGreaterThan(0);
      expect(c.steps.length, t.slug).toBeGreaterThanOrEqual(3);
      expect(c.examples.length, t.slug).toBeGreaterThanOrEqual(1);
      expect(c.formats.length).toBeGreaterThan(0);
      expect(c.limitations.length).toBeGreaterThan(0);
      expect(c.faq.length, t.slug).toBeGreaterThanOrEqual(2);
      const total = words([...c.intro, ...c.why, ...c.steps, ...c.examples.map((e) => e.body), ...c.formats, ...c.limitations, c.privacy, ...c.faq.flatMap((f) => [f.q, f.a])].join(" "));
      expect(total, `${t.slug} word count`).toBeGreaterThanOrEqual(300);
      intros.add(c.intro[0]);
    }
    expect(intros.size).toBe(tools.length);
  });
  it("related links point to real tools and not to themselves", () => {
    for (const t of tools) {
      for (const r of content[t.slug].related) {
        expect(toolMap[r], `${t.slug} -> ${r}`).toBeDefined();
        expect(r).not.toBe(t.slug);
      }
    }
  });
  it("search finds tools by name and keyword", () => {
    expect(searchTools("gpa")[0].slug).toBe("gpa-calculator");
    expect(searchTools("50kb").map((t) => t.slug)).toContain("compress-image-to-50kb");
    expect(searchTools("merge pdf")[0].slug).toBe("pdf-merger");
    expect(searchTools("zzzz")).toHaveLength(0);
    expect(searchTools("   ")).toHaveLength(0);
  });
});

import { resolveSiteUrl } from "@/lib/site";
describe("resolveSiteUrl", () => {
  it("uses the configured custom domain", () => expect(resolveSiteUrl("https://example.com/")).toBe("https://example.com"));
  it("falls back to toolsprint.xyz when unset or invalid", () => {
    expect(resolveSiteUrl(undefined)).toBe("https://toolsprint.xyz");
    expect(resolveSiteUrl("not a url")).toBe("https://toolsprint.xyz");
  });
  it("never uses a vercel.app deployment host", () => expect(resolveSiteUrl("https://freetools-self.vercel.app/")).toBe("https://toolsprint.xyz"));
});
