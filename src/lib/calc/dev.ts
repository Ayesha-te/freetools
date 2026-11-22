// ---------- JSON ----------
export interface JsonError {
  message: string;
  line: number;
  column: number;
  position: number;
}

export function locate(text: string, pos: number) {
  const before = text.slice(0, pos);
  const line = before.split("\n").length;
  const column = pos - before.lastIndexOf("\n");
  return { line, column };
}

/** Parse JSON; on failure return a structured error with line/column when the engine reports one. */
export function parseJson(text: string): { ok: true; value: unknown } | { ok: false; error: JsonError } {
  try {
    return { ok: true, value: JSON.parse(text) };
  } catch (e) {
    const msg = (e as Error).message || "Invalid JSON";
    let pos = -1;
    const m = msg.match(/position (\d+)/i);
    if (m) pos = Number(m[1]);
    else {
      const lc = msg.match(/line (\d+) column (\d+)/i);
      if (lc) {
        const lines = text.split("\n");
        const l = Number(lc[1]);
        pos = lines.slice(0, l - 1).reduce((s, x) => s + x.length + 1, 0) + Number(lc[2]) - 1;
      } else if (/unexpected end/i.test(msg)) pos = text.length;
    }
    if (pos < 0) pos = 0;
    const { line, column } = locate(text, pos);
    return { ok: false, error: { message: msg.replace(/^JSON\.parse: /, ""), line, column, position: pos } };
  }
}

/** Friendly hint for common mistakes. */
export function jsonHint(text: string): string | null {
  if (/,\s*[}\]]/.test(text)) return "Trailing comma found: JSON does not allow a comma after the last item.";
  if (/'[^']*'\s*:/.test(text) || /:\s*'[^']*'/.test(text)) return "Single quotes found: JSON strings and keys must use double quotes.";
  if (/[{,]\s*[A-Za-z_$][\w$]*\s*:/.test(text)) return "Unquoted key found: every object key must be wrapped in double quotes.";
  if (/\/\/|\/\*/.test(text)) return "Comments are not allowed in standard JSON.";
  if (/\b(undefined|NaN|Infinity)\b/.test(text)) return "undefined, NaN and Infinity are not valid JSON values.";
  return null;
}

export function sortKeysDeep(v: unknown): unknown {
  if (Array.isArray(v)) return v.map(sortKeysDeep);
  if (v && typeof v === "object") {
    return Object.fromEntries(
      Object.keys(v as object)
        .sort()
        .map((k) => [k, sortKeysDeep((v as Record<string, unknown>)[k])]),
    );
  }
  return v;
}

export function jsonStats(v: unknown) {
  let keys = 0, arrays = 0, objects = 0, depth = 0;
  const walk = (x: unknown, d: number) => {
    depth = Math.max(depth, d);
    if (Array.isArray(x)) { arrays++; x.forEach((y) => walk(y, d + 1)); }
    else if (x && typeof x === "object") {
      objects++;
      for (const [, y] of Object.entries(x)) { keys++; walk(y, d + 1); }
    }
  };
  walk(v, 0);
  return { keys, arrays, objects, depth };
}

// ---------- Base64 ----------
export function bytesToBase64(bytes: Uint8Array): string {
  let bin = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) bin += String.fromCharCode(...bytes.subarray(i, i + chunk));
  return btoa(bin);
}
export function encodeBase64(text: string, urlSafe = false) {
  const b = bytesToBase64(new TextEncoder().encode(text));
  return urlSafe ? b.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "") : b;
}
export function base64ToBytes(input: string): Uint8Array {
  let s = input.replace(/^data:[^,]*;base64,/, "").replace(/\s+/g, "").replace(/-/g, "+").replace(/_/g, "/");
  if (!/^[A-Za-z0-9+/]*={0,2}$/.test(s)) throw new Error("Input contains characters that are not valid Base64.");
  const rem = s.replace(/=+$/, "").length % 4;
  if (rem === 1) throw new Error("Base64 input has an invalid length.");
  if (rem) s = s.replace(/=+$/, "") + "=".repeat(4 - rem);
  const bin = atob(s);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}
export function decodeBase64(input: string): { text: string; validUtf8: boolean; bytes: Uint8Array } {
  const bytes = base64ToBytes(input);
  try {
    return { text: new TextDecoder("utf-8", { fatal: true }).decode(bytes), validUtf8: true, bytes };
  } catch {
    return { text: new TextDecoder("utf-8").decode(bytes), validUtf8: false, bytes };
  }
}

