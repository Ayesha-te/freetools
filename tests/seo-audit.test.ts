import { describe, it, expect } from "vitest";
import { tools, toolMap, categories } from "@/lib/tools/registry";
import { content } from "@/content";

const words = (s: string) => s.split(/\s+/).filter(Boolean).length;

describe("SEO content audit for every tool", () => {
  it("has 50 tools with unique titles and meta descriptions", () => {
    expect(tools.length).toBe(50);
    expect(new Set(tools.map((t) => t.title)).size).toBe(tools.length);
    expect(new Set(tools.map((t) => t.metaDescription)).size).toBe(tools.length);
    expect(new Set(tools.map((t) => t.name)).size).toBe(tools.length);
    expect(new Set(categories.map((c) => c.title)).size).toBe(categories.length);
    for (const c of categories) expect(c.title.length, c.slug).toBeLessThanOrEqual(49);
  });

  for (const t of tools) {
    it(`${t.slug}: complete, original content`, () => {
      const c = content[t.slug];
      expect(c, "content exists").toBeTruthy();
      // ≤ 49 chars so the full "<title> | ToolSprint" stays within ~62 and is not cut off in results
      expect(t.title.length, "title length").toBeLessThanOrEqual(49);
      expect(t.metaDescription.length, "meta description length").toBeGreaterThanOrEqual(70);
      expect(t.metaDescription.length, "meta description length").toBeLessThanOrEqual(170);
      expect(c.intro.length).toBeGreaterThan(0);
      expect(c.why.length).toBeGreaterThan(0);
      expect(c.steps.length).toBeGreaterThanOrEqual(3);
      expect(c.examples.length).toBeGreaterThan(0);
      expect(c.formats.length).toBeGreaterThan(0);
      expect(c.limitations.length).toBeGreaterThan(0);
      expect(c.faq.length).toBeGreaterThanOrEqual(3);
      expect(c.related.length).toBeGreaterThanOrEqual(2);
      expect(c.audience.length, "who it is for").toBeGreaterThanOrEqual(2);
      expect(c.features.length, "key features").toBeGreaterThanOrEqual(2);
      for (const r of c.related) expect(toolMap[r], `related ${r} exists`).toBeTruthy();
      expect(c.related).not.toContain(t.slug);
      const body = [...c.intro, ...c.audience, ...c.features, ...c.why, ...c.steps, ...c.examples.map((e) => e.body), ...c.formats, ...c.limitations, ...c.faq.map((f) => f.a)].join(" ");
      expect(words(body), "body word count").toBeGreaterThanOrEqual(300);
      expect(body).not.toMatch(/bTODOb|bTBDb|coming soon|placeholder text/i);
    });
  }
});
