import { describe, it, expect } from "vitest";
import { parseJson, jsonHint, sortKeysDeep, encodeBase64, decodeBase64, urlEncode, urlDecode, encodeEntities, decodeEntities, formatHtml, minifyHtml, detectUnit, timestampToDate, parsePageRanges, parseRangeGroups, md5 } from "@/lib/calc/dev";

const enc = (s: string) => new TextEncoder().encode(s);

describe("developer tools", () => {
  it("json parse + error location", () => {
    expect(parseJson('{"a":1}').ok).toBe(true);
    const r = parseJson('{\n  "a": 1,\n}');
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.line).toBeGreaterThanOrEqual(2);
    expect(jsonHint('{"a":1,}')).toMatch(/Trailing comma/);
    expect(jsonHint("{a:1}")).toMatch(/Unquoted key/);
    expect(JSON.stringify(sortKeysDeep({ b: 1, a: { d: 1, c: 2 } }))).toBe('{"a":{"c":2,"d":1},"b":1}');
  });
  it("base64 utf-8 round trip and url-safe", () => {
    expect(encodeBase64("héllo ✓")).toBe("aMOpbGxvIOKckw==");
    expect(decodeBase64("aMOpbGxvIOKckw==").text).toBe("héllo ✓");
    expect(encodeBase64("??>", true)).toBe("Pz8-");
    expect(decodeBase64("Pz8-").text).toBe("??>");
    expect(() => decodeBase64("abc$")).toThrow();
    expect(decodeBase64("/w==").validUtf8).toBe(false);
  });
  it("url encode/decode", () => {
    expect(urlEncode("a b&c=d/é", "component")).toBe("a%20b%26c%3Dd%2F%C3%A9");
    expect(urlEncode("https://x.com/a b?q=1", "uri")).toBe("https://x.com/a%20b?q=1");
    expect(urlDecode("a+b%20c", true)).toBe("a b c");
    expect(() => urlDecode("%E0%A4%A")).toThrow();
  });
  it("html entities", () => {
    expect(encodeEntities('<a href="x">é & ©</a>', { nonAscii: "named", quotes: true })).toBe("&lt;a href=&quot;x&quot;&gt;&eacute; &amp; &copy;&lt;/a&gt;");
    expect(encodeEntities("😀", { nonAscii: "numeric", quotes: false })).toBe("&#128512;");
    expect(decodeEntities("&lt;b&gt; &#x1F600; &#169; &copy; &bogus;")).toBe("<b> 😀 © © &bogus;");
  });
  it("html formatter", () => {
    const out = formatHtml("<div><p>Hi <b>there</b></p><br><pre>  keep\n  this</pre><script>var a=1;</script></div>");
    expect(out).toBe("<div>\n  <p>\n    Hi <b>there</b>\n  </p>\n  <br>\n  <pre>  keep\n  this</pre>\n  <script>\n    var a=1;\n  </script>\n</div>");
    expect(minifyHtml("<div>\n  <p> a  b </p>\n</div><!-- c -->")).toBe("<div><p> a b </p></div>");
  });
  it("timestamps", () => {
    expect(detectUnit(1700000000)).toBe("s");
    expect(detectUnit(1700000000000)).toBe("ms");
    expect(timestampToDate(0, "s").toISOString()).toBe("1970-01-01T00:00:00.000Z");
    expect(() => timestampToDate(1e20, "ms")).toThrow();
  });
  it("page ranges", () => {
    expect(parsePageRanges("1-3, 5, 2", 10)).toEqual([0, 1, 2, 4]);
    expect(parsePageRanges("8-", 10)).toEqual([7, 8, 9]);
    expect(parseRangeGroups("1-2,3-4", 4)).toEqual([[0, 1], [2, 3]]);
    expect(() => parsePageRanges("11", 10)).toThrow(/does not exist/);
    expect(() => parsePageRanges("5-2", 10)).toThrow(/backwards/);
    expect(() => parsePageRanges("abc", 10)).toThrow();
    expect(() => parsePageRanges("", 10)).toThrow();
  });
  it("md5 known vectors", () => {
    expect(md5(enc(""))).toBe("d41d8cd98f00b204e9800998ecf8427e");
    expect(md5(enc("abc"))).toBe("900150983cd24fb0d6963f7d28e17f72");
    expect(md5(enc("The quick brown fox jumps over the lazy dog"))).toBe("9e107d9d372bb6826bd81d3542a419d6");
    expect(md5(enc("a".repeat(1000)))).toBe("cabe45dcc9ae5b66ba86600cca6b8ba8");
  });
});