// ---------- URL ----------
export function urlEncode(text: string, mode: "component" | "uri", plusForSpace = false) {
  const out = mode === "component" ? encodeURIComponent(text) : encodeURI(text);
  return plusForSpace ? out.replace(/%20/g, "+") : out;
}
export function urlDecode(text: string, plusAsSpace = false) {
  const t = plusAsSpace ? text.replace(/\+/g, " ") : text;
  try {
    return decodeURIComponent(t);
  } catch {
    throw new Error("Malformed percent-encoding: a % must be followed by two hexadecimal digits forming valid UTF-8.");
  }
}

// ---------- HTML entities ----------
const NAMED: Record<string, string> = {
  amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", copy: "©", reg: "®", trade: "™",
  hellip: "…", mdash: "—", ndash: "–", lsquo: "‘", rsquo: "’", ldquo: "“", rdquo: "”", euro: "€",
  pound: "£", yen: "¥", cent: "¢", sect: "§", deg: "°", plusmn: "±", times: "×", divide: "÷",
  laquo: "«", raquo: "»", middot: "·", bull: "•", para: "¶", frac12: "½", frac14: "¼", frac34: "¾",
  larr: "←", rarr: "→", uarr: "↑", darr: "↓", hearts: "♥", eacute: "é", egrave: "è", agrave: "à",
  aacute: "á", ccedil: "ç", ntilde: "ñ", ouml: "ö", uuml: "ü", auml: "ä", szlig: "ß",
};
const REVERSE: Record<string, string> = Object.fromEntries(Object.entries(NAMED).map(([k, v]) => [v, k]));

export function encodeEntities(text: string, opts: { nonAscii: "named" | "numeric" | "keep"; quotes: boolean }) {
  let out = "";
  for (const ch of text) {
    if (ch === "&") out += "&amp;";
    else if (ch === "<") out += "&lt;";
    else if (ch === ">") out += "&gt;";
    else if (ch === '"' && opts.quotes) out += "&quot;";
    else if (ch === "'" && opts.quotes) out += "&#39;";
    else if (ch.codePointAt(0)! > 126 && opts.nonAscii !== "keep") {
      const named = REVERSE[ch];
      out += opts.nonAscii === "named" && named ? `&${named};` : `&#${ch.codePointAt(0)};`;
    } else out += ch;
  }
  return out;
}
export function decodeEntities(text: string) {
  return text.replace(/&(#x[0-9a-f]+|#\d+|[a-z][a-z0-9]*);/gi, (m, body: string) => {
    if (body[0] === "#") {
      const cp = body[1].toLowerCase() === "x" ? parseInt(body.slice(2), 16) : parseInt(body.slice(1), 10);
      if (!Number.isFinite(cp) || cp > 0x10ffff || (cp >= 0xd800 && cp <= 0xdfff)) return m;
      return String.fromCodePoint(cp);
    }
    return NAMED[body] ?? NAMED[body.toLowerCase()] ?? m;
  });
}

// ---------- HTML formatter ----------
const VOID = new Set("area base br col embed hr img input link meta param source track wbr".split(" "));
const RAW = new Set(["pre", "textarea", "script", "style"]);
const INLINE = new Set("a abbr b bdi bdo cite code data dfn em i kbd mark q s samp small span strong sub sup time u var label".split(" "));

type Tok = { t: "open" | "close" | "text" | "comment" | "doctype" | "raw"; name?: string; v: string };

