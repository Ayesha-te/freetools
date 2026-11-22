"use client";

import { useState } from "react";
import { Alert, Button, CopyButton, DownloadTextButton, Panel, Select, TextArea, Toolbar, ResetButton } from "@/components/ui";
import { formatHtml, minifyHtml } from "@/lib/calc/dev";
import { track } from "@/lib/analytics";
import type { ToolProps } from "../ToolRenderer";

const SAMPLE = `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><title>Sample</title><style>body{font-family:sans-serif}</style></head><body><header><nav><ul><li><a href="/">Home</a></li><li><a href="/about">About</a></li></ul></nav></header><main><h1>Hello <em>world</em></h1><p>This is a <strong>sample</strong> page.</p><img src="photo.jpg" alt="Photo"><pre>  preformatted
  text stays</pre></main><script>console.log("hi")</script></body></html>`;

export default function HtmlFormatter({ slug }: ToolProps) {
  const [input, setInput] = useState("");
  const [indent, setIndent] = useState("2");
  const [out, setOut] = useState("");
  const [err, setErr] = useState("");

  function run(min: boolean) {
    setErr("");
    if (input.length > 5_000_000) return setErr("Input is larger than 5 MB.");
    try {
      setOut(min ? minifyHtml(input) : formatHtml(input, indent === "tab" ? "\t" : " ".repeat(Number(indent))));
      track("tool_complete", { tool: slug });
    } catch {
      setErr("The HTML could not be processed.");
    }
  }

  return (
    <div className="space-y-4">
      <Panel>
        <div className="space-y-4">
          <TextArea label="HTML input" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Paste HTML here…" className="min-h-64" />
          <div className="flex flex-wrap items-end gap-3">
            <Select label="Indentation" value={indent} onChange={(e) => setIndent(e.target.value)} className="w-40">
              <option value="2">2 spaces</option>
              <option value="4">4 spaces</option>
              <option value="tab">Tabs</option>
            </Select>
          </div>
          <Toolbar>
            <Button onClick={() => run(false)} disabled={!input.trim()}>Format HTML</Button>
            <Button variant="secondary" onClick={() => run(true)} disabled={!input.trim()}>Minify</Button>
            <Button variant="ghost" onClick={() => setInput(SAMPLE)}>Load sample</Button>
            <ResetButton onClick={() => { setInput(""); setOut(""); }} />
          </Toolbar>
          {err && <Alert kind="error">{err}</Alert>}
          <p className="text-xs text-muted">The formatter only re-indents markup; it never runs scripts or renders the HTML. Contents of &lt;pre&gt; and &lt;textarea&gt; are preserved exactly.</p>
        </div>
      </Panel>
      {out && (
        <Panel title="Result">
          <div className="space-y-3">
            <TextArea aria-label="Formatted HTML" value={out} readOnly className="min-h-64" />
            <Toolbar>
              <CopyButton text={out} tool={slug} />
              <DownloadTextButton text={out} filename="formatted.html" mime="text/html" tool={slug} />
            </Toolbar>
          </div>
        </Panel>
      )}
    </div>
  );
}
