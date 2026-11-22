"use client";

import { useState } from "react";
import { Alert, Checkbox, CopyButton, DownloadTextButton, Input, Panel, Select, TextArea, Toolbar, ResetButton, cx } from "@/components/ui";
import { buildMetaTags, type MetaInput } from "@/lib/calc/text";
import type { ToolProps } from "../ToolRenderer";

const empty: MetaInput = { title: "", description: "", url: "", image: "", siteName: "", robotsIndex: true, robotsFollow: true, twitterCard: "summary_large_image", twitterSite: "", type: "website", locale: "en_US" };

function Counter({ n, ideal }: { n: number; ideal: [number, number] }) {
  const ok = n >= ideal[0] && n <= ideal[1];
  return <span className={cx("text-xs", n === 0 ? "text-muted" : ok ? "text-success" : "text-warn")}>{n} chars · suggested {ideal[0]}–{ideal[1]}</span>;
}
const validUrl = (u: string) => { if (!u) return true; try { const x = new URL(u); return x.protocol === "https:" || x.protocol === "http:"; } catch { return false; } };

export default function MetaTagGenerator({ slug }: ToolProps) {
  const [m, setM] = useState<MetaInput>({ ...empty, title: "Handmade Ceramic Mugs | Clay & Co.", description: "Shop small-batch stoneware mugs, glazed by hand in our Bristol studio. Dishwasher safe, made to order and shipped plastic-free.", url: "https://www.example.com/mugs/" });
  const set = <K extends keyof MetaInput>(k: K) => (v: MetaInput[K]) => setM((s) => ({ ...s, [k]: v }));
  const out = buildMetaTags(m);
  const badUrls = [m.url, m.image].filter((u) => !validUrl(u));

  let host = "example.com", path = "";
  try { const u = new URL(m.url); host = u.hostname; path = u.pathname.replace(/\/$/, "").split("/").filter(Boolean).join(" › "); } catch {}

  return (
    <div className="space-y-4">
      <Panel>
        <div className="space-y-4">
          <div>
            <Input label="Page title" value={m.title} onChange={(e) => set("title")(e.target.value)} />
            <Counter n={m.title.length} ideal={[30, 60]} />
          </div>
          <div>
            <TextArea label="Meta description" value={m.description} onChange={(e) => set("description")(e.target.value)} className="min-h-24 font-sans" />
            <Counter n={m.description.length} ideal={[70, 160]} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Canonical URL" value={m.url} onChange={(e) => set("url")(e.target.value)} placeholder="https://www.example.com/page/" />
            <Input label="Social share image URL" value={m.image} onChange={(e) => set("image")(e.target.value)} placeholder="https://www.example.com/og.jpg" hint="Recommended 1200×630 px." />
            <Input label="Site name" value={m.siteName} onChange={(e) => set("siteName")(e.target.value)} />
            <Input label="X / Twitter handle" value={m.twitterSite} onChange={(e) => set("twitterSite")(e.target.value)} placeholder="@yourbrand" />
            <Select label="Content type (og:type)" value={m.type} onChange={(e) => set("type")(e.target.value)}>
              <option value="website">website</option>
              <option value="article">article</option>
              <option value="product">product</option>
              <option value="profile">profile</option>
            </Select>
            <Select label="Twitter card" value={m.twitterCard} onChange={(e) => set("twitterCard")(e.target.value as MetaInput["twitterCard"])}>
              <option value="summary_large_image">Large image</option>
              <option value="summary">Small summary</option>
            </Select>
            <Input label="Locale" value={m.locale} onChange={(e) => set("locale")(e.target.value)} placeholder="en_US" />
          </div>
          <div className="flex flex-wrap gap-6">
            <Checkbox label="Allow indexing" checked={m.robotsIndex} onChange={set("robotsIndex")} />
            <Checkbox label="Allow following links" checked={m.robotsFollow} onChange={set("robotsFollow")} />
          </div>
          {badUrls.length > 0 && <Alert kind="warn">URLs should be absolute and start with https:// (for example https://www.example.com/page/).</Alert>}
          {!m.robotsIndex && <Alert kind="warn">“noindex” asks search engines not to show this page in results.</Alert>}
          <Toolbar><ResetButton onClick={() => setM(empty)} /></Toolbar>
        </div>
      </Panel>
      <Panel title="Search result preview (approximate)">
        <div className="max-w-xl rounded-lg border border-border bg-white p-4 font-[Arial,sans-serif]">
          <p className="truncate text-sm text-[#202124]">{host}{path && <span className="text-[#4d5156]"> › {path}</span>}</p>
          <p className="mt-1 line-clamp-1 text-xl text-[#1a0dab]">{m.title || "Page title"}</p>
          <p className="mt-1 line-clamp-2 text-sm text-[#4d5156]">{m.description || "Your meta description will appear here."}</p>
        </div>
        <p className="mt-2 text-xs text-muted">Search engines may rewrite titles and descriptions; this preview only shows how yours could look.</p>
      </Panel>
      <Panel title="Generated HTML">
        <div className="space-y-3">
          <TextArea aria-label="Generated meta tags" value={out} readOnly className="min-h-72" />
          <Toolbar>
            <CopyButton text={out} tool={slug} />
            <DownloadTextButton text={out} filename="meta-tags.html" mime="text/html" tool={slug} />
          </Toolbar>
          <p className="text-xs text-muted">Paste these inside the &lt;head&gt; of your page. All values are HTML-escaped.</p>
        </div>
      </Panel>
    </div>
  );
}