function tokenizeHtml(html: string): Tok[] {
  const toks: Tok[] = [];
  let i = 0;
  while (i < html.length) {
    if (html.startsWith("<!--", i)) {
      const end = html.indexOf("-->", i + 4);
      const j = end < 0 ? html.length : end + 3;
      toks.push({ t: "comment", v: html.slice(i, j) });
      i = j;
    } else if (/^<![a-z]/i.test(html.slice(i, i + 3))) {
      const j = html.indexOf(">", i);
      const e = j < 0 ? html.length : j + 1;
      toks.push({ t: "doctype", v: html.slice(i, e) });
      i = e;
    } else if (html[i] === "<" && /[a-z/]/i.test(html[i + 1] || "")) {
      // find tag end respecting quotes
      let j = i + 1, q: string | null = null;
      while (j < html.length) {
        const c = html[j];
        if (q) { if (c === q) q = null; }
        else if (c === '"' || c === "'") q = c;
        else if (c === ">") break;
        j++;
      }
      const tag = html.slice(i, j + 1);
      const close = tag[1] === "/";
      const name = (tag.match(/^<\/?\s*([a-z0-9-:]+)/i)?.[1] || "").toLowerCase();
      toks.push({ t: close ? "close" : "open", name, v: tag.replace(/\s+/g, " ").replace(/\s+>$/, ">").replace(/\s+\/>$/, " />") });
      i = j + 1;
      if (!close && RAW.has(name) && !tag.endsWith("/>")) {
        const endIdx = html.toLowerCase().indexOf(`</${name}`, i);
        const e = endIdx < 0 ? html.length : endIdx;
        if (e > i) toks.push({ t: "raw", v: html.slice(i, e) });
        i = e;
      }
    } else {
      const j = html.indexOf("<", i + 1);
      const e = j < 0 ? html.length : j;
      toks.push({ t: "text", v: html.slice(i, e) });
      i = e;
    }
  }
  return toks;
}

export function formatHtml(html: string, indent = "  "): string {
  const toks = tokenizeHtml(html.replace(/\r\n?/g, "\n"));
  const lines: string[] = [];
  let depth = 0;
  let inlineBuf = "";
  const pad = () => indent.repeat(Math.max(0, depth));
  const flush = () => {
    const t = inlineBuf.replace(/\s+/g, " ").trim();
    if (t) lines.push(pad() + t);
    inlineBuf = "";
  };
  for (let k = 0; k < toks.length; k++) {
    const tok = toks[k];
    const isInline = (tok.t === "open" || tok.t === "close") && INLINE.has(tok.name!);
    if (tok.t === "text" || isInline) { inlineBuf += tok.v; continue; }
    flush();
    if (tok.t === "comment" || tok.t === "doctype") lines.push(pad() + tok.v.trim());
    else if (tok.t === "open") {
      lines.push(pad() + tok.v);
      if (!VOID.has(tok.name!) && !tok.v.endsWith("/>")) depth++;
    } else if (tok.t === "close") {
      depth--;
      lines.push(pad() + tok.v);
    } else if (tok.t === "raw") {
      const prevName = toks[k - 1]?.name;
      if (prevName === "pre" || prevName === "textarea") {
        // keep exactly: attach to previous line
        lines[lines.length - 1] += tok.v;
        const close = toks[k + 1];
        if (close?.t === "close") { lines[lines.length - 1] += close.v; depth--; k++; }
      } else {
        const body = tok.v.replace(/^\n+|\s+$/g, "");
        const rows = body.split("\n");
        const minIndent = Math.min(...rows.filter((r) => r.trim()).map((r) => r.match(/^\s*/)![0].length));
        for (const r of rows) if (r.trim()) lines.push(pad() + r.slice(Number.isFinite(minIndent) ? minIndent : 0));
      }
    }
  }
  flush();
  return lines.join("\n");
}

export function minifyHtml(html: string): string {
  const toks = tokenizeHtml(html.replace(/\r\n?/g, "\n"));
  let out = "";
  for (let k = 0; k < toks.length; k++) {
    const tok = toks[k];
    if (tok.t === "comment") continue;
    if (tok.t === "raw") { const p = toks[k - 1]?.name; out += p === "pre" || p === "textarea" ? tok.v : tok.v.trim(); continue; }
    if (tok.t === "text") { out += tok.v.replace(/\s+/g, " "); continue; }
    out += tok.v;
  }
  return out.replace(/>\s+</g, (m) => (/\S/.test(m) ? m : "> <")).replace(/>\s<(\/?(?:div|p|section|ul|ol|li|head|body|html|meta|link|title|header|footer|nav|main|article|table|tr|td|th|tbody|thead|script|style|h[1-6])\b)/gi, "><$1").trim();
}

// ---------- Timestamps ----------
export function detectUnit(ts: number): "s" | "ms" {
  return Math.abs(ts) >= 1e11 ? "ms" : "s";
}
export function timestampToDate(ts: number, unit: "s" | "ms") {
  const ms = unit === "s" ? ts * 1000 : ts;
  const d = new Date(ms);
  if (Number.isNaN(d.getTime())) throw new Error("Timestamp is outside the supported date range.");
  return d;
}
export function relativeTime(d: Date, now = Date.now()) {
  const diff = (d.getTime() - now) / 1000;
  const abs = Math.abs(diff);
  const units: [number, string][] = [[31536000, "year"], [2592000, "month"], [86400, "day"], [3600, "hour"], [60, "minute"], [1, "second"]];
  for (const [s, name] of units) {
    if (abs >= s) {
      const n = Math.floor(abs / s);
      return diff < 0 ? `${n} ${name}${n > 1 ? "s" : ""} ago` : `in ${n} ${name}${n > 1 ? "s" : ""}`;
    }
  }
  return "now";
}

