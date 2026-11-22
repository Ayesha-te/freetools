"use client";

import { useMemo, useState } from "react";
import { Alert, Button, Checkbox, CopyButton, DownloadTextButton, Panel, Select, Stat, TextArea, Toolbar, ResetButton } from "@/components/ui";
import { jsonHint, jsonStats, parseJson, sortKeysDeep } from "@/lib/calc/dev";
import { track } from "@/lib/analytics";
import type { ToolProps } from "../ToolRenderer";

const SAMPLE = `{"name":"ToolSprint","version":2,"tags":["json","formatter"],"settings":{"indent":2,"sortKeys":false},"active":true,"owner":null}`;
const MAX = 10 * 1024 * 1024;

export default function JsonTool({ slug }: ToolProps) {
  const validator = slug === "json-validator";
  const [input, setInput] = useState("");
  const [indent, setIndent] = useState("2");
  const [sort, setSort] = useState(false);
  const [output, setOutput] = useState("");

  const parsed = useMemo(() => (input.trim() ? parseJson(input) : null), [input]);
  const tooBig = input.length > MAX;

  function format(minify = false) {
    if (!parsed || !parsed.ok) return;
    const v = sort ? sortKeysDeep(parsed.value) : parsed.value;
    const ind = indent === "tab" ? "\t" : Number(indent);
    setOutput(minify ? JSON.stringify(v) : JSON.stringify(v, null, ind));
    track("tool_complete", { tool: slug });
  }

  const errLine = parsed && !parsed.ok ? input.split("\n")[parsed.error.line - 1] ?? "" : "";

  return (
    <div className="space-y-4">
      <Panel>
        <div className="space-y-4">
          <TextArea label="JSON input" value={input} onChange={(e) => { setInput(e.target.value); setOutput(""); }} placeholder='Paste JSON here, e.g. {"key": "value"}' className="min-h-64" aria-invalid={!!parsed && !parsed.ok} />
          <div aria-live="polite">
            {tooBig && <Alert kind="warn">Input is over 10 MB; formatting may be slow.</Alert>}
            {parsed && parsed.ok && (
              <Alert kind="success" title="Valid JSON">
                {(() => {
                  const s = jsonStats(parsed.value);
                  return `${s.objects} object${s.objects === 1 ? "" : "s"}, ${s.arrays} array${s.arrays === 1 ? "" : "s"}, ${s.keys} key${s.keys === 1 ? "" : "s"}, max depth ${s.depth}.`;
                })()}
              </Alert>
            )}
            {parsed && !parsed.ok && (
              <Alert kind="error" title={`Invalid JSON — line ${parsed.error.line}, column ${parsed.error.column}`}>
                <p>{parsed.error.message}</p>
                {errLine && (
                  <pre className="mt-2 overflow-x-auto rounded bg-surface p-2 font-mono text-xs text-ink">
                    {errLine.slice(0, 200)}
                    {"\n"}
                    {" ".repeat(Math.max(0, Math.min(parsed.error.column - 1, 200)))}^
                  </pre>
                )}
                {jsonHint(input) && <p className="mt-2">Hint: {jsonHint(input)}</p>}
              </Alert>
            )}
          </div>
          {!validator || (parsed && parsed.ok) ? (
            <div className="flex flex-wrap items-end gap-3">
              <Select label="Indentation" value={indent} onChange={(e) => setIndent(e.target.value)} className="w-40">
                <option value="2">2 spaces</option>
                <option value="4">4 spaces</option>
                <option value="tab">Tabs</option>
              </Select>
              <div className="mb-2"><Checkbox label="Sort keys A–Z" checked={sort} onChange={setSort} /></div>
            </div>
          ) : null}
          <Toolbar>
            {!validator && (
              <>
                <Button onClick={() => format(false)} disabled={!parsed || !parsed.ok}>Format / beautify</Button>
                <Button variant="secondary" onClick={() => format(true)} disabled={!parsed || !parsed.ok}>Minify</Button>
              </>
            )}
            {validator && parsed && parsed.ok && <Button onClick={() => format(false)}>Show formatted</Button>}
            <Button variant="ghost" onClick={() => { setInput(SAMPLE); setOutput(""); }}>Load sample</Button>
            <ResetButton onClick={() => { setInput(""); setOutput(""); }} />
          </Toolbar>
        </div>
      </Panel>
      {output && (
        <Panel title="Output">
          <div className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <Stat label="Input size" value={`${new Blob([input]).size.toLocaleString()} bytes`} />
              <Stat label="Output size" value={`${new Blob([output]).size.toLocaleString()} bytes`} />
            </div>
            <TextArea aria-label="Formatted JSON" value={output} readOnly className="min-h-64" />
            <Toolbar>
              <CopyButton text={output} tool={slug} />
              <DownloadTextButton text={output} filename="formatted.json" mime="application/json" tool={slug} />
            </Toolbar>
          </div>
        </Panel>
      )}
    </div>
  );
}
