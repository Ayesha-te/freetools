import { describe, it, expect } from "vitest";
import { countWords, textStats, convertCase, repeatText, cleanSpaces, diffTokens, slugify, buildSitemap, parseUrlList, buildRobots, buildMetaTags, topWords } from "@/lib/calc/text";

describe("text tools", () => {
  it("counts words including contractions and hyphens", () => {
    expect(countWords("")).toBe(0);
    expect(countWords("  Hello, world! It's a well-known fact.  ")).toBe(6);
    expect(countWords("café naïve 123")).toBe(3);
  });
  it("stats", () => {
    const s = textStats("One. Two!\n\nThree?");
    expect(s.sentences).toBe(3);
    expect(s.paragraphs).toBe(2);
    expect(textStats("😀").chars).toBe(1);
    expect(textStats("😀").bytes).toBe(4);
  });
  it("top words skip stop words", () => {
    expect(topWords("the cat and the cat sat", 2)[0]).toEqual(["cat", 2]);
  });
  it("case conversions", () => {
    expect(convertCase("hello world from js", "title")).toBe("Hello World From Js");
    expect(convertCase("the lord of the rings", "title")).toBe("The Lord of the Rings");
    expect(convertCase("hello world. bye now", "sentence")).toBe("Hello world. Bye now");
    expect(convertCase("Hello world-foo", "camel")).toBe("helloWorldFoo");
    expect(convertCase("helloWorld", "snake")).toBe("hello_world");
    expect(convertCase("XMLHttpRequest", "kebab")).toBe("xml-http-request");
    expect(convertCase("a b", "constant")).toBe("A_B");
  });
  it("repeat with limits", () => {
    expect(repeatText("hi", 3, " ")).toBe("hi hi hi");
    expect(repeatText("x", 2, "\n", true)).toBe("1. x\n2. x");
    expect(() => repeatText("x", 0, "")).toThrow();
    expect(() => repeatText("x".repeat(1000), 10000, "")).toThrow();
  });
  it("cleans spaces", () => {
    const o = { collapseSpaces: true, trimLines: true, removeEmptyLines: false, tabsToSpaces: true, joinLines: false, collapseBlankLines: true };
    expect(cleanSpaces("  a   b\t\tc  \n\n\n\n d ", o)).toBe("a b c\n\nd");
    expect(cleanSpaces("a\nb\n\nc", { ...o, joinLines: true })).toBe("a b\n\nc");
  });
  it("diff", () => {
    const ops = diffTokens(["a", "b", "c"], ["a", "x", "c"]);
    expect(ops.filter((o) => o.type !== "equal").map((o) => o.type + o.value)).toEqual(["removeb", "addx"]);
    expect(diffTokens(["A"], ["a"], (s) => s.toLowerCase()).every((o) => o.type === "equal")).toBe(true);
  });
  it("slugify", () => {
    expect(slugify("Héllo Wörld! 10 Tips & Tricks")).toBe("hello-world-10-tips-and-tricks");
    expect(slugify("The Best of the Web", { removeStopWords: true })).toBe("best-web");
    expect(slugify("one two three", { separator: "_", maxLength: 9 })).toBe("one_two");
  });
  it("sitemap & url list", () => {
    const { valid, invalid } = parseUrlList("https://a.com/\nnot a url\nftp://x\nhttps://a.com/\nhttps://a.com/?q=1&b=2");
    expect(valid).toHaveLength(2);
    expect(invalid).toHaveLength(2);
    const xml = buildSitemap(valid.map((loc) => ({ loc })));
    expect(xml).toContain("&amp;b=2");
    expect(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true);
  });
  it("robots", () => {
    const r = buildRobots([{ userAgent: "*", allow: [], disallow: ["/admin/"] }], ["https://a.com/sitemap.xml"]);
    expect(r).toBe("User-agent: *\nDisallow: /admin/\n\nSitemap: https://a.com/sitemap.xml\n");
    expect(buildRobots([{ userAgent: "*", allow: [], disallow: [] }], [])).toBe("User-agent: *\nDisallow:\n");
  });
  it("meta tags escape attributes", () => {
    const m = buildMetaTags({ title: 'A "quoted" <title>', description: "d", url: "", image: "", siteName: "", robotsIndex: true, robotsFollow: true, twitterCard: "summary", twitterSite: "x", type: "website", locale: "" });
    expect(m).toContain("&quot;quoted&quot;");
    expect(m).not.toContain('<title>A "quoted" <title>');
    expect(m).toContain('content="@x"');
  });
});
