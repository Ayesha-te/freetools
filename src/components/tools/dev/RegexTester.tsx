"use client";

import { useEffect, useRef, useState } from "react";
import { Alert, Button, Checkbox, CopyButton, Input, Panel, TextArea, Toolbar, ResetButton } from "@/components/ui";
import type { ToolProps } from "../ToolRenderer";

interface Match { index: number; text: string; groups: (string | undefined)[]; named?: Record<string, string | undefined> }
interface WorkerResult { ok: true; matches: Match[]; replaced: string | null; truncated: boolean }
interface WorkerError { ok: false; error: string }

// Runs inside a Web Worker so catastrophic backtracking cannot freeze the page.
const WORKER_SRC = `
self.onmessage = (e) => {
  const { pattern, flags, text, replacement } = e.data;
  try {
    const re = new RegExp(pattern, flags.includes("g") ? flags : flags + "g");
    const matches = [];
    let m, truncated = false;
    while ((m = re.exec(text)) !== null) {
      matches.push({ index: m.index, text: m[0], groups: m.slice(1), named: m.groups ? { ...m.groups } : undefined });
      if (m[0] === "") re.lastIndex++;
      if (!flags.includes("g")) break;
      if (matches.length >= 5000) { truncated = true; break; }
    }
    let replaced = null;
    if (replacement !== null) replaced = text.replace(new RegExp(pattern, flags), replacement);
    self.postMessage({ ok: true, matches, replaced, truncated });
  } catch (err) {
    self.postMessage({ ok: false, error: String(err && err.message || err) });
  }
};`;

const FLAGS = [
  { f: "g", label: "g — global (all matches)" },
  { f: "i", label: "i — case-insensitive" },
  { f: "m", label: "m — multiline (^ $ per line)" },
  { f: "s", label: "s — dot matches newline" },
  { f: "u", label: "u — Unicode" },
  { f: "y", label: "y — sticky" },
];

