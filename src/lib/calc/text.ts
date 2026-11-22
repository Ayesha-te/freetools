export function countWords(text: string): number {
  const m = text.trim().match(/[\p{L}\p{N}]+(?:['’\-][\p{L}\p{N}]+)*/gu);
  return m ? m.length : 0;
}

export function textStats(text: string) {
  const words = countWords(text);
  const chars = [...text].length;
  const charsNoSpaces = [...text.replace(/\s/g, "")].length;
  const sentences = text.trim() ? (text.match(/[^.!?。！？]+(?:[.!?。！？]+|$)/g) || []).filter((s) => /[\p{L}\p{N}]/u.test(s)).length : 0;
  const paragraphs = text.split(/\n\s*\n/).filter((p) => p.trim()).length;
  const lines = text ? text.split(/\r\n|\r|\n/).length : 0;
  const bytes = new TextEncoder().encode(text).length;
  return {
    words,
    chars,
    charsNoSpaces,
    sentences,
    paragraphs,
    lines,
    bytes,
    readingMinutes: words / 238,
    speakingMinutes: words / 140,
  };
}

const STOP = new Set(
  "a an the and or but of to in on at for with by is are was were be been it this that as from i you he she we they not no so if then than its it's".split(" "),
);
export function topWords(text: string, n = 10, skipStopWords = true) {
  const counts = new Map<string, number>();
  for (const w of text.toLowerCase().match(/[\p{L}\p{N}]+(?:['’][\p{L}]+)?/gu) || []) {
    if (skipStopWords && STOP.has(w)) continue;
    counts.set(w, (counts.get(w) || 0) + 1);
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, n);
}

export function formatDuration(minutes: number) {
  if (minutes <= 0) return "0 sec";
  const totalSec = Math.round(minutes * 60);
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return m ? `${m} min${s ? ` ${s} sec` : ""}` : `${s} sec`;
}

function splitWords(text: string): string[] {
  return text
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2")
    .split(/[^\p{L}\p{N}]+/u)
    .filter(Boolean);
}
const cap = (w: string) => (w ? w[0].toUpperCase() + w.slice(1).toLowerCase() : w);
const SMALL = new Set("a an and as at but by for in nor of on or so the to up yet via".split(" "));

export type CaseMode =
  | "upper" | "lower" | "title" | "sentence" | "camel" | "pascal" | "snake" | "kebab" | "constant" | "dot" | "alternating" | "inverse";

export function convertCase(text: string, mode: CaseMode): string {
  switch (mode) {
    case "upper":
      return text.toUpperCase();
    case "lower":
      return text.toLowerCase();
    case "title": {
      let i = 0;
      return text.toLowerCase().replace(/[\p{L}\p{N}][\p{L}\p{N}'’]*/gu, (w) => {
        const first = i++ === 0;
        return !first && SMALL.has(w) ? w : cap(w);
      });
    }
    case "sentence":
      return text.toLowerCase().replace(/(^\s*\p{L})|([.!?]\s+\p{L})/gu, (m) => m.toUpperCase()).replace(/\bi\b/g, "I");
    case "camel":
      return splitWords(text).map((w, i) => (i ? cap(w) : w.toLowerCase())).join("");
    case "pascal":
      return splitWords(text).map(cap).join("");
    case "snake":
      return splitWords(text).map((w) => w.toLowerCase()).join("_");
    case "kebab":
      return splitWords(text).map((w) => w.toLowerCase()).join("-");
    case "constant":
      return splitWords(text).map((w) => w.toUpperCase()).join("_");
    case "dot":
      return splitWords(text).map((w) => w.toLowerCase()).join(".");
    case "alternating": {
      let i = 0;
      return [...text].map((c) => (/\p{L}/u.test(c) ? (i++ % 2 ? c.toUpperCase() : c.toLowerCase()) : c)).join("");
    }
    case "inverse":
      return [...text].map((c) => (c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase())).join("");
  }
}

export const MAX_REPEAT_OUTPUT = 5_000_000;
export function repeatText(text: string, times: number, separator: string, numbered = false) {
  if (!Number.isInteger(times) || times < 1 || times > 10000) throw new Error("Repeat count must be a whole number from 1 to 10,000.");
  const estimated = (text.length + separator.length + (numbered ? 8 : 0)) * times;
  if (estimated > MAX_REPEAT_OUTPUT) throw new Error("Output would exceed 5 million characters. Reduce the text or the repeat count.");
  const parts: string[] = [];
  for (let i = 1; i <= times; i++) parts.push(numbered ? `${i}. ${text}` : text);
  return parts.join(separator);
}

export interface CleanOptions {
  collapseSpaces: boolean;
  trimLines: boolean;
  removeEmptyLines: boolean;
  tabsToSpaces: boolean;
  joinLines: boolean;
  collapseBlankLines: boolean;
}
export function cleanSpaces(text: string, o: CleanOptions) {
  let t = text.replace(/\r\n?/g, "\n").replace(/[  -   　]/g, " ");
  if (o.tabsToSpaces) t = t.replace(/\t/g, " ");
  if (o.joinLines) t = t.replace(/([^\n])\n(?!\n)/g, "$1 ");
  if (o.collapseSpaces) t = t.replace(/[ \t]{2,}/g, " ");
  if (o.trimLines) t = t.split("\n").map((l) => l.trim()).join("\n");
  if (o.removeEmptyLines) t = t.split("\n").filter((l) => l.trim() !== "").join("\n");
  else if (o.collapseBlankLines) t = t.replace(/\n\s*\n(\s*\n)+/g, "\n\n");
  return o.trimLines ? t.trim() : t;
}

export type DiffOp = { type: "equal" | "add" | "remove"; value: string };
export const MAX_DIFF_CELLS = 4_000_000;

/** LCS-based diff of two token arrays. */
export function diffTokens(a: string[], b: string[], normalize: (s: string) => string = (s) => s): DiffOp[] {
  // trim common prefix/suffix to keep the table small
  let start = 0;
  while (start < a.length && start < b.length && normalize(a[start]) === normalize(b[start])) start++;
  let endA = a.length, endB = b.length;
  while (endA > start && endB > start && normalize(a[endA - 1]) === normalize(b[endB - 1])) { endA--; endB--; }
  const A = a.slice(start, endA), B = b.slice(start, endB);
  const n = A.length, m = B.length;
  if (n * m > MAX_DIFF_CELLS) throw new Error("Texts are too different and too long to compare in the browser. Try comparing smaller sections.");
  const nA = A.map(normalize), nB = B.map(normalize);
  const dp: Uint32Array[] = Array.from({ length: n + 1 }, () => new Uint32Array(m + 1));
  for (let i = n - 1; i >= 0; i--) for (let j = m - 1; j >= 0; j--)
    dp[i][j] = nA[i] === nB[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
  const ops: DiffOp[] = a.slice(0, start).map((v) => ({ type: "equal" as const, value: v }));
  let i = 0, j = 0;
  while (i < n && j < m) {
    if (nA[i] === nB[j]) { ops.push({ type: "equal", value: B[j] }); i++; j++; }
    else if (dp[i + 1][j] >= dp[i][j + 1]) ops.push({ type: "remove", value: A[i++] });
    else ops.push({ type: "add", value: B[j++] });
  }
  while (i < n) ops.push({ type: "remove", value: A[i++] });
  while (j < m) ops.push({ type: "add", value: B[j++] });
  for (const v of b.slice(endB)) ops.push({ type: "equal", value: v });
  return ops;
}

export function slugify(input: string, opts: { separator?: "-" | "_"; lowercase?: boolean; removeStopWords?: boolean; maxLength?: number } = {}) {
  const sep = opts.separator ?? "-";
  let s = input.normalize("NFKD").replace(/[̀-ͯ]/g, "");
  s = s.replace(/ß/g, "ss").replace(/æ/gi, "ae").replace(/ø/gi, "o").replace(/œ/gi, "oe").replace(/&/g, " and ");
  if (opts.lowercase !== false) s = s.toLowerCase();
  let words = s.split(/[^A-Za-z0-9]+/).filter(Boolean);
  if (opts.removeStopWords) {
    const filtered = words.filter((w) => !STOP.has(w.toLowerCase()));
    if (filtered.length) words = filtered;
  }
  let out = words.join(sep);
  if (opts.maxLength && out.length > opts.maxLength) {
    out = out.slice(0, opts.maxLength);
    const cut = out.lastIndexOf(sep);
    if (cut > 0) out = out.slice(0, cut);
  }
  return out;
}

export function escapeXml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}
export function escapeAttr(s: string) {
  return s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export interface SitemapEntry { loc: string; lastmod?: string; changefreq?: string; priority?: string }
export function buildSitemap(entries: SitemapEntry[]) {
  const body = entries
    .map((e) => {
      const parts = [`    <loc>${escapeXml(e.loc)}</loc>`];
      if (e.lastmod) parts.push(`    <lastmod>${e.lastmod}</lastmod>`);
      if (e.changefreq) parts.push(`    <changefreq>${e.changefreq}</changefreq>`);
      if (e.priority) parts.push(`    <priority>${e.priority}</priority>`);
      return `  <url>\n${parts.join("\n")}\n  </url>`;
    })
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
}

/** Parse a list of URLs, returning valid unique http(s) URLs and invalid lines. */
export function parseUrlList(text: string) {
  const valid: string[] = [];
  const invalid: string[] = [];
  const seen = new Set<string>();
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line) continue;
    try {
      const u = new URL(line);
      if (u.protocol !== "http:" && u.protocol !== "https:") throw new Error();
      const href = u.href;
      if (!seen.has(href)) { seen.add(href); valid.push(href); }
    } catch {
      invalid.push(line);
    }
  }
  return { valid, invalid };
}

export interface RobotsGroup { userAgent: string; allow: string[]; disallow: string[]; crawlDelay?: number }
export function buildRobots(groups: RobotsGroup[], sitemaps: string[]) {
  const out: string[] = [];
  for (const g of groups) {
    out.push(`User-agent: ${g.userAgent.trim() || "*"}`);
    for (const a of g.allow) if (a.trim()) out.push(`Allow: ${a.trim()}`);
    for (const d of g.disallow) out.push(`Disallow: ${d.trim()}`);
    if (!g.allow.some((a) => a.trim()) && g.disallow.length === 0) out.push("Disallow:");
    if (g.crawlDelay && g.crawlDelay > 0) out.push(`Crawl-delay: ${g.crawlDelay}`);
    out.push("");
  }
  for (const s of sitemaps) if (s.trim()) out.push(`Sitemap: ${s.trim()}`);
  return out.join("\n").trim() + "\n";
}

export interface MetaInput {
  title: string; description: string; url: string; image: string; siteName: string;
  robotsIndex: boolean; robotsFollow: boolean; twitterCard: "summary" | "summary_large_image"; twitterSite: string; type: string; locale: string;
}
export function buildMetaTags(m: MetaInput) {
  const lines: string[] = ['<meta charset="utf-8">', '<meta name="viewport" content="width=device-width, initial-scale=1">'];
  if (m.title) lines.push(`<title>${escapeXml(m.title)}</title>`);
  if (m.description) lines.push(`<meta name="description" content="${escapeAttr(m.description)}">`);
  lines.push(`<meta name="robots" content="${m.robotsIndex ? "index" : "noindex"}, ${m.robotsFollow ? "follow" : "nofollow"}">`);
  if (m.url) lines.push(`<link rel="canonical" href="${escapeAttr(m.url)}">`);
  lines.push("", "<!-- Open Graph -->");
  lines.push(`<meta property="og:type" content="${escapeAttr(m.type || "website")}">`);
  if (m.title) lines.push(`<meta property="og:title" content="${escapeAttr(m.title)}">`);
  if (m.description) lines.push(`<meta property="og:description" content="${escapeAttr(m.description)}">`);
  if (m.url) lines.push(`<meta property="og:url" content="${escapeAttr(m.url)}">`);
  if (m.image) lines.push(`<meta property="og:image" content="${escapeAttr(m.image)}">`);
  if (m.siteName) lines.push(`<meta property="og:site_name" content="${escapeAttr(m.siteName)}">`);
  if (m.locale) lines.push(`<meta property="og:locale" content="${escapeAttr(m.locale)}">`);
  lines.push("", "<!-- Twitter -->");
  lines.push(`<meta name="twitter:card" content="${m.twitterCard}">`);
  if (m.twitterSite) lines.push(`<meta name="twitter:site" content="${escapeAttr(m.twitterSite.startsWith("@") ? m.twitterSite : "@" + m.twitterSite)}">`);
  if (m.title) lines.push(`<meta name="twitter:title" content="${escapeAttr(m.title)}">`);
  if (m.description) lines.push(`<meta name="twitter:description" content="${escapeAttr(m.description)}">`);
  if (m.image) lines.push(`<meta name="twitter:image" content="${escapeAttr(m.image)}">`);
  return lines.join("\n");
}
