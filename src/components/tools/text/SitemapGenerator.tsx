"use client";

import { useMemo, useState } from "react";
import { Alert, Checkbox, CopyButton, DownloadTextButton, Input, Panel, Select, Stat, TextArea, Toolbar, ResetButton } from "@/components/ui";
import { buildSitemap, parseUrlList } from "@/lib/calc/text";
import type { ToolProps } from "../ToolRenderer";

const MAX_URLS = 50000;

export default function SitemapGenerator({ slug }: ToolProps) {
  const [list, setList] = useState("https://www.example.com/\nhttps://www.example.com/about/\nhttps://www.example.com/blog/first-post/");
  const [useLastmod, setUseLastmod] = useState(false);
  const [lastmod, setLastmod] = useState("");
  const [freq, setFreq] = useState("");

  const { valid, invalid } = useMemo(() => parseUrlList(list), [list]);
  const hosts = new Set(valid.map((u) => new URL(u).host));
  const capped = valid.slice(0, MAX_URLS);
  const xml = useMemo(
    () => (capped.length ? buildSitemap(capped.map((loc) => ({ loc, lastmod: useLastmod && lastmod ? lastmod : undefined, changefreq: freq || undefined }))) : ""),
    [capped.join("\n"), useLastmod, lastmod, freq], // eslint-disable-line react-hooks/exhaustive-deps
  );

  return (
    <div className="space-y-4">
      <Panel>
        <div className="space-y-4">
          <TextArea label="Page URLs (one per line)" value={list} onChange={(e) => setList(e.target.value)} className="min-h-56" placeholder="https://www.example.com/page/" />
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Checkbox label="Add a last-modified date" checked={useLastmod} onChange={setUseLastmod} hint="Only use a date when the content really changed then." />
              {useLastmod && <Input aria-label="Last modified date" type="date" value={lastmod} onChange={(e) => setLastmod(e.target.value)} />}
            </div>
            <Select label="Change frequency (optional)" value={freq} onChange={(e) => setFreq(e.target.value)} hint="Google ignores changefreq and priority.">
              <option value="">Don't include</option>
              {["always", "hourly", "daily", "weekly", "monthly", "yearly", "never"].map((f) => <option key={f} value={f}>{f}</option>)}
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3" aria-live="polite">
            <Stat label="Valid URLs" value={valid.length} highlight />
            <Stat label="Invalid lines" value={invalid.length} />
            <Stat label="Domains" value={hosts.size} />
          </div>
          {invalid.length > 0 && <Alert kind="warn" title="Skipped lines">Each line must be a full http(s) URL. Skipped: {invalid.slice(0, 5).join(" · ")}{invalid.length > 5 ? ` and ${invalid.length - 5} more` : ""}</Alert>}
          {hosts.size > 1 && <Alert kind="warn">Your list contains more than one domain. A sitemap should normally list URLs from a single host only.</Alert>}
          {valid.length > MAX_URLS && <Alert kind="warn">A sitemap may contain at most 50,000 URLs. Only the first 50,000 are included; split the rest into another sitemap.</Alert>}
          <Toolbar><ResetButton onClick={() => setList("")} /></Toolbar>
        </div>
      </Panel>
      {xml && (
        <Panel title="sitemap.xml">
          <div className="space-y-3">
            <TextArea aria-label="Generated sitemap" value={xml} readOnly className="min-h-64" />
            <Toolbar>
              <CopyButton text={xml} tool={slug} />
              <DownloadTextButton text={xml} filename="sitemap.xml" mime="application/xml" tool={slug} />
            </Toolbar>
            <p className="text-xs text-muted">Upload to your site root, reference it in robots.txt, and submit it in Google Search Console under Indexing → Sitemaps.</p>
          </div>
        </Panel>
      )}
    </div>
  );
}