// ---------- Page ranges (PDF) ----------
/** Parse "1-3, 5, 8-" into sorted unique zero-based page indexes. */
export function parsePageRanges(input: string, pageCount: number): number[] {
  const groups = parseRangeGroups(input, pageCount);
  return [...new Set(groups.flat())].sort((a, b) => a - b);
}
/** Parse ranges preserving each group, e.g. "1-3, 4-6" -> [[0,1,2],[3,4,5]]. */
export function parseRangeGroups(input: string, pageCount: number): number[][] {
  const parts = input.split(",").map((p) => p.trim()).filter(Boolean);
  if (!parts.length) throw new Error("Enter at least one page or range, for example 1-3, 5.");
  return parts.map((p) => {
    const m = p.match(/^(\d+)?\s*(-)?\s*(\d+)?$/);
    if (!m || (!m[1] && !m[3])) throw new Error(`"${p}" is not a valid page or range.`);
    const start = m[1] ? Number(m[1]) : 1;
    const end = m[2] ? (m[3] ? Number(m[3]) : pageCount) : start;
    if (start < 1 || end < 1) throw new Error("Page numbers start at 1.");
    if (start > pageCount || end > pageCount) throw new Error(`Page ${Math.max(start, end)} does not exist; this PDF has ${pageCount} pages.`);
    if (start > end) throw new Error(`Range "${p}" is backwards. Write the smaller page first.`);
    const out: number[] = [];
    for (let i = start; i <= end; i++) out.push(i - 1);
    return out;
  });
}

// ---------- MD5 (Web Crypto does not provide MD5) ----------
export function md5(bytes: Uint8Array): string {
  const K = new Int32Array(64);
  for (let i = 0; i < 64; i++) K[i] = Math.floor(Math.abs(Math.sin(i + 1)) * 2 ** 32) | 0;
  const S = [7, 12, 17, 22, 5, 9, 14, 20, 4, 11, 16, 23, 6, 10, 15, 21];
  const len = bytes.length;
  const padLen = ((len + 8) >>> 6) * 64 + 64;
  const buf = new Uint8Array(padLen);
  buf.set(bytes);
  buf[len] = 0x80;
  const dv = new DataView(buf.buffer);
  dv.setUint32(padLen - 8, (len * 8) >>> 0, true);
  dv.setUint32(padLen - 4, Math.floor(len / 0x20000000), true);
  let a0 = 0x67452301, b0 = 0xefcdab89 | 0, c0 = 0x98badcfe | 0, d0 = 0x10325476;
  const M = new Int32Array(16);
  for (let off = 0; off < padLen; off += 64) {
    for (let i = 0; i < 16; i++) M[i] = dv.getInt32(off + i * 4, true);
    let A = a0, B = b0, C = c0, D = d0;
    for (let i = 0; i < 64; i++) {
      let F: number, g: number;
      const r = i >> 4;
      if (r === 0) { F = (B & C) | (~B & D); g = i; }
      else if (r === 1) { F = (D & B) | (~D & C); g = (5 * i + 1) & 15; }
      else if (r === 2) { F = B ^ C ^ D; g = (3 * i + 5) & 15; }
      else { F = C ^ (B | ~D); g = (7 * i) & 15; }
      const s = S[(r << 2) | (i & 3)];
      const tmp = D;
      D = C;
      C = B;
      const x = (A + F + K[i] + M[g]) | 0;
      B = (B + ((x << s) | (x >>> (32 - s)))) | 0;
      A = tmp;
    }
    a0 = (a0 + A) | 0; b0 = (b0 + B) | 0; c0 = (c0 + C) | 0; d0 = (d0 + D) | 0;
  }
  const out = new DataView(new ArrayBuffer(16));
  [a0, b0, c0, d0].forEach((v, i) => out.setInt32(i * 4, v, true));
  return [...new Uint8Array(out.buffer)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

export function toHex(buf: ArrayBuffer) {
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}
