"use client";

import { useMemo, useState } from "react";
import { Checkbox, CopyButton, Input, NumberField, Panel, Select, TextArea, Toolbar, ResetButton, num } from "@/components/ui";
import { slugify } from "@/lib/calc/text";
import type { ToolProps } from "../ToolRenderer";

export default function SlugGenerator({ slug }: ToolProps) {
  const [title, setTitle] = useState("10 Easy Ways to Reduce Image File Size (Without Losing Quality!)");
  const [sep, setSep] = useState<"-" | "_">("-");
  const [lower, setLower] = useState(true);
  const [stop, setStop] = useState(false);
  const [max, setMax] = useState("");
  const [bulk, setBulk] = useState("");
  const opts = { separator: sep, lowercase: lower, removeStopWords: stop, maxLength: num(max) > 0 ? num(max) : undefined };
  const out = slugify(title, opts);
  const bulkOut = useMemo(() => bulk.split(/\r?\n/).filter((l) => l.trim()).map((l) => slugify(l, opts)).join("\n"), [bulk, sep, lower, stop, max]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="space-y-4">
      <Panel>
        <div className="space-y-4">
          <Input label="Title or phrase" value={title} onChange={(e) => setTitle(e.target.value)} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Select label="Separator" value={sep} onChange={(e) => setSep(e.target.value as "-" | "_")}>
              <option value="-">Hyphen (recommended)</option>
              <option value="_">Underscore</option>
            </Select>
            <NumberField label="Maximum length (optional)" value={max} onChange={setMax} placeholder="No limit" hint="Cuts at a word boundary." />
          </div>
          <div className="flex flex-wrap gap-6">
            <Checkbox label="Lowercase" checked={lower} onChange={setLower} />
            <Checkbox label="Remove stop words (a, the, of…)" checked={stop} onChange={setStop} />
          </div>
          <div className="rounded-lg border border-primary/30 bg-primary-soft p-4" aria-live="polite">
            <p className="text-xs font-medium uppercase tracking-wide text-muted">Slug</p>
            <code className="mt-1 block break-all font-mono text-lg text-primary-ink">{out || "—"}</code>
            <p className="mt-1 break-all text-xs text-muted">Example: https://www.example.com/blog/{out}</p>
          </div>
          <Toolbar>
            <CopyButton text={out} tool={slug} />
            <ResetButton onClick={() => setTitle("")} />
          </Toolbar>
        </div>
      </Panel>
      <Panel title="Bulk convert (one title per line)">
        <div className="grid gap-4 md:grid-cols-2">
          <TextArea aria-label="Titles, one per line" value={bulk} onChange={(e) => setBulk(e.target.value)} placeholder={"First post title\nSecond post title"} className="font-sans" />
          <TextArea aria-label="Slugs" value={bulkOut} readOnly />
        </div>
        <div className="mt-3"><CopyButton text={bulkOut} label="Copy slugs" tool={slug} /></div>
      </Panel>
    </div>
  );
}