export default function RegexTester({ slug }: ToolProps) {
  const [pattern, setPattern] = useState("\\b(\\w+)@(\\w+)\\.com\\b");
  const [flags, setFlags] = useState("gi");
  const [text, setText] = useState("Contact alice@example.com or BOB@test.com for details.\nNot an email: hello@world");
  const [useReplace, setUseReplace] = useState(false);
  const [replacement, setReplacement] = useState("<$1 at $2>");
  const [result, setResult] = useState<WorkerResult | null>(null);
  const [error, setError] = useState("");
  const [running, setRunning] = useState(false);
  const workerUrl = useRef<string>("");

  useEffect(() => {
    workerUrl.current = URL.createObjectURL(new Blob([WORKER_SRC], { type: "text/javascript" }));
    return () => URL.revokeObjectURL(workerUrl.current);
  }, []);

  useEffect(() => {
    if (!workerUrl.current) return;
    if (!pattern) { setResult(null); setError(""); return; }
    if (text.length > 1_000_000) { setError("Test text is limited to 1,000,000 characters."); return; }
    setRunning(true);
    const w = new Worker(workerUrl.current);
    const timer = setTimeout(() => {
      w.terminate();
      setRunning(false);
      setResult(null);
      setError("The pattern took longer than 2 seconds and was stopped. It may cause catastrophic backtracking — try making quantifiers more specific.");
    }, 2000);
    w.onmessage = (e: MessageEvent<WorkerResult | WorkerError>) => {
      clearTimeout(timer);
      w.terminate();
      setRunning(false);
      if (e.data.ok) { setResult(e.data); setError(""); }
      else { setResult(null); setError(e.data.error); }
    };
    const t = setTimeout(() => w.postMessage({ pattern, flags, text, replacement: useReplace ? replacement : null }), 150);
    return () => { clearTimeout(t); clearTimeout(timer); w.terminate(); };
  }, [pattern, flags, text, replacement, useReplace]);

  function toggle(f: string) {
    setFlags((cur) => (cur.includes(f) ? cur.replace(f, "") : cur + f));
  }

  // Build highlighted segments as React nodes (no innerHTML).
  const segments: React.ReactNode[] = [];
  if (result) {
    let last = 0;
    result.matches.forEach((m, i) => {
      if (m.index > last) segments.push(text.slice(last, m.index));
      segments.push(<mark key={i} className="rounded bg-mark px-0.5 text-ink">{m.text || "∅"}</mark>);
      last = m.index + m.text.length;
    });
    segments.push(text.slice(last));
  }

  return (
    <div className="space-y-4">
      <Panel>
        <div className="space-y-4">
          <div className="flex items-end gap-2">
            <span className="mb-2.5 font-mono text-lg text-muted">/</span>
            <Input label="Regular expression" value={pattern} onChange={(e) => setPattern(e.target.value)} className="flex-1 font-mono" spellCheck={false} />
            <span className="mb-2.5 font-mono text-lg text-muted">/{flags}</span>
          </div>
          <fieldset className="flex flex-wrap gap-x-5 gap-y-2">
            <legend className="sr-only">Flags</legend>
            {FLAGS.map((f) => <Checkbox key={f.f} label={f.label} checked={flags.includes(f.f)} onChange={() => toggle(f.f)} />)}
          </fieldset>
          <TextArea label="Test text" value={text} onChange={(e) => setText(e.target.value)} />
          <Checkbox label="Test a replacement ($1, $2, $<name>, $& supported)" checked={useReplace} onChange={setUseReplace} />
          {useReplace && <Input label="Replacement" value={replacement} onChange={(e) => setReplacement(e.target.value)} className="font-mono" />}
          <Toolbar>
            <Button variant="ghost" onClick={() => { setPattern("^(\\d{4})-(\\d{2})-(\\d{2})$"); setFlags("gm"); setText("2026-11-21\n2026-13-01\nnot a date\n1999-01-31"); }}>Load date sample</Button>
            <ResetButton onClick={() => { setPattern(""); setText(""); setFlags("g"); setResult(null); }} />
          </Toolbar>
          {error && <Alert kind="error">{error}</Alert>}
        </div>
      </Panel>
      {result && (
        <Panel title={`${result.matches.length}${result.truncated ? "+" : ""} match${result.matches.length === 1 ? "" : "es"}${running ? " (updating…)" : ""}`}>
          <div className="space-y-4" aria-live="polite">
            <pre className="max-h-80 overflow-auto whitespace-pre-wrap break-words rounded-lg border border-border bg-surface-2 p-3 font-mono text-sm text-ink-2">{segments}</pre>
            {result.matches.length > 0 && (
              <div className="max-h-80 overflow-auto rounded-lg border border-border">
                <table className="w-full text-sm">
                  <thead className="sticky top-0 bg-surface-2 text-left text-muted"><tr><th className="px-3 py-2 font-medium">#</th><th className="px-3 py-2 font-medium">Index</th><th className="px-3 py-2 font-medium">Match</th><th className="px-3 py-2 font-medium">Groups</th></tr></thead>
                  <tbody>
                    {result.matches.slice(0, 500).map((m, i) => (
                      <tr key={i} className="border-t border-border align-top">
                        <td className="px-3 py-2 text-muted">{i + 1}</td>
                        <td className="px-3 py-2 tabular-nums">{m.index}</td>
                        <td className="break-all px-3 py-2 font-mono text-ink">{m.text}</td>
                        <td className="break-all px-3 py-2 font-mono text-ink-2">
                          {m.groups.map((g, k) => <div key={k}>${k + 1}: {g ?? <em className="text-muted">undefined</em>}</div>)}
                          {m.named && Object.entries(m.named).map(([k, v]) => <div key={k}>{k}: {v ?? "—"}</div>)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {result.replaced !== null && (
              <div className="space-y-2">
                <TextArea label="Replacement result" value={result.replaced} readOnly />
                <CopyButton text={result.replaced} tool={slug} />
              </div>
            )}
          </div>
        </Panel>
      )}
    </div>
  );
}
