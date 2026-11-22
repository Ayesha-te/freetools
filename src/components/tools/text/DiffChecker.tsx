"use client";

import { useState } from "react";
import { Alert, Button, Checkbox, Panel, Segmented, Stat, TextArea, Toolbar, ResetButton, cx } from "@/components/ui";
import { diffTokens, type DiffOp } from "@/lib/calc/text";
import { track } from "@/lib/analytics";
import type { ToolProps } from "../ToolRenderer";

export default function DiffChecker({ slug }: ToolProps) {
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [mode, setMode] = useState<"line" | "word">("line");
  const [ignoreCase, setIgnoreCase] = useState(false);
  const [ignoreWs, setIgnoreWs] = useState(false);
  const [ops, setOps] = useState<DiffOp[] | null>(null);
  const [err, setErr] = useState("");

  function compare() {
    setErr("");
    const split = (s: string) => (mode === "line" ? s.replace(/\r\n?/g, "\n").split("\n") : s.split(/(\s+)/).filter((x) => x !== ""));
    const norm = (s: string) => {
      let t = s;
      if (ignoreWs) t = t.replace(/\s+/g, " ").trim();
      if (ignoreCase) t = t.toLowerCase();
      return t;
    };
    try {
      setOps(diffTokens(split(a), split(b), norm));
      track("tool_complete", { tool: slug });
    } catch (e) {
      setErr((e as Error).message);
      setOps(null);
    }
  }

  const added = ops?.filter((o) => o.type === "add" && o.value.trim()).length ?? 0;
  const removed = ops?.filter((o) => o.type === "remove" && o.value.trim()).length ?? 0;
  const unit = mode === "line" ? "lines" : "words";

  return (
    <div className="space-y-4">
      <Panel>
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <TextArea label="Original text" value={a} onChange={(e) => setA(e.target.value)} className="min-h-56" placeholder="Paste the original version…" />
            <TextArea label="Changed text" value={b} onChange={(e) => setB(e.target.value)} className="min-h-56" placeholder="Paste the new version…" />
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <Segmented label="Compare by" value={mode} onChange={setMode} options={[{ value: "line", label: "Lines" }, { value: "word", label: "Words" }]} />
            <Checkbox label="Ignore case" checked={ignoreCase} onChange={setIgnoreCase} />
            <Checkbox label="Ignore whitespace differences" checked={ignoreWs} onChange={setIgnoreWs} />
          </div>
          <Toolbar>
            <Button onClick={compare} disabled={!a && !b}>Compare</Button>
            <Button variant="ghost" onClick={() => { setA("The quick brown fox\njumps over the lazy dog.\nThe end."); setB("The quick red fox\njumps over the lazy dog.\nA new line.\nThe end."); }}>Load sample</Button>
            <ResetButton onClick={() => { setA(""); setB(""); setOps(null); }} />
          </Toolbar>
          {err && <Alert kind="error">{err}</Alert>}
        </div>
      </Panel>
      {ops && (
        <Panel title="Differences">
          <div className="space-y-4" aria-live="polite">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <Stat label={`Added ${unit}`} value={added} />
              <Stat label={`Removed ${unit}`} value={removed} />
              <Stat label="Status" value={added + removed === 0 ? "Identical" : "Different"} highlight />
            </div>
            <div className="max-h-[32rem] overflow-auto rounded-lg border border-border bg-surface font-mono text-sm">
              {mode === "line" ? (
                <table className="w-full border-collapse">
                  <tbody>
                    {ops.map((o, i) => (
                      <tr key={i} className={cx(o.type === "add" && "bg-add", o.type === "remove" && "bg-del")}>
                        <td className="w-8 select-none px-2 text-center text-muted" aria-label={o.type === "add" ? "added" : o.type === "remove" ? "removed" : "unchanged"}>{o.type === "add" ? "+" : o.type === "remove" ? "−" : " "}</td>
                        <td className="whitespace-pre-wrap break-all px-2 py-0.5 text-ink">{o.value || " "}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="whitespace-pre-wrap break-words p-3 leading-relaxed text-ink">
                  {ops.map((o, i) =>
                    o.type === "equal" ? <span key={i}>{o.value}</span> : o.type === "add" ? <ins key={i} className="rounded bg-add no-underline">{o.value}</ins> : <del key={i} className="rounded bg-del">{o.value}</del>,
                  )}
                </p>
              )}
            </div>
            <p className="text-xs text-muted"><span className="rounded bg-add px-1">green / +</span> added in the changed text · <span className="rounded bg-del px-1">red / −</span> removed from the original.</p>
          </div>
        </Panel>
      )}
    </div>
  );
}
