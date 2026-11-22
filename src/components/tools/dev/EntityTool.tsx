"use client";

import { useMemo, useState } from "react";
import { Button, Checkbox, CopyButton, Panel, Segmented, Select, TextArea, Toolbar, ResetButton } from "@/components/ui";
import { decodeEntities, encodeEntities } from "@/lib/calc/dev";
import type { ToolProps } from "../ToolRenderer";

export default function EntityTool({ slug }: ToolProps) {
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [input, setInput] = useState("");
  const [nonAscii, setNonAscii] = useState<"named" | "numeric" | "keep">("keep");
  const [quotes, setQuotes] = useState(true);
  const out = useMemo(() => (mode === "encode" ? encodeEntities(input, { nonAscii, quotes }) : decodeEntities(input)), [input, mode, nonAscii, quotes]);

  return (
    <Panel>
      <div className="space-y-4">
        <Segmented label="Mode" value={mode} onChange={(m) => { setMode(m); setInput(out); }} options={[{ value: "encode", label: "Encode" }, { value: "decode", label: "Decode" }]} />
        {mode === "encode" && (
          <div className="flex flex-wrap items-end gap-4">
            <Select label="Non-ASCII characters (é, ©, €, emoji)" value={nonAscii} onChange={(e) => setNonAscii(e.target.value as typeof nonAscii)} className="w-72">
              <option value="keep">Keep as-is (recommended for UTF-8 pages)</option>
              <option value="named">Named entities where available</option>
              <option value="numeric">Numeric entities (&amp;#233;)</option>
            </Select>
            <div className="mb-2"><Checkbox label="Escape quotes (for attributes)" checked={quotes} onChange={setQuotes} /></div>
          </div>
        )}
        <TextArea label="Input" value={input} onChange={(e) => setInput(e.target.value)} placeholder={mode === "encode" ? '<p class="note">Fish & chips © 2026</p>' : "&lt;p&gt;Fish &amp; chips &copy; 2026&lt;/p&gt;"} />
        <TextArea label="Result" value={out} readOnly aria-live="polite" />
        <Toolbar>
          <CopyButton text={out} tool={slug} />
          <Button variant="ghost" onClick={() => setInput(mode === "encode" ? '<a href="/?a=1&b=2">Café “menu” — 5€</a>' : "&lt;b&gt;Caf&eacute; &#8212; 5&#x20AC;&lt;/b&gt;")}>Load sample</Button>
          <ResetButton onClick={() => setInput("")} />
        </Toolbar>
        <p className="text-xs text-muted">Decoded output is shown as plain text and never rendered as HTML, so pasted markup cannot run on this page.</p>
      </div>
    </Panel>
  );
}
