"use client";

import { useState } from "react";
import { RefreshCw } from "lucide-react";
import { Alert, Button, Checkbox, CopyButton, DownloadTextButton, NumberField, Panel, TextArea, Toolbar, num } from "@/components/ui";
import { track } from "@/lib/analytics";
import type { ToolProps } from "../ToolRenderer";

function uuid4(): string {
  if (typeof crypto.randomUUID === "function") return crypto.randomUUID();
  const b = crypto.getRandomValues(new Uint8Array(16));
  b[6] = (b[6] & 0x0f) | 0x40;
  b[8] = (b[8] & 0x3f) | 0x80;
  const h = [...b].map((x) => x.toString(16).padStart(2, "0")).join("");
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
}

export default function UuidTool({ slug }: ToolProps) {
  const [count, setCount] = useState("5");
  const [upper, setUpper] = useState(false);
  const [hyphens, setHyphens] = useState(true);
  const [braces, setBraces] = useState(false);
  const [list, setList] = useState<string[]>([]);
  const [err, setErr] = useState("");

  function gen() {
    const n = Math.floor(num(count));
    if (!Number.isFinite(n) || n < 1 || n > 1000) return setErr("Choose between 1 and 1,000 UUIDs.");
    setErr("");
    setList(Array.from({ length: n }, uuid4));
    track("tool_complete", { tool: slug });
  }
  const shown = list.map((u) => {
    let s = hyphens ? u : u.replace(/-/g, "");
    if (upper) s = s.toUpperCase();
    return braces ? `{${s}}` : s;
  });
  const text = shown.join("\n");

  return (
    <Panel>
      <div className="space-y-4">
        <div className="flex flex-wrap items-end gap-4">
          <NumberField label="How many" value={count} onChange={setCount} min={1} max={1000} step={1} className="w-32" />
          <Button onClick={gen}><RefreshCw className="h-4 w-4" aria-hidden /> Generate</Button>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          <Checkbox label="Uppercase" checked={upper} onChange={setUpper} />
          <Checkbox label="Include hyphens" checked={hyphens} onChange={setHyphens} />
          <Checkbox label="Wrap in braces { }" checked={braces} onChange={setBraces} />
        </div>
        {err && <Alert kind="error">{err}</Alert>}
        <TextArea label="UUIDs (version 4)" value={text} readOnly className="min-h-48" placeholder="Click Generate" aria-live="polite" />
        <Toolbar>
          <CopyButton text={text} label={list.length > 1 ? "Copy all" : "Copy"} tool={slug} />
          <DownloadTextButton text={text} filename="uuids.txt" tool={slug} />
        </Toolbar>
      </div>
    </Panel>
  );
}
