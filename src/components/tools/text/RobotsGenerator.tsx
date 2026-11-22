"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Alert, Button, CopyButton, DownloadTextButton, Input, NumberField, Panel, TextArea, Toolbar, ResetButton, num } from "@/components/ui";
import { buildRobots } from "@/lib/calc/text";
import type { ToolProps } from "../ToolRenderer";

interface Group { id: number; ua: string; allow: string; disallow: string; delay: string }
let id = 1;
const g = (ua = "*", disallow = "", allow = ""): Group => ({ id: id++, ua, allow, disallow, delay: "" });
const lines = (s: string) => s.split(/\r?\n/).map((x) => x.trim()).filter(Boolean);

export default function RobotsGenerator({ slug }: ToolProps) {
  const [groups, setGroups] = useState<Group[]>(() => [g("*", "/admin/\n/cart/\n/search")]);
  const [sitemaps, setSitemaps] = useState("https://www.example.com/sitemap.xml");
  const upd = (i: number, k: keyof Group, v: string) => setGroups((gs) => gs.map((x) => (x.id === i ? { ...x, [k]: v } : x)));

  const out = buildRobots(groups.map((x) => ({ userAgent: x.ua, allow: lines(x.allow), disallow: lines(x.disallow), crawlDelay: num(x.delay) || undefined })), lines(sitemaps));
  const badPaths = groups.flatMap((x) => [...lines(x.allow), ...lines(x.disallow)]).filter((p) => !p.startsWith("/") && !p.startsWith("*"));
  const badMaps = lines(sitemaps).filter((s) => !/^https?:\/\//.test(s));
  const blocksAll = groups.some((x) => x.ua.trim() === "*" && lines(x.disallow).includes("/"));

  return (
    <div className="space-y-4">
      <Panel>
        <div className="space-y-4">
          {groups.map((x, i) => (
            <fieldset key={x.id} className="space-y-3 rounded-lg border border-border p-4">
              <legend className="px-1 text-sm font-semibold text-ink">Rule group {i + 1}</legend>
              <div className="flex flex-wrap items-end gap-3">
                <Input label="User-agent" value={x.ua} onChange={(e) => upd(x.id, "ua", e.target.value)} className="w-56" hint="* = all crawlers, or e.g. Googlebot" />
                <NumberField label="Crawl-delay (optional)" value={x.delay} onChange={(v) => upd(x.id, "delay", v)} suffix="s" className="w-40" hint="Ignored by Google." />
                {groups.length > 1 && (
                  <Button variant="danger" onClick={() => setGroups((gs) => gs.filter((y) => y.id !== x.id))}><Trash2 className="h-4 w-4" aria-hidden /> Remove</Button>
                )}
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <TextArea label="Disallow (one path per line)" value={x.disallow} onChange={(e) => upd(x.id, "disallow", e.target.value)} className="min-h-28" placeholder="/private/" />
                <TextArea label="Allow (one path per line)" value={x.allow} onChange={(e) => upd(x.id, "allow", e.target.value)} className="min-h-28" placeholder="/private/public-file.html" />
              </div>
            </fieldset>
          ))}
          <Toolbar>
            <Button variant="secondary" onClick={() => setGroups((gs) => [...gs, g("Googlebot")])}><Plus className="h-4 w-4" aria-hidden /> Add user-agent group</Button>
            <ResetButton onClick={() => { setGroups([g()]); setSitemaps(""); }} />
          </Toolbar>
          <TextArea label="Sitemap URLs (one per line)" value={sitemaps} onChange={(e) => setSitemaps(e.target.value)} className="min-h-20" />
          {badPaths.length > 0 && <Alert kind="warn">Paths should start with “/” (found: {badPaths.slice(0, 3).join(", ")}).</Alert>}
          {badMaps.length > 0 && <Alert kind="warn">Sitemap lines must be full URLs starting with https://.</Alert>}
          {blocksAll && <Alert kind="error" title="Whole site blocked">“Disallow: /” for all user-agents stops search engines crawling your entire site.</Alert>}
        </div>
      </Panel>
      <Panel title="robots.txt">
        <div className="space-y-3">
          <TextArea aria-label="Generated robots.txt" value={out} readOnly className="min-h-48" />
          <Toolbar>
            <CopyButton text={out} tool={slug} />
            <DownloadTextButton text={out} filename="robots.txt" tool={slug} />
          </Toolbar>
          <p className="text-xs text-muted">Upload the file to the root of your domain so it is reachable at https://yourdomain.com/robots.txt. robots.txt controls crawling, not indexing, and is publicly visible — never use it to hide private pages.</p>
        </div>
      </Panel>
    </div>
  );
}
